import path from 'path';

export const APP_ROOT = path.resolve(__dirname, '../');
export const APP_ENTRY_PATH = path.resolve(APP_ROOT, 'src/index.tsx');
export const OUTPUT_DIR = path.resolve(APP_ROOT, 'dist');

export const APP_PUBLIC_ROOT = path.resolve(APP_ROOT, 'static');
export const APP_INDEX_ROOT = path.resolve(APP_PUBLIC_ROOT, 'index.html');
export const MANIFEST_PATH = path.resolve(OUTPUT_DIR, '.');