#!/usr/bin/env node

/**
 * Script to fix malformed import statements from @veloce/ui
 * Handles multi-line imports with nested braces
 */

const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

// Helper to flatten imports: {{a,b},{c}} -> {a,b,c}
function flattenImportContent(content) {
  // Remove all { and } but keep the components
  return content
    .replace(/\{\s*/g, "")
    .replace(/\s*\}/g, "")
    .replace(/,\s*,/g, ",") // Remove duplicate commas
    .replace(/^\s*,\s*/, "") // Remove leading comma
    .replace(/\s*,\s*$/, "") // Remove trailing comma
    .trim();
}

async function main() {
  console.log("Searching for TypeScript/JSX files with malformed imports...");

  const files = await glob("src/**/*.{ts,tsx}", { ignore: "node_modules/**" });

  let totalFixed = 0;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, "utf8");

    // Check if file contains malformed import pattern
    if (!content.includes("@veloce/ui")) continue;

    // Pattern to match imports with nested braces
    // This regex captures the entire import line (single or multi-line)
    const malformedImportRegex =
      /import\s+\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\s+from\s+["']@veloce\/ui["']/g;

    let match;
    let changed = false;

    // We need to handle multi-line imports by looking for the pattern across lines
    // Better approach: split by lines and reconstruct
    const lines = content.split("\n");
    const newLines = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check if this line starts a malformed import
      if (
        line.includes("import") &&
        line.includes("@veloce/ui") &&
        line.includes("{{")
      ) {
        console.log(`\nProcessing: ${filePath}`);
        console.log(`  Found malformed import starting at line ${i + 1}`);

        // Collect all lines until we find the closing brace and "from "@veloce/ui""
        let importLines = [line];
        let j = i + 1;
        let foundClosing =
          line.includes('} from "@veloce/ui"') ||
          line.includes("} from '@veloce/ui'");

        while (j < lines.length && !foundClosing) {
          importLines.push(lines[j]);
          if (
            lines[j].includes('} from "@veloce/ui"') ||
            lines[j].includes("} from '@veloce/ui'")
          ) {
            foundClosing = true;
          }
          j++;
        }

        if (!foundClosing) {
          // Something went wrong, skip
          newLines.push(...importLines);
          i = j;
          continue;
        }

        const fullImport = importLines.join("\n");
        console.log(`  Original import:\n${fullImport}`);

        // Extract the inner content between the outer braces
        const innerMatch = fullImport.match(
          /import\s+\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\s+from\s+["']@veloce\/ui["']/,
        );
        if (innerMatch) {
          const innerContent = innerMatch[1];
          const flattened = flattenImportContent(innerContent);

          // Reconstruct the import
          const fixedImport = fullImport.replace(
            /\{[^}]*\}/,
            `{ ${flattened} }`,
          );
          console.log(`  Fixed import:\n${fixedImport}`);

          newLines.push(fixedImport);
          changed = true;
          totalFixed++;
          i = j; // Skip the lines we just processed
        } else {
          // Couldn't parse, keep original
          newLines.push(...importLines);
          i = j;
        }
      } else {
        newLines.push(line);
        i++;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, newLines.join("\n"), "utf8");
      console.log(`  ✓ Fixed ${filePath}`);
    }
  }

  console.log(`\n✅ Fixed ${totalFixed} files with malformed imports.`);
}

main().catch(console.error);
