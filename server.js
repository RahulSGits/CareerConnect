const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: [
        'https://career-connect-01.netlify.app/',
        'http://localhost:3000',
        'http://localhost:5001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
    fs.mkdirSync('uploads/resumes');
    fs.mkdirSync('uploads/profile_photos');
}

// Configure multer for resume uploads
const resumeStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const resumeUpload = multer({ 
    storage: resumeStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// Configure multer for profile photo uploads
const profilePhotoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile_photos/');
    },
    filename: function (req, file, cb) {
        const userId = req.params.userId;
        const fileExtension = path.extname(file.originalname);
        cb(null, `profile_${userId}${fileExtension}`);
    }
});

const profilePhotoUpload = multer({ 
    storage: profilePhotoStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root1234',
    database: process.env.DB_NAME || 'internship_placement'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// Register User
app.post('/api/register', (req, res) => {
    const { name, email, password, userType, major, academicYear, industry, website } = req.body;

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
                    
                    // Email sending removed
                    console.log(`New ${userType} registered: ${name} (${email})`);
                    
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
        
        if (password !== user.password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: userType,
            major: user.major,
            academicYear: user.academic_year,
            industry: user.industry,
            website: user.website
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

// Upload Profile Photo
app.post('/api/upload-profile-photo/:userId/:userType', profilePhotoUpload.single('profilePhoto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const userId = req.params.userId;
    const userType = req.params.userType;
    const photoPath = `/uploads/profile_photos/${req.file.filename}`;
    
    let updateQuery;
    if (userType === 'student') {
        updateQuery = 'UPDATE students SET profile_photo = ? WHERE id = ?';
    } else if (userType === 'company') {
        updateQuery = 'UPDATE companies SET profile_photo = ? WHERE id = ?';
    } else {
        return res.status(400).json({ error: 'Invalid user type' });
    }
    
    db.query(updateQuery, [photoPath, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update profile photo' });
        }
        
        res.json({ 
            message: 'Profile photo uploaded successfully',
            photoPath: photoPath
        });
    });
});

// Get Profile Photo
app.get('/api/profile-photo/:userId/:userType', (req, res) => {
    const userId = req.params.userId;
    const userType = req.params.userType;
    
    let query;
    if (userType === 'student') {
        query = 'SELECT profile_photo FROM students WHERE id = ?';
    } else if (userType === 'company') {
        query = 'SELECT profile_photo FROM companies WHERE id = ?';
    } else {
        return res.status(400).json({ error: 'Invalid user type' });
    }
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const photoPath = results[0].profile_photo;
        if (!photoPath) {
            return res.status(404).json({ error: 'No profile photo found' });
        }
        
        res.json({ photoPath });
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
        WHERE j.status = 'active'
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

// Get job by ID
app.get('/api/jobs/:jobId', (req, res) => {
    const query = `
        SELECT j.*, c.name as companyName 
        FROM jobs j 
        JOIN companies c ON j.company_id = c.id 
        WHERE j.id = ?
    `;
    
    db.query(query, [req.params.jobId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        res.json(results[0]);
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

// Apply for job with resume upload
app.post('/api/applications', resumeUpload.single('resume'), (req, res) => {
    const { studentId, jobId } = req.body;
    const resumeFile = req.file ? req.file.filename : null;

    const checkQuery = 'SELECT * FROM applications WHERE student_id = ? AND job_id = ?';
    db.query(checkQuery, [studentId, jobId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            const insertQuery = 'INSERT INTO applications (student_id, job_id, resume_file) VALUES (?, ?, ?)';
            db.query(insertQuery, [studentId, jobId, resumeFile], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Failed to submit application' });
                }
                
                // Email sending removed - just log to console
                console.log(`✅ Application submitted: Student ${studentId} for Job ${jobId}`);
                
                res.json({ message: 'Application submitted successfully' });
            });
        } else {
            return res.status(400).json({ error: 'Already applied for this job' });
        }
    });
});

// Get student applications
app.get('/api/applications/student/:studentId', (req, res) => {
    const query = `
        SELECT a.*, j.title as jobTitle, c.name as companyName, 
               a.interview_date, a.interview_time, a.interview_mode, 
               a.interview_location, a.interview_notes
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
        SELECT a.*, j.title as jobTitle, s.name as studentName, s.email as studentEmail, 
               s.major as studentMajor, a.resume_file,
               a.interview_date, a.interview_time, a.interview_mode, 
               a.interview_location, a.interview_notes
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

// Get application by ID
app.get('/api/applications/:applicationId', (req, res) => {
    const query = `
        SELECT a.*, s.name as studentName, s.email as studentEmail, j.title as jobTitle
        FROM applications a
        JOIN students s ON a.student_id = s.id
        JOIN jobs j ON a.job_id = j.id
        WHERE a.id = ?
    `;
    
    db.query(query, [req.params.applicationId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        res.json(results[0]);
    });
});

// Update application status
app.put('/api/applications/:applicationId', (req, res) => {
    const { status, interview_date, interview_time, interview_mode, interview_location, interview_notes } = req.body;
    
    let query, params;
    
    if (status === 'interview') {
        query = 'UPDATE applications SET status = ?, interview_date = ?, interview_time = ?, interview_mode = ?, interview_location = ?, interview_notes = ? WHERE id = ?';
        params = [status, interview_date, interview_time, interview_mode, interview_location, interview_notes, req.params.applicationId];
    } else {
        query = 'UPDATE applications SET status = ? WHERE id = ?';
        params = [status, req.params.applicationId];
    }
    
    db.query(query, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update application' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Email sending removed - just log to console
        console.log(`✅ Application ${req.params.applicationId} updated to status: ${status}`);
        
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

// Store contact messages
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

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    res.status(500).json({ error: error.message });
});

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'CareerConnect API is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Email functionality removed`);
    console.log(`Database: internship_placement`);
});
