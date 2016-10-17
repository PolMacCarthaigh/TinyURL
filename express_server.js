var express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
var PORT = process.env.PORT || 8080;

function generateRandomString() {
  let cipher = "ABCDEFGHIJKLMNOPQRSTVWXYZabcdefghijklmnopqrstvwxyz0123456789";
  let string_length = 6;
  let randomstring = '';
  for (let i=0; i<string_length; i++) {
    let rnum = Math.floor(Math.random() * cipher.length);
    randomstring += cipher.substring(rnum,rnum+1);
  }
  return randomstring;
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", function(request, response){
  response.redirect("/urls");
});

app.get("/urls", function(request, response){
  let templateVars = { urls: urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/urls/new", function(request, response){
  response.render("urls_new");
});

app.post("/urls", function(request, response){
  let shortURL = generateRandomString();

  while(urlDatabase[shortURL]) {
    shortURL = generateRandomString();
  }

  var protocol = /http:\/\//
  if (protocol.test((request.body).longURL) === true){
    urlDatabase[shortURL] = (request.body).longURL;
  } else {
    urlDatabase[shortURL] = "http://" + (request.body).longURL;
  }

  response.redirect(`http://localhost:8080/urls/${shortURL}`);
});

app.post("/urls/:id/delete", function(request, response){
  let templateVars = {shortURL: request.params.id};
  delete urlDatabase[templateVars.shortURL];
   response.redirect("/urls");
});

app.post("/urls/:id", function(request, response){
  let templateVars = { shortURL: request.params.id };
  if (((request.body).longURL) !== "") {
    var protocol = /http:\/\//
    if (protocol.test((request.body).longURL) === true){
      urlDatabase[templateVars.shortURL] = (request.body).longURL;
    } else {
      urlDatabase[templateVars.shortURL] = "http://" + (request.body).longURL;
    }
     response.redirect("/urls");
  }
});

app.get("/urls/:id", function(request, response){
  let s = request.params.id;
  let l = urlDatabase[s];
  let templateVars = { "shortURL": s, "long": l };
  if(!urlDatabase[s]){
     response.send('');
  } else {
    response.render("urls_show", templateVars);
  }
});

app.get("/u/:id", function(request, response){
  let templateVars = { shortURL: request.params.id };
  if(!urlDatabase[templateVars.shortURL]){
    response.send('Something happened, Please tell Paul :)');
  } else {
  response.redirect(urlDatabase[templateVars.shortURL]);
  }
});


app.listen(PORT, () => {
  console.log(`TinyUrl app listening on port ${PORT}!`);
});