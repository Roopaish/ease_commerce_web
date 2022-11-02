const apiUrl = "http://localhost:8800/";
// const apiUrl = "https://ease-commerce.herokuapp.com/";
const darazSearchUrl = (name) => `${apiUrl}api/product/daraz/${name}`;
const amazonSearchUrl = (name) => `${apiUrl}api/product/amazon/${name}`;

const darazProductListEl = document.querySelector(
  ".daraz .products-carousel .content"
);
const amazonProductListEl = document.querySelector(
  ".amazon .products-carousel .content"
);
const searchFormEl = document.querySelector(".search-form");
const searchInputEl = document.querySelector(".search-box input");
const modalEl = document.querySelector(".modal");
let productEls = document.querySelectorAll(".product");
let darazProducts = [];
let amazonProducts = [];
// const pageTitleEl = document.querySelector(".page-title");

var isBeingCompared = false;

const generateProductListItem = (item, vendor) => {
  const { name, nid, image, priceShow, ratingScore, review } = item;
  return `
    <div class="product" data-id=${nid} data-vendor=${vendor}>
      <div class="product-image">
        <img src=${image} alt=${name} />
        
      </div>
      <div class="product-details">
        <h4 class="product-name">${name ?? "No name specified"}</h4>
        <div class="product-price">
          <span>${priceShow ?? ""}</span>
        </div>
        <div class="product-price">
          <span>Rating: ${ratingScore ?? "0"} by ${
    review ?? "0"
  } reviewers</span>
        </div>
      </div>
      <div class="form-group product-selector">
        <input type="checkbox" class="product-checkbox" id=${nid} data-id=${nid} data-vendor=${vendor}>
        <label for=${nid}></label>
      </div>
    </div>
  `;
};

const generateNotFoundUI = () => {
  return `
  <div class='empty-list'>
    <figure>
      <img src='./assets/images/nothing.jpg' alt='nothing' />
    </figure>
    <h2>NO RESULTS FOUND!</h2>
    <p>We didn't find what you're looking for. Sorry for the inconvenience.<br />Please try another way.</p>
  </div>
  `;
};

const generateLoadingUI = () => {
  return `
  <div class="loader">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
  `;
};

// Modal Actions
const openProductDetailModal = (productId, vendor) => {
  modalEl.classList.remove("hide");
  modalEl.classList.add("show");
  const item = (vendor == "daraz" ? darazProducts : amazonProducts).find(
    (e) => e.nid == productId
  );
  const { name, image, priceShow, sellerName, description, productUrl } = item;

  let desEl = ``;
  description.map((des) => {
    desEl += `
  <li>${des}</li>
  `;
  });

  modalEl.innerHTML = `
  <div class="close-button">
      <i class="lni lni-close"></i>
    </div>
    <div class="container">
      <h3>${name}</h3>
      <div class="product-info-grid">
        <figure>
          <img src=${image} alt=${name} />
        </figure>
        <div class="product-info">
          <div>
            <span> Price:</span> ${priceShow}
          </div>
          <div>
            <span>SellerName:</span> ${sellerName}
          </div>
          <p>
            ${desEl}
          </p>
          <p>
            <a href=${productUrl} target="_blank">Go to Official site</a>
          </p>
        </div>
      </div>
    </div>
  `;

  const modalCloseButtonEl = document.querySelector(".close-button");

  modalCloseButtonEl.addEventListener("click", () => {
    modalEl.classList.add("hide");
    modalEl.classList.remove("show");
  });
};

const getItemsFromDaraz = async (name) => {
  try {
    // pageTitleEl.innerHTML = `Search Results for <div style='font-style:italic; display:inline; font-weight:600;'>"${name}"</div>`;
    darazProductListEl.style.cssText = "overflow-x:hidden;";
    darazProductListEl.innerHTML = generateLoadingUI();
    const res = await fetch(darazSearchUrl(name));
    const data = await res.json();

    darazProductListEl.innerHTML = "";
    data.listItems.forEach((item) => {
      darazProductListEl.innerHTML += generateProductListItem(item, "daraz");
    });

    darazProductListEl.style.cssText = "overflow-x:scroll;";
    darazProducts = data.listItems;
  } catch (e) {
    darazProductListEl.innerHTML = generateNotFoundUI();
  }
  applyEventHandlingToProducts();
};

