const main = document.querySelector("#main"),
      banner_part = document.querySelector("#banner_part"),
      room_info_part = document.querySelector("#room_info_part"),
      calendar_header_part = document.querySelector("#calendar_header_part"),
      calendar_body_part = document.querySelector("#calendar_body_part"),
      record_modalBody = document.querySelector('#record_modalBody');
let roomId,
    roomInfo,
    booking_arr = [];

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
    }
  });

  if (!getUrlVal("roomId")) {
    Swal.fire({
      icon: "error",
      title: "[Error: Not Has Room ID]請重試一次",
      text: "取得房間詳細資訊錯誤",
      heightAuto: false
    }).then(result => {
      window.location = `./index.html`;
    });
    return;
  }

  roomId = getUrlVal("roomId"); // 塞入 Authorization

  axios.defaults.headers.common["Authorization"] = `Bearer ${api_token}`; // 打API

  axios.get(`${api_base_url}/room/${roomId}`).then(res => {
    booking_arr = res.data.booking;
    roomInfo = res.data.room[0];
    renderHandler();
    Swal.close();
    return;
  }).catch(err => {
    Swal.fire({
      icon: "error",
      title: "[Error: Get Room Err]請重試一次",
      text: err,
      heightAuto: false
    });
  }); // 渲染畫面

  function renderHandler() {
    let bannerStr = "";
    let infoStr = "";
    bannerStr += `<div class="h-100 flex-7 overflow-hidden">
    <img class="img img-fluid h-100 w-100 object-fit-cover" src="${roomInfo.imageUrl[0]}"/>
    </div>
    <div class="h-100 flex-3 overflow-hidden">
    <img class="img img-fluid h-50 w-100 object-fit-cover" src="${roomInfo.imageUrl[1]}"/>
    <img class="img img-fluid h-50 w-100 object-fit-cover" src="${roomInfo.imageUrl[2]}"/>
    </div>`;
    infoStr = `
    <h2 class="mb-3">${roomInfo.name}</h2>
    <ul class="list-style-none pl-0 text-muted">
    <li class="mb-1">人數限制：${roomInfo.descriptionShort.GuestMin} ~ ${roomInfo.descriptionShort.GuestMax}</li>
    <li class="mb-1">床型：${[...roomInfo.descriptionShort.Bed]}</li>
    <li class="mb-1">衛浴：${roomInfo.descriptionShort["Private-Bath"]} 間</li>
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
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Air-Conditioner"] ? "text-opacity" : ""}">
    <i class="fas fa-wind"></i>
    <span class="pl-2">空調</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Breakfast"] ? "text-opacity" : ""}">
    <i class="fas fa-utensils"></i>
    <span class="pl-2">含早餐</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Child-Friendly"] ? "text-opacity" : ""}">
    <i class="fas fa-baby"></i>
    <span class="pl-2">小孩友善</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Great-View"] ? "text-opacity" : ""}">
    <i class="fas fa-mountain"></i>
    <span class="pl-2">漂亮視野</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Mini-Bar"] ? "text-opacity" : ""}">
    <i class="fas fa-glass-cheers"></i>
    <span class="pl-2">Mini Bar</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Pet-Friendly"] ? "text-opacity" : ""}">
    <i class="fas fa-paw"></i>
    <span class="pl-2">寵物友善</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Refrigerator"] ? "text-opacity" : ""}">
    <i class="fas fa-ice-cream"></i>
    <span class="pl-2">含冰箱</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Room-Service"] ? "text-opacity" : ""}">
    <i class="fas fa-concierge-bell"></i>
    <span class="pl-2">客房服務</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Smoke-Free"] ? "text-opacity" : ""}">
    <i class="fas fa-joint"></i>
    <span class="pl-2">煙友友善</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Sofa"] ? "text-opacity" : ""}">
    <i class="fas fa-couch"></i>
    <span class="pl-2">含沙發</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Television"] ? "text-opacity" : ""}">
    <i class="fas fa-tv"></i>
    <span class="pl-2">含電視</span>
    </div>
    <div class="col-6 col-md-4 my-3 ${!roomInfo.amenities["Wi-Fi"] ? "text-opacity" : ""}">
    <i class="fas fa-wifi"></i>
    <span class="pl-2">Wi-Fi</span>
    </div>
    </div>
    </div>
    </div>`;
    banner_part.innerHTML = bannerStr;
    room_info_part.innerHTML = infoStr;
    main.classList = "main";
  }
}; // 日曆初始化


