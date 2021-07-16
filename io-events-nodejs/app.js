require("dotenv").config();

const express = require("express");
const ngrok = require("ngrok");
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");

const api = require("./lib/api");
const { resToJSON, errorToJSON } = require("./lib/utils");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", [
    express.static(path.join(__dirname, "node_modules/bulma/css")),
    express.static(path.join(__dirname, "node_modules/jquery/dist"))
  ]
);

app.get("/webhook", (req, res) => {
  res.send(req.query.challenge);
});

app.post("/webhook", (req, res) => {
  io.emit("webhook", req.body);

  res.status(200).end();
});

io.on("connection", socket => {
  socket.on("create-event", async () => {
    try {
      const res = await api.createLibrary("My Test Library");

      socket.emit("create-event", resToJSON(res));
    } catch (err) {
      console.error(err);

      socket.emit("error", errorToJSON(err), "api");
    }
  });

  socket.on("update-event", async () => {
    try {
      const library = await api.createLibrary("NEW Test Library");

      socket.emit("create-event", resToJSON(library));

      const updatedLibrary = await api.updateLibrary(library.data.id, "OLD Test Library");

      socket.emit("update-event", resToJSON(updatedLibrary));
    } catch (err) {
      console.error(err);

      socket.emit("error", errorToJSON(err), "api");
    }
  });

  socket.on("delete-event", async () => {
    try {
      const library = await api.createLibrary("TEMP Test Library");

      socket.emit("create-event", resToJSON(library));

      const deletedLibrary = await api.deleteLibrary(library.data.id);

      socket.emit("delete-event", resToJSON(deletedLibrary));
    } catch (err) {
      console.error(err);

      socket.emit("error", errorToJSON(err), "api");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

(async () => {
  const url = await ngrok.connect(PORT);

  console.log(`Publicly available at ${url}/webhook`);
})();
