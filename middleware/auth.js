const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');



module.exports = function(req, res, next){
  //Get token from header

  const token = req.header('x-auth-token');

  //if there is no taken

  if(!token){
    return res.status(401).json({msg : 'No token, authorization has been denied'});
  }


  //verify the token since there is one

  try{
    const decoded = jwt.verify(token, config.get('jwtSecret'));
  
    req.user =  decoded.user;

    next();
  }
  
  catch(err){
      res.status(401).json({msg: 'Token is not valid'});
  }

};



