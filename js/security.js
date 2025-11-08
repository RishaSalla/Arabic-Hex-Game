// js/security.js

// تحديد وظيفة startGame التي سيتم تعريفها لاحقًا في game.js
let startGame;

// دالة لجلب إعدادات اللعبة من ملف config.json
async function loadConfig() {
    try {
        // نعتمد على أن المشروع يعمل عبر خادم محلي لضمان قراءة ملفات JSON
        const response = await fetch('data/config.json');
        if (!response.ok) {
            console.error("Critical Error: config.json failed to load with status:", response.status);
            alert("فشل تحميل ملف الإعدادات. تأكد من تشغيل المشروع على خادم محلي.");
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Critical Error fetching config.json:", error);
        alert("خطأ أثناء قراءة ملف الإعدادات. تأكد من وجوده في data/config.json");
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
    
    // إظهار شاشة الحماية
    container.style.display = 'flex';
    
    // إضافة تصميم الواجهة لشاشة الحماية (التي تركناها فارغة في index.html)
    // لتجنب التشعب، سنضيف هنا الـ CSS الخاص بتصميم الأزرار والحقول:
    input.style.cssText = `padding: 12px 20px; font-size: 1.2em; margin: 10px; border: none; border-radius: 8px; text-align: center; background-color: #333; color: #eee; border: 2px solid #555;`;
    button.style.cssText = `padding: 12px 20px; font-size: 1.2em; margin: 10px; border: none; border-radius: 8px; cursor: pointer; background-color: #198754; color: white; transition: background-color 0.2s;`;
    container.querySelector('h1').style.cssText = 'font-size: 2em; margin-bottom: 20px;';


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
