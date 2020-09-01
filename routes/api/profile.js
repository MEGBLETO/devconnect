const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');


//user model
const User = require('../../models/User')

//Profile model
const Profile = require('../../models/Profile');



//@route Get api/profile/me

//@description Get current user profile

//@access Private

router.get('/me', auth, async(req, res) => {
  try{
    const profile = await  Profile.findOne({user: req.user.id}).populate('user', 
    ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({msg: 'there is no profile for this user'})
    }

    res.json(profile);
  }

    catch(error){
    console.log(error.message);
    res.status(500).send('server error');
  }
})




module.exports = router;