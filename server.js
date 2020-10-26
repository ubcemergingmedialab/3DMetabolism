var express = require('express');
var path = require('path');

var app = express();
const port = 8080;
const addr_public = "0.0.0.0";
const addr_local = "127.0.0.1";

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
});

app.use("/", express.static(path.join(__dirname, "public")));

var addr = addr_local;
app.listen(port, addr_local, () => {
    console.log("app listening on " + addr + ":" + port);
});
