require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


// Morgan token function to log data from POST requests
morgan.token('data', (request,respone) => JSON.stringify(request.body))

const app = express()

// MIDDLEWARE
// Activates express's json parser
app.use(express.json())
// Activate "morgan" middleware, configuring with tiny + data
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
// This only displays data content for post
app.use(morgan((tokens, req, res) => {
    let result = [ tokens.method(req,res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'].join(' ')
    if (tokens.method(req,res) != 'POST'){
        return result
    } else{
        return  result.concat(tokens.data(req,res))
    }
}))

// CORS
app.use(cors())

//STATIC
app.use(express.static('build'))


// return all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        // persons.forEach(person =>
        //     response.json(person))
        if (persons) {
            response.json(persons)
        }
        else{
            response.status(404).end()
        }
    })
    // response.json(persons)
})

// return info for page
app.get('/info', (request, response) => {
    let head = `<p>Phonebook has info for ${persons.length} people</p>`
    let info = head.concat(`<p> ${new Date()} </p>`)
    response.send(info)
})

// return individual person
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
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
    console.log(body)
    
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
    // How do I check the whole database for name?
    // else if (persons.map(person => person.name).includes(body.name)){
    //     return response.status(400).json({
    //         error: 'name already in phonebook'
    //     })
    // }
    
    // const person = {
    //     name: body.name,
    //     number: body.number,
    //     // Number needs to be big enough to make collisions unlikely
    //     id: getRandomId(100000) 
    // }

    const person = new Person({
        name: body.name,
        number: body.number
        // Not sure if I also need id field or if that is handled by mongodb?
    })
    // I don't think this is necessary, I just need to send the 1 back
    // Alternatively I could handle the whole thing in the backend here and remove the concat from the front end.
    // persons = persons.concat(person) 
    // Save to database ?
    person.save()
    response.json(person)

})

// const PORT = process.env.PORT || 3001
//     app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })

// Listen for port
const PORT = process.env.PORT
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})