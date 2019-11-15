function twoSum(nums, target) {
    // your code here
    var num1;
    var num2;
    for (i = 0; i < nums.length; i++) {
        for (j = i; j < nums.length; j++) {
            if (i === j) {
                continue;
            } else {
                num1 = nums[i];
                num2 = nums[j];
                if (num1 + num2 == target) {
                    console.log("[" + i + "," + j + "]");
                }
            }
        }
    }
}
twoSum([2, 7, 11, 15], 9);

/*
For example:
twoSum([2, 7, 11, 15], 9); Should returns:
[0, 1] Because:
nums[0] + nums[1] is 9
*/