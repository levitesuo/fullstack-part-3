const mongoose = require('mongoose')

if (process.argv.length<3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.a2ildyd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personShema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: String,
})

const Person = mongoose.model('Person', personShema)

if (process.argv.length === 3) {
	console.log('phonebook:')
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