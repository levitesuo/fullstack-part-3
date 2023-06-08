const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :req[Content-Length] :status - :total-time ms :type'))

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

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

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
  response.json(persons)
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server persons is running on port ${PORT}`)
})