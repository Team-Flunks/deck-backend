'use strict'

//=============== Setup ===============
const verifyToken = require('./verification.js');
const axios = require('axios');
const UserInfo=require('../models/UserInfo.js');

//=============== Route Function ===============
const rewardRequestImage = async function (req, res){

  // Grab and verify token
  const token = req.headers.authorization.split(' ')[1];
  verifyToken(token, rewardAPI);

  //Callback function to be plugged into Auth0 function above
  async function rewardAPI(user) {

    //Pulling relevant information from the request
    const emailIn = user.email;

    //Find the user that sent the request in the database
    //Assumes that failure to find is not possible because of front end ordering on how we will call this route
    let person = await UserInfo.UserModel.find({ email: emailIn });
      
    //=============== Reward Creation ===============
    //Async Function format taken from Q's example
    const reward = new UserInfo.ImageModel({imageSrc: ''});
    try {
      //Set up the URL and send the request out
      let url = 'https://dog.ceo/api/breeds/image/random';
      let infoIn = await axios.get(url);
      console.log("info in on the reward server side", infoIn);

      reward.imageSrc = infoIn.data.message;

    //Error Catching
    } catch (err) {
      console.error('Reward Request Error', err);
      response.status(500).send('server error');
    }
//=============== Reward Creation ===============

    //If person does not have enough tokens return this message
    if (person[0].tokenCount < 1 ){
      res.status(500).send("Not Enough Tokens");
    }else{
      //Subtract the token from the user
      person[0].tokenCount = person[0].tokenCount - 1;
      person[0].rewardImages.push(reward);
      //Save person data with less tokens and send out the response
      person[0].save();
      //They are not waiting for token info but calculating on the front end, only send back rewqard object
      res.status(200).send(reward);

    }
  }
}

module.exports = rewardRequestImage;