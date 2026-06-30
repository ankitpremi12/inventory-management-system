import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .config import settings

def send_reset_email(to_email: str, reset_token: str):
    if not settings.SMTP_SERVER or not settings.SMTP_USERNAME:
        print(f"WARNING: SMTP not configured. Would have sent reset token {reset_token} to {to_email}")
        return False
        
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}" # Frontend URL
    
    msg = MIMEMultipart()
    msg['From'] = settings.SMTP_FROM_EMAIL
    msg['To'] = to_email
    msg['Subject'] = "Password Reset Request"
    
    body = f"""
    Hello,
    
    You requested a password reset for your Inventory Management System account.
    Please click the link below to reset your password:
    
    {reset_link}
    
    If you did not request this, please ignore this email.
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
