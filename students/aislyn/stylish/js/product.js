const host = 'https://api.appworks-school.tw';
let productId;

const getProductDetail = () => {
  const xhr = new XMLHttpRequest();
  let url = host + '/api/1.0/products/details?id=?' + productId;

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
