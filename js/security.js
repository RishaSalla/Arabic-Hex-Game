// --- العناصر (Elements) ---
const securityScreen = document.getElementById('security-screen');
const mainMenuScreen = document.getElementById('main-menu-screen');

const codeInput = document.getElementById('game-code-input');
const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('login-error-message');

// --- المتغيرات (Variables) ---
let validCodes = []; // سنقوم بملئها من ملف config

// --- الوظائف (Functions) ---

/**
 * 1. جلب الأكواد الصحيحة من ملف config.json
 */
async function fetchValidCodes() {
    try {
        const response = await fetch('data/config.json');
        if (!response.ok) {
            throw new Error('لا يمكن تحميل ملف الإعدادات.');
        }
        const config = await response.json();
        validCodes = config.valid_codes;
    } catch (error) {
        console.error('خطأ في جلب الأكواد:', error);
        errorMessage.textContent = 'حدث خطأ. الرجاء تحديث الصفحة.';
    }
}

/**
 * 2. التحقق من الكود المدخل
 */
function checkLoginCode() {
    const enteredCode = codeInput.value;

    // التحقق مما إذا كان الكود المدخل موجوداً في قائمة الأكواد الصحيحة
    if (validCodes.includes(enteredCode)) {
        // نجح!
        console.log('الدخول ناجح!');
        errorMessage.textContent = '';
        goToMainMenu();
    } else {
        // فشل!
        errorMessage.textContent = 'الكود غير صحيح. حاول مرة أخرى.';
        // إضافة اهتزاز للشاشة كـ feedback
        securityScreen.classList.add('shake-animation');
        // إزالة الكلاس بعد انتهاء الأنيميشن للسماح بتكراره
        setTimeout(() => {
            securityScreen.classList.remove('shake-animation');
        }, 500); // 0.5 ثانية
    }
}

/**
 * 3. الانتقال إلى القائمة الرئيسية
 */
function goToMainMenu() {
    securityScreen.classList.remove('active'); // إخفاء شاشة الدخول
    mainMenuScreen.classList.add('active'); // إظهار القائمة الرئيسية
}

// --- ربط الأحداث (Event Listeners) ---

// 1. عند الضغط على زر "دخول"
loginButton.addEventListener('click', checkLoginCode);

// 2. (اختياري) السماح بالضغط على "Enter" لتسجيل الدخول
codeInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkLoginCode();
    }
});

// 3. عند تحميل الصفحة، قم بجلب الأكواد أولاً
document.addEventListener('DOMContentLoaded', fetchValidCodes);
