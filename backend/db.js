const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure uploads directory exists for drag-and-drop PDFs
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, 'database.json');

// Initial default database structure with authentic Gadan Budruk village information
const defaultData = {
  users: [
    {
      id: "usr_admin_001",
      name: "ग्रामविकास प्रशासक (Admin)",
      email: "admin@grampanchayat.gov.in",
      mobile: "9823000000",
      passwordHash: bcrypt.hashSync("Admin@123", 10),
      role: "admin",
      createdAt: "2026-01-01T10:00:00.000Z"
    },
    {
      id: "usr_citizen_001",
      name: "राजेंद्र सोपान पाटील",
      email: "citizen@example.com",
      mobile: "9422000000",
      passwordHash: bcrypt.hashSync("Citizen@123", 10),
      role: "citizen",
      address: "गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव",
      createdAt: "2026-02-15T10:00:00.000Z"
    }
  ],
  heroSlides: [
    {
      id: "slide_1",
      badge: "आपले स्वागत आहे! (Welcome)",
      title: "ग्रामपंचायत गाळण बुद्रुक डिजिटल पोर्टल",
      subtitle: "पारदर्शक कारभार, गतिमान सेवा आणि आधुनिक ग्रामविकास",
      description: "गाळण बुद्रुक ग्रामस्थांना घरबसल्या शासकीय सेवा, दाखले आणि ग्रामविकासाच्या योजनांची माहिती देण्यासाठी अधिकृत ई-प्रशासन प्रणाली.",
      date: "२०२६-२७ कार्यकाळ",
      bgImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
      buttonText: "ऑनलाइन सेवा मिळवा",
      buttonLink: "/services",
      order: 1
    },
    {
      id: "slide_2",
      badge: "डिजिटल भारत अभियान",
      title: "सर्व ग्रामपंचायत सेवा आता एका क्लिकवर",
      subtitle: "रहिवासी दाखला, जन्म-मृत्यू नोंदणी, पाणी व घरपट्टी पावती",
      description: "कार्यालयात हेलपाटे न मारता अर्ज करा आणि डिजिटल स्वाक्षरीसह अधिकृत प्रमाणपत्र घरपोच डाउनलोड करा.",
      date: "२४/७ ऑनलाइन सुविधा",
      bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
      buttonText: "दाखल्यासाठी अर्ज करा",
      buttonLink: "/services",
      order: 2
    },
    {
      id: "slide_3",
      badge: "ग्रामविकास प्रगती २०२६",
      title: "हर घर जल आणि सिमेंट काँक्रीट रस्ते विकास प्रकल्प",
      subtitle: "जलजीवन मिशन आणि १५ वा वित्त आयोग अंतर्गत विकासकामे",
      description: "गावातील अंतर्गत रस्ते, सौर पथदिवे, आणि शुद्ध पेयजल वितरण प्रकल्पांचे काम प्रगतीपथावर.",
      date: "चालू कामे",
      bgImage: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
      buttonText: "विकासकामे तपासा",
      buttonLink: "/development",
      order: 3
    }
  ],
  tickerNotice: {
    enabled: true,
    text: "📢 महत्त्वपूर्ण सूचना: सन २०२६-२७ ची घरपट्टी व पाणीपट्टी ३१ मार्च पूर्वी भरून १०% सूट मिळवा. | नवीन जन्म-मृत्यू नोंदणी मोहीम सुरू आहे. | गाव सभेचे आयोजन येत्या २६ तारखेला ग्रामपंचायत सभागृहात दुपारी २:०० वाजता.",
    updatedAt: new Date().toISOString()
  },
  notices: [
    {
      id: "not_1",
      title: "विशेष ग्रामसभा आयोजन सूचना",
      category: "ग्रामसभा",
      date: "2026-11-20",
      urgency: "high",
      content: "गाळण बुद्रुक गावातील सर्व नागरिकांना सूचित करण्यात येते की, १५ व्या वित्त आयोगाच्या विकास आराखड्यास मंजुरी देण्यासाठी विशेष ग्रामसभा आयोजित केली आहे. सर्व ग्रामस्थांनी वेळेवर उपस्थित राहावे.",
      issuedBy: "सरपंच / ग्रामसेवक, गाळण बुद्रुक"
    },
    {
      id: "not_2",
      title: "पंतप्रधान किसान सन्मान निधी ई-केवायसी (e-KYC) मोहीम",
      category: "शेतकरी कल्याण",
      date: "2026-11-18",
      urgency: "medium",
      content: "ज्या शेतकरी बांधवांचे ई-केवायसी बाकी आहे त्यांनी जवळच्या सीएससी केंद्रात किंवा ग्रामपंचायत कार्यालयात आधार कार्डसह संपर्क साधावा.",
      issuedBy: "ग्रामपंचायत कार्यालय"
    },
    {
      id: "not_3",
      title: "आरोग्य तपासणी व मोफत औषधोपचार शिबीर",
      category: "आरोग्य",
      date: "2026-11-15",
      urgency: "normal",
      content: "प्राथमिक आरोग्य उपकेंद्र गाळण येथे सर्व वयोगटातील नागरिकांसाठी मोफत रक्तदाब, मधुमेह व डोळे तपासणी शिबीर आयोजित केले आहे.",
      issuedBy: "आरोग्य समिती"
    }
  ],
  // Dynamic Certificate Types (Admin can add/edit new certificate types)
  certificateTypes: [
    {
      id: "residence",
      nameMr: "रहिवासी दाखला (Residence Certificate)",
      desc: "शासकीय व शैक्षणिक प्रवेश, शिष्यवृत्ती आणि रेशन कार्डसाठी कायम रहिवासी प्रमाणपत्र.",
      deliveryDays: "२ दिवस",
      fee: "₹ २०.००",
      feeAmount: 20,
      requiredDocs: "आधार कार्ड, वीज बिल / घरपट्टी पावती, रेशन कार्ड",
      isActive: true
    },
    {
      id: "birth",
      nameMr: "जन्म नोंद प्रमाणपत्र (Birth Certificate)",
      desc: "ग्रामपंचायत हद्दीत झालेल्या बालकांच्या अधिकृत जन्म नोंदणीचा दाखला.",
      deliveryDays: "३ दिवस",
      fee: "₹ २०.००",
      feeAmount: 20,
      requiredDocs: "हॉस्पिटल डिस्चार्ज कार्ड, पालकांचे आधार कार्ड",
      isActive: true
    },
    {
      id: "death",
      nameMr: "मृत्यू नोंद प्रमाणपत्र (Death Certificate)",
      desc: "मृत्यू नोंदणीचा अधिकृत शासकीय दाखला (वारस हक्क व बँक कामांसाठी).",
      deliveryDays: "३ दिवस",
      fee: "₹ २०.००",
      feeAmount: 20,
      requiredDocs: "डॉक्टर रिपोर्ट / स्मशान नोंद पावती, आधार कार्ड",
      isActive: true
    },
    {
      id: "bpl",
      nameMr: "दारिद्र्य रेषेखालील दाखला / निराधार दाखला",
      desc: "शासकीय अनुदान, घरकुल योजना व संजय गांधी निराधार योजनेसाठी.",
      deliveryDays: "४ दिवस",
      fee: "₹ २०.००",
      feeAmount: 20,
      requiredDocs: "बीपीएल यादी अनुक्रमांक, उत्पन्नाचा दाखला",
      isActive: true
    },
    {
      id: "property",
      nameMr: "घरपट्टी व पाणीपट्टी ना-हरकत (NOC)",
      desc: "नवीन वीज कनेक्शन अथवा बांधकाम परवानगीसाठी कर भरणा व ना-हरकत प्रमाणपत्र.",
      deliveryDays: "२ दिवस",
      fee: "₹ २०.००",
      feeAmount: 20,
      requiredDocs: "चालू वर्षाची घरपट्टी पावती, नमुना ८ उतारा",
      isActive: true
    },
    {
      id: "namuna8",
      nameMr: "गाव नमुना नंबर ८ (House / Property Extract)",
      desc: "ग्रामपंचायत मिळकत नोंदवहीचा अधिकृत नमुना ८ आकारणी उतारा.",
      deliveryDays: "२ दिवस",
      fee: "₹ ३०.००",
      feeAmount: 30,
      requiredDocs: "मागील कर पावती, आधार कार्ड",
      isActive: true
    },
    {
      id: "marriage",
      nameMr: "विवाह नोंदणी प्रमाणपत्र (Marriage Certificate)",
      desc: "ग्रामपंचायत नोंदवहीत अधिकृत विवाह नोंदणी प्रमाणपत्र.",
      deliveryDays: "५ दिवस",
      fee: "₹ ५०.००",
      feeAmount: 50,
      requiredDocs: "लग्नपत्रिका, वर-वधू आधार कार्ड, दोन साक्षीदार",
      isActive: true
    }
  ],
  // Admin Bank Account & Payment Settings
  paymentSettings: {
    bankName: "बँक ऑफ महाराष्ट्र (Bank of Maharashtra)",
    branchName: "पाचोरा शाखा, जि. जळगाव",
    accountHolderName: "ग्रामपंचायत गाळण बुद्रुक ग्रामनिधी खाते",
    accountNumber: "60145290812",
    ifscCode: "MAHB0000214",
    upiId: "gpgalanbudruk@mahb",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=gpgalanbudruk@mahb&pn=Grampanchayat%20Galan%20Budruk",
    taxReceiptNotice: "सर्व दाखल्यांचे अधिकृत शासकीय शुल्क ग्रामपंचायत बँक खात्यात जमा केले जाते. भरलेल्या शुल्काची अधिकृत डिजिटल पावती त्वरित मिळते.",
    updatedAt: new Date().toISOString()
  },
  governmentGRs: [
    {
      id: "gr_101",
      grNumber: "ग्रामवि-२०२६/प्र.क्र.४२/पंरा-४",
      title: "१५ वा वित्त आयोग (२०२६-२७) अंतर्गत अबंधित व बंधीत अनुदानाच्या विनियोगाबाबत सुधारित मार्गदर्शक सूचना",
      department: "ग्राम विकास व पंचायत राज विभाग, महाराष्ट्र शासन",
      date: "2026-11-05",
      fileSize: "1.4 MB",
      category: "वित्त व विकास निधी",
      fileUrl: null,
      summary: "ग्रामपंचायतींना गावातील पाणीपुरवठा, स्वच्छता व सौर पथदिवे कामांसाठी निधी वाटपाच्या अटी व शर्ती बाबत अधिकृत शासन निर्णय."
    },
    {
      id: "gr_102",
      grNumber: "जल-२०२६/का.३५/जजिम-१२",
      title: "जल जीवन मिशन: 'हर घर नल से जल' योजना देखभाल दुरुस्ती नियमावली व ग्राम जल सुरक्षा समिती अधिकार",
      department: "पाणी पुरवठा व स्वच्छता विभाग, महाराष्ट्र शासन",
      date: "2026-10-28",
      fileSize: "2.1 MB",
      category: "जल जीवन मिशन",
      fileUrl: null,
      summary: "ग्रामीण भागात २४ तास शुद्ध पिण्याचे पाणीपुरवठा व ग्रामस्तरावर जल तपासणी किट वापरासंबंधी शासन निर्णय."
    },
    {
      id: "gr_103",
      grNumber: "जजिप/ग्रापं/२०२६/८९२",
      title: "जिल्हा परिषद जळगाव: ग्रामपंचायत कर्मचाऱ्यांचे सुधारित किमान वेतन व भविष्य निर्वाह निधी परिपत्रक",
      department: "जिल्हा परिषद जळगाव (पंचायत विभाग)",
      date: "2026-10-14",
      fileSize: "850 KB",
      category: "जिल्हा परिषद परिपत्रक",
      fileUrl: null,
      summary: "पाचोरा तालुक्यातील सर्व ग्रामपंचायतींमधील संगणक परिचालक व कर्मचाऱ्यांच्या भत्त्यांबाबत निर्देश."
    },
    {
      id: "gr_104",
      grNumber: "मरोहयो-२०२६/सीआर-१०९/रोहयो",
      title: "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार हमी योजना (मनरेगा) अंतर्गत सिंचन विहीर व शेततळे मंजुरी प्रक्रिया २०२६",
      department: "नियोजन विभाग, महाराष्ट्र शासन",
      date: "2026-09-30",
      fileSize: "3.2 MB",
      category: "रोजगार हमी योजना",
      fileUrl: null,
      summary: "अल्प व अत्यल्प भूधारक शेतकऱ्यांना वैयक्तिक लाभाच्या योजनांचे १००% अनुदान वाटपाचे नियम."
    },
    {
      id: "gr_105",
      grNumber: "स्वभा-२०२६/१०४/स्वच्छता",
      title: "स्वच्छ भारत मिशन (ग्रामीण) टप्पा-२: घनकचरा व सांडपाणी व्यवस्थापन प्रकल्प अनुदानाबाबत",
      department: "ग्राम विकास विभाग, मंत्रालय, मुंबई",
      date: "2026-09-12",
      fileSize: "1.8 MB",
      category: "स्वच्छता व पर्यावरण",
      fileUrl: null,
      summary: "ओला व सुका कचरा वर्गीकरण आणि गांडूळ खत निर्मिती केंद्रासाठी ग्रामपंचायतींना प्रोत्साहनपर निधी."
    }
  ],
  developmentWorks: [
    {
      id: "dev_1",
      title: "हनुमान मंदिर ते गाव वेस सिमेंट काँक्रीट रस्ता व भूमिगत गटार बांधकाम",
      category: "रस्ते व पायाभूत सुविधा",
      budget: "₹१२,५०,०००",
      spent: "₹१०,००,०००",
      progress: 85,
      status: "चालू काम (In Progress)",
      fundingSource: "१५ वा वित्त आयोग",
      contractor: "मे. श्री गणेश कन्स्ट्रक्शन, पाचोरा",
      startDate: "2026-06-10",
      targetDate: "2026-12-15",
      location: "वार्ड क्र. १ व २, गाळण बुद्रुक"
    },
    {
      id: "dev_2",
      title: "जि. प. प्राथमिक शाळा डिजिटल क्लासरूम व संरक्षक भिंत",
      category: "शिक्षण व शाळा",
      budget: "₹६,८०,०००",
      spent: "₹६,८०,०००",
      progress: 100,
      status: "पूर्ण झाले (Completed)",
      fundingSource: "आमदार स्थानिक विकास निधी",
      contractor: "ग्रामपंचायत स्वनिधी व लोकसहभाग",
      startDate: "2026-01-15",
      targetDate: "2026-05-30",
      location: "जि. प. शाळा परिसर"
    },
    {
      id: "dev_3",
      title: "५०,००० लिटर क्षमतेची उच्चस्तरीय शुद्ध जल साठवण टाकी व सोलर पंप",
      category: "पिण्याचे पाणी",
      budget: "₹२८,००,०००",
      spent: "₹२०,५०,०००",
      progress: 70,
      status: "चालू काम (In Progress)",
      fundingSource: "जल जीवन मिशन",
      contractor: "जलशक्ती एजन्सी, जळगाव",
      startDate: "2026-04-01",
      targetDate: "2026-12-31",
      location: "उंच टेकडी, मारुती मंदिर मागे"
    },
    {
      id: "dev_4",
      title: "स्मशानभूमी सुशोभीकरण, शेड व बैठक व्यवस्था",
      category: "नागरी सुविधा",
      budget: "₹५,००,०००",
      spent: "₹१,००,०००",
      progress: 25,
      status: "प्रस्तावित / सुरुवात (Starting)",
      fundingSource: "जिल्हा वार्षिक योजना (DPDC)",
      contractor: "अद्याप निविदा प्रक्रियेत",
      startDate: "2026-10-01",
      targetDate: "2027-03-31",
      location: "नदी काठ, गाळण बुद्रुक"
    }
  ],
  applications: [
    {
      id: "APP-2026-00101",
      trackingId: "GB-CERT-2026-891",
      userId: "usr_citizen_001",
      applicantName: "राजेंद्र सोपान पाटील",
      fatherOrHusbandName: "सोपान रामभाऊ पाटील",
      mobile: "9422000000",
      email: "citizen@example.com",
      aadhaarNumber: "XXXX-XXXX-8921",
      serviceType: "residence",
      serviceNameMr: "रहिवासी दाखला (Residence Certificate)",
      purpose: "शैक्षणिक प्रवेश व शासकीय शिष्यवृत्तीसाठी",
      address: "घर क्र. १२४, मारुती गल्ली, गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव",
      residingSinceYears: 28,
      status: "approved",
      appliedAt: "2026-11-10T09:30:00.000Z",
      reviewedAt: "2026-11-11T14:20:00.000Z",
      reviewedBy: "ग्रामसेवक / सरपंच",
      remarks: "कागदपत्रांची प्रत्यक्ष छाननी पूर्ण झाली असून अर्जदार गावचे कायम रहिवासी आहेत.",
      certificateNumber: "GB/MAHA/2026/RC-0442",
      issueDate: "2026-11-11",
      feeAmount: 20
    },
    {
      id: "APP-2026-00102",
      trackingId: "GB-CERT-2026-943",
      userId: "usr_citizen_001",
      applicantName: "सुनीता राजेंद्र पाटील",
      fatherOrHusbandName: "राजेंद्र सोपान पाटील",
      mobile: "9422000000",
      email: "citizen@example.com",
      aadhaarNumber: "XXXX-XXXX-4512",
      serviceType: "bpl",
      serviceNameMr: "दारिद्र्य रेषेखालील दाखला / निराधार दाखला",
      purpose: "संजय गांधी निराधार योजना अर्जासाठी",
      address: "वार्ड क्र. २, गाळण बुद्रुक, ता. पाचोरा",
      residingSinceYears: 22,
      status: "pending",
      appliedAt: "2026-11-13T11:15:00.000Z",
      reviewedAt: null,
      reviewedBy: null,
      remarks: "",
      certificateNumber: "",
      issueDate: "",
      feeAmount: 20
    }
  ],
  grievances: [
    {
      id: "GRV-2026-501",
      trackingId: "GB-GRV-8821",
      userId: "usr_citizen_001",
      citizenName: "राजेंद्र सोपान पाटील",
      mobile: "9422000000",
      category: "पाणी पुरवठा",
      title: "मारुती गल्लीतील पाईपलाईन लिकेज दुरुस्तीबाबत",
      description: "गेल्या तीन दिवसांपासून मुख्य जलवाहिनीला गळती लागल्याने पाण्याचा अपव्यय होत असून दाबाने पाणी येत नाही. कृपया तातडीने दुरुस्ती व्हावी.",
      location: "मारुती मंदिर परिसर, गाळण बु.",
      status: "resolved",
      createdAt: "2026-11-08T08:00:00.000Z",
      resolution: "कर्मचारी पाठवून नवीन पाईप जोडून गळती पूर्णपणे थांबवली आहे.",
      resolvedAt: "2026-11-09T16:00:00.000Z"
    },
    {
      id: "GRV-2026-502",
      trackingId: "GB-GRV-9014",
      userId: "usr_citizen_001",
      citizenName: "सचिन विठ्ठल शिंदे",
      mobile: "9823112233",
      category: "पथदिवे (Street Lights)",
      title: "शाळेजवळील २ स्ट्रीट लाईट बंद आहेत",
      description: "रात्रीच्या वेळी विद्यार्थ्यांना व ग्रामस्थांना अंधारात अडचण होते. पथदिवे तात्काळ सुरू करावेत.",
      location: "जि. प. शाळा रोड",
      status: "in_progress",
      createdAt: "2026-11-12T19:20:00.000Z",
      resolution: "विद्युत साहित्याची मागणी नोंदवली असून २ दिवसांत नवीन एलईडी बल्ब बसवले जातील.",
      resolvedAt: null
    }
  ],
  villageProfile: {
    nameMr: "ग्रामपंचायत गाळण बुद्रुक",
    talukaMr: "पाचोरा",
    districtMr: "जळगाव",
    pincode: "424201",
    state: "महाराष्ट्र",
    sarpanch: {
      name: "सौ. वंदनाताई ज्ञानेश्वर पाटील",
      designation: "सरपंच (Sarpanch)",
      phone: "+91 98231 00001",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    },
    upsarpanch: {
      name: "श्री. समाधान सुपडू पाटील",
      designation: "उपसरपंच (Upsarpanch)",
      phone: "+91 98231 00002",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    gramsevak: {
      name: "श्री. आर. के. महाजन",
      designation: "ग्रामविकास अधिकारी / ग्रामसेवक",
      phone: "+91 98231 00003",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
    },
    statistics: {
      population: "४,५८०",
      male: "२,३५०",
      female: "२,२३०",
      totalHouseholds: "८९०",
      literacyRate: "८४.२%",
      wardCount: "४",
      memberCount: "९",
      areaSqKm: "१२.४"
    },
    aboutSections: {
      locationText: "गाळण बुद्रुक हे पाचोरा तालुक्यापासून सुमारे १२ कि.मी. अंतरावर वसलेले आहे. गावाचा पिनकोड ४२४२०१ असून पाचोरा रेल्वे जंक्शन व मुख्य राज्य महामार्गाशी चांगला संपर्क आहे.",
      educationText: "गावात जिल्हा परिषद प्राथमिक शाळा, अंगणवाडी केंद्र, आणि डिजिटल ई-लर्निंग सुविधा उपलब्ध आहेत. माध्यमिक शिक्षणासाठी नियमित बस सुविधा आहे.",
      healthWaterText: "प्राथमिक आरोग्य उपकेंद्र कार्यरत असून गावात जल जीवन मिशन अंतर्गत हर घर नल से जल योजनेद्वारे शुद्ध पाण्याचा पुरवठा नियमित केला जातो."
    },
    officeHours: "सोमवार ते शनिवार: सकाळी १०:०० ते संध्याकाळी ५:४५ (रविवार सुट्टी)",
    email: "gp.galanbudruk@gmail.com",
    helpline: "०२५९६-२४५००१"
  }
};

// Initialize DB file if not exists or ensure missing fields are populated
function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const db = JSON.parse(raw);

    let updated = false;
    // Backfill any missing fields if older DB exists
    if (!db.certificateTypes) {
      db.certificateTypes = defaultData.certificateTypes;
      updated = true;
    }
    if (!db.paymentSettings) {
      db.paymentSettings = defaultData.paymentSettings;
      updated = true;
    }
    if (!db.villageProfile.aboutSections) {
      db.villageProfile.aboutSections = defaultData.villageProfile.aboutSections;
      updated = true;
    }
    if (updated) {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    }
    return db;
  } catch (err) {
    console.error("Error reading database.json, reinitializing default", err);
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    return defaultData;
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error saving database.json", err);
    return false;
  }
}

const otpStore = new Map();
const captchaStore = new Map();

module.exports = {
  getDB,
  saveDB,
  otpStore,
  captchaStore,
  UPLOADS_DIR
};
