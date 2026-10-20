const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "public");
const PORT = Number(process.env.PORT) || 8080;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function resolvePath(pathname) {
  const relative = pathname.replace(/^\/+/, "");
  const candidate = path.resolve(ROOT, relative);
  if (candidate !== ROOT && !candidate.startsWith(ROOT + path.sep)) {
    return null;
  }
  return candidate;
}

function sendFile(res, filePath, statusCode) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const extension = path.extname(filePath).toLowerCase();
    const isPage = extension === ".html";
    res.writeHead(statusCode, {
      "Content-Type": CONTENT_TYPES[extension] || "application/octet-stream",
      "Cache-Control": isPage ? "public, max-age=0, must-revalidate" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(data);
  });
}

function serve(res, filePath) {
  fs.stat(filePath, (error, stats) => {
    if (error) {
      sendFile(res, path.join(ROOT, "404.html"), 404);
      return;
    }
    if (stats.isDirectory()) {
      serve(res, path.join(filePath, "index.html"));
      return;
    }
    sendFile(res, filePath, 200);
  });
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    pathname = "/";
  }

  const filePath = resolvePath(pathname);
  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  serve(res, filePath);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Serving ${ROOT} on port ${PORT}`);
});
