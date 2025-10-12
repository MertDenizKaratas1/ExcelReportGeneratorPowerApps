# Excel Generator Web Resource - Setup Script
# Run this script to set up the development environment

Write-Host "🚀 Excel Generator Web Resource Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "   Recommended: Node.js 18 LTS or higher" -ForegroundColor Yellow
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

# Install npm packages
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "🎉 Setup Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   1. Start development server:" -ForegroundColor White
    Write-Host "      npm start" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   2. Build for production:" -ForegroundColor White
    Write-Host "      npm run build" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   3. Build for web resource:" -ForegroundColor White
    Write-Host "      npm run build:webresource" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Yellow
    Write-Host "   - QUICKSTART.md - Quick start guide" -ForegroundColor White
    Write-Host "   - DEPLOYMENT.md - Full deployment instructions" -ForegroundColor White
    Write-Host "   - README.md - Complete project documentation" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 The app will run on: http://localhost:3000" -ForegroundColor Yellow
    Write-Host "💡 In local mode, mock data is used (no Dynamics 365 needed)" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Installation failed!" -ForegroundColor Red
    Write-Host "   Please check the error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "   - Network connectivity problems" -ForegroundColor White
    Write-Host "   - Node.js version too old (need 14+)" -ForegroundColor White
    Write-Host "   - npm registry access issues" -ForegroundColor White
    Write-Host ""
    exit 1
}
