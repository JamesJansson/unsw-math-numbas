// Code partially inspired by 
// Use student input in a JSXGraph diagram by Christian Lawson-Perfect
// https://numbas.mathcentre.ac.uk/question/2223/use-student-input-in-a-jsxgraph-diagram/

// Get equation, interpret


// Determine the rough min and max range, given the domain of the question
var length = x_1 - x_0;
xTestStep = length / 10;
for (var xTest = x_0; v <= x_1; xTest += xTestStep) {
  var fval = f(xTest);
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

yBoundMax = Math.ceil(fMax + (fMax - fMin) / 10);
yBoundMax = yBoundMax < 0 ? 0 : yBoundMax;
yBoundMin = Math.floor(fMax - (fMax - fMin) / 10);
yBoundMin = yBoundMin > 0 ? 0 : yBoundMin;

xBoundMax = Math.ceil(fMax + (fMax - fMin) / 10);
xBoundMax = xBoundMax < 0 ? 0 : xBoundMax;
xBoundMin = Math.floor(fMax - (fMax - fMin) / 10);
xBoundMin = xBoundMin > 0 ? 0 : xBoundMin;

var div = Numbas.extensions.jsxgraph.makeBoard('400px','400px', 
  {
    boundingBox: [xBoundMin, yBoundMax, xBoundMax, yBoundMin], // xmin, ymax, xmax, ymin
    axis: false,
    showNavigation: false,
    grid: true
  });

var board = div.board;

var xaxis = board.create('line', [[0, 0], [1, 0]],
    {
      strokeColor: 'black',
      fixed: true
    });
var xticks = board.create('ticks', [xaxis, 1],
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
var yticks = board.create('ticks', [yaxis, 1],
    {
      drawLabels: true,
      label: {offset: [-20, 0]},
      minorTicks: 0
    });


function equation(x) {
  return a*x*x + b*x + c;
  // Create a JME scope with the variable x set to the given value.
  // var nscope = new Numbas.jme.Scope([
  //     Numbas.jme.builtinScope,
  //     {variables: {x: new Numbas.jme.types.TNum(x)}}
  // ]);
  // return Numbas.jme.evaluate(equation, nscope).value;
}

var curveline = board.create('functiongraph',
                [equation, -2, 16]);

var x = [];
for (var i=0; i<length/barWidth; i++) {
  x.push(i*barWidth);
}

//var fbar = [5, 6, 7, 8];
var riemannStyle = 'left';
var fbar = [];
x.forEach(function(xVal){
  var fbarVal;
  if (riemannStyle === 'left') {
    fbarVal = equation(xVal);
  } else if (riemannStyle === 'mid') {
    fbarVal = equation(xVal + 0.5 * barWidth);
  } else {
    fbarVal = equation(xVal + barWidth);
  }

  fbar.push(fbarVal);
  var label = fbarVal * barWidth;

  var p1 = board.create('point', [xVal, fbarVal], {name: '', size:0, strokeColor:'blue'});
  var p2 = board.create('point', [xVal, 0], {name: '', size:0, strokeColor:'blue'});
  var p3 = board.create('point', [xVal + barWidth, 0], {name: '', size:0, strokeColor:'blue'});
  var p4 = board.create('point', [xVal + barWidth, fbarVal], {name: '', size:0, strokeColor:'blue'});

  var poly = board.createElement('polygon', [p1, p2, p3, p4]);
});


// http://jsxgraph.uni-bayreuth.de/wiki/index.php/Polygon


// Perform a definite integral on the function

return div;