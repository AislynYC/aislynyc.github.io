function max(...numbers) {
    // your code here, for-loop method preferred
    var maxNum = numbers[0];
    for (i = 0; i < numbers.length; i++) {
        if (numbers[i] > maxNum) {
            maxNum = numbers[i];
        }
    }
    return maxNum;
}
console.log(max(1, 2, 4, 5)); // result to 5 
console.log(max(5, 2, 7, 1, 6)); // result to 7
console.log(max(2, 2, 3, 4, 4, 5, 10, 33, 39, 56, 67));