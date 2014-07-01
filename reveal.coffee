pixelation = 100

focusImage = (into_focus, context, imageObj, sourceWidth, sourceHeight, destX, destY) ->
  sourceX = destX
  sourceY = destY
  imageData = context.getImageData sourceX, sourceY, sourceWidth, sourceHeight
  data = imageData.data
  for y in [0...sourceHeight]
      y += pixelation
      for x in [0...sourceWidth]
        x += pixelation
        red = data[((sourceWidth * y) + x) * 4]
        green = data[((sourceWidth * y) + x) * 4 + 1]
        blue = data[((sourceWidth * y) + x) * 4 + 2]
        for n in [n...pixelation]
          for m in [m...pixelation]
            if x + m < sourceWidth
              data[((sourceWidth * (y + n)) + (x + m)) * 4] = red
              data[((sourceWidth * (y + n)) + (x + m)) * 4 + 1] = green
              data[((sourceWidth * (y + n)) + (x + m)) * 4 + 2] = blue
# overwrite original image
  context.putImageData(imageData, destX, destY)
  if into_focus then pixelation -= 1
  else pixelation += 1

fps = 20
timeInterval = 1000 / fps
canvas = document.getElementById('myCanvas')
context = canvas.getContext('2d')
imageObj = new Image()

imageObj.onload = () ->
  sourceWidth = imageObj.width
  sourceHeight = imageObj.height
  destX = canvas.width / 2 - sourceWidth / 2
  destY = canvas.height / 2 - sourceHeight / 2

  # initial out of focus rendering...
  context.drawImage imageObj, destX, destY
  focusImage context, imageObj, sourceWidth, sourceHeight, destX, destY

  $('#reveal-button').on 'click', () ->
    focusImage true, context, imageObj, sourceWidth, sourceHeight, destX, destY
    console.log '-' + pixelation

  $('#obscure-button').on 'click', () ->
    focusImage false, context, imageObj, sourceWidth, sourceHeight, destX, destY
    console.log '+' + pixelation

  $('#tweet-button').on 'click', () ->
    alert 'Sent tweet! #picklehumor'

$ ->
  imageObj.src = './kind_of_a_big_dill.jpg'
