
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
          // c_4: new Numbas.jme.types.TNum(c_4),
          // c_3: new Numbas.jme.types.TNum(c_3),
          // c_2: new Numbas.jme.types.TNum(c_2),
          // c_1: new Numbas.jme.types.TNum(c_1),
          // c_0: new Numbas.jme.types.TNum(c_0)
        }
      }
  ]);
  return Numbas.jme.evaluate(compiledExpression, nscope).value;
}

y_1 = equation(x_1);
y_0 = equation(x_0);

var div = Numbas.extensions.jsxgraph.makeBoard('600px','600px', 
  {
    boundingBox: [-1, 25, 3, -1], // xmin, ymax, xmax, ymin
    axis: true,
    showNavigation: true,
    grid: true
  });

var board = div.board;


var graph = board.create('curve',
    [function(x){ return x},
    equation,
    -5, 5]
);



return div;

