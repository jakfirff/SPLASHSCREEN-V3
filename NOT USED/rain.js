var image = document.getElementById('image');
image.onload = function() {
  var engine = new RainyDay({
    image: this
  });
  engine.rain([ [3, 2, 2] ], 100);
};

image.src = 'lol.png';