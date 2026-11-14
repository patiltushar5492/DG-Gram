const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDB, saveDB, otpStore, captchaStore, UPLOADS_DIR } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dg_gram_panchayat_secret_2026';

// Multer storage config for Drag-and-Drop Government GR PDF uploads & Citizen Proof Documents
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'DOC-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype === 'application/pdf' || ext === '.pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('केवळ PDF किंवा प्रतिमा फाईल्स अपलोड करण्यास अनुमती आहे'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files statically and publicly with explicit Cache-Control & headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'प्रवेश नाकारला: कृपया लॉगिन करा (Access token missing)' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'सत्र संपले आहे, कृपया पुन्हा लॉगिन करा (Invalid token)' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'केवळ ग्रामपंचायत प्रशासक / अधिकाऱ्यांना प्रवेश अनुमती आहे' });
    }
    next();
  });
}

// -------------------------------------------------------------
// 1. SECURITY & AUTHENTICATION (OTP & CAPTCHA)
// -------------------------------------------------------------

// Dynamic SVG Captcha
app.get('/api/auth/captcha', (req, res) => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const captchaId = 'cap_' + Math.random().toString(36).substring(2, 9);
  captchaStore.set(captchaId, {
    code: code.toUpperCase(),
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50">
      <rect width="100%" height="100%" fill="#f1f5f9" rx="6" />
      <line x1="10" y1="${10 + Math.random()*25}" x2="140" y2="${10 + Math.random()*25}" stroke="#94a3b8" stroke-width="2" />
      <line x1="10" y1="${10 + Math.random()*25}" x2="140" y2="${10 + Math.random()*25}" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="22" y="34" font-family="monospace, Courier" font-weight="900" font-size="26" letter-spacing="8" fill="#1e293b">
        ${code}
      </text>
    </svg>
  `.trim();

  res.json({
    success: true,
    captchaId,
    captchaSvg: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  });
});

// Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'मोबाईल क्रमांक किंवा ईमेल आवश्यक आहे' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  console.log(`[SECURE OTP DISPATCH] Identifier: ${identifier} -> OTP: ${otp}`);

  res.json({
    success: true,
    message: `ओटीपी यशस्वीरीत्या पाठवला आहे. (सुरक्षित पडताळणी कोड: ${otp})`,
    demoOtp: otp
  });
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { identifier, otp } = req.body;
  const stored = otpStore.get(identifier);

  if (!stored) {
    return res.status(400).json({ success: false, message: 'ओटीपी आढळला नाही किंवा कालबाह्य झाला आहे.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return res.status(400).json({ success: false, message: 'ओटीपी कालबाह्य झाला आहे.' });
  }

  if (stored.otp !== otp.trim()) {
    return res.status(400).json({ success: false, message: 'अवैध ओटीपी (Incorrect OTP).' });
  }

  otpStore.delete(identifier);
  res.json({ success: true, message: 'ओटीपी पडताळणी यशस्वी झाली!' });
});

// Citizen Registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, mobile, password, address } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ success: false, message: 'सर्व आवश्यक माहिती भरणे अनिवार्य आहे.' });
  }

  const db = getDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.mobile === mobile);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'हा ईमेल किंवा मोबाईल क्रमांक आधीच नोंदणीकृत आहे.' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    mobile: mobile.trim(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'citizen',
    address: address || 'गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, mobile: newUser.mobile },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'नोंदणी यशस्वी झाली! ग्रामपंचायत ई-गव्हर्नन्स पोर्टलवर आपले स्वागत आहे.',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      mobile: newUser.mobile,
      address: newUser.address
    }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password, captchaId, captchaCode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'ईमेल व पासवर्ड टाकणे आवश्यक आहे.' });
  }

  if (captchaId && captchaCode) {
    const storedCaptcha = captchaStore.get(captchaId);
    if (!storedCaptcha || storedCaptcha.code !== captchaCode.trim().toUpperCase()) {
      return res.status(400).json({ success: false, message: 'कॅप्चा कोड चुकीचा आहे. कृपया नवीन कॅप्चा टाका.' });
    }
    captchaStore.delete(captchaId);
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(400).json({ success: false, message: 'अवैध ईमेल किंवा पासवर्ड.' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, mobile: user.mobile },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'यशस्वीरीत्या लॉगिन झाले!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      address: user.address || ''
    }
  });
});

// Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'वापरकर्ता आढळला नाही' });

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      address: user.address || ''
    }
  });
});

// -------------------------------------------------------------
// 2. PUBLIC & CMS PORTAL ENDPOINTS
// -------------------------------------------------------------

// Village Profile & Informational Sections
app.get('/api/village-profile', (req, res) => {
  const db = getDB();
  res.json({ success: true, profile: db.villageProfile });
});

// Public Payment Settings / Official Bank Details
app.get('/api/payment-settings', (req, res) => {
  const db = getDB();
  res.json({ success: true, paymentSettings: db.paymentSettings });
});

// Dynamic Certificate Types (Public List for Citizen Applications)
app.get('/api/certificate-types', (req, res) => {
  const db = getDB();
  const list = (db.certificateTypes || []).filter(c => c.isActive !== false);
  res.json({ success: true, certificateTypes: list });
});

// Hero Slider
app.get('/api/hero-slides', (req, res) => {
  const db = getDB();
  res.json({ success: true, slides: db.heroSlides || [] });
});

// Ticker Notice
app.get('/api/ticker-notice', (req, res) => {
  const db = getDB();
  res.json({ success: true, ticker: db.tickerNotice || { enabled: true, text: "" } });
});

// Public Notices
app.get('/api/notices', (req, res) => {
  const db = getDB();
  res.json({ success: true, notices: db.notices || [] });
});

// Government GRs & Circulars
app.get('/api/government-grs', (req, res) => {
  const db = getDB();
  const { category, search } = req.query;
  let grs = db.governmentGRs || [];

  if (category && category !== 'all') {
    grs = grs.filter(g => g.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const s = search.toLowerCase();
    grs = grs.filter(g => 
      g.title.toLowerCase().includes(s) || 
      g.grNumber.toLowerCase().includes(s) ||
      g.department.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, grs });
});

// GR View / Download Endpoint (Handles both uploaded real PDFs & generated official HTML/PDF documents)
app.get('/api/government-grs/:id/download', (req, res) => {
  const db = getDB();
  const gr = (db.governmentGRs || []).find(g => g.id === req.params.id);

  if (!gr) {
    return res.status(404).json({ success: false, message: 'शासन निर्णय सापडला नाही.' });
  }

  // If this GR was uploaded as a PDF file
  if (gr.fileUrl && fs.existsSync(path.join(__dirname, gr.fileUrl.replace(/^\//, '')))) {
    return res.sendFile(path.join(__dirname, gr.fileUrl.replace(/^\//, '')));
  }

  // Otherwise render authentic printable official Maharashtra Government GR document
  const html = `
<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <title>${gr.grNumber} - महाराष्ट्र शासन निर्णय</title>
  <style>
    body { font-family: 'Times New Roman', serif, system-ui; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #111; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 25px; }
    .gr-no { font-weight: bold; font-size: 1.1em; color: #854d0e; }
    .meta { display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 20px; font-weight: bold; }
    .subject { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; font-weight: bold; font-size: 1.15em; margin: 20px 0; border-radius: 6px; }
    .summary { font-size: 1.05em; margin: 20px 0; text-align: justify; }
    .footer { margin-top: 50px; border-top: 1px dashed #666; padding-top: 20px; display: flex; justify-content: space-between; }
    .stamp { border: 2px dashed #991b1b; color: #991b1b; padding: 10px; border-radius: 50%; width: 110px; height: 110px; text-align: center; font-size: 0.75em; font-weight: bold; display: flex; flex-direction: column; justify-content: center; transform: rotate(-5deg); }
    @media print {
      body { margin: 0; padding: 15px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #b45309; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer;">
      🖨️ शासन निर्णय प्रिंट / सेव्ह करा (Print PDF)
    </button>
  </div>
  <div class="header">
    <div style="font-size: 14px; font-weight: bold;">महाराष्ट्र शासन (GOVERNMENT OF MAHARASHTRA)</div>
    <div style="font-size: 12px; color: #444;">${gr.department}</div>
    <div style="font-size: 18px; font-weight: 900; margin-top: 5px;">अधिकृत शासन निर्णय / परिपत्रक</div>
    <div class="gr-no">शासन निर्णय क्रमांक: ${gr.grNumber}</div>
  </div>
  <div class="meta">
    <div>वर्गवारी: ${gr.category}</div>
    <div>दिनांक: ${gr.date}</div>
    <div>स्थान: मंत्रालय, मुंबई</div>
  </div>
  <div class="subject">
    विषय: ${gr.title}
  </div>
  <div class="summary">
    <strong>प्रस्तावना व शासन निर्णय तपशील:</strong><br><br>
    ${gr.summary}
    <br><br>
    सदर शासन निर्णय ग्रामपंचायत गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव यांच्या अधिकृत ई-प्रशासन पोर्टलवर सार्वजनिक माहितीसाठी डिजिटल स्वरूपात प्रसिद्ध करण्यात आलेला आहे.
  </div>
  <div class="footer">
    <div class="stamp">
      <div>महाराष्ट्र शासन</div>
      <div style="font-size: 0.7em;">ग्राम विकास विभाग</div>
      <div>डिजिटल प्रत</div>
    </div>
    <div style="text-align: right;">
      <div style="font-style: italic; color: #1e3a8a; font-weight: bold;">(Digitally Verified Official Document)</div>
      <br>
      <strong>सहसचिव / उपसचिव</strong><br>
      ग्राम विकास व पंचायत राज विभाग,<br>
      मंत्रालय, मुंबई - ४०००३२
    </div>
  </div>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Development Works
app.get('/api/development-works', (req, res) => {
  const db = getDB();
  res.json({ success: true, works: db.developmentWorks || [] });
});

// -------------------------------------------------------------
// 3. CITIZEN SERVICES & APPLICATIONS
// -------------------------------------------------------------

// Apply for a Certificate - accepts multipart/form-data so actual files land in uploads/
// Fields: all text fields + files: aadhaarFile, residenceProofFile, optionalDocFile
app.post('/api/applications/apply', authenticateToken,
  upload.fields([
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'residenceProofFile', maxCount: 1 },
    { name: 'optionalDocFile', maxCount: 1 }
  ]),
  (req, res) => {
  // With multipart/form-data all text fields arrive on req.body, files on req.files
  const {
    applicantName,
    fatherOrHusbandName,
    mobile,
    email,
    aadhaarNumber,
    serviceType,
    serviceNameMr,
    purpose,
    address,
    residingSinceYears,
    documentsNote,
    paymentDetailsJson   // JSON-stringified payment object sent as a text field
  } = req.body;

  if (!applicantName || !serviceType || !purpose) {
    return res.status(400).json({ success: false, message: 'कृपया सर्व आवश्यक रकाने भरावेत.' });
  }

  const db = getDB();
  const certDef = (db.certificateTypes || []).find(c => c.id === serviceType);
  const feeAmount = certDef ? (certDef.feeAmount || 20) : 20;

  const count = (db.applications || []).length + 1;
  const trackingId = `GB-CERT-${new Date().getFullYear()}-${String(100 + count).padStart(4, '0')}`;
  const appId = `APP-${Date.now()}`;

  // Build the documents array from actual uploaded files.
  // If a file was not uploaded, we do NOT fall back to hardcoded samples — we record
  // only what was actually provided so the Admin sees an honest list.
  const applicationDocs = [];

  const files = req.files || {};

  if (files.aadhaarFile && files.aadhaarFile[0]) {
    const f = files.aadhaarFile[0];
    applicationDocs.push({
      name: 'आधार कार्ड (Aadhaar Card)',
      fileName: f.originalname,
      storedFileName: f.filename,
      fileUrl: `/uploads/${f.filename}`,
      type: 'identity_proof',
      uploadedAt: new Date().toISOString()
    });
  }

  if (files.residenceProofFile && files.residenceProofFile[0]) {
    const f = files.residenceProofFile[0];
    applicationDocs.push({
      name: 'रहिवासी पुरावा / घरपट्टी पावती',
      fileName: f.originalname,
      storedFileName: f.filename,
      fileUrl: `/uploads/${f.filename}`,
      type: 'residence_proof',
      uploadedAt: new Date().toISOString()
    });
  }

  if (files.optionalDocFile && files.optionalDocFile[0]) {
    const f = files.optionalDocFile[0];
    applicationDocs.push({
      name: 'इतर जोडपत्र / शपथपत्र',
      fileName: f.originalname,
      storedFileName: f.filename,
      fileUrl: `/uploads/${f.filename}`,
      type: 'other_proof',
      uploadedAt: new Date().toISOString()
    });
  }

  // Parse payment details (sent as JSON string in FormData text field)
  let paymentDetails = null;
  try { paymentDetails = JSON.parse(paymentDetailsJson); } catch (_) {}

  // If no files provided at all (e.g. API test without files) add placeholder entries
  // so Admin can at least see what was required. Mark them clearly as "not uploaded".
  if (applicationDocs.length === 0) {
    applicationDocs.push(
      {
        name: 'आधार कार्ड (Aadhaar Card)',
        fileName: '(अपलोड केले नाही)',
        storedFileName: null,
        fileUrl: null,
        type: 'identity_proof',
        uploadedAt: new Date().toISOString()
      },
      {
        name: 'रहिवासी पुरावा / घरपट्टी पावती',
        fileName: '(अपलोड केले नाही)',
        storedFileName: null,
        fileUrl: null,
        type: 'residence_proof',
        uploadedAt: new Date().toISOString()
      }
    );
  }

  const newApp = {
    id: appId,
    trackingId,
    userId: req.user.id,
    applicantName: applicantName.trim(),
    fatherOrHusbandName: fatherOrHusbandName || '',
    mobile: mobile || req.user.mobile,
    email: email || req.user.email,
    aadhaarNumber: aadhaarNumber || 'लागू नाही',
    serviceType,
    serviceNameMr: serviceNameMr || (certDef ? certDef.nameMr : 'शासकीय दाखला'),
    purpose,
    address: address || 'गाळण बुद्रुक, ता. पाचोरा',
    residingSinceYears: residingSinceYears || 10,
    documentsNote: documentsNote || 'संबंधित सर्व कागदपत्रे जोडली आहेत',
    documents: applicationDocs,
    payment: {
      status: paymentDetails ? 'SUCCESS' : 'PENDING',
      transactionId: paymentDetails?.transactionId || `TXN-${Date.now().toString().slice(-8)}`,
      upiRefId: paymentDetails?.upiRefId || `UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      amountPaid: paymentDetails?.amountPaid || feeAmount,
      paidAt: paymentDetails?.paidAt || new Date().toISOString(),
      paymentMethod: paymentDetails?.paymentMethod || 'UPI/Online'
    },
    status: 'pending',
    appliedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    remarks: '',
    certificateNumber: '',
    issueDate: '',
    feeAmount: feeAmount
  };

  db.applications.unshift(newApp);
  saveDB(db);

  res.json({
    success: true,
    message: 'आपला अर्ज व शुल्क यशस्वीरीत्या जमा झाले आहे. डिजिटल पावती खाली उपलब्ध आहे.',
    application: newApp,
    receipt: {
      receiptNo: `RCPT-${Date.now().toString().slice(-6)}`,
      trackingId,
      applicantName: newApp.applicantName,
      serviceNameMr: newApp.serviceNameMr,
      feeAmount: `₹ ${feeAmount}.०० (शासकीय शुल्क भरले)`,
      paymentStatus: 'PAID (यशस्वी)',
      transactionId: newApp.payment.transactionId,
      timestamp: newApp.appliedAt,
      authority: 'ग्रामपंचायत गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव'
    }
  });
});

// Upload citizen supporting proof document
app.post('/api/upload/document', authenticateToken, upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'कृपया फाईल निवडावी' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'कागदपत्र यशस्वीरीत्या अपलोड झाले',
    fileName: req.file.originalname,
    storedFileName: req.file.filename,
    fileUrl: fileUrl,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// Citizen's Own Applications
app.get('/api/applications/my', authenticateToken, (req, res) => {
  const db = getDB();
  const myApps = (db.applications || []).filter(a => a.userId === req.user.id);
  res.json({ success: true, applications: myApps });
});

// Public Track Application
app.get('/api/applications/track/:trackingId', (req, res) => {
  const db = getDB();
  const term = req.params.trackingId.trim().toLowerCase();
  const appItem = (db.applications || []).find(
    a => (a.trackingId && a.trackingId.toLowerCase() === term) || (a.id && a.id.toLowerCase() === term)
  );

  if (!appItem) {
    return res.status(404).json({ success: false, message: 'दिलेल्या ट्रॅकिंग आयडीनुसार अर्ज सापडला नाही.' });
  }

  res.json({ success: true, application: appItem });
});

// -------------------------------------------------------------
// 4. GRIEVANCE / COMPLAINTS
// -------------------------------------------------------------

// Submit Grievance
app.post('/api/grievances/submit', authenticateToken, (req, res) => {
  const { category, title, description, location } = req.body;

  if (!category || !title || !description) {
    return res.status(400).json({ success: false, message: 'तक्रारीची वर्गवारी, विषय व तपशील आवश्यक आहे.' });
  }

  const db = getDB();
  const count = (db.grievances || []).length + 1;
  const trackingId = `GB-GRV-${String(8000 + count)}`;
  const grvId = `GRV-${Date.now()}`;

  const newGrv = {
    id: grvId,
    trackingId,
    userId: req.user.id,
    citizenName: req.user.name,
    mobile: req.user.mobile,
    category,
    title: title.trim(),
    description: description.trim(),
    location: location || 'गाळण बुद्रुक',
    status: 'open',
    createdAt: new Date().toISOString(),
    resolution: '',
    resolvedAt: null
  };

  db.grievances.unshift(newGrv);
  saveDB(db);

  res.json({
    success: true,
    message: 'तक्रार यशस्वीरित्या नोंदवली गेली आहे. ट्रॅकिंग आयडी जतन करून ठेवा.',
    grievance: newGrv
  });
});

// Citizen's Own Grievances
app.get('/api/grievances/my', authenticateToken, (req, res) => {
  const db = getDB();
  const myGrvs = (db.grievances || []).filter(g => g.userId === req.user.id);
  res.json({ success: true, grievances: myGrvs });
});

// Public Track Grievance
app.get('/api/grievances/track/:trackingId', (req, res) => {
  const db = getDB();
  const term = req.params.trackingId.trim().toLowerCase();
  const grv = (db.grievances || []).find(
    g => (g.trackingId && g.trackingId.toLowerCase() === term) || (g.id && g.id.toLowerCase() === term)
  );

  if (!grv) {
    return res.status(404).json({ success: false, message: 'दिलेल्या तक्रार ट्रॅकिंग क्रमांकाचा कोणताही रेकॉर्ड सापडला नाही.' });
  }

  res.json({ success: true, grievance: grv });
});

// Universal Search (Tracks Application or Grievance)
app.get('/api/track/any/:trackingId', (req, res) => {
  const db = getDB();
  const term = req.params.trackingId.trim().toLowerCase();

  const appItem = (db.applications || []).find(
    a => (a.trackingId && a.trackingId.toLowerCase() === term) || (a.id && a.id.toLowerCase() === term)
  );

  if (appItem) {
    return res.json({ success: true, type: 'application', data: appItem });
  }

  const grvItem = (db.grievances || []).find(
    g => (g.trackingId && g.trackingId.toLowerCase() === term) || (g.id && g.id.toLowerCase() === term)
  );

  if (grvItem) {
    return res.json({ success: true, type: 'grievance', data: grvItem });
  }

  return res.status(404).json({
    success: false,
    message: 'दिलेल्या ट्रॅकिंग आयडीनुसार कोणताही दाखला अर्ज किंवा तक्रार सापडली नाही.'
  });
});

// -------------------------------------------------------------
// 5. LOCAL ADMIN DASHBOARD CONTROLS (CMS FOR ALL WEBSITE DATA)
// -------------------------------------------------------------

// Admin Dashboard Summary Metrics
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const db = getDB();
  const apps = db.applications || [];
  const grvs = db.grievances || [];
  const works = db.developmentWorks || [];
  const grs = db.governmentGRs || [];

  res.json({
    success: true,
    stats: {
      totalApplications: apps.length,
      pendingApplications: apps.filter(a => a.status === 'pending').length,
      approvedApplications: apps.filter(a => a.status === 'approved').length,
      rejectedApplications: apps.filter(a => a.status === 'rejected').length,
      totalGrievances: grvs.length,
      openGrievances: grvs.filter(g => g.status === 'open' || g.status === 'in_progress').length,
      resolvedGrievances: grvs.filter(g => g.status === 'resolved').length,
      developmentWorksCount: works.length,
      governmentGRsCount: grs.length
    }
  });
});

// --- MODULE 1: CMS CONTENT & STATISTICS CONTROLS ---
app.put('/api/admin/village-profile', requireAdmin, (req, res) => {
  const db = getDB();
  const { statistics, aboutSections, sarpanch, upsarpanch, gramsevak, officeHours, email, helpline } = req.body;

  if (statistics) {
    db.villageProfile.statistics = {
      ...db.villageProfile.statistics,
      ...statistics
    };
  }

  if (aboutSections) {
    db.villageProfile.aboutSections = {
      ...db.villageProfile.aboutSections,
      ...aboutSections
    };
  }

  if (sarpanch) {
    db.villageProfile.sarpanch = { ...db.villageProfile.sarpanch, ...sarpanch };
  }
  if (upsarpanch) {
    db.villageProfile.upsarpanch = { ...db.villageProfile.upsarpanch, ...upsarpanch };
  }
  if (gramsevak) {
    db.villageProfile.gramsevak = { ...db.villageProfile.gramsevak, ...gramsevak };
  }

  if (officeHours) db.villageProfile.officeHours = officeHours;
  if (email) db.villageProfile.email = email;
  if (helpline) db.villageProfile.helpline = helpline;

  saveDB(db);
  res.json({ success: true, message: 'गावाची माहिती व सांख्यिकी यशस्वीरीत्या अद्ययावत केली!', profile: db.villageProfile });
});

// --- MODULE 2: DYNAMIC CERTIFICATE TYPES MANAGEMENT ---
app.get('/api/admin/certificate-types', requireAdmin, (req, res) => {
  const db = getDB();
  res.json({ success: true, certificateTypes: db.certificateTypes || [] });
});

app.post('/api/admin/certificate-types', requireAdmin, (req, res) => {
  const { nameMr, desc, deliveryDays, feeAmount, requiredDocs } = req.body;
  if (!nameMr) {
    return res.status(400).json({ success: false, message: 'दाखल्याचे नाव अनिवार्य आहे.' });
  }

  const db = getDB();
  const newType = {
    id: 'cert_' + Date.now(),
    nameMr: nameMr.trim(),
    desc: desc || '',
    deliveryDays: deliveryDays || '२-३ दिवस',
    feeAmount: Number(feeAmount) || 20,
    fee: `₹ ${Number(feeAmount) || 20}.००`,
    requiredDocs: requiredDocs || 'आधार कार्ड, स्थानिक रहिवासी पुरावा',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  db.certificateTypes.push(newType);
  saveDB(db);

  res.json({ success: true, message: 'नवीन दाखला प्रकार यशस्वीरीत्या जोडला गेला!', certificateType: newType });
});

app.put('/api/admin/certificate-types/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const index = (db.certificateTypes || []).findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'दाखला प्रकार सापडला नाही.' });
  }

  const feeAmount = req.body.feeAmount !== undefined ? Number(req.body.feeAmount) : db.certificateTypes[index].feeAmount;

  db.certificateTypes[index] = {
    ...db.certificateTypes[index],
    ...req.body,
    feeAmount,
    fee: `₹ ${feeAmount}.००`
  };

  saveDB(db);
  res.json({ success: true, message: 'दाखला प्रकार अद्ययावत केला गेला!', certificateType: db.certificateTypes[index] });
});

app.delete('/api/admin/certificate-types/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.certificateTypes = (db.certificateTypes || []).filter(c => c.id !== id);
  saveDB(db);
  res.json({ success: true, message: 'दाखला प्रकार हटवला गेला.' });
});

// --- MODULE 3: BANK ACCOUNT & PAYMENT SETTINGS ---
app.put('/api/admin/payment-settings', requireAdmin, (req, res) => {
  const db = getDB();
  const { bankName, branchName, accountHolderName, accountNumber, ifscCode, upiId, taxReceiptNotice } = req.body;

  db.paymentSettings = {
    bankName: bankName || db.paymentSettings.bankName,
    branchName: branchName || db.paymentSettings.branchName,
    accountHolderName: accountHolderName || db.paymentSettings.accountHolderName,
    accountNumber: accountNumber || db.paymentSettings.accountNumber,
    ifscCode: ifscCode || db.paymentSettings.ifscCode,
    upiId: upiId || db.paymentSettings.upiId,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(upiId || db.paymentSettings.upiId)}&pn=Grampanchayat%20Galan%20Budruk`,
    taxReceiptNotice: taxReceiptNotice || db.paymentSettings.taxReceiptNotice,
    updatedAt: new Date().toISOString()
  };

  saveDB(db);
  res.json({ success: true, message: 'ग्रामपंचायत बँक खाते व देयक तपशील जतन केले!', paymentSettings: db.paymentSettings });
});

// --- MODULE 4: DRAG-AND-DROP GOVERNMENT GR UPLOAD ---
app.post('/api/admin/government-grs/upload', requireAdmin, upload.single('file'), (req, res) => {
  const { grNumber, title, department, date, category, summary } = req.body;

  if (!grNumber || !title) {
    return res.status(400).json({ success: false, message: 'जीआर क्रमांक व विषय अनिवार्य आहे.' });
  }

  let fileUrl = null;
  let fileSize = '1.5 MB';

  if (req.file) {
    fileUrl = `/uploads/${req.file.filename}`;
    fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
  }

  const db = getDB();
  const newGR = {
    id: 'gr_' + Date.now(),
    grNumber: grNumber.trim(),
    title: title.trim(),
    department: department || 'ग्राम विकास विभाग, महाराष्ट्र शासन',
    date: date || new Date().toISOString().split('T')[0],
    category: category || 'शासन निर्णय',
    summary: summary || '',
    fileSize,
    fileUrl
  };

  db.governmentGRs.unshift(newGR);
  saveDB(db);

  res.json({ success: true, message: 'अधिकृत शासन निर्णय / जीआर PDF यशस्वीरीत्या प्रसिद्ध केला!', gr: newGR });
});

app.delete('/api/admin/government-grs/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const gr = (db.governmentGRs || []).find(g => g.id === id);

  if (gr && gr.fileUrl) {
    const filePath = path.join(__dirname, gr.fileUrl.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) { console.error('Could not delete file:', e); }
    }
  }

  db.governmentGRs = (db.governmentGRs || []).filter(g => g.id !== id);
  saveDB(db);
  res.json({ success: true, message: 'शासन निर्णय हटवला गेला.' });
});

// --- MODULE 5: APPLICATIONS & GRIEVANCE MANAGEMENT ---
app.get('/api/admin/applications', requireAdmin, (req, res) => {
  const db = getDB();
  res.json({ success: true, applications: db.applications || [] });
});

app.put('/api/admin/applications/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  const db = getDB();
  const appIndex = db.applications.findIndex(a => a.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ success: false, message: 'अर्ज सापडला नाही' });
  }

  const appItem = db.applications[appIndex];
  appItem.status = status;
  appItem.remarks = remarks || (status === 'approved' ? 'सदर अर्ज मंजूर करण्यात आला आहे.' : 'अपूर्ण कागदपत्रांमुळे नामंजूर.');
  appItem.reviewedAt = new Date().toISOString();
  appItem.reviewedBy = req.user.name || 'ग्रामसेवक / सरपंच';

  if (status === 'approved' && !appItem.certificateNumber) {
    const certYear = new Date().getFullYear();
    const randomCertNum = Math.floor(1000 + Math.random() * 9000);
    appItem.certificateNumber = `GB/MAHA/${certYear}/RC-${randomCertNum}`;
    appItem.issueDate = new Date().toISOString().split('T')[0];
  }

  db.applications[appIndex] = appItem;
  saveDB(db);

  res.json({ success: true, message: `अर्जाचा दर्जा '${status === 'approved' ? 'मंजूर' : 'नामंजूर'}' असा अद्ययावत केला आहे.`, application: appItem });
});

app.get('/api/admin/grievances', requireAdmin, (req, res) => {
  const db = getDB();
  res.json({ success: true, grievances: db.grievances || [] });
});

app.put('/api/admin/grievances/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;

  const db = getDB();
  const grvIndex = db.grievances.findIndex(g => g.id === id);

  if (grvIndex === -1) {
    return res.status(404).json({ success: false, message: 'तक्रार आढळली नाही' });
  }

  db.grievances[grvIndex].status = status;
  if (resolution) db.grievances[grvIndex].resolution = resolution;
  if (status === 'resolved') {
    db.grievances[grvIndex].resolvedAt = new Date().toISOString();
  }

  saveDB(db);
  res.json({ success: true, message: 'तक्रारीचा दर्जा अद्ययावत केला गेला.', grievance: db.grievances[grvIndex] });
});

// --- HERO SLIDES & TICKER ---
app.get('/api/admin/hero-slides', requireAdmin, (req, res) => {
  const db = getDB();
  res.json({ success: true, slides: db.heroSlides || [] });
});

app.post('/api/admin/hero-slides', requireAdmin, (req, res) => {
  const { title, subtitle, description, badge, date, bgImage, buttonText, buttonLink } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'शीर्षक आवश्यक आहे.' });

  const db = getDB();
  const newSlide = {
    id: 'slide_' + Date.now(),
    badge: badge || 'ग्रामपंचायत सूचना',
    title,
    subtitle: subtitle || '',
    description: description || '',
    date: date || '२०२६',
    bgImage: bgImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
    buttonText: buttonText || 'अधिक माहिती',
    buttonLink: buttonLink || '/',
    order: (db.heroSlides || []).length + 1
  };

  db.heroSlides.push(newSlide);
  saveDB(db);

  res.json({ success: true, message: 'नवीन हिरो बॅनर स्लाइड यशस्वीपणे जोडली!', slide: newSlide });
});

app.delete('/api/admin/hero-slides/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.heroSlides = (db.heroSlides || []).filter(s => s.id !== id);
  saveDB(db);
  res.json({ success: true, message: 'स्लाइड यशस्वीपणे हटवली.' });
});

