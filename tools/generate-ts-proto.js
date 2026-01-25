const { execSync } = require('child_process');
const glob = require('glob');
const fs = require('fs');

const protoFiles = glob.sync('libs/proto/src/**/*.proto');
const outDir = 'apps/tracklab-api/src/generated';

let cmd = '';

if (process.platform === 'win32') {
  cmd = [
    'npx protoc',
    '--plugin=protoc-gen-ts_proto=node_modules\\.bin\\protoc-gen-ts_proto.cmd',
    '--ts_proto_opt=nestJs=true',
    '--ts_proto_out=' + outDir,
    '--proto_path=libs/proto/src',
    ...protoFiles
  ].join(' ');
} else {
  cmd = [
    'npx protoc',
    '--plugin=protoc-gen-ts_proto=node_modules/.bin/protoc-gen-ts_proto',
    '--ts_proto_opt=nestJs=true',
    '--ts_proto_out=' + outDir,
    '--proto_path=libs/proto/src',
    ...protoFiles
  ].join(' ');
}


fs.mkdirSync(outDir, { recursive: true });

execSync(cmd, { stdio: 'inherit' });
