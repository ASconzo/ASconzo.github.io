var expressionString = "";
var solved = false;

function extendExpression(currentItem) {
    if (solved){
        solved = false;
        resetExpression(currentItem);
    }
    expressionString = expressionString + currentItem;
    document.getElementById("calcSpace").innerHTML = expressionString;
}
                    
function updateLine(expression, left, right){
    newLine = "<br> = " + left.join(" ") + expression.join(" ") + right.join(" ");
    extendExpression(newLine);
}

function resetExpression(input){
    expressionString = "";
    document.getElementById("calcSpace").innerHTML = input;
    left = [];
    right = [];
    expression = [];
}

function isOperator(operator){
    var operatorList = ["+", "-", "/", "*", "^"];
    return operatorList.includes(operator);
}

function isDigit(character) {
    var digitList = ["." , "0", "1",  "2", "3", "4", "5", "6", "7", "8", "9"];
    return digitList.includes(character);				
}

function stringToExpression(stringInput){
    var newExpression = [];
    var tempString = "";
    for (let item of stringInput){
        if (isDigit(item)){
            //Append item to tempString, if it is an integer or a ".".
            tempString = tempString + item;
        }else{ // If item is "+", "-", "*", "/", "^", "(", or ")"
            if (tempString != ""){
                //If tempstring has contents, we'll push that to newExpression array
                newExpression.push(parseFloat(tempString));
            }
            tempString = ""; //Reset tempString
            newExpression.push(item); //This pushes to operator to the array
        }
    }
    if (tempString != ""){
        newExpression.push(parseFloat(tempString));
        var item = "debug";
    } 
    tempString = '';
    return newExpression;
}

function evaluateExpression(expression, left, right){
    if (solved){
        return;
    }
    updateLine(expression, left, right);

    //Part 1: Process parentheticals
    //Part 1.1: Add multiplication signs before and after parentheticals
    addMultiplications(expression, left, right);
            
    //Part 1.2: Check for errors with parenthetical input
    //end the process if error exists
    if(errorCheck(expression,left,right,mismatchedParentheses)){
        solved = true;
        return;
    }
    //Part 1.3: Process math inside parentheticals
    processParentheticals(expression, left, right);	

    //Part 2: Evaluate math            
    //Part 2.0: Check for negative numbers
    adjustNegatives(expression, left, right);

    //Part 2.0.1: Check for errors in input, end the process if an error exists
    if(errorCheck(expression, left, right, leadingOrTrailing)
        || errorCheck(expression, left, right, multipleOperators)){
        solved = true;
        return;
    }
        
    //Part 2.1: Evaluate exponents
    evaluateOperation(expression, ["^"], [exponentiation], left, right);

    //Part 2.2 Evaluate multiplication and Division
    evaluateOperation(expression, ["*","/"], [multiplication, division], left, right);

    //Part 2.3: Evaluate addition and subtraction
    evaluateOperation(expression, ["+","-"], [addition, subtraction], left, right);
    solved = true;
    return expression; 
}

function errorCheck(expression, left, right, errorFunction){
    //Check for operators at index 0 and index -1
    if(errorFunction(expression, left, right)){
        return true;
    }else{
        return false;
    }    
}

function updateError(errorString){
    errorArray = [];
    errorArray.push("Error: " + errorString);
    updateLine(errorArray,[],[]);
}

function leadingOrTrailing(expression, left, right){
    var operatorList = ["+", "-", "/", "*", "^"];
    var leadingOp = operatorList.includes(expression[0]);
    var trailingOp = operatorList.includes(expression[expression.length-1]);
    if (leadingOp || trailingOp){
        updateError("You have left an operator in either the first or last position in the expression.");
        return true;
    }
    return false;
}

function multipleOperators(expression, left, right){
    for (var i=0; i<expression.length;i++){
        if(isOperator(expression[i]) && isOperator(expression[i+1])){
            updateError("You have two or more operators in a row.");
            return true;
        }
    }
    return false;
}

