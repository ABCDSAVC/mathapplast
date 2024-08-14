const axios = require('axios');
const sql = require('mssql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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

appSignStudent = express();
const portSignStudent=5176;

appSignStudent.use(cors());
appSignStudent.use(bodyParser.json());

appSignTeach = express();
const portSignTeach=5177;

appSignTeach.use(cors());
appSignTeach.use(bodyParser.json());

appSignParent = express();
const portSignParent=5178;

appSignParent.use(cors());
appSignParent.use(bodyParser.json());

// Kayıt rotası
appSignStudent.post('/signup/StudentSignUp', async (req, res) => {
  const { email, firstName, lastName, username, StClass, password,  birthDate, Şehir} = req.body;

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
      .input('Ögr_ID', sql.Int, StudentId)
      .query(`
        INSERT INTO StudentUsers (Ögr_ID, ÖgrUserName, PasswordHash, Email, Ögr_Ad, Ögr_Soyad, Sınıf, BirthDate, City )
        VALUES (@Ögr_ID,@ÖgrUserName, @PasswordHash, @Email, @Ögr_Ad, @Ögr_Soyad,  @Sınıf, @BirthDate, @City)
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
  const { email, firstName, lastName, username, Lessons, password , birthDate, Şehir} = req.body;

  if (!username || !password || !email || !firstName || !lastName || !Lessons || !birthDate || !Şehir) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
  }

  let teachID;
  // Lessons değerine göre Teach_ID belirleme
  switch (Lessons.toLowerCase()) {
    case 'matematik':
      teachID = 101;
      break;
    // Diğer dersler için gerekli değerleri ekleyin
    default:
      teachID = 0; // Varsayılan değer veya uygun bir değer
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
      .input('Teac_ID', sql.Int, teachID)
      .query(`
        INSERT INTO TeacherUsers (Teac_ID,TeacUserName, PasswordHash, Email, Teac_Ad, Teac_Soyad, Lessons, BirthDate, City )
        VALUES (@Teac_ID,@TeacUserName, @PasswordHash, @Email, @Teac_Ad, @Teac_Soyad,  @Lessons, @BirthDate, @City)
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

    const result = await request
      .input('Ögr_Ad', sql.NVarChar, ÖgrenciAdı)
      input('Ögr_Soyad', sql.NVarChar, ÖgrenciSoyadı) // Ögr_Adı bir NVarChar olabilir, ihtiyaca göre değiştirin
      .query('SELECT * FROM StudentUsers WHERE Ögr_Ad = @Ögr_Ad END Öğr_Soyad=@Ögr_Soyad');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı.' });
    }

    const Öğr_ID = result.recordset[0].StudentID;

    await pool.request()
      .input('Ögr_ID', sql.int, Öğr_ID)
      .input('Email', sql.NVarChar, email)
      .input('Prnt_Ad', sql.NVarChar, firstName)
      .input('Prnt_Soyad', sql.NVarChar, lastName)
      .input('PrntUserName', sql.NVarChar, username)
      .input('PasswordHash', sql.NVarChar, hashedPassword)
      .input('Tlf', sql.NVarChar, Tlf)
      .input('birthDate', sql.Date,birthDate)
      .input('City', sql.NVarChar, Şehir)
      .query(`
        INSERT INTO ParentsUsers (PrntUserName, PasswordHash, Email, Prnt_Ad, Prnt_Soyad, Ögr_ID, birthDate, City,Tlf)
        VALUES (@PrntUserName, @PasswordHash, @Email, @Prnt_Ad, @Prnt_Soyad,@Ögr_ID, @BirthDate, @City,@Tlf)
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

