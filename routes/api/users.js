const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const config = require('config');
const { body, validationResult } = require('express-validator');

//user model

const User = require('../../models/User');


//@route POST api/users

//@description Register user

//@access Public

 
router.post('/', [
  body('name','Name is required')
  .not()
  .isEmpty(),

  body('email', 'please include a valid email').isEmail(),
  body(
    'password',
    'please enter a pssword with 6 or more characters').isLength({ min: 6}),
  
],

async(req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

    const {name, email , password}  = req.body;


       //see if user exists and if yes send back an error
    try{

      let user = await User.findOne({email});

      if(user){
       return res.status(400).json({errors: [{msg: 'user already exist'}]});
      }
      
      //Get user gravatar 
      const avatar = gravatar.url(email,{
        s: '200',
        r:'pg',
        d:'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      });

  //encrypt password using Bcrypt
const salt = await bcrypt.genSalt(10);

user.password = await bcrypt.hash(password, salt);


await user.save();

  //return jsonwebtoken

  const payload ={
  user: {
    id: user.id
  }

};

  jwt.sign(payload, 
    config.get('jwtSecret'),
    {expiresIn: 360000},
    (err, token) =>{
      if(err) throw err;
      res.json({token});
    });

    } catch(err){

      console.log(error.message);

      res.status(500).send('Server error');

    }
   
});




router.post('/', [
  body('name','Name is required')
  .not()
  .isEmpty(),

  body('email', 'please include a valid email').isEmail(),
  body(
    'password',
    'please enter a pssword with 6 or more characters').isLength({ min: 6}),
  
],

async(req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

    const {name, email , password}  = req.body;


       //see if user exists and if yes send back an error
    try{

      let user = await User.findOne({email});

      if(user){
       return res.status(400).json({errors: [{msg: 'user already exist'}]});
      }
      
      //Get user gravatar 
      const avatar = gravatar.url(email,{
        s: '200',
        r:'pg',
        d:'mm'
      })

      //creating the user
      user = new User({
        name,
        email,
        avatar,
        password
      });

  //encrypt password using Bcrypt
const salt = await bcrypt.genSalt(10);

user.password = await bcrypt.hash(password, salt);


await user.save();

  //return jsonwebtoken

  const payload ={
  user: {
    id: user.id
  }

};

  jwt.sign(payload, 
    config.get('jwtSecret'),
    {expiresIn: 360000},
    (err, token) =>{
      if(err) throw err;
      res.json({token});
    });

    } catch(err){

      console.log(error.message);


      res.status(500).send('Server error');

    }
   
});




module.exports = router;