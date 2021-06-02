'use strict';

//==============Setup===============
const axios = require('axios');
const verifyToken = require('./verification.js')

//==============Knowledge Game Route===============

// Overall function to grab data from API to send information back to front end 
async function getBooleanFacts(request, response) {

  // Brings in verification token
  const token = request.headers.authorization.split(' ')[1];
  verifyToken(token, factAPIOut);

  // Callback async function request information from API
  async function factAPIOut() {
    
    //Make the call out to the API
    try {
      // The axios request for information from API
      const url = `https://opentdb.com/api.php?amount=1&type=boolean`;
      const results = await axios.get(url);

      // Variable for specific results for question info 
      let questionTemp = results.data.results[0].question;
      let answerOut = (results.data.results[0].correct_answer === 'True');

      // Regex for data strings return to have them presented correctly, we got strange errors with quotes 
      let regex = /(&quot;)*(&#039;)*(&rdquo;)*(&ldquo;)*(&rsquo;)*(&lsquo;)*/g;
      let questionOut = questionTemp.replace(regex, '');

      // Object that contains all infromation necessary for knowledge game
      let data = {
        question: questionOut,
        answer: answerOut
      };

      // Sends back data to front end with all correct information
      response.status(200).send(data);

      //Error handling
    } catch (err) {
      console.error('error from superagent', err);
      response.status(500).send('server error');
    }
  }
};


module.exports = getBooleanFacts;
