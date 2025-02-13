let selectedLocation = ""; //지역선택
let selectedCompanions = []; //동반자
let selectedDuration = ""; //기간
let selectedStyle = []; //여행 스타일
let selectedSchedule = ""; //여행 일정 정도

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
  if (selectedStyle.length === 0) {
    document.getElementById("nextStep4").disabled == true;
  }
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
    //"https://productive-majestic-olivine.glitch.me/1",
    "https://torch-highfalutin-alamosaurus.glitch.me/ai-service",
    {
      method: "POST",
      body: JSON.stringify({
        text: `너는 여행 계획 전문가야. 나는 지금 여행을 가고 싶은데, 다음과 같은 조건들이 있어:
                    1. 여행지는 ${selectedLocation}로 정했어.
                    2. 동반자는 ${selectedCompanions.join(", ")}와 함께 갈 거야.
                    3. 여행 기간은 ${selectedDuration}로 계획하고 있어.
                    4. 내가 선호하는 여행 스타일은 ${selectedStyle.join(
                      ", "
                    )}야.
                    5. 여행 일정은 ${selectedSchedule} 정도로 하고 싶어.
                    이 조건들을 바탕으로 여행 일정을 Day 1, Day 2 식으로 나누어 추천해주고 절대 마크다운 형식으로 보여주지마. 그리고 프롬프트 결과 형식은 맨처음 "아이와 함께 떠나는 4박 5일 힐링하는 서울 여행" 이런식으로 제목을 보여줘 그리고 다음에 각 일 수 마다 방문할 장소를 예를 들어서 "Day1 : 부산 해운대 해수욕장 & 부산 해운데 정통 시장" 이런식으로 부제목으로 나눠줘 항상 Day 옆에 그 날 방문할 장소만을 꼭 반드시 보여줘야 해 예를 들어서 방문할 장소 이후에 방문할 곳이 없이 자유시간이라면 그냥 방문할 장소라고만 보여줘 그리고 각각의 일 수에 대한 계획을 보여줘 그리고 계획에 대한 내용은 임의적으로 시간을 넣어서 계획을 알려줘 예를 들어서 "오후 1:00 : 두물머리로 이동해서 멋있는 경치를 감상하며 힐링해보세요." 이런 식으로 작성해줘. 마지막으로 각 날짜에 맞춰서 방문할 장소를 보여줘. 예를 들어서 "Day1 : 부산 해운대 해수욕장, 해운대 정통 시장" 그리고 있다면 다음 줄에 각각 날짜에 대한 방문할 장소 보여줘. 만약에 방문할 장소가 없고 그날 귀가와 근처 쇼핑 정도나 혹은 방문할 장소 없이 자유시간 이라면 따로 넣지 말아줘`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();
  return json.reply;
}

function initMap() {
  // Google Maps API를 사용한 지도 초기화 예시
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 33.499, lng: 126.531 }, // 예시 좌표 (제주도)
    zoom: 10,
  });

  // 지도에 마커 추가
  new google.maps.Marker({
    position: { lat: 33.499, lng: 126.531 },
    map: map,
    title: "제주도",
  });
}

// 5단계에서 결과보기
function showSelection() {
  deleteProgressBar();
  callGeminiAPI().then((reply) => {
    const resultText = document.getElementById("resultText");

    resultText.innerHTML = ""; // 기존 내용 초기화
    const lines = reply.split("\n"); // 줄바꿈 기준으로 데이터 분리

    let currentDay = "";
    lines.forEach((line) => {
      if (line.startsWith("Day")) {
        currentDay = document.createElement("div");
        currentDay.classList.add("day-title");
        currentDay.textContent = line;
        resultText.appendChild(currentDay);
      } else {
        const p = document.createElement("p");
        p.textContent = line;
        resultText.appendChild(p);
      }
    });

    // 결과 화면으로 이동
    document.getElementById("progress-container").classList.add("hidden");
    document.getElementById("step5").classList.add("hidden");
    document.getElementById("step6").classList.remove("hidden");
    // 지도 표시
    document.getElementById("mapContainer").classList.remove("hidden");
    initMap();
  });
}
