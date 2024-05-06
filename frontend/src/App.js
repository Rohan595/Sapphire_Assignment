import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

function App() {
  const categorySubcategoryMap = {
    Food: ["Beverage", "Snacks", "Meal"],
    Travel: ["Flight", "Train", "Bus"],
    Accommodation: ["Hotel", "Hostel", "Guest House"],
    // Add more categories and subcategories as needed
  };

  const designationClaimLimitMap = {
    CEO: 10000,
    Manager: 7000,
    // Add more designations and their claim amount limits as needed
  };

  const [selectedValues, setSelectedvalues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [designation, setDesignation] = useState("");
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_code: "",
    designation: "",
    department: "",
    expense_category: "",
    expense_subcategory: "",
    claim_amount: "",
    claim_amount_error: "",
    expense_date: "",
    expense_location: "",
    bill_attachment: "",
    remarks: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "expense_subcategory") {
      setSelectedvalues(value); // Update selectedValues directly
    } else if (name === "designation") {
      const claimLimit = designationClaimLimitMap[value];
      const claimAmount = parseInt(formData.claim_amount);
      if (claimAmount > claimLimit) {
        setFormData({
          ...formData,
          [name]: value,
          claim_amount_error: `Claim amount cannot exceed ${claimLimit}`,
        });
      } else {
        setFormData({ ...formData, [name]: value, claim_amount_error: "" });
      }
    } else if (name === "claim_amount") {
      const claimLimit = designationClaimLimitMap[formData.designation];
      const newClaimAmount = parseInt(value);
      if (newClaimAmount > claimLimit) {
        setFormData({
          ...formData,
          claim_amount: value,
          claim_amount_error: `Claim amount cannot exceed ${claimLimit}`,
        });
      } else {
        setFormData({
          ...formData,
          claim_amount: value,
          claim_amount_error: "",
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post formData to backend
      await axios.post("http://localhost:5000/expenses", {
        ...formData,
        expense_subcategory: selectedValues.join(", ").trim(),
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Expense Claim Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee Name"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee Code"
              name="employee_code"
              value={formData.employee_code}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Designation</InputLabel>
              <Select
                value={formData.designation}
                onChange={handleChange}
                name="designation"
              >
                <MenuItem value="CEO">CEO</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                {/* Add more designations if needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Expense Category</InputLabel>
              <Select
                value={formData.expense_category}
                onChange={handleChange}
                name="expense_category"
              >
                {Object.keys(categorySubcategoryMap).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Expense Subcategory</InputLabel>
              <Select
                multiple
                value={selectedValues}
                onChange={handleChange}
                name="expense_subcategory"
              >
                {categorySubcategoryMap[formData.expense_category]?.map(
                  (subcategory) => (
                    <MenuItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </MenuItem>
                  )
                )}
                {/* Add more subcategories if needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Claim Amount"
              name="claim_amount"
              value={formData.claim_amount}
              onChange={handleChange}
              type="number"
              fullWidth
              required
              error={Boolean(formData.claim_amount_error)}
              helperText={formData.claim_amount_error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Expense Date"
              name="expense_date"
              value={formData.expense_date}
              onChange={handleChange}
              type="date"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Expense Location"
              name="expense_location"
              value={formData.expense_location}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bill Attachment"
              name="bill_attachment"
              value={formData.bill_attachment}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>

      <Typography variant="h4" gutterBottom>
        Expenses
      </Typography>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.employee_name}: {expense.claim_amount}
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default App;
