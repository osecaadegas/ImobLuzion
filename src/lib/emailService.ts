// Email notification service for property updates

export interface EmailRecipient {
  name: string;
  email: string;
}

export interface PropertyEmailData {
  propertyTitle: string;
  propertyPrice: number;
  propertyLocation: string;
  propertyImage: string;
  propertyLink: string;
}

// Mock email service - In production, integrate with EmailJS, SendGrid, or your backend
export const emailService = {
  // Send notification to all users about new property
  async sendNewPropertyNotification(
    recipients: EmailRecipient[],
    propertyData: PropertyEmailData,
    language: 'pt' | 'en' = 'pt'
  ): Promise<{ success: boolean; message: string; sentCount: number }> {
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would call your email service API
      console.log('📧 Sending emails to:', recipients.length, 'users');
      console.log('Property:', propertyData.propertyTitle);
      
      // Generate email template (in production, this would be sent)
      const emailTemplate = this.generateEmailTemplate(propertyData, language);
      console.log('📄 Email template generated:', emailTemplate.substring(0, 100) + '...');
      
      // Log each email (in production, this would be actual API calls)
      recipients.forEach(recipient => {
        console.log(`✉️ Email sent to: ${recipient.name} (${recipient.email})`);
        console.log('Subject:', language === 'pt' 
          ? `Nova Propriedade Disponível: ${propertyData.propertyTitle}`
          : `New Property Available: ${propertyData.propertyTitle}`
        );
      });

      return {
        success: true,
        message: language === 'pt' 
          ? `Emails enviados com sucesso para ${recipients.length} utilizadores!`
          : `Emails sent successfully to ${recipients.length} users!`,
        sentCount: recipients.length
      };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        message: language === 'pt'
          ? 'Erro ao enviar emails'
          : 'Error sending emails',
        sentCount: 0
      };
    }
  },

  // Generate HTML email template
  generateEmailTemplate(propertyData: PropertyEmailData, language: 'pt' | 'en'): string {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat(language === 'pt' ? 'pt-PT' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(price);
    };

    const subject = language === 'pt'
      ? `Nova Propriedade Disponível: ${propertyData.propertyTitle}`
      : `New Property Available: ${propertyData.propertyTitle}`;

    const greeting = language === 'pt' ? 'Olá' : 'Hello';
    const intro = language === 'pt'
      ? 'Temos uma nova propriedade que pode ser do seu interesse!'
      : 'We have a new property that might interest you!';
    const viewButton = language === 'pt' ? 'Ver Propriedade' : 'View Property';
    const footer = language === 'pt'
      ? 'Obrigado por usar a Luzion Imobiliária'
      : 'Thank you for using Luzion Real Estate';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🏡 Luzion Imobiliária</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px;">
                      <h2 style="color: #1f2937; margin-top: 0;">${greeting}!</h2>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${intro}</p>
                      
                      <!-- Property Image -->
                      <div style="margin: 20px 0;">
                        <img src="${propertyData.propertyImage}" alt="${propertyData.propertyTitle}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;">
                      </div>
                      
                      <!-- Property Details -->
                      <h3 style="color: #1f2937; margin: 20px 0 10px 0;">${propertyData.propertyTitle}</h3>
                      <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                        📍 ${propertyData.propertyLocation}
                      </p>
                      <p style="color: #2563eb; font-size: 24px; font-weight: bold; margin: 10px 0 20px 0;">
                        ${formatPrice(propertyData.propertyPrice)}
                      </p>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${propertyData.propertyLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                          ${viewButton} →
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; font-size: 14px; margin: 0;">${footer}</p>
                      <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                        © 2025 Luzion Imobiliária. ${language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  },

  // EmailJS integration example (optional - requires API key)
  async sendViaEmailJS(
    recipients: EmailRecipient[],
    propertyData: PropertyEmailData,
    language: 'pt' | 'en' = 'pt'
  ): Promise<{ success: boolean; message: string }> {
    // To use EmailJS:
    // 1. Sign up at https://www.emailjs.com/
    // 2. Install: npm install @emailjs/browser
    // 3. Configure your service ID, template ID, and public key
    // 4. Uncomment and configure the code below

    /*
    import emailjs from '@emailjs/browser';
    
    try {
      const templateParams = {
        to_email: recipients.map(r => r.email).join(','),
        property_title: propertyData.propertyTitle,
        property_price: propertyData.propertyPrice,
        property_location: propertyData.propertyLocation,
        property_image: propertyData.propertyImage,
        property_link: propertyData.propertyLink,
      };

      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        templateParams,
        'YOUR_PUBLIC_KEY'
      );

      return { success: true, message: 'Emails sent successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to send emails' };
    }
    */

    return {
      success: false,
      message: 'EmailJS not configured. Using mock service instead.'
    };
  }
};

// Example usage:
/*
const recipients = [
  { name: 'Miguel Santos', email: 'miguel@example.com' },
  { name: 'Ana Costa', email: 'ana@example.com' }
];

const propertyData = {
  propertyTitle: 'Apartamento T3 em Lisboa',
  propertyPrice: 350000,
  propertyLocation: 'Lisboa, Portugal',
  propertyImage: 'https://example.com/image.jpg',
  propertyLink: 'https://yoursite.com/property/123'
};

await emailService.sendNewPropertyNotification(recipients, propertyData, 'pt');
*/
