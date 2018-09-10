// Get equation, interpret
// var equationString = question.parts[0].gaps[0].display.studentAnswer();
var compiledExpression = Numbas.jme.compile(equationString, scope);
if(compiledExpression === null) {
  throw(new Error('No equation'));
}

function equation(x) {
  // Create a JME scope with the variable x set to the given value.
  var nscope = new Numbas.jme.Scope([
      Numbas.jme.builtinScope,
      {
        variables: {
          x: new Numbas.jme.types.TNum(x),
          c_4: new Numbas.jme.types.TNum(c_4),
          c_3: new Numbas.jme.types.TNum(c_3),
          c_2: new Numbas.jme.types.TNum(c_2),
          c_1: new Numbas.jme.types.TNum(c_1),
          c_0: new Numbas.jme.types.TNum(c_0)
        }
      }
  ]);
  return Numbas.jme.evaluate(compiledExpression, nscope).value;
}

// Optimise to find x-intercepts
if (expectedXIntercepts > 0) {
  // start a range
  if (expectedXIntercepts === 1) {
    
  }
}


// x_chart_min and x_chart_max are the min and max positions of the interesting elements of the chart. 
// We will make the chart bounds slightly larger, such that the interesting chart elements take up roughly 70% of the screen
var bufferProp = 0.1;
var xBuffer = bufferProp * (x_chart_max - x_chart_min);
xBoundMax = Math.ceil(x_chart_max + xBuffer);
xBoundMax = xBoundMax < xBuffer ? xBuffer : xBoundMax;
xBoundMin = Math.floor(x_chart_min - xBuffer);
xBoundMin = xBoundMin > -xBuffer ? -xBuffer : xBoundMin;

// Determine the rough min and max range, given the domain of the question
var length = x_chart_max - x_chart_min;
var xTestStepSize = length / 20;
var fMin, fMax;
for (var xTest = x_chart_min; xTest <= x_chart_max; xTest += xTestStepSize) {
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
var yBuffer = Math.max(bufferProp*(fMax - fMin), bufferProp*(fMax - 0), bufferProp*(0 - fMin));
yBoundMax = Math.ceil(fMax + yBuffer);
yBoundMax = yBoundMax < yBuffer ? yBuffer : yBoundMax;
yBoundMin = Math.floor(fMin - yBuffer);
yBoundMin = yBoundMin > -yBuffer ? -yBuffer : yBoundMin;

var div = Numbas.extensions.jsxgraph.makeBoard('400px','400px', 
  {
    boundingBox: [xBoundMin, yBoundMax, xBoundMax, yBoundMin], // xmin, ymax, xmax, ymin
    axis: false,
    showNavigation: false,
    grid: false
  });

var board = div.board;

function optimalTickDistance(minVal, maxVal, targetTicks) {
  // optimal ticks should be between 10 and 25
  var dist = maxVal -minVal;
  // Determine optimal ticks
  var targetTickDist = dist/targetTicks;
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

var g1 = board.create('glider', [0.6, 1.2, curveline]);
var t1 = board.create('tangent', [g1]);

// http://jsxgraph.uni-bayreuth.de/wiki/index.php/Polygon

return div;
