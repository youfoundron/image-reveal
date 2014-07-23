var progress = 0;
var current_progress;
var bar_total_width = parseInt( $('#progress-bar-div').css('width') );
var bar_width;

var timer_start
var timer_now;
var timer_end;
var duration;

function updateProgress(newProgress) {
  if (newProgress < 100) { // still revealing
    // console.log('still hidden')
    progress = Math.round(newProgress)
    updatePercent();
    updateProgressBar();
  } else {              // revealed
    progress = 100;
    updatePercent();
    updateProgressBar();
    console.log('progress complete, revealing image')
    revealImage();
  }
}

function updatePercent() {
  $('#percent').text(progress + '%')
}

function updateProgressBar() {
  bar_width = (progress / 100) * bar_total_width + 5
  $('#progress-bar').css('width', bar_width + 'px');
}

function startTimer(_timer_start, duration_hours, callback) {
  timer_start = _timer_start;
  timer_now = new Date()
  timer_end = new Date()
  timer_end.setTime( timer_end.getTime() + duration_hours * 3600000 )
  duration = timer_end.valueOf() - timer_start.valueOf()
  callback();
}

function updateTime() {
  var timerInterval = setInterval( function() {
    if (timer_now - timer_start >= 0) { // timer begins
      timer_now = new Date();

      if (timer_now - timer_end >= 0) clearInterval(timerInterval)

      current_progress = 100 * (timer_now.valueOf() - timer_start.valueOf()) / duration
      updateProgress(current_progress)
    }
  }, 0.1);
}

$(function() {
  var start = new Date(); // timer starts now
  var hours = 0.5/60; // half-minute long timer
  // var hours = 3; // four hour long timer
  startTimer(start, hours, function(){
    updateTime();
  });
});
