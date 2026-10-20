const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const outputDir = path.join(root, "public");

const rootFiles = [".html", ".txt", ".xml"];
const rootDirectories = ["assets"];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  const source = path.join(root, entry.name);

  if (entry.isFile() && rootFiles.includes(path.extname(entry.name).toLowerCase())) {
    fs.copyFileSync(source, path.join(outputDir, entry.name));
    continue;
  }

  if (entry.isDirectory() && rootDirectories.includes(entry.name)) {
    fs.cpSync(source, path.join(outputDir, entry.name), { recursive: true });
  }
}

console.log(`Staged static site into ${outputDir}`);
