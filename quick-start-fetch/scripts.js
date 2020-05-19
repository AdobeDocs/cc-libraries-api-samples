import { getAccessToken } from './modules/variables.mjs';
import { getAPIKey } from './modules/variables.mjs';

var url = 'https://cc-libraries.adobe.io/api/v1/libraries/';

var myHeaders = new Headers();       
myHeaders.append("x-api-key", getAPIKey());
myHeaders.append("Authorization", "Bearer " + getAccessToken());
myHeaders.append("Accept", "*/*");

function getLibraries() {

    var queryParams = "?limit=20";
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(url + queryParams, requestOptions)
      .then(response => response.text())
      .then(result => onLibrariesResult(result))
      .catch(error => onLibrariesError(error));
}

function onLibrariesResult(result) {
    var libraries = JSON.parse(result);
    var libraryCount = libraries.total_count;
    
    document.querySelector('#numLibraries').innerHTML = libraryCount;
    var libSelector = document.querySelector('#listLibraries');
    
    for(var i=0; i<libraryCount; i++) {
        var newItem = document.createElement("li");
        var newLink = document.createElement("a");

        var libName = libraries.libraries[i].name
        var libId = libraries.libraries[i].id;
        var libUrn = "https://assets.adobe.com/libraries/" + libraries.libraries[i].library_urn;

        newLink.innerText = libName;
        newLink.href = libUrn;
        
        newItem.appendChild(newLink);
        libSelector.appendChild(newItem);

    }
    console.log(libraries.total_count);
}

function onLibrariesError(error) {
    document.querySelector('#error').innerHTML = error;
}

document.querySelector('#btnGetLibraries').addEventListener('click', getLibraries);

