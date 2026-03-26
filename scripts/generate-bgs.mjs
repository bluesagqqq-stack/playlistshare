import fs from 'fs';
import path from 'path';

const bgDir = path.join(process.cwd(), 'public', 'backgrounds');
const outFile = path.join(process.cwd(), 'src', 'backgrounds.json');

if (!fs.existsSync(bgDir)) {
  fs.mkdirSync(bgDir, { recursive: true });
}

let bgs = [];
const files = fs.readdirSync(bgDir);
bgs = files.filter(f => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f));

fs.writeFileSync(outFile, JSON.stringify(bgs, null, 2));
console.log(`[generate-bgs] Found ${bgs.length} background images.`);
