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

// --- (جديد) متغيرات حالة اللعبة ---
const questionCache = {};   // لتخزين الأسئلة التي تم جلبها من JSON
let usedQuestions = {};     // لتتبع الأسئلة المستخدمة
let currentClickedCell = null; // لتذكر الخلية التي تم النقر عليها
let currentQuestion = null;   // لتذكر السؤال الحالي

// --- قائمة الحروف الأساسية ---
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
 * 0. وظيفة لخلط أي مصفوفة
 */
function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * (جديد) 1. جلب سجل الأسئلة المستخدمة من LocalStorage
 */
function loadUsedQuestions() {
    const stored = localStorage.getItem('hrof_used_questions');
    if (stored) {
        usedQuestions = JSON.parse(stored);
    } else {
        usedQuestions = {};
    }
}

/**
 * (جديد) 2. حفظ سجل الأسئلة في LocalStorage
 */
function saveUsedQuestions() {
    localStorage.setItem('hrof_used_questions', JSON.stringify(usedQuestions));
}

/**
 * 3. معالجة الضغط على أزرار الإعدادات
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
 * 4. وظيفة بدء اللعبة
 */
function startGame() {
    mainMenuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    loadUsedQuestions(); // (جديد) جلب السجل عند بدء اللعبة
    initializeGameBoard();
    // (لاحقاً)
    // TurnManager.startGame(); 
}

/**
 * 5. وظيفة بناء لوحة اللعب السداسية
 */
function initializeGameBoard() {
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

/**
 * 6. وظيفة معالجة النقر على الخلية (محدثة)
 */
async function handleCellClick(event) {
    const clickedCell = event.currentTarget;
    const letterId = clickedCell.dataset.letterId; // '01alif'

    if (!clickedCell.classList.contains('playable')) {
        return; 
    }

    currentClickedCell = clickedCell; // تذكر الخلية التي تم النقر عليها

    // (جديد) جلب السؤال الحقيقي
    const question = await getQuestionForLetter(letterId);

    if (question) {
        currentQuestion = question; // تذكر السؤال الحالي
        questionText.textContent = question.question;
        answerText.textContent = question.answer;
        
        answerRevealSection.style.display = 'none';
        questionModalOverlay.style.display = 'flex';
    } else {
        // في حالة لم يتم العثور على سؤال (خطأ في الملف مثلاً)
        questionText.textContent = 'عذراً، لا توجد أسئلة لهذا الحرف حالياً.';
        answerText.textContent = '';
        answerRevealSection.style.display = 'none';
        questionModalOverlay.style.display = 'flex';
    }
}

/**
 * (جديد) 7. جلب سؤال لحرف معين
 */
async function getQuestionForLetter(letterId) {
    // 1. جلب الأسئلة (من الكاش أو من الملف)
    if (!questionCache[letterId]) {
        try {
            const response = await fetch(`data/questions/${letterId}.json`);
            if (!response.ok) throw new Error('ملف السؤال غير موجود');
            questionCache[letterId] = await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const allQuestions = questionCache[letterId];
    if (allQuestions.length === 0) return null; // ملف فارغ

    // 2. البحث عن أسئلة غير مستخدمة
    let unusedQuestions = [];
    for (let i = 0; i < allQuestions.length; i++) {
        const questionId = `${letterId}_q${i}`; // '01alif_q0', '01alif_q1'
        if (!usedQuestions[questionId]) {
            unusedQuestions.push({
                ...allQuestions[i], // { question: "...", answer: "..." }
                id: questionId // إضافة المعرف الفريد
            });
        }
    }

    // 3. (الأهم) إذا تم استخدام كل الأسئلة
    if (unusedQuestions.length === 0) {
        console.log(`تم استخدام كل أسئلة ${letterId}. إعادة التعيين...`);
        // إعادة التدوير (كما اتفقنا)
        for (let i = 0; i < allQuestions.length; i++) {
            const questionId = `${letterId}_q${i}`;
            delete usedQuestions[questionId]; // حذفها من السجل
        }
        saveUsedQuestions(); // حفظ السجل المحدث
        // الآن، كل الأسئلة متاحة مجدداً
        unusedQuestions = allQuestions.map((q, i) => ({
            ...q,
            id: `${letterId}_q${i}`
        }));
    }

    // 4. اختيار سؤال عشوائي من قائمة "غير المستخدمة"
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    return unusedQuestions[randomIndex];
}


/**
 * 8. وظيفة إظهار الجواب
 */
function showAnswer() {
    answerRevealSection.style.display = 'block';
}

/**
 * (جديد ومحدث) 9. معالجة نتيجة السؤال (بدلاً من closeModal)
 */
function handleQuestionResult(result) {
    // 1. إغلاق النافذة
    questionModalOverlay.style.display = 'none';

    // 2. تسجيل السؤال كمستخدم (حتى لو "تخطي")
    if (currentQuestion) {
        usedQuestions[currentQuestion.id] = true;
        saveUsedQuestions();
    }
    
    // 3. تلوين الخلية
    if (result === 'purple' || result === 'red') {
        const teamColor = result; // 'purple' or 'red'
        
        // إزالة الكلاسات القديمة
        currentClickedCell.classList.remove('playable', 'hex-cell-default');
        
        // إضافة الكلاس الجديد
        currentClickedCell.classList.add(`hex-cell-${teamColor}-owned`);
        
        // (لاحقاً)
        // checkWinCondition(teamColor);
    }
    
    // 4. (لاحقاً)
    // TurnManager.nextTurn();

    // 5. مسح المتغيرات الحالية
    currentClickedCell = null;
    currentQuestion = null;
}

// --- ربط الأحداث (Event Listeners) ---
settingButtons.forEach(button => {
    button.addEventListener('click', handleSettingClick);
});

startGameButton.addEventListener('click', startGame);

showAnswerButton.addEventListener('click', showAnswer);
// (محدث) ربط الأزرار بالوظيفة الجديدة
teamPurpleWinButton.addEventListener('click', () => handleQuestionResult('purple'));
teamRedWinButton.addEventListener('click', () => handleQuestionResult('red'));
skipQuestionButton.addEventListener('click', () => handleQuestionResult('skip'));
