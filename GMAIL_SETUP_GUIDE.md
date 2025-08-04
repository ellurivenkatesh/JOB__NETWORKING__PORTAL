# Gmail Setup Guide for OTP Email Verification

## 🚨 **Current Issue:**
Your `.env` file contains placeholder values:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
```

These need to be replaced with actual Gmail credentials.

## 📧 **Step-by-Step Gmail Setup:**

### **Step 1: Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on **"Security"** in the left sidebar
3. Find **"2-Step Verification"** and click **"Get started"**
4. Follow the prompts to enable 2-factor authentication

### **Step 2: Generate App Password**
1. In Google Account Settings → **"Security"**
2. Find **"2-Step Verification"** (should now be "On")
3. Click on **"2-Step Verification"**
4. Scroll down to **"App passwords"**
5. Click **"Create"** or **"Generate"**
6. Select **"Mail"** from the dropdown
7. Click **"Generate"**
8. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### **Step 3: Update Your .env File**
Replace the placeholder values in `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=jobnerworkingportal@1
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

**Example:**
```env
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=jobnerworkingportal@1
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## 🔧 **Quick Fix Commands:**

### **Option 1: Edit .env file manually**
```bash
# Open .env file in your editor and replace:
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### **Option 2: Use PowerShell to update**
```powershell
# Replace with your actual values
$email = "your_actual_email@gmail.com"
$password = "your_16_character_app_password"

# Update the .env file
(Get-Content .env) -replace 'EMAIL_USER=.*', "EMAIL_USER=$email" | Set-Content .env
(Get-Content .env) -replace 'EMAIL_PASS=.*', "EMAIL_PASS=$password" | Set-Content .env
```

## ✅ **Testing the Setup:**

1. **Restart your server** after updating .env
2. **Go to registration page** in your app
3. **Fill the form** and click "Send Verification Code"
4. **Check your email** for the OTP
5. **Enter the OTP** to complete registration

## 🚨 **Common Issues & Solutions:**

### **"Username and Password not accepted"**
- ✅ Make sure you're using **App Password**, not your regular Gmail password
- ✅ Ensure 2-factor authentication is enabled
- ✅ Check that the email address is correct
- ✅ Verify the app password has no extra spaces

### **"Invalid login"**
- ✅ Use the full Gmail address (including @gmail.com)
- ✅ Make sure the app password is exactly 16 characters
- ✅ Remove any extra spaces from the password

### **"Authentication failed"**
- ✅ Double-check that 2-factor authentication is enabled
- ✅ Regenerate the app password if needed
- ✅ Wait a few minutes after generating the app password

## 🔒 **Security Notes:**

- ✅ **App passwords are secure** - they only work for specific apps
- ✅ **You can revoke them anytime** from Google Account settings
- ✅ **They're different from your main password**
- ✅ **Each app password is unique**

## 📱 **Alternative: Use a Different Email Service**

If Gmail doesn't work, you can also use:
- **Outlook/Hotmail** (similar setup)
- **Yahoo Mail** (requires app-specific password)
- **Custom SMTP server**

## 🎯 **Expected Result:**

After proper setup, you should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
```

And when testing registration:
- ✅ OTP email sent successfully
- ✅ Professional email template received
- ✅ 6-digit verification code in email
- ✅ Successful account creation after OTP verification

## 🆘 **Still Having Issues?**

1. **Check server logs** for specific error messages
2. **Verify .env file** has correct values
3. **Test with a different Gmail account**
4. **Ensure no firewall is blocking SMTP**

The OTP system will work perfectly once the Gmail credentials are properly configured! 🎉 