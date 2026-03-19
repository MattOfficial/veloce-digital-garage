#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function updateFileImports(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Replace @MattOfficial/veloce-ui with @mattofficial/veloce-ui
  const updatedContent = content.replace(
    /@MattOfficial\/veloce-ui/g,
    "@mattofficial/veloce-ui",
  );

  if (updatedContent !== content) {
    console.log(`Updated imports in ${filePath}`);
    fs.writeFileSync(filePath, updatedContent, "utf8");
    return true;
  }
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  let updatedCount = 0;

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
        updatedCount += walkDir(filePath);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      if (updateFileImports(filePath)) {
        updatedCount++;
      }
    }
  });

  return updatedCount;
}

// Start from the src directory
const srcDir = path.join(__dirname, "..", "src");
console.log(`Updating UI imports in ${srcDir}...`);

const updatedCount = walkDir(srcDir);
console.log(
  `\n✅ Updated ${updatedCount} files with new lowercase import path.`,
);
