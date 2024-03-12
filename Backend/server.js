// const express = require('express');
import express from 'express';
import mysql from 'mysql'
import cors from 'cors';
import multer from 'multer';
import ExcelJS from 'exceljs';
import moment from 'moment';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import md5 from 'md5';
import { hash } from 'bcrypt';
const salt = 10;


const app = express();
app.use(cors());
app.use(express.json());



app.listen(8081, () => {
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


// Without duplicacy
app.post('/uploadExcel', upload.single('file'), (req, res) => {

  // Read the uploaded file and process it
  const workbook = new ExcelJS.Workbook();
  workbook.xlsx.readFile(req.file.path)
    .then(() => {
      const worksheet = workbook.getWorksheet(1);
      const headers = worksheet.getRow(1).values;
      const dataRows = [];
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber !== 1) { // Skip the first row (header)
          const rowData = row.values;
          const data = {};
          headers.forEach((header, index) => {
            switch (header) {
              case 'component__cGrey':
                data.Title = rowData[index];
                if (data.Title.toLowerCase().includes('sale')) {
                  data.PropertyCategory = 'Sale';
                } else if (data.Title.toLowerCase().includes('rent')) {
                  data.PropertyCategory = 'Rent';
                } else if (data.Title.toLowerCase().includes('lease')) {
                  data.PropertyCategory = 'Lease';
                } else {
                  data.PropertyCategory = ''; // Default value if no keyword is found
                }
                break;
              case 'component__premiumTag':
                data.Is_Premium = rowData[index] ? 1 : 0;
                break;
              case 'component__blueLink':
                const assignedTo = rowData[index].split(':');
                data.AssignedTo = assignedTo.length > 1 ? assignedTo[1].trim() : null;
                data.PropertyType = assignedTo.length > 1 && assignedTo[1].toLowerCase().includes('vaibhav') ? 'Commercial' : 'Residential';
                break;
              case 'component__main_text':
                data.Price = rowData[index];
                break;
              case 'component__light_text 2':
                let areaType = rowData[index].replace(/^\|/, '').replace(/:$/, '');
                data.AreaType = areaType.trim();
                break;
              case 'component__main_text 2':
                data.TotalArea = rowData[index];
                break;
              case 'component__sub_wrap':
                data.ListingID = rowData[index].replace(':', '');
                break;
              case 'component__main_text 3':
                data.ListedDate = rowData[index] ? moment(rowData[index], 'DD MMM YYYY').format('YYYY-MM-DD') : null;
                break;
              case 'component__main_text 4':
                data.ExpiryDate = rowData[index] ? moment(rowData[index], 'DD MMM YYYY').format('YYYY-MM-DD') : null;
                break;
              default:
                break;
            }
          });

          // Check if property with ListingID already exists in the database
          db.query("SELECT * FROM `listing` WHERE `ListingID` = ?", [data.ListingID], (err, result) => {
            if (err) {
              console.error('Error checking ListingID:', err);
            } else {
              if (result.length > 0) {
                // Property with ListingID already exists, check if any data needs to be updated
                const existingProperty = result[0];
                const updateData = {};
                if (existingProperty.Title !== data.Title) updateData.Title = data.Title;
                if (existingProperty.Is_Premium !== data.Is_Premium) updateData.Is_Premium = data.Is_Premium;
                if (existingProperty.AssignedTo !== data.AssignedTo) updateData.AssignedTo = data.AssignedTo;
                if (existingProperty.Price !== data.Price) updateData.Price = data.Price;
                if (existingProperty.AreaType !== data.AreaType) updateData.AreaType = data.AreaType;
                if (existingProperty.TotalArea !== data.TotalArea) updateData.TotalArea = data.TotalArea;
                if (existingProperty.ListedDate !== data.ListedDate) updateData.ListedDate = data.ListedDate;
                if (existingProperty.ExpiryDate !== data.ExpiryDate) updateData.ExpiryDate = data.ExpiryDate;

                // Update the existing property if any data needs to be updated
                if (Object.keys(updateData).length > 0) {
                  db.query("UPDATE `listing` SET ? WHERE `ListingID` = ?", [updateData, data.ListingID], (err, result) => {
                    if (err) {
                      console.error('Error updating property:', err);
                    } else {
                      console.log('Property updated:', data.ListingID);
                    }
                  });
                } else {
                  console.log('No changes to property:', data.ListingID);
                }
              } else {
                // Property with ListingID does not exist, insert new property
                // Property with ListingID does not exist, insert new property
                db.query("INSERT INTO `listing` SET ?", data, (err, result) => {
                  if (err) {
                    console.error('Error inserting row:', err);
                  } else {
                    console.log('Row inserted:', result.insertId);
                  }
                });
              }

              // Insert new properties into the database
              const insertValues = dataRows.map(row => [
                row.Title,
                row.Is_Premium,
                row.AssignedTo,
                row.Price,
                row.AreaType,
                row.TotalArea,
                row.ListingID,
                row.ListedDate,
                row.ExpiryDate
              ]);
              if (insertValues.length > 0) {
                const sql = "INSERT INTO `listing` (`Title`, `Is_Premium`, `AssignedTo`, `Price`, `AreaType`, `TotalArea`, `ListingID`, `ListedDate`, `ExpiryDate`) VALUES ?";
                db.query(sql, [insertValues], (err, result) => {
                  if (err) {
                    console.error('Error inserting rows:', err);
                  } else {
                    console.log('Rows inserted');
                  }
                });
              }
            }
          });
        }
      });

      res.status(200).send('Data processed.');
    })
    .catch((error) => {
      console.error('Error reading file:', error);
      res.status(500).send('Error reading file.');
    });
});



app.get('/agents', (req, res) => {
  const sql = "SELECT DISTINCT `AssignedTo` FROM `listing` WHERE `AssignedTo` IS NOT NULL";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching agents:', err);
      res.status(500).send('Error fetching agents.');
    } else {
      const agents = results.map(result => result.AssignedTo).filter(agent => agent !== null);
      res.json(agents);
    }
  });
});

// // Property Category filter
// app.get('/propertyCategories', (req, res) => {
//   const query = 'SELECT DISTINCT PropertyCategory FROM `listing`';
//   db.query(query, (error, results) => {
//       if (error) {
//           console.error('Error fetching property categories:', error);
//           res.status(500).json({ error: 'Error fetching property categories' });
//       } else {
//           const categories = results.map(result => result.PropertyCategory);
//           res.json(categories);
//       }
//   });
// });





// app.get("/getData", (req,res) => {
//     res.send("Hello")
// });


// Server Database connection code. 
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: 'root',
//   password: '',
//   database: "server_database"
// });

// Code for checking the details of the users table.
app.get('/users', (req, res) => {
  const sql = "SELECT * FROM `users`";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  })
})



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

// Login Page
app.post('/Login', (res, req) => {
  const sql = "SELECT * FROM users WHERE LoginID = ?";
  connection.query(sql, [req.body.txtuserName], (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });
    if (data.length > 0) {
      md5.compare(req.body.txtPassword.toString(), data[0].password, (err, response) => {
        if (err) return res.json({ Error: "Password Companre error" });
        if (response) {
          return res.json({
            Status: "Success"
          });
        } else {
          return res.json({
            Error: "Wrong Password"
          })
        }
      })
    } else {
      return res.json({ Error: "No user existed." });
    }
  })
})


// LoginPage session code
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