function ajax(src, callback) {
  // your code here
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
  // your code here.
  //  document.createElement()  and appendChild()  methods are preferred.

  const body = document.getElementsByTagName('body')[0];
  const dataObj = JSON.parse(data);

  Object.values(dataObj).forEach(function(item) {
    let dataDiv = document.createElement('div');
    let template = `<div class="card">
                                <h3 class="card-title">${item.name}</h3>
                                <p class="card-text">${item.description}</p>
                                <p class="card-text">售價:${item.price}元</p>
                        </div>`;
    dataDiv.innerHTML = template;
    body.appendChild(dataDiv);
  });
}

ajax(
  'https://cwpeng.github.io/live-records-samples/data/products.json',
  function(response) {
    render(response);
  }
); // you should get product information in JSON format and render data in the page
