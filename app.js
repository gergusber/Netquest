const express = require("express");
const feedRoutes = require("./routes/feed");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ADD ALL OR WILDCARD "*" ALLOW ALL
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect('mongodb://gerbertea:gerberteasecret@db:27017/netquestDb',
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin', }
  )
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
