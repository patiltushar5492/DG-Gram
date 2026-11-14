# Gram Panchayat Gadan Budruk - Digital Governance Portal
## (ग्रामपंचायत गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव - डिजिटल ई-प्रशासन प्रणाली)

A full-stack, secure, human-friendly digital governance portal designed for rural governance under Maharashtra Government and Digital India standards.

---

### 🏛️ Features Included:

1. **Advanced Security & Authentication:**
   - Citizen Registration with functional Mobile OTP verification.
   - Login page fortified with visual distorted Captcha code.
   - Default Administrator Credentials:
     - **Email:** `admin@grampanchayat.gov.in`
     - **Password:** `Admin@123`
   - Default Citizen Credentials (for instant testing):
     - **Email:** `citizen@example.com`
     - **Password:** `Citizen@123`

2. **Dedicated Government GRs & Circulars Section (शासन निर्णय व जीआर):**
   - High-priority dedicated tab in navigation.
   - Comprehensive repository of state-level Rural Development Department GRs, 15th Finance Commission orders, Jal Jeevan Mission directives, and Zilla Parishad Jalgaon notices with category filters and search.

3. **Dynamic Local Admin Dashboard (Sarpanch / Gramsevak Console):**
   - **Hero Slider & Notice Ticker Control:** Live editing, adding, or deleting banner slides and the urgent scrolling ticker notice from the admin panel with immediate public homepage updates.
   - **Service & Grievance Management:** Application reviewing, approval with automatic certificate number generation, rejection, and grievance redressal tracking.
   - **Development Works:** Add, track, and manage physical infrastructure projects (funds, contractor, progress %).

4. **Authentic Government-Style Receipts & Official Printable Certificates (Marathi):**
   - **Digital Transaction Receipt:** Issued with tracking ID, timestamp, fee details, and official seal.
   - **Official Printable Certificate (रहिवासी दाखला / दाखले):** Authentic Ashok Pillar / Maharashtra Government styling, formatted legal Marathi body, QR code hash verification block, Sarpanch and Gramsevak signature blocks, fully optimized for `@media print` browser printing.

---

### 🚀 Running the Project

#### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm start
```

#### 2. Start the Frontend (Vite + React) (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`
