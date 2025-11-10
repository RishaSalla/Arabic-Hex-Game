// --- العناصر (Elements) ---
const mainMenuScreen = document.getElementById('main-menu-screen');
const gameScreen = document.getElementById('game-screen');

const settingButtons = document.querySelectorAll('.setting-button');
const startGameButton = document.getElementById('start-game-button');

// --- إعدادات اللعبة (Game Settings) ---
// هذه هي الإعدادات الافتراض
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
    const clickedButton = event.target;
    const settingType = clickedButton.dataset.setting; // 'mode', 'teams', or 'timer'
    const settingValue = clickedButton.dataset.value;  // 'turns', 'competitive', etc.

    // 1. تحديث كائن الإعدادات
    gameSettings[settingType] = settingValue;
    console.log('الإعدادات المحدثة:', gameSettings);

    // 2. تحديث الواجهة (إزالة 'active' من الزر القديم وإضافته للجديد)
    // أولاً، نجد جميع الأزرار لنفس هذا الإعداد
    const buttonsInGroup = document.querySelectorAll(`.setting-button[data-setting="${settingType}"]`);
    
    // نزيل 'active' من جميع الأزرار في هذه المجموعة
    buttonsInGroup.forEach(btn => btn.classList.remove('active'));
    
    // نضيف 'active' للزر الذي تم الضغط عليه فقط
    clickedButton.classList.add('active');
}

/**
 * 2. وظيفة بدء اللعبة (الانتقال للشاشة التالية)
 */
function startGame() {
    // 1. إخفاء القائمة الرئيسية
    mainMenuScreen.classList.remove('active');

    // 2. إظهار شاشة اللعبة
    gameScreen.classList.add('active');

    // 3. (مستقبلاً) استدعاء وظيفة بناء لوحة اللعب
    // initializeGameBoard(); // <-- سنبني هذه في الخطوة التالية
}

// --- ربط الأحداث (Event Listeners) ---

// 1. ربط جميع أزرار الإعدادات بوظيفة 'handleSettingClick'
settingButtons.forEach(button => {
    button.addEventListener('click', handleSettingClick);
});

// 2. ربط زر "ابدأ اللعبة"
startGameButton.addEventListener('click', startGame);
