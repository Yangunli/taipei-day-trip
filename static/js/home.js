const searchEl = document.querySelector("#search");
const searchMenu = document.querySelector(".search__menu");
const homeMainEl = document.querySelector(".home__main");
const searchBtn = document.querySelector("#search__btn");

//看偽元素的style
// const beforeLoginEl = window.getComputedStyle(loginEl, "::before");

searchEl.addEventListener("click", () => {
  searchMenu.classList.toggle("active");
  transparentOverlayEl.classList.toggle("active");
});

const searchMenuClose = () => {
  transparentOverlayEl.classList.add("active");
  searchMenu.classList.add("active");
};

function renderAttractionDOM(attraction) {
  const cardEl = document.createElement("a");
  cardEl.setAttribute("class", "card");
  cardEl.setAttribute("tabindex", "0");
  cardEl.setAttribute("href", `${originUrl}/attraction/${attraction.id}`);
  cardEl.setAttribute("data-id", attraction.id);

  const cardContentEl = document.createElement("div");
  cardContentEl.setAttribute("class", "card__content");
  cardContentEl.setAttribute(
    "style",
    `background-image: url(${attraction.images[0]});`
  );

  const cardTitle = document.createElement("div");
  cardTitle.setAttribute("class", "card__title");
  cardTitle.textContent = attraction.name;
  cardContentEl.appendChild(cardTitle);

  const cardInfoEl = document.createElement("div");
  cardInfoEl.setAttribute("class", "card__info");
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
}

const fetchCategories = async () => {
  const response = await fetch(`${originUrl}/api/categories`);
  const result = await response.json();
  const data = result.data;
  data.map((category) => {
    const categoryEl = document.createElement("p");
    categoryEl.setAttribute("class", "category");
    if (category == "其他") categoryEl.textContent = "其　　他";
    else categoryEl.textContent = category;
    searchMenu.appendChild(categoryEl);
    categoryEl.addEventListener("click", () => {
      const categoryText = categoryEl.outerText;
      searchEl.value = categoryText.replace("　　", "");
      searchMenu.classList.add("active");
      searchEl.classList.add("category_text");
      transparentOverlayEl.classList.add("active");
    });
  });
};
fetchCategories();

// search attraction
let keyword = "";
let currentPage = 0;
let url = `${originUrl}/api/attractions?page=${currentPage}&keyword=${keyword}`;
let nextPage;

const fetchAttractionList = async () => {
  const response = await fetch(url);
  const result = await response.json();
  const data = result.data;

  nextPage = result.nextPage;
  data?.map((attraction) => {
    renderAttractionDOM(attraction);
  });
};

fetchAttractionList();

const keyDownHandler = (e) => {
  let code = e?.charCode || e?.keyCode;
  if (code === 13) {
    getKeyword();
    searchMenu.classList.add("active");
  }
  return;
};

searchEl.addEventListener("keydown", keyDownHandler);

const getKeyword = async () => {
  while (homeMainEl.children.length >= 1)
    homeMainEl.removeChild(homeMainEl.lastElementChild);

  keyword = searchEl.value;
  currentPage = 0;

  const response = await fetch(
    `${originUrl}/api/attractions?page=${currentPage}&keyword=${keyword}`
  );
  const result = await response.json();
  const data = result.data;
  try {
    nextPage = result.nextPage;
    data.map((attraction) => {
      renderAttractionDOM(attraction);
    });
  } catch {
    const notfoundEl = document.createElement("div");
    notfoundEl.setAttribute("class", "notfound ");
    homeMainEl.appendChild(notfoundEl);
  }

  searchEl.value = "";
};

function showLoading() {
  // load more data
  setTimeout(fetchAttractionList, 250);
}

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // console.log({ scrollTop, scrollHeight, clientHeight });
  if (clientHeight + scrollTop >= scrollHeight - 5) {
    // show the loading animation or not

    if (currentPage + 1 == nextPage) {
      url = `${originUrl}/api/attractions?page=${
        currentPage + 1
      }&keyword=${keyword}`;
      showLoading();
      currentPage++;
    }
  }
});

const debounce = (fn, delay = 200) => {
  let timer;
  return function () {
    window.clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      window.clearTimeout(timer);
    }, delay);
  };
};

// 进行函数防抖
let debounced = debounce(function () {
  console.log("debounce");
});

// 监听resize事件
window.addEventListener("resize", debounced);
