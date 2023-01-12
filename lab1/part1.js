const http = require("http");
const fs = require("fs");
http
  .createServer((req, res) => {
    //! Routing
    if (req.url == "/home") {
      returnFile("home", res);
    } else if (req.url == "/about") {
      returnFile("about", res);
    } else if (req.url == "/contact") {
      returnFile("contact", res);
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write("<h1>Not Found</h1>");
    }
  })
  .listen(8080);

function returnFile(htmlFile, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.readFile(`./pages/${htmlFile}.html`, (err, data) => {
    res.write(data);
    res.end();
  });
}
