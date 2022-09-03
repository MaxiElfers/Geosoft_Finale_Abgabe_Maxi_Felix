/**************************
*** All Event Listeners ***
**************************/
let addElem = document.getElementById("AddElem")
let displayElem = document.getElementById("DisplayElem")
let deleteElem = document.getElementById("DeleteElem")
let changeElem = document.getElementById("ChangeElem")

addElem.addEventListener("click", function(){window.location.href = "http://localhost:3000/add";})
displayElem.addEventListener("click", function(){window.location.href = "http://localhost:3000/display";})
deleteElem.addEventListener("click", function(){window.location.href = "http://localhost:3000/delete";})
changeElem.addEventListener("click", function(){window.location.href = "http://localhost:3000/change";})