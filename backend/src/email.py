import os
import smtplib
from email.mime.text import MIMEText


# Email Sending Function
def send_email(subject, body, to_email):
    from_email = os.getenv("SMTP_FROM_EMAIL")
    password = os.getenv("SMTP_PASSWORD")

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email

    with smtplib.SMTP("smtp.example.com", 587) as server:
        server.starttls()
        server.login(from_email, password)
        server.sendmail(from_email, to_email, msg.as_string())
