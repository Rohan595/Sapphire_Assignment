const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "expense_db",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});

// Create Expense Table if not exists
const createExpenseTable = `CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_name VARCHAR(255) NOT NULL,
  employee_code VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  expense_category VARCHAR(255) NOT NULL,
  expense_subcategory VARCHAR(255) NOT NULL,
  claim_amount DECIMAL(10, 2) NOT NULL,
  expense_date DATE NOT NULL,
  expense_location VARCHAR(255) NOT NULL,
  bill_attachment VARCHAR(255) NOT NULL,
  remarks VARCHAR(255) NOT NULL
)`;

db.query(createExpenseTable, (err, result) => {
  if (err) {
    throw err;
  }
  console.log("Expense table created or already exists");
});

// API Endpoints

// Create Expense
app.post("/expenses", (req, res) => {
  const {
    employee_name,
    employee_code,
    designation,
    department,
    expense_category,
    expense_subcategory,
    claim_amount,
    expense_date,
    expense_location,
    bill_attachment,
    remarks,
  } = req.body;
  const insertExpenseQuery = `INSERT INTO expenses (employee_name, employee_code, designation, department, expense_category, expense_subcategory, claim_amount, expense_date, expense_location, bill_attachment, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    insertExpenseQuery,
    [
      employee_name,
      employee_code,
      designation,
      department,
      expense_category,
      expense_subcategory,
      claim_amount,
      expense_date,
      expense_location,
      bill_attachment,
      remarks,
    ],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send("Expense added successfully");
      }
    }
  );
});

// Get All Expenses
app.get("/expenses", (req, res) => {
  const getAllExpensesQuery = `SELECT * FROM expenses`;
  db.query(getAllExpensesQuery, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

// Update Expense by ID
app.put("/expenses/:id", (req, res) => {
  const id = req.params.id;
  const {
    employee_name,
    employee_code,
    designation,
    department,
    expense_category,
    expense_subcategory,
    claim_amount,
    expense_date,
    expense_location,
    bill_attachment,
    remarks,
  } = req.body;
  const updateExpenseQuery = `UPDATE expenses SET employee_name=?, employee_code=?, designation=?, department=?, expense_category=?, expense_subcategory=?, claim_amount=?, expense_date=?, expense_location=?, bill_attachment=?, remarks=? WHERE id=?`;
  db.query(
    updateExpenseQuery,
    [
      employee_name,
      employee_code,
      designation,
      department,
      expense_category,
      expense_subcategory,
      claim_amount,
      expense_date,
      expense_location,
      bill_attachment,
      remarks,
      id,
    ],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send("Expense updated successfully");
      }
    }
  );
});

// Delete Expense by ID
app.delete("/expenses/:id", (req, res) => {
  const id = req.params.id;
  const deleteExpenseQuery = `DELETE FROM expenses WHERE id=?`;
  db.query(deleteExpenseQuery, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Expense deleted successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
