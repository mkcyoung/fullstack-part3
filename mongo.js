const mongoose = require('mongoose')

if (process.argv.length < 3 || (process.argv.length > 3 && process.argv.length < 5) ) {
    console.log('Please provide the password, name, and number as an argument: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]


const url =
    `mongodb+srv://fullstack:${password}@cluster0.jxqwd.mongodb.net/phonebook?retryWrites=true&w=majority`


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String, // Maybe need to change this to number?
})

const Person = mongoose.model('Person', personSchema)

// Prints all entries in phonebook if no name and number are passed
if (!name && !number){
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit(0) //Exits out
    })
}
else{
    // Creating a new person
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}


