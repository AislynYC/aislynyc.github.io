function calculate(args) {
    let result;
    if (args.op === "+") {
        result = args.n1 + args.n2;
    } else if (args.op === "-") {
        result = args.n1 - args.n2;
    } else {
        result = "Not supported";
    }
    return result;
}
// Try to call calculate function correctly 

// The first way
const obj = {
    op: "+",
    n1: 6,
    n2: 4
}
console.log(calculate(obj));


// The second way

class Obj {
    constructor(op, n1, n2) {
        this.op = op;
        this.n1 = n1;
        this.n2 = n2;
    }
}
const obj2 = new Obj('-', 6, 4)
console.log(calculate(obj2));

// The third way
console.log(calculate(Object.create(obj)));