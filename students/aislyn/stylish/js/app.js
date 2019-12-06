const rowDiv = document.getElementsByClassName('row')[0];
const logoBtn = document.getElementsByClassName('logo')[0];
const womanBtn = document.getElementById('nav-btn-woman');
const manBtn = document.getElementById('nav-btn-man');
const accBtn = document.getElementById('nav-btn-accessories');

function ajax(src, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', src);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText);
      } else {
        alert(`[${xhr.status}] ${xhr.statusText}`);
      }
    }
  };
  xhr.send();
}

function render(data) {
  const dataObj = JSON.parse(data).data;
  Object.values(dataObj).forEach(item => {
    let productDiv = document.createElement('div');
    productDiv.className = 'col';
    const drawColorBox = item => {
      item.colors.forEach(color => {
        let colorDiv = document.createElement('div');
        colorDiv.className = 'color-tag';
        colorDiv.style.backgroundColor = color.code;
      });
    };
    let template = `
            <img
              class="product-pic"
              src=${item.main_image}
            />
            <div class="color-tags-area">
                ${drawColorBox(item)}
            </div>
            <div class="product-name">${item.title}</div>
            <div class="product-price">TWD.${item.price}</div>
          `;
    productDiv.innerHTML = template;
    rowDiv.appendChild(productDiv);
  });
}

ajax('https://api.appworks-school.tw/api/1.0/products/all', function(response) {
  render(response);
});

logoBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  ajax('https://api.appworks-school.tw/api/1.0/products/all', function(
    response
  ) {
    render(response);
  });
});

womanBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  ajax('https://api.appworks-school.tw/api/1.0/products/women', function(
    response
  ) {
    render(response);
  });
});

manBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  ajax('https://api.appworks-school.tw/api/1.0/products/men', function(
    response
  ) {
    render(response);
  });
});

accBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  ajax('https://api.appworks-school.tw/api/1.0/products/accessories', function(
    response
  ) {
    render(response);
  });
});
