function jacobi(equation, guess, num) {
    let A = equation.map(row => row.slice(0, 3));
    let b = equation.map(row => row[row.length - 1]);
    let results = []
    const n = b.length; // Number of equations
    const x = guess || new Array(n).fill(0); // Initialize x to zeros if not provided
    
    for (let k = 0; k < 100; k++) {
        console.log(k)
        const xNew = new Array(n).fill(0);

        for (let i = 0; i < n; i++) {
            let sumAx = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    sumAx += A[i][j] * x[j]; // R * x
                }
            }
            xNew[i] = (b[i] - sumAx) / A[i][i]; // D^-1 * (b - R * x)
        }
        // Calculate residual for the current iteration
        const residual = b.map((bi, i) => bi - A[i].reduce((acc, val, index) => acc + val * xNew[index], 0));
        const norm2 = Math.sqrt(residual.reduce((sum, val) => sum + val * val, 0)); // 2-norm

        // Print the current iteration
        results.push({
            iteration: k + 1,
            x1: xNew[0],
            x2: xNew[1],
            x3: xNew[2],
            error: norm2
        });

        if (norm2 < 1*10**-num) {
            return results; // Return the result if converged
        }

        // Update x for the next iteration
        for (let i = 0; i < n; i++) {
            x[i] = xNew[i];
        }
    }
    return results; // Return the result after max iterations
}

module.exports = {
    jacobi
}