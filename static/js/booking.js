const orderContainer = document.querySelector(".order");
const orderBookingEl = document.querySelector(".order__booking");
const bookingHeadline = document.createElement("h1");
bookingHeadline.setAttribute("class", "order__booking__headline");
orderBookingEl.appendChild(bookingHeadline);
const bookingAttracitonContainer = document.createElement("div");
bookingAttracitonContainer.setAttribute("class", "order__booking__attraction");
const buyerContactEl = document.querySelector(".order__contact");
const buyerCreditcardEl = document.querySelector(".order__creditcard");

const bookingValue = document.querySelector("#order__checkout__value");

function renderBookingInfo(data) {
  const bookingAttracitonItem = document.createElement("div");
  bookingAttracitonItem.setAttribute(
    "class",
    "order__booking__attraction__item"
  );
  const bookingAttractionFigure = document.createElement("figure");
  const bookingAttractionInfo = document.createElement("section");
  const orderDeleteBtn = document.createElement("button");
  orderDeleteBtn.setAttribute("id", "order__booking--delect");
  orderDeleteBtn.setAttribute("data-num", data.orderId);

  orderDeleteBtn.addEventListener("click", () => {
    const orderId = parseInt(orderDeleteBtn.attributes[1].value);
    delectBookingInfo(orderId);
  });

  bookingAttractionInfo.appendChild(orderDeleteBtn);
  bookingAttracitonItem.appendChild(bookingAttractionFigure);
  bookingAttracitonItem.appendChild(bookingAttractionInfo);

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
  bookingAttractionPriceContent.setAttribute(
    "id",
    "booking__attraction__price"
  );
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
  figureImg.setAttribute("src", data.attraction.image);
  bookingAttractionInfoTitle.textContent = `台北一日遊：${data.attraction.name}`;
  bookingAttractionDateTitle.textContent = "日期：";
  bookingAttractionDateContent.textContent = data.date;
  bookingAttractionTimeTitle.textContent = "時間：";
  bookingAttractionTimeContent.textContent =
    data.time === "morning" ? "早上9點至12點" : "下午2點至5點";
  bookingAttractionPriceTitle.textContent = "費用：";
  bookingAttractionPriceContent.textContent = `新台幣${data.price}元`;
  bookingAttractionAddTitle.textContent = "地址：";
  bookingAttractionAddContent.textContent = data.attraction.address;
  bookingAttracitonContainer.appendChild(bookingAttracitonItem);
}

async function fetchBookingInfo() {
  const response = await fetch(`${originUrl}/api/booking`, {
    method: "Get",
    cache: "no-cache",
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
      while (bookingAttracitonContainer.children.length >= 1)
        bookingAttracitonContainer.removeChild(
          bookingAttracitonContainer.lastElementChild
        );

      let totalValue = 0;
      data.map((booking, i) => {
        renderBookingInfo(booking);
        totalValue += booking.price;
        orderBookingEl.appendChild(bookingAttracitonContainer);
        bookingValue.textContent = `總價 :新台幣${totalValue}元`;
        console.log(booking);
      });
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

async function delectBookingInfo(orderId) {
  await fetch(`${originUrl}/api/booking`, {
    method: "Delete",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: cookie,
    },
    body: JSON.stringify({
      orderId: orderId,
    }),
  });
  window.location.reload();
}

// class Booking extends HTMLElement {
//   constructor() {
//     super();
//   }
// }

// customElements.define("booking", Booking);

window.addEventListener("load", function (event) {
  fetchBookingInfo();
});
