const apiUrl = "http://localhost:8800/";
// const apiUrl = "https://ease-commerce.herokuapp.com/";

var currentUser = null;
const imgEl = document.getElementById("user-image");
const authWrapperEl = document.querySelector(".auth-wrapper");
const userLayoutEl = document.querySelector(".user-layout");
const userNameEl = document.querySelector(".user-name");
const userEmailEl = document.querySelector(".user-email");

// Check if user is logged in
const checkStatus = () => {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser != null) {
    if (authWrapperEl != null && userLayoutEl != null) {
      authWrapperEl.classList.add("hidden");
      userLayoutEl.classList.remove("hidden");
      userNameEl.innerHTML = "@" + currentUser.name;
      userEmailEl.innerHTML = currentUser.email;
    }
    if (imgEl !== null) {
      imgEl.src = `https://avatars.dicebear.com/api/initials/${currentUser.name}.svg`;
    }
    // document.querySelector("#login").style.display = "none";
    // document.querySelector("#logout").style.display = "block";
  } else {
    if (authWrapperEl != null && userLayoutEl != null) {
      authWrapperEl.classList.remove("hidden");
      userLayoutEl.classList.add("hidden");
    }
    if (imgEl !== null) {
      imgEl.src = "https://avatars.dicebear.com/api/bottts/ram%20sam.svg";
    }
    // document.querySelector("#login").style.display = "block";
    // document.querySelector("#logout").style.display = "none";
  }
};

const changeStatus = (data) => {
  localStorage.setItem("currentUser", JSON.stringify(data));
  checkStatus();
};

const handleData = (data, res, success) => {
  if ("success" in data) {
    if (data.success) {
      changeStatus(data);
      showNotification(success ?? "Success");
    } else {
      showNotification(data.message);
    }
  } else {
    if (res.status == 200) {
      changeStatus(data);
      showNotification(success ?? "Success");
    } else {
      showNotification("Something went wrong");
    }
  }
};

checkStatus();

const showNotification = (message) => {
  const notificationEl = document.querySelector(".notification");
  notificationEl.innerHTML = message;
  notificationEl.classList.remove("hide");
  setTimeout(() => {
    notificationEl.classList.add("hide");
  }, 3000);
};
