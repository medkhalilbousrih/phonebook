const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");
require("dotenv").config();

app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

app.get("/info", (req, res) => {
  Person.find({}).then((result) =>
    res.send(`<h3>Phonebook has info for ${result.length} people</h3>
    <h3>${new Date()}<h3>
  `)
  );
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const person = new Person(req.body);
  console.log(person);
  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const newPerson = req.body;
  console.log(newPerson);
  Person.findByIdAndUpdate(id, newPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

const unknownEndPoint = (req, res) => {
  res.status(404).end();
};

app.use(unknownEndPoint);

const errorHandler = (err, req, res, next) => {
  res.status(500).json(err.message);
  console.log(err.message);
};

app.use(errorHandler);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
