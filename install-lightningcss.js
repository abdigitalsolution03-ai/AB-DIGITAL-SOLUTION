const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const pkg = 'lightningcss-win32-x64-msvc';
const version = '1.32.0';

const tgzUrl = `https://registry.npmjs.org/${pkg}/-/${pkg}-${version}.tgz`;
const targetDir = path.join(__dirname, 'node_modules', pkg);
const binaryPath = path.join(__dirname, 'node_modules', 'lightningcss', 'lightningcss.win32-x64-msvc.node');

console.log(`Downloading ${tgzUrl}...`);

https.get(tgzUrl, (res) => {
  const chunks = [];
  res.on('data', (c) => chunks.push(c));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    zlib.gunzip(buf, (err, data) => {
      if (err) { console.error('gunzip error:', err.message); return; }

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

      // Simple tar parser - find package/lightningcss.win32-x64-msvc.node in the tar
      let offset = 0;
      while (offset + 512 <= data.length) {
        const header = data.subarray(offset, offset + 512);
        const name = header.toString('ascii', 0, 100).replace(/\0/g, '').trim();
        const sizeStr = header.toString('ascii', 124, 136).replace(/\0/g, '').trim();
        const size = parseInt(sizeStr, 8) || 0;

        if (!name) break;
        offset += 512;

        if (size > 0 && offset + size <= data.length) {
          const fileContent = data.subarray(offset, offset + size);

          if (name === 'package/lightningcss.win32-x64-msvc.node') {
            fs.writeFileSync(binaryPath, fileContent);
            console.log(`Installed lightningcss binary (${fileContent.length} bytes)`);
          }

          const relative = name.replace(/^package\//, '');
          if (relative && !relative.endsWith('/')) {
            const filePath = path.join(targetDir, relative);
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(filePath, fileContent);
          }

          offset += size;
          while (offset % 512 !== 0) offset++;
        }
      }

      if (fs.existsSync(binaryPath)) {
        console.log('Success! lightningcss binary is ready.');
      } else {
        console.log('Binary not found in tarball. Checking files...');
        // List all files in tarball
        offset = 0;
        while (offset + 512 <= data.length) {
          const header = data.subarray(offset, offset + 512);
          const name = header.toString('ascii', 0, 100).replace(/\0/g, '').trim();
          const sizeStr = header.toString('ascii', 124, 136).replace(/\0/g, '').trim();
          const size = parseInt(sizeStr, 8) || 0;
          if (!name) break;
          if (name.endsWith('.node')) console.log(`Found: ${name}`);
          offset += 512;
          if (size > 0) {
            offset += size;
            while (offset % 512 !== 0) offset++;
          }
        }
      }
    });
  });
}).on('error', (e) => console.error('Download failed:', e.message));
