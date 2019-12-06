const rowDiv = document.getElementsByClassName('row')[0];
const logoBtn = document.getElementsByClassName('logo')[0];
const womanBtn = document.getElementById('nav-btn-woman');
const manBtn = document.getElementById('nav-btn-man');
const accBtn = document.getElementById('nav-btn-accessories');

// GET Product List

const getProductList = (src, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', src);
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

const render = data => {
  const dataObj = JSON.parse(data).data;
  Object.values(dataObj).forEach(item => {
    let productDiv = document.createElement('div');
    productDiv.className = 'col';

    const drawColorBox = item => {
      let colorArea = document.createElement('div');
      colorArea.className = 'color-tags-area';

      item.colors.forEach(color => {
        let colorDiv = document.createElement('div');
        colorDiv.className = 'color-tag';
        colorDiv.title = color.name;
        colorDiv.style.backgroundColor = '#' + color.code;
        colorArea.appendChild(colorDiv);
      });
      return colorArea;
    };

    let template = `
            <img
              class="product-pic"
              src=${item.main_image}
            />
            <div class="color-tags-wrap">
                ${drawColorBox(item).innerHTML}
            </div>
            <div class="product-name">${item.title}</div>
            <div class="product-price">TWD.${item.price}</div>
          `;
    productDiv.innerHTML = template;
    rowDiv.appendChild(productDiv);
  });
};

getProductList(
  'https://api.appworks-school.tw/api/1.0/products/all',
  response => {
    render(response);
  }
);

logoBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  getProductList(
    'https://api.appworks-school.tw/api/1.0/products/all',
    response => {
      render(response);
    }
  );
});

womanBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  getProductList(
    'https://api.appworks-school.tw/api/1.0/products/women',
    response => {
      render(response);
    }
  );
});

manBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  getProductList(
    'https://api.appworks-school.tw/api/1.0/products/men',
    function(response) {
      render(response);
    }
  );
});

accBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  getProductList(
    'https://api.appworks-school.tw/api/1.0/products/accessories',
    function(response) {
      render(response);
    }
  );
});

//Search & GET
const search = () => {
  const xhr = new XMLHttpRequest();
  const inputValue = document.getElementById('search-input').value;
  const url =
    'https://api.appworks-school.tw/api/1.0/products/search?keyword=' +
    inputValue;

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        //wait to update
        document.getElementById('').innerHTML = xhr.responseText;
      } else {
        alert('[' + xhr.status + '] ' + xhr.statusText);
      }
    }
  };
  xhr.open('GET', url);
  xhr.send();
};
