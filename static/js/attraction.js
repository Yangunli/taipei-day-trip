const memberEl = document.querySelector("#member");
const loginEl = document.querySelector(".login");
const registerLinkEl = document.querySelector("#register_link");
const loginLinkEl = document.querySelector("#login_link");
const registerEl = document.querySelector(".register");
const overlayEl = document.querySelector(".overlay");

// 會員系統邏輯

memberEl.addEventListener(
  "click",

  () => {
    loginEl.classList.remove("active");
    overlayEl.classList.remove("active");
  }
);

registerLinkEl.addEventListener(
  "click",

  () => {
    loginEl.classList.add("active");
    registerEl.classList.remove("active");
  }
);

loginLinkEl.addEventListener(
  "click",

  () => {
    loginEl.classList.remove("active");
    registerEl.classList.add("active");
  }
);

overlayEl.addEventListener("click", () => {
  overlayEl.classList.add("active");
  loginEl.classList.add("active");
  registerEl.classList.add("active");
});

const attractionContainerEl = document.querySelector(".attraction_container");
const attractionMainEl = document.querySelector(".attraction_main");
const carouselEl = document.querySelector(".carousel");
const bookingTitleEl = document.querySelector(".booking_title");

const originUrl = window.location.origin;
let path = window.location.pathname;
path = path.split("/");
const id = path[2] * 1;

const attractionInfo = document.querySelector(".attraction_info");

const getAttractionInfo = async () => {
  await fetch(`${originUrl}/api/attraction/${id}`)
    .then((response) => response.json())
    .then(function (res) {
      console.log(res);
      const images = res.data.images;

      const firstImg = images[0];
      const attractionImg = document.createElement("img");
      attractionImg.setAttribute("src", firstImg);
      carouselEl.appendChild(attractionImg);

      const attractionTitleEl = document.createElement("h3");
      attractionTitleEl.textContent = res.data.name;
      const attractionSubTitleEl = document.createElement("p");
      attractionSubTitleEl.textContent = `${res.data.category} at ${res.data.mrt}`;
      bookingTitleEl.appendChild(attractionTitleEl);
      bookingTitleEl.appendChild(attractionSubTitleEl);
      //   images.map((img) => {
      //     const attractionImg= document.createElement("img")
      //     attractionImg.setAttribute("src", img)
      //     carouselEl.appendChild(attractionImg)
      //     console.log(img)
      //   } )
    });
};

getAttractionInfo();
