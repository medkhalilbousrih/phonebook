const express = require("express");
const app = express();
const morgan = require("morgan");
//const cors = require("cors");

//app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));

let persons = [];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`
    <h3>Phonebook has info for ${persons.length} people</h3>
    <h3>${new Date()}<h3>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = persons.find((p) => p.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

const maxId = () => {
  const id = persons.length ? Math.max(...persons.map((p) => p.id)) : 0;
  return id;
};

const personExists = (name) => {
  if (persons.find((p) => p.name === name)) {
    return true;
  }
  return false;
};

app.post("/api/persons", (req, res) => {
  const person = req.body;
  if (!person.name || !person.number) {
    return res.json({ error: "missing information" });
  } else if (personExists(person.name)) {
    return res.json({ error: "person exists" });
  }
  person.id = maxId() + 1;

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
