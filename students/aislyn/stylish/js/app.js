const rowDiv = document.getElementsByClassName('row')[0];
const logoBtn = document.getElementsByClassName('logo')[0];
const womanBtn = document.getElementById('nav-btn-woman');
const manBtn = document.getElementById('nav-btn-man');
const accBtn = document.getElementById('nav-btn-accessories');
const searchBtn = document.getElementById('search-icon');
let nextPage = null;
let currentCategory = '';

// GET Product List

const getProductList = (category, page, callback) => {
  const xhr = new XMLHttpRequest();
  let url =
    'https://api.appworks-school.tw/api/1.0/products/' +
    category +
    '?paging=' +
    page;

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
  currentCategory = category;
};

// RENDER Product List
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

  if (JSON.parse(data).next_paging !== undefined) {
    nextPage = JSON.parse(data).next_paging;
  } else {
    nextPage = null;
  }
};
//GET Next Page

//INITIAL & CALL Product List
getProductList('all', 0, response => {
  render(response);
});

logoBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  getProductList('all', 0, response => {
    render(response);
  });
});

womanBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  getProductList('women', 0, response => {
    render(response);
  });
});

manBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  getProductList('men', 0, response => {
    render(response);
  });
});

accBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  getProductList('accessories', 0, response => {
    render(response);
  });
});

//Search & GET
const search = callback => {
  const xhr = new XMLHttpRequest();
  const inputValue = document.getElementById('search-input').value;
  const url =
    'https://api.appworks-school.tw/api/1.0/products/search?keyword=' +
    inputValue;

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (xhr.responseText != '{"data":[]}') {
          callback(xhr.responseText);
        } else {
          rowDiv.innerHTML = '<div class="no-result">無相關商品</div>';
        }
      } else {
        alert(`[${xhr.status}] ${xhr.statusText}`);
      }
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

searchBtn.addEventListener('click', () => {
  rowDiv.innerHTML = '';
  search(render);
});

//Scroll to Next Page (Infinite Scroll)

window.addEventListener('scroll', () => {
  if (
    document.documentElement.scrollTop + window.innerHeight ===
      document.body.offsetHeight &&
    nextPage !== null
  ) {
    console.log(nextPage);
    getProductList(currentCategory, nextPage, response => {
      render(response);
    });
  }
});
