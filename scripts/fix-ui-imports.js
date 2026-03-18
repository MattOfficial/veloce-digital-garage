#!/usr/bin/env node

/**
 * Script to fix malformed import statements from @veloce/ui
 * Changes imports like:
 * import { { Card, CardContent }, { Button } } from "@veloce/ui";
 * to:
 * import { Card, CardContent, Button } from "@veloce/ui";
 */

const fs = require("fs");
const { glob } = require("glob");

async function main() {
  console.log("Searching for TypeScript/JSX files with malformed imports...");

  // Get all .tsx and .ts files in src directory
  const files = await glob("src/**/*.{ts,tsx}", { ignore: "node_modules/**" });

  let totalFixed = 0;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");

    // Check if file contains malformed import
    if (content.includes("@veloce/ui") && content.includes("{{")) {
      console.log(`\nProcessing: ${filePath}`);

      // First, find all import lines that need fixing
      const lines = content.split("\n");
      let changed = false;

      const fixedLines = lines.map((line) => {
        if (line.includes("@veloce/ui") && line.includes("{{")) {
          console.log(`  Found malformed import: ${line.trim()}`);

          // Extract the part inside import { ... } from "@veloce/ui";
          const importMatch = line.match(
            /import\s+\{([^}]+)\}\s+from\s+["']@veloce\/ui["']/,
          );
          if (importMatch) {
            const innerContent = importMatch[1];
            // Remove all braces and flatten
            const flattened = innerContent
              .replace(/\{\s*/g, "")
              .replace(/\s*\}/g, "")
              .replace(/,\s*,/g, ",") // Remove duplicate commas
              .replace(/^\s*,\s*/, "") // Remove leading comma
              .replace(/\s*,\s*$/, "") // Remove trailing comma
              .trim();

            const fixedImport = line.replace(/\{[^}]+\}/, `{ ${flattened} }`);
            console.log(`  Fixed to: ${fixedImport.trim()}`);
            changed = true;
            return fixedImport;
          }
        }
        return line;
      });

      if (changed) {
        fs.writeFileSync(filePath, fixedLines.join("\n"), "utf8");
        totalFixed++;
        console.log(`  ✓ Fixed ${filePath}`);
      }
    }
  }

  console.log(`\n✅ Fixed ${totalFixed} files with malformed imports.`);

  if (totalFixed === 0) {
    console.log("No malformed imports found. Checking with regex...");
    // Try alternative approach
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, "utf8");
      if (content.includes("@veloce/ui")) {
        const malformedRegex =
          /import\s+\{\s*\{[^}]+\}(?:\s*,\s*\{[^}]+\})*\s*\}\s+from\s+["']@veloce\/ui["']/g;
        const matches = content.match(malformedRegex);
        if (matches) {
          console.log(`Found in ${filePath}:`, matches);
        }
      }
    }
  }
}

main().catch(console.error);
