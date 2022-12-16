const loginEl = document.querySelector(".login");
const registerEl = document.querySelector(".register");
const overlayEl = document.querySelector(".overlay");
const originUrl = window.location.origin;
const memberEl = document.querySelector("#member");
const transparentOverlayEl = document.querySelector(".transparent_overlay");
const navEl = document.querySelector(".nav_link");
const loginEmail = document.querySelector("#login__email");
const loginPassword = document.querySelector("#login__password");
const registerName = document.querySelector("#register__name");
const registerEmail = document.querySelector("#register__email");
const registerPassword = document.querySelector("#register__password");
const logoutEl = document.querySelector("#logout");
const bookingEl = document.querySelector("#booking");
// 會員系統邏輯

const memberElClick = () => {
  loginEl.classList.remove("active");
  overlayEl.classList.remove("active");
};

const linkToRegister = () => {
  loginEl.classList.add("active");
  registerEl.classList.remove("active");
};

const linkToLogin = () => {
  loginEl.classList.remove("active");
  registerEl.classList.add("active");
};

const loginElClose = () => {
  loginEl.classList.add("active");
  overlayEl.classList.add("active");
};

const registerElClose = () => {
  registerEl.classList.add("active");
  overlayEl.classList.add("active");
};

bookingEl.addEventListener("click", () => {
  if (logoutEl.style.display !== "block") {
    alert("請先登入");
    memberElClick();
    return;
  }
  bookingEl.setAttribute("href", "/booking");
  fetchBookingInfo();
});

const popupClose = () => {
  overlayEl.classList.add("active");
  loginEl.classList.add("active");
  registerEl.classList.add("active");
};

const nameRegex = new RegExp(
  /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·|\‧|\．)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·\．\．)*$|^[a-zA-Z\s]+$/
);
const emailRegex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}/);
const phoneRegex = new RegExp(/^09\d{2}-?\d{3}-?\d{3}$/);
const loginEmailErr = document.querySelector("#login__email--text");
const loginPasswordErr = document.querySelector("#login__password--text");
const registerNameErr = document.querySelector("#register__name--text");
const registerEmailErr = document.querySelector("#register__email--text");
const registerPasswordErr = document.querySelector("#register__password--text");

function throttle(func, timeout = 250) {
  let last;
  let timer;

  return function () {
    const context = this;
    const args = arguments;
    const now = +new Date();

    if (last && now < last + timeout) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        func.apply(context, args);
      }, timeout);
    } else {
      last = now;
      func.apply(context, args);
    }
  };
}

registerEmail.addEventListener(
  "input",
  throttle((e) => {
    if (!emailRegex.test(e.target.value)) {
      registerEmail.style.border = "2px solid red";
      registerEmailErr.textContent = "⚠︎EMAIL格式不符⚠︎";
      registerEmailErr.style.display = "block";
    } else {
      registerEmailErr.style.display = "none";
      registerEmail.style.border = "1px solid #cccccc";
    }
  }, 500)
);

loginEmail.addEventListener(
  "input",
  throttle((e) => {
    if (!emailRegex.test(e.target.value)) {
      loginEmail.style.border = "2px solid red";
      loginEmailErr.textContent = "⚠︎EMAIL格式不符⚠︎";
      loginEmailErr.style.display = "block";
    } else {
      loginEmailErr.style.display = "none";
      loginEmail.style.border = "1px solid #cccccc";
    }
  }, 500)
);

