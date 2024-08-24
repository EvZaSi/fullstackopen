const express = require('express')
const app = express()
const cors = require('cors');
const morgan = require('morgan')
app.use(cors());
app.use(express.json())
app.use(morgan('tiny'));

let persons = [
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "id": "4",
      "name": "John Smith",
      "number": "(908) 292-9987"
    },
    {
      "id": "5",
      "name": "Evan Smith",
      "number": "9255182645"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})


const generateId = (objectlist) => {
    const maxId = objectlist.length > 0
      ? Math.max(...objectlist.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    const namesearch = persons.find(person => person.name === body.name)

    if(namesearch) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(persons),
    }

    persons = persons.concat(person)

    response.json(person)
  })

app.post('/api/persons', (request, response) => {
    const person = request.body
    console.log(person)
    response.json(person)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const total = persons.length
  let datetime = new Date();
  let responseText = `Phonebook has info for ${total} people.<br/>${datetime}`
  response.send(responseText)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3004
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
