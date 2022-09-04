//declaration of global variables
let pois;
let aktPOIs;
let allPOIs = [];
let click; // only for counting if the marker where set once or not
let id;
let property;

let tableFill = document.getElementById("table") 

// declaration of event listener
document.getElementById("SubmitButton").addEventListener("click", function(){getValue(); location.reload()});


// fetch POIs
fetch("/getPoi")
    .then(response => {
        let res = response.json() // return a Promise as a result
        res.then(data => { // get the data in the promise result
            pois = data;
            console.log(pois)
        })
    })
    .catch(error => console.log(error))

// setting up and working with the map
var map = L.map('map').setView([51.96, 7.63], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/**
 * Displays all stops on the map and saves the marker in an Array
 */
setTimeout(function displayPOIsMap(){
    if(click === 0){
        for (var i = 0; i < pois.length; i++) {
            if (pois[i].geometry.type === "Polygon") {
                //console.log(pois[i].geometry.coordinates[0]);
                var coords = [];
                for (var j = 0; j < pois[i].geometry.coordinates[0].length; j++) {
                    coords.push([pois[i].geometry.coordinates[0][j][1], pois[i].geometry.coordinates[0][j][0]]);
                }
                //console.log(coords);
                var polygon = new L.polygon(coords)
                polygon.bindPopup(pois[i].properties.name + "<br>" +
                                  "ID: " + pois[i].properties.id);
                allPOIs[i] = polygon;
                polygon.addTo(map);
            }
            if (pois[i].geometry.type === "Point") {
                //console.log([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]]);
                var marker = new L.marker([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]])
                marker.bindPopup(pois[i].properties.name + "<br>" +
                                 "ID: " + pois[i].properties.id);
                allPOIs[i] = marker;
                marker.addTo(map);
            }
        }
        click++
    }
    else{
        for(var i = 0; i < allPOIs.length; i++){
            map.removeLayer(allPOIs[i]); // deletes the old marker, so there is no overlapping
        }
        click = 0;
        displayPOIsMap();
    }
}, 500)

setTimeout(function displayPOIsTable(){
    let ueberschrift = '<table class="table-mountains">' 
            +'<tr>' 
            +'<td id="ueberschrift">' 
                +'Mountians'
            +'</td>' 
            +'<td id="ueberschrift">' 
                +'Altitude' 
            +'</td>'
            +'<td id="ueberschrift">'
                +'Description'
            +'</td>'
            +'<td id="ueberschrift">' 
                +'ID' 
            +'</td>' 
        +'</tr>'
    let tableEnde = '</table>'

    for(let i = 0; i < pois.length; i++){
        property = property + '<tr>' + '<td id="inhalt">' + pois[i].properties.name + '</td>' 
                +'<td id="inhalt">' + pois[i].properties.altitude + '</td>' 
                +'<td id="inhalt">' + pois[i].properties.description + '</td>' 
                +'<td id="inhalt">' + pois[i].properties.id + '</td>' 
                +'</tr>';
    }

    tableFill.innerHTML = ueberschrift + property + tableEnde;
}, 500);


function getValue() {
    id = { "_id": document.getElementById("IDDiv").value };
    displayPoi(id);
}

function displayPoi(id) {
    for (var i = 0; i < pois.length; i++) {
        if (id === pois[i].properties.id) {

        }
    }
}


