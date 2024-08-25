const infoRouter = require('express').Router()
const PhoneBookEntry = require('../models/person')

infoRouter.get('/', (request, response) => {
  PhoneBookEntry.find({}).then((results) => {
    let total = results.length
    let datetime = new Date()
    let responseText = `Phonebook has info for ${total} people.<br/>${datetime}`
    response.send(responseText)
  })
})

module.exports = infoRouter
