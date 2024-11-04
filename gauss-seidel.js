function seidel(equation, guess, num, DD) {
    let results = [];
    let n = 0, a1 = guess[0], a2 = guess[1], a3 = guess[2], oldA = guess;

    while (true) {
        a1 = (equation[0][3] - (equation[0][1] * a2) - (equation[0][2] * a3)) / equation[0][0];
        a2 = (equation[1][3] - (equation[1][0] * a1) - (equation[1][2] * a3)) / equation[1][1];
        a3 = (equation[2][3] - (equation[2][0] * a1) - (equation[2][1] * a2)) / equation[2][2];

        let err1 = Math.abs((a1 - oldA[0]) / a1) * 100;
        let err2 = Math.abs((a2 - oldA[1]) / a2) * 100;
        let err3 = Math.abs((a3 - oldA[2]) / a3) * 100;

        results.push({
            iteration: n + 1,
            x1: a1,
            x2: a2,
            x3: a3,
            error: Math.max(err1, err2, err3)
        });

        if(1*10**-num > Math.max(err1, err2, err3)){
            break;
        }
        if(!DD && n == 9) {
            break;
        }

        oldA = [a1, a2, a3];
        n++;
    }
    return results; // Return the results for output later
}

// module.exports = {

// }

module.exports = {
    seidel
}