const main = document.querySelector("#main"),
  list = document.querySelector("#list");
let rooms = [];

window.onload = function () {
  // 初始化
  initHandler();
};

const initHandler = () => {
  Swal.fire({
    title: "載入中",
    timerProgressBar: true,
    allowOutsideClick: false,
    heightAuto: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    },
  });

  // 塞入 Authorization
  axios.defaults.headers.common["Authorization"] = `Bearer ${api_token}`;

  // 打API
  axios
    .get(`${api_base_url}/rooms`)
    .then((res) => {
      rooms = res.data.items;
      renderHandler();
      Swal.close();
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "[Error: Get Room Err]請重試一次",
        text: err,
      });
    });

  // 渲染畫面
  function renderHandler() {
    let str = "";
    rooms.forEach((i) => {
      str += `<div class="col-12">
            <div class="card">

            <a href="javascript: void(0);" onclick="linkRoomHandler('${i.id}')">

            <div class="card-header p-0 overflow-hidden">
            <img src="${i.imageUrl}" class="card-img-top img-fluid img" alt="${i.name}">
            </div>

            <div class="card-body">
            <h5 class="card-title">${i.name}</h5>
            <p class="card-text">平日價格：${i.normalDayPrice}</p>
            <p class="card-text">平日價格：${i.holidayPrice}</p>
            </div>

            <div class="card-footer">
            <small class="form-text text-muted">
            API來源 - 六角學院 & The F2E
            </small>
            </div>

            </a>
            </div>
            </div>`;
    });
    list.innerHTML = str;

    main.classList = "main";
  }
};

// 跳轉頁面
function linkRoomHandler(id) {
  window.location = `./room.html?roomId=${id}`;
}
