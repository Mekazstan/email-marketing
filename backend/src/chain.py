import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnableBranch

load_dotenv()
GROQ_API_KEY= os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model="llama3-8b-8192",
    temperature=0.5,
    max_tokens=None,
    timeout=None,
    max_retries=2
)

tech_template = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an AI assistant crafting cold emails for an insurance company. Emphasize on innovation and risk management for tech companies. Address engagement level and potential objections."),
        ("human", """
            Write a cold email for a tech company about our insurance solutions:
            - Company Name: {company_name}
            - Engagement Level: {engagement_level}
            - Potential Objections: {objections}
            """
        )
    ]
)

finance_template = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an AI assistant crafting cold emails for an insurance company. Emphasize on security, ROI, and financial risk mitigation for finance companies. Address engagement level and potential objections."),
        ("human", """
            Write a cold email for a finance company about our insurance solutions:
            - Company Name: {company_name}
            - Engagement Level: {engagement_level}
            - Potential Objections: {objections}
            """
        )
    ]
)

healthcare_template = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an AI assistant crafting cold emails for an insurance company. Emphasize on compliance, efficiency, and patient safety for healthcare companies. Address engagement level and potential objections."),
        ("human", """
            Write a cold email for a healthcare company about our insurance solutions:
            - Company Name: {company_name}
            - Engagement Level: {engagement_level}
            - Potential Objections: {objections}
            """
        )
    ]
)


follow_up_template = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an AI assistant providing advice on how to further engage a client based on their engagement level and objections."),
        ("human", """
            Provide advice on how to further engage this client:
            - Engagement Level: {engagement_level}
            - Potential Objections: {objections}
            """
        )
    ]
)


branches = RunnableBranch(
    {
        lambda x: x["industry"] == "tech",
        tech_template | llm | StrOutputParser()
    },
    {
        lambda x: x["industry"] == "finance",
        finance_template | llm | StrOutputParser()
    },
    {
        lambda x: x["industry"] == "healthcare",
        healthcare_template | llm | StrOutputParser()
    },
    # Default template for unspecified industries
    ChatPromptTemplate.from_messages(
        [
            ("system", "You are an AI assistant crafting cold emails for an insurance company. Write a generic cold email."),
            ("human", """
                Write a cold email for {company_name} about our insurance solutions:
                - Engagement Level: {engagement_level}
                - Potential Objections: {objections}
                """
            )
        ]
    ) | llm | StrOutputParser()
)

classification_template = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an AI assistant classifying industries for cold email personalization."),
        ("human", "Classify the industry for {company_name}: {industry}")
    ]
)

classification_chain = classification_template | llm | StrOutputParser()

# Main chain for generating the email
email_chain = classification_chain | branches

# Follow-up advice chain
follow_up_chain = follow_up_template | llm | StrOutputParser()

# Combined chain
def full_workflow(input_data):
    email = email_chain.invoke(input_data)
    follow_up = follow_up_chain.invoke(input_data)
    return {"email": email, "follow_up_advice": follow_up}


prospect = {
    "company_name": "TechCorp",
    "industry": "tech",
    "engagement_level": "medium",
    "objections": ["cost", "relevance"]
}

result = full_workflow(prospect)
print("Email:\n", result["email"])
print("\nFollow-Up Advice:\n", result["follow_up_advice"])

