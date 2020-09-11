const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
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



//@route DELETE api/profile

//@description  delete profile user profile and post
//@access Private



router.delete('/', auth, async(req, res) =>{

  try {

    //@todo- remove a user post

    //remove a particular  user profile
     await Profile.findOneAndRemove({user: req.user.id});
     
     //remove a particular user
     await User.findOneAndRemove({_id: req.user.id});
    
    
     res.json({msg: "The user has been removed"});
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error');
  }

});



//@route PUT api/profile/xperience

//@description  Add profile experience
//@access Private


router.put('/experience', [auth,
   [
body('title', 'Title is required')
.not()
.isEmpty(),

body('company', 'company is required')
.not()
.isEmpty(),

body('from', 'The from date is required')
.not()
.isEmpty()


] ], 

async(req, res) =>{

  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;




  const newExp ={
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }


  //update profile


/*
  const experienceFields = {}; //initialization


  experienceFields = req.user.id;


if(title) experienceFields.title = title;
if(company) experienceFields.company = company;
if(location) experienceFields.location= locations;
if(from) experienceFields.from = from;
if(to) experienceFields.to = to;
if(current) experienceFields.current = current;
if(description) experienceFields.description = description;

*/


  try {

    let profile = await Profile.findOne({user: req.user.id});
    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);

/*
    if(profile){
      //update
  
      profile = await Profile.findOneAndUpdate(
        {user: req.user.id}, 
        {$set: experienceFields},
        {new: true}
        )
        res.json(profile);  
      }
    */
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});



//@route DELETE api/profile/experience/:exp_id

//@description  DELETE profile experience
//@access Private



router.delete('/experience/:exp_id', auth, async(req, res) =>{

  try {

    //Get the particular profile
     const profile =  await Profile.findOne({user: req.user.id});
    
    //get the index of the element to be removed
    const removeindex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    
    profile.experience.splice(removeindex, 1);
    
    await profile.save();
    res.json(profile);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }

});






//@route PUT api/profile/education

//@description  Add education to profile
//@access Private


router.put('/education', [auth,
  [
body('school', 'school is required')
.not()
.isEmpty(),

body('degree', 'Degree is required')
.not()
.isEmpty(),

body('fieldofstudy', 'The field of study  is required')
.not()
.isEmpty(),

body('from', 'The from date is required')
.not()
.isEmpty()


] ], 

async(req, res) =>{

 const errors = validationResult(req);
 
 if(!errors.isEmpty()){
   return res.status(400).json({errors: errors.array()});
 }

 
 const {
  school,
  degree,
  fieldofstudy,
  from,
  to,
  current,
  description
} = req.body;

 const newEdu  = {
  school,
  degree,
  fieldofstudy,
  from,
  to,
  current,
  description
} ;


try {

  const profile = await Profile.findOne({user: req.user.id});

  profile.education.unshift(newEdu);

  await profile.save();

  res.json(profile);

  
} catch (error) {

  console.error(error.message)
  res.status(500).send('server error');
  
}


});





//@route DELETE api/profile/education/:exp_id

//@description  DELETE profile experience
//@access Private



router.delete('/education/:edu_id', auth, async(req, res) =>{

  try {

    //Get the particular profile
     const profile =  await Profile.findOne({user: req.user.id});
    
    //get the index of the element to be removed
    const removeindex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    
    profile.education.splice(removeindex, 1);
    
    await profile.save();
    res.json(profile);
    
  } 
  
  catch(error) {
    console.error(error.message);
    res.status(500).send('server error');
  }

});



//@route GET api/profile/github/:Username

//@description  Get a particuar user repos from github
//@access Public

router.get('/github/:username', (req, res) =>{
  try {

    const options ={
      uri: `https://api.github.com/users/${req.params.username}/repos?per_pages=5&
      sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=
      ${config.get('githubSecret')}`,

      method: 'GET',

      headers: {'user-agent': 'node.js'}
    };

    request(options, (error, response, body) => {
      if(error) console.error(error);

      if(res.statusCode!== 200){
        res.status(404).json({msg: 'No Github profile found'});
      };
      res.json(JSON.parse(body));
    })
    
  } catch (error) {
    console.error(err.message);
    return res.status(500).send('Server Error');
    
  }
});



module.exports = router;