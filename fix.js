const fs = require('fs');
const path = require('path');

console.log("🚀 Starting Strapi Repair...");

// 1. Define paths
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const cacheDir = path.join(rootDir, '.cache');
const submissionDir = path.join(rootDir, 'src', 'api', 'submission', 'controllers'); // <--- The Real Source
const submissionFile = path.join(submissionDir, 'submission.ts');
const middlewareFile = path.join(rootDir, 'config', 'middlewares.ts'); // Default to TS

// 2. Nuke Ghost Folders (The "Zombie" Killer)
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log("✅ Deleted 'dist' folder (The Ghost)");
}
if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log("✅ Deleted '.cache' folder");
}

// 3. Create The Missing Folders (AUTOMATICALLY)
if (!fs.existsSync(submissionDir)) {
    fs.mkdirSync(submissionDir, { recursive: true });
    console.log("✅ Created missing folder: src/api/submission/controllers");
}

// 4. Write the Correct Controller Code
const controllerCode = `/**
 * submission controller
 */
import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::submission.submission');
`;
fs.writeFileSync(submissionFile, controllerCode);
console.log("✅ FORCE-WROTE: src/api/submission/controllers/submission.ts");

// 5. Fix Middlewares (Ensure Body Parser is ON)
const middlewareCode = `export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];`;

fs.writeFileSync(middlewareFile, middlewareCode);
console.log("✅ FORCE-WROTE: config/middlewares.ts");

console.log("\n✨ REPAIR COMPLETE. You MUST restart the server now!");