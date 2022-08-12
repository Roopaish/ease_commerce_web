// const apiUrl = "http://localhost:3000/";
const apiUrl = "https://ease-commerce.herokuapp.com/";
const darazSearchUrl = (name) => `${apiUrl}daraz?name=${name}`;

const darazProductListEl = document.querySelector(
  ".daraz .products-carousel .content"
);
const searchFormEl = document.querySelector(".search-form");
const searchInputEl = document.querySelector(".search-box input");
// const pageTitleEl = document.querySelector(".page-title");

generateProductListItem = (name, imageUrl, url, price) => {
  return `
    <div class="product" data-url=${url}>
      <div class="product-image">
        <img src=${imageUrl} alt=${name} />
      </div>
      <div class="product-details">
        <h4 class="product-name">${name}</h4>
        <div class="product-price">
          <span>${price}</span>
        </div>
      </div>
    </div>
  `;
};

generateNotFoundUI = () => {
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

generateLoadingUI = () => {
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

const getItemsFromDaraz = async (name) => {
  try {
    // pageTitleEl.innerHTML = `Search Results for <div style='font-style:italic; display:inline; font-weight:600;'>"${name}"</div>`;
    darazProductListEl.style.cssText = "overflow-x:hidden;";
    darazProductListEl.innerHTML = generateLoadingUI();
    const res = await fetch(darazSearchUrl(name));
    const data = await res.json();

    darazProductListEl.innerHTML = "";
    data.mods.listItems.forEach((item) => {
      const { name, image, productUrl, priceShow } = item;
      darazProductListEl.innerHTML += generateProductListItem(
        name,
        image,
        productUrl,
        priceShow
      );
    });

    darazProductListEl.style.cssText = "overflow-x:scroll;";
    console.log(data);
  } catch (e) {
    darazProductListEl.innerHTML = generateNotFoundUI();
  }
};

searchFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = searchInputEl.value;
  await getItemsFromDaraz(name);
});
