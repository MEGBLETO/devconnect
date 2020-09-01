const express = require('express'); //bringing in express

const connectDB = require('./config/db');

//Connect database

connectDB();

const app = express(); //initializing our app with express

//init middleware
app.use(express.json({extended: false}));


app.get('/', (req, res) => res.send('API Running'));


//define Route 
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/profile', require('./routes/api/profile'));




const PORT = process.env.PORT || 5000; //setting our port will look for anv variable and if there in none we use port 5000

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`))