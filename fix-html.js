import fs from 'fs';

try {
  let content = fs.readFileSync('index.html', 'utf8');
  
  // Clean up HTTrack meta tag issue
  const badTag = '<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->';
  const headTag = '<head>';
  
  content = content.replace(badTag + '\r\n' + headTag, headTag + '\n\t<meta http-equiv="content-type" content="text/html;charset=UTF-8" />');
  content = content.replace(badTag + '\n' + headTag, headTag + '\n\t<meta http-equiv="content-type" content="text/html;charset=UTF-8" />');
  
  fs.writeFileSync('index.html', content, 'utf8');
  console.log('HTML fixed successfully.');
} catch (e) {
  console.error('Error fixing HTML:', e);
}
