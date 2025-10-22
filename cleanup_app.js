// Script to clean up duplicate code in App.js
const fs = require('fs');
const path = require('path');

// Read App.js
const appJsPath = path.join(__dirname, 'src', 'App.js');
const originalContent = fs.readFileSync(appJsPath, 'utf8');

// Make a backup of the original file
const backupPath = path.join(__dirname, 'src', 'App.js.backup3');
fs.writeFileSync(backupPath, originalContent);

// Find the renderChart function
const renderChartMatch = originalContent.match(/const renderChart = \(\) => {[\s\S]*?}\);/);
if (!renderChartMatch) {
  console.error('Could not find renderChart function');
  process.exit(1);
}

// Find any duplicate code
const renderChartFunction = renderChartMatch[0];
const duplicateStartIndex = originalContent.indexOf(renderChartFunction) + renderChartFunction.length;
const duplicateEndRegex = /const renderPerformanceSpeedometer = \(\) => {/;
const duplicateEndMatch = originalContent.substring(duplicateStartIndex).match(duplicateEndRegex);

if (!duplicateEndMatch) {
  console.error('Could not find the end of duplicate code');
  process.exit(1);
}

// Remove duplicate code
const duplicateEndIndex = duplicateStartIndex + duplicateEndMatch.index;
const cleanedContent = 
  originalContent.substring(0, duplicateStartIndex) + 
  '\n\n  ' +
  originalContent.substring(duplicateEndIndex);

// Write cleaned content back to App.js
fs.writeFileSync(appJsPath, cleanedContent);

console.log('App.js has been cleaned up successfully! Backup saved to App.js.backup3');