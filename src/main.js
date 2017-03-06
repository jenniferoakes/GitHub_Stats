let fetch = require('node-fetch');
let username = process.argv[2];

let promise = fetch(
  'https://api.github.com/users/' + process.argv[2],
  {
    method: 'GET',
    headers: {
      Authorization: 'token ' + process.argv[3] //authentication with an API is a token/key
    },
    body: '...' //POST (creating data) or PATCH (updating)
  }
);



promise.then( function handleResponse(responseObj) { //do that thing I asked you, 'fetch', then do this
console.log(responseObj.status); //we want this to be in the 200 range

if (responseObj.status > 199 && responseObj.status < 300) {
    //in here, I know the request was successful

    responseObj.json().then( function printData(userData) {
      console.log( userData.name );
    }); //one is text one is json

} else {
  //now I know there was a problem
  //maybe we should tell the user
  console.log( "There was a problem", responseObj.status );
}

} );
