// Required vars
'chart_elements('+
'equation_string,'+
'differential_string,'+
'c_0,'+
'c_1,'+
'c_2,'+
'c_3,'+
'c_4,'+
'x_chart_min,'+
'x_chart_max,'+
'expected_x_intercepts,'+
'x_s1,'+
'y_s1,'+
'x_s2,'+
'y_s2,'+
'x_s3,'+
'y_s3'+
')'

// Get equation, interpret
// var equation_string = question.parts[0].gaps[0].display.studentAnswer();
var compiledExpression = Numbas.jme.compile(equation_string, scope);
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

var compiledExpressionDifferential = Numbas.jme.compile(differential_string, scope);
if(compiledExpressionDifferential === null) {
  throw(new Error('No equation'));
}
function differential(x) {
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
  return Numbas.jme.evaluate(compiledExpressionDifferential, nscope).value;
}

/**
 * 
 */

function newtonsMethod(inputFunction, inputFunctionDerivative, estimate, options) {
  options = options ? options : {};
  var iterationLimit = 100;
  if (typeof options.iterationLimit === 'number') {
    iterationLimit = options.iterationLimit
  }
  var accuracy = 1E-20;
  if (typeof options.accuracy === 'number') {
    accuracy = options.accuracy
  }
  var result = privateNewtonsMethod(estimate);
  if (options.showOutput) {console.log("Result found: " + result)}
  return result;

  // recursive function that 
  function privateNewtonsMethod(estimate, startEstimate, lastEstimate, count) {
    if (options.showOutput) {console.log("Step: " + count + "  Estimate: " + estimate)}
    if (estimate === undefined || isNaN(estimate) || !isFinite(estimate)){
      throw "Newton's method failed to find function roots. Possible discontinunity in provided function or its derivative";
    }
    if (inputFunction(estimate) === 0) {
      if (options.showOutput) {console.log("Stopping because functionally equivalent to zero")}
      return estimate;
    }
    if (count === undefined) {
      count = 0;
    }
    if (startEstimate === undefined) {
      startEstimate = estimate;
    }
    if (lastEstimate !== undefined) {
      // If we have exhausted the number of loops
      if (count >= iterationLimit) {
        if (options.showOutput) {console.log("Stopping because reached limit of number of iterations")}
        return estimate;
      }
      // If the difference between the last estimate and the 
      // current estimate < a millionth of the distance between the last estimate and the current estimate, stop
      if (Math.abs(lastEstimate - estimate) < Math.abs(accuracy * (startEstimate - estimate))) {
        if (options.showOutput) {console.log("Stopping because reached accuracy metric")}
        return estimate;
      }
    }
    count++;
    // Prevent failure of the method in the case of accidentally hitting a steady point
    if (inputFunctionDerivative(estimate) === 0 || isNaN(inputFunctionDerivative(estimate)) || !isFinite(inputFunctionDerivative(estimate))
        || isNaN(inputFunction(estimate)) ||  !isFinite(inputFunction(estimate)) ) {
      if (options.showOutput) {console.log("Steady point or discontinuity hit, trying a new point")}
      if (lastEstimate) {
        estimate = estimate - (estimate - lastEstimate) / 3.141592653589793; // using an irrationish number to hopefully avoid a second conflict
      } else {
        estimate = estimate + 3.141592653589793;
      }
    }
    var nextEstimate = estimate - inputFunction(estimate) / inputFunctionDerivative(estimate);
    return privateNewtonsMethod(nextEstimate, startEstimate, estimate, count);
  }
}
// Testing 
// y = function(x) {return Math.pow(x, 2) - 5*x + 6} // (x-2)(x-3)
// dy = function(x) {return 2*x - 5}
// newtonsMethod(y, dy, 6, {showOutput: true})
// newtonsMethod(y, dy, 1, {showOutput: true})
// newtonsMethod(y, dy, 2.1, {showOutput: true})
// newtonsMethod(y, dy, 2.7, {showOutput: true})
// newtonsMethod(y, dy, 2.5, {showOutput: true})

