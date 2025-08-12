// save this as generateFormMd.js and run with: node generateFormMd.js

const fs = require('fs');
const path = require('path');

const start = 10000;
const end = 10277;
const filename = path.join(__dirname, 'form.md');

let markdownContent = '';

for (let i = start; i <= end; i++) {
  markdownContent += `![${i}](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png)\n\n`;
}

fs.writeFile(filename, markdownContent, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log(`Markdown file created: ${filename}`);
  }
});
