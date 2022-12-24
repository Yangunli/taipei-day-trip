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
  bookingAttractionInfo.classList.add("section");
  bookingAttractionInfo.setAttribute("data-attractionId", data.attraction.id);
  const orderDeleteBtn = document.createElement("button");
  orderDeleteBtn.setAttribute("class", "order__booking__btn--delect");
  orderDeleteBtn.setAttribute("data-num", data.bookingId);
  orderDeleteBtn.setAttribute(
    "aria-label",
    `cancel ${data.attraction.name} booking`
  );
  orderDeleteBtn.addEventListener("click", () => {
    const bookingId = parseInt(orderDeleteBtn.attributes[1].value);
    delectBookingInfo(bookingId);
  });

  bookingAttractionInfo.appendChild(orderDeleteBtn);
  bookingAttracitonItem.appendChild(bookingAttractionFigure);
  bookingAttracitonItem.appendChild(bookingAttractionInfo);

  const figureImg = document.createElement("img");
  bookingAttractionFigure.appendChild(figureImg);
  const bookingAttractionInfoTitle = document.createElement("h2");
  bookingAttractionInfo.appendChild(bookingAttractionInfoTitle);
  const bookingAttractionDate = document.createElement("dl");
  bookingAttractionDate.setAttribute("class", "booking__attraction__info");
  const bookingAttractionDateTitle = document.createElement("dt");
  const bookingAttractionDateContent = document.createElement("dd");
  bookingAttractionDate.appendChild(bookingAttractionDateTitle);
  bookingAttractionDate.appendChild(bookingAttractionDateContent);

  const bookingAttractionTime = document.createElement("dl");
  bookingAttractionTime.setAttribute("class", "booking__attraction__info");
  const bookingAttractionTimeTitle = document.createElement("dt");
  const bookingAttractionTimeContent = document.createElement("dd");
  bookingAttractionTime.appendChild(bookingAttractionTimeTitle);
  bookingAttractionTime.appendChild(bookingAttractionTimeContent);

  const bookingAttractionPrice = document.createElement("dl");
  bookingAttractionPrice.setAttribute("class", "booking__attraction__info");
  const bookingAttractionPriceTitle = document.createElement("dt");
  const bookingAttractionPriceContent = document.createElement("dd");
  bookingAttractionPriceContent.setAttribute(
    "id",
    "booking__attraction__price"
  );
  bookingAttractionPrice.appendChild(bookingAttractionPriceTitle);
  bookingAttractionPrice.appendChild(bookingAttractionPriceContent);

  const bookingAttractionAdd = document.createElement("dl");
  bookingAttractionAdd.setAttribute("class", "booking__attraction__info");
  const bookingAttractionAddTitle = document.createElement("dt");
  const bookingAttractionAddContent = document.createElement("dd");
  bookingAttractionAdd.appendChild(bookingAttractionAddTitle);
  bookingAttractionAdd.appendChild(bookingAttractionAddContent);

  bookingAttractionInfo.appendChild(bookingAttractionDate);
  bookingAttractionInfo.appendChild(bookingAttractionTime);
  bookingAttractionInfo.appendChild(bookingAttractionPrice);
  bookingAttractionInfo.appendChild(bookingAttractionAdd);
  figureImg.setAttribute("alt", data.attraction.name);
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
      let totalValue = 0;
      data.map((booking) => {
        renderBookingInfo(booking);
        totalValue += booking.price;
        orderBookingEl.appendChild(bookingAttracitonContainer);
        bookingValue.textContent = `總價 :新台幣${totalValue}元`;
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

async function delectBookingInfo(bookingId) {
  await fetch(`${originUrl}/api/booking`, {
    method: "Delete",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: cookie,
    },
    body: JSON.stringify({
      bookingId: bookingId,
    }),
  });
  window.location.reload();
}

window.addEventListener("load", function (event) {
  fetchBookingInfo();
});

TPDirect.setupSDK(
  126986,
  "app_shjQe84suZ8qlsXwmDyBQHYypPOAr9s3lbJCXn9bFpTyWuuasNw1FG1XjTGX",
  "sandbox"
);

let fields = {
  number: {
    // css selector
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    // DOM object
    element: document.getElementById("card-expiration-date"),
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "CCV",
  },
};
TPDirect.card.setup({
  // Display ccv field
  fields: fields,
  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.ccv": {
      "font-size": "16px",
    },
    // Styling expiration-date field
    "input.expiration-date": {
      "font-size": "16px",
    },
    // Styling card-number field
    "input.card-number": {
      "font-size": "16px",
    },
    // style focus state
    ":focus": {
      color: "#448899",
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "red",
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

const submitButton = document.querySelector("#order__checkout__btn");

document
  .querySelector("#booking__contact__info__name")
  .addEventListener("input", (e) => {
    document.querySelector("#booking__contact__info__name").style.color =
      nameRegex.test(e.target.value) ? "green" : "red";
  });

document
  .querySelector("#booking__contact__info__email")
  .addEventListener("input", (e) => {
    document.querySelector("#booking__contact__info__email").style.color =
      emailRegex.test(e.target.value) ? "green" : "red";
    if (e.target.value.split(".")[1] == "com") {
      document.querySelector("#booking__contact__info__phone").focus();
    }
  });

document
  .querySelector("#booking__contact__info__phone")
  .addEventListener("input", (e) => {
    document.querySelector("#booking__contact__info__phone").style.color =
      phoneRegex.test(e.target.value) ? "green" : "red";
  });

function onClick() {
  const bookingInfos = document.querySelectorAll(
    ".order__booking__attraction__item"
  );
  const orderList = [];
  for (const bookingInfo of bookingInfos) {
    const imgUrl =
      bookingInfo.firstChild.firstChild["attributes"]["src"].textContent;
    const data = bookingInfo.textContent.split("：");
    const [
      _,
      bookingAttraction,
      bookingDate,
      bookingTime,
      bookingPrice,
      bookingAddress,
    ] = data;
    const bookingObj = {
      price: bookingPrice.slice(0, -2),
      trip: {
        attraction: {
          id: bookingInfo.lastChild["attributes"]["data-attractionId"]
            .textContent,
          name: bookingAttraction.slice(0, -2),
          address: bookingAddress,
          image: imgUrl,
        },
        date: bookingDate.slice(0, -2),
        time: bookingTime.slice(0, 2) === "早上" ? "morning" : "afternoon",
      },
    };
    orderList.push(bookingObj);
  }

  const name = document.querySelector("#booking__contact__info__name").value;
  const email = document.querySelector("#booking__contact__info__email").value;
  const phoneNum = document.querySelector(
    "#booking__contact__info__phone"
  ).value;
  const nameMatchChecked = nameRegex.test(name);
  const emailMatchChecked = emailRegex.test(email);
  const phoneMatchChecked = phoneRegex.test(phoneNum);
  const priceReg = new RegExp(/[0-9]{4,}/);
  const totalPrice = document
    .querySelector("#order__checkout__value")
    .textContent.match(priceReg)[0];
  console.log(nameMatchChecked, emailMatchChecked, phoneMatchChecked);

  TPDirect.card.getPrime(function (result) {
    if (
      result.status !== 0 ||
      !nameMatchChecked ||
      !emailMatchChecked ||
      !phoneMatchChecked
    ) {
      alert("是不是有哪裡沒有輸入");
      return;
    }

    const prime = result.card.prime;
    if (nameMatchChecked && emailMatchChecked && phoneMatchChecked) {
      fetch(`${originUrl}/api/orders`, {
        method: "Post",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: cookie,
        },
        body: JSON.stringify({
          prime: prime,
          totalPrice: totalPrice,
          order: orderList,
          contact: {
            name: name,
            email: email,
            phone: phoneNum,
          },
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) {
          console.log(myJson);
          orderId = myJson.data.number;
          window.location.href = `${originUrl}/thankyou/${orderId}`;
        });
    }
  });
}
