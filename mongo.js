const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)
 
const personShema = new mongoose.Schema({
    name: String,
    number: String,
})
  
const Person = mongoose.model('Person', personShema)

if (process.argv.length === 3) {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
    const person  = new Person  ({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}