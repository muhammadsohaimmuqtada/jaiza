const fs = require('fs');

const index = fs.readFileSync('/home/kali/Documents/startup/jaiza/index.html', 'utf8');
const styles = fs.readFileSync('/home/kali/Documents/startup/jaiza/styles.css', 'utf8');
const script = fs.readFileSync('/home/kali/Documents/startup/jaiza/script.js', 'utf8');

const payload = {
  owner: 'muhammadsohaimmuqtada',
  repo: 'jaiza',
  branch: 'main',
  message: 'Initial commit: Jaiza static marketing site',
  files: [
    { path: 'index.html', content: index },
    { path: 'styles.css', content: styles },
    { path: 'script.js', content: script }
  ]
};

fs.writeFileSync('/home/kali/Documents/startup/jaiza/payload.json', JSON.stringify(payload));
