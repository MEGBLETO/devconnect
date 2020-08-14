const express = require('express'); //bringing in express

const app = express(); //initializing our app with express

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000; //setting our port will look for anv variable and if there in none we use port 5000

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));