const getItemsFromAmazon = async (name) => {
  try {
    // pageTitleEl.innerHTML = `Search Results for <div style='font-style:italic; display:inline; font-weight:600;'>"${name}"</div>`;
    amazonProductListEl.style.cssText = "overflow-x:hidden;";
    amazonProductListEl.innerHTML = generateLoadingUI();
    const res = await fetch(amazonSearchUrl(name));
    const data = await res.json();

    amazonProductListEl.innerHTML = "";
    data.listItems.forEach((item) => {
      amazonProductListEl.innerHTML += generateProductListItem(item, "amazon");
    });

    amazonProductListEl.style.cssText = "overflow-x:scroll;";
    amazonProducts = data.listItems;
  } catch (e) {
    amazonProductListEl.innerHTML = generateNotFoundUI();
  }
  applyEventHandlingToProducts();
};

searchFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  searchFormEl.blur();
  searchInputEl.blur();
  const name = searchInputEl.value;
  await getItemsFromDaraz(name);
  // await getItemsFromAmazon(name);
});

addEventListener("DOMContentLoaded", () => {
  getItemsFromDaraz("laptop");
  getItemsFromAmazon("laptop");
});

const applyEventHandlingToProducts = () => {
  productEls = document.querySelectorAll(".product");
  productEls.forEach((productEl) => {
    const productId = productEl.getAttribute("data-id");
    const vendor = productEl.getAttribute("data-vendor");
    productEl
      .querySelector(".product-details")
      .addEventListener("click", () => {
        openProductDetailModal(productId, vendor);
      });
  });
};

/// Comparing
const modeEl = document.querySelector(".mode");
const compareBtnEl = document.getElementById("compare-button");

modeEl.addEventListener("change", (e) => {
  if (modeEl.checked) {
    startCompareMode();
  } else {
    endCompareMode();
  }
});

const startCompareMode = () => {
  productEls = document.querySelectorAll(".product");
  productEls.forEach((productEl) => {
    productEl.classList.add("compare-mode");
    compareBtnEl.classList.add("fixed-button");
  });
};

const endCompareMode = () => {
  productEls = document.querySelectorAll(".product");
  productEls.forEach((productEl) => {
    productEl.classList.remove("compare-mode");
    compareBtnEl.classList.remove("fixed-button");
  });
};

compareBtnEl.addEventListener("click", () => {
  const productCheckboxes = document.querySelectorAll(".product-checkbox");

  const selectedProducts = [];
  productCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const productId = checkbox.getAttribute("data-id");
      const vendor = checkbox.getAttribute("data-vendor");
      const item = (vendor == "daraz" ? darazProducts : amazonProducts).find(
        (e) => e.nid == productId
      );
      selectedProducts.push(item);
    }
  });

  if (selectedProducts.length < 2) {
    alert("Please select at least 2 products to compare");
    return;
  }

  modalEl.innerHTML = generateCompareTable(selectedProducts);
  const modalCloseButtonEl = document.querySelector(".close-button");

  modalCloseButtonEl.addEventListener("click", () => {
    modalEl.classList.add("hide");
    modalEl.classList.remove("show");
  });

  modalEl.classList.add("show");
  modalEl.classList.remove("hide");
  modalEl.style.cssText = "overflow-y:scroll;";
});

const generateCompareTable = (selectedProducts) => {
  let table = `
  <div class="close-button">
    <i class="lni lni-close"></i>
  </div>
  <div class="container">
    <h3>Compare Products</h3>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Rating</th>
          <th>Reviews</th>
          <th>Features</th>
          <th>Buy</th>
        </tr>
      </thead>
      <tbody>
  `;

  selectedProducts.forEach((product) => {
    let desEl = ``;
    product.description.map((des) => {
      desEl += `
    ${des}<br/><br/>
    `;
    });

    table += `
      <tr>
        <td>
          <div class="product-info">
            <img src=${product.image} alt=${product.name} />
            <div>
              <h4>${product.name}</h4>
              <p>by ${product.sellerName}</p>
            </div>
          </div>
        </td>
        <td>${product.priceShow}</td>
        <td>${product.ratingScore}</td>
        <td>${product.review}</td>
        <td><div>${desEl}</div></td>
        <td><a href="${product.productUrl}" target="_blank">Buy</a></td>
      </tr>
    `;
  });

  table += `
      </tbody>
    </table>
  </div>
  `;

  return table;
};
