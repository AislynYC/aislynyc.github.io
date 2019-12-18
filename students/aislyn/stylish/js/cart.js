const host = 'https://api.appworks-school.tw';
const cartQtyWeb = document.getElementsByClassName('cart-qty')[0];
const cartQtyMobile = document.getElementsByClassName('cart-qty')[1];
const listDiv = document.getElementsByClassName('list')[0];

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
      cartCount += parseInt(value.qty);
    }

    cartQtyWeb.innerHTML = cartCount;
    cartQtyMobile.innerHTML = cartCount;
  } else {
    cartQtyWeb.innerHTML = '0';
    cartQtyMobile.innerHTML = '0';
  }
};

// Get Product Details
const getProductDetail = (productId, variant, callback) => {
  const xhr = new XMLHttpRequest();
  let url = host + '/api/1.0/products/details?id=' + productId;

  xhr.open('GET', url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(variant, xhr.responseText);
      } else {
        alert(`[${xhr.status}] ${xhr.statusText}`);
      }
    }
  };
  xhr.send();
};

// Render Selected Products from LocalStorage
const renderSelProducts = (variant, data) => {
  const dataObj = JSON.parse(data).data;

  // Check Stock
  const variants = dataObj.variants;
  const checkVariantStock = (color, size) => {
    const variant = variants.find(item => {
      return item.color_code === color && item.size === size;
    });
    return variant.stock;
  };

  let stock = checkVariantStock(variant.colorCode, variant.size);

  // Create Product List
  const productList = document.createElement('div');
  productList.className = 'product-list';

  const productItem = document.createElement('div');
  productItem.className = 'product-item';

  listDiv.appendChild(productList);
  productList.appendChild(productItem);

  const imgInfoWrap = document.createElement('div');
  imgInfoWrap.className = 'img-info-wrap';
  productItem.appendChild(imgInfoWrap);

  // Create Product Image
  const productImgWrap = document.createElement('div');
  productImgWrap.className = 'product-img-wrap';

  const productImg = document.createElement('img');
  productImg.className = 'product-img';
  productImg.setAttribute('src', dataObj.main_image);

  productImgWrap.appendChild(productImg);
  imgInfoWrap.appendChild(productImgWrap);

  // Create Product Info
  const productInfo = document.createElement('div');
  productInfo.className = 'product-info';
  const productName = document.createElement('div');
  productName.className = 'product-name';
  productName.innerHTML = dataObj.title;
  const productId = document.createElement('div');
  productId.className = 'product-id';
  productId.innerHTML = dataObj.id;
  const productColor = document.createElement('div');
  productColor.className = 'product-color';
  productColor.innerHTML = '顏色｜' + variant.colorName;
  const productSize = document.createElement('div');
  productSize.className = 'product-size';
  productSize.innerHTML = '尺寸｜' + variant.size;

  productInfo.append(productName, productId, productColor, productSize);
  imgInfoWrap.appendChild(productInfo);

  // Create Remove Button
  const removeBtnWrap = document.createElement('div');
  removeBtnWrap.className = 'remove-btn-wrap';
  const removeBtn = document.createElement('img');
  removeBtn.className = 'remove-btn';
  removeBtn.setAttribute('src', '../images/cart-remove.png');
  removeBtn.setAttribute('product-code', variant.productCode);

  productItem.appendChild(removeBtnWrap);
  removeBtnWrap.appendChild(removeBtn);

  // Create Order Calculator for Items
  const qtyDiv = document.createElement('div');
  qtyDiv.className = 'qty-wrap';
  const qtyLabel = document.createElement('div');
  qtyLabel.className = 'list-label';
  qtyLabel.innerHTML = '數量';
  const qtySelect = document.createElement('select');
  qtySelect.className = 'qty-select';
  qtySelect.setAttribute('product-code', variant.productCode);

  for (let i = 1; i <= stock; i++) {
    let qtyOption = document.createElement('option');
    qtyOption.setAttribute('value', i);
    qtyOption.innerHTML = i;
    if (i == variant.qty) {
      qtyOption.setAttribute('selected', 'selected');
    }
    qtySelect.append(qtyOption);
  }
  qtyDiv.append(qtyLabel, qtySelect);

  const priceDiv = document.createElement('div');
  priceDiv.className = 'price-wrap';
  const priceLabel = document.createElement('div');
  priceLabel.className = 'list-label';
  priceLabel.innerHTML = '單價';
  const price = document.createElement('div');
  price.innerHTML = 'NT.' + dataObj.price;

  priceDiv.append(priceLabel, price);

  const subTotalDiv = document.createElement('div');
  subTotalDiv.className = 'sub-total-wrap';
  const subTotalLabel = document.createElement('div');
  subTotalLabel.className = 'list-label';
  subTotalLabel.innerHTML = '小計';

  const subTotalWrap = document.createElement('div');
  subTotalWrap.className = 'sub-total-wrap';
  subTotalWrap.innerHTML = 'NT.';
  const subTotal = document.createElement('span');
  subTotal.className = 'sub-total';
  subTotal.innerHTML = dataObj.price * qtySelect.value;
  subTotalWrap.append(subTotal);
  subTotalDiv.append(subTotalLabel, subTotalWrap);
  productItem.append(qtyDiv, priceDiv, subTotalDiv);

  // Calculate Total Price
  const subTotals = document.getElementsByClassName('sub-total');
  const totalPriceSpan = document.getElementById('total-price');
  const freightFeeSpan = document.getElementById('freight-fee');
  const finalPriceSpan = document.getElementById('final-price');
  let total = 0;

  for (let i = 0; i < subTotals.length; i++) {
    total += parseInt(subTotals[i].innerHTML);
  }

  totalPriceSpan.innerHTML = total;
  finalPriceSpan.innerHTML = total + parseInt(freightFeeSpan.innerHTML);

  // Store Updated Cart to Local Storage
  localStorage['cart'] = JSON.stringify(cart);
};

// Check Cart Data
const checkCart = () => {
  Object.keys(cart).forEach(productCode => {
    const selProductDtls = cart[productCode];
    const productId = selProductDtls.id;
    const variant = {
      productCode: productCode,
      colorName: selProductDtls.color.name,
      colorCode: selProductDtls.color.code,
      size: selProductDtls.size,
      qty: selProductDtls.qty
    };
    getProductDetail(productId, variant, (variant, response) => {
      renderSelProducts(variant, response);
    });
  });
  // Update Cart Badge while qty change
  updateCartBadge();
};

checkCart();

// Remove from Cart Feature
listDiv.addEventListener('click', e => {
  let targetElement = e.target;
  while (targetElement !== null) {
    if (targetElement.matches('.remove-btn')) {
      let productCode = targetElement.getAttribute('product-code');
      delete cart[productCode];
      listDiv.innerHTML = '';
      checkCart();
    }
    targetElement = targetElement.parentElement;
  }
});

// Quantity Modifying Feature
listDiv.addEventListener('change', e => {
  let targetElement = e.target;

  while (targetElement !== null) {
    if (targetElement.matches('.qty-select')) {
      let productCode = targetElement.getAttribute('product-code');
      console.log(cart[productCode].qty);
      cart[productCode].qty = targetElement.options[targetElement.selectedIndex].value;
      listDiv.innerHTML = '';
      checkCart();
    }
    targetElement = targetElement.parentElement;
  }
});
