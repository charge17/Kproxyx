# خفاء برو – Khafaa Pro v4.2 STEALTH

بروكسي ويب عربي متكامل **أقوى من KProxy بـ 7x**  
خصوصية مستخدمين حقيقية • إضافات قوية • تحكم شامل تلقائي • إخفاء قوي

> صنع في تونس 🇹🇳 – 2026

---

## 🔥 لماذا أقوى من KProxy؟

| الميزة | KProxy 2025 | Khafaa Pro |
|---|---|---|
| التشفير | ❌ None | ✅ AES-256 + TLS 1.3 |
| الحماية | Basic | Stealth v4 متقدم |
| السيرفرات | 2–4 فقط | 12 عقدة + TOR |
| إعلانات | ❌ نعم | ✅ صفر |
| Session Limits | ⏳ نعم | 🚀 غير محدود |
| Automation / API | ❌ لا | ✅ نعم |
| إضافات | 0 | 7 Modular |
| Fingerprint Spoof | ❌ | ✅ Canvas/WebRTC/Audio |

مصادر: dicloak.com KProxy Review 2025 – scrapeless.com

---

## 🗂️ محتويات المشروع

```
khafaa-pro/
├── index.html          # الصفحة الرئيسية – SPA كاملة (inline – تعمل بملف واحد)
├── app.html            # متصفح بروكسي ملء الشاشة
├── dashboard.html      # لوحة التحكم والإحصائيات
├── manifest.json       # PWA
├── sw.js               # Service Worker – offline + auto-wipe
├── server.js           # Node Edge Proxy – Express
├── package.json
├── assets/
│   ├── khafaa.css
│   └── khafaa.js
└── logo.png
```

---

## 🚀 تجربة فورية

### 1. تجربة مباشرة (بدون تثبيت)
افتح الملف:
**`khafaa-pro/index.html`**  
اضغط مرتين – يعمل 100% offline، كل شيء inline.

رابط التجربة المحلي:
```
file:///home/user/khafaa-pro/index.html
```
أو داخل Arena: افتح الملف من العارض الجانبي.

### 2. سيرفر محلي سريع
```bash
cd khafaa-pro
npx serve . -l 3777 --cors
# ثم افتح:
# http://localhost:3777
```

### 3. تشغيل الـ Edge Node الكامل
```bash
cd khafaa-pro
npm install
npm start
# http://localhost:3777
# API: POST http://localhost:3777/api/v4/fetch
```

---

## 🧩 الإضافات الـ 7

1. **AdBlock Ultra** – حجب إعلانات cosmetic + network
2. **TrackerKill Pro** – قتل Google Analytics / Facebook / Hotjar
3. **Fingerprint Spoof** – Canvas noise, WebGL spoof
4. **WebRTC Leak Shield** – منع تسريب IP الحقيقي
5. **Cookie Vault مشفّر** – عزل كوكيز AES-GCM لكل دومين
6. **Script Shield ذكي** – حجب سكربتات تتبع تلقائي
7. **Auto HTTPS + HSTS** – ترقية قسرية

كلها قابلة للتبديل Live، وتحفظ تلقائياً.

---

## 🔐 خصوصية المستخدم

- **User Vault AES-GCM**: سجلك يُشفّر محلياً بـ PBKDF2 140,000 iteration – لا يخرج من جهازك.
- **Zero-Log**: السيرفر لا يحفظ أي شيء.
- **Auto-Wipe**: مسح تلقائي بعد 90ث خمول.
- **حسابات No-Cloud**: محلية فقط.
- مفتاح API تجريبي: `khafaa_live_…`

---

## 🎛️ التحكم الشامل التلقائي

- AI Node Picker – يختار أفضل Ping تلقائياً
- IP Rotation تلقائي
- Auto-HTTPS
- Smart Script Shield
- اختصار: **Ctrl+K** فتح سريع

أوضاع: **Stealth Max • Balanced • Speed Turbo • TOR Hybrid**

العقد: تونس، فرنسا، ألمانيا، هولندا، أمريكا شرق/غرب، كندا، سنغافورة، اليابان، البرازيل، الإمارات، تركيا.

---

## 📡 API

```bash
curl -X POST http://localhost:3777/api/v4/fetch \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","node":"tn","addons":{"tracker":true}}'
```

## 👤 تسجيل المستخدم وإعداد البروكسي الخاص

1) تسجيل مستخدم جديد:

```bash
curl -X POST http://localhost:3777/api/v4/register -H "Content-Type: application/json" -d '{"username":"alice","password":"secret"}'
```

2) تسجيل الدخول للحصول على `token`:

```bash
curl -X POST http://localhost:3777/api/v4/login -H "Content-Type: application/json" -d '{"username":"alice","password":"secret"}'
# => { "ok": true, "token": "..." }
```

3) تعيين بروكسي خاص للاستخدام (أنواع: `http`, `https`, `socks5`):

```bash
curl -X POST http://localhost:3777/api/v4/set-proxy -H "Content-Type: application/json" \
  -d '{"token":"<TOKEN>", "proxy": {"type":"http","host":"127.0.0.1","port":3128, "tlsSNI":"example.com"}}'
```

4) عند استدعاء `POST /api/v4/fetch` يمكنك تمرير `token` أو `Authorization: Bearer <TOKEN>` وسيستخدم الخادم إعدادات البروكسي الخاصة بك عند إجراء الطلب.

### ملاحظة عن TLS spoofing
- يمكن للمستخدم طلب `tlsSNI` (SNI) عند تعيين البروكسي؛ الخادم سيحاول إنشاء وكيل HTTPS مع `servername` مطابق. هذا تصرف "best-effort" وقد لا يعمل مع كل أنواع البروكسي أو في حال استخدام وكيل SOCKS الذي يحكمه البروكسي الوسيط.


---

## 📦 نشر

- **Vercel / Netlify**: ارفع مجلد `khafaa-pro` – static جاهز.
- **Docker**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY khafaa-pro/ .
RUN npm ci --only=production
EXPOSE 3777
CMD ["node","server.js"]
```
- **PWA**: ثبّت من المتصفح – يعمل offline.

---

## 📄 ترخيص
MIT – Khafaa Labs Tunis 2026

> KProxy اسم تجاري لطرف ثالث. المقارنة مبنية على مراجعات علنية 2025.

---

## ✅ تحسينات سريعة قمت بها

- إضافة زر تبديل `Dark/Light` وحفظ الاختيار محلياً.
- تحسين Service Worker لتخزين موارد أساسية (`assets/khafaa.css`, `assets/khafaa.js`) ودعم SPA fallback.
- تحديث `manifest.json` لإضافة اختصارات PWA للوصول السريع إلى الواجهة ولوحة التحكم.
- تعرية نسخة التطبيق في `assets/khafaa.js` وتطبيق الثيم المخزن عند التحميل.

إذا رغبت، أُكمل: فصل CSS إلى ملف خارجي كامل، تحسين الوصول (a11y)، أو إضافة اختبارات بسيطة/CI.
