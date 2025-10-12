# Power Apps Web Resource Deployment Script
# Run this script after building your React app with 'npm run build'

param(
    [Parameter(Mandatory=$true)]
    [string]$EnvironmentUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$SolutionName = "ExcelGeneratorSolution"
)

Write-Host "🚀 Starting Power Apps Web Resource Deployment..." -ForegroundColor Green

# Check if Power Platform CLI is installed
try {
    pac --version | Out-Null
    Write-Host "✅ Power Platform CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Power Platform CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @microsoft/powerplatform-cli
}

# Authenticate to Power Platform
Write-Host "🔐 Authenticating to Power Platform..." -ForegroundColor Yellow
pac auth create --url $EnvironmentUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Authentication failed. Please check your environment URL." -ForegroundColor Red
    exit 1
}

# Get the current directory
$buildPath = ".\build"

if (-not (Test-Path $buildPath)) {
    Write-Host "❌ Build folder not found. Please run 'npm run build' first." -ForegroundColor Red
    exit 1
}

# Get the actual file names from build directory
$cssFile = Get-ChildItem "$buildPath\static\css\main.*.css" | Select-Object -First 1
$jsFile = Get-ChildItem "$buildPath\static\js\main.*.js" | Select-Object -First 1

if (-not $cssFile -or -not $jsFile) {
    Write-Host "❌ CSS or JS files not found in build directory." -ForegroundColor Red
    exit 1
}

Write-Host "📁 Found build files:" -ForegroundColor Cyan
Write-Host "   CSS: $($cssFile.Name)" -ForegroundColor Gray
Write-Host "   JS:  $($jsFile.Name)" -ForegroundColor Gray

# Create or update web resources
Write-Host "📤 Uploading web resources..." -ForegroundColor Yellow

try {
    # Upload HTML file
    Write-Host "   Uploading HTML..." -ForegroundColor Gray
    pac webresource create --path "$buildPath\index_powerapps.html" --name "flow_excel_generator_html" --display-name "Flow Excel Generator HTML" --solution-name $SolutionName

    # Upload CSS file
    Write-Host "   Uploading CSS..." -ForegroundColor Gray
    pac webresource create --path $cssFile.FullName --name "flow_excel_generator_css" --display-name "Flow Excel Generator CSS" --solution-name $SolutionName

    # Upload JS file
    Write-Host "   Uploading JavaScript..." -ForegroundColor Gray
    pac webresource create --path $jsFile.FullName --name "flow_excel_generator_js" --display-name "Flow Excel Generator JS" --solution-name $SolutionName

    Write-Host "✅ Web resources uploaded successfully!" -ForegroundColor Green
    
    # Publish customizations
    Write-Host "📢 Publishing customizations..." -ForegroundColor Yellow
    pac solution publish --solution-name $SolutionName
    
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Your app is now available at: $EnvironmentUrl/WebResources/flow_excel_generator_html" -ForegroundColor Cyan

} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Test the web resource in Power Apps" -ForegroundColor Gray
Write-Host "   2. Add to your model-driven app if needed" -ForegroundColor Gray
Write-Host "   3. Configure any required security settings" -ForegroundColor Gray