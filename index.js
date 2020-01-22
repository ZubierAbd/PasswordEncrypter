const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const port = 3000;
const db = [];
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const encrypt = password => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

const decrypt = (word, iv) => {
  let new_iv = Buffer.from(savedIV, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), new_iv);
  let deciphered = decipher.update(word);
  deciphered = Buffer.concat([deciphered, decipher.final()]);
  return deciphered.toString();
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
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

app.get("/decrypt", (req, res) => {
  res.render("decrypt");
});

app.post("/encrypt", (req, res) => {
  const { password } = req.body;
  if (password && password.length >= 1) {
    const output = encrypt(password);
    savedIV = output.iv;
    res.render("output", {
      message: output.encryptedData
    });
  } else {
    res.render("failure", {
      message: "Sorry, something went wrong."
    });
  }
});

app.post("/decrypt", (req, res, err) => {
  const { password } = req.body;
  if (err) {
    res.render("failure", {
      message: "Sorry, something went wrong"
    });
  } else {
    if (password) {
      const unhashedPassword = decrypt(password);
      res.render("output", {
        message: unhashedPassword
      });
    }
  }
});

app.listen(port, () => {
  console.log("server is running");
});
