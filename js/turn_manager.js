// --- (تم الحذف) لا يوجد استيراد من game.js لكسر الحلقة ---

// --- العناصر (Elements) ---
const turnIndicatorLeft = document.getElementById('turn-indicator-left');
const turnIndicatorRight = document.getElementById('turn-indicator-right');

// --- حالة المدير (Manager State) ---
const state = {
    currentPlayer: 'purple', // من سيبدأ اللعبة
    gameMode: 'turns' // (جديد) سنحفظ الوضع هنا
};

/**
 * 1. وظيفة بدء إدارة الأدوار
 * (تم التعديل) تستقبل الإعدادات من game.js
 */
function startGame(gameSettings) {
    state.gameMode = gameSettings.mode; // (جديد) حفظ الوضع
    
    // (تم إصلاح الترتيب) الأحمر يساراً، البنفسجي يميناً
    state.currentPlayer = 'red'; 

    if (state.gameMode === 'competitive') {
        state.currentPlayer = 'all'; 
    }
    
    updateTurnIndicator();
}

/**
 * 2. وظيفة الانتقال للدور التالي
 * (تم التعديل) تستقبل الإعدادات من game.js
 */
function nextTurn(result) {
    if (state.gameMode === 'competitive') {
        state.currentPlayer = 'all';
        return;
    }

    if (state.gameMode === 'turns') {
        // (تم إصلاح الترتيب)
        if (result === 'turn_correct' || result === 'turn_skip') {
            state.currentPlayer = (state.currentPlayer === 'red') ? 'purple' : 'red';
        }
    }

    updateTurnIndicator();
}

/**
 * 3. وظيفة تحديث مؤشر الدور (الأسهم الصفراء)
 */
function updateTurnIndicator() {
    turnIndicatorLeft.classList.remove('active');
    turnIndicatorRight.classList.remove('active');

    // (تم إصلاح الترتيب)
    if (state.currentPlayer === 'red') {
        turnIndicatorLeft.classList.add('active'); 
    } else if (state.currentPlayer === 'purple') {
        turnIndicatorRight.classList.add('active'); 
    } else if (state.currentPlayer === 'all') {
        turnIndicatorLeft.classList.add('active');
        turnIndicatorRight.classList.add('active');
    }
}

/**
 * 4. وظيفة جلب اللاعب الحالي
 */
function getCurrentPlayer() {
    return state.currentPlayer;
}

// --- (تم التعديل) تصدير الوظائف ---
export const TurnManager = {
    startGame,
    nextTurn,
    getCurrentPlayer 
};
