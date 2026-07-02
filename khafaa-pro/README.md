# خفاء برو – Khafaa Pro v4.2 STEALTH

بروكسي ويب عربي متكامل **أقوى من KProxy بـ 7x**  
خصوصية مستخدمين حقيقية • إضافات قوية • تحكم شامل تلقائي • إخفاء قوي

> صنع في تونس 🇹🇳 – 2026

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourname/khafaa-pro&project-name=khafaa-pro&repository-name=khafaa-pro&env=NODE_ENV&envDescription=Khafaa%20Pro%20production&envLink=https://github.com/yourname/khafaa-pro)

**Vercel Ready – Edge Functions in 5 regions**

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

### ⭐ Vercel – نقرة واحدة (موصى به)
1-click deploy:
```
https://vercel.com/new/clone?repository-url=https://github.com/yourname/khafaa-pro
```
أو:
```bash
npm i -g vercel
cd khafaa-pro
vercel --prod
```
ستحصل على:
- `https://khafaa-pro.vercel.app` – واجهة كاملة
- `https://khafaa-pro.vercel.app/api/fetch` – Edge Proxy
- `https://khafaa-pro.vercel.app/api/health` – health check
- Edge regions: Paris (cdg1), Frankfurt (fra1), Washington (iad1), Tokyo (hnd1), Singapore (sin1)

### 1. تجربة مباشرة (بدون تثبيت)
افتح الملف:
**`khafaa-pro/index.html`**  
اضغط مرتين – يعمل 100% offline، كل شيء inline.

رابط التجربة المحلي:
```
file:///home/user/khafaa-pro/index.html
```

### 2. سيرفر محلي سريع
```bash
cd khafaa-pro
npx serve . -l 3777 --cors
# http://localhost:3777
# أو: vercel dev
```

### 3. تشغيل الـ Edge Node الكامل محلياً
```bash
cd khafaa-pro
npm install
npm start
# http://localhost:3777
# API: POST /api/v4/fetch
# Vercel Edge: POST /api/fetch
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
