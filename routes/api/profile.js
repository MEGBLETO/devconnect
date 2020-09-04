const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');


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
});




//@route POST api/profile

//@description  create or update a user profile
//@access Private

router.post('/', [auth, 
  body('status','status is required')
  .not()
  .isEmpty(),
  body('skills', 'skills is required')
  .not()
  .isEmpty()],
  async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array() });
    }

    const{
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
  } = req.body;


  //Build the profile object

  const profileFields = {}; //initialization


  profileFields.user = req.user.id;

  if(company) profileFields.company = company;
  if(website) profileFields.company = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(githubusername) profileFields.githubusername = githubusername;
  if(status) profileFields.status = status;

  if(skills){
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }


  //Build the social object

  profileFields.social = {};


  if(youtube)  profileFields.social.youtube = youtube;
  if(instagram)  profileFields.social.instagram = instagram;
  if (linkedin)  profileFields.social.linkedin = linkedin;
  if(facebook)  profileFields.social.facebook = facebook;
  if(twitter)  profileFields.social.twitter = twitter;


 
try{
  let profile = await Profile.findOne({user: req.user.id});

  if(profile){
    //update

    profile = await Profile.findOneAndUpdate(
      {user: req.user.id}, 
      {$set: profileFields},
      {new: true}
      )

      res.json(profile);
  }

  //create a profile in case there isn't one

  profile =  new Profile(profileFields);

  await profile.save();

  res.json(profile);



}catch(error){
  console.log(error.message);
  res.status(500).send('Server Error');
}


}) ;


//@route GET api/profile

//@description  Get all profiles
//@access Public72 


router.get('/', async(req, res) =>{

  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error');
  }

});


//@route GET api/profile/user/user_id

//@description  Get profile by user id
//@access Public


router.get('/user/:user_id', async(req, res) =>{

  try {
    const profile = await Profile.findOne({user: req.params.user_id }).populate('user', ['name', 'avatar']);
    

    if(!profile){

      return res.status(400).json({msg: "profile not found"});

    }
    
    res.json(profile);
    
  } catch (error) {

    console.log(error.message);


    /*in case the user profile id who has been entered does not match the usual id format we will still get the same message which is profile not found*/ 
    if(err.kind == 'ObjectID')
  
{
  return res.status(400).json({msg: " Profile not found"});

}
    res.status(500).send('server error');
  }

});





module.exports = router;