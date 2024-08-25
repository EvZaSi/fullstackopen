const personsRouter = require('express').Router()
const PhoneBookEntry = require('../models/person')


personsRouter.get('/', (request, response) => {
  PhoneBookEntry.find({}).then((results) => {
    response.json(results)
  })
})

personsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  PhoneBookEntry.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

personsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const phonebookentry = new PhoneBookEntry({
    name: body.name,
    number: body.number,
  })

  phonebookentry
    .save()
    .then((result) => {
      response.json(result)
    })
    .catch((error) => next(error))
})

personsRouter.put('/:id',),
(request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  PhoneBookEntry.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
}

personsRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  PhoneBookEntry.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = personsRouter