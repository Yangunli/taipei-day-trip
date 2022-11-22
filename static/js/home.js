const originUrl = window.location.origin;
const memberEl = document.querySelector("#member");
const loginEl = document.querySelector(".login");
const registerLinkEl = document.querySelector("#register_link");
const loginLinkEl = document.querySelector("#login_link");
const registerEl = document.querySelector(".register");
const loginClose = document.querySelector(".login_close");
const registerClose = document.querySelector(".register_close");
const overlayEl = document.querySelector(".overlay");

const searchEl = document.querySelector("#search");
const searchMenu = document.querySelector(".search_menu.active");
const homeMainEl = document.querySelector(".home_main");
const searchBtn = document.querySelector("#search_btn");

const fetchCategories = async () => {
  await fetch(`${originUrl}/api/categories`)
    .then((response) => response.json())
    .then(function (res) {
      const data = res.data;
      data.map((category) => {
        const categoryEl = document.createElement("span");
        categoryEl.setAttribute("class", "category");
        categoryEl.textContent = category;
        searchMenu.appendChild(categoryEl);
        categoryEl.addEventListener("click", () => {
          const categoryText = categoryEl.outerText;
          searchEl.value = categoryText;
          searchMenu.classList.add("active");
          searchEl.classList.add("category_text");
        });
      });
    });
};
fetchCategories();

searchEl.addEventListener("click", () => {
  searchMenu.classList.toggle("active");
});

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

// search attraction
let keyword = "";
let currentPage = 0;
let url = `${originUrl}/api/attractions?page=${currentPage}&keyword=${keyword}`;
let nextPage;

const getAttractionList = async () => {
  await fetch(url)
    .then((response) => response.json())
    .then(function (res) {
      nextPage = res.nextPage;

      const data = res?.data;
      data?.map((attraction) => {
        const cardEl = document.createElement("a");
        cardEl.setAttribute("class", "card");
        cardEl.setAttribute("href", `${originUrl}/attraction/${attraction.id}`);
        cardEl.setAttribute("data-id", attraction.id);

        const cardContentEl = document.createElement("div");
        cardContentEl.setAttribute("class", "card_content");
        cardContentEl.setAttribute(
          "style",
          `background-image: url(${attraction.images[0]});`
        );

        const cardTitle = document.createElement("div");
        cardTitle.setAttribute("class", "card_title");
        cardTitle.textContent = attraction.name;
        cardContentEl.appendChild(cardTitle);

        const cardInfoEl = document.createElement("div");
        cardInfoEl.setAttribute("class", "card_info");
        const mrtEl = document.createElement("span");
        mrtEl.setAttribute("class", "mrt");
        mrtEl.textContent = attraction.mrt;
        cardInfoEl.appendChild(mrtEl);
        const categoryEl = document.createElement("span");
        categoryEl.textContent = attraction.category;
        cardInfoEl.appendChild(categoryEl);
        cardEl.appendChild(cardContentEl);
        cardEl.appendChild(cardInfoEl);
        homeMainEl.appendChild(cardEl);
      });
    });
};

getAttractionList();

console.log(nextPage);

searchBtn.addEventListener("click", () => {
  while (homeMainEl.children.length >= 1)
    homeMainEl.removeChild(homeMainEl.lastElementChild);
  if (homeMainEl.children) {
    keyword = searchEl.value;
    currentPage = 0;
    url = `${originUrl}/api/attractions?page=${currentPage}&keyword=${keyword}`;
    getAttractionList();

    console.log(searchEl.value);
    searchEl.value = "";
  }
});

function showLoading() {
  // load more data
  setTimeout(getAttractionList, 300);
}

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // console.log({ scrollTop, scrollHeight, clientHeight });
  if (clientHeight + scrollTop >= scrollHeight - 5) {
    // show the loading animation

    if (currentPage + 1 != nextPage) {
      return;
    } else {
      url = `${originUrl}/api/attractions?page=${
        currentPage + 1
      }&keyword=${keyword}`;
      showLoading();
      currentPage++;
    }
  }
});
