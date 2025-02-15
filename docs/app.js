let selectedLocation = ""; //지역선택
let selectedCompanions = []; //동반자
let selectedDuration = ""; //기간
let selectedStyle = []; //여행 스타일
let selectedSchedule = ""; //여행 일정 정도
//일 자별로 마커 찍기
let dayMarkers = {}; // 각 날짜별 마커 저장
let geocoder;
let map; // Google Map 객체를 저장할 변수
// 전역 변수 선언
let dayPlaces = {}; // {} 빈 객체로 초기화

// //프로그레스바 변수
// let currentStep = 0;
// const totalSteps = 4; // 총 단계 수
// let progressWidth = 0;

// // 프로그레스 바를 서서히 차오르게 하는 함수
// function increaseProgressBar() {
//   const progressBar = document.getElementById("progressBar");
//   const interval = setInterval(function () {
//     if (progressWidth >= (currentStep / totalSteps) * 100) {
//       clearInterval(interval); // 목표값에 도달하면 멈추기
//     } else {
//       progressWidth += 1; // 1씩 증가
//       progressBar.style.width = `${progressWidth}%`;
//     }
//   }, 10); // 10ms마다 증가
// }

// // 프로그레스 바 업데이트 함수
// function updateProgressBar() {
//   const progress = (currentStep / totalSteps) * 100; // 현재 단계에 대한 비율 계산
//   document.getElementById("progressBar").style.width = `${progress}%`;
// }

// //결과 화면에서 프로그레스바 삭제 함수
// function deleteProgressBar() {
//   const progressBar = document.getElementById("progressBar");
//   progressBar.style.width = "100%"; // 먼저 100%로 채우고
//   setTimeout(function () {
//     const interval = setInterval(function () {
//       if (progressBar.style.width === "0%") {
//         clearInterval(interval); // 목표값에 도달하면 멈추기
//       } else {
//         let currentWidth = parseInt(progressBar.style.width);
//         progressBar.style.width = `${currentWidth - 1}%`; // 1%씩 줄어듦
//       }
//     }, 50); // 10ms마다 감소
//   }, 1000); // 1초 후에 프로그레스 바가 사라지기 시작
// }

//1단계 여행지 선택 변수 저장
function selectLocation(location) {
  selectedLocation = location;
  document
    .querySelectorAll("#step1 .btn")
    .forEach((btn) => btn.classList.remove("selected"));
  event.target.classList.add("selected");
  document.getElementById("nextStep1").disabled = false;
}

//2단계로 가기 - 동반자 선택
function goToStep2() {
  if (selectedLocation) {
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
    // currentStep = 1;
    // updateProgressBar();
  }
}

//1단계로 돌아가기 - 여행지 선택
function goToStep1() {
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
  // currentStep = 0;
  // updateProgressBar();
}

//2단계 - 동반자 변수를 배열로 중복 저장
function selectedCompanion(companion) {
  const index = selectedCompanions.indexOf(companion);
  if (index > -1) {
    selectedCompanions.splice(index, 1);
    event.target.classList.remove("selected");
  } else {
    selectedCompanions.push(companion);
    event.target.classList.add("selected");
  }
  document.getElementById("nextStep2").disabled =
    selectedCompanions.length === 0;
}

//3단계로 이동가기
function goToStep3() {
  if (selectedCompanions.length > 0) {
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");
    // currentStep = 2;
    // updateProgressBar();
  }
}

//2단계로 돌아가기
function goToStep2FromStep3() {
  document.getElementById("step3").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
  // currentStep = 1;
  // updateProgressBar();
}

//3단계 - 기간을 정하기
function selectDuration(duration) {
  selectedDuration = duration;
  document
    .querySelectorAll("#step3 .btn")
    .forEach((btn) => btn.classList.remove("selected"));
  event.target.classList.add("selected");
  document.getElementById("nextStep3").disabled = false;
}

//4단계로 이동
function goToStep4() {
  if (selectedDuration) {
    document.getElementById("step3").classList.add("hidden");
    document.getElementById("step4").classList.remove("hidden");
    // currentStep = 3;
    // updateProgressBar();
  }
}

//3단계로 돌아오기
function goToStep3FromStep4() {
  document.getElementById("step4").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
  // currentStep = 2;
  // updateProgressBar();
}

