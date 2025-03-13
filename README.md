# AI Outreach - Personalized Insurance Sales Platform

AI Outreach is a personalized sales outreach platform designed specifically for insurance companies. It uses AI to generate highly personalized emails and call scripts based on each prospect's industry, engagement history, and likely objections.

## Features

- **AI-Powered Personalization**: Generate industry-specific emails and call scripts
- **Prospect Management**: Add, edit, and import prospects
- **Engagement Tracking**: Track email opens, clicks, and responses
- **Branching Logic**: Different content paths based on prospect attributes
- **Dashboard**: Track performance and engagement metrics

## Architecture

![Component Architecture Diagram](https://your-repo-url/architecture.png)

### Branching Logic Pipeline

Our system uses sophisticated branching logic to create personalized content:

1. **Input**: Prospect data (company, industry)
2. **Check Engagement History**: Analyze previous interactions
3. **Industry Classification**: Identify industry-specific concerns
4. **Industry-Specific Branches**:
   - Tech: Emphasize innovation and digital protection
   - Finance: Focus on security & ROI
   - Healthcare: Address compliance & efficiency
   - And more industry-specific paths
5. **Generate Personalized Content**: Create tailored messaging
6. **Send Email/Make Call**: Deliver the personalized content
7. **Record Engagement**: Track interactions for future refinement
8. **Output**: Personalized email/call script & engagement advice

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL
- **AI**: OpenAI GPT models
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- OpenAI API key
- Email service API key (SendGrid, Mailgun, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-outreach.git
   cd ai-outreach
   ```

2. Create a `.env` file with your API keys:
   ```
   OPENAI_API_KEY=your-openai-api-key
   EMAIL_SERVICE_API_KEY=your-email-service-api-key
   ```

3. Build and start the application:
   ```bash
   ./deploy.sh
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development

To run the application in development mode:

1. Start the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Documentation

When the backend is running, you can access the interactive API documentation at:
http://localhost:8000/docs

## Folder Structure

```
ai_outreach/
├── backend/                 # FastAPI backend
│   ├── app/                 # Application code
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── routers/         # API routes
│   │   └── utils/           # Utilities
│   ├── tests/               # Unit tests
│   └── requirements.txt     # Dependencies
├── frontend/                # Next.js frontend
│   ├── src/                 # Source code
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── public/              # Static files
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json         # Dependencies
├── docker-compose.yml       # Container orchestration
└── .env                     # Environment variables
```

## License

[MIT License](LICENSE)

## Acknowledgements

- OpenAI for GPT models
- Next.js team for the React framework
- FastAPI team for the Python API framework
  