const Daraz = require("./daraz");
const http = require("http");

const PORT = process.env.PORT ?? 3000;
const server = http.createServer(async (req, res) => {
  await handleRequests(req, res);
});
// const corsOrigin = 'http://127.0.0.1:5500';
const corsOrigin = "https://roopaish.github.io/";

const handleRequests = async (req, res) => {
  // Daraz api requests
  if (req.url.startsWith("/daraz") && req.method === "GET") {
    try {
      const name = req.url.match(/name=(.+)/)[1] ?? "";
      const data = await Daraz.getItems(name);

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `${corsOrigin}`,
      });
      res.write(JSON.stringify(data));
      res.end();
    } catch (e) {
      res.writeHead(404, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `${corsOrigin}`,
      });
      res.end(JSON.stringify({ message: "Something went wrong!" }));
    }
  }

  // No route response
  else {
    res.writeHead(404, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": `${corsOrigin}`,
    });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};

server.listen(PORT, () => {
  console.log(`Server running at PORT:${PORT}/`);
});
