# OTP Email Verification Setup Guide

## 🎯 **What's New:**
- **Real-time OTP verification** via email during registration
- **Two-step registration process** for enhanced security
- **Professional email templates** with branded design
- **Automatic OTP expiration** (10 minutes)
- **Resend functionality** for user convenience

## 📧 **Email Configuration Setup:**

### **Step 1: Gmail Setup**
1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate App Password:**
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password

### **Step 2: Environment Configuration**
1. **Copy the example file:**
   ```bash
   cp server/env.example server/.env
   ```

2. **Update the .env file:**
   ```env
   JWT_SECRET=your_secure_jwt_secret_here
   MONGODB_URI=mongodb://localhost:27017/job_portal
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password_here
   ```

## 🔄 **How the OTP System Works:**

### **Registration Flow:**
1. **User fills registration form** (name, email, password, role)
2. **System validates input** and checks if email exists
3. **OTP is generated** (6-digit code) and sent via email
4. **User receives professional email** with verification code
5. **User enters OTP** in the verification step
6. **System verifies OTP** and creates user account
7. **User is redirected** to login page

### **Security Features:**
- ✅ **10-minute OTP expiration**
- ✅ **Automatic cleanup** of expired OTPs
- ✅ **Email validation** before sending OTP
- ✅ **Duplicate user prevention**
- ✅ **Professional email templates**

## 🎨 **User Experience:**

### **Step 1: Registration Form**
- Professional styling with validation
- Clear error messages
- Loading states during OTP sending

### **Step 2: OTP Verification**
- Clean verification interface
- Email display for confirmation
- Resend functionality
- Back navigation option
- Professional OTP input field

### **Email Template Features:**
- **Professional design** with branding
- **Clear OTP display** with large, readable font
- **Expiration warning** (10 minutes)
- **Security notice** for unintended recipients

## 🛠 **Technical Implementation:**

### **Backend Components:**
- `emailService.js` - Email sending functionality
- `otpStorage.js` - In-memory OTP storage with expiration
- `authController.js` - OTP generation and verification
- New routes: `/auth/send-otp` and `/auth/verify-otp-register`

### **Frontend Components:**
- **Two-step registration** with state management
- **Form validation** and error handling
- **Loading states** and user feedback
- **Resend functionality** for better UX

## 🚀 **Testing the System:**

1. **Start the server** with proper email configuration
2. **Navigate to registration page**
3. **Fill the registration form**
4. **Click "Send Verification Code"**
5. **Check your email** for the OTP
6. **Enter the OTP** and complete registration
7. **Login** with your new account

## 🔧 **Troubleshooting:**

### **Email Not Sending:**
- Check Gmail app password configuration
- Verify EMAIL_USER and EMAIL_PASS in .env
- Ensure 2-factor authentication is enabled

### **OTP Not Working:**
- Check server logs for email errors
- Verify OTP storage is working
- Check expiration timing (10 minutes)

### **Registration Issues:**
- Ensure MongoDB is running
- Check JWT_SECRET configuration
- Verify all required fields are filled

## 📱 **Features Summary:**

### **Security:**
- ✅ Email verification required
- ✅ OTP expiration (10 minutes)
- ✅ Duplicate email prevention
- ✅ Secure password hashing

### **User Experience:**
- ✅ Professional email design
- ✅ Clear error messages
- ✅ Loading states
- ✅ Resend functionality
- ✅ Back navigation

### **Technical:**
- ✅ Real-time email sending
- ✅ In-memory OTP storage
- ✅ Automatic cleanup
- ✅ Professional styling

The OTP system is now fully integrated and ready for production use! 🎉 