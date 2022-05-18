const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

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

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use('/api/auth', userRoutes);

module.exports = app;
