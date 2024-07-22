import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  if (!req.body.name ||!req.body.para) {
    res.status(400).send("Please fill in both fields");
    return;
  }

  const filename = req.body.name + ".txt";
  const filepath = `${__dirname}/public/${filename}`;

  // Validate the filename to prevent malicious file writes
  if (!/^[a-zA-Z0-9-_]+$/.test(req.body.name)) {
    res.status(400).send("Invalid filename");
    return;
  }

  fs.writeFile(filepath, req.body.para, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving file");
    } else {
      console.log("File saved!");
      res.render("index.ejs", { name: req.body.name, link: `/public/${req.body.name}.txt` });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});