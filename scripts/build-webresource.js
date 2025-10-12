/**
 * Build script to package the web resource for Power Apps deployment
 * Run: node scripts/build-webresource.js
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const distDir = path.join(__dirname, '..', 'dist-webresource');

// Create dist directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('📦 Packaging web resource for Power Apps...');

// Copy essential files
const filesToCopy = [
  'index.html',
  'static/js',
  'static/css',
];

filesToCopy.forEach(file => {
  const src = path.join(buildDir, file);
  const dest = path.join(distDir, file);
  
  if (fs.existsSync(src)) {
    if (fs.lstatSync(src).isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      copyDirectory(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
    console.log(`✅ Copied: ${file}`);
  }
});

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('');
console.log('✨ Web resource packaged successfully!');
console.log('📁 Output directory:', distDir);
console.log('');
console.log('📤 Next steps:');
console.log('1. Upload index.html as a web resource (e.g., eg_/webresources/excelgenerator.html)');
console.log('2. Upload static/js/* and static/css/* files');
console.log('3. Reference the HTML file in your Power Apps form or app');
console.log('');
console.log('🔧 For PCF conversion:');
console.log('- Use the components in src/components');
console.log('- Adapt the dynamicsApi service for PCF context');
console.log('- Update manifest.xml with required APIs');
