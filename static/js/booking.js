const orderContainer = document.querySelector(".order");
const orderBookingEl = document.querySelector(".order__booking");
const bookingHeadline = document.createElement("h1");
bookingHeadline.setAttribute("class", "order__booking__headline");
orderBookingEl.appendChild(bookingHeadline);
const bookingAttracitonContainer = document.createElement("div");
bookingAttracitonContainer.setAttribute("class", "order__booking__attraction");
const bookingAttractionFigure = document.createElement("figure");
const bookingAttractionInfo = document.createElement("section");
const orderDelteBtn = document.createElement("button");
orderDelteBtn.setAttribute("id", "order__booking--delect");
bookingAttractionInfo.appendChild(orderDelteBtn);
bookingAttracitonContainer.appendChild(bookingAttractionFigure);
bookingAttracitonContainer.appendChild(bookingAttractionInfo);
orderBookingEl.appendChild(bookingAttracitonContainer);

const figureImg = document.createElement("img");
bookingAttractionFigure.appendChild(figureImg);
const bookingAttractionInfoTitle = document.createElement("h2");
bookingAttractionInfo.appendChild(bookingAttractionInfoTitle);
const bookingAttractionDate = document.createElement("div");
bookingAttractionDate.setAttribute("class", "booking__attraction__info");
const bookingAttractionDateTitle = document.createElement("dt");
const bookingAttractionDateContent = document.createElement("dl");
bookingAttractionDate.appendChild(bookingAttractionDateTitle);
bookingAttractionDate.appendChild(bookingAttractionDateContent);

const bookingAttractionTime = document.createElement("div");
bookingAttractionTime.setAttribute("class", "booking__attraction__info");
const bookingAttractionTimeTitle = document.createElement("dt");
const bookingAttractionTimeContent = document.createElement("dl");
bookingAttractionTime.appendChild(bookingAttractionTimeTitle);
bookingAttractionTime.appendChild(bookingAttractionTimeContent);

const bookingAttractionPrice = document.createElement("div");
bookingAttractionPrice.setAttribute("class", "booking__attraction__info");
const bookingAttractionPriceTitle = document.createElement("dt");
const bookingAttractionPriceContent = document.createElement("dl");
bookingAttractionPriceContent.setAttribute("id", "booking__attraction__price");
bookingAttractionPrice.appendChild(bookingAttractionPriceTitle);
bookingAttractionPrice.appendChild(bookingAttractionPriceContent);

const bookingAttractionAdd = document.createElement("div");
bookingAttractionAdd.setAttribute("class", "booking__attraction__info");
const bookingAttractionAddTitle = document.createElement("dt");
const bookingAttractionAddContent = document.createElement("dl");
bookingAttractionAdd.appendChild(bookingAttractionAddTitle);
bookingAttractionAdd.appendChild(bookingAttractionAddContent);

bookingAttractionInfo.appendChild(bookingAttractionDate);
bookingAttractionInfo.appendChild(bookingAttractionTime);
bookingAttractionInfo.appendChild(bookingAttractionPrice);
bookingAttractionInfo.appendChild(bookingAttractionAdd);

const buyerContactEl = document.querySelector(".order__contact");
const buyerCreditcardEl = document.querySelector(".order__creditcard");

const bookingValue = document.querySelector("#order__checkout__value");

async function fetchBookingInfo() {
  const response = await fetch(`${originUrl}/api/booking`, {
    method: "Get",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: cookie,
    },
  });
  const result = await response.json();
  const data = result?.data;
  try {
    if (data) {
      console.log(result);
      renderBookingInfo(data);
    } else {
      bookingAttracitonContainer.remove();
      buyerContactEl.remove();
      buyerCreditcardEl.remove();
      const emptyEl = document.createElement("p");
      emptyEl.setAttribute("class", "order__booking__empty");
      emptyEl.textContent = "目前沒有任何待預定的行程";
      orderBookingEl.appendChild(emptyEl);

      const bookingHr = document.querySelectorAll(".booking__hr");
      for (hr of bookingHr) {
        hr.remove();
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function renderBookingInfo(data) {
  figureImg.setAttribute("src", data.attraction.image);
  bookingAttractionInfoTitle.textContent = `台北一日遊：${data.attraction.name}`;
  console.log(data.attraction.id);
  bookingAttractionDateTitle.textContent = "日期：";
  bookingAttractionDateContent.textContent = data.date;
  bookingAttractionTimeTitle.textContent = "時間：";
  bookingAttractionTimeContent.textContent =
    data.time === "morning" ? "早上9點至12點" : "下午2點至5點";
  bookingAttractionPriceTitle.textContent = "費用：";
  bookingAttractionPriceContent.textContent = `新台幣${data.price}元`;
  bookingAttractionAddTitle.textContent = "地址：";
  bookingAttractionAddContent.textContent = data.attraction.address;
  bookingValue.textContent = `總價 :新台幣${data.price}元`;
}

orderDelteBtn.addEventListener("click", () => delectBookingInfo());

async function delectBookingInfo() {
  await fetch(`${originUrl}/api/booking`, {
    method: "Delete",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: cookie,
    },
  });
  window.location.reload();
}
fetchBookingInfo();

// class Booking extends HTMLElement {
//   constructor() {
//     super();
//   }
// }

// customElements.define("booking", Booking);
