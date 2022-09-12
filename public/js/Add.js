//declaration of global variables
let count = 0;
let data = []; // the data that is later gonna be posted as an string
let newID; // new ID for the data
let newName; // new Name for the data
let newURL;
let newAltitude;
let snippet;
let helpNewURL;
let x = document.getElementById("demo");
let gezeichnetesPolygon = [];
let newType;

//list of all EventListeners
document.getElementById("SubmitButton").addEventListener("click", function () { getValues(), setTimeout(() => {  window.location = "AddedPoi.html"; }, 500);});


// setting up and working with the map
var map = L.map('map').setView([51.96, 7.63], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  draw: {
    circlemarker: false,
    circle: false,
    polyline: false,
    rectangle: false
  },
  edit: {
    featureGroup: drawnItems,
    edit: false
  }
});
map.addControl(drawControl);

/**
 * handles the draw event for a marker
 */

// gezeichnetes Polygon initialisieren
map.on(L.Draw.Event.CREATED, function (event) {
  var layer = event.layer;
  drawnItems.addLayer(layer);
  updateText();
});
map.on("draw:edited", function (event) {
  updateText();
});

function updateText() {
  // to convert L.featureGroup to GeoJSON FeatureCollection
  document.getElementById("geojsontextarea").value = JSON.stringify(drawnItems.toGeoJSON());
  var gezeichnetesGeojson = drawnItems.toGeoJSON();
  console.log(gezeichnetesGeojson);
  gezeichnetesGeojson.features.forEach(element1 => {
    newType = element1.geometry.type;
    element1.geometry.coordinates.forEach(element2 => {
      gezeichnetesPolygon.push(element2);
    })
  })
}

/**
 * takes the values out of the input and starts the fetch post function
 */
function getValues() {
  // potenzielle Werte aus dem Textfeld ins Geojson übernehmen
  //console.log(document.getElementById("textfeld").value);
  if(document.getElementById("geojsontextarea").value === "" && document.getElementById("textfeld").value !== "") {
    try {
      object = JSON.parse(document.getElementById("textfeld").value);
    } catch (error) {
        is_json = false;
        //alert("Invalid JSON string");
        console.log("Invalid JSON string")
        document.getElementById("FehlerDiv2").style.display = "block";
      }
  
    document.getElementById("geojsontextarea").value = document.getElementById("textfeld").value;
    //console.log(document.getElementById("geojsontextarea").value);
    var gezeichnetesGeojson = document.getElementById("geojsontextarea").value;
    gezeichnetesGeojson = JSON.parse(gezeichnetesGeojson);
    console.log(gezeichnetesGeojson);
    gezeichnetesGeojson.features.forEach(element1 => {
      newType = element1.geometry.type;
      element1.geometry.coordinates.forEach(element2 => {
        gezeichnetesPolygon.push(element2);
      })
    })
  }

  //console.log(gezeichnetesPolygon);
  newName = document.getElementById("NameDiv").value;
  newAltitude = document.getElementById("AltitudeDiv").value;
  newURL = document.getElementById("URLDiv").value;
  newID = document.getElementById("IDDiv").value;
  if (newName === "" || newAltitude === "" || newURL === "" || newID === "" || gezeichnetesPolygon === null || gezeichnetesPolygon === "") {
    console.log("Nicht alle Felder wurden ausgefüllt")
    document.getElementById("FehlerDiv").style.display = "block";
  }
  else {
    // teste, ob es eine Wikipedia URL ist
    if (newURL.startsWith("https://en.wikipedia.org/wiki/") || newURL.startsWith("https://de.wikipedia.org/wiki/")) {
      // Anfrage an die Wikipedia API zusammenbauen
      helpNewURL = newURL.substr(30, newURL.length - 30)
      console.log(helpNewURL);
      /**while (newURL.includes("_")) {
        newURL.replace("_", "%20");
      }*/
      anfrage = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + helpNewURL + "&format=json&origin=*";
      console.log(anfrage);


      fetch(anfrage)
        .then(response => {
          console.log(response);
          let result = response.json() // return a Promise as a result
          result.then(data => { // get the data in the promise result
            console.log(data);
            snippet = data.query.search[0].snippet;
            console.log(snippet);
            dataErstellen();
          })
        })
        .catch(error => console.log(error))

      // Erstellen eines XHR-Objektes für die Anfrage des Wikipedia Artikels
      /*var xhr = new XMLHttpRequest()
      xhr.open("GET", anfrage, true);
      xhr.send();
      console.log(xhr);

      /**
       * Callback Funktion zum Erstellen der Bushaltestellen-Objekte und der Berechnung der Entfernungen dorthin
       
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //console.log(this.responseText);
          res = JSON.parse(this.responseText);
          //console.log(res);
          snippet = res.query.search[0].snippet;
        };

      function statechangecallback() {
        if (xhr.status == "200" && xhr.readyState == 4) {
          console.log(xhr.responseText);
          res = JSON.parse(xhr.responseText);
          console.log(res);
          snippet = res.query.search.snippet;
          dataErstellen();
        }
      }      

      function errorcallback(){
        if (xhr.status == "404" || xhr.status == "403" || xhr.readyState == 0){
            console.log(xhr.status)
        }
      }

      xhr.onerror = errorcallback;
      xhr.onreadystatechange = statechangecallback;*/
    }
    else { 
      snippet = "keine Information vorhanden";
      dataErstellen();
   }
  }

}

/**
 * Erstellt die Daten (mountains) die in die 
 * Datenbank hochgeladen werden sollen
 */
function dataErstellen(){
  data = {
    "id": newID,
    "type": "Feature",
    "geometry": {
      "type": newType,
      "coordinates": gezeichnetesPolygon
    },
    "properties": {
      "name": newName,
      "altitude": newAltitude,
      "url": newURL,
      "description": snippet
    }
  };
  console.log(data);
  postMarker(data);
}

/**
 * Creates an fetch to post the new Marker
 */
function postMarker(doc) {
  if (count === 0) {
    fetch("/addPoi",
      {
        headers: { 'Content-Type': 'application/json' },
        method: "post",
        body: JSON.stringify(doc)
      })
  }
};


/**
 * Returns the Geolocation of the browser
 * @returns {coordinates}
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

/**
 * shows the position of the browser 
 * @param {coordinates} position 
 */
function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;

  // GeoJSON "Rahmenelement"
  let geojson = {
    "type":"FeatureCollection",
    "features":[{
      "type":"Feature",
      "properties":{},
      "geometry":{
        "type":"Point",
        "coordinates":[]
      }
    }]
  }

  geojson.features[0].geometry.coordinates = [position.coords.longitude, position.coords.latitude];
  document.getElementById("textfeld").value = JSON.stringify(geojson);
}