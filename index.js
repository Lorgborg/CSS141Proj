// required setup for input
const read = require("readline")
const rl = read.createInterface({
    input: process.stdin,
    output: process.stdout
})

const {jacobi} = require("./gauss-jacobi")
const {seidel} = require("./gauss-seidel")
const { reformat } = require("./reformat-matrix")

// promise for the input (if you're reading this don't worry about it, just some js quirks)
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// initializing the matrix
const equation = []
let type = 0, num = 4;
let guess = []

// menu descriptions
console.log("\nGAUSS-JACOBI/SEIDEL CALCULATOR (3x3)")
console.log("\nPlease enter equations in either Matrix form:\n12,3,-5,1\n1,5,3,28\n3,7,13,76\n\nEquation Form:\n12x+3y-5z=1\n1x+5y+3z=28\n3x+7y+13z=76\n");

// this async thing isn't related with much, just needed so `await` clause can be used.
(async() => {
    // n dicatates the nxn size of the matrix input
    const n = 3
    // iterates 3 times for each line of the matrix
    for(let i = 0; i != n; i++){
        // requests for the prompts and waits for prompt to be received
        let raw = await prompt(`Please Enter Equation ${i+1}:\n`)
        // string cleaning to transform equation form (1x+2y=3) into a float array
        raw = raw.toLowerCase()
        // checks if the input has x, if it has x it prolly means the user input an equation form
        if(raw.indexOf("x") > -1){
            temp = []
            // regex for the equation form of input
            temp[0] = parseFloat(/([+-]?\d+(\.\d+)?)(?=x)/g.exec(raw)[1])
            temp[1] = parseFloat(/([+-]?\d+(\.\d+)?)(?=y)/g.exec(raw)[1])
            temp[2] = parseFloat(/([+-]?\d+(\.\d+)?)(?=z)/g.exec(raw)[1])
            temp[3] = parseFloat(/(?<=\=)\s*([+-]?\d+(\.\d+)?)/g.exec(raw)[1])
            // pushes the temp array into the equation array
            equation.push(temp)
        } else{
            // matrix form of the input
            raw = raw.split(",")
            // turns string into decimal form
            raw = raw.map(function(str) {
                return parseFloat(str)
            })
            equation.push(raw)
        }
    }
    for (let i = 0; i != n; i++) {
        while (true) {
            const guessInput = await prompt(`Enter initial guess for x${i + 1}: `);
            const guessValue = parseFloat(guessInput);
            if (!isNaN(guessValue)) {
                guess[i] = guessValue;
                break;
            } else {
                console.log("Please enter a valid number.");
            }
        }
    }

    while (true) {
        num = await prompt("Please enter decimal place of error: ");
        if(isNaN(parseInt(num))) {
            console.log("Please enter a valid whole number")
        } else {
            break;
        }
    }

    while (true) {
        type = await prompt("[0] Gauss-seidel or [1] Gauss-jacobi?\n");
        if (type === "0" || type === "1") {
            type = parseInt(type);
            break;
        } else {
            console.log("Please enter a valid choice (0 or 1).");
        }
    }
    // closes the input mode
    rl.close()
})()

// this function triggers after input mode is closed. We'll be placing the formula stuff in here
// In index.js (after determining the type and running the method)
rl.on('close', () => {
    let results = [];
    let DD = true, i = 0;
    for(arr of equation){
        if(arr[i] <= arr.reduce((partialSum, a) => partialSum + Math.abs(a), 0)-(Math.abs(arr[i])+Math.abs(arr[arr.length-1]))){
            console.log("Not diagonally dominant, re-arranging")
            let formatted = reformat(equation.map(row => row.slice(0, 4)))
            if(formatted == 0) {
                DD = false
            } else {
                for (let i = 0; i < 3; i++) {
                    equation[i].splice(0, 4, ...formatted[i]);
                }
                console.log(equation)
            }
        }
        i++
    }
    if (type == 0) {
        results = seidel(equation, guess, num, DD);
    } else if (type == 1) {
        results = jacobi(equation, guess, num, DD);
    }

    // Output the results in a clean table format
    console.log("\nResults:\n");
    console.log("Iteration |   x1   |   x2   |   x3   |    Error (%)    ");
    console.log("-----------------------------------------------------");
    results.forEach(result => {
        console.log(`${result.iteration}        | ${result.x1.toFixed(4)} | ${result.x2.toFixed(4)} | ${result.x3.toFixed(4)} | ${result.error.toFixed(parseInt(num)+1)} `);
    });

    if(!DD) {
        console.log("\nEquation did not converge.")
    }
});
