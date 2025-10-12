# Single Bundle HTML Generator

Write-Host "🚀 Creating single bundle HTML file..." -ForegroundColor Green

# Get build directory
$buildDir = ".\build"
if (-not (Test-Path $buildDir)) {
    Write-Host "❌ Build directory not found. Run 'npm run build' first." -ForegroundColor Red
    exit 1
}

# Find the CSS and JS files
$cssFile = Get-ChildItem "$buildDir\static\css\main.*.css" | Select-Object -First 1
$jsFile = Get-ChildItem "$buildDir\static\js\main.*.js" | Select-Object -First 1

if (-not $cssFile -or -not $jsFile) {
    Write-Host "❌ CSS or JS files not found in build directory." -ForegroundColor Red
    exit 1
}

Write-Host "📁 Found build files:" -ForegroundColor Cyan
Write-Host "   CSS: $($cssFile.Name)" -ForegroundColor Gray
Write-Host "   JS:  $($jsFile.Name)" -ForegroundColor Gray

# Read the content of CSS and JS files
$cssContent = Get-Content $cssFile.FullName -Raw
$jsContent = Get-Content $jsFile.FullName -Raw

Write-Host "📦 Building single bundle..." -ForegroundColor Yellow

# Create the single bundle HTML content
$htmlStart = @'
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta name="theme-color" content="#0078d4"/>
    <meta name="description" content="Excel Generator for Power Apps - Create comprehensive reports and visualize metadata"/>
    <title>Excel Generator | Power Apps Web Resource</title>
    <style>
'@

$htmlMiddle = @'
    </style>
</head>
<body>
    <noscript>You need to enable JavaScript to run this application.</noscript>
    <div id="root"></div>
    <script>
'@

$htmlEnd = @'
    </script>
</body>
</html>
'@

# Combine all parts
$bundleHtml = $htmlStart + "`n" + $cssContent + "`n" + $htmlMiddle + "`n" + $jsContent + "`n" + $htmlEnd

# Write the bundle file
$outputFile = "$buildDir\bundle.html"
$bundleHtml | Out-File -FilePath $outputFile -Encoding UTF8

# Get file size
$bundleSize = (Get-Item $outputFile).Length
$bundleSizeMB = [math]::Round($bundleSize / 1MB, 2)

Write-Host "✅ Single bundle created successfully!" -ForegroundColor Green
Write-Host "📄 File: bundle.html" -ForegroundColor Cyan
Write-Host "📊 Size: $bundleSizeMB MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 To deploy to Power Apps:" -ForegroundColor Yellow
Write-Host "   1. Go to make.powerapps.com" -ForegroundColor Gray
Write-Host "   2. Create new web resource" -ForegroundColor Gray
Write-Host "   3. Upload: build\bundle.html" -ForegroundColor Gray
Write-Host "   4. Name: flow_excel_generator" -ForegroundColor Gray
Write-Host "   5. Type: Webpage (HTML)" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Single file - No CSS/JS dependencies needed!" -ForegroundColor Green