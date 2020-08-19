const main = document.querySelector("#main"),
  info = document.querySelector("#info");
let roomId, roomInfo;

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

  if (!getUrlVal("roomId")) {
    Swal.fire({
      icon: "error",
      title: "[Error: Not Has Room ID]請重試一次",
      text: "取得房間詳細資訊錯誤",
    }).then((result) => {
      window.location = `./index.html`;
    });
    return;
  }

  roomId = getUrlVal("roomId");

  // 塞入 Authorization
  axios.defaults.headers.common["Authorization"] = `Bearer ${api_token}`;

  // 打API
  axios
    .get(`${api_base_url}/room/${roomId}`)
    .then((res) => {
      roomInfo = res.data.room[0];
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
    str += `<div class="d-flex" style="height: 500px;">
    <div class="h-100 flex-7 overflow-hidden">
    <img class="img img-fluid h-100 w-100 object-fit-cover" src="${roomInfo.imageUrl[0]}"/>
    </div>
    <div class="h-100 flex-3 overflow-hidden">
    <img class="img img-fluid h-50 w-100 object-fit-cover" src="${roomInfo.imageUrl[1]}"/>
    <img class="img img-fluid h-50 w-100 object-fit-cover" src="${roomInfo.imageUrl[2]}"/>
    </div>
    </div>
    <hr class="border border-dark m-0">
    <section class="container p-2 pt-4">
    <div class="row mb-4">
    <div class="col-12 col-md-8">
    <h2 class="mb-3">${roomInfo.name}</h2>
    <ul class="list-style-none pl-0 text-muted">
    <li class="mb-1">人數限制：${roomInfo.descriptionShort.GuestMin} ~ ${roomInfo.descriptionShort.GuestMax}</li>
    <li class="mb-1">床型：${[...roomInfo.descriptionShort.Bed]}</li>
    <li class="mb-1">衛浴：${roomInfo.descriptionShort['Private-Bath']} 間</li>
    <li class="mb-1">房間大小：${roomInfo.descriptionShort.Footage} 平方公尺</li>
    </ul>
    <h3>NT.$${roomInfo.normalDayPrice}<small class="form-text text-muted d-inline-block">(ㄧ～四)</small></h3>
    <h5>NT.$${roomInfo.holidayPrice}<small class="form-text text-muted d-inline-block">(五～日)</small></h5>
    <small class="mb-4 form-text text-muted">${roomInfo.description}</small>
    <div class="container mb-3">
    <div class="row border py-2">
    <div class="col-12 col-md-6">
    <p class="mb-1">Check In</p>
    <span>${roomInfo.checkInAndOut.checkInEarly} - ${roomInfo.checkInAndOut.checkInLate}</span>
    <hr class="border d-md-none m-0 mt-2 mt-md-0">
    </div>
    <div class="col-12 col-md-6 pt-2 pt-md-0">
    <p class="mb-1">Check Out</p>
    <span>${roomInfo.checkInAndOut.checkOut}</span>  
    </div>
    </div>
    </div>
    <div class="p-2 bg-gary">
    <div class="container">
    <div class="row">
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Air-Conditioner'] ? 'text-opacity' : '' }">
    <i class="fas fa-wind"></i>
    <span class="pl-2">空調</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Breakfast'] ? 'text-opacity' : '' }">
    <i class="fas fa-utensils"></i>
    <span class="pl-2">含早餐</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Child-Friendly'] ? 'text-opacity' : '' }">
    <i class="fas fa-baby"></i>
    <span class="pl-2">小孩友善</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Great-View'] ? 'text-opacity' : '' }">
    <i class="fas fa-mountain"></i>
    <span class="pl-2">漂亮視野</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Mini-Bar'] ? 'text-opacity' : '' }">
    <i class="fas fa-glass-cheers"></i>
    <span class="pl-2">Mini Bar</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Pet-Friendly'] ? 'text-opacity' : '' }">
    <i class="fas fa-paw"></i>
    <span class="pl-2">寵物友善</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Refrigerator'] ? 'text-opacity' : '' }">
    <i class="fas fa-ice-cream"></i>
    <span class="pl-2">含冰箱</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Room-Service'] ? 'text-opacity' : '' }">
    <i class="fas fa-concierge-bell"></i>
    <span class="pl-2">客房服務</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Smoke-Free'] ? 'text-opacity' : '' }">
    <i class="fas fa-joint"></i>
    <span class="pl-2">煙友友善</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Sofa'] ? 'text-opacity' : '' }">
    <i class="fas fa-couch"></i>
    <span class="pl-2">含沙發</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Television'] ? 'text-opacity' : '' }">
    <i class="fas fa-tv"></i>
    <span class="pl-2">含電視</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities['Wi-Fi'] ? 'text-opacity' : '' }">
    <i class="fas fa-wifi"></i>
    <span class="pl-2">Wi-Fi</span>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div class="col-12 col-md-4">
    <div class="p-4 bg-dark">
    <h3 class="text-white text-center">這邊會放日曆</h3>
    <a class="btn btn-info btn-block" type="button" href="javascript: void(0);" onclick="reservationHandler()">預約</a>
    </div>
    </div>
    </div>
    
    <a class="btn btn-primary btn-block" type="button" href="./index.html">回首頁</a>
    </section>
    `;
    info.innerHTML = str;

    main.classList = "main";
  }
};

// 預約
function reservationHandler() {
  Swal.fire({
    icon: "info",
    title: "預約功能尚未實裝！",
    text: "凌晨四點了，先睡一下隔天再補上",
  });
}