function mismatchedParentheses(expression, left, right){
    if(expression[0] === ")"){
        updateError("You have a mismatched parenthesis.");
        return true;
    }
    if(expression[expression.length-1] === "("){
        updateError("You have a mismatched parenthesis.");
        return true;
    }
    var leftParenCount = 0;
    var rightParenCount = 0;
    for (i=0; i<expression.length; i++){
        if (expression[i] === "("){
            leftParenCount++;
        }else if (expression[i] === ")"){
            rightParenCount++;
        }
    }
    if (leftParenCount != rightParenCount){
        updateError("You have a mismatched parenthesis.");
        return true;
    }
    var leftParenIndex = expression.indexOf("("); 
    var rightParenIndex= expression.indexOf(")");
    if (rightParenIndex < leftParenIndex){
        updateError("You have a mismatched parenthesis");
        return true;
    }

    return false;
}
function addMultiplications(expression,left, right){
    for (var i=0; i<expression.length; i++){
        if (i>0 && expression[i] === "(" && !isOperator(expression[i-1]) && expression[i-1] != "("){
            expression.splice(i, 0, "*");
            i=-1;
            updateLine(expression, left, right);
            continue;
        }
        if (i<expression.length-1 && expression[i] === ")" && !isOperator(expression[i+1]) && expression[i+1] != ")"){
            expression.splice(i+1, 0, "*");
            i=-1;
            updateLine(expression, left, right);
            continue;
        }
        if (i<expression.length-1 && expression[i] === ")" && expression[i+1] === "("){
            expression.splice(i+1, 0, "*");
            i=-1;
            updateLine(expression, left, right);
            continue;
        }
    }
}

function processParentheticals(expression, left, right){
    while (expression.lastIndexOf("(") != -1){
        var leftParenIndex = expression.lastIndexOf("("); 
        var rightParenIndex= expression.indexOf(")", leftParenIndex);
        if (leftParenIndex != -1){
            var removalLength = rightParenIndex - leftParenIndex + 1;
            var parentheticalExpression = expression.slice(leftParenIndex + 1, rightParenIndex);
            var leftArray = expression.slice(0, leftParenIndex+1);
            var rightArray = expression.slice(rightParenIndex);
            var newArray = evaluateExpression(parentheticalExpression, leftArray, rightArray);
            expression.splice(leftParenIndex,removalLength, newArray[0]);
            left = [];
            right = [];
            updateLine(expression, left, right);
        }
    }
}

function adjustNegatives(expression, left, right){
    // If expression[0] is "-", and expression[1] is a number, make expression[1] negative
    if (expression[0] == "-" && !isOperator(expression[1])){
        var negatedNum = expression[1]*-1;
        expression.splice(0,2, negatedNum);
    }
    // If expression[i] is "-", and expression [i-1] is an operator, make the following number negative
    // So 5+-4, [5, "+", "-", 4] --> [5, "+", -4]
    for(var i=0; i<expression.length; i++){ 
        if (expression[i] == "-" && isOperator(expression[i-1])){
            var negatedValue = expression[i+1]*-1;
            expression.splice(i,2,negatedValue);
            i=-1;
            updateLine(expression, left, right);
            continue;
        }
    }
}

function evaluateOperation(expression, operators, operatorFunctions, left, right){
    for (var i = 0; i<expression.length; i++){
        for (var j = 0; j<operators.length; j++){
            if (expression[i] === operators[j]){
                var a = expression[i-1];
                var b = expression[i+1];
                var answer = operatorFunctions[j](a,b);
                expression.splice(i-1,3,answer);
                updateLine(expression, left, right);
                i = -1;
                break;
            }
        }
    }
}

function addition(a,b){
    return a+b;
}
function subtraction(a,b){
    return a-b;
}
function multiplication(a,b){
    return a*b;
}
function division(a,b){
    return a/b;
}
function exponentiation(a,b){
    return Math.pow(a, b);
}
