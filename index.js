require('dotenv').config()

const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))


const titleCase = (sentence) => {
    const words = sentence.split(" ").map(w => w.toLowerCase())
    const upperCaseWords = words.map((w) => w[0].toUpperCase() + w.slice(1))
    return upperCaseWords.join(" ")
}

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(documents => {
        return response.json(documents)
    })
    .catch(e => next(e))
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id).then(person => {
        if (!person) {
            return response.status(404).json({message: `The person with id ${id} was not found.`})
        }
        return response.json(person)
    })
    .catch(e => next(e))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const personName = titleCase(body.name)
        
    const newPerson = new Person({
        name: personName,
        number: body.number
    })

    newPerson.save().then((savedPerson) => {
        response.status(201).json(savedPerson)
    }).catch((e) => next(e))
})

app.delete('/api/persons/:id', (request, response, next) => {

    const id = request.params.id
    Person.deleteOne({ _id: id}).then((deletedDocument) => {
        return response.status(204).end()
    }).catch((e) => next(e))
})

app.get('/api/info', (request, response) => {
    const peopleNumber = persons.length
    return response.send(`<p>The phonebook has ${peopleNumber} numbers </p><p>${Date()}</p>`)
})

app.put('/api/persons/:id', (request, response, next) => {
    if (!request.body) {
        return response.status(400).send("Empty body! No update has been made.")
    }
    const updatedPerson = { name, number } = request.body

    if (!updatedPerson.name || !updatedPerson.number) {
        return response.status(400).send("Incomplete body! No update has been made.")
    }

    Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true, runValidators: true, context: 'query'})
    .then(person => response.json(person))
    .catch(e => next(e))
})

const customErrorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {
        return response.status(400).json({error: "Malformatted id"})
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    console.log(error.name)
    console.log(error.message)
    next(error)
}

app.use(customErrorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})
