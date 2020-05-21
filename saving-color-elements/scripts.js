import { getAccessToken } from './modules/variables.mjs';
import { getAPIKey } from './modules/variables.mjs';

var url = 'https://cc-libraries.adobe.io/api/v1/libraries/';

var myHeaders = new Headers();       
myHeaders.append('x-api-key', getAPIKey());
myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
myHeaders.append('Accept', '*/*');

function getLibraries() {

    var queryParams = '?limit=20';
    
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
    
    var libSelector = document.querySelector('#selectLibraries');
    
    for(var i=0; i<libraryCount; i++) {
        var newOption = document.createElement('option');
        var libName = libraries.libraries[i].name
        var libUrn = libraries.libraries[i].library_urn;
        newOption.value = libUrn;
        newOption.innerText = libName;
        libSelector.appendChild(newOption);

    }

    libSelector.disabled = false;
}

function onLibrariesSelect() {
  document.querySelector('#colorInput').disabled = false;
  document.querySelector('#selectProfile').disabled = false;
  document.querySelector('#btnAddElement').disabled = false;
}

function addElement() {
    var libSelector = document.querySelector('#selectLibraries');
    var selectedLibrary = libSelector.options[libSelector.selectedIndex].value;
    var color = document.querySelector('#colorInput').value;
    var profile = document.querySelector('#selectProfile').value;
    var colorName = document.querySelector('#colorName').value;

    url = url + selectedLibrary + '/elements/';

    // Convert hex color to RGB
    var r = parseInt(color.substring(1,3), 16);
    var g = parseInt(color.substring(3,5), 16);
    var b = parseInt(color.substring(5,7), 16);

    if(colorName) {
      color = colorName;
    }
    


    
    var element = {
      "name": color,
      "type": "application/vnd.adobe.element.color+dcx",
      "client": {
        "deviceId": "DEV_ID",
        "device": "DEV",
        "app": "APP"
      },
      "representations": [
        {
          "type": "application/vnd.adobe.color+json",
          "relationship": "primary",
          "color#data": {
            "mode": "RGB",
            "profile": profile,
            "value": {
              "r": r,
              "g": g,
              "b": b
            }
          }
        }
      ]
    }
    
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'POST',
      body: JSON.stringify(element),
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => onAddElementResult(result))
      .catch(error => onLibrariesError(error));

}

function onAddElementResult(result) {
    console.log(result);
}

function onLibrariesError(error) {
  console.log(error);
}

document.querySelector('#btnGetLibraries').addEventListener('click', getLibraries);
document.querySelector('#selectLibraries').addEventListener('change', onLibrariesSelect);
document.querySelector('#btnAddElement').addEventListener('click', addElement);