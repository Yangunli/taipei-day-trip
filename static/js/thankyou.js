let path = window.location.pathname.split("/");
const id = parseInt(path[2]);
async function fetchOrderInfo() {
  try {
    const response = await fetch(`${originUrl}/api/order/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: cookie,
      },
    });
    const result = await response.json();
    const data = result?.data;
    if (!data) {
      console.log("你沒有這筆訂單唷~");
      document.querySelector("h1").textContent = "你沒有這筆訂單唷~";
      return;
    }
    document.querySelector("h3").textContent = `您的訂單號碼：${id}`;
    document.querySelector("h1").textContent =
      data.status === 1 ? "付款成功" : "付款失敗";
  } catch (e) {
    console.log(e);
  }
}

fetchOrderInfo();
