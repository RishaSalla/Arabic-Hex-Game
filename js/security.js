// js/security.js - الكود 15ب (المنقح)

// تحديد وظيفة startGame التي سيتم تعريفها لاحقًا في game.js
let startGame;

// دالة لجلب إعدادات اللعبة من ملف config.json
async function loadConfig() {
    try {
        // نعتمد على أن المشروع يعمل على GitHub Pages لضمان قراءة ملفات JSON
        const response = await fetch('data/config.json');
        if (!response.ok) {
            console.error("Critical Error: config.json failed to load with status:", response.status);
            alert("فشل تحميل ملف الإعدادات. تأكد من وجوده في data/config.json.");
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Critical Error fetching config.json:", error);
        alert("خطأ أثناء قراءة ملف الإعدادات.");
        return null;
    }
}

// دالة التحقق وعرض الشاشة
async function handleSecurity() {
    const config = await loadConfig();

    if (!config) {
        // إذا فشل تحميل الإعدادات، نوقف العملية
        return; 
    }
    
    // استخدام الكود السري من ملف الإعدادات
    const correctCode = config.security.test_code;

    const container = document.getElementById('code-entry-container');
    const input = document.getElementById('secret-code-input');
    const button = document.getElementById('code-entry-button');
    const message = document.getElementById('code-entry-message');
    
    // ===================================================
    // إظهار شاشة الحماية (الآن فقط نغير الـ Display)
    // التصميم بالكامل تم نقله إلى ملف index.html
    // ===================================================
    container.style.display = 'flex';
    
    button.onclick = () => {
        if (input.value === correctCode) {
            container.remove(); // إزالة الحاوية بالكامل من الـ DOM
            startGame(config); // بدء اللعبة مع تمرير الإعدادات
        } else {
            message.textContent = 'الكود خاطئ. حاول مرة أخرى.';
            input.value = '';
        }
    };
}

// البدء بعملية التحقق فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', handleSecurity);
