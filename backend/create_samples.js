const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function makePDF(title, subtitle, filename) {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length 380 >>
stream
BT
/F1 22 Tf
50 780 Td
(${title}) Tj
/F1 14 Tf
0 -40 Td
(${subtitle}) Tj
/F1 11 Tf
0 -30 Td
(Official Citizen Document Verification - DG Gram Panchayat) Tj
0 -20 Td
(Issued for: Gram Panchayat Galan Budruk, Taluka Pachora, Dist Jalgaon) Tj
0 -20 Td
(Status: Digitally Verified and Validated for Government Scrutiny) Tj
0 -40 Td
(Document File: ${filename}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000117 00000 n
0000000251 00000 n
0000000330 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
750
%%EOF`;

  fs.writeFileSync(path.join(uploadsDir, filename), content);
  console.log('Created: ' + filename);
}

makePDF('AADHAAR CARD VERIFICATION COPY', 'Citizen Identity Proof - Govt of India', 'sample_aadhaar.pdf');
makePDF('VILLAGE TAX & RESIDENCE PROOF', 'House Tax Receipt - Gram Panchayat Galan Budruk', 'sample_tax_receipt.pdf');
