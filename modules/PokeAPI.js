'use strict'

//=============== Setup ===============
const verifyToken = require('./verification.js');
const axios = require('axios');

//=============== Route Function ===============
const pokeInfoRequest = async function (req, res) {

  // Verify Step
  const token = req.headers.authorization.split(' ')[1];
  verifyToken(token, pokeRequest);

  //The callback function
  async function pokeRequest() {

    //Variable setup
    let numPicks = [];
    let namesOut = [];
    let maxRange = 898;
    let imageOut = '';

    //Choosing 4 unique values in the range of valid pokemon indexes
    while (numPicks.length < 4) {
      let next = (Math.floor(Math.random() * (maxRange - 1)) + 1);
      if (!numPicks.includes(next)) {
        numPicks.push(next);
      }
    }

    //Choosing one of the 4 options at random to be the selected pokemon
    let targetOut = Math.floor(Math.random() * 4);

    //Gathering all the data for each pokemon index chosen
    for (let i = 0; i < 4; i++) {

      //Async Function format taken from Q's example
      try {
        //Set up the URL and send the request out
        let url = `https://pokeapi.co/api/v2/pokemon/${numPicks[i]}`;
        let infoIn = await axios.get(url);

        //Add the name into the outgoing array
        namesOut.push(infoIn.data.forms[0].name);

        //If this is the targeted pokemon also grab the image source from the info
        if (i === targetOut) {
          imageOut = infoIn.data.sprites.other['official-artwork']['front_default'];
        }

      //Error Catching
      } catch (err) {
        console.error('Poke API Error', err);
        response.status(500).send('server error');
      }
    }

    //End Result
    //Send packaged response data as object
    const data = { names: namesOut, target: targetOut, imageSrc: imageOut }
    res.status(200).send(data);
  }
}

module.exports = pokeInfoRequest;