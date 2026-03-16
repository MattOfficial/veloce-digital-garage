#!/usr/bin/env node

const os = require("os");
const { execSync } = require("child_process");

const platform = os.platform();

try {
  if (platform === "win32") {
    // Windows: Use PowerShell
    execSync("pwsh -File scripts/check-staged-secrets.ps1", {
      stdio: "inherit",
    });
  } else {
    // macOS/Linux: Use Bash
    execSync("chmod +x scripts/check-staged-secrets.sh", { stdio: "inherit" });
    execSync("scripts/check-staged-secrets.sh", { stdio: "inherit" });
  }
} catch {
  process.exit(1);
}
