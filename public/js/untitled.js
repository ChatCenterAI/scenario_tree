/*
var canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  //canvas.parent('canvas');
  background(200);
}

function draw() {
  
  ellipse(mouseX, mouseY, 10, 10);

}
*/


// http://dotinstall.com/lessons/basic_canvas_v2/39905

/*
// ここの値を変えれば解像度が変わる
var dpr = window.devicePixelRatio || 1;

var width = 0;
var height = 0;

var canvas; // = document.getElementById('canvas');
var ctx; // = canvas.getContext('2d');

function onWindowResize() {
  width =  window.innerWidth;
  height = window.innerHeight;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.scale(dpr,dpr);
  
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}

function initCanvas() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  onWindowResize();
  window.addEventListener('resize', onWindowResize);
  requestAnimationFrame(draw);
}


var lines_array = [];
var zoomScale = 1;
var zoomScaleManipulater = 0.8;

var drawLine = function(x1, y1, x2, y2){
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

var zoomCanvas = function(num){
  ctx.scale(num, num);
}

function draw(scaleMultiplier) {

  ctx.clearRect(0, 0, width, height);

  //drawLine(0, 0, 100, 200);

  ctx.save();

  ctx.translate(200, 200);
  drawLine(0, 0, 100, 200);
  zoomCanvas(zoomScale);

  ctx.restore();

  //requestAnimationFrame(draw);
}
*/