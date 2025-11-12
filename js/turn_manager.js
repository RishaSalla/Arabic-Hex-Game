// --- (جديد) استيراد الإعدادات من game.js ---
import { gameSettings } from './game.js';

// --- العناصر (Elements) ---
const turnIndicatorLeft = document.getElementById('turn-indicator-left');
const turnIndicatorRight = document.getElementById('turn-indicator-right');

// --- حالة المدير (Manager State) ---
const state = {
    currentPlayer: 'purple' // من سيبدأ اللعبة
};

/**
 * 1. وظيفة بدء إدارة الأدوار
 */
function startGame() {
    state.currentPlayer = 'purple';

    if (gameSettings.mode === 'competitive') {
        state.currentPlayer = 'all'; 
    }
    
    updateTurnIndicator();
}

/**
 * 2. وظيفة الانتقال للدور التالي
 */
function nextTurn(result) {
    if (gameSettings.mode === 'competitive') {
        state.currentPlayer = 'all';
        return;
    }

    if (gameSettings.mode === 'turns') {
        // (تم التعديل) ينتقل الدور فقط إذا كانت النتيجة من وضع الأدوار
        if (result === 'turn_correct' || result === 'turn_skip') {
            state.currentPlayer = (state.currentPlayer === 'purple') ? 'red' : 'purple';
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

    if (state.currentPlayer === 'purple') {
        turnIndicatorLeft.classList.add('active'); 
    } else if (state.currentPlayer === 'red') {
        turnIndicatorRight.classList.add('active'); 
    } else if (state.currentPlayer === 'all') {
        turnIndicatorLeft.classList.add('active');
        turnIndicatorRight.classList.add('active');
    }
}

/**
 * 4. (جديد) وظيفة جلب اللاعب الحالي
 * (ليعرف game.js أي لون يمنحه للخلية في وضع الأدوار)
 */
function getCurrentPlayer() {
    return state.currentPlayer;
}

// --- (تم التعديل) تصدير الوظائف ---
// (تمت إضافة getCurrentPlayer)
export const TurnManager = {
    startGame,
    nextTurn,
    getCurrentPlayer 
};
