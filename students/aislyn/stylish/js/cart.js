const host = 'https://api.appworks-school.tw';
const cartQtyWeb = document.getElementsByClassName('cart-qty')[0];
const cartQtyMobile = document.getElementsByClassName('cart-qty')[1];
// Get Cart Data from Local Storage
if (localStorage['cart'] !== undefined) {
  cart = JSON.parse(localStorage['cart']);
} else {
  cart = {};
}

// Update Cart Badge
const updateCartBadge = () => {
  if (cart !== {}) {
    let cartCount = 0;
    for (let [key, value] of Object.entries(cart)) {
      cartCount += value.qty;
    }

    cartQtyWeb.innerHTML = cartCount;
    cartQtyMobile.innerHTML = cartCount;
  } else {
    cartQtyWeb.innerHTML = '0';
    cartQtyMobile.innerHTML = '0';
  }
};
updateCartBadge();
