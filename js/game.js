// --- استيراد مدير الأدوار ---
import { TurnManager } from './turn_manager.js';

// --- العناصر (Elements) ---
const mainMenuScreen = document.getElementById('main-menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoardContainer = document.getElementById('game-board-container');

// ... (عناصر الإعدادات) ...
const settingButtons = document.querySelectorAll('.setting-button');
const startGameButton = document.getElementById('start-game-button');

// ... (عناصر نافذة السؤال) ...
const questionModalOverlay = document.getElementById('question-modal-overlay');
const questionText = document.getElementById('question-text');
const showAnswerButton = document.getElementById('show-answer-button');
const answerRevealSection = document.getElementById('answer-reveal-section');
const answerText = document.getElementById('answer-text');
const teamPurpleWinButton = document.getElementById('team-purple-win-button');
const teamRedWinButton = document.getElementById('team-red-win-button');
const skipQuestionButton = document.getElementById('skip-question-button');

// ... (عناصر لوحة النتائج) ...
const purpleScoreDisplay = document.getElementById('purple-score');
const redScoreDisplay = document.getElementById('red-score');

// ... (عناصر شاشة الفوز الجديدة) ...
const roundWinOverlay = document.getElementById('round-win-overlay');
const winMessage = document.getElementById('win-message');
const winScorePurple = document.getElementById('win-score-purple');
const winScoreRed = document.getElementById('win-score-red');
const nextRoundButton = document.getElementById('next-round-button');

// --- تصدير إعدادات اللعبة ---
export const gameSettings = {
    mode: 'turns',
    teams: '2p',
    timer: 'off'
};

// --- متغيرات حالة اللعبة ---
const questionCache = {};
let usedQuestions = {};
let currentClickedCell = null;
let currentQuestion = null;
let gameActive = true; // (جديد) للتحكم في تجميد اللوحة
let scores = { purple: 0, red: 0 }; // (جديد) لتتبع نتيجة الجولات

// --- قائمة الحروف الأساسية ---
const ALL_LETTERS = [
    { id: '01alif', char: 'أ' }, { id: '02ba', char: 'ب' }, // ... (باقي الحروف) ...
    { id: '28ya', char: 'ي' }
];

// --- الوظائف (Functions) ---

/** 0. خلط المصفوفة */
function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/** 1. جلب سجل الأسئلة */
function loadUsedQuestions() {
    const stored = localStorage.getItem('hrof_used_questions');
    usedQuestions = stored ? JSON.parse(stored) : {};
}

/** 2. حفظ سجل الأسئلة */
function saveUsedQuestions() {
    localStorage.setItem('hrof_used_questions', JSON.stringify(usedQuestions));
}

/** 3. معالجة أزرار الإعدادات */
function handleSettingClick(event) {
    const clickedButton = event.target;
    const settingType = clickedButton.dataset.setting;
    const settingValue = clickedButton.dataset.value;
    gameSettings[settingType] = settingValue;
    const buttonsInGroup = document.querySelectorAll(`.setting-button[data-setting="${settingType}"]`);
    buttonsInGroup.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

/** 4. وظيفة بدء اللعبة */
function startGame() {
    mainMenuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    // (جديد) إعادة تعيين النقاط عند بدء لعبة جديدة (وليس جولة جديدة)
    scores = { purple: 0, red: 0 };
    updateScoreboard();

    loadUsedQuestions();
    startNewRound();
}

/** 5. (جديد) بدء جولة جديدة */
function startNewRound() {
    gameActive = true; // تفعيل اللوحة
    roundWinOverlay.style.display = 'none'; // إخفاء شاشة الفوز
    initializeGameBoard(); // بناء اللوحة من جديد
    TurnManager.startGame(); // بدء مدير الأدوار
}

/** 6. بناء لوحة اللعب */
function initializeGameBoard() {
    // ... (الكود كما هو - بناء اللوحة وتوزيع الحروف) ...
    gameBoardContainer.innerHTML = '';
    const shuffledLetters = shuffleArray(ALL_LETTERS);
    const gameLetters = shuffledLetters.slice(0, 25);
    let letterIndex = 0;

    for (let col = 0; col < 7; col++) {
        const column = document.createElement('div');
        column.classList.add('hex-column');
        for (let row = 0; row < 7; row++) {
            const cell = document.createElement('div');
            cell.classList.add('hex-cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            if ((row === 0 || row === 6) && (col === 0 || col === 6)) {
                cell.classList.add('hex-cell-selected');
            } else if ((row === 0 || row === 6) && (col > 0 && col < 6)) {
                cell.classList.add('hex-cell-red');
            } else if ((row > 0 && row < 6) && (col === 0 || col === 6)) {
                cell.classList.add('hex-cell-purple');
            } else {
                cell.classList.add('hex-cell-default', 'playable');
                const letter = gameLetters[letterIndex];
                cell.dataset.letterId = letter.id;
                const letterSpan = document.createElement('span');
                letterSpan.classList.add('hex-letter');
                letterSpan.textContent = letter.char;
                cell.appendChild(letterSpan);
                letterIndex++;
                cell.addEventListener('click', handleCellClick);
            }
            column.appendChild(cell);
        }
        gameBoardContainer.appendChild(column);
    }
}

/** 7. معالجة النقر على الخلية */
async function handleCellClick(event) {
    // (جديد) تجميد اللوحة إذا اللعبة غير نشطة
    if (!gameActive) return;

    const clickedCell = event.currentTarget;
    const letterId = clickedCell.dataset.letterId;
    if (!clickedCell.classList.contains('playable')) {
        return; 
    }
    currentClickedCell = clickedCell;
    const question = await getQuestionForLetter(letterId);
    if (question) {
        currentQuestion = question;
        questionText.textContent = question.question;
        answerText.textContent = question.answer;
        answerRevealSection.style.display = 'none';
        questionModalOverlay.style.display = 'flex';
    } else {
        // ... (معالجة الخطأ كما هي) ...
    }
}

/** 8. جلب سؤال لحرف معين */
async function getQuestionForLetter(letterId) {
    // ... (الكود كما هو - منطق جلب الأسئلة) ...
    if (!questionCache[letterId]) {
        try {
            const response = await fetch(`data/questions/${letterId}.json`);
            if (!response.ok) throw new Error('ملف السؤال غير موجود');
            questionCache[letterId] = await response.json();
        } catch (error) { console.error(error); return null; }
    }
    const allQuestions = questionCache[letterId];
    if (allQuestions.length === 0) return null;
    let unusedQuestions = [];
    for (let i = 0; i < allQuestions.length; i++) {
        const questionId = `${letterId}_q${i}`;
        if (!usedQuestions[questionId]) {
            unusedQuestions.push({ ...allQuestions[i], id: questionId });
        }
    }
    if (unusedQuestions.length === 0) {
        for (let i = 0; i < allQuestions.length; i++) {
            delete usedQuestions[`${letterId}_q${i}`];
        }
        saveUsedQuestions();
        unusedQuestions = allQuestions.map((q, i) => ({ ...q, id: `${letterId}_q${i}` }));
    }
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    return unusedQuestions[randomIndex];
}

/** 9. إظهار الجواب */
function showAnswer() {
    answerRevealSection.style.display = 'block';
}

/** 10. معالجة نتيجة السؤال (محدثة) */
function handleQuestionResult(result) {
    questionModalOverlay.style.display = 'none';

    if (currentQuestion) {
        usedQuestions[currentQuestion.id] = true;
        saveUsedQuestions();
    }
    
    if (result === 'purple' || result === 'red') {
        const teamColor = result;
        currentClickedCell.classList.remove('playable', 'hex-cell-default');
        currentClickedCell.classList.add(`hex-cell-${teamColor}-owned`);
        
        // --- (جديد) التحقق من الفوز ---
        if (checkWinCondition(teamColor)) {
            handleGameWin(teamColor);
            return; // توقف، لا تنقل الدور
        }
    }
    
    TurnManager.nextTurn(result);
    currentClickedCell = null;
    currentQuestion = null;
}

/** 11. (جديد) وظيفة جلب خلية بواسطة الإحداثيات */
function getCell(r, c) {
    return document.querySelector(`.hex-cell[data-row="${r}"][data-col="${c}"]`);
}

/** 12. (جديد) وظيفة جلب الجيران للخلية */
function getNeighbors(r, c) {
    r = parseInt(r);
    c = parseInt(c);
    
    let neighbors = [];
    
    // تحديد الجيران بناءً على إزاحة العمود (فردي أم زوجي)
    const isOddCol = c % 2 !== 0;

    if (isOddCol) { // عمود فردي (1, 3, 5) - (مزاح للأسفل)
        neighbors = [
            [r - 1, c],     // أعلى
            [r + 1, c],     // أسفل
            [r, c - 1],     // أعلى-يسار
            [r + 1, c - 1], // أسفل-يسار
            [r, c + 1],     // أعلى-يمين
            [r + 1, c + 1]  // أسفل-يمين
        ];
    } else { // عمود زوجي (0, 2, 4, 6)
        neighbors = [
            [r - 1, c],     // أعلى
            [r + 1, c],     // أسفل
            [r - 1, c - 1], // أعلى-يسار
            [r, c - 1],     // أسفل-يسار
            [r - 1, c + 1], // أعلى-يمين
            [r, c + 1]      // أسفل-يمين
        ];
    }

    // فلترة الجيران لضمان أنهم داخل اللوحة (0-6)
    return neighbors.filter(([nr, nc]) => 
        nr >= 0 && nr <= 6 && nc >= 0 && nc <= 6
    );
}

/** 13. (جديد) وظيفة التحقق من الفوز */
function checkWinCondition(teamColor) {
    const visited = new Set(); // لتتبع الخلايا التي تمت زيارتها
    const queue = []; // (Queue) للبحث (BFS)
    
    const startRow = (teamColor === 'red') ? 0 : 1;
    const endRow = (teamColor === 'red') ? 6 : 5;
    const startCol = (teamColor === 'purple') ? 0 : 1;
    const endCol = (teamColor === 'purple') ? 6 : 5;
    
    const targetRow = (teamColor === 'red') ? 6 : -1; // -1 يعني لا يهم
    const targetCol = (teamColor === 'purple') ? 6 : -1;

    // 1. إضافة كل خلايا البداية إلى الـ Queue
    if (teamColor === 'red') {
        for (let c = 1; c <= 5; c++) {
            const cell = getCell(1, c);
            if (cell && cell.classList.contains('hex-cell-red-owned')) {
                queue.push([1, c]);
                visited.add(`1,${c}`);
            }
        }
    } else { // 'purple'
        for (let r = 1; r <= 5; r++) {
            const cell = getCell(r, 1);
            if (cell && cell.classList.contains('hex-cell-purple-owned')) {
                queue.push([r, 1]);
                visited.add(`${r},1`);
            }
        }
    }

    // 2. بدء البحث (BFS)
    while (queue.length > 0) {
        const [r, c] = queue.shift();

        // 3. التحقق من الوصول للهدف
        // (هل الخلية الحالية متصلة بالطرف الآخر؟)
        const neighbors = getNeighbors(r, c);
        for (const [nr, nc] of neighbors) {
            if (teamColor === 'red' && nr === 6) { // الوصول للحد السفلي
                return true;
            }
            if (teamColor === 'purple' && nc === 6) { // الوصول للحد الأيمن
                return true;
            }
            
            // 4. مواصلة البحث
            const neighborCell = getCell(nr, nc);
            if (neighborCell && 
                !visited.has(`${nr},${nc}`) &&
                neighborCell.classList.contains(`hex-cell-${teamColor}-owned`)) 
            {
                visited.add(`${nr},${nc}`);
                queue.push([nr, nc]);
            }
        }
    }
    
    return false; // لم يتم العثور على مسار
}

/** 14. (جديد) وظيفة معالجة الفوز بالجولة */
function handleGameWin(teamColor) {
    gameActive = false; // تجميد اللوحة
    
    // تحديث النتيجة
    scores[teamColor]++;
    updateScoreboard();

    // إظهار رسالة الفوز
    winMessage.textContent = (teamColor === 'red') ? 'الفريق الأحمر فاز بالجولة!' : 'الفريق البنفسجي فاز بالجولة!';
    winScorePurple.textContent = scores.purple;
    winScoreRed.textContent = scores.red;
    
    roundWinOverlay.style.display = 'flex'; // إظهار شاشة الفوز
}

/** 15. (جديد) وظيفة تحديث لوحة النتائج الرئيسية */
function updateScoreboard() {
    purpleScoreDisplay.textContent = scores.purple;
    redScoreDisplay.textContent = scores.red;
}

// --- ربط الأحداث (Event Listeners) ---
settingButtons.forEach(button => {
    button.addEventListener('click', handleSettingClick);
});

startGameButton.addEventListener('click', startGame);
nextRoundButton.addEventListener('click', startNewRound); // (جديد)

showAnswerButton.addEventListener('click', showAnswer);
teamPurpleWinButton.addEventListener('click', () => handleQuestionResult('purple'));
teamRedWinButton.addEventListener('click', () => handleQuestionResult('red'));
skipQuestionButton.addEventListener('click', () => handleQuestionResult('skip'));
