require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to ', url)

mongoose.connect(url)
	.then(() => {
		console.log('Connected to mondoDB')
	})
	.catch((error) => {
		console.log('Error connecting to MongoDB', error.message)
	})

/* const numberValidator = [(num) => {
    if (!num.includes("-")) {return false}
    const [ firstNum, secondNum ] = num.split('-')
    if (!(firstNum.length === 2 || firstNum.length === 3)) {return false}
    if (isNaN(firstNum) || isNaN(secondNum)) {return false}
    return true
}, 'The number must be in format ##-#...# or ###-#...#'] */

const numberValidator = [(num) => {
	const [ firstNum, secondNum ] = num.split('-')
	return(
		!(  !num.includes('-') ||
        !(firstNum.length === 2 || firstNum.length === 3) ||
        isNaN(firstNum) || isNaN(secondNum)))
}, 'The number must be in format ##-#...# or ###-#...#']

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		type: String,
		minLength: 8,
		required: true,
		validate: numberValidator
	},
})

/* personSchema.pre('findOneAndUpdate', (next) => {
    this.getOptions.runValidators = true
    next()
}) */

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)