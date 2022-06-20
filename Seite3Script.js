// importing elements from html
let deleteEl = document.getElementById("delete");
let deleteInputEl = document.getElementById("deleteInput")
let deletResultsEl = document.getElementById("deleteResults")


const display = (data) =>{
  // data = JSON.stringify(data)
  for(let each of data){
    let para = document.createElement('p')
    each = JSON.stringify(each)
    para.innerHTML = each
    getResultel.appendChild(para)
  }
}

const deleteMethod = () =>{
        let url = deleteInputEl.value;
        let options = {
            method: "DELETE"
        };
        fetch(url, options)
            .then(function(response) {
                alert("Data deleted successfully")
            })
            
}

deleteEl.addEventListener("submit", function(event){
    event.preventDefault();
    deleteMethod();
  });
