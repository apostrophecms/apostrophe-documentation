document.addEventListener('DOMContentLoaded', function() {
  var h1 = document.querySelectorAll('h1');
  if(h1[0].innerText.length > 30) {
    h1[0].classList.add('long');
  }
});