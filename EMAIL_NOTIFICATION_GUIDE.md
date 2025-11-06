# 📧 Email Notification System Guide

## Overview
The email notification system automatically sends emails to all registered users when a new property is added to the platform.

## Features
- ✅ **Automatic Notifications**: When you add a new property, all users receive an email
- ✅ **Beautiful Email Template**: Professional HTML email with property image, details, and CTA button
- ✅ **Real-time Status**: Visual feedback showing email sending progress
- ✅ **Bilingual Support**: Emails are sent in Portuguese or English based on admin language setting
- ✅ **User Statistics**: Shows how many emails were sent successfully

## How It Works

### 1. **Adding a New Property**
When you add a new property in the Admin Panel:
1. Fill out the property form (title, price, images, location, etc.)
2. Click "Save" / "Guardar"
3. The system will automatically:
   - Save the property
   - Show an email notification modal
   - Send emails to all registered users
   - Display success message with count

### 2. **Email Notification Modal**
The modal shows three states:

**Sending (Loading)**
- Animated sending icon
- "Sending Emails..." message
- Loading animation

**Success**
- Green checkmark icon
- "Emails Sent!" message
- Number of emails sent
- Auto-closes after 5 seconds

**Error**
- Red X icon
- Error message
- Manual close button

### 3. **Email Content**
Each email includes:
- Property title
- Property price (formatted in EUR)
- Property location
- Main property image
- "View Property" button linking directly to the property page
- Professional Luzion Imobiliária branding

## Current Implementation

### Mock Email Service (Development)
Currently using a **mock email service** that:
- ✅ Simulates email sending with 1-second delay
- ✅ Logs emails to browser console
- ✅ Shows success notifications
- ✅ Generates full HTML email templates
- ❌ Does NOT send actual emails

### Production Email Services

To send **real emails** in production, you can integrate:

#### Option 1: EmailJS (Easiest - Free Tier Available)
1. Sign up at https://www.emailjs.com/
2. Install: `npm install @emailjs/browser`
3. Create an email template in EmailJS dashboard
4. Update `src/lib/emailService.ts` with your credentials:
```typescript
import emailjs from '@emailjs/browser';

// In sendViaEmailJS function
await emailjs.send(
  'YOUR_SERVICE_ID',      // From EmailJS dashboard
  'YOUR_TEMPLATE_ID',     // From EmailJS dashboard
  templateParams,
  'YOUR_PUBLIC_KEY'       // From EmailJS dashboard
);
```

#### Option 2: SendGrid (Professional)
1. Sign up at https://sendgrid.com/
2. Install: `npm install @sendgrid/mail`
3. Get API key from SendGrid
4. Create backend API endpoint to send emails securely

#### Option 3: Custom Backend API
Create your own email service:
```typescript
// Backend API example (Node.js/Express)
const nodemailer = require('nodemailer');

app.post('/api/send-property-email', async (req, res) => {
  const { recipients, propertyData } = req.body;
  
  // Send emails using nodemailer or other service
  // Return success/error response
});
```

## Testing

### Console Logs
Open browser console (F12) to see:
```
📧 Sending emails to: 5 users
Property: Apartamento T3 em Lisboa
📄 Email template generated: <!DOCTYPE html>...
✉️ Email sent to: Miguel Santos (luzion@imob.com)
✉️ Email sent to: Ana Costa (ana@imob.com)
...
```

### Email Template Preview
The generated HTML template includes:
- Gradient header with Luzion branding
- Large property image
- Property title and location
- Price in EUR
- Professional call-to-action button
- Footer with copyright

## Recipients

Emails are sent to:
- All registered users (role: 'user', 'agent', 'admin')
- Current users in system:
  - Miguel Santos (luzion@imob.com) - Admin
  - Ana Costa (ana@imob.com) - Admin
  - Paulo Silva (paulo@imob.com) - Admin
  - Maria Oliveira (maria@example.com) - User
  - João Ferreira (joao@example.com) - Agent

## Customization

### Email Template
Edit `src/lib/emailService.ts` -> `generateEmailTemplate()` to customize:
- Colors and styling
- Layout and structure
- Content and messaging
- Branding elements

### Notification Behavior
Edit `src/pages/AdminPanel.tsx` -> `handleSaveProperty()` to:
- Change auto-close delay (currently 5 seconds)
- Add filters for which users receive emails
- Modify success/error messages

## Future Enhancements

Potential improvements:
- [ ] Email preferences (users can opt-in/out)
- [ ] Email templates for different property types
- [ ] Digest emails (weekly property roundup)
- [ ] Email analytics (open rates, click rates)
- [ ] Scheduled emails (send at optimal times)
- [ ] Admin can preview email before sending
- [ ] Bulk property upload with batch email sending

## Troubleshooting

**Q: Emails not showing in console?**
A: Open browser DevTools (F12) and check Console tab

**Q: How to send real emails?**
A: Integrate with EmailJS, SendGrid, or create backend API (see Production Email Services)

**Q: Can I disable email notifications?**
A: Yes, comment out the email sending code in `handleSaveProperty()` function

**Q: How to add more recipients?**
A: Add users in the "Utilizadores" tab of Admin Panel

## Security Notes

⚠️ **Important for Production:**
- Never expose API keys in frontend code
- Use environment variables for credentials
- Implement rate limiting for email sending
- Validate recipient email addresses
- Add unsubscribe functionality
- Comply with GDPR and email regulations

## Support

For questions or issues:
- Check browser console for error messages
- Review `src/lib/emailService.ts` for email logic
- Check `src/pages/AdminPanel.tsx` for UI integration
- Test with mock service before integrating real email provider

---

**Status**: ✅ Mock email service active (Development)  
**Next Step**: Integrate real email service for production deployment
