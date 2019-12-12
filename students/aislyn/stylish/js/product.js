const host = 'https://api.appworks-school.tw';
let productQuery = window.location.search.substring(1);
const mainInfo = document.getElementsByClassName('main-info-area')[0];
const subInfo = document.getElementsByClassName('sub-info-area')[0];

const getProductDetail = callback => {
  const xhr = new XMLHttpRequest();
  let url = host + '/api/1.0/products/details?' + productQuery;

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

const renderProductPage = data => {
  let productDtls = JSON.parse(data).data;

  // ======== Main Info Rendering ========
  let productId = document.createElement('div');
  productId.className = 'product-id';
  productId.innerHTML = productDtls.id;
  mainInfo.prepend(productId);

  let productName = document.createElement('div');
  productName.className = 'product-name';
  productName.innerHTML = productDtls.title;
  mainInfo.prepend(productName);

  const productPrice = document.getElementsByClassName('product-price')[0];
  productPrice.innerHTML = 'TWD.' + productDtls.price;

  // Color Boxes rendering
  const drawColorBox = item => {
    const colorOption = document.querySelector('.color-area>.options');

    item.colors.forEach(color => {
      let colorDiv = document.createElement('div');
      colorDiv.className = 'color-box';
      colorDiv.title = color.name;
      colorDiv.style.backgroundColor = '#' + color.code;
      colorOption.appendChild(colorDiv);
    });
  };
  drawColorBox(productDtls);

  // Size Boxes rendering
  const drawSizeBox = item => {
    const sizeOption = document.querySelector('.size-area>.options');

    item.sizes.forEach(size => {
      let sizeDiv = document.createElement('div');
      sizeDiv.className = 'size-box';
      sizeDiv.innerHTML = size;
      sizeOption.appendChild(sizeDiv);
    });
  };
  drawSizeBox(productDtls);

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
  let subStory = document.createElement('div');
  subStory.className = 'sub-info-story';
  subStory.innerHTML = productDtls.story;
  subInfo.appendChild(subStory);

  // Sub Image Rendering
  const subImgs = productDtls.images;

  const subImgArea = document.createElement('div');
  subImgArea.className = 'sub-img-area';

  subImgs.forEach(item => {
    let subImgWrap = document.createElement('div');
    subImgWrap.className = 'product-sub-img-wrap';

    let subImg = document.createElement('img');
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
