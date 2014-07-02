var pixelation = 101;
var blur_radius = 16;

var fps = 20; // frames / second
var pixelTime = 1000 / fps; // milliseconds
var blurTime = 1500 / fps;  // milliseconds
var canvas_id = 'myCanvas'
var canvas = document.getElementById(canvas_id);
var context = canvas.getContext('2d');

var imageObj = new Image();
var image_id = 'target-image';
imageObj.id = image_id;

var manipulatedImage;

var sourceWidth;
var sourceHeight;
var destX;
var destY;

var pixel_step;
var pixel_stopping_point;
var max_pixelation;
var min_pixelation;

var blur_step;
var blur_stopping_point;
var max_blur_radius;
var min_blur_radius;

var oscillating;

function pixelateImage(into_focus, context, delta, imageObj, sourceWidth, sourceHeight, destX, destY) {
  var sourceX = destX;
  var sourceY = destY;

  var imageData = context.getImageData(sourceX, sourceY, sourceWidth, sourceHeight);
  var data = imageData.data;
  if (into_focus == true) pixelation -= 1;
  if (into_focus == false) pixelation += 1;
  if (into_focus != null) console.log('pixelation: ' + pixelation);
  delta = pixelation;

  for(var y = 0; y < sourceHeight; y += delta) {
    for(var x = 0; x < sourceWidth; x += delta) {
      var red = data[((sourceWidth * y) + x) * 4];
      var green = data[((sourceWidth * y) + x) * 4 + 1];
      var blue = data[((sourceWidth * y) + x) * 4 + 2];

      for(var n = 0; n < delta; n++) {
        for(var m = 0; m < delta; m++) {
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
}

function blurImage(into_focus, context, destX, destY, sourceWidth, sourceHeight) {
  if (into_focus) {
    blur_radius -= 1;
    stackBlurCanvasRGB( canvas_id, destX, destY, sourceWidth, sourceHeight, blur_radius )
    console.log('blur_radius: ' + blur_radius)
  } else {
    blur_radius += 1;
    stackBlurCanvasRGB( canvas_id, destX, destY, sourceWidth, sourceHeight, blur_radius )
    console.log('blur_radius: ' + blur_radius)
  }
}

// blur to specific radius
function blurTo(point) {
  blur_step = point - blur_radius;
  if (blur_step != 0) {
    blur_stopping_point = blur_radius + blur_step;
    console.log('Stepping blur ' + blur_step + ' points from ' + blur_radius + ' to ' + blur_stopping_point);
    var blurInterval = setInterval(function() {
      if (blur_step > 0) {     // blur the image
        if (blur_radius < blur_stopping_point && blur_radius < max_blur_radius) {
          manipulatedImage = imageObj;
          context.drawImage(manipulatedImage, destX, destY);
          pixelateImage(null, context, pixelation, manipulatedImage, sourceWidth, sourceHeight, destX, destY);
          blurImage(false, context, destX, destY, sourceWidth, sourceHeight);
        } else {
          console.log('stopped blurring! blur radius is ' + blur_radius);
          clearInterval(blurInterval)
        }
      } else {                // focus the image
        if (blur_radius > blur_stopping_point && blur_radius > min_blur_radius) {
          manipulatedImage = imageObj;
          context.drawImage(manipulatedImage, destX, destY);
          pixelateImage(null, context, pixelation, manipulatedImage, sourceWidth, sourceHeight, destX, destY);
          blurImage(true, context, destX, destY, sourceWidth, sourceHeight);
        } else {
          console.log('stopped focusing! blur radius is ' + blur_radius);
          clearInterval(blurInterval);
        }
      }
    }, blurTime);
  } else {
    console.log('Already blurred at radius of ' + point)
  }
}

// distort to specific pixelation
function pixelTo(point) {
  pixel_step = point - pixelation;
  if (pixel_step != 0) {
    pixel_stopping_point = pixelation + pixel_step;
    console.log('Stepping pixelation ' + pixel_step + ' points from ' + pixelation + ' to ' + pixel_stopping_point);
    var pixelInterval = setInterval(function() {
      if (pixel_step < 0) {  // reveal the image
        if (pixelation > pixel_stopping_point && pixelation > min_pixelation) {
          context.drawImage(manipulatedImage, destX, destY);
          pixelateImage(true, context, pixelation, manipulatedImage, sourceWidth, sourceHeight, destX, destY);
          stackBlurCanvasRGB( canvas_id, destX, destY, sourceWidth, sourceHeight, blur_radius )
        } else {
          console.log('stopped revealing! pixelation is ' + pixelation);
          clearInterval(pixelInterval);
        }
      } else {               // obscure the image
        if (pixelation < pixel_stopping_point && pixelation < max_pixelation) {
          context.drawImage(manipulatedImage, destX, destY);
          pixelateImage(false, context, pixelation, manipulatedImage, sourceWidth, sourceHeight, destX, destY);
          stackBlurCanvasRGB( canvas_id, destX, destY, sourceWidth, sourceHeight, blur_radius )
        } else {
          console.log('stopped obscuring! pixelation is ' + pixelation );
          clearInterval(pixelInterval);
        }
      }
    }, pixelTime);
  } else {
    console.log('Already pixelated to ' + pixelation)
  }
}

// blur oscillation
function startOscillating(a, b) {
  // blurTo(a);
  // oscillating = true;
  // while (oscillating) {
  //   blurTo(b)
  //   blurTo(a)
  // }
  // blurTo(a)
}

function stopOscillating() {

}

imageObj.onload = function() {
  sourceWidth = imageObj.width;
  sourceHeight = imageObj.height;
  destX = canvas.width / 2 - sourceWidth / 2;
  destY = canvas.height / 2 - sourceHeight / 2;

  max_pixelation = 100;
  min_pixelation = 1;

  max_blur_radius = 180;
  min_blur_radius = 0;

  manipulatedImage = imageObj;

  // draw image on page
  context.drawImage(manipulatedImage, destX, destY);
  pixelateImage(true, context, pixelation, manipulatedImage, sourceWidth, sourceHeight, destX, destY);

  // blur image
  blurImage(true, context, destX, destY, sourceWidth, sourceHeight);

  // Image Control Events
  $('#reveal-button').on('click', function() {
    pixel_step = parseInt( $('#pixel-input').val() );
    point = pixelation - pixel_step
    pixelTo(point)
  });

  $('#obscure-button').on('click', function() {
    pixel_step = parseInt( $('#pixel-input').val() );
    point = pixelation + pixel_step
    pixelTo(point)
  });

  $('#focus-button').on('click', function() {
    blur_step = parseInt( $('#blur-input').val() );
    point = blur_radius - blur_step;
    blurTo(point);
  });

  $('#blur-button').on('click', function() {
    blur_step = parseInt( $('#blur-input').val() );
    point = blur_radius + blur_step;
    blurTo(point);
  });

};

$(function() {

  imageObj.src = '../images/kind_of_a_big_dill.jpg';
  // startOscillating(5, 50);

});
