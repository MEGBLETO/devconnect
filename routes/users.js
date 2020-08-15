const express = require('express');
const router = express.Router();


//@route Get api/users

//@description Test route

//@access Public

router.get('/', (req, res) => res.send('user route'));




module.exports = router;