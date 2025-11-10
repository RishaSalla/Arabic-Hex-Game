// --- العناصر (Elements) ---
const mainMenuScreen = document.getElementById('main-menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoardContainer = document.getElementById('game-board-container');

const settingButtons = document.querySelectorAll('.setting-button');
const startGameButton = document.getElementById('start-game-button');

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
    mode: 'turns',
    teams: '2p',
    timer: 'off'
};

// --- (جديد) قائمة الحروف الأساسية ---
// (مطابقة لأسماء ملفات .json في مجلد data/questions)
const ALL_LETTERS = [
    { id: '01alif', char: 'أ' }, { id: '02ba', char: 'ب' }, { id: '03ta', char: 'ت' },
    { id: '04tha', char: 'ث' }, { id: '05jeem', char: 'ج' }, { id: '06haa', char: 'ح' },
    { id: '07khaa', char: 'خ' }, { id: '08dal', char: 'د' }, { id: '09dhal', char: 'ذ' },
    { id: '10ra', char: 'ر' }, { id: '11zay', char: 'ز' }, { id: '12seen', char: 'س' },
    { id: '13sheen', char: 'ش' }, { id: '14sad', char: 'ص' }, { id: '15dad', char: 'ض' },
    { id: '16ta_a', char: 'ط' }, { id: '17zha', char: 'ظ' }, { id: '18ain', char: 'ع' },
    { id: '19ghain', char: 'غ' }, { id: '20fa', char: 'ف' }, { id: '21qaf', char: 'ق' },
    { id: '22kaf', char: 'ك' }, { id: '23lam', char: 'ل' }, { id: '24meem', char: 'م' },
    { id: '25noon', char: 'ن' }, { id: '26ha_a', char: 'هـ' }, { id: '27waw', char: 'و' },
    { id: '28ya', char: 'ي' }
];

// --- الوظائف (Functions) ---

/**
 * 0. (جديد) وظيفة لخلط أي مصفوفة (خوارزمية Fisher-Yates)
 */
function shuffleArray(array) {
    let newArray = [...array]; // ننسخ المصفوفة الأصلية لتجنب تعديلها
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // تبديل العناصر
    }
    return newArray;
}

/**
 * 1. معالجة الضغط على أزرار الإعدادات
 */
function handleSettingClick(event) {
    // ... (الكود السابق كما هو) ...
    const clickedButton = event.target;
    const settingType = clickedButton.dataset.setting;
    const settingValue = clickedButton.dataset.value;

    gameSettings[settingType] = settingValue;

    const buttonsInGroup = document.querySelectorAll(`.setting-button[data-setting="${settingType}"]`);
    buttonsInGroup.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

/**
 * 2. وظيفة بدء اللعبة
 */
function startGame() {
    mainMenuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    initializeGameBoard();
}

/**
 * 3. وظيفة بناء لوحة اللعب السداسية (تم تحديثها)
 */
function initializeGameBoard() {
    gameBoardContainer.innerHTML = '';

    // (جديد) خلط الحروف واختيار أول 25
    const shuffledLetters = shuffleArray(ALL_LETTERS);
    const gameLetters = shuffledLetters.slice(0, 25);
    let letterIndex = 0; // مؤشر لتتبع الحرف التالي

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
                
                // (جديد) إضافة الحرف للخلية
                const letter = gameLetters[letterIndex];
                cell.dataset.letterId = letter.id; // تخزين '01alif'
                
                const letterSpan = document.createElement('span');
                letterSpan.classList.add('hex-letter');
                letterSpan.textContent = letter.char; // إظهار 'أ'
                cell.appendChild(letterSpan);
                
                letterIndex++; // الانتقال للحرف التالي

                cell.addEventListener('click', handleCellClick);
            }
            column.appendChild(cell);
        }
        gameBoardContainer.appendChild(column);
    }
}

/**
 * 4. وظيفة معالجة النقر على الخلية (تم تحديثها)
 */
function handleCellClick(event) {
    const clickedCell = event.currentTarget;
    const letterId = clickedCell.dataset.letterId; // '01alif'
    const letterChar = clickedCell.querySelector('.hex-letter').textContent; // 'أ'

    // (جديد) منع النقر على خلية ملونة
    if (!clickedCell.classList.contains('playable')) {
        return; // توقف هنا إذا الخلية غير قابلة للعب
    }

    // (جديد) جلب السؤال بناءً على الحرف (سنبني هذه الوظيفة لاحقاً)
    // fetchQuestionForLetter(letterId); 
    
    // (مؤقتاً) سنستخدم الحرف في السؤال الوهمي
    questionText.textContent = `سؤال عشوائي لحرف (${letterChar})؟`;
    answerText.textContent = `جواب عشوائي لحرف (${letterChar}).`;
    
    answerRevealSection.style.display = 'none';
    questionModalOverlay.style.display = 'flex';
}

/**
 * 5. وظيفة إظهار الجواب
 */
function showAnswer() {
    answerRevealSection.style.display = 'block';
}

/**
 * 6. وظيفة إغلاق النافذة
 */
function closeModal() {
    questionModalOverlay.style.display = 'none';
}

// --- ربط الأحداث (Event Listeners) ---
settingButtons.forEach(button => {
    button.addEventListener('click', handleSettingClick);
});

startGameButton.addEventListener('click', startGame);

showAnswerButton.addEventListener('click', showAnswer);
teamPurpleWinButton.addEventListener('click', closeModal);
teamRedWinButton.addEventListener('click', closeModal);
skipQuestionButton.addEventListener('click', closeModal);
