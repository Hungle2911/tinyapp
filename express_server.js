const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
  let result = [];
  let alphanumeric = `123456789qwertyuiopasdfghjklzxcvbnm`;
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * alphanumeric.length);
    result.push(alphanumeric[random]);
  }
  return result.join('');
}
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase ,
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});
app.post("/urls", (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id], 
    username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});
//Edit URL
app.post("/urls/:id", (req, res) => {
  let id = req.params.id
  const updatedURL = req.body.updatedURL;
  urlDatabase[id] = updatedURL
  res.redirect(`/urls`)
});
//Login
app.post("/login", (req, res) => {
  const submittedUsername = req.body.username
  res.cookie('username', submittedUsername)
  res.redirect('/urls')
});

//Delete URL
app.post("/urls/:id/delete", (req, res) => {
  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete];
  res.redirect("/urls")
});
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("URL not found");
  }
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});