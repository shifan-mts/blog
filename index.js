import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 3000;
var blog = [];

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
  res.render("index.ejs");
});
app.post('/submit', (req, res) => {
  const blogPostPath = __dirname + `/public/${req.body.name}.txt`;

  fs.writeFile(blogPostPath, req.body.para, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.status(500).send('Error saving blog post');
      return;
    }
    console.log(`The ${req.body.name}file has been saved!`);
  });
  blog.push([req.body.name,`/public/${req.body.name}.txt`])
  res.render('index.ejs', { blog1:blog});
});

app.get('/public/:fileName', (req, res) => {
  const filePath = __dirname + `/public/${encodeURIComponent(req.params.fileName)}`;
  res.sendFile(filePath);
});

app.listen(port,(req,res)=>{
  console.log(`server is running on ${port}`);
});

