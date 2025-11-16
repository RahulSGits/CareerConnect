const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
    fs.mkdirSync('uploads/resumes');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check if file is PDF
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// MySQL Connection with environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root1234',
    database: process.env.DB_NAME || 'internship_placement',
    port: process.env.DB_PORT || 3306
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes (same as your original routes)
// Register User
app.post('/api/register', (req, res) => {
    const { name, email, password, userType, major, academicYear, industry, website } = req.body;

    // Check if email exists in any table using separate queries
    const checkStudents = 'SELECT email FROM students WHERE email = ?';
    const checkCompanies = 'SELECT email FROM companies WHERE email = ?';
    const checkAdmins = 'SELECT email FROM admins WHERE email = ?';

    db.query(checkStudents, [email], (err, studentResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        db.query(checkCompanies, [email], (err, companyResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            db.query(checkAdmins, [email], (err, adminResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (studentResults.length > 0 || companyResults.length > 0 || adminResults.length > 0) {
                    return res.status(400).json({ error: 'User already exists' });
                }

                // Continue with registration...
                let table, insertQuery, insertParams;

                if (userType === 'student') {
                    table = 'students';
                    insertQuery = 'INSERT INTO students (name, email, password, major, academic_year) VALUES (?, ?, ?, ?, ?)';
                    insertParams = [name, email, password, major, academicYear];
                } else if (userType === 'company') {
                    table = 'companies';
                    insertQuery = 'INSERT INTO companies (name, email, password, industry, website) VALUES (?, ?, ?, ?, ?)';
                    insertParams = [name, email, password, industry, website];
                } else {
                    return res.status(400).json({ error: 'Invalid user type' });
                }

                db.query(insertQuery, insertParams, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Registration failed' });
                    }
                    
                    const user = {
                        id: result.insertId,
                        name,
                        email,
                        userType
                    };
                    
                    res.json({ 
                        message: 'Registration successful', 
                        user
                    });
                });
            });
        });
    });
});

// Login User
app.post('/api/login', (req, res) => {
    const { email, password, userType } = req.body;

    let table, query;
    
    if (userType === 'student') {
        table = 'students';
    } else if (userType === 'company') {
        table = 'companies';
    } else if (userType === 'admin') {
        table = 'admins';
    } else {
        return res.status(400).json({ error: 'Invalid user type' });
    }

    query = `SELECT * FROM ${table} WHERE email = ?`;
    
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = results[0];
        
        // password check from database
        if (password !== user.password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: userType
        };

        res.json({ 
            message: 'Login successful', 
            user: userData
        });
    });
});

// Update Student Profile
app.put('/api/students/:id', (req, res) => {
    const { name, email, major, academicYear } = req.body;
    const studentId = req.params.id;

    const query = 'UPDATE students SET name = ?, email = ?, major = ?, academic_year = ? WHERE id = ?';
    
    db.query(query, [name, email, major, academicYear, studentId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    });
});

// Update Company Profile
app.put('/api/companies/:id', (req, res) => {
    const { name, email, industry, website } = req.body;
    const companyId = req.params.id;

    const query = 'UPDATE companies SET name = ?, email = ?, industry = ?, website = ? WHERE id = ?';
    
    db.query(query, [name, email, industry, website, companyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    });
});

// Delete Student Account
app.delete('/api/students/:id', (req, res) => {
    const studentId = req.params.id;

    const query = 'DELETE FROM students WHERE id = ?';
    
    db.query(query, [studentId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete account' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Account deleted successfully' });
    });
});

// Delete Company Account
app.delete('/api/companies/:id', (req, res) => {
    const companyId = req.params.id;

    const query = 'DELETE FROM companies WHERE id = ?';
    
    db.query(query, [companyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete account' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json({ message: 'Account deleted successfully' });
    });
});

// Get all jobs
app.get('/api/jobs', (req, res) => {
    const query = `
        SELECT j.*, c.name as companyName 
        FROM jobs j 
        JOIN companies c ON j.company_id = c.id 
        ORDER BY j.posted_date DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get jobs by company
app.get('/api/jobs/company/:companyId', (req, res) => {
    const query = 'SELECT * FROM jobs WHERE company_id = ? ORDER BY posted_date DESC';
    
    db.query(query, [req.params.companyId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Post new job
app.post('/api/jobs', (req, res) => {
    const { companyId, title, description, requirements, location, type } = req.body;
    
    const query = 'INSERT INTO jobs (company_id, title, description, requirements, location, type) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [companyId, title, description, requirements, location, type], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to post job' });
        }
        res.json({ message: 'Job posted successfully', jobId: result.insertId });
    });
});

// Delete job
app.delete('/api/jobs/:jobId', (req, res) => {
    const query = 'DELETE FROM jobs WHERE id = ?';
    
    db.query(query, [req.params.jobId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete job' });
        }
        res.json({ message: 'Job deleted successfully' });
    });
});

// APPLICATION ROUTES

// Apply for job with resume upload
app.post('/api/applications', upload.single('resume'), (req, res) => {
    const { studentId, jobId } = req.body;
    const resumeFile = req.file ? req.file.filename : null;

    // Check if already applied
    const checkQuery = 'SELECT * FROM applications WHERE student_id = ? AND job_id = ?';
    db.query(checkQuery, [studentId, jobId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ error: 'Already applied for this job' });
        }

        const insertQuery = 'INSERT INTO applications (student_id, job_id, resume_file) VALUES (?, ?, ?)';
        db.query(insertQuery, [studentId, jobId, resumeFile], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to submit application' });
            }
            res.json({ message: 'Application submitted successfully' });
        });
    });
});

// Get student applications
app.get('/api/applications/student/:studentId', (req, res) => {
    const query = `
        SELECT a.*, j.title as jobTitle, c.name as companyName 
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        JOIN companies c ON j.company_id = c.id 
        WHERE a.student_id = ? 
        ORDER BY a.applied_date DESC
    `;
    
    db.query(query, [req.params.studentId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get company applications
app.get('/api/applications/company/:companyId', (req, res) => {
    const query = `
        SELECT a.*, j.title as jobTitle, s.name as studentName, s.email as studentEmail, s.major as studentMajor, a.resume_file
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        JOIN students s ON a.student_id = s.id 
        WHERE j.company_id = ? 
        ORDER BY a.applied_date DESC
    `;
    
    db.query(query, [req.params.companyId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Update application status
app.put('/api/applications/:applicationId', (req, res) => {
    const { status } = req.body;
    const query = 'UPDATE applications SET status = ? WHERE id = ?';
    
    db.query(query, [status, req.params.applicationId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update application' });
        }
        res.json({ message: 'Application updated successfully' });
    });
});

// Download resume
app.get('/api/resume/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', 'resumes', filename);
    
    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(404).json({ error: 'File not found' });
        }
    });
});

// ADMIN ROUTES

// Get all students
app.get('/api/students', (req, res) => {
    const query = 'SELECT id, name, email, major, academic_year as academicYear, created_at as registeredDate FROM students ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get all companies
app.get('/api/companies', (req, res) => {
    const query = 'SELECT id, name, email, industry, website, created_at as registeredDate FROM companies ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

//store messages from contact us form
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    const query = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
    
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to send message' });
        }
        
        res.json({ message: 'Message sent successfully! We will get back to you soon.' });
    });
});

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'CareerConnect API is running!' });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
