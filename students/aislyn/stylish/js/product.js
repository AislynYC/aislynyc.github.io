const host = 'https://api.appworks-school.tw';
let productQuery = window.location.search.substring(1);

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

getProductDetail(console.log(JSON.parse(xhr.responseText)));
