const memberEl = document.querySelector("#member");
const loginEl = document.querySelector(".login");
const registerLinkEl = document.querySelector("#register_link");
const loginLinkEl = document.querySelector("#login_link");
const registerEl = document.querySelector(".register");
const overlayEl = document.querySelector(".overlay");
const loginClose = document.querySelector(".login_close");
const registerClose = document.querySelector(".register_close");
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

loginClose.addEventListener("click", () => {
  loginEl.classList.add("active");
  overlayEl.classList.add("active");
});

registerClose.addEventListener("click", () => {
  registerEl.classList.add("active");
  overlayEl.classList.add("active");
});

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
const attractionContainer = document.querySelector(".attraction_container");
console.log(attractionContainer);
const getAttractionInfo = async () => {
  await fetch(`${originUrl}/api/attraction/${id}`)
    .then((response) => response.json())
    .then(function (res) {
      const images = res.data.images;
      let slidePosition = 0;
      const attractionTitleEl = document.createElement("h3");
      attractionTitleEl.textContent = res.data.name;
      const attractionSubTitleEl = document.createElement("p");
      attractionSubTitleEl.textContent = `${res.data.category} at ${res.data.mrt}`;
      bookingTitleEl.appendChild(attractionTitleEl);
      bookingTitleEl.appendChild(attractionSubTitleEl);
      const actionContainer = document.createElement("div");
      actionContainer.setAttribute("class", "carousel__actions");
      const prevBtn = document.createElement("button");
      prevBtn.setAttribute("id", "carousel__button--prev");
      const nextBtn = document.createElement("button");
      nextBtn.setAttribute("id", "carousel__button--next");
      actionContainer.appendChild(prevBtn);
      actionContainer.appendChild(nextBtn);

      carouselEl.appendChild(actionContainer);
      const attractionRadioContainer = document.createElement("div");
      attractionRadioContainer.classList.add("carousel_radios");

      const descEl = document.createElement("p");
      descEl.textContent = res.data.description;
      const addressContainer = document.createElement("div");
      const addTitle = document.createElement("h4");
      const addText = document.createElement("p");
      addTitle.textContent = "景點地址： ";
      addText.textContent = res.data.address;
      addressContainer.appendChild(addTitle);
      addressContainer.appendChild(addText);
      attractionContainer.appendChild(descEl);
      attractionContainer.appendChild(addressContainer);

      const transportContainer = document.createElement("div");
      const transportTitle = document.createElement("h4");
      const transportText = document.createElement("p");
      transportTitle.textContent = "交通方式： ";
      transportText.textContent = res.data.transport;
      transportContainer.appendChild(transportTitle);
      transportContainer.appendChild(transportText);
      attractionContainer.appendChild(transportContainer);

      images.map((img, i) => {
        const attractionEl = document.createElement("div");
        attractionEl.setAttribute("class", "carousel__item");
        attractionEl.setAttribute("style", `  background-image: url(${img});`);
        const attractionRadio = document.createElement("div");
        attractionRadio.setAttribute("data-imgIndex", i);
        attractionRadio.setAttribute("class", "carousel_radio");

        if (i == "0") {
          attractionEl.classList.add("carousel__item--visible");
        }
        carouselEl.appendChild(attractionEl);
        console.log(attractionRadio.attributes["data-imgIndex"]);

        attractionRadioContainer.appendChild(attractionRadio);
      });
      carouselEl.appendChild(attractionRadioContainer);

      const slides = document.getElementsByClassName("carousel__item");
      const totalSlides = slides.length;
      const radios = document.querySelectorAll(".carousel_radio");

      document
        .getElementById("carousel__button--next")
        .addEventListener("click", function () {
          moveToNextSlide();
        });
      document
        .getElementById("carousel__button--prev")
        .addEventListener("click", function () {
          moveToPrevSlide();
        });

      radios.forEach((radio, i) => {
        radio.addEventListener("click", () => {
          radios.forEach((radio) => {
            radio.style.backgroundColor = "white";
          });
          for (let slide of slides) {
            slide.classList.remove("carousel__item--visible");
          }
          slides[i].classList.add("carousel__item--visible");
          radios[i].style.backgroundColor = "black";
        });
      });

      function updateSlidePosition() {
        for (let slide of slides) {
          slide.classList.remove("carousel__item--visible");
        }
        radios.forEach((radio) => {
          radio.style.backgroundColor = "white";
        });
        slides[slidePosition].classList.add("carousel__item--visible");
        radios[slidePosition].style.backgroundColor = "black";
      }

      function moveToNextSlide() {
        if (slidePosition === totalSlides - 1) {
          slidePosition = 0;
        } else {
          slidePosition++;
        }

        updateSlidePosition();
      }

      function moveToPrevSlide() {
        if (slidePosition === 0) {
          slidePosition = totalSlides - 1;
        } else {
          slidePosition--;
        }

        updateSlidePosition();
      }
    });
};

const firstHalfEl = document.querySelector("#first-half");
const secondHalfEl = document.querySelector("#second-half");
const feeEl = document.querySelector(".attraction_fee");
firstHalfEl.addEventListener("click", () => {
  secondHalfEl.checked = false;
  feeEl.childNodes[1].textContent = "新台幣 2000元";
});

secondHalfEl.addEventListener("click", () => {
  firstHalfEl.checked = false;
  feeEl.childNodes[1].textContent = "新台幣 2500元";
});

getAttractionInfo();

const a = document.querySelector(".carousel");
console.log(a.childNodes);
