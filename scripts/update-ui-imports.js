#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function updateFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Find all imports from "@/components/ui/"
  const importRegex =
    /import\s+(?:{[^}]+}|\w+)\s+from\s+["']@\/components\/ui\/([^"']+)["']/g;
  const matches = [...content.matchAll(importRegex)];

  if (matches.length === 0) {
    return false;
  }

  console.log(`\nUpdating ${filePath}`);

  let updatedContent = content;
  const importedComponents = new Set();

  // Collect all imports from @/components/ui
  matches.forEach((match) => {
    const importStatement = match[0];

    // Extract component names from the import
    const importMatch = importStatement.match(/import\s+([^]+?)\s+from/);
    if (!importMatch) return;

    const importSpecifiers = importMatch[1];

    // Add to imported components set
    importedComponents.add(importSpecifiers);

    // Remove the import statement
    updatedContent = updatedContent.replace(importStatement, "");
  });

  // Add new import from @veloce/ui
  if (importedComponents.size > 0) {
    const newImport = `import { ${Array.from(importedComponents).join(", ")} } from "@veloce/ui";`;

    // Find the last import statement to insert after it
    const importLines = updatedContent.split("\n");
    let lastImportIndex = -1;

    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].trim().startsWith("import ")) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex !== -1) {
      importLines.splice(lastImportIndex + 1, 0, newImport);
      updatedContent = importLines.join("\n");
    } else {
      // If no imports found, add at the top
      updatedContent = newImport + "\n" + updatedContent;
    }
  }

  // Clean up empty lines
  updatedContent = updatedContent.replace(/\n{3,}/g, "\n\n");

  fs.writeFileSync(filePath, updatedContent);
  return true;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (
        file !== "node_modules" &&
        file !== ".git" &&
        !file.startsWith(".") &&
        file !== "dist"
      ) {
        walkDir(filePath);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      updateFile(filePath);
    }
  });
}

// Start from the src directory
const srcDir = path.join(__dirname, "..", "src");
console.log(`Updating UI imports in ${srcDir}...`);
walkDir(srcDir);
console.log("\n✅ UI imports updated!");
