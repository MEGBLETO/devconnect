const mongoose = require('mongoose');
const config = require('config');


//collecting the uri from default.jon and storing in a variable
const db = config.get('mongoURI');



//using async
const connectDB = async () => {
  try{
              await mongoose.connect(db ,{
              useCreateIndex: true,
              useUnifiedTopology: true,
              useNewUrlParser :true
              });

              console.log('MongoDB  is connected.... ');
  }  catch(err){
                 
    console.error(err.message);
//exit my process in case of a failure
    process.exit(1);
  }
};

module.exports = connectDB;