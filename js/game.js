// js/game.js

// تعريف المتغيرات العامة اللازمة لاستدعائها من ملفات أخرى
let globalGameConfig = {};
let gameInstance = null;
let currentScene = null;

// تعريف دالة startGame التي يتم استدعاؤها من security.js بعد التحقق من الكود
startGame = function(config) {
    globalGameConfig = config; // حفظ الإعدادات التي تم قراءتها من config.json

    const phaserConfig = {
        type: Phaser.AUTO,
        width: 1280,       // عرض الشاشة المبدئي
        height: 720,       // طول الشاشة المبدئي
        parent: 'game-container', // يمكننا لاحقًا ربطها بـ DIV محدد
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        render: {
            pixelArt: true // **مهم جداً:** لضمان وضوح تصميم البكسل آرت
        },
        scale: {
            mode: Phaser.Scale.FIT, // لتعديل حجم اللعبة حسب حجم شاشة المتصفح
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };

    gameInstance = new Phaser.Game(phaserConfig);
    console.log("Phaser Game Instance Created. Ready for Preload.");
};

// ===================================================
// وظائف دورة حياة Phaser
// ===================================================

function preload() {
    // حفظ المشهد الحالي للوصول إليه من أي مكان
    currentScene = this; 
    
    // تحميل الخلفية
    this.load.image('background', 'assets/images/background.png');
    
    // تحميل ملفات الصوت الأساسية (كما اتفقنا)
    this.load.audio('ui_click', 'assets/audio/ui_click.mp3');
    this.load.audio('winning', 'assets/audio/Winning.mp3');
    // ... يمكننا إضافة باقي الأصوات لاحقاً
    
    // تحميل أصول الخلايا السداسية (Hex Cells)
    this.load.image('hex_cell_default', 'assets/images/hex_cell_default.png');
    this.load.image('hex_cell_team1', 'assets/images/hex_cell_team1.png'); // الأحمر
    this.load.image('hex_cell_team2', 'assets/images/hex_cell_team2.png'); // الأرجواني

    // ملاحظة: الخطوط العربية (Cairo) يتم تحميلها عبر index.html
}

function create() {
    // 1. تثبيت الأبعاد النهائية للشاشة (إذا أردت حجم 1920x1080)
    this.game.scale.resize(1280, 720); // نستخدم أبعاد 720p كحد أقصى مريح للويب

    // 2. وضع الخلفية أولاً
    // وضع الصورة في المنتصف وتعديل حجمها لتناسب الشاشة
    const centerX = this.game.config.width / 2;
    const centerY = this.game.config.height / 2;
    
    this.add.image(centerX, centerY, 'background').setDisplaySize(this.game.config.width, this.game.config.height);

    // هنا سنبدأ ببناء واجهة المستخدم (Scoreboard) والشبكة السداسية لاحقاً
    console.log("Game Created. Background Loaded.");
}

function update() {
    // تُستخدم للحركة والتحقق المستمر إذا لزم الأمر
}
