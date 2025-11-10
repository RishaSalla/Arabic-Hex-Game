// --- العناصر (Elements) ---
const mainMenuScreen = document.getElementById('main-menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoardContainer = document.getElementById('game-board-container');

const settingButtons = document.querySelectorAll('.setting-button');
const startGameButton = document.getElementById('start-game-button');

// عناصر نافذة السؤال (جديدة)
const questionModalOverlay = document.getElementById('question-modal-overlay');
const questionText = document.getElementById('question-text');
const showAnswerButton = document.getElementById('show-answer-button');
const answerRevealSection = document.getElementById('answer-reveal-section');
const answerText = document.getElementById('answer-text');
const teamPurpleWinButton = document.getElementById('team-purple-win-button');
const teamRedWinButton = document.getElementById('team-red-win-button');
const skipQuestionButton = document.getElementById('skip-question-button');

// --- إعدادات اللعبة (Game Settings) ---
export const gameSettings = {
    mode: 'turns',      // 'turns' (أدوار) or 'competitive' (تنافسي)
    teams: '2p',        // '2p' (لاعبين) or 'full' (فرق)
    timer: 'off'        // 'on' or 'off'
};

// --- الوظائف (Functions) ---

/**
 * 1. معالجة الضغط على أزرار الإعدادات
 */
function handleSettingClick(event) {
    // ... (الكود السابق كما هو) ...
    const clickedButton = event.target;
    const settingType = clickedButton.dataset.setting; // 'mode', 'teams', or 'timer'
    const settingValue = clickedButton.dataset.value;  // 'turns', 'competitive', etc.

    gameSettings[settingType] = settingValue;
    console.log('الإعدادات المحدثة:', gameSettings);

    const buttonsInGroup = document.querySelectorAll(`.setting-button[data-setting="${settingType}"]`);
    buttonsInGroup.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

/**
 * 2. وظيفة بدء اللعبة (الانتقال للشاشة التالية)
 */
function startGame() {
    mainMenuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    initializeGameBoard();
}

/**
 * 3. وظيفة بناء لوحة اللعب السداسية
 */
function initializeGameBoard() {
    gameBoardContainer.innerHTML = '';

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
                // الخلايا الرمادية في المنتصف (5x5)
                cell.classList.add('hex-cell-default', 'playable');
                
                // (جديد!) ربط حدث النقر بالخلية
                cell.addEventListener('click', handleCellClick);
            }
            column.appendChild(cell);
        }
        gameBoardContainer.appendChild(column);
    }
}

/**
 * 4. وظيفة معالجة النقر على الخلية (جديدة)
 */
function handleCellClick(event) {
    const clickedCell = event.currentTarget;

    // (مؤقتاً) سنضع نصوص وهمية
    questionText.textContent = 'هذا هو السؤال الخاص بالخلية التي تم النقر عليها؟';
    answerText.textContent = 'هذا هو الجواب الصحيح للسؤال.';
    
    // (جديد) إخفاء قسم الجواب عند فتح النافذة
    answerRevealSection.style.display = 'none';

    // (جديد) إظهار النافذة المنبثقة
    questionModalOverlay.style.display = 'flex';
}

/**
 * 5. وظيفة إظهار الجواب (جديدة)
 */
function showAnswer() {
    answerRevealSection.style.display = 'block';
}

/**
 * 6. وظيفة إغلاق النافذة (جديدة)
 */
function closeModal() {
    questionModalOverlay.style.display = 'none';
}

// --- ربط الأحداث (Event Listeners) ---
settingButtons.forEach(button => {
    button.addEventListener('click', handleSettingClick);
});

startGameButton.addEventListener('click', startGame);

// (جديد) ربط أحداث أزرار النافذة
showAnswerButton.addEventListener('click', showAnswer);
teamPurpleWinButton.addEventListener('click', closeModal); // (مؤقتاً)
teamRedWinButton.addEventListener('click', closeModal);     // (مؤقتاً)
skipQuestionButton.addEventListener('click', closeModal); // (مؤقتاً)
