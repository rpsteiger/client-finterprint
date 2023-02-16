const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

app.set("view engine", "ejs");

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/fp", (req, res, _) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
  );
  res.render("fingerprint");
});

app.post("/fp-submit", (req, res, _) => {
  const clientIP = req.ip;
  let textData = `Client IP Address: ${clientIP}. \n`;
  const fingerPrintData = req.body.data.replace(/<br \/>/g, "\n");
  console.log(fingerPrintData);
  textData += fingerPrintData;
  textData += "---------------------------------\n\n";
  fs.appendFile("fingerprint.txt", textData, function (err) {
    if (err) throw err;
    console.log("Saved");
  });

  res.sendStatus(200);
});

app.listen(3000);
