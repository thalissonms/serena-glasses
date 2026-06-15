const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p, callback);
    } else if (p.endsWith('.tsx')) {
      callback(p);
    }
  }
}

let modifiedFiles = 0;

walk('c:/Users/Thalisson/Documents/Serena/serena-glasses/features/admin/components', (p) => {
  let content = fs.readFileSync(p, 'utf8');
  let original = content;

  // 1. Fix grid-cols-2,3,4 to be responsive if they aren't already
  content = content.replace(/className="([^"]*?)grid grid-cols-([234])([^"]*?)"/g, (match, prefix, num, suffix) => {
    // Ignore if there is already a responsive grid class like md:grid-cols-
    if (prefix.includes('grid-cols-1') || suffix.includes('grid-cols-')) {
      return match;
    }
    return `className="${prefix}grid grid-cols-1 md:grid-cols-${num}${suffix}"`;
  });

  // 2. Fix flex items-center justify-between headers
  content = content.replace(/className="([^"]*?)flex (?:items-center justify-between|justify-between items-center)([^"]*?)"/g, (match, prefix, suffix) => {
    // Ignore if already responsive or part of a primitive like Toggle or special card
    if (prefix.includes('flex-col') || suffix.includes('flex-col') || p.includes('primitives') || p.includes('MetricStrip') || p.includes('SalesChart')) {
      return match;
    }
    // We make them stack on mobile and row on md
    return `className="${prefix}flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0${suffix}"`;
  });

  if (content !== original) {
    fs.writeFileSync(p, content, 'utf8');
    modifiedFiles++;
    console.log('Modified:', p);
  }
});

console.log('Total modified files:', modifiedFiles);
