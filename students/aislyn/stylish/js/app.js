const host = 'https://api.appworks-school.tw';
const rowDiv = document.getElementsByClassName('row')[0];
const logoBtn = document.getElementsByClassName('logo')[0];
const womanBtn = document.getElementById('nav-btn-woman');
const manBtn = document.getElementById('nav-btn-man');
const accBtn = document.getElementById('nav-btn-accessories');
const searchInput = document.getElementById('search-input');
const searchPanel = document.getElementsByClassName('search-panel')[0];
const headerTool = document.getElementsByClassName('header-tools-mini')[0];
const slideArea = document.getElementsByClassName('slide-area')[0];
const slideDot = document.getElementsByClassName('slide-dot')[0];
let nextPage = null;
let currentCategory = '';

// GET Product List

const getProductList = (category, page, callback) => {
  const xhr = new XMLHttpRequest();
  let url = host + '/api/1.0/products/' + category + '?paging=' + page;

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
    //Loading
    isLoading = false;
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
  const url = host + '/api/1.0/products/search?keyword=' + inputValue;

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (xhr.responseText != '{"data":[]}') {
          callback(xhr.responseText);
        } else {
          rowDiv.innerHTML =
            '<div class="no-result">搜尋結果：無相關商品</div>';
        }
      } else {
        alert(`[${xhr.status}] ${xhr.statusText}`);
      }
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

searchInput.addEventListener('input', () => {
  if (searchInput.value.trim() != '') {
    rowDiv.innerHTML = '';
    search(render);
  }
});

//for mobile search
searchInput.addEventListener('click', () => {
  searchPanel.style.width = '100%';
  searchInput.style.border = 'solid 1px #979797';
  searchInput.style.borderRadius = '30px';
  headerTool.classList.add('header-tools');
});

//Scroll to Next Page (Infinite Scroll)

let isLoading = false;

window.addEventListener('scroll', () => {
  console.log(
    document.documentElement.scrollTop + window.innerHeight,
    document.body.offsetHeight
  );
  if (
    // 1. condition for loading next page
    document.documentElement.scrollTop + window.innerHeight + 60 >=
      document.body.offsetHeight &&
    nextPage !== null &&
    isLoading === false
  ) {
    isLoading = true;
    // 2. Parameters required to get & render next page
    //    - Current Category viewed by user
    //    - What is the next page?
    getProductList(currentCategory, nextPage, response => {
      render(response);
    });
  }
});
// 3. Prevent duplicate request caused by user action
//    -isLoading

//Marketing Campaigns
const getCampaigns = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText);
      } else {
        alert(`[${xhr.status}] ${xhr.statusText}`);
      }
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

const renderCampaigns = response => {
  const dataObj = JSON.parse(response).data;

  Object.values(dataObj).forEach(item => {
    let campaignSlide = document.createElement('div');
    campaignSlide.className = 'campaign-slide';
    let dot = document.createElement('span');
    dot.className = 'dot';
    let picUrl = host + item.picture;

    let template = `
                    <div class="story-container" style="background-image: url(${picUrl})">
                    <div class="story">${item.story}</div>
                    </div>
                    `;
    campaignSlide.innerHTML = template;
    slideArea.appendChild(campaignSlide);
    slideDot.appendChild(dot);
  });
};

getCampaigns(host + '/api/1.0/marketing/campaigns', response => {
  renderCampaigns(response);
});

// const showSlides = () => {
//   let i;
//   const slides = document.getElementsByClassName('story-container');
//   const dots = document.getElementsByClassName('dot');
//   for (i = 0; i < slides.length; i++) {
//     slides[i].classList.add('active');
//   }
// };

// let slideIndex = 0; // 一開始要顯示的圖，0 的話就是顯示第一張
// const slides = document.getElementsByClassName('story-container');
// const timer = 2000;
// const interval = window.setInterval(showNext, timer);
// console.log(slides.item(1));
// // 帶入目前要顯示第幾張圖
// var showCurrent = function() {
//   var itemToShow = Math.abs(slideIndex % slides.length); // 取餘數才能無限循環
//   [].forEach.call(items, function(el) {
//     el.classList.remove('show'); // 將所有 img 的 class="show" 移除
//   });
//   slides[itemToShow].classList.add('show'); // 將要顯示的 img 加入 class="show"
// };

// function showNext() {
//   slideIndex++;
//   showCurrent();
// }

// // 滑鼠移到 #slider 上方時，停止循環計時
// slideArea.addEventListener('mouseover', function() {
//   interval = clearInterval(interval);
// });

// // 滑鼠離開 #slider 時，重新開始循環計時
// slideArea.addEventListener('mouseout', function() {
//   interval = window.setInterval(showNext, timer);
// });

// // 綁定點擊上一張，下一張按鈕的事件
// // nextBtn.addEventListener('click', showNext, false);
// // prevBtn.addEventListener('click', showPrev, false);

// // 一開始秀出第一張圖，也可以在 HTML 的第一個 img 裡加上 class="show"
// slides[0].classList.add('show');
