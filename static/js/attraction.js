const attractionContainerEl = document.querySelector(".attraction_container");
const attractionMainEl = document.querySelector(".attraction_main");
const carouselEl = document.querySelector(".carousel");
const bookingTitleEl = document.querySelector(".booking_title");
const modalEl = document.querySelector("#modal");
let path = window.location.pathname.split("/");
const id = parseInt(path[2]);

const attractionInfo = document.querySelector(".attraction_info");
const attractionContainer = document.querySelector(".attraction_container");

const modalClose = () => {
  modalEl.close();
};

const renderInfoDOM = (data) => {
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
  attractionRadioContainer.classList.add("carousel_radios");

  const descEl = document.createElement("p");
  descEl.textContent = data.description;
  const addressContainer = document.createElement("div");
  const addTitle = document.createElement("h4");
  const addText = document.createElement("p");
  const mapIcon = document.createElement("span");

  addTitle.textContent = "景點地址： ";
  addText.textContent = data.address;
  mapIcon.setAttribute("class", "material-symbols-outlined");
  mapIcon.textContent = "location_on";

  addressContainer.appendChild(addTitle);
  addressContainer.appendChild(addText);
  addText.appendChild(mapIcon);
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
  // attractionMap.setAttribute("");
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
    const attractionEl = document.createElement("div");
    attractionEl.setAttribute("class", "carousel__item");
    attractionEl.setAttribute("style", `  background-image: url(${img});`);
    const attractionRadio = document.createElement("div");
    attractionRadio.setAttribute("class", "carousel_radio");

    if (i == "0") {
      attractionEl.classList.add("carousel__item--visible");
      attractionRadio.style.backgroundColor = "var(--black)";
    } else {
      attractionRadio.setAttribute("aria-checked", "false");
    }

    carouselEl.appendChild(attractionEl);
    attractionRadioContainer.appendChild(attractionRadio);
  });
  carouselEl.appendChild(attractionRadioContainer);
};

const fetchAttractionInfo = async () => {
  try {
    const response = await fetch(`${originUrl}/api/attraction/${id}`);
    const result = await response.json();
    const data = result?.data;
    renderInfoDOM(data);

    let slidePosition = 0;

    const slides = document.getElementsByClassName("carousel__item");
    const totalSlides = slides.length;
    const radios = document.querySelectorAll(".carousel_radio");

    radios.forEach((radio, i) => {
      radio.addEventListener("click", () => {
        radios.forEach((radio) => {
          radio.style.backgroundColor = "var(--white)";
        });
        for (let slide of slides) {
          slide.classList.remove("carousel__item--visible");
        }
        slides[i].classList.add("carousel__item--visible");
        radios[i].style.backgroundColor = "var(--black)";
      });
    });

    function updateSlidePosition() {
      for (let slide of slides) {
        slide.classList.remove("carousel__item--visible");
      }
      radios.forEach((radio) => {
        radio.style.backgroundColor = "var(--white)";
      });
      slides[slidePosition].classList.add("carousel__item--visible");
      radios[slidePosition].style.backgroundColor = "var(--black)";
    }

    function moveToNextSlide() {
      if (slidePosition === totalSlides - 1) slidePosition = 0;
      else slidePosition++;
      updateSlidePosition();
    }

    function moveToPrevSlide() {
      if (slidePosition === 0) slidePosition = totalSlides - 1;
      else slidePosition--;
      updateSlidePosition();
    }

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
    document
      .querySelector(".material-symbols-outlined")
      .addEventListener("click", () => {
        modalEl.showModal();
      });
  } catch (e) {
    console.log(e);
    carouselEl.remove();
    attractionInfo.remove();
    attractionContainer.remove();
    const notfoundEl = document.createElement("div");
    notfoundEl.setAttribute("class", "id_notfound ");
    attractionMainEl.appendChild(notfoundEl);
  }
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

fetchAttractionInfo();
