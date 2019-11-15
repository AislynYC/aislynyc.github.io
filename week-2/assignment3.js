function avg(data) {
    // your code here
    var sum = 0;
    for (i = 0; i < data.size; i++) {
        sum += data.products[i].price;
    }
    return sum / data.size;
}
var result = avg({
    size: 3,
    products: [{
            name: "Product 1",
            price: 100
        },
        {
            name: "Product 2",
            price: 700
        },
        {
            name: "Product 3",
            price: 250
        }
    ]
});
console.log(result);
// show the average price of all products