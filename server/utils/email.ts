import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Verify API key is working
async function verifyApiKey() {
  try {
    const response = await sgMail.send({
      to: 'test@example.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
      subject: 'API Key Verification',
      text: 'This is a test email to verify the SendGrid API key.',
    });
    console.log('SendGrid API key verified successfully');
    return true;
  } catch (error: any) {
    console.error('SendGrid API key verification failed:', {
      code: error.code,
      message: error.message,
      response: error.response?.body,
    });
    return false;
  }
}

// Only verify API key if it's present
if (process.env.SENDGRID_API_KEY) {
  verifyApiKey().catch(error => {
    console.warn('SendGrid API key verification failed, email sending will be disabled:', error.message);
  });
} else {
  console.warn('SendGrid API key not found, email sending will be disabled');
}

export async function sendTalentRegistrationEmail(talentData: {
  fullName: string;
  email: string;
}) {
  try {
    const msg = {
      to: talentData.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
      subject: 'Welcome to Urswat - Registration Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Welcome to Urswat!</h1>
          <p>Dear ${talentData.fullName},</p>
          <p>Thank you for registering with Urswat. We're excited to have you join our talent pool!</p>
          <p>Our team will review your profile and CV, and we'll be in touch with relevant opportunities that match your skills and experience.</p>
          <p>In the meantime, if you have any questions, feel free to reach out to us.</p>
          <div style="margin-top: 30px;">
            <p>Best regards,</p>
            <p>The Urswat Team</p>
          </div>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log('Registration email sent successfully:', {
      to: talentData.email,
      messageId: response[0]?.headers['x-message-id'],
      statusCode: response[0]?.statusCode,
    });
  } catch (error: any) {
    console.error('Error sending registration email:', {
      code: error.code,
      message: error.message,
      response: error.response?.body,
    });
    throw new Error(`Failed to send registration email: ${error.message}`);
  }
}

export async function sendCompanyRegistrationEmail(companyData: {
  companyName: string;
  contactPerson: string;
  email: string;
}) {
  try {
    const msg = {
      to: companyData.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
      subject: 'Welcome to Urswat - Company Registration Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Welcome to Urswat!</h1>
          <p>Dear ${companyData.contactPerson},</p>
          <p>Thank you for registering ${companyData.companyName} with Urswat. We're excited to help you find exceptional talent!</p>
          <p>Our team will review your company profile and will be in touch shortly to discuss your hiring needs and how we can best assist you.</p>
          <p>If you have any immediate questions or requirements, please don't hesitate to contact us.</p>
          <div style="margin-top: 30px;">
            <p>Best regards,</p>
            <p>The Urswat Team</p>
          </div>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log('Company registration email sent successfully:', {
      to: companyData.email,
      messageId: response[0]?.headers['x-message-id'],
      statusCode: response[0]?.statusCode,
    });
  } catch (error: any) {
    console.error('Error sending company registration email:', {
      code: error.code,
      message: error.message,
      response: error.response?.body,
    });
    throw new Error(`Failed to send company registration email: ${error.message}`);
  }
}
