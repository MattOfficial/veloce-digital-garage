#!/usr/bin/env node

/**
 * Script to fix malformed import statements from @veloce/ui
 * Handles nested braces like:
 * import { { Button }, { Dialog, DialogContent } } from "@veloce/ui";
 * Should become:
 * import { Button, Dialog, DialogContent } from "@veloce/ui";
 */

const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

async function main() {
  console.log("Searching for TypeScript/JSX files with malformed imports...");

  const files = await glob("src/**/*.{ts,tsx}", { ignore: "node_modules/**" });

  let totalFixed = 0;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, "utf8");

    // Check if file contains @veloce/ui import with nested braces
    if (!content.includes("@veloce/ui") || !content.includes("{{")) {
      continue;
    }

    console.log(`\nProcessing: ${filePath}`);

    // Use a regex to find all malformed imports
    // This regex matches imports with nested braces
    const importRegex =
      /import\s+\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\s+from\s+["']@veloce\/ui["']/g;

    let match;
    let newContent = content;

    while ((match = importRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const innerContent = match[1];

      console.log(`  Found malformed import: ${fullMatch.split("\n")[0]}...`);

      // Flatten the inner content by removing all { and }
      const flattened = innerContent
        .replace(/\{\s*/g, "")
        .replace(/\s*\}/g, "")
        .replace(/,\s*,/g, ",") // Remove duplicate commas
        .replace(/^\s*,\s*/, "") // Remove leading comma
        .replace(/\s*,\s*$/, "") // Remove trailing comma
        .trim();

      // Reconstruct the import
      const fixedImport = `import { ${flattened} } from "@veloce/ui";`;

      console.log(`  Fixed to: ${fixedImport}`);

      // Replace only this occurrence in newContent
      newContent = newContent.replace(fullMatch, fixedImport);
    }

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
      totalFixed++;
      console.log(`  ✓ Fixed ${filePath}`);
    }
  }

  console.log(`\n✅ Fixed ${totalFixed} files with malformed imports.`);
}

main().catch(console.error);
