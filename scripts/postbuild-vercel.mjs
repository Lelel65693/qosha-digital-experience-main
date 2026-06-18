/**
 * Vercel post-build fix: copy tslib into _libs/node_modules
 * so Node.js can resolve it when supabase__auth-js.mjs imports it.
 */
import { readdirSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const root = process.cwd();
const funcDir = join(root, ".vercel", "output", "functions", "__server.func");
const libsDir = join(funcDir, "_libs");
const tslibSrc = join(root, "node_modules", "tslib");
const tslibLibsDst = join(libsDir, "node_modules", "tslib");
const tslibFuncDst = join(funcDir, "node_modules", "tslib");

function copyDirRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (!existsSync(funcDir)) {
    console.log("INFO: .vercel/output not found — not a Vercel build, skipping.");
    process.exit(0);
  }

  if (!existsSync(tslibSrc)) {
    console.error("ERROR: node_modules/tslib not found. Run npm install first.");
    process.exit(1);
  }

  // 1. Copy into _libs/node_modules (Node.js checks here first from _libs/*.mjs)
  copyDirRecursive(tslibSrc, tslibLibsDst);
  console.log("OK: tslib copied to _libs/node_modules/tslib");

  // 2. Also ensure it exists at function root node_modules (fallback)
  copyDirRecursive(tslibSrc, tslibFuncDst);
  console.log("OK: tslib copied to __server.func/node_modules/tslib");

  console.log("DONE: postbuild-vercel completed successfully.");
} catch (err) {
  console.error("ERROR running postbuild script:", err);
  process.exit(1);
}
