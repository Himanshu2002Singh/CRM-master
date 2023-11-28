const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect to the database
const port = 3000;
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'applaud_solution',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Successfully connected to the database');
  }
});



  
// globaly code for all upload file section.............................................................. 
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append a timestamp to the file name
  },
});

const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// close globaly all upload file section................................................................................

// add employee section ..............................................................................................

app.post('/api/addEmployee', upload.single('img'), (req, res) => {
  try {
    const employeeData = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Add imagePath to employeeData if an image is uploaded
    if (imagePath) {
      employeeData.img = req.file.originalname; // store the original filename
    }

    db.query('INSERT INTO employees SET ?', employeeData, (err, result) => {
      if (err) {
        console.error('MySQL insertion error:', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        res.json({ success: true, message: 'Employee added successfully', data: result });
      }
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// close add employe section.........................................................................................

// all employee section......................................................................................................
  
// display 
app.get('/allemployees', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  
  // add
  app.post('/allemployees', (req, res) => {
    const newEmployee = req.body;
    const query = 'INSERT INTO employees SET ?';
    db.query(query, newEmployee, (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId });
    });
  });
    
  // update
  app.put('/allemployees/:id', (req, res) => {
    const employeeId = req.params.id;
    const updatedEmployee = req.body;
    const query = 'UPDATE employees SET ? WHERE id = ?';
    db.query(query, [updatedEmployee, employeeId], (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });

  // delete
  
  app.delete('/allemployees/:id', (req, res) => {
    const employeeId = req.params.id;
    const query = 'DELETE FROM employees WHERE id = ?';
    db.query(query, employeeId, (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });

// close all employees section................................................................................................

// Edit employee section.....................................................................................

app.put('/api/editEmployee/:id', (req, res) => {
    const id = req.params.id;
    const updatedEmployeeData = req.body;
  
    
    db.query(
      'UPDATE employees SET ? WHERE id = ?',
      [updatedEmployeeData, id],
      (error, results) => {
        if (error) {
          console.error('Error updating employee:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Employee updated successfully:', results);
          res.status(200).json({ message: 'Employee updated successfully' });
        }
      }
    );
  });
  


// close edit employee section........................................................................................

// All Leave section  ..................................................................................................

// Get all leaves
app.get('/api/leaves', (req, res) => {
    db.query('SELECT * FROM leaves', (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });
  
  // Add a new leave
  app.post('/api/leaves', (req, res) => {
    const newLeave = req.body;
    db.query('INSERT INTO leaves SET ?', newLeave, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });
  
  app.put('/api/leaves/:id', (req, res) => {
    const leaveId = req.params.id;
    const updatedLeave = req.body;
    db.query('UPDATE leaves SET ? WHERE id = ?', [updatedLeave, leaveId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Leave updated successfully');
      }
    });
  });
  
  
  // Delete a leave by ID
  app.delete('/api/leaves/:id', (req, res) => {
    const leaveId = req.params.id;
    db.query('DELETE FROM leaves WHERE id = ?', leaveId, (error, results) => {
       if (error) throw error;
      res.json(results);
    });
  });


// Close All leave section .......................................................................................


// API to get leave types from MySQL
app.get('/api/leavetypes', (req, res) => {
    const query = 'SELECT * FROM leaves'; // Replace 'leavetypes' with your actual table name
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching leave types from the database');
      } else {
        res.status(200).json(results);
      }
    });
  });

  app.put('/api/leavetypes/:id', (req, res) => {
    const leaveId = req.params.id;
    const updatedLeave = req.body;
    db.query('UPDATE leaves SET ? WHERE id = ?', [updatedLeave, leaveId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Leave updated successfully');
      }
    });
  });
  
  
  // Delete a leave by ID
  app.delete('/api/leavetypes/:id', (req, res) => {
    const leaveId = req.params.id;
    db.query('DELETE FROM leaves WHERE id = ?', leaveId, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });




  // leave balance 

  app.get('/api/leavesbalance', (req, res) => {
    db.query('SELECT * FROM leaves', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results);
    });
});


// project section

app.post('/api/addprojects',upload.single('fileUpload'), (req, res) => {
    const projectData = req.body;

    // Validate projectData here if needed

    db.query('INSERT INTO projects SET ?', projectData, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json({ success: true });
    });
});

app.get('/projects', (req, res) => {
    db.query('SELECT * FROM projects', (err, results) => {
      if (err) {
        console.error('Error fetching projects:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });
  
  app.put('/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const { name, status1, description, deadline, priority, open_task, type, created, team_leader, progress } = req.body;
    const query = 'UPDATE projects SET name=?, status1=?, description=?, deadline=?, priority=?, open_task=?, type=?, created=?, team_leader=?, progress=? WHERE id=?';
    const values = [name, status1, description, deadline, priority, open_task, type, created, team_leader, progress, projectId];
    db.query(query, values, (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.status(200).send();
    });
  });


  // API endpoint to create a new project
  app.post('/projects', (req, res) => {
    const projectData = req.body;
  
    db.query(
      'INSERT INTO projects SET ?', projectData, (err, result)=> {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
          res.json(result);
        }
      
    );
  });
  
  // API endpoint to delete a project
  app.delete('/projects/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('DELETE FROM projects WHERE id = ?', [id], err => {
      if (err) {
        console.error('Error deleting project:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Project deleted successfully');
      }
    });
  });
  

// signin

// Register a new user
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  pool.query(insertQuery, [username, email, password], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const userId = results.insertId;
      const newUser = { id: userId, username, email, password };
      res.json(newUser);
    }
  });
});




app.listen(port, () => {
  console.log(`Server is running successfully on port ${port}`);
});
