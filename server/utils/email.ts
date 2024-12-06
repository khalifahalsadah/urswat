import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendTalentRegistrationEmail(talentData: {
  fullName: string;
  email: string;
}) {
  const msg = {
    to: talentData.email,
    from: 'notifications@urswat.com', // Replace with your verified sender
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

  try {
    await sgMail.send(msg);
    console.log(`Registration email sent to ${talentData.email}`);
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw new Error('Failed to send registration email');
  }
}

export async function sendCompanyRegistrationEmail(companyData: {
  companyName: string;
  contactPerson: string;
  email: string;
}) {
  const msg = {
    to: companyData.email,
    from: 'notifications@urswat.com', // Replace with your verified sender
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

  try {
    await sgMail.send(msg);
    console.log(`Registration email sent to ${companyData.email}`);
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw new Error('Failed to send registration email');
  }
}
