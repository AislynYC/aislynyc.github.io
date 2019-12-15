const fake = `{"data":{"id":201807201824,"category":"women","title":"前開衩扭結洋裝","description":"厚薄：薄彈性：無","price":799,"texture":"棉 100%","wash":"手洗，溫水","place":"中國","note":"實品顏色依單品照為主","story":"O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.","colors":[{"code":"FFFFFF","name":"白色"},{"code":"DDFFBB","name":"亮綠"},{"code":"CCCCCC","name":"淺灰"}],"sizes":["S","M","L"],
"variants": [
  { "color_code": "FFFFFF", "size": "S", "stock": 0 },
  { "color_code": "FFFFFF", "size": "M", "stock": 0 },
  { "color_code": "FFFFFF", "size": "L", "stock": 0 },
  { "color_code": "DDFFBB", "size": "S", "stock": 6 },
  { "color_code": "DDFFBB", "size": "M", "stock": 0 },
  { "color_code": "DDFFBB", "size": "L", "stock": 5 },
  { "color_code": "CCCCCC", "size": "S", "stock": 0 },
  { "color_code": "CCCCCC", "size": "M", "stock": 5 },
  { "color_code": "CCCCCC", "size": "L", "stock": 9 }],
  "main_image": "https://api.appworks-school.tw/assets/201807201824/main.jpg", "images": ["https://api.appworks-school.tw/assets/201807201824/0.jpg", "https://api.appworks-school.tw/assets/201807201824/1.jpg", "https://api.appworks-school.tw/assets/201807201824/0.jpg", "https://api.appworks-school.tw/assets/201807201824/1.jpg"]}}`;

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
        console.log(typeof xhr.responseText);
        callback(fake);
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
  const mainImgArea = document.getElementsByClassName('product-main-img-area')[0];
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
  // Color Box Active & Inactive
  // set default selection
  for (let i = 0; i < colorBoxesArray.length; i++) {
    if (checkColorStock(colorBoxesArray[i].attributes.code.value) === true) {
      colorBoxesArray[i].classList.add('active');
      break;
    }
  }
  // set active selection after clicking
  colorOption.addEventListener(
    'click',
    e => {
      let target = e.target;
      if (target.matches('.color-box') && !target.matches('.out-of-stock')) {
        for (let i = 0; i < colorBoxesArray.length; i++) {
          colorBoxesArray[i].classList.remove('active');
        }
        target.classList.add('active');
      }
      for (let i = 0; i < sizeBoxesArray.length; i++) {
        sizeBoxesArray[i].classList.remove('active');
      }
      for (let i = 0; i < sizeBoxesArray.length; i++) {
        const activeColor = document.querySelector('.color-area>.options>.active');

        if (
          checkVariantStock(
            activeColor.attributes.code.value,
            sizeBoxesArray[i].attributes.code.value
          ) !== 0
        ) {
          sizeBoxesArray[i].classList.add('active');
          break;
        }
      }
    },
    true
  );

  // Size Boxes rendering
  const sizeOption = document.querySelector('.size-area>.options');

  const createSizeBox = size => {
    const sizeDiv = document.createElement('div');
    sizeDiv.className = 'size-box';
    sizeDiv.setAttribute('code', size);
    sizeDiv.innerHTML = size;
    sizeOption.appendChild(sizeDiv);
  };

  const drawSizeBox = item => {
    const activeColor = document.querySelector('.color-area>.options>.active');
    item.sizes.forEach(size => {
      createSizeBox(size);
      if (checkVariantStock(activeColor.attributes.code.value, size) === 0) {
        const newestSizeBox = document.querySelector('.size-box:last-child');
        newestSizeBox.classList.add('out-of-stock');
      }
    });
  };
  drawSizeBox(productDtls);

  const sizeBoxes = sizeOption.children;
  const sizeBoxesArray = [].slice.call(sizeBoxes);
  // Size Box Active & Inactive
  // set default selection
  for (let i = 0; i < sizeBoxesArray.length; i++) {
    const activeColor = document.querySelector('.color-area>.options>.active');
    if (
      checkVariantStock(
        activeColor.attributes.code.value,
        sizeBoxesArray[i].attributes.code.value
      ) !== 0
    ) {
      sizeBoxesArray[i].classList.add('active');
      break;
    }
  }
  // set active selection after clicking
  sizeOption.addEventListener(
    'click',
    e => {
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
    return checkVariantStock(activeColor.attributes.code.value, activeSize.attributes.code.value);
  };
  let availableStock = checkAvailableStock();

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
    if (orderQty > availableStock) {
      orderQty = availableStock;
    }
    qtyNumber.innerHTML = orderQty;
  });

  // Change Quantity Limitation According to Available Stock

  colorBoxesArray.forEach(item => {
    item.addEventListener('click', () => {
      const activeColor = document.querySelector('.color-area>.options>.active');
      orderQty = 1;
      qtyNumber.innerHTML = orderQty;
      console.log(availableStock);

      // Update Size Out of Stock while Switching Focus of Color
      sizeBoxesArray.forEach(size => {
        console.log(
          size,
          checkVariantStock(activeColor.attributes.code.value, size.attributes.code.value),
          'activeColor:' + activeColor.attributes.code.value
        );
        size.classList.remove('out-of-stock');
        if (
          checkVariantStock(activeColor.attributes.code.value, size.attributes.code.value) === 0
        ) {
          size.classList.add('out-of-stock');
        }
      });
    });
  });

  sizeBoxesArray.forEach(item => {
    item.addEventListener('click', () => {
      availableStock = checkAvailableStock();
      orderQty = 1;
      qtyNumber.innerHTML = orderQty;
      console.log(availableStock);
    });
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
