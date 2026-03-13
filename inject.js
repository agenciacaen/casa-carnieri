import fs from 'fs';

try {
  let content = fs.readFileSync('index.html', 'utf8');
  if (!content.includes('src/main.js')) {
      content = content.replace('</body>', '    <script type="module" src="/src/main.js"></script>\n</body>');
      fs.writeFileSync('index.html', content, 'utf8');
      console.log('Script main.js injected!');
  } else {
      console.log('Script main.js already exists.');
  }
} catch(e) {
  console.error(e);
}
