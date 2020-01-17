const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const port = 3000;

const db = [];
const algorithm = "aes-256-ctr";
const encrypt = password => {
  let cipher = crypto.createCipher(algorithm, password);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = word => {
  let decipher = crypto.createDecipher(algorithm, word);
  let deciphered = decipher.update(word, "utf8", "hex");
  deciphered += decipher.final("utf8");
  return deciphered;
};

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.engine(
  "hbs",
  exphbs({
    extname: ".hbs"
  })
);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/encrypt", (req, res) => {
  res.render("encrypt");
});

app.post("/encrypt", (req, res) => {
  const { password } = req.body;
  if (password) {
    const hashedPassword = encrypt(password);
    res.render("output", {
      message: hashedPassword
    });
  }
});

app.post("/decrypt", (req, res) => {
  const { hash } = req.body;
  if (hash) {
    const unhashedPassword = decrypt(password);
    res.render("output", {
      message: unhashedPassword
    });
  }
});
app.listen(port, () => {
  console.log("server is running");
});
