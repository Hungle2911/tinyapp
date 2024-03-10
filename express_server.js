const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['great_cookie'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
//Function 
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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

app.get('/', (req, res) => {
  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});
// URL index page
app.get("/urls", (req, res) => {
  const userID = req.session[`userID`];
  if (!userID) {
    res.render("urls_error");
    return;
  }
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = {
    urls: userUrls,
    userID: users[userID],
  };
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  if (!req.session.userID) {
    res.status(401).send('You have to login first');
  }
  let id = generateRandomString();
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.session.userID
  };
  res.redirect(`/urls/${id}`);
});
//Add new URL page
app.get("/urls/new", (req, res) => {
  if (req.session.userID) {
    const templateVars = {
      userID: users[req.session["userID"]]
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

// short url page - GET
app.get("/urls/:id", (req, res) => {
  const userID = req.session["userID"];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    userID: users[userID] };
  const userUrls = urlsForUser(userID, urlDatabase);
  if (!urlDatabase[templateVars.id]) {
    res.status(404).send('This short URL does not exist.');
  } else if (!userID || !userUrls[req.params.id]) {
    res.status(403).send('You are not authorized to see this URL.');
  } else {
    res.render("urls_show", templateVars);
  }
});
//Edit URL
app.post("/urls/:id", (req, res) => {
  let id = req.params.id;
  const userID = req.session.userID;
  const url = urlDatabase[id];
  if (!url) {
    res.status(404).send('This short URL does not exist.');
  } else if (!userID) {
    res.status(401).send('Please log in to edit this URL.');
  } else if (url.userID !== userID) {
    res.status(403).send('You do not have permission to edit this URL.');
  } else {
    const updatedURL = req.body.updatedURL;
    urlDatabase[id].longURL = updatedURL;
    res.redirect(`/urls`);
  }
});
//Login
app.post("/login", (req, res) => {
  const user = getUserByEmail(users, req.body.email);
  if (!user) {
    return res.status(403).send('User not found');
  } else if (!(bcrypt.compareSync(req.body.password, user.password))) {
    return res.status(403).send('Incorrect password');
  } else {
    req.session.userID = user.id;
    res.redirect('/urls');
  }
});
app.get('/login', (req, res) =>{
  if (req.session.userID) {
    res.redirect('/urls');
    return;
  }
  res.render('login');
});
//Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});
//Register
app.get('/register', (req, res) => {
  if (req.session.userID) {
    res.redirect('/urls');
    return;
  }
  res.render('register');
});
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Please make sure you fill out both username and password fields.');
  } else {
    if (!getUserByEmail(users, req.body.email)) {
      let id = generateRandomString();
      const hashedPassword = bcrypt.hashSync(password, 10);
      users[id] = {
        id,
        email,
        password : hashedPassword
      };
      req.session.userID = id;
      res.redirect('/urls');
    } else {
      res.status(400).send('This email was taken.');
    }
  }
});
//Delete URL
app.post("/urls/:id/delete", (req, res) => {
  let id = req.params.id;
  const userID = req.session.userID;
  const url = urlDatabase[id];
  if (!url) {
    res.status(404).send('This short URL does not exist.');
  } else if (!userID) {
    res.status(401).send('Please log in to edit this URL.');
  } else if (url.userID !== userID) {
    res.status(403).send('You do not have permission to edit this URL.');
  } else {
    delete urlDatabase[id];
    res.redirect("/urls");
  }
});
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id.longURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("URL not found");
  }
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});