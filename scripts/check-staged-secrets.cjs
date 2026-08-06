#!/usr/bin/env node

const os = require("os");
const { execSync, spawnSync } = require("child_process");

const platform = os.platform();

/**
 * PowerShell 7 (`pwsh`) is not part of a default Windows install, so fall back
 * to Windows PowerShell. The scan script itself is compatible with both.
 *
 * Availability is probed up front rather than by catching a failed run: a
 * genuine secret finding also exits non-zero, and retrying on that would run
 * the scan twice and report it twice.
 */
function resolveWindowsShell() {
  for (const candidate of ["pwsh", "powershell"]) {
    const probe = spawnSync(`${candidate} -NoProfile -Command "exit 0"`, {
      shell: true,
      stdio: "ignore",
    });

    if (!probe.error && probe.status === 0) {
      return candidate;
    }
  }

  return null;
}

try {
  if (platform === "win32") {
    const shell = resolveWindowsShell();

    if (!shell) {
      console.error(
        "Secret check: no PowerShell found. Tried 'pwsh' and 'powershell'.",
      );
      process.exit(1);
    }

    execSync(
      `${shell} -NoProfile -ExecutionPolicy Bypass -File scripts/check-staged-secrets.ps1`,
      { stdio: "inherit" },
    );
  } else {
    // macOS/Linux: Use Bash
    execSync("chmod +x scripts/check-staged-secrets.sh", { stdio: "inherit" });
    execSync("scripts/check-staged-secrets.sh", { stdio: "inherit" });
  }
} catch {
  process.exit(1);
}