const registerHandler = () => {
  const name = registerName.value;
  const email = registerEmail.value;
  const password = registerPassword.value;
  const nameMatchChecked = nameRegex.test(name);
  const emailMatchChecked = emailRegex.test(email);
  const passwordMatchChecked = passwordRegex.test(password);

  if (!emailMatchChecked) {
    if (email.length) {
      registerEmailErr.textContent = "⚠︎EMAIL格式不符⚠︎";
      registerEmailErr.style.display = "block";
    }
    if (!email.length) {
      registerEmailErr.textContent = "請勿留白";
      registerEmailErr.style.display = "block";
    }
  } else {
    registerEmailErr.style.display = "none";
  }

  if (!passwordMatchChecked) {
    if (!password.length) {
      registerPasswordErr.textContent = "請勿留白";
      registerPasswordErr.style.display = "block";
    }

    if (password.length >= 8 && password.length <= 12) {
      registerPasswordErr.textContent = "密碼至少各有一個大小寫英文及數字";
      registerPasswordErr.style.display = "block";
    } else {
      registerPasswordErr.textContent = "密碼長度介於8-12個";
      registerPasswordErr.style.display = "block";
    }
  } else {
    registerPasswordErr.style.display = "none";
  }

  if (!nameMatchChecked) {
    if (!nameMatchChecked) {
      registerNameErr.textContent = "請勿留白";
      registerNameErr.style.display = "block";
      return;
    } else {
      registerNameErr.textContent = "應為全中文或英文";
      registerNameErr.style.display = "block";
      return;
    }
  } else {
    registerNameErr.style.display = "none";
  }
  if (nameMatchChecked && emailMatchChecked && passwordMatchChecked) {
    fetch(`${originUrl}/api/user`, {
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    }).then(function (response) {
      if (response.status == 200) {
        registerPasswordErr.textContent = "註冊成功";
        registerPasswordErr.style.display = "block";
      } else if (response.status == 400) {
        registerEmailErr.textContent = "此電子郵件已被註冊";
        registerEmailErr.style.display = "block";
      }
    });
  }
};

const loginHandler = () => {
  const email = loginEmail.value;
  const password = loginPassword.value;
  const emailMatchChecked = emailRegex.test(email);
  const passwordMatchChecked = passwordRegex.test(password);
  if (!emailMatchChecked) {
    if (email.length) {
      loginEmailErr.textContent = "⚠︎EMAIL格式不符⚠︎";
      loginEmailErr.style.display = "block";
    } else {
      loginEmailErr.textContent = "請勿留白";
      loginEmailErr.style.display = "block";
    }
  } else {
    loginEmailErr.style.display = "none";
  }

  if (!passwordMatchChecked) {
    if (!password.length) {
      loginPasswordErr.textContent = "請勿留白";
      loginPasswordErr.style.display = "block";
    }

    if (password.length >= 8 && password.length <= 12) {
      loginPasswordErr.textContent = "密碼至少各有一個大小寫英文及數字";
      loginPasswordErr.style.display = "block";
    } else {
      loginPasswordErr.textContent = "密碼長度介於8-12個";
      loginPasswordErr.style.display = "block";
    }
  } else {
    loginPasswordErr.style.display = "none";
  }
  if (emailMatchChecked && passwordMatchChecked) {
    fetch(`${originUrl}/api/user/auth`, {
      method: "Put",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then(function (response) {
      if (response.status !== 200) {
        loginPasswordErr.textContent = "登入失敗";
        loginPasswordErr.style.display = "block";
      } else {
        for (item of response.headers) {
          if (item[0] == "authorization") {
            const bearer = item[1].split("$");
            document.cookie = `${item[0]}=${bearer[0]} ${bearer[1]}; path = / ; `;
          }
        }
        window.location.reload();
      }
    });
  }
};

const token = document.cookie.split(";");
const lastToken = token[token.length - 1];
const cookie = lastToken.split("=")[1];

async function loginChecked() {
  const response = await fetch(`${originUrl}/api/user/auth`, {
    method: "Get",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: cookie,
    },
  });
  if (response.status === 200) {
    memberEl.style.display = "none";
    logoutEl.style.display = "block";
  }
  if (
    response.status === 200 &&
    window.location.href === `${originUrl}/booking`
  ) {
    const result = await response.json();
    const data = result.data;
    if (data) {
      bookingHeadline.textContent = `您好，${data.name.toUpperCase()}，待預訂的行程如下：`;
    }
  }
  if (
    response.status !== 200 &&
    window.location.href === `${originUrl}/booking`
  ) {
    window.location.href = originUrl;
  }
}

loginChecked();

const logout = () => {
  fetch(`${originUrl}/api/user/auth`, {
    method: "Delete",
  }).then(function (response) {
    if (response.status === 200) {
      document.cookie += ";max-age=0";
      memberEl.style.display = "block";
      window.location.reload();
    } else {
      console.log(response);
    }
  });
};

memberEl.addEventListener("click", () => {
  console.log(window.location.href);
  fetchBookingInfo();
});
