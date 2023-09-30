const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => Math.floor(Math.random() * 10000000)

const titleCase = (sentence) => {
    const words = sentence.split(" ").map(w => w.toLowerCase())
    const upperCaseWords = words.map((w) => w[0].toUpperCase() + w.slice(1))
    return upperCaseWords.join(" ")
}

app.get('/api/persons', (request, response) => {
    return response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter((p) => p.id === id)

    if (!person) {
        return response.status(404).json({message: `The person with id ${id} was not found.`})
    }

    return response.json(person)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({message: "Missing name"})
    }

    if (!body.number) {
        return response.status(400).json({message: "Missing number"})
    }

    const personName = titleCase(body.name)

    if (persons.find((p) => p.name === personName)) {
        return response.status(400).json({message: "The person already exists!"})
    }

    const newPerson = {
        name: personName,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(newPerson)
    return response.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((p) => p.id !== id)
    return response.status(204).end()
})

app.get('/api/info', (request, response) => {
    const peopleNumber = persons.length
    return response.send(`<p>The phonebook has ${peopleNumber} numbers </p><p>${Date()}</p>`)
})

const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})
