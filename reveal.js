var pixelation = 101;

function focusImage(into_focus, context, imageObj, sourceWidth, sourceHeight, destX, destY) {
  var sourceX = destX;
  var sourceY = destY;

  var imageData = context.getImageData(sourceX, sourceY, sourceWidth, sourceHeight);
  var data = imageData.data;

  for(var y = 0; y < sourceHeight; y += pixelation) {
    for(var x = 0; x < sourceWidth; x += pixelation) {
      var red = data[((sourceWidth * y) + x) * 4];
      var green = data[((sourceWidth * y) + x) * 4 + 1];
      var blue = data[((sourceWidth * y) + x) * 4 + 2];

      for(var n = 0; n < pixelation; n++) {
        for(var m = 0; m < pixelation; m++) {
          if(x + m < sourceWidth) {
            data[((sourceWidth * (y + n)) + (x + m)) * 4] = red;
            data[((sourceWidth * (y + n)) + (x + m)) * 4 + 1] = green;
            data[((sourceWidth * (y + n)) + (x + m)) * 4 + 2] = blue;
          }
        }
      }
    }
  }

  // overwrite original image
  context.putImageData(imageData, destX, destY);
  if (into_focus) {
    pixelation -= 1;
  } else {
    pixelation += 1;
  }
}

var fps = 20; // frames / second
var timeInterval = 1000 / fps; // milliseconds
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var imageObj = new Image();

imageObj.onload = function() {
  var sourceWidth = imageObj.width;
  var sourceHeight = imageObj.height;
  var destX = canvas.width / 2 - sourceWidth / 2;
  var destY = canvas.height / 2 - sourceHeight / 2;
  var step;
  var stopping_point;

  context.drawImage(imageObj, destX, destY);
  focusImage(true, context, imageObj, sourceWidth, sourceHeight, destX, destY);

  // $('#reveal-button').on('click', function() {
  //   step = $('#step-input').val();
  //   stopping_point = pixelation - step
  //   console.log('Stepping down ' + step + ' points from ' + pixelation )
  //   var intervalId = setInterval(function() {
  //     context.drawImage(imageObj, destX, destY);
  //     if (pixelation < stopping_point) {
  //       clearInterval(intervalId);
  //     } else {
  //       focusImage(true, context, imageObj, sourceWidth, sourceHeight, destX, destY);
  //     }
  //   }, timeInterval);
  //   console.log('-' + pixelation)
  // });

  $('#reveal-button').on('click', function() {
    step = $('#step-input').val();
    stopping_point = pixelation - step
    console.log('Stepping down ' + step + ' points from ' + pixelation )
    var intervalId = setInterval(function() {
      context.drawImage(imageObj, destX, destY);
      focusImage(true, context, imageObj, sourceWidth, sourceHeight, destX, destY);
      if (pixelation < stopping_point || pixelation < 1) {
        clearInterval(intervalId);
      }
    }, timeInterval);
    console.log('-' + pixelation)
  });

  $('#obscure-button').on('click', function() {
    step = $('#step-input').val();
    stopping_point = pixelation + step
    console.log('Stepping up ' + step + ' points from ' + pixelation )
    var intervalId = setInterval(function() {
      context.drawImage(imageObj, destX, destY);
      focusImage(false, context, imageObj, sourceWidth, sourceHeight, destX, destY);
      if (pixelation > stopping_point || pixelation > 99) {
        clearInterval(intervalId);
      }
    }, timeInterval);
    console.log('-' + pixelation)
  });

  // $('#tweet-button').on('click', function() {
  //   alert('Sent tweet! #picklehumor')
  // });

  // var intervalId = setInterval(function() {
  //   context.drawImage(imageObj, destX, destY);
  //
  //   if(pixelation < 1) {
  //     clearInterval(intervalId);
  //   }
  //   else {
  //     focusImage(context, imageObj, sourceWidth, sourceHeight, destX, destY);
  //   }
  //
  // }, timeInterval);
};

$(function() {

  imageObj.src = './kind_of_a_big_dill.jpg';

});