// 4단계 - 여행 스타일 선택 함수 (다중 선택 가능)
function selectStyle(style) {
  const index = selectedStyle.indexOf(style);
  if (index > -1) {
    selectedStyle.splice(index, 1);
    event.target.classList.remove("selected");
  } else {
    selectedStyle.push(style);
    event.target.classList.add("selected");
  }
  // 여행 스타일 선택 여부에 따라 다음 버튼 활성화
  document.getElementById("nextStep4").disabled = selectedStyle.length === 0;
}

// 5단계로 이동
function goToStep5() {
  if (selectedStyle.length > 0) {
    document.getElementById("step4").classList.add("hidden");
    document.getElementById("step5").classList.remove("hidden");
    // currentStep = 4;
    // updateProgressBar();
  }
}

// 4단계로 이동
function goToStep4FromStep5() {
  document.getElementById("step5").classList.add("hidden");
  document.getElementById("step4").classList.remove("hidden");
  // currentStep = 3;
  // updateProgressBar();
}

// 5단계 - 여행 일정 선택 함수
function selectSchedule(schedule) {
  selectedSchedule = schedule;
  document
    .querySelectorAll("#step5 .btn")
    .forEach((btn) => btn.classList.remove("selected"));
  event.target.classList.add("selected");
  document.getElementById("nextStep5").disabled = !selectedSchedule;
}

// 6단계에서 1단계로 돌아가기
function goToStep1FromStep6() {
  document.getElementById("step6").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("progress-container").classList.remove("hidden");
  // currentStep = 0;
  // updateProgressBar();
}

