let selectedLocation = ""; //지역선택
let selectedCompanions = []; //동반자
let selectedDuration = ""; //기간
let selectedStyle = []; //여행 스타일
let selectedSchedule = ""; //여행 일정 정도
//일 자별로 마커 찍기
let dayMarkers = {}; // 각 날짜별 마커 저장

//프로그레스바 변수
let currentStep = 0;
const totalSteps = 4; // 총 단계 수
let progressWidth = 0;

// 프로그레스 바를 서서히 차오르게 하는 함수
function increaseProgressBar() {
  const progressBar = document.getElementById("progressBar");
  const interval = setInterval(function () {
    if (progressWidth >= (currentStep / totalSteps) * 100) {
      clearInterval(interval); // 목표값에 도달하면 멈추기
    } else {
      progressWidth += 1; // 1씩 증가
      progressBar.style.width = `${progressWidth}%`;
    }
  }, 10); // 10ms마다 증가
}

// 프로그레스 바 업데이트 함수
function updateProgressBar() {
  const progress = (currentStep / totalSteps) * 100; // 현재 단계에 대한 비율 계산
  document.getElementById("progressBar").style.width = `${progress}%`;
}

function deleteProgressBar() {
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = "100%"; // 먼저 100%로 채우고
  setTimeout(function () {
    const interval = setInterval(function () {
      if (progressBar.style.width === "0%") {
        clearInterval(interval); // 목표값에 도달하면 멈추기
      } else {
        let currentWidth = parseInt(progressBar.style.width);
        progressBar.style.width = `${currentWidth - 1}%`; // 1%씩 줄어듦
      }
    }, 50); // 10ms마다 감소
  }, 1000); // 1초 후에 프로그레스 바가 사라지기 시작
}

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
    currentStep = 1;
    updateProgressBar();
  }
}

//1단계로 돌아가기 - 여행지 선택
function goToStep1() {
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
  currentStep = 0;
  updateProgressBar();
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
    currentStep = 2;
    updateProgressBar();
  }
}

//2단계로 돌아가기
function goToStep2FromStep3() {
  document.getElementById("step3").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
  currentStep = 1;
  updateProgressBar();
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
    currentStep = 3;
    updateProgressBar();
  }
}

//3단계로 돌아오기
function goToStep3FromStep4() {
  document.getElementById("step4").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
  currentStep = 2;
  updateProgressBar();
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
    currentStep = 4;
    updateProgressBar();
  }
}

