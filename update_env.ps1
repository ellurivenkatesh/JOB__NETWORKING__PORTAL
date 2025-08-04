# PowerShell script to update .env file with Gmail credentials
Write-Host "=== Gmail OTP Setup ===" -ForegroundColor Green
Write-Host ""

# Get user input
$email = Read-Host "Enter your Gmail address (e.g., john.doe@gmail.com)"
$password = Read-Host "Enter your Gmail app password (16 characters)" -AsSecureString

# Convert secure string to plain text
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

# Read current .env content
$envContent = Get-Content .env

# Update EMAIL_USER
$envContent = $envContent -replace 'EMAIL_USER=.*', "EMAIL_USER=$email"

# Update EMAIL_PASS
$envContent = $envContent -replace 'EMAIL_PASS=.*', "EMAIL_PASS=$plainPassword"

# Write back to .env file
$envContent | Set-Content .env

Write-Host "✅ .env file updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Your .env file now contains:" -ForegroundColor Cyan
Get-Content .env | Where-Object { $_ -match 'EMAIL_' }
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your server" -ForegroundColor White
Write-Host "2. Test the registration process" -ForegroundColor White
Write-Host "3. Check your email for OTP" -ForegroundColor White 