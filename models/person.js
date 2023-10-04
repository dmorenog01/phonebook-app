const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

url = process.env.MONGODB_URI

console.log(`connecting to ${url}`);

mongoose.connect(url)
.then((r) => console.log('connected to MongoDB'))
.catch((e) => console.log('failed to connect to MongoDB error:', e.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, 'The name should be at least 3 characters long']
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                return /[0-9]{2,3}-[0-9]+/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'The number is required!'],
       
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model('Person', personSchema)