$('input[name="dates"]').daterangepicker({
  locale: {
    format: "YYYY-MM-DD",
    separator: " - ",
    applyLabel: "確認",
    cancelLabel: "取消",
    customRangeLabel: "自訂義範圍",
    daysOfWeek: ["日", "一", "二", "三", "四", "五", "日"],
    monthNames: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"],
    firstDay: 1
  },
  startDate: moment().format(),
  endDate: moment().format(),
  minDate: moment().format(),
  maxDate: moment().add(90, 'days')
}); // 預約

function reservationHandler() {
  const name = document.querySelector('#name'),
        mobile = document.querySelector('#mobile'),
        reservationTimeInput = document.querySelector('#reservationTimeInput'),
        mobileReg = /^09[0-9]{8}$/;

  if (!name.value || !mobile.value || !reservationTimeInput.value) {
    Swal.fire({
      icon: "error",
      title: "請填妥必填欄位",
      text: "訂房者姓名、訂房者電話、訂房時間 皆須填寫",
      heightAuto: false
    });
    return;
  }

  if (!mobileReg.test(mobile.value)) {
    Swal.fire({
      icon: "error",
      title: "手機格式錯誤",
      heightAuto: false
    });
    return;
  }

  const startDate = reservationTimeInput.value.split(' - ')[0],
        endDate = reservationTimeInput.value.split(' - ')[1],
        reservationDateRang = getDates(startDate, endDate); // 打API

  sendReservationAjax({
    name: name.value,
    tel: mobile.value,
    date: reservationDateRang
  });
} // 拿取一段時間


function getDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate);
  var stopDate = moment(stopDate);

  while (currentDate <= stopDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'days');
  }

  return dateArray;
} // 打API


function sendReservationAjax({
  name,
  tel,
  date
}) {
  Swal.fire({
    title: "載入中",
    timerProgressBar: true,
    allowOutsideClick: false,
    heightAuto: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });

  if (!name || !tel || !date || date.length === 0) {
    Swal.fire({
      icon: "error",
      title: "[Error: Value Err]請重試一次",
      text: "請確認填妥所有預約必填欄位",
      heightAuto: false
    });
    return;
  }

  if (!getUrlVal("roomId")) {
    Swal.fire({
      icon: "error",
      title: "[Error: Not Has Room ID]請重試一次",
      text: "取得房間詳細資訊錯誤",
      heightAuto: false
    }).then(result => {
      window.location = `./index.html`;
    });
    return;
  }

  roomId = getUrlVal("roomId"); // 塞入 Authorization

  axios.defaults.headers.common["Authorization"] = `Bearer ${api_token}`; // 打API

  axios.post(`${api_base_url}/room/${roomId}`, {
    name,
    tel,
    date
  }).then(res => {
    Swal.fire({
      icon: "success",
      title: "預約成功",
      heightAuto: false,
      timer: 2000,
      showConfirmButton: false,
      showCloseButton: false
    });
    $('#name').val('');
    $('#mobile').val('');
    $('.modal-backdrop').removeClass('show');
    $('#reservationModal').removeClass('show');
    return;
  }).catch(err => {
    Swal.fire({
      icon: "error",
      title: "[Error: Reservation Ajax Err]請重試一次",
      text: err.response.data.message,
      heightAuto: false
    });
  });
} // 顯示預約記錄


function showRecordHandler() {
  record_modalBody.innerHTML = '';
  Swal.fire({
    title: "載入中",
    timerProgressBar: true,
    allowOutsideClick: false,
    heightAuto: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });

  if (!getUrlVal("roomId")) {
    Swal.fire({
      icon: "error",
      title: "[Error: Not Has Room ID]請重試一次",
      text: "取得房間詳細資訊錯誤",
      heightAuto: false
    }).then(result => {
      window.location = `./index.html`;
    });
    return;
  }

  roomId = getUrlVal("roomId"); // 塞入 Authorization

  axios.defaults.headers.common["Authorization"] = `Bearer ${api_token}`; // 打API

  axios.get(`${api_base_url}/room/${roomId}`).then(res => {
    booking_arr = res.data.booking; // 渲染預約紀錄畫面

    renderRecordHandler();
    Swal.close();
  }).catch(err => {
    Swal.fire({
      icon: "error",
      title: "[Error: Get Room Err]請重試一次",
      text: err,
      heightAuto: false
    });
  });
} // 渲染預約紀錄畫面


function renderRecordHandler() {
  let str = '';

  if (booking_arr.length > 0) {
    booking_arr.forEach(i => {
      str += `<div class="row">
      <div class="col-4">
      <span>${i.name}</span> 
      </div>
      <div class="col-4">
      <span>${i.tel}</span> 
      </div>
      <div class="col-4">
      <span>${i.date}</span> 
      </div>
      </div>`;
    });
    record_modalBody.innerHTML = str;
    $('#recordModal').addClass('show');
  }
}