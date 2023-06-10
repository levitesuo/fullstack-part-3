const url = process.env.MONGODB_URI

console.log('Connecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to mondoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error.message)
    }