// js/security.js

// تحديد وظيفة startGame التي سيتم تعريفها لاحقًا في game.js
let startGame;

// دالة لجلب إعدادات اللعبة من ملف config.json
async function loadConfig() {
    try {
        const response = await fetch('data/config.json');
        if (!response.ok) {
            // هذا يحدث إذا لم يكن الملف موجودًا بعد، نستخدم إعدادات افتراضية
            console.warn("config.json not found. Using default test code.");
            return { security: { test_code: "11111111" } };
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading config.json:", error);
        return { security: { test_code: "11111111" } };
    }
}

// دالة التحقق وعرض الشاشة
async function handleSecurity() {
    const config = await loadConfig();
    const correctCode = config.security.test_code;

    const container = document.getElementById('code-entry-container');
    const input = document.getElementById('secret-code-input');
    const button = document.getElementById('code-entry-button');
    const message = document.getElementById('code-entry-message');
    
    // إظهار شاشة الحماية
    container.style.display = 'flex';

    button.onclick = () => {
        if (input.value === correctCode) {
            container.style.display = 'none'; // إخفاء شاشة الكود
            startGame(config); // بدء اللعبة مع تمرير الإعدادات
        } else {
            message.textContent = 'الكود خاطئ. حاول مرة أخرى.';
            input.value = '';
        }
    };
}

// البدء بعملية التحقق فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', handleSecurity);
