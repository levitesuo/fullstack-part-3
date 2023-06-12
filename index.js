require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })


app.use(express.static('build'))
app.use(express.json())
app.use(cors())

app.use(morgan('tiny'), )
app.use(morgan(':method :url :req[Content-Length] :status - :total-time ms :type', {
  skip: function (req, res) {return req.method !== "POST"}
}))

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformed id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

    person.save().then(savedInfo => {
      response.json(savedInfo)
    })
    .catch(error => next(error))
})

app.get('/api/info',async (request, response) => {
  const dbSize = await Person.countDocuments({})
  const landingPage = 
    `<br>
      <h3>On this page is info about the api and instructions on how to use it.</h3>
      <p>Phonebook has the info of ${dbSize} people</p>
      <p>on ${Date(Date.now()).toString()}</p>
      <h4>instructions </h4>
      <p>The api contains numbers and names of people. This data is stored in an array of json objects.</p>
      <p>Each object has a unique id, a name and a number. </p>
      <p>the format is</p>
      <p>{</p>
      <p>id: nkkaoldjffhsdf1923,</p>
      <p>name: Eric Example,</p>
      <p>number: 040-123438123</p>
      <p> }</p>
    </br>`
  response.send(landingPage)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    response.json(person)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true ,runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})