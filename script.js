// 사용할 감정 어휘와 팀 색깔
const emotions  = ['angry','happy','sad','sleepy','thirsty','tired'];
const teamColors = ['#e74c3c','#3498db']; // 팀 1=빨강, 팀 2=파랑

// 게임 상태
let boardState  = {};            // { cellId: teamIndex, … }
let currentTeam = 0;             // 0=팀1, 1=팀2
const totalCells = 25;

// DOM 참조
const board        = document.getElementById('board');
const modal        = document.getElementById('modal');
const questionEl   = document.getElementById('questionText');
const choicesEl    = document.getElementById('choiceButtons');
const closeBtn     = document.getElementById('closeBtn');
const turnIndicator= document.getElementById('turnIndicator');

// 1) 보드 셀 5×5 생성
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 5; c++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.id        = `r${r}c${c}`;
    cell.onclick   = () => onCellClick(cell.id);
    board.appendChild(cell);
  }
}

// 2) 턴 표시 갱신
function updateTurnIndicator() {
  turnIndicator.innerText = 
    `현재 차례: 팀 ${currentTeam+1} (${ currentTeam===0? '빨강':'파랑' })`;
}
updateTurnIndicator();

// 3) 모달 닫기 버튼 핸들러
closeBtn.onclick = () => {
  console.log('닫기 클릭됨!');
  modal.classList.add('hidden');
};

// 4) 셀 클릭 시 질문 모달 열기
function onCellClick(cellId) {
  console.log('셀 클릭:', cellId);
  if (boardState[cellId] !== undefined) {
    console.log('이미 채워짐:', cellId);
    return;
  }
  // 랜덤 감정 선택
  const idx = Math.floor(Math.random()*emotions.length);
  const emo = emotions[idx];

  // 모달에 질문 텍스트와 선택지 버튼 생성
  questionEl.innerText = `I’m ${emo}. Which one?`;
  choicesEl.innerHTML  = '';
  emotions.forEach(e => {
    const btn = document.createElement('button');
    btn.innerText = e;
    btn.onclick   = () => checkAnswer(cellId, emo, e);
    choicesEl.appendChild(btn);
  });

  // 모달 보이기
  modal.classList.remove('hidden');
}

// 5) 정답 판정 & 칸 채우기
function checkAnswer(cellId, correct, chosen) {
  console.log(`정답판정: 맞는값=${correct}, 선택값=${chosen}`);
  modal.classList.add('hidden');

  if (chosen === correct) {
    // 정답: 칸 색칠 & 상태 저장
    boardState[cellId] = currentTeam;
    document.getElementById(cellId)
      .style.backgroundColor = teamColors[currentTeam];

    // 모든 칸 채워졌는지 체크
    if (Object.keys(boardState).length === totalCells) {
      return showWinner();
    }

    // 턴 변경
    currentTeam = 1 - currentTeam;
    updateTurnIndicator();
  } else {
    alert('틀렸어요, 다시 시도!');
  }
}

// 6) 게임 종료 & 승자 알림
function showWinner() {
  const counts = [0,0];
  Object.values(boardState).forEach(t => counts[t]++);
  const winner = counts[0] > counts[1] ? 1 : 2;
  alert(
    `게임 종료!\n`+
    `팀 1(빨강): ${counts[0]}칸\n`+
    `팀 2(파랑): ${counts[1]}칸\n`+
    `🎉 승리: 팀 ${winner}`
  );
}
