const express = require('express');
const router = express.Router();


//@route Get api/profile

//@description Test route

//@access Public

router.get('/', (req, res) => res.send('Profile route'));




module.exports = router;