async function callGeminiAPI() {
  const response = await fetch(
    "https://torch-highfalutin-alamosaurus.glitch.me/ai-service",
    {
      method: "POST",
      body: JSON.stringify({
        text: `너는 여행 계획 전문가야. 나는 지금 여행을 가고 싶은데, 다음과 같은 조건들이 있어:
                    1. 여행지는 ${selectedLocation}로 정했어.
                    2. 동반자는 ${selectedCompanions.join(", ")} 함께 갈 거야.
                    3. 여행 기간은 ${selectedDuration}로 계획하고 있어.
                    4. 내가 선호하는 여행 스타일은 ${selectedStyle.join(
                      ", "
                    )}이야.
                    5. 여행 일정은 ${selectedSchedule} 을 선호해.
                    `,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();
  return json.reply;
}

//결과화면에 Day버튼 활성화 함수
function setActiveButton(clickedButton) {
  const buttons = document.querySelectorAll(".day-buttons-container button");
  buttons.forEach((button) => button.classList.remove("selected")); // 기존 선택 해제
  clickedButton.classList.add("selected"); // 선택된 버튼에 클래스 추가
}

//위도, 경도 받아오는 API
function getLatLngFromAddress(address) {
  return new Promise((resolve, reject) => {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        resolve({ lat: lat, lng: lng });
      } else {
        reject(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  });
}

//프롬프트 결과 중 Day로 시작하는 행에서 ,를 기준으로 여행지 추출 함수
function extractDayPlaces(plan) {
  const regex = /Day\s*\d+\s*:\s*([^\n]+)/g;
  const result = [];
  let match;

  while ((match = regex.exec(plan)) !== null) {
    const places = match[1].split(",").map((place) => place.trim());
    result.push(places);
  }

  return result;
}

function showDayButtons() {
  const dayButtonsContainer = document.getElementById("dayFilterButtons");
  const allButtons = dayButtonsContainer.getElementsByTagName("button");

  // dayPlaces 배열의 길이에 맞게 버튼을 보이게 함
  for (let i = 0; i < allButtons.length - 1; i++) {
    // 마지막 버튼(모두 보기)은 항상 보이게
    const button = allButtons[i];
    const dayIndex = parseInt(button.innerText.replace("Day ", ""));

    if (dayIndex <= dayPlaces.length) {
      button.style.display = "inline-block"; // 버튼 보이기
    } else {
      button.style.display = "none"; // 버튼 숨기기
    }
  }
  // '모두 보기' 버튼은 항상 보이게
  allButtons[allButtons.length - 1].style.display = "inline-block";
}

//구글 마커에 색상 배열을 색상별로 가져오는 함수
function getMarkerIcon(dayIndex) {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  return `http://maps.google.com/mapfiles/ms/icons/${
    colors[dayIndex % colors.length]
  }-dot.png`;
}

function showMarkersForDay(dayKey) {
  // 모든 마커 숨기기
  Object.values(dayMarkers).forEach((markers) =>
    markers.forEach((marker) => marker.setMap(null))
  );

  // 모든 마커를 다시 보여주는 기능
  if (dayKey === "All") {
    // "모두 보기" 클릭 시 지도 중심을 첫 번째 마커로 이동하고, 지도를 축소
    let bounds = new google.maps.LatLngBounds();
    Object.values(dayMarkers).forEach((markers) => {
      markers.forEach((marker) => {
        marker.setMap(map);
        bounds.extend(marker.getPosition());
      });
    });
    map.fitBounds(bounds); // 모든 마커가 보일 수 있도록 지도 축소
  } else {
    // 선택한 날짜의 마커만 보이기
    if (dayMarkers[dayKey]) {
      let bounds = new google.maps.LatLngBounds();
      dayMarkers[dayKey].forEach((marker, index) => {
        marker.setMap(map);
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds); // 선택된 Day의 마커들을 모두 포함할 수 있도록 지도 확대
    }
  }
}


function initMap() {
  if (!dayPlaces || dayPlaces.length === 0) {
    console.error("dayPlaces가 비어 있음!");
    return;
  }

  // 기존 마커 초기화
  Object.values(dayMarkers).forEach((markers) =>
    markers.forEach((marker) => marker.setMap(null))
  );
  dayMarkers = {}; // 기존 마커 데이터를 완전히 초기화

  // 지도 초기화 부분
  const firstPlace = dayPlaces[0][0]; // 첫 번째 장소
  geocoder = new google.maps.Geocoder();

  getLatLngFromAddress(firstPlace).then((latLng) => {
    map = new google.maps.Map(document.getElementById("map"), {
      center: latLng,
      zoom: 10,
    });

    // Day별로 마커 그룹화
    dayPlaces.forEach((places, index) => {
      const dayKey = `Day${index + 1}`;
      dayMarkers[dayKey] = [];

      places.forEach((place) => {
        getLatLngFromAddress(place)
          .then((latLng) => {
            let marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: place,
              icon: getMarkerIcon(index), // 색상 아이콘 적용
            });

            dayMarkers[dayKey].push(marker);
          })
          .catch((error) => {
            console.error(`Error geocoding ${place}:`, error);
          });
      });
    });
  });
}

// 5단계에서 결과 보기
function showSelection() {
  // 진행바 삭제 (UI 업데이트)
  //deleteProgressBar();

  // Gemini API 호출하여 여행 일정 데이터 가져오기
  callGeminiAPI().then((reply) => {
    console.log("API 응답:", reply); // API 응답 확인 (디버깅용)

    // 결과를 표시할 HTML 요소 가져오기
    const resultText = document.getElementById("resultText");

    resultText.innerHTML = ""; // 기존 내용을 초기화하여 새로운 결과를 표시

    // 응답 내용을 줄바꿈(\n) 기준으로 나누어 배열로 변환
    const lines = reply.split("\n");

    let currentDay = ""; // 현재 날짜를 저장할 변수
    lines.forEach((line) => {
      if (line.startsWith("Day")) {
        // "Day"로 시작하는 줄이면 날짜 제목을 div로 생성
        currentDay = document.createElement("div");
        currentDay.classList.add("day-title"); // CSS 스타일 적용을 위해 클래스 추가
        currentDay.textContent = line; // 텍스트 설정
        resultText.appendChild(currentDay); // 결과 영역(resultText)에 추가
      } else {
        // 방문 장소인 경우 p 태그로 생성하여 추가
        const p = document.createElement("p");
        p.textContent = line;
        resultText.appendChild(p);
      }
    });

    // Day별 방문 장소 배열 저장 (전역 변수로 사용)
    dayPlaces = extractDayPlaces(reply);
    console.log("추출된 dayPlaces:", dayPlaces); // 추출된 데이터 확인 (디버깅용)

    // dayPlaces가 비어 있으면 오류 메시지 출력 후 함수 종료
    if (!dayPlaces || Object.keys(dayPlaces).length === 0) {
      console.error("dayPlaces가 비어 있음!");
      return;
    }

    // 지도 컨테이너를 보이도록 변경 (기본적으로 숨겨져 있을 가능성이 있음)
    document.getElementById("mapContainer").classList.remove("hidden");

    // 화면 전환: 진행 중 화면(step5) 숨기고 결과 화면(step6) 표시
    //document.getElementById("progress-container").classList.add("hidden");
    document.getElementById("step5").classList.add("hidden");
    document.getElementById("step6").classList.remove("hidden");

    console.log("initMap 호출 전 dayPlaces:", dayPlaces); // 지도 초기화 전에 데이터 확인

    // 지도 초기화 함수 실행 (마커 찍기)
    initMap();
    // 날짜 버튼 표시
    showDayButtons();
  });
}