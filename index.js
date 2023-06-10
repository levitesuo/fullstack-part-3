require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })



mongoose.set('strictQuery',false)
mongoose.connect(url)

const personShema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personShema)

app.use(morgan('tiny'), )
app.use(morgan(':method :url :req[Content-Length] :status - :total-time ms :type', {
  skip: function (req, res) {return req.method !== "POST"}
}))

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

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

const generateId = () => {
  return Math.floor(Math.random()*10**6)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!(body.number && body.name)) {
    return response.status(400).json({
      error: 'invalidArgument: Entries must have name and number'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'invalidArgument: Name alredy exists'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  persons = persons.concat(person)

  response.json(person)
})

app.get('/', (request, response) => {
  const landingPage = 
    `<br>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${Date(Date.now()).toString()}</p>
    </br>`
  response.send(landingPage)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
      response.json(person)
      } else {
      response.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})