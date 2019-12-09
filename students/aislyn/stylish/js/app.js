const rowDiv = document.getElementsByClassName('row')[0];
const logoBtn = document.getElementsByClassName('logo')[0];
const womanBtn = document.getElementById('nav-btn-woman');
const manBtn = document.getElementById('nav-btn-man');
const accBtn = document.getElementById('nav-btn-accessories');
const searchInput = document.getElementById('search-input');
const searchPanel = document.getElementsByClassName('search-panel')[0];
const headerTool = document.getElementsByClassName('header-tools-mini')[0];
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
  //assign Next Page
  if (JSON.parse(data).next_paging !== undefined) {
    nextPage = JSON.parse(data).next_paging;
  } else {
    nextPage = null;
  }

  Object.values(dataObj).forEach(item => {
    let productDiv = document.createElement('div');
    productDiv.className = 'col';
    // Color Box rendering
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
    // render data to template
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
          rowDiv.innerHTML =
            '<div class="no-result">搜尋結果：無相關商品</div>';
        }
      } else if (xhr.status === 400) {
        rowDiv.innerHTML = '<div class="no-result">搜尋結果：無相關商品</div>';
      } else {
        alert(`[${xhr.status}] ${xhr.statusText}`);
      }
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

searchInput.addEventListener('input', e => {
  if (searchInput !== null) {
    rowDiv.innerHTML = '';
    search(render);
  } else {
    alert('請輸入搜尋關鍵字');
  }
});

//for mobile search
searchInput.addEventListener('click', () => {
  console.log('cue');
  searchPanel.style.width = '350px';
  searchInput.style.border = 'solid 1px #979797';
  searchInput.style.borderRadius = '30px';
  headerTool.classList.add('header-tools');
});

//Scroll to Next Page (Infinite Scroll)

window.addEventListener('scroll', () => {
  if (
    document.documentElement.scrollTop + window.innerHeight ===
      document.body.offsetHeight &&
    nextPage !== null
  ) {
    getProductList(currentCategory, nextPage, response => {
      render(response);
    });
  }
});
