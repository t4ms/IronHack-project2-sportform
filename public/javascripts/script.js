console.log("----------------")
console.log("hier scritp von Script.js")
console.log("----------------")

document.addEventListener('DOMContentLoaded', () => {
 
  const button = document.getElementById('toggle-button');
  button.addEventListener('click', function(e) {
    const editForm = document.getElementById('edit-form');
    editForm.style.display="block"
  
  });

}, false);


const
  range = document.getElementById('range'),
  rangeV = document.getElementById('rangeV'),
  setValue = ()=>{
    const
      newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
      newPosition = 10 - (newValue * 0.2);
    rangeV.innerHTML = `<span>${range.value}</span>`;
    rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
  };
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);