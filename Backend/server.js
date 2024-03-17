// import required modules

import ExcelJS from "exceljs";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken"; // Import JWT library
import md5 from "md5";
import moment from "moment";
import multer from "multer";
import mysql from "mysql";
import session from "express-session";

// Set up salt for password hashing
const salt = 10;
const secretKey = "your_secret_key"; // Secret key for JWT token

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 120000 }, // Session timeout: 2 minutes (2 * 60 * 1000)
  })
);

// Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "99acres_listing",
});

// Connect to MySQL server
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL server.");
});

// Route to fetch users
app.get(
  "/users"
  // requireLogin

  // checkTokenExpiration,
  // (req, res) => {
  //   const sql = "SELECT * FROM `users`";
  //   db.query(sql, (err, data) => {
  //     if (err) return res.json(err);
  //     return res.json(data);
  //   });
  // }
);

// Route for user login

app.post("/login", (req, res) => {
  console.log("Received login request:", req.body); // Log received credentials
  const { LoginID, Password, MobileNo, RememberMe } = req.body; // Extract username and password from request body

  // Query the database to check if the user exists and the password is correct
  const sql =
    "SELECT * FROM users WHERE (LoginID = ? OR MobileNo=?) AND Password = ?";
  db.query(sql, [LoginID, LoginID, Password], (err, data) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ Error: "An error occurred during login" });
    }

    // Check if the user exists and the password matches
    if (data.length > 0) {
      const user = data[0];

      // Create JWT token payload with LoginID and FirstName
      let payload = {};
      if (LoginID) {
        payload = {
          login: LoginID,
          FirstName: user.FirstName,
        };
      } else if (MobileNo) {
        payload = {
          mobile: MobileNo,
          FirstName: user.FirstName,
        };
      }

      // Create JWT token
      const token = jwt.sign(payload, secretKey);
      console.log(token);

      // Set token in cookie
      res.cookie("token", token, { httpOnly: true });

      console.log("Login successful for user:", LoginID);
      return res.json({ Status: "Success", token: token });
    } else {
      console.log("User not found or invalid credentials provided:", LoginID);
      return res.status(401).json({ Error: "Invalid credentials" });
    }
  });
});
// Route for user logout
app.post("/logout", (req, res) => {
  // Clear the token cookie to log the user out
  res.clearCookie("token");
  res.status(200).json({ Message: "Logout successful" });
});

// Start the server
app.listen(8081, () => {
  console.log("listening");
});
app.get("/listDetail", (req, res) => {
  let sql = "SELECT * FROM listing WHERE 1=1";
  const {
    roomType,
    minTotalArea,
    maxTotalArea,
    areaUnit,
    agentName,
    propertyCategory,
    propertyType,
    fromExpiryDate,
    toExpiryDate,
    fromListedDate,
    toListedDate,
    minPrice,
    maxPrice,
    dateFilter,
    expiryDateFilter,
  } = req.query;

  if (roomType) {
    const roomTypes = Array.isArray(roomType) ? roomType : [roomType];
    const roomTypeConditions = roomTypes.map((type) => {
      if (type === "1 BHK") {
        return `Title LIKE '%1 BHK%'`;
      } else if (type === "2 BHK") {
        return `Title LIKE '%2 BHK%'`;
      } else if (type === "3 BHK") {
        return `Title LIKE '%3 BHK%'`;
      }
    });
    sql += ` AND (${roomTypeConditions.join(" OR ")})`;
  }

  if (fromExpiryDate && toExpiryDate) {
    sql += ` AND ExpiryDate BETWEEN '${fromExpiryDate}' AND '${toExpiryDate}'`;
  }

  if (fromListedDate && toListedDate) {
    sql += ` AND ListedDate BETWEEN DATE_FORMAT('${fromListedDate}', '%Y-%m-%d') AND DATE_FORMAT('${toListedDate}', '%Y-%m-%d')`;
  }

  if (dateFilter === "Today") {
    sql += ` AND DATE(ListedDate) = CURDATE()`;
  } else if (dateFilter === "Yesterday") {
    sql += ` AND DATE(ListedDate) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
  } else if (dateFilter === "This week") {
    sql += ` AND YEARWEEK(ListedDate) = YEARWEEK(CURDATE())`;
  } else if (dateFilter === "This month") {
    sql += ` AND MONTH(ListedDate) = MONTH(CURDATE()) AND YEAR(ListedDate) = YEAR(CURDATE())`;
  } else if (dateFilter === "Custom" && fromListedDate && toListedDate) {
    sql += ` AND ListedDate BETWEEN '${fromListedDate}' AND '${toListedDate}'`;
  } else if (dateFilter === "") {
  }

  if (expiryDateFilter === "Today") {
    sql += ` AND DATE(ExpiryDate) = CURDATE()`;
  } else if (expiryDateFilter === "Yesterday") {
    sql += ` AND DATE(ExpiryDate) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
  } else if (expiryDateFilter === "This week") {
    sql += ` AND YEARWEEK(ExpiryDate) = YEARWEEK(CURDATE())`;
  } else if (expiryDateFilter === "This month") {
    sql += ` AND MONTH(ExpiryDate) = MONTH(CURDATE()) AND YEAR(ExpiryDate) = YEAR(CURDATE())`;
  } else if (expiryDateFilter === "Custom" && fromExpiryDate && toExpiryDate) {
    sql += ` AND ExpiryDate BETWEEN '${fromExpiryDate}' AND '${toExpiryDate}'`;
  } else if (expiryDateFilter === "") {
    // No date filter applied
  }

  if (minPrice && maxPrice) {
    sql += ` AND ConvertedPrice BETWEEN ${minPrice} AND ${maxPrice}`;
  }

  if (
    minTotalArea &&
    maxTotalArea &&
    minTotalArea <= 10000 &&
    maxTotalArea <= 10000
  ) {
    sql += ` AND TotalArea BETWEEN ${minTotalArea} AND ${maxTotalArea}`;
  } else if (minTotalArea && minTotalArea > 10000) {
    sql += ` AND TotalArea > 10000`;
  }

  if (areaUnit) {
    sql += ` AND AreaUnit = '${areaUnit}'`;
  }

  if (agentName) {
    sql += ` AND AssignedTo = '${agentName}'`;
  }

  if (propertyCategory) {
    sql += ` AND PropertyCategory = '${propertyCategory}'`;
  }

  // if (propertyType) {
  //   sql += ` AND PropertyType = '${propertyType}'`;
  // }
  if (propertyType) {
    if (propertyType === "Both") {
      // Show all properties
      sql += ` AND (PropertyType = 'Residential' OR PropertyType = 'Commercial')`;
    } else {
      // Filter by the selected property type
      sql += ` AND PropertyType = '${propertyType}'`;
    }
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching listings:", err);
      res.status(500).send("Error fetching listings.");
    } else {
      res.json(results);
    }
  });
});

app.get("/agentList", (req, res) => {
  let sql = "SELECT DISTINCT AssignedTo FROM listing";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching agent list:", err);
      res.status(500).send("Error fetching agent list.");
    } else {
      res.json(results.map((result) => result.AssignedTo));
    }
  });
});

// Property Category Filter DataFetching
app.get("/categoryList", (req, res) => {
  let sql = "SELECT DISTINCT PropertyCategory FROM listing";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching category list:", err);
      res.status(500).send("Error fetching category list.");
    } else {
      res.json(results.map((result) => result.PropertyCategory));
    }
  });
});

// Property Type Filter DataFetching
app.get("/typeList", (req, res) => {
  let sql = "SELECT DISTINCT PropertyType FROM listing";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching type list:", err);
      res.status(500).send("Error fetching type list.");
    } else {
      res.json(results.map((result) => result.PropertyType));
    }
  });
});

// Area Unit Filter DataFetching
app.get("/areaUnit", (req, res) => {
  let sql = "SELECT DISTINCT AreaUnit FROM listing";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching Area Unit:", err);
      res.status(500).send("Error fetching Area Unit.");
    } else {
      res.json(results.map((result) => result.AreaUnit));
    }
  });
});

// For ListingDate
app.get("/listedDates", (req, res) => {
  let sql = "SELECT ListedDate FROM listing";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching dates:", err);
      res.status(500).send("Error fetching dates.");
    } else {
      res.json(results);
    }
  });
});

// For Expiry Date
app.get("/expiryDates", (req, res) => {
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching dates:", err);
      res.status(500).send("Error fetching dates.");
    } else {
      res.json(results);
    }
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Without duplicacy
app.post("/uploadExcel", upload.single("file"), (req, res) => {
  // Read the uploaded file and process it
  const workbook = new ExcelJS.Workbook();
  workbook.xlsx
    .readFile(req.file.path)
    .then(() => {
      const worksheet = workbook.getWorksheet(1);
      const headers = worksheet.getRow(1).values;
      const dataRows = [];
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber !== 1) {
          // Skip the first row (header)
          const rowData = row.values;
          const data = {};
          headers.forEach((header, index) => {
            switch (header) {
              case "component__cGrey":
                data.Title = rowData[index];
                data.Title = data.Title.replace(/,?(gurgaon|gurugram),?/gi, "");

                if (data.Title.toLowerCase().includes("sale")) {
                  data.PropertyCategory = "Sale";
                } else if (data.Title.toLowerCase().includes("rent")) {
                  data.PropertyCategory = "Rent";
                } else if (data.Title.toLowerCase().includes("lease")) {
                  data.PropertyCategory = "Lease";
                } else {
                  data.PropertyCategory = ""; // Default value if no keyword is found
                }
                break;
              case "component__rubyTag":
                data.Is_Premium = rowData[index] ? "INFINITY" : "";

                data.Is_Premium =
                  data.Is_Premium === "INFINITY" ? "INFINITY" : "Non- INFINITY";
                break;
              case "component__blueLink":
                const assignedTo = rowData[index].split(":");
                data.AssignedTo =
                  assignedTo.length > 1 ? assignedTo[1].trim() : null;
                data.PropertyType =
                  assignedTo.length > 1 &&
                  assignedTo[1].toLowerCase().includes("vaibhav")
                    ? "Commercial"
                    : "Residential";
                break;
              case "component__icon href":
                data.Link = rowData[index];
                break;
              case "CompletionChart__percentage":
                // I have to add % value after the score value.
                // data.Score = rowData[index] *100 + "%";
                data.Score = rowData[index];

                break;
              case "hyperlinks_small":
                data.MissingData = rowData[index];
                break;
              case "component__light_text 10":
                data.Credit = rowData[index];
                break;
              case "component__percentile":
                // data.LocalityPercentage = (rowData[index] * 100).toFixed(2) + '%';
                data.LocalityPercentage = rowData[index];
                break;
              case "component__main_text":
                data.Price = rowData[index];
                data.Price = data.Price.replace(/Rs/gi, "");
                // Check if the Price contains 'Lacs' or 'crore'
                if (
                  data.Price.includes("Lac") ||
                  data.Price.includes("Crore")
                ) {
                  // Extract the numeric value from Price
                  const numericValue = parseFloat(
                    data.Price.replace(/[^\d.]/g, "")
                  );

                  // Convert the value to thousand
                  let convertedPrice = numericValue;
                  if (data.Price.includes("Lac")) {
                    convertedPrice *= 100;
                  } else if (data.Price.includes("Crore")) {
                    convertedPrice *= 10000;
                  }
                  // Store the converted value in ConvertedPrice
                  data.ConvertedPrice = convertedPrice;
                } else {
                  // If Price does not contain 'Lacs' or 'crore', remove 'Rs' and divide by 1000
                  const numericValue = parseFloat(
                    data.Price.replace(/[^\d.]/g, "")
                  );
                  data.ConvertedPrice = numericValue / 1000;
                }
                break;
              case "component__light_text 2":
                let areaType = rowData[index]
                  .replace(/^\|/, "")
                  .replace(/:$/, "");
                data.AreaType = areaType.trim();
                data.AreaType = data.AreaType.replace(/Area/gi, "");
                break;
              case "component__main_text 2":
                let totalArea = rowData[index].split(" ");
                data.TotalArea =
                  totalArea.length > 1 ? totalArea[0].trim() : null;
                data.AreaUnit =
                  totalArea.length > 1 ? totalArea[1].trim() : null;
                break;
              case "component__sub_wrap":
                data.ListingID = rowData[index].replace(":", "");
                break;
              case "component__main_text 3":
                data.ListedDate = rowData[index]
                  ? moment(rowData[index], "DD MMM YYYY").format("YYYY-MM-DD")
                  : null;
                break;
              case "component__main_text 4":
                data.ExpiryDate = rowData[index]
                  ? moment(rowData[index], "DD MMM YYYY").format("YYYY-MM-DD")
                  : null;
                break;
              default:
                break;
            }
          });

          // Check if property with ListingID already exists in the database
          db.query(
            "SELECT * FROM `listing` WHERE `ListingID` = ?",
            [data.ListingID],
            (err, result) => {
              if (err) {
                console.error("Error checking ListingID:", err);
              } else {
                if (result.length > 0) {
                  // Property with ListingID already exists, check if any data needs to be updated
                  const existingProperty = result[0];
                  const updateData = {};
                  if (existingProperty.Title !== data.Title)
                    updateData.Title = data.Title;
                  if (existingProperty.Link !== data.Link)
                    updateData.Link = data.Link;
                  if (existingProperty.Is_Premium !== data.Is_Premium)
                    updateData.Is_Premium = data.Is_Premium;
                  if (existingProperty.AssignedTo !== data.AssignedTo)
                    updateData.AssignedTo = data.AssignedTo;
                  if (existingProperty.Price !== data.Price)
                    updateData.Price = data.Price;
                  if (existingProperty.ConvertedPrice !== data.ConvertedPrice)
                    updateData.ConvertedPrice = data.ConvertedPrice;
                  if (existingProperty.AreaType !== data.AreaType)
                    updateData.AreaType = data.AreaType;
                  if (existingProperty.TotalArea !== data.TotalArea)
                    updateData.TotalArea = data.TotalArea;
                  if (existingProperty.AreaUnit !== data.AreaUnit)
                    updateData.AreaUnit = data.AreaUnit;
                  if (existingProperty.ListedDate !== data.ListedDate)
                    updateData.ListedDate = data.ListedDate;
                  if (existingProperty.ExpiryDate !== data.ExpiryDate)
                    updateData.ExpiryDate = data.ExpiryDate;
                  if (
                    existingProperty.PropertyCategory !== data.PropertyCategory
                  )
                    updateData.PropertyCategory = data.PropertyCategory;
                  if (existingProperty.PropertyType !== data.PropertyType)
                    updateData.PropertyType = data.PropertyType;
                  if (existingProperty.Score !== data.Score)
                    updateData.Score = data.Score;
                  if (existingProperty.MissingData !== data.MissingData)
                    updateData.MissingData = data.MissingData;
                  if (existingProperty.Credit !== data.Credit)
                    updateData.Credit = data.Credit;
                  if (
                    existingProperty.LocalityPercentage !==
                    data.LocalityPercentage
                  )
                    updateData.LocalityPercentage = data.LocalityPercentage;

                  // Update the existing property if any data needs to be updated
                  if (Object.keys(updateData).length > 0) {
                    db.query(
                      "UPDATE `listing` SET ? WHERE `ListingID` = ?",
                      [updateData, data.ListingID],
                      (err, result) => {
                        if (err) {
                          console.error("Error updating property:", err);
                        } else {
                          console.log("Property updated:", data.ListingID);
                        }
                      }
                    );
                  } else {
                    console.log("No changes to property:", data.ListingID);
                  }
                } else {
                  // Property with ListingID does not exist, insert new property
                  db.query(
                    "INSERT INTO `listing` SET ?",
                    data,
                    (err, result) => {
                      if (err) {
                        console.error("Error inserting row:", err);
                      } else {
                        console.log("Row inserted:", result.insertId);
                      }
                    }
                  );
                }

                // Insert new properties into the database
                const insertValues = dataRows.map((row) => [
                  row.Title,
                  row.Link,
                  row.Is_Premium,
                  row.AssignedTo,
                  row.Price,
                  row.ConvertedPrice,
                  row.AreaType,
                  row.TotalArea,
                  row.AreaUnit,
                  row.ListingID,
                  row.ListedDate,
                  row.ExpiryDate,
                  row.PropertyCategory,
                  row.PropertyType,
                  row.Score,
                  row.MissingData,
                  row.Credit,
                  row.LocalityPercentage,
                ]);
                if (insertValues.length > 0) {
                  const sql =
                    "INSERT INTO `listing` (`Title`,`Link`, `Is_Premium`, `AssignedTo`, `Price`,`ConvertedPrice`, `AreaType`, `TotalArea`, `AreaUnit`, `ListingID`, `ListedDate`, `ExpiryDate`,`PropertyCategory`,`PropertyType`,`Score`,`MissingData`,`Credit`,`LocalityPercentage`) VALUES ?";
                  db.query(sql, [insertValues], (err, result) => {
                    if (err) {
                      console.error("Error inserting rows:", err);
                    } else {
                      console.log("Rows inserted");
                    }
                  });
                }
              }
            }
          );
        }
      });

      res.status(200).send("Data processed.");
    })
    .catch((error) => {
      console.error("Error reading file:", error);
      res.status(500).send("Error reading file.");
    });
});
