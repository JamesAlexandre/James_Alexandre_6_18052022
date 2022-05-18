const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://James_Alexandre:YeS06WDC03jz0W4f@cluster0.n4825.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à Mongo DB réussie !"))
  .catch(() => console.log("Connexion à Mongo DB échouée !"));
