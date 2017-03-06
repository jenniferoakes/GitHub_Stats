let fetch = require('node-fetch');
let username = process.argv[2];

//First Promise - Their actual name and location

let promise = fetch(
  'https://api.github.com/users/' + process.argv[2],
  {
    method: 'GET',
    headers: {
      Authorization: 'token ' + process.argv[3] //authentication with an API is a token/key
    }
  }
);

promise.then( function getUserName(statusObj) { //do that thing I asked you, 'fetch', then do this
console.log(statusObj.status); //we want this to be in the 200 range

if (statusObj.status > 199 && statusObj.status < 300) { //do this to see if request was successful

  statusObj.json().then( function printData(userData) { //other option is text vs json
    console.log( 'Username: ', userData.name, 'User location: ',userData.location );
  });

} else { //there was a problem....tell the user
  console.log( "There was a problem. Please wait.", statusObj.status );
}
} );

//SECOND PROMISE - List the repo they own with the most stars

let promise2 = fetch(
  'https://api.github.com/users/' + process.argv[2] + '/repos',
  {
    method: 'GET',
    headers: {
      Authorization: 'token ' + process.argv[3] //authentication with an API is a token/key
    }
  }
);

promise2.then( function getRepoData(statusObj) { //do that thing I asked you, 'fetch', then do this
// console.log(statusObj.status); //we want this to be in the 200 range

  if (statusObj.status > 199 && statusObj.status < 300) { //do this to see if request was successful

    statusObj.json().then( function printData(repoData) { //other option is text vs json
      let mostStars = 0;
      let name;
      let ownerName;
      repoData.forEach(function stargazersCount(each) {
        // console.log(each);
        if (each.stargazers_count > mostStars) {
          mostStars = each.stargazers_count;
          repoName = each.name;
          ownerName = each.owner.login;
        }
      });
      console.log('Repo with the most stars: ', mostStars, 'Repo name: ', repoName, 'Owner name: ', ownerName);

      //promise inside of promise
      // For the repo they own with the most stars, find the contributor with the second most contributions.
      // Use the /repos/:owner/:repo/contributors endpoint
      let url = 'https://api.github.com/' + 'repos' + '/' + ownerName + '/' + repoName + '/contributors';
      // console.log(url);
      let promise3 = fetch(
        url,
        {
          method: 'GET',
          headers: {
            Authorization: 'token ' + process.argv[3] //authentication with an API is a token/key
          }
        }
      );

      promise3.then( function contributor(statusObject) { //do that thing I asked you, 'fetch', then do this
        console.log("Status Code for promise3", statusObject.status); //we want this to be in the 200 range

        if (statusObject.status > 199 && statusObject.status < 300) {

          statusObject.json().then( function contributorData(contributors) { //other option is text vs json
            //would put new vars here
            contributors.forEach(function secondContributor(eachContributor) {
              console.log(eachContributor.login);

            });
          });

        } else { //there was a problem....tell the user
          console.log( "There was a problem. Please wait.", statusObj.status );
        }
      });

    });

  } else { //there was a problem....tell the user
    console.log( "There was a problem. Please wait.", statusObj.status );
  }

} );

//Third Promise - find the contributor with the second most contributions
//
// let promise3 = fetch(
//   'https://api.github.com/users/' + process.argv[2] + '/repos',
//   {
//     method: 'GET',
//     headers: {
//       Authorization: 'token ' + process.argv[3] //authentication with an API is a token/key
//     }
//   }
// );
//
// promise3.then( function getContrData(statusObj) { //do that thing I asked you, 'fetch', then do this
// console.log(statusObj.status); //we want this to be in the 200 range
//
// if (statusObj.status > 199 && statusObj.status < 300) { //do this to see if request was successful
//
//     statusObj.json().then( function printData(contrData) { //other option is text vs json
//       console.log( Number( contrData ) );
//     });
//
// } else { //there was a problem....tell the user
//   console.log( "There was a problem. Please wait.", statusObj.status );
// }
// } );
