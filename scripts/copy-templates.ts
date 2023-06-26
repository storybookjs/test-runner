import fs from 'fs-extra';

const srcDir = 'src/templates';
const destDir = 'dist/templateFiles';

fs.ensureDirSync(destDir);
fs.copySync(srcDir, destDir);
console.log(`Successfully copied ${srcDir} to ${destDir}`);
