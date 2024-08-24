const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const PhoneBookEntry = require("./models/persons");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(morgan("tiny"));

app.get("/info", (request, response) => {
  PhoneBookEntry.find({}).then((results) => {
    let total = results.length;
    let datetime = new Date();
    let responseText = `Phonebook has info for ${total} people.<br/>${datetime}`;
    response.send(responseText);
  });
});

app.get("/api/persons", (request, response) => {
  PhoneBookEntry.find({}).then((results) => {
    response.json(results);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  PhoneBookEntry.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const phonebookentry = new PhoneBookEntry({
    name: body.name,
    number: body.number,
  });

  phonebookentry
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id"),
  (request, response) => {
    const id = request.params.id;
    const { name, number } = request.body;

    PhoneBookEntry.findByIdAndUpdate(
      id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    )
      .then((result) => {
        response.status(204).end();
      })
      .catch((error) => next(error));
  };

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  PhoneBookEntry.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
