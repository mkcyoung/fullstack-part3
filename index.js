const { response } = require('express')
const express = require('express')
const morgan = require('morgan')

// Morgan token function to log data from POST requests
morgan.token('data', (request,respone) => JSON.stringify(request.body))

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

// Activates express's json parser
app.use(express.json())
// Activate "morgan" middleware, configuring with tiny + data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

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

// helper function for generating random int for id
getRandomId = (max) => Math.floor(Math.random() * max)

// Add entry to phonebook
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    // Error handling (TODO: make more succinct)
    if (!body.name){
        return response.status(400).json({
            error: 'missing name'
        })
    }
    else if (!body.number){
        return response.status(400).json({
            error: 'missing number'
        })
    }
    else if (persons.map(person => person.name).includes(body.name)){
        return response.status(400).json({
            error: 'name already in phonebook'
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        // Number needs to be big enough to make collisions unlikely
        id: getRandomId(100000) 
    }

    persons = persons.concat(person)

    response.json(persons)

})

const PORT = 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})