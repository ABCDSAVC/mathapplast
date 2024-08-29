const axios = require('axios');
const sql = require('mssql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const request = require('request');


const config = {
  user: 'sa',
  password: 'Troya963+-',
  server: 'localhost',
  database: 'MathApp',
  options: {
    encrypt: false,
    enableArithAbort: true
  }
};

const appLogin = express();
const portLogin = 5175;
appLogin.use(cors());
appLogin.use(bodyParser.json());

appSignStudent = express();
const portSignStudent = 5176;
appSignStudent.use(cors());
appSignStudent.use(bodyParser.json());

appSignTeach = express();
const portSignTeach = 5177;
appSignTeach.use(cors());
appSignTeach.use(bodyParser.json());

appSignParent = express();
const portSignParent = 5178;
appSignParent.use(cors());
appSignParent.use(bodyParser.json());

//login sorgusu
appLogin.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT PasswordHash FROM AllUsers WHERE Email = @Email');

    if (result.recordset.length > 0) {
      const hashedPassword = result.recordset[0].PasswordHash;
      const match = await bcrypt.compare(password, hashedPassword);
      if (match) {
        res.status(200).json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ message: 'Invalid credentials. Password does not match.' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials. Email not found.' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});
appLogin.listen(portLogin, () => {
  console.log(`Login server is running on port ${portLogin}`);
});

// Kayıt rotası
appSignStudent.post('/signup/StudentSignUp', async (req, res) => {
  const { email, firstName, lastName, username, StClass, password, birthDate, Şehir } = req.body;

  if (!username || !password || !email || !firstName || !lastName || !StClass || !birthDate || !Şehir) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
  }

  let StudentId;
  switch (StClass.toLowerCase()) {
    case '1':
      StudentId = 1001;
      break;
    case '2':
      StudentId = 1002;
      break;
    case '3':
      StudentId = 1003;
      break;
    case '4':
      StudentId = 1004;
      break;
    case '5':
      StudentId = 1005;
      break;
    case '6':
      StudentId = 1006;
      break;
    case '7':
      StudentId = 1007;
      break;
    case '8':
      StudentId = 1008;
      break;
    default:
      StudentId = 0;
      break;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await sql.connect(config);

    const request = new sql.Request(pool);
    await request
      .input('ÖgrUserName', sql.NVarChar, username)
      .input('PasswordHash', sql.NVarChar, hashedPassword)
      .input('Email', sql.NVarChar, email)
      .input('Ögr_Ad', sql.NVarChar, firstName)
      .input('Ögr_Soyad', sql.NVarChar, lastName)
      .input('Sınıf', sql.Int, StClass)
      .input('BirthDate', sql.NVarChar, birthDate)
      .input('City', sql.NVarChar, Şehir)
      .input('SınıfID', sql.Int, StudentId)
      .query(`
        INSERT INTO StudentUsers (MainID, ÖgrUserName, PasswordHash, Email, Ögr_Ad, Ögr_Soyad, Sınıf, SınıfID, BirthDate, City )
        VALUES (1,@ÖgrUserName, @PasswordHash, @Email, @Ögr_Ad, @Ögr_Soyad,  @Sınıf,@SınıfID, @BirthDate, @City)
      `);

    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi' });
  } catch (err) {
    console.error('Kayıt işlemi sırasında hata:', err);
    res.status(500).json({ error: 'Kayıt işlemi sırasında hata meydana geldi' });
  }
});

appSignStudent.listen(portSignStudent, () => {
  console.log(`Express server ${portSignStudent} portunda çalışıyor`);
});

// Kayıt rotası
appSignTeach.post('/signup/TeacherSingUp', async (req, res) => {
  const { email, firstName, lastName, username, Lessons, password, birthDate, Şehir } = req.body;

  if (!username || !password || !email || !firstName || !lastName || !Lessons || !birthDate || !Şehir) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
  }

  let LessonsID;
  // Lessons değerine göre LessonID belirleme
  switch (Lessons.toLowerCase()) {
    case 'matematik':
      LessonsID = 101;
      break;
    case 'Türkçe':
      LessonsID = 102;
      break;
    case 'Fen Bİlgisi':
      LessonsID = 102;
      break;
    case 'İngilizce':
      LessonsID = 103;
      break;
    default:
      LessonsID = 0; // Varsayılan değer veya uygun bir değer
      break;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await sql.connect(config);

    const request = new sql.Request(pool);
    await request
      .input('TeacUserName', sql.NVarChar, username)
      .input('PasswordHash', sql.NVarChar, hashedPassword)
      .input('Email', sql.NVarChar, email)
      .input('Teac_Ad', sql.NVarChar, firstName)
      .input('Teac_Soyad', sql.NVarChar, lastName)
      .input('Lessons', sql.NVarChar, Lessons)
      .input('BirthDate', sql.Date, birthDate)
      .input('City', sql.NVarChar, Şehir)
      .input('LessonsID', sql.Int, LessonsID)
      .query(`
        INSERT INTO TeacherUsers (MainID,TeacUserName, PasswordHash, Email, Teac_Ad, Teac_Soyad, Lessons,LessonsID, BirthDate, City )
        VALUES (2,@TeacUserName, @PasswordHash, @Email, @Teac_Ad, @Teac_Soyad,  @Lessons,@LessonsID, @BirthDate, @City)
      `);

    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi' });
  } catch (err) {
    console.error('Kayıt işlemi sırasında hata:', err);
    res.status(500).json({ error: 'Kayıt işlemi sırasında hata meydana geldi' });
  }
});

appSignTeach.listen(portSignTeach, () => {
  console.log(`Express server ${portSignTeach} portunda çalışıyor`);
});

// Kayıt rotası
appSignParent.post('/signup/ParentsSignUp', async (req, res) => {
  const { email, firstName, lastName, username, ÖğrenciAdı, ÖğrenciSoyadı, Tlf, password, birthDate, Şehir } = req.body;

  if (!username || !password || !email || !firstName || !lastName || !ÖğrenciAdı || !ÖğrenciSoyadı || !birthDate || !Şehir || !Tlf) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await sql.connect(config);

    const request = pool.request();

    // Öğrenci bilgilerini sorgulama
    const result = await request
      .input('Ögr_Ad', sql.NVarChar, ÖğrenciAdı)
      .input('Ögr_Soyad', sql.NVarChar, ÖğrenciSoyadı)
      .query('SELECT * FROM StudentUsers WHERE Ögr_Ad = @Ögr_Ad AND Ögr_Soyad = @Ögr_Soyad');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı.' });
    }

    const Öğr_ID = result.recordset[0].Ögr_ID;

    await pool.request()
      .input('Ögr_ID', sql.Int, Öğr_ID)
      .input('Email', sql.NVarChar, email)
      .input('Prnt_Ad', sql.NVarChar, firstName)
      .input('Prnt_Soyad', sql.NVarChar, lastName)
      .input('PrntUserName', sql.NVarChar, username)
      .input('PasswordHash', sql.NVarChar, hashedPassword)
      .input('Tlf', sql.NVarChar, Tlf)
      .input('birthDate', sql.Date, birthDate)
      .input('City', sql.NVarChar, Şehir)
      .query(`
        INSERT INTO ParentsUsers (MainID,PrntUserName, PasswordHash, Email, Prnt_Ad, Prnt_Soyad, Ögr_ID, birthDate, City, Tlf)
        VALUES (3,@PrntUserName, @PasswordHash, @Email, @Prnt_Ad, @Prnt_Soyad, @Ögr_ID, @birthDate, @City, @Tlf)
      `);

    res.status(200).json({ message: 'Kayıt başarılı!' });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu.' });
  }
});

appSignParent.listen(portSignParent, () => {
  console.log(`Express server ${portSignParent} portunda çalışıyor`);
});

