document.getElementById('textButton').addEventListener('click', function() {
    document.getElementById('textBox').classList.add('active');
    document.getElementById('codeBox').classList.remove('active');
  });

  document.getElementById('codeButton').addEventListener('click', function() {
    document.getElementById('codeBox').classList.add('active');
    document.getElementById('textBox').classList.remove('active');
  });

  /* temporary code for moving onto previous and next journal pages */
  document.getElementById('left-arrow').addEventListener('click', function () {
    console.log('LEFT ARROW CLICKED');
  });

  document.getElementById('right-arrow').addEventListener('click', function () {
    console.log('RIGHT ARROW CLICKED');
  });