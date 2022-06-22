//declaration of global variables
let count = 0;
let data = []; // the data that is later gonna be posted as an string
let newMarker; // new Marker for the data
let newID; // new ID for the data
let newName; // new Name for the data

//list of all EventListeners
document.getElementById("SubmitButton").addEventListener("click",function(){getValues(); window.location = "AddedPoi.html"});

// setting up and working with the map
var map = L.map('map').setView([51.96, 7.63], 12);
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
        polygon: false,
        rectangle: false
    },
    edit: {
        featureGroup: drawnItems,
        remove: false,
        edit: false
    }
});
map.addControl(drawControl);

/**
 * handles the draw event for a marker
 */
map.on(L.Draw.Event.CREATED, function (e) {
    newMarker = [e.layer._latlng.lat, e.layer._latlng.lng];
    var nMarker = new L.Marker([e.layer._latlng.lat, e.layer._latlng.lng]);
    nMarker.addTo(map);
});

/**
 * takes the values out of the input and starts the fetch post function
 */
function getValues(){
  newName = document.getElementById("NameDiv").value;
  newID = document.getElementById("IDDiv").value;
  if(newName === "" || newID === ""){
    console.log("Nicht alle Felder wurden ausgefüllt")
    document.getElementById("FehlerDiv").style.display = "block";
  }
  else{
    data = {
      "type": "Feature",
      "properties": {
        "shape": "Marker",
        "name": newName,
        "category": "default"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          newMarker[1],
          newMarker[0]
        ]
      },
      "id": newID
    };
    postMarker(data);
  }
}

/**
 * Creates an fetch to post the new Marker
 */
 function postMarker(doc){
  if(count === 0){
    fetch("/addPoi",
    {
      headers: {'Content-Type': 'application/json'},
      method: "post",
      body: JSON.stringify(doc)
    })
  }
};