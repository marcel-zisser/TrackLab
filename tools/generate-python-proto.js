const { execSync } = require('child_process');
const glob = require('glob');
const fs = require('fs');

const protoFiles = glob.sync('libs/proto/src/**/*.proto');
const outDir = 'apps/fast_f1_service/src/generated';
const protoPath = 'libs/proto/src';

// Ensure the directory exists
const generateProto = [
  'uv run python -m grpc_tools.protoc',
  '--proto_path=' + protoPath,
  '--pyi_out=' + outDir,
  '--python_out=' + outDir,
  '--grpc_python_out=' + outDir,
  ...protoFiles
].join(' ');

const fixProto = [
  'uv run protol',
  '--create-package',
  '--in-place',
  '--python-out ' + outDir,
  ' protoc -I ' + protoPath,
  '--proto-path=libs/proto/src',
  ...protoFiles,
  '--protoc-path "uv run python -m grpc_tools.protoc"'
].join(' ');

fs.mkdirSync(outDir, { recursive: true });

execSync(generateProto, { stdio: 'inherit' });
execSync(fixProto, { stdio: 'inherit' });
