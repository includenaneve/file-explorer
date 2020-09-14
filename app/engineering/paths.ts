import path from 'path';

export const PROJECT_ROOT = path.resolve(__dirname, '../../');
export const APP_ROOT = path.resolve(PROJECT_ROOT, 'app');
export const SERVER_ROOT = path.resolve(PROJECT_ROOT, 'server');
export const SRC_ROOT = path.resolve(APP_ROOT, 'src');

export const MANIFEST_PATH = path.resolve(SERVER_ROOT, 'manifest.json');
export const APP_ENTRY_PATH = path.resolve(SRC_ROOT, 'index.ts');
export const APP_OUTPUT_DIR = path.resolve(APP_ROOT, 'dist');