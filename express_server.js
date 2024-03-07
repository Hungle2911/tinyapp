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
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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
function getUserByEmail(database, email) {
  for (let user in database) {
    if (database[user].email === email) {
    return database[user];
    }
  } return undefined
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
    username: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: users[req.cookies["user_id"]]
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
    username: users[req.cookies["user_id"]] };
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
//Logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});
//Register 
app.get('/register', (req, res) => {
  res.render('register')
})
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password ){
    res.status(400).send('Please make sure you fill out both username and password fields.')
  } else {
    if (!getUserByEmail(users, req.body.email)) {
      let id = generateRandomString();
   users[id] = {
    id,
    email,
    password
   }
  res.cookie('user_id', id);
  res.redirect('/urls');
  }else {
    res.status(400).send('This email was taken.')
  }}
})
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