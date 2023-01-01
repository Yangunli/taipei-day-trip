const attractionMainEl = document.querySelector(".attraction");
const carouselEl = document.querySelector(".carousel");
const bookingTitleEl = document.querySelector(".booking_title");
const modalEl = document.querySelector("#modal");
let path = window.location.pathname.split("/");
const id = parseInt(path[2]);

const attractionInfo = document.querySelector(".attraction_info");
const attractionContainer = document.querySelector(".attraction_container");

const redirectModel = document.querySelector("#modal__redirect");
const redirectModelClose = document.querySelector(".modal__redirect--close");

redirectModelClose.addEventListener("click", () => {
  redirectModel.close();
});

function modalClose() {
  modalEl.close();
}

function renderInfoDOM(data) {
  attractionInfo.style.display = "grid";
  attractionContainer.style.display = "flex";
  carouselEl.style.display = "block";
  const images = data?.images;
  const attractionTitleEl = document.createElement("h3");
  attractionTitleEl.textContent = data.name;
  const attractionSubTitleEl = document.createElement("p");
  attractionSubTitleEl.textContent = `${data.category} at ${data.mrt}`;
  bookingTitleEl.appendChild(attractionTitleEl);
  bookingTitleEl.appendChild(attractionSubTitleEl);
  const actionContainer = document.createElement("div");
  actionContainer.setAttribute("class", "carousel__actions");

  carouselEl.appendChild(actionContainer);
  const attractionRadioContainer = document.createElement("div");
  attractionRadioContainer.classList.add("carousel__radios");

  const descEl = document.createElement("p");
  descEl.textContent = data.description;
  const addressContainer = document.createElement("div");
  const addTitle = document.createElement("h4");
  const addText = document.createElement("p");
  const mapIcon = document.createElement("span");
  mapIcon.classList.add("material-symbols-outlined", "addMap");
  mapIcon.textContent = "location_on";

  addTitle.textContent = "景點地址： ";
  addText.textContent = data.address;
  addText.appendChild(mapIcon);
  addressContainer.appendChild(addTitle);
  addressContainer.appendChild(addText);
  attractionContainer.appendChild(descEl);
  attractionContainer.appendChild(addressContainer);

  const attractionMap = document.createElement("iframe");
  attractionMap.setAttribute("frameborder", 0);
  attractionMap.setAttribute("scrolling", "no");
  attractionMap.setAttribute("marginheight", "0");
  attractionMap.setAttribute(
    "src",
    `https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${data.lat},${data.lng}&z=16&output=embed&t=`
  );

  modalEl.appendChild(attractionMap);

  const transportContainer = document.createElement("div");
  const transportTitle = document.createElement("h4");
  const transportText = document.createElement("p");
  transportTitle.textContent = "交通方式： ";
  transportText.textContent = data.transport;
  transportContainer.appendChild(transportTitle);
  transportContainer.appendChild(transportText);
  attractionContainer.appendChild(transportContainer);

  const prevBtn = document.createElement("button");
  prevBtn.setAttribute("id", "carousel__button--prev");
  const nextBtn = document.createElement("button");
  nextBtn.setAttribute("id", "carousel__button--next");
  actionContainer.appendChild(prevBtn);
  actionContainer.appendChild(nextBtn);
  images.map((img, i) => {
    const attractionEl = document.createElement("img");
    attractionEl.setAttribute("class", "carousel__item");
    attractionEl.setAttribute("src", img);
    attractionEl.setAttribute("alt", "");
    const attractionRadio = document.createElement("div");
    attractionRadio.setAttribute("class", "carousel__radios__radio");

    if (i == "0") {
      attractionEl.style.opacity = 1;
      attractionRadio.style.backgroundColor = "var(--gray-50)";
    }

    carouselEl.appendChild(attractionEl);
    attractionRadioContainer.appendChild(attractionRadio);
  });
  carouselEl.appendChild(attractionRadioContainer);
  loadingEnd();
}

function renderAttractionNotFoundDOM() {
  carouselEl.remove();
  attractionInfo.remove();
  attractionContainer.remove();
  const notfoundEl = document.createElement("div");
  notfoundEl.setAttribute("class", "attraction__notfound ");
  notfoundEl.textContent = "查無此景點ID";
  attractionMainEl.appendChild(notfoundEl);
  loadingEnd();
}

async function fetchAttractionInfo() {
  try {
    const response = await fetch(`${originUrl}/api/attraction/${id}`);
    const result = await response.json();
    const data = result?.data;
    if (typeof data == "string") {
      renderAttractionNotFoundDOM();
      return;
    }

    renderInfoDOM(data);
    document.querySelector(".addMap").addEventListener("click", function () {
      modalEl.showModal();
    });

    let slidePosition = 0;

    const slides = document.getElementsByClassName("carousel__item");
    const totalSlides = slides.length;
    const radios = document.querySelectorAll(".carousel__radios__radio ");

    radios.forEach((radio, i) => {
      radio.addEventListener("click", () => {
        radios.forEach((radio) => {
          radio.style.backgroundColor = "var(--white)";
        });
        for (const slide of slides) {
          slide.style.opacity = 0;
        }
        slides[i].style.opacity = 1;
        radios[i].style.backgroundColor = "var(--gray-70)";
      });
    });

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

    function updateSlidePosition() {
      for (let slide of slides) {
        slide.style.opacity = 0;
      }
      radios.forEach((radio) => {
        radio.style.backgroundColor = "var(--white)";
      });
      radios[slidePosition].style.backgroundColor = "var(--gray-70)";
      slides[slidePosition].style.opacity = 1;
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
  } catch (e) {
    console.log(e);
  }
}

const firstHalfEl = document.querySelector("#firstHalf__radio");
const secondHalfEl = document.querySelector("#secondHalf__radio");
const feeEl = document.querySelector(".attraction_fee");
firstHalfEl.addEventListener("change", () => {
  secondHalfEl.checked = false;
  feeEl.childNodes[1].textContent = "新台幣 2000元";
});

secondHalfEl.addEventListener("change", () => {
  firstHalfEl.checked = false;
  feeEl.childNodes[1].textContent = "新台幣 2500元";
});

fetchAttractionInfo();
// 用 new Date() < new Date(e.target.value) 比較日期
const bookingDateEl = document.querySelector("#booking_date");

const dayReg = new RegExp(/\d{4}-\d{2}-\d{2}$/);
document.querySelector("#booking_btn").addEventListener("click", (e) => {
  if (logoutEl.style.display !== "block") {
    alert("請先登入");
    memberElClick();

    return;
  }
  if (
    !dayReg.test(bookingDateEl.value) ||
    new Date() >= new Date(bookingDateEl.value)
  ) {
    alert("請選擇合理的日期");
    bookingDateEl.value = "";

    return;
  }

  const priceReg = new RegExp(/[0-9]{4,}/);
  const price = document
    .querySelector(".attraction_fee")
    .childNodes[1].textContent.match(priceReg)[0];
  const bookingTime =
    document.querySelector("[type=radio]:checked").name === "firstHalf"
      ? "morning"
      : "afternoon";

  const bookingDate = bookingDateEl.value;
  fetch(`${originUrl}/api/booking`, {
    method: "Post",

    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: cookie,
    },
    body: JSON.stringify({
      id: id,
      bookingDate: bookingDate,
      bookingTime: bookingTime,
      price: price,
    }),
  }).then(function () {
    redirectModel.showModal();
  });
});
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDate = new Date().getDate();

bookingDateEl.setAttribute(
  "min",
  `${currentYear}-${currentMonth}-${currentDate}`
);

// console.log(new Date().toLocaleString("en-CA-u-hc-h24").replace(",", ""));
