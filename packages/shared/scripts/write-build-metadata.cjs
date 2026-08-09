const fs = require('node:fs');
const path = require('node:path');

const outputRoot = path.resolve(__dirname, '..', 'dist');

fs.writeFileSync(
  path.join(outputRoot, 'esm', 'package.json'),
  `${JSON.stringify({ type: 'module' }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(outputRoot, 'cjs', 'package.json'),
  `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`,
);