// 4단계로 이동
function goToStep4FromStep5() {
  document.getElementById("step5").classList.add("hidden");
  document.getElementById("step4").classList.remove("hidden");
  currentStep = 3;
  updateProgressBar();
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
  currentStep = 0;
  updateProgressBar();
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
                    이 조건들을 바탕으로 여행 일정을 Day 1, Day 2 식으로 나누어 추천해주고 절대 마크다운 형식으로 보여주지마. 프롬프트 결과 형식은 맨처음 "아이와 함께 떠나는 4박 5일 힐링하는 서울 여행" 이런 형식으로 제목을 보여줘 그리고 다음에 각 일 수 마다 정확한 장소를 예를 들어서 "Day1 : 부산 해운대 해수욕장 , 부산 해운대 정통 시장" 이런식으로 부제목에는 부연 설명 없이 나눠줘 항상 Day 옆에 그 날 방문할 "실제 존재 하는 지도에 검색해서 찾을 수 있는 형태의 정확한 장소만을" "꼭" "반드시" 보여줘야 해. 예를 들어서 해당 지역을 방문할 장소 앞에 꼭 붙혀서 "경주 최부자댁" 이런 형식으로 보여줘야해. Day에 장소를 추천할 때는 최대한 비슷한 구역으로 묶어서 추천해줘. 예를 들어서 하루 안에 서울이였다가 부산으로 너무 멀리 가버리는 일정은 넣지 말아줘. 그리고 일정을 계획해서 방문할 장소를 정할 때 일정과 일정 사이의 이동을 최적화 해줘. 예를 들어서 전날 "제주 공항"에 있었는데 "성산일출봉"으로 가는 계획 말고 제주 공항에서 아르떼뮤지엄 제주를 가고 다음에 천지연 폭포를 가고 다음날 제주 민속촌을 가고 다음날 성산일출봉을 가고 복귀하는 날 제주 공항으로 차례차례 이동할 수 있도록 하는 효율적인 루트로 계획 해줘서 장소를 방문하기 위해서 너무 많은 이동시간을 갖게 하지 말아줘. 그리고 이건 단순히 예시니까 예시 방문지만을 보여주지 말고 너가 추천을 할 때 참고로 해줘. 그리고 장소를 구분 할 때는 항상 사이에 ","를 넣어서 구분하고 제목으로 달아줘. 일정에 대한 프롬프트는 빼곡한 일정일 경우 하루에 방문할 장소를 최소 3개 넣어줘. 제목에 대한 형식은 꼭 지켜줘. 그리고 널널한 일정을 선호한다고 했다면 각각의 일 수 마다 2개정도의 방문할 목적지만을 넣어줘. 그리고 널널한 일정이라도 마지막 일 수에 항상 적어도 1개의 방문할 장소는 추천해줘. 만약 추천할 장소가 없을 때만 "마지막 날에만" 해당 지역에 있는 역이나 해당 지역에 있는 고속버스 터미널 같은 교통 수단을 제목으로 방문할 장소로 보여줘. 해당 지역이 복수일 경우 하나씩 해당 지역 역이나 고속버스터미널을 보여줘 예를 들어서 "Day6 : 안동 버스터미널, 포항 버스터미널" 이런식으로 해당지역이 복수라면 이런식으로 보여줘. 그리고 제목이 아니라 계획에는 예를 들어서 "다시 방문하고 싶은 곳을 방문하시거나 해당 지역의 교통편을 참고해서 편하고 안전하게 귀가하세요" 이런 형식으로 해주고 제발 제목에 저 문장을 넣지마. 추가적으로 시간에 대한 구속을 받지 않는 계획을 추천해줘. 그리고 각각의 일 수에 대한 계획을 보여주고 시간과 순서에 맞게 방문할 장소에 대한 순서를 계획해줘. 예를 들어서 "여수밤바다"인데 오전 10시에 밤 풍경을 볼 수 없듯이 이런 시간적, 거리적인 것들을 생각해서 임의적으로 시간을 넣어서 계획을 알려줘. 예를 들어서 "오후 1:00 : 두물머리로 이동해서 멋있는 경치를 감상하며 힐링해보세요." 이런 형식으로 작성해줘. 절대적으로 계획을 넣어줘야돼. 그리고 제목에는 절대적으로 방문할 장소만 넣어줘야하고 무조건 적으로 방문할 장소라면 무조건 앞에 해당 지역을 넣어줘.`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();
  return json.reply;
}

let geocoder;
let map; // Google Map 객체를 저장할 변수
// 전역 변수 선언
let dayPlaces = {}; // {} 빈 객체로 초기화

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
  const dayButtonsContainer = document.getElementById('dayFilterButtons');
  const allButtons = dayButtonsContainer.getElementsByTagName('button');

  // dayPlaces 배열의 길이에 맞게 버튼을 보이게 함
  for (let i = 0; i < allButtons.length - 1; i++) { // 마지막 버튼(모두 보기)은 항상 보이게
    const button = allButtons[i];
    const dayIndex = parseInt(button.innerText.replace('Day ', ''));

    if (dayIndex <= dayPlaces.length) {
      button.style.display = 'inline-block'; // 버튼 보이기
    } else {
      button.style.display = 'none'; // 버튼 숨기기
    }
  }
  // '모두 보기' 버튼은 항상 보이게
  allButtons[allButtons.length - 1].style.display = 'inline-block';
}


// 🎨 색상별 마커 아이콘 반환 함수
function getMarkerIcon(dayIndex) {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  return `http://maps.google.com/mapfiles/ms/icons/${colors[dayIndex % colors.length]}-dot.png`;
}

//Day 별로 마커를 보여주는 함수(모두 보기 버튼은 초기 모든 마커를 다시 볼 수 있게 함)
function showMarkersForDay(dayKey) {
  // 모든 마커 숨기기
  Object.values(dayMarkers).forEach((markers) =>
    markers.forEach((marker) => marker.setMap(null))
  );

  // 모든 마커를 다시 보여주는 기능
  if (dayKey === "All") {
    Object.values(dayMarkers).forEach((markers) => {
      markers.forEach((marker, index) => {
        marker.setMap(map);
        if (index === 0) {
          // "모두 보기" 클릭 시 지도 중심을 첫 번째 마커로 이동
          map.setCenter(marker.getPosition());
        }
      });
    });
  } else {
    // 선택한 날짜의 마커만 보이기
    if (dayMarkers[dayKey]) {
      dayMarkers[dayKey].forEach((marker, index) => {
        marker.setMap(map);
        if (index === 0) {
          // 첫 번째 마커의 위치로 지도를 이동
          map.setCenter(marker.getPosition());
        }
      });
    }
  }
}

function initMap() {
  if (!dayPlaces || dayPlaces.length === 0) {
    console.error("dayPlaces가 비어 있음!");
    return;
  }

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

    // 날짜 버튼 표시
    showDayButtons();
  });
}

// 5단계에서 결과 보기
function showSelection() {
  // 진행바 삭제 (UI 업데이트)
  deleteProgressBar();

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
    document.getElementById("progress-container").classList.add("hidden");
    document.getElementById("step5").classList.add("hidden");
    document.getElementById("step6").classList.remove("hidden");

    console.log("initMap 호출 전 dayPlaces:", dayPlaces); // 지도 초기화 전에 데이터 확인

    // 지도 초기화 함수 실행 (마커 찍기)
    initMap();
  });
}