function midpointOptimisation(equation, x0, x1) {
  // The first step is to find a positive and a negative between the two points
  // Note that x0 and x1 are NOT inclusive as a result of this. 
  var count = 0;
  // find a negative
  var negativeValue;
  while (negativeValue === undefined) {
    var testVal = x0 + (x1 - x0) * Math.random();
    if (equation(testVal) < 0) {
      negativeValue = testVal;
    }
    if (count > 1000) {
      throw "Count could not find a negative value";
    }
  }
  // find a positive
  var positiveValue;
  while (positiveValue === undefined) {
    var testVal = x0 + (x1 - x0) * Math.random();
    if (equation(testVal) > 0) {
      positiveValue = testVal;
    }
    if (count > 1000) {
      throw "Count could not find a positive value";
    }
  }

  for (var i=0; i<1000; i++) {
    var midpoint = (negativeValue + positiveValue)/2;
    // console.log(negativeValue, midpoint, positiveValue);
    if (equation(midpoint) > 0) {
      positiveValue = midpoint;
    } else if (equation(midpoint) < 0) {
      negativeValue = midpoint;
    } else {
      return midpoint;
    }
  }
  return midpoint;
}
// Testing 
// y = function(x) {return Math.pow(x, 2) - x - 6} // (x+2)(x-3)
// midpointOptimisation(y, 2, 5);
// midpointOptimisation(y, 10, 2);

var root=[];
var leftRoot, rightRoot;
// Optimise to find x-intercepts
if (expected_x_intercepts > 0) {
  // start a range
  if (expected_x_intercepts === 1) { // This method is necessary for cubics
    // Try from both sides, hopefully one works
    var testRoot1 = newtonsMethod(equation, differential, x_chart_max + (x_chart_max - x_chart_min));
    var testRoot2 = newtonsMethod(equation, differential, x_chart_min - (x_chart_max - x_chart_min));
    root[0] = equation(testRoot1) < equation(testRoot2) ? testRoot1 : testRoot2; // choose the smallest of the estimates
    leftRoot = root[0];
    rightRoot = root[0];
  } else if (expected_x_intercepts === 2) {
    // Start to the left of the range, hope converges to left point (should for quadratics and quartics)
    root[0] = newtonsMethod(equation, differential, x_chart_max + (x_chart_max - x_chart_min));
    root[1] = newtonsMethod(equation, differential, x_chart_min - (x_chart_max - x_chart_min));
    leftRoot = root[0];
    rightRoot = root[1];
  } else if (expected_x_intercepts === 3) { // This method is necessary for cubics
    root[0] = newtonsMethod(equation, differential, x_chart_max + (x_chart_max - x_chart_min));
    root[2] = newtonsMethod(equation, differential, x_chart_min - (x_chart_max - x_chart_min));
    root[1] = midpointOptimisation(equation, root[0], root[2]);
    leftRoot = root[0];
    rightRoot = root[2];
  }
}


// x_chart_min and x_chart_max are the min and max positions of the interesting elements of the chart. 
// We will make the chart bounds slightly larger, such that the interesting chart elements take up roughly 70% of the screen
var bufferProp = 0.1;
xBoundMin = Math.min(0, leftRoot, x_chart_min);
xBoundMax = Math.max(0, rightRoot, x_chart_max);
var xBuffer = bufferProp * (x_chart_max - x_chart_min);
xBoundMin = xBoundMin - xBuffer;
xBoundMax = xBoundMax + xBuffer;

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

// var g1 = board.create('glider', [0.6, 1.2, curveline]);
// var t1 = board.create('tangent', [g1]);

// y intercept, turning points, infection points, x intercepts
// var g2 = board.create('glider', [0, equation(0), curveline]);

p1 = board.create('point',[0,equation(0)], {name:'A', face:'o', size:1});
p1.setProperty({fixed:true});
p2 = board.create('point',[x_s1,equation(x_s1)], {name:'B', face:'o', size:1});
p2.setProperty({fixed:true});
p2 = board.create('point',[x_s2,equation(x_s2)], {name:'C', face:'o', size:1});
p2.setProperty({fixed:true});
p2 = board.create('point',[x_s3,equation(x_s3)], {name:'D', face:'o', size:1});
p2.setProperty({fixed:true});
p2 = board.create('point',[x_s3,equation(x_s3)], {name:'D', face:'o', size:1});
p2.setProperty({fixed:true});
if (expected_x_intercepts > 0) {
  p2 = board.create('point',[root[0],equation(root[0])], {name:'D', face:'o', size:1});
  p2.setProperty({fixed:true});
}
if (expected_x_intercepts > 1) {
  p2 = board.create('point',[root[1],equation(root[1])], {name:'D', face:'o', size:1});
  p2.setProperty({fixed:true});
}
if (expected_x_intercepts > 2) {
  p2 = board.create('point',[root[2],equation(root[2])], {name:'D', face:'o', size:1});
  p2.setProperty({fixed:true});
}

// ['x-intercept', 'y-intercept', 'inflection point', 'local maximum', 'local minimum']

// http://jsxgraph.uni-bayreuth.de/wiki/index.php/Polygon

return div;
