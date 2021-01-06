// console.log("----------------")
// console.log("hier scritp von Script.js")
// console.log("----------------")

document.addEventListener('DOMContentLoaded', () => {
 
  const button = document.getElementById('toggle-button');
  button.addEventListener('click', function(e) {
    const editForm = document.getElementById('edit-form');
    editForm.style.display="block"
  
  });

}, false);
