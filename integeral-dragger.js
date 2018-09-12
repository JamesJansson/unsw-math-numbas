
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

var div = Numbas.extensions.jsxgraph.makeBoard('400px','400px', 
  {
    boundingBox: [-5, 10, 5, -5], // xmin, ymax, xmax, ymin
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

var i1 = board.create('integral', [[-1.0, 2.0], graph]);

return div;

