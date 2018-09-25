// Required vars
'chart_elements('+
'equationString,'+
'derivativeString,'+
'secondDerivativeString,'+
'c_0,'+
'c_1,'+
'c_2,'+
'c_3,'+
'c_4,'+
'x_chart_min,'+
'x_chart_max,'+
'x_s1,'+
'y_s1,'+
'x_s2,'+
'y_s2,'+
'x_s3,'+
'y_s3,'+
'labelNames,'+
'answerOutputs'+
')'

console.log(labelNames);


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

var compiledDerivativeExpression = Numbas.jme.compile(derivativeString, scope);
if(compiledDerivativeExpression === null) {
  throw(new Error('No equation'));
}
function derivative(x) {
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
  return Numbas.jme.evaluate(compiledDerivativeExpression, nscope).value;
}

var compiledSecondDerivativeExpression = Numbas.jme.compile(secondDerivativeString, scope);
if(compiledSecondDerivativeExpression === null) {
  throw(new Error('No equation'));
}
function secondDerivative(x) {
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
  return Numbas.jme.evaluate(compiledSecondDerivativeExpression, nscope).value;
}


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


function findRoots(equation, leftMostPoint, rightMostPoint) {
  var increment = (rightMostPoint- leftMostPoint)/200;
  var root=[];
  for (var xStep = leftMostPoint; xStep<rightMostPoint; xStep=xStep+increment) {
    // check if points are on either side of the x-axis (y<0 and y>0)
    if (equation(xStep) * equation(xStep + increment) < 0) {
      root.push(midpointOptimisation(equation, xStep, xStep+increment))
    }
  }
  return root;
}
var root = findRoots(equation, 
    x_chart_min - 3*(x_chart_max - x_chart_min), 
    x_chart_max + 3*(x_chart_max - x_chart_min));


var leftRoot = Math.min.apply(null, root);
var rightRoot = Math.max.apply(null, root);

// x_chart_min and x_chart_max are the min and max positions of the interesting elements of the chart. 
// We will make the chart bounds slightly larger, such that the interesting chart elements take up roughly 70% of the screen
var bufferProp = 0.1;
console.log('left', leftRoot, ' ', x_chart_min)
console.log('right', rightRoot, ' ', x_chart_max)
var xInterestingMin = Math.min(0, leftRoot, x_chart_min);
var xInterestingMax = Math.max(0, rightRoot, x_chart_max);
var xBuffer = bufferProp * (xInterestingMax - xInterestingMin);
xBoundMin = xInterestingMin - xBuffer;
xBoundMax = xInterestingMax + xBuffer;

// Determine the rough min and max range, given the domain of the question
var length = xInterestingMax - xInterestingMin;
var xTestStepSize = length / 200;
var fMin, fMax;
for (var xTest = xInterestingMin; xTest <= xInterestingMax; xTest += xTestStepSize) {
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
    showNavigation: true,
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

var labelFormat = {fixed:true, face:'o', size:1, label:{fontSize:20, offset: [7, 10]}};

var answerCount = 0;
var rootCount = 0;
var x_s_arr = [x_s1, x_s2, x_s3];
var x_s_set = [false, false, false];
var inflectionPointCount = 0;
var p1, sCount, sFound, sVal;
answerOutputs.forEach(function (answerNumber) {
  // [0,1,2,3,4] -> ['X-intercept', 'Y-intercept', 'Local minimum', 'Local maximum', 'Inflection point']
  // X-intercept
  if (answerNumber === 0) {
    p1 = board.create('point', [root[rootCount], equation(root[rootCount])], labelFormat);
    rootCount++;
  }
  // Y-intercept
  if (answerNumber === 1) {
    p1 = board.create('point', [0, equation(0)], labelFormat);
  }
  // Local minimum
  if (answerNumber === 2) {
    sFound = false;
    sCount =0;
    while (!sFound && sCount < x_s_arr.length) {
      x_s_val = x_s_arr[sCount];
      // POSTIVE CURVATURE
      if (!x_s_set[sCount] && secondDerivative(x_s_val)>0) {
        sFound = true;
        x_s_set[sCount] = true;
        p1 = board.create('point', [x_s_val, equation(x_s_val)], labelFormat);
      }
      sCount++;
    }
  }
  // Local maximum
  if (answerNumber === 3) {
    sFound = false;
    sCount =0;
    while (!sFound && sCount < x_s_arr.length) {
      x_s_val = x_s_arr[sCount];
      // NEGATIVE CURVATURE
      if (!x_s_set[sCount] && secondDerivative(x_s_val)<0) {
        sFound = true;
        x_s_set[sCount] = true;
        p1 = board.create('point', [x_s_val, equation(x_s_val)], labelFormat);
      }
      sCount++;
    }
  }
  // Inflection point

  p1.setProperty({name: labelNames[answerCount]});
  answerCount++;
});

return div;

// Answer matrix
// matrix(
//   [if(answerOutputs[0]=0, 1, 0), if(answerOutputs[0]=1, 1, 0), if(answerOutputs[0]=2, 1, 0), if(answerOutputs[0]=3, 1, 0), if(answerOutputs[0]=4, 1, 0)],
//   [if(answerOutputs[1]=0, 1, 0), if(answerOutputs[1]=1, 1, 0), if(answerOutputs[1]=2, 1, 0), if(answerOutputs[1]=3, 1, 0), if(answerOutputs[1]=4, 1, 0)],
//   [if(answerOutputs[2]=0, 1, 0), if(answerOutputs[2]=1, 1, 0), if(answerOutputs[2]=2, 1, 0), if(answerOutputs[2]=3, 1, 0), if(answerOutputs[2]=4, 1, 0)],
//   [if(answerOutputs[3]=0, 1, 0), if(answerOutputs[3]=1, 1, 0), if(answerOutputs[3]=2, 1, 0), if(answerOutputs[3]=3, 1, 0), if(answerOutputs[3]=4, 1, 0)],
//   [if(answerOutputs[4]=0, 1, 0), if(answerOutputs[4]=1, 1, 0), if(answerOutputs[4]=2, 1, 0), if(answerOutputs[4]=3, 1, 0), if(answerOutputs[4]=4, 1, 0)],
//   [if(answerOutputs[5]=0, 1, 0), if(answerOutputs[5]=1, 1, 0), if(answerOutputs[5]=2, 1, 0), if(answerOutputs[5]=3, 1, 0), if(answerOutputs[5]=4, 1, 0)]
// )
