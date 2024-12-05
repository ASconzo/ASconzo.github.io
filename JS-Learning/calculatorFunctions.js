var expressionString = "";

function extendExpression(currentItem) {
    expressionString = expressionString + currentItem;
    document.getElementById("calcSpace").innerHTML = expressionString;
}
                    
function updateLine(expression, left, right){
    newLine = "<br> = " + left.join(" ") + expression.join(" ") + right.join(" ");
    extendExpression(newLine);
}

function resetExpression(){
    expressionString = "";
    document.getElementById("calcSpace").innerHTML = "Use the buttons below to enter your commands!";
    left = [];
    right = [];
    expression = [];
}

function isOperator(operator){
    var operatorList = ["+", "-", "/", "*", "^"];
    return operatorlist.includes(operator);
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
updateLine(expression, left, right);
console.log("Input array:");
console.log(expression);
    
//Part 1: Process parentheticals
//Part 1.1: Add multiplication signs before and after parentheticals
addMultiplications(expression, left, right);
        
//Part 1.2: Do the math inside parentheticals
processParentheticals(expression, left, right);						
//Part 2: Evaluate math
        
//Part 2.0: Check for negative numbers
// -(5+1) --> (-1)*(5+1)
adjustNegatives(expression, left, right);
    
//Part 2.1: Evaluate exponents
console.log("Calculating exponents");
evaluateOperation(expression, ["^"], [exponentiation], left, right);
console.log("Finished calculating exponents.");

//Part 2.2 Evaluate multiplication and Division
console.log("Calculating multiplication and division: ");
evaluateOperation(expression, ["*","/"], [multiplication, division], left, right);
console.log("Finished calculating multiplication and division");

//Part 2.3: Evaluate addition and subtraction
console.log("Calculating addition and subtraction: ");
evaluateOperation(expression, ["+","-"], [addition, subtraction], left, right);
console.log("Finished calculating addition and subtraction");
return expression; 
}

function addMultiplications(expression,left, right){
    console.log("Adding multiplication signs around parentheticals");
    for (var i=0; i<expression.length; i++){
        if (i>0 && expression[i] === "(" && !isOperator(expression[i-1])){
            console.log(expression);
            expression.splice(i, 0, "*");
            console.log(expression);
            i=-1;
            updateLine(expression, left, right);
            continue;
        }
        if (i<expression.length-1 && expression[i] === ")" && !isOperator(expression[i+1])){
            console.log(expression);
            expression.splice(i+1, 0, "*");
            console.log(expression);
            i=-1;
            updateLine(expression, left, right);
            continue;
        }
        if (i<expression.length-1 && expression[i] === ")" && expression[i+1] === "("){
            console.log(expression);
            expression.splice(i+1, 0, "*");
            console.log(expression);
            i=-1;
            updateLine(expression, left, right);
            continue;
        }
    }
    console.log("Finished adding multiplication signs around parentheticals.");
    console.log(expression);
}

function processParentheticals(expression, left, right){
    console.log("Processing math inside the parentheticals:");
    while (expression.lastIndexOf("(") != -1){
        //var loopNum = i+1;
        //console.log("Loop # " + loopNum + " out of " + expression.length);
        //Locate indexes of left and right parentheticals. Will be -1 if there is none
        var leftParenIndex = expression.lastIndexOf("("); 
        var rightParenIndex= expression.indexOf(")", leftParenIndex);
        if (leftParenIndex != -1){
            console.log("Section contained within parentheticals found.");
            var removalLength = rightParenIndex - leftParenIndex + 1;
            var parentheticalExpression = expression.slice(leftParenIndex + 1, rightParenIndex);
            var leftArray = expression.slice(0, leftParenIndex+1);
            console.log("Left array: " + leftArray);
            var rightArray = expression.slice(rightParenIndex);
            console.log("Right array: " + rightArray);
            console.log("Middle array: " + parentheticalExpression);
            console.log("Solving parenthetical section");
            console.log("Before:");
            console.log(parentheticalExpression);
            var newArray = evaluateExpression(parentheticalExpression, leftArray, rightArray);
            console.log("Parenthetical section solved.");
            console.log("After:");
            console.log(newArray);
            console.log("Replacing old parenthetical section with answer.");
            console.log("Before:");
            console.log(expression);
            expression.splice(leftParenIndex,removalLength, newArray[0]);
            left = [];
            right = [];
            updateLine(expression, left, right);
            console.log("After:");
            console.log(expression);
        }
    }
}

function adjustNegatives(expression, left, right){
    console.log("Checking for the input of negative numbers");
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
                console.log(a + operators[j] + b + "=" + answer); 
                expression.splice(i-1,3,answer);
                updateLine(expression, left, right);
                console.log(expression);
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

//To-Do: add error for open parentheses, 
//clear output when continuing after already having solved an equation