// const express = require('express');
import express from 'express';
import mysql from 'mysql'
import cors from 'cors';
import multer from 'multer';
import ExcelJS from 'exceljs';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import md5 from 'md5';
import { hash } from 'bcrypt';
const salt = 10;


const app = express();
app.use(cors());
app.use(express.json());



app.listen(8081,()=>{
    console.log("listening");
})
const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '',
  database: "99acres_listing"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server.');
  });

  app.get("/listDetail", (req, res) => {
    const sql = "SELECT * FROM listing"; 
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error on the server.');
        } else {
            res.json(results);
        }
    });
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/uploadExcel', upload.single('file'), (req, res) => {
    // Read the uploaded file and process it
    // You can use libraries like 'exceljs' to read the Excel file
    // Example code to read the file and process it
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile(req.file.path)
      .then(() => {
        const worksheet = workbook.getWorksheet(1);
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          if (rowNumber !== 1) { // Skip the first row (header)
            const rowData = row.values;
            // Process rowData and insert into the database
            // Example code to insert into the database
            const sql = "INSERT INTO `listing` (`Title`, `Is_Premium`, `AssignedTo`, `Price`, `AreaType`, `TotalArea`, `ListingID`, `ListedDate`, `ExpiryDate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
            db.query(sql, rowData.slice(1), (err, result) => {
              if (err) {
                console.error('Error inserting row:', err);
              } else {
                console.log('Row inserted:', result);
              }
            });
          }
        });
        res.status(200).send('File uploaded and processed.');
      })
      .catch((error) => {
        console.error('Error reading file:', error);
        res.status(500).send('Error reading file.');
      });
  });


 



// app.get("/getData", (req,res) => {
//     res.send("Hello")
// });

// const db = mysql.createConnection({
//   host: "localhost",
//   user: 'root',
//   password: '',
//   database: "server_database"
// });
// app.get('/users', (req, res)=>{
//     const sql= "SELECT * FROM users";
//     db.query(sql,(err, data)=>{
//         if(err) return res.json(err);
//         return res.json(data);
//     })
// })



// Register Page server cide 
// app.post('/register',(req, res) =>{
//     const sql = "INSERT INTO users (`FirstName`,`LoginID`,`Password`) VALUES (?)";
//     md5.hash(req.body.password.toString(), salt,(err, hash) => {
//         if (err) return res.json({ Error: "Error for hassing passowrd"});
//         const values =  [
//             req.body.FirstName,
//             req.body.email,
//             hash
//         ]
//         db.query(sql,values ,(err, result) =>{
//             if (err) res.json({Error: "Inserting data in the server"});
//             return res.json({Status : "Success"});
//         })
//     })
    
// })


// app.post('/Login', (res, req) => {
//     const sql = "SELECT * FROM users WHERE LoginID = ?";
//     db.query(sql, [req.body.txtuserName], (err, data) => {
//         if(err) return res.json({Error: "Login error in server"});
//         if(data.length>0){
//             md5.compare(req.body.txtPassword.toString(), data[0].password, (err, response) => {
//                 if(err) return res.json({Error: "Password Companre error"});
//                 if(response){
//                     return res.json({
//                         Status: "Success"
//                     });
//                 } else {
//                     return res.json({
//                         Error: "Wrong Password"
//                     })
//                 }
//             })
//         } else {
//             return res.json({Error: "No user existed."});
//         }
//     })
// })



// app.post('/users',(req, res)=> {
//     const sql = "SELECT * FROM users WHERE LoginID = ? and Password =?;";
//     db.query(sql,[req.body.LoginID, req.body.Password],(err, result)=>{
//         if(err) return res.json({Message: "Error inside server"});
//         if(result.length>0){
//             req.session.LoginID = result;
//             req.session.FirstName = result[0].FirstName;
//             console.log(req.session.FirstName)
//             return res.json({Login:true, FirstName: req.session.FirstName})
//         } else {
//             return res.json({Login:false})
//         }
//     });
// });
