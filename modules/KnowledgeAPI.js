'use strict';

//==============Knowledge Game Route===============

const axios = require('axios');

// Brings in verification function 
const verifyToken=require('./verification.js')

// Overall function to grab data from API to send information back to front end 
async function getBooleanFacts (request, response){


  // Brings in verification token
  const token = request.headers.authorization.split(' ')[1];
  verifyToken(token, factAPIOut);

  // Callback async function request information from API
  async function factAPIOut() {
    const url = `https://opentdb.com/api.php?amount=1&type=boolean`;
  
    try{

      // The axios request for information from API
      const results = await axios.get(url);

      // Variable for specific results for question data 
      let questionTemp = results.data.results[0].question;

      // Variable for specific results for answer data 
      let answerOut = (results.data.results[0].correct_answer === 'True' );

      // Regex for data strings return to have them presented correctly 
      let regex = /(&quot;)*(&#039;)*/g;

      // // Variable to change data string correctly and have it replaced
      let questionOut = questionTemp.replace(regex, '');
    
      // Object that contains all infromation necessary for knowledge game
      let data = {
        question: questionOut,
        answer: answerOut
      };
      
      // Sends back data to front end with all correct information
      response.status(200).send(data);
    } catch(err) {
      console.error('error from superagent', err);
      response.status(500).send('server error');
    }
  }
};


module.exports = getBooleanFacts;
