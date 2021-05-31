// const UserModel = require('../models/UserInfo.js');
// const verifyToken = require('./verification.js');
// const getKey = require('./verification.js');



// const GameUser = {}; 





// //Function to grab a user 
// GameUser.getAUser = async function (request,response) {
//   const token = req.headers.authorization.split(' ')[1];
//   verifyToken(token, singleUserData);

//   async function singleUserData(user) {
//     //Legacy variable names, edit here
//     let Users = await UserInfo.UserModel.find({ email: user.email });
//     console.log("Server Side return of Single User Pull");
//     console.log(Users[0]);
//     //if the user isn't in DB yet maybe create a new user with the info passed in here
//     if (!Users.length) {
//       console.log("Server Side Single User Pull Found Nothing");
//       res.send([]);
//     }
//     //Send the data out
//     res.send(Users[0]);
//   }
// }




//Function for user update in scores 
// GameUser.userUpdate = async function (request, response) {

//   // Authentication step
//   const token = request.headers.authorization.split(' ')[1];
//   verifyToken(token, updateUserScore);

//   // Callback function
//   async function updateUserScore(user) {
//     console.log(request.params, request.query)
//     const index = parseInt(request.params.index);
//     const newGameScore = {};
//     const email = user.email;
//     await UserModel.find({ email }, (err, person) => {
//       if (err) console.log(err);
//       person[0].gameInfo.splice(index, 1, newGameScore);
//       person[0].save();
//       response.send(person[0].gameInfo);
//     })
//   }
// }

// module.exports = GameUser;
