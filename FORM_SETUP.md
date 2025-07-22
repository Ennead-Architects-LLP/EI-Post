# Form Data Setup Guide

## 📧 **Current Setup: Formspree (Recommended)**

The form is currently configured to send data to **Formspree**, a free email service for static websites.

### 🔧 **Setup Steps:**

1. **Create Formspree Account:**
   - Go to [formspree.io](https://formspree.io)
   - Sign up for a free account
   - Create a new form

2. **Get Your Form ID:**
   - After creating a form, you'll get a form ID like `xrgjqkqw`
   - Replace `YOUR_FORM_ID` in `index.html` line 147:
   ```html
   <form class="signup-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

3. **Test the Form:**
   - Submit a test registration
   - Check your email for the form submission
   - Check Formspree dashboard for submissions

### 📊 **What You'll Receive:**

Each form submission will include:
- **Full Name**
- **Email Address**
- **Phone Number** (optional)
- **Yoga Experience Level**
- **Preferred Time Slot**
- **Special Requirements** (optional)

---

## 🗂️ **Alternative Options:**

### 1. **Google Sheets**
```javascript
// Replace form action with Google Apps Script
action="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

### 2. **EmailJS (Client-side)**
```javascript
// Send emails directly from browser
emailjs.send('service_id', 'template_id', formData);
```

### 3. **Firebase Database**
```javascript
// Store in Firebase Realtime Database
firebase.database().ref('registrations').push(formData);
```

### 4. **Custom Backend**
```javascript
// Send to your own server
fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(formData)
});
```

---

## 🎯 **Recommended Workflow:**

1. **Start with Formspree** (easiest setup)
2. **Monitor submissions** in Formspree dashboard
3. **Export data** to CSV if needed
4. **Upgrade later** if you need more features

---

## 📧 **Email Notifications:**

With Formspree, you'll receive:
- **Instant email** for each registration
- **Spam protection**
- **Form validation**
- **Mobile-friendly** email templates

---

## 🔒 **Privacy & GDPR:**

- Formspree is GDPR compliant
- Data is stored securely
- Users can request data deletion
- No data sold to third parties

---

## 💡 **Pro Tips:**

1. **Set up email filters** to organize registrations
2. **Use Google Calendar** to track time slots
3. **Create a spreadsheet** to manually track capacity
4. **Set up auto-replies** for confirmation emails

---

**Need help?** Check out [Formspree documentation](https://formspree.io/docs/) or contact their support. 