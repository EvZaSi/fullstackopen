const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password')
    process.exit(1)
}



const password = process.argv[2]

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
const randomInt = getRandomInt(200, 900);


const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false)

mongoose.connect(url)
  

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: String
  })


const PhoneBookEntry = mongoose.model('PhoneBookEntry', phoneBookSchema)

if(process.argv.length == 3){
    PhoneBookEntry.find({}).then(result => {
        result.forEach(pbentry => {
          console.log(pbentry.name + ' ' + pbentry.number);
        })
        mongoose.connection.close()
        process.exit(0)
    })
    
}else{
    const name = process.argv[3]

    const phone = process.argv[4]

    const phonebookentry = new PhoneBookEntry({
        name: name,
        number: phone,
        id: randomInt
    })
    
    phonebookentry.save().then(result => {
        console.log('added ' + name + ' number ' + phone + ' to the phonebook');
        mongoose.connection.close()
    })
}

