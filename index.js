const express = require('express')
const app = express()

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "1-800-MY-DUDE",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
  ]

// return all persons
app.get('/api/persons', (request, response) => {
response.json(persons)
})

// return info for page
app.get('/info', (request, response) => {
let head = `<p>Phonebook has info for ${persons.length} people</p>`
let info = head.concat(`<p> ${new Date()} </p>`)
response.send(info)
})

// return individual person
app.get('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
const person = persons.find(person => person.id === id)
if (person) {
    response.json(person)
} else {
    response.status(404).end()
}
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
persons = persons.filter(person => person.id !== id)

response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})