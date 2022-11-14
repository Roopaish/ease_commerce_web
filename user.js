// Transitions
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const signUpAlt = document.getElementById("signUp-alt");
const signInAlt = document.getElementById("signIn-alt");
const container = document.getElementById("auth-container");
const logOutButton = document.getElementById("logout");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

signUpAlt.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInAlt.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Creating account
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = signupForm["signup-name"].value;
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  let error = false;

  if (name == "" || email == "" || password == "") {
    showNotification("Please fill in all fields");
    error = true;
  }
  
  if (name.length < 3 || name.match(/^[A-Za-z]+$/) == null) {
    showNotification("Username should only contain letters and should be minimum 3 characters long");
    error = true;
  }

  if (password.length < 6 || password.match(/^[A-Za-z0-9]+$/) == null) {
    showNotification("Password should be minimum 6 characters long and should only contain letters and numbers");
    error = true;
  }

  if (error) return;
    

  fetch(`${apiUrl}api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if ("success" in data) {
        if (data.success) {
          container.classList.remove("right-panel-active");
          showNotification("Account Created! Login to continue");
        } else {
          showNotification(data.message);
        }
      } else {
        container.classList.remove("right-panel-active");
        showNotification("Account Created! Login to continue");
      }
    }
    );
  
});

// Logging in
const signinForm = document.querySelector("#signin-form");

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = signinForm["signin-name"].value;
  const password = signinForm["signin-password"].value;

  const res = await fetch(`${apiUrl}api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      password,
    }),
    credentials: "include",
  });

  const data = await res.json();
  if ("success" in data) {
    if (data.success) {
      changeStatus(data);
      location.reload();
      showNotification("Welcome back!");
    } else {
      changeStatus(null);
      showNotification(data.message);
    }
  } else {
    if (res.status == 200) {
      changeStatus(data);
      location.reload();
      showNotification("Welcome back!");
    } else {
      showNotification("Something went wrong");
    }
  }
});

// Log out
logOutButton.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  changeStatus(null);
});

// Delete Product
const deleteProduct = async (id) => {
  const res = await fetch(`${apiUrl}api/user/product/${currentUser._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
    credentials: "include",
  });

  const data = await res.json();
  handleData(data, res, "Product deleted successfully");
  populateProductList();
};

// Delete comparisons
const deleteComparison = async (id) => {
  console.log(id);
  const res = await fetch(`${apiUrl}api/user/comparison/${currentUser._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
    credentials: "include",
  });

  const data = await res.json();
  handleData(data, res, "Comparison deleted successfully");
  populateComparisonList();
};

// Handle Tabs
const tabs = document.querySelectorAll(".tab-links");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.getElementById(tab.dataset.target);

    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("active");
    });

    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    tab.classList.add("active");
    target.classList.add("active");
  });
});

// Populating the product list
const populateProductList = () => {
  const savedProductListEl = document.querySelector("#products .content");
  savedProductListEl.innerHTML = "";
  if (currentUser.products.length == 0) {
    savedProductListEl.innerHTML = `
      <div class='empty-list'>
      <figure>
        <img src='./assets/images/no-save.png' alt='nothing' />
      </figure>
      <h2>You haven't saved any products yet!</h2>
      <p style='text-align:center; margin: auto;'>Start browsing and save products you like.</p>
    </div>
  `;
  } else {
    currentUser.products.forEach((product) => {
      const {
        name,
        id,
        image,
        priceShow,
        ratingScore,
        review,
        description,
        productUrl,
      } = product;
      let desEl = ``;
      description.map((des) => {
        desEl += `
    <li>${des}</li>
    `;
      });
      savedProductListEl.innerHTML += `
    <div class="product user">
      <div class="product-image">
        <img src="${image}" alt="${name}" />
      </div>
      <div class="product-info">
        <h4 class="product-name">${name ?? "No name specified"}</h4>
       
        <div class="product-price">
        <span>${priceShow ?? ""}</span>
        <br/>
          <span>Rating: ${ratingScore ?? "0"} by ${
        review ?? "0"
      } reviewers</span>
        </div>
        <div class="product-description">
          <h4>Features</h4>
          <ul>${desEl}</ul>
        </div>
      </div>
      <p>
            <a href=${productUrl} target="_blank">Go to Official site</a>
          </p>
      <div class="product-actions">
        <button class="btn btn-danger" onclick="deleteProduct('${id}')">Delete</button>
      </div>
    </div>
    `;
    });
  }
};

populateProductList();

// Populate comparison list
const generateSavedCompareTable = (comparison) => {
  const id = comparison._id;
  let table = `
  <div class='comparison-chart'> 
  <div style='margin: 20px 0px;'>
    <h3>${(comparison.name ?? "Comparison").toUpperCase()}</h3>
    <div class="fancy-scroll-bar table">
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

  comparison.products.forEach((product) => {
    const {
      name,
      image,
      priceShow,
      ratingScore,
      review,
      description,
      productUrl,
      sellerName,
    } = product;
    let desEl = ``;
    description.map((des) => {
      desEl += `
    ${des}<br/><br/>
    `;
    });

    table += `
      <tr>
        <td>
          <div class="product-info">
            <img src=${image} alt=${name} />
            <div class='description'>
              <h4>${name}</h4>
              <p>by ${sellerName}</p>
            </div>
          </div>
        </td>
        <td>${priceShow}</td>
        <td>${ratingScore}</td>
        <td>${review}</td>
        <td><div class='description'>${desEl}</div></td>
        <td><a href="${productUrl}" target="_blank">Buy</a></td>
      </tr>
    `;
  });

  table += `
      </tbody>
    </table>
    </div>
   <div class="comparison-actions">
   <button class="btn btn-danger" onclick="deleteComparison('${id}')">Delete</button>
    </div>
  </div>
  </div>
  `;

  return table;
};

const populateComparisonList = () => {
  const comparisonListEl = document.querySelector("#comparisons .content");
  comparisonListEl.innerHTML = "";
  if (currentUser.comparisons.length == 0) {
    comparisonListEl.innerHTML = `
      <div class='empty-list'>
      <figure>
        <img src='./assets/images/no-save.png' alt='nothing' />
      </figure>
      <h2>You haven't compared any comparisons yet!</h2>
      <p style='text-align:center; margin: auto;'>Start browsing and compare products you like and save them.</p>
    </div>
  `;
  } else {
    currentUser.comparisons.forEach((comparison) => {
      comparisonListEl.innerHTML += generateSavedCompareTable(comparison);
    });
  }
};

populateComparisonList();
