const mongoose = require('mongoose');
const config = require('config');


//collecting the uti from default.jon and storing in a variable
const db = config.get('mongoURI');



//using async
const connectDB = async () => {
  try{
              await mongoose.connect(db ,{

              useNewUrlParser :true
              });

              console.log('MongoDB  is connected.... ');
  }  catch(err){
                 
    console.error(err.message);
//exit my process with a failure
    process.exit(1);
  }
};

module.exports = connectDB;