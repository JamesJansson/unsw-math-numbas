// Next
// Divide axis into 1,2,5 over 10^0, 10^1, 10^2, ...
// Make a, b, c parameters


// Code partially inspired by 
// Use student input in a JSXGraph diagram by Christian Lawson-Perfect
// https://numbas.mathcentre.ac.uk/question/2223/use-student-input-in-a-jsxgraph-diagram/

// Get equation, interpret
// var equationString = question.parts[0].gaps[0].display.studentAnswer();
var compiledExpression = Numbas.jme.compile(equationString, scope);
if(compiledExpression === null) {
  throw(new Error('No equation'));
}

function equation(x){
  // return a*x*x + b*x + c;
  // Create a JME scope with the variable x set to the given value.
  var nscope = new Numbas.jme.Scope([
      Numbas.jme.builtinScope,
      {variables: {x: new Numbas.jme.types.TNum(x)}}
  ]);
  return Numbas.jme.evaluate(compiledExpression, nscope).value;
}

// Determine the rough min and max range, given the domain of the question
var length = x_1 - x_0;
var xTestStepSize = length / 10;
var fMin, fMax;
for (var xTest = x_0; xTest <= x_1; xTest += xTestStepSize) {
  var fVal = equation(xTest);
  if (fMax === undefined) {
    fMax = fVal;
  }
  if (fMin === undefined) {
    fMin = fVal;
  }
  if (fVal > fMax) {
    fMax = fVal;
  }
  if (fVal < fMin) {
    fMin = fVal;
  }
}
var yBuffer = (fMax - fMin) / 7;
yBoundMax = Math.ceil(fMax + yBuffer);
yBoundMax = yBoundMax < yBuffer ? yBuffer : yBoundMax;
yBoundMin = Math.floor(fMin - yBuffer);
yBoundMin = yBoundMin > -yBuffer ? -yBuffer : yBoundMin;

var xBuffer = (x_1 - x_0) / 7;
xBoundMax = Math.ceil(x_1 + xBuffer);
xBoundMax = xBoundMax < xBuffer ? xBuffer : xBoundMax;
xBoundMin = Math.floor(x_0 - xBuffer);
xBoundMin = xBoundMin > -xBuffer ? -xBuffer : xBoundMin;

var div = Numbas.extensions.jsxgraph.makeBoard('400px','400px', 
  {
    boundingBox: [xBoundMin, yBoundMax, xBoundMax, yBoundMin], // xmin, ymax, xmax, ymin
    axis: false,
    showNavigation: false,
    grid: true
  });

var board = div.board;

function optimalTickDistance(minVal, maxVal, targetTicks) {
  // optimal ticks should be between 10 and 25
  var dist = maxVal -minVal;
  // Determine optimal ticks
  var axisSpaceMultiple = [1, 2, 5];
  var order = 1;

  // var maxTickDist = dist/10;
  // var minTickDist = dist/25;
  var targetTickDist = dist/targetTicks;
  // var log10max = Math.log(maxTickDist) * Math.LOG10E;
  // var log10min = Math.log(minTickDist) * Math.LOG10E;
  var targetLog10 = Math.log(targetTickDist) * Math.LOG10E;
  
  var exponent = Math.floor(targetLog10);
  var remainder = targetLog10 - exponent;

  // Try 1
  var multiple = 1;
  var bestDiff = Math.abs(Math.log(1) * Math.LOG10E - remainder);
  // Try 2
  var tryDiff = Math.abs(Math.log(2) * Math.LOG10E - remainder);
  if (tryDiff < bestDiff) {
    bestDiff = tryDiff;
    multiple = 2;
  }
  // Try 5
  var tryDiff = Math.abs(Math.log(5) * Math.LOG10E - remainder);
  if (tryDiff < bestDiff) {
    bestDiff = tryDiff;
    multiple = 5;
  }
  // Try 10
  var tryDiff = Math.abs(Math.log(10) * Math.LOG10E - remainder);
  if (tryDiff < bestDiff) {
    bestDiff = tryDiff;
    multiple = 10;
  }
  return multiple * Math.pow(10, exponent);
}

var xaxis = board.create('line', [[0, 0], [1, 0]],
    {
      strokeColor: 'black',
      fixed: true
    });
var xticks = board.create('ticks', [xaxis, optimalTickDistance(xBoundMin, xBoundMax, 10)],
    {
      drawLabels: true,
      label: {offset: [-4, -15]},
      minorTicks: 0
    });

var yaxis = board.create('line', [[0, 0], [0, 1]], 
    {
      strokeColor: 'black',
      fixed: true
    });
var yticks = board.create('ticks', [yaxis,  optimalTickDistance(yBoundMin, yBoundMax, 20)],
    {
      drawLabels: true,
      label: {offset: [-20, 0]},
      minorTicks: 0
    });




var curveline = board.create('functiongraph',
                [equation, xBoundMin, xBoundMax]);
var x = [];
// for (var i=0; i<= length/barWidth + 0.00000000001; i++) {
console.log('x_0, x_1, barWidth');
console.log(x_0, x_1, barWidth);
for (var xStep = x_0; xStep <= x_1 - barWidth + 0.00000000001; xStep += barWidth) {
  x.push(xStep);
}

var fbar = [];
x.forEach(function(xVal){
  if (riemannMode === 'trapezoid') {
    var p1 = board.create('point', [xVal, equation(xVal)], {name: '', size: 0, strokeColor: 'blue'});
    var p2 = board.create('point', [xVal, 0], {name: '', size: 0, strokeColor: 'blue'});
    var p3 = board.create('point', [xVal + barWidth, 0], {name: '', size: 0, strokeColor: 'blue'});
    var p4 = board.create('point', [xVal + barWidth, equation(xVal + barWidth)], {name: '', size: 0, strokeColor: 'blue'});
  } else {
    var fbarVal;
    if (riemannMode === 'left') {
      fbarVal = equation(xVal);
    } else if (riemannMode === 'mid') {
      fbarVal = equation(xVal + 0.5 * barWidth);
    } else if (riemannMode === 'right')  {
      fbarVal = equation(xVal + barWidth);
    } else {
      throw new Error('riemannMode should be set to lift, mid right or trapezoid');
    }

    fbar.push(fbarVal);
    var label = fbarVal * barWidth; // Area

    var p1 = board.create('point', [xVal, fbarVal], {name: '', size: 0, strokeColor: 'blue'});
    var p2 = board.create('point', [xVal, 0], {name: '', size: 0, strokeColor: 'blue'});
    var p3 = board.create('point', [xVal + barWidth, 0], {name: '', size: 0, strokeColor: 'blue'});
    var p4 = board.create('point', [xVal + barWidth, fbarVal], {name: '', size: 0, strokeColor: 'blue'});
  }
  var poly = board.createElement('polygon', [p1, p2, p3, p4]);
});


// http://jsxgraph.uni-bayreuth.de/wiki/index.php/Polygon


// Perform a definite integral on the function

return div;