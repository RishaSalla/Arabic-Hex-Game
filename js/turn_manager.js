// --- (جديد) استيراد الإعدادات من game.js ---
// نعم، هذا ملف يستورد من ملف آخر، والملف الآخر سيستورد منه
// وهذا ممكن وطبيعي في (ES Modules)
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
 * (يتم استدعاؤها بواسطة game.js عند بدء اللعبة)
 */
function startGame() {
    // تحديد من سيبدأ
    // دعنا نجعل الفريق البنفسجي (الأيسر) يبدأ دائماً
    state.currentPlayer = 'purple';

    // التحقق من نوع اللعبة (بناءً على اختيار المستخدم)
    if (gameSettings.mode === 'competitive') {
        state.currentPlayer = 'all'; // "تنافسي" يعني الدور للجميع
    }
    
    updateTurnIndicator();
}

/**
 * 2. وظيفة الانتقال للدور التالي
 * (يتم استدعاؤها بواسطة game.js بعد إغلاق نافذة السؤال)
 */
function nextTurn(result) {
    // في الوضع التنافسي، الدور لا يتغير أبداً
    if (gameSettings.mode === 'competitive') {
        state.currentPlayer = 'all';
        return;
    }

    // في وضع "الأدوار"
    // بناءً على اتفاقنا: أي نتيجة (فوز بالخلية أو "تخطي")
    // تعتبر "دوراً ضائعاً" أو "دوراً ملعوباً" وتنهي الدور الحالي.
    if (gameSettings.mode === 'turns') {
        state.currentPlayer = (state.currentPlayer === 'purple') ? 'red' : 'purple';
    }

    updateTurnIndicator();
}

/**
 * 3. وظيفة تحديث مؤشر الدور (الأسهم الصفراء)
 */
function updateTurnIndicator() {
    // 1. إطفاء كلا المؤشرين
    turnIndicatorLeft.classList.remove('active');
    turnIndicatorRight.classList.remove('active');

    // 2. تشغيل المؤشر الصحيح
    if (state.currentPlayer === 'purple') {
        turnIndicatorLeft.classList.add('active'); // إضاءة السهم الأيسر
    } else if (state.currentPlayer === 'red') {
        turnIndicatorRight.classList.add('active'); // إضاءة السهم الأيمن
    } else if (state.currentPlayer === 'all') {
        // (كما اتفقنا) في الوضع التنافسي، كلاهما يعمل
        turnIndicatorLeft.classList.add('active');
        turnIndicatorRight.classList.add('active');
    }
}

// --- (جديد) تصدير الوظائف ---
// نجعل هذه الوظائف متاحة للاستخدام في ملف game.js
export const TurnManager = {
    startGame,
    nextTurn
};
