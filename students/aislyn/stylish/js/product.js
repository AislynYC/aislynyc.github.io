const host = 'https://api.appworks-school.tw';
let query = window.location.search.substring(1);
const mainInfo = document.getElementsByClassName('main-info-area')[0];
const subInfo = document.getElementsByClassName('sub-info-area')[0];

// Get Product Details
const getProductDetail = callback => {
  const xhr = new XMLHttpRequest();
  let url = host + '/api/1.0/products/details?' + query;

  xhr.open('GET', url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText);
      } else {
        alert(`[${xhr.status}] ${xhr.statusText}`);
      }
    }
  };
  xhr.send();
};

// Render Product Details to Product Page
const renderProductPage = data => {
  const productDtls = JSON.parse(data).data;

  // ======== Main Info Rendering ========

  // Product Main Picture Rendering
  const mainImgArea = document.getElementsByClassName(
    'product-main-img-area'
  )[0];
  const mainImg = document.createElement('img');
  mainImg.className = 'product-main-img';
  mainImg.setAttribute('src', productDtls.main_image);
  mainImgArea.appendChild(mainImg);

  // Product Id Rendering
  const productId = document.createElement('div');
  productId.className = 'product-id';
  productId.innerHTML = productDtls.id;
  mainInfo.prepend(productId);

  // Product Name Rendering
  const productName = document.createElement('div');
  productName.className = 'product-name';
  productName.innerHTML = productDtls.title;
  mainInfo.prepend(productName);

  // Product Price Rendering
  const productPrice = document.getElementsByClassName('product-price')[0];
  productPrice.innerHTML = 'TWD.' + productDtls.price;

  // Check Stock by Color and Size
  const variants = productDtls.variants;
  const checkColorStock = color => {
    const sizeOfSameColor = variants.filter(item => {
      return item.color_code === color;
    });
    let stockOfSameColor = 0;
    sizeOfSameColor.forEach(item => {
      stockOfSameColor += item.stock;
    });
    if (stockOfSameColor !== 0) {
      return true;
    } else {
      return false;
    }
  };

  const checkVariantStock = (color, size) => {
    const variant = variants.find(item => {
      return item.color_code === color && item.size === size;
    });
    return variant.stock;
  };

  // Color Boxes rendering
  const colorOption = document.querySelector('.color-area>.options');

  const createColorBox = color => {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color-box';
    colorDiv.title = color.name;
    colorDiv.style.backgroundColor = '#' + color.code;
    colorDiv.setAttribute('code', color.code);
    colorOption.appendChild(colorDiv);
  };
  const drawColorBox = item => {
    item.colors.forEach(color => {
      if (checkColorStock(color.code) === true) {
        createColorBox(color);
      } else {
        createColorBox(color);
        const newestColorBox = document.querySelector('.color-box:last-child');
        newestColorBox.classList.add('out-of-stock');
      }
    });
  };
  drawColorBox(productDtls);

  const colorBoxes = colorOption.children;
  const colorBoxesArray = [].slice.call(colorBoxes);
  //Color Box Active & Inactive
  colorBoxesArray[0].classList.add('active');
  colorOption.addEventListener(
    'click',
    e => {
      console.log('color option listener');
      let target = e.target;
      if (target.matches('.color-box') && !target.matches('.out-of-stock')) {
        for (let i = 0; i < colorBoxesArray.length; i++) {
          colorBoxesArray[i].classList.remove('active');
        }
        target.classList.add('active');
      }
    },
    true
  );

  // Size Boxes rendering
  const sizeOption = document.querySelector('.size-area>.options');
  const activeColor = document.querySelector('.color-area>.options>.active');

  const createSizeBox = size => {
    const sizeDiv = document.createElement('div');
    sizeDiv.className = 'size-box';
    sizeDiv.setAttribute('code', size);
    sizeDiv.innerHTML = size;
    sizeOption.appendChild(sizeDiv);
  };

  const drawSizeBox = item => {
    item.sizes.forEach(size => {
      if (checkVariantStock(activeColor.attributes.code.value, size) !== 0) {
        createSizeBox(size);
      } else {
        createSizeBox(size);
        const newestSizeBox = document.querySelector('.size-box:last-child');
        newestSizeBox.classList.add('out-of-stock');
      }
    });
  };
  drawSizeBox(productDtls);

  const sizeBoxes = sizeOption.children;
  const sizeBoxesArray = [].slice.call(sizeBoxes);
  // Size Box Active & Inactive
  sizeBoxesArray[0].classList.add('active');
  sizeOption.addEventListener(
    'click',
    e => {
      console.log('size option listener');
      let target = e.target;
      if (target.matches('.size-box') && !target.matches('.out-of-stock')) {
        for (let i = 0; i < sizeBoxesArray.length; i++) {
          sizeBoxesArray[i].classList.remove('active');
        }
        target.classList.add('active');
      }
    },
    true
  );

  // Check Available Stock
  const checkAvailableStock = () => {
    const activeColor = document.querySelector('.color-area>.options>.active');
    const activeSize = document.querySelector('.size-area>.options>.active');
    console.log(
      'color code:',
      activeColor.attributes.code.value,
      ' size:',
      activeSize.attributes.code.value
    );
    return checkVariantStock(
      activeColor.attributes.code.value,
      activeSize.attributes.code.value
    );
  };
  let availableStock = checkAvailableStock();

  // Change Quantity Limitation According to Available Stock

  colorBoxesArray.forEach(item => {
    item.addEventListener('click', () => {
      availableStock = checkAvailableStock();
      console.log(availableStock);
    });
  });

  sizeBoxesArray.forEach(item => {
    item.addEventListener('click', () => {
      availableStock = checkAvailableStock();
      console.log(availableStock);
    });
  });

  // Plus and Minus Button for ordering

  const minusBtn = document.getElementById('qty-minus-btn');
  const plusBtn = document.getElementById('qty-plus-btn');
  const qtyNumber = document.getElementById('qty-number');
  let orderQty = 1;
  qtyNumber.innerHTML = orderQty;
  minusBtn.addEventListener('click', () => {
    orderQty--;
    if (orderQty <= 1) {
      orderQty = 1;
    }
    qtyNumber.innerHTML = orderQty;
  });
  plusBtn.addEventListener('click', () => {
    orderQty++;
    qtyNumber.innerHTML = orderQty;
  });

  // Product Description Rendering
  const descDiv = document.getElementsByClassName('desc')[0];
  const descDescription = productDtls.description.replace(/\s+/g, '<br />');
  let template = `<div class="desc-note">${productDtls.note}</div>
                <br />
                <div class="desc-texture">${productDtls.texture}</div>
                <div class="desc-description">${descDescription}</div>
                <br />
                <div class="desc-wash">${productDtls.wash}</div>
                <div class="desc-place">${productDtls.place}</div>`;
  descDiv.innerHTML = template;

  // ======== Sub Info Rendering ========

  // Sub Info Story Rendering
  const subStory = document.createElement('div');
  subStory.className = 'sub-info-story';
  subStory.innerHTML = productDtls.story;
  subInfo.appendChild(subStory);

  // Sub Image Rendering
  const subImgs = productDtls.images;

  const subImgArea = document.createElement('div');
  subImgArea.className = 'sub-img-area';

  subImgs.forEach(item => {
    const subImgWrap = document.createElement('div');
    subImgWrap.className = 'product-sub-img-wrap';

    const subImg = document.createElement('img');
    subImg.className = 'product-sub-img';
    subImg.setAttribute('src', item);
    subImgWrap.appendChild(subImg);
    subImgArea.appendChild(subImgWrap);
    subInfo.appendChild(subImgArea);
  });
};

getProductDetail(response => {
  renderProductPage(response);
});