app.put('/api/admin/ticker-notice', requireAdmin, (req, res) => {
  const { text, enabled } = req.body;
  const db = getDB();

  db.tickerNotice = {
    enabled: enabled !== undefined ? enabled : true,
    text: text || '',
    updatedAt: new Date().toISOString()
  };
  saveDB(db);

  res.json({ success: true, message: 'स्क्रोलिंग सूचना पट्टी तात्काळ अद्ययावत केली!', ticker: db.tickerNotice });
});

// --- DEVELOPMENT WORKS ---
app.post('/api/admin/development-works', requireAdmin, (req, res) => {
  const { title, category, budget, spent, progress, status, fundingSource, contractor, startDate, targetDate, location } = req.body;

  if (!title || !budget) {
    return res.status(400).json({ success: false, message: 'कामाचे नाव व अंदाजपत्रकीय रक्कम आवश्यक आहे.' });
  }

  const db = getDB();
  const newWork = {
    id: 'dev_' + Date.now(),
    title,
    category: category || 'पायाभूत सुविधा',
    budget,
    spent: spent || '₹०',
    progress: Number(progress) || 0,
    status: status || 'चालू काम (In Progress)',
    fundingSource: fundingSource || 'ग्रामपंचायत स्वनिधी',
    contractor: contractor || 'स्थानिक मजूर संस्था',
    startDate: startDate || new Date().toISOString().split('T')[0],
    targetDate: targetDate || '२०२६-२७',
    location: location || 'गाळण बुद्रुक'
  };

  db.developmentWorks.unshift(newWork);
  saveDB(db);

  res.json({ success: true, message: 'नवीन विकास काम यशस्वीरीत्या नोंदवले गेले!', work: newWork });
});

app.delete('/api/admin/development-works/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.developmentWorks = (db.developmentWorks || []).filter(w => w.id !== id);
  saveDB(db);
  res.json({ success: true, message: 'विकास काम हटवले गेले.' });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  res.status(500).json({ success: false, message: err.message || 'सर्व्हर अंतर्गत त्रुटी उद्भवली आहे.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🏛️ Gram Panchayat Gadan Budruk Server Running on Port ${PORT}`);
  console.log(`👉 Default Admin: admin@grampanchayat.gov.in / Admin@123`);
  console.log(`================================================================`);
});
