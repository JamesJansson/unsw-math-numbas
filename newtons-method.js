
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