// const apiUrl = "http://localhost:3000/";
const apiUrl = "https://ease-commerce.herokuapp.com/";
const darazSearchUrl = (name) => `${apiUrl}daraz?name=${name}`;

const darazProductListEl = document.querySelector(
  ".daraz .products-carousel .content"
);
const searchFormEl = document.querySelector(".search-form");
const searchInputEl = document.querySelector(".search-box input");
const modalEl = document.querySelector(".modal");
let productEls = document.querySelectorAll(".product");
let productsData = [];
// const pageTitleEl = document.querySelector(".page-title");

const generateProductListItem = (item) => {
  const {
    name,
    nid,
    image,
    productUrl,
    priceShow,
    description,
    sellerName,
    price,
  } = item;
  // description = <String>[]
  return `
    <div class="product" data-id=${nid}>
      <div class="product-image">
        <img src=${image} alt=${name} />
      </div>
      <div class="product-details">
        <h4 class="product-name">${name}</h4>
        <div class="product-price">
          <span>${priceShow}</span>
        </div>
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
const openModal = (productId) => {
  modalEl.classList.remove("hide");
  modalEl.classList.add("show");
  const item = productsData.find((e) => e.nid == productId);
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
    data.mods.listItems.forEach((item) => {
      darazProductListEl.innerHTML += generateProductListItem(item);
    });

    darazProductListEl.style.cssText = "overflow-x:scroll;";
    productsData = data.mods.listItems;
  } catch (e) {
    darazProductListEl.innerHTML = generateNotFoundUI();
  }
  fetchNewlyAddedProductsEls();
};

searchFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  searchFormEl.blur();
  searchInputEl.blur();
  const name = searchInputEl.value;
  await getItemsFromDaraz(name);
});

addEventListener("DOMContentLoaded", () => {
  getItemsFromDaraz("laptop");
});

const fetchNewlyAddedProductsEls = () => {
  productEls = document.querySelectorAll(".product");
  productEls.forEach((productEl) => {
    productEl.addEventListener("click", (e) => {
      const productId = productEl.getAttribute("data-id");
      openModal(productId);
    });
  });
};
