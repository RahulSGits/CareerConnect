const API_BASE_URL = 'http://localhost:5001/api';

// DOM Elements
const navbar = document.querySelector('.navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const homeLink = document.getElementById('homeLink');
const aboutLink = document.getElementById('aboutLink');
const contactLink = document.getElementById('contactLink');
const loginNavLink = document.getElementById('loginNavLink');
const registerNavLink = document.getElementById('registerNavLink');

const homepageSection = document.getElementById('homepageSection');
const aboutSection = document.getElementById('aboutSection');
const contactSection = document.getElementById('contactSection');
const demoAccountsSection = document.getElementById('demoAccountsSection');
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const dashboardSection = document.getElementById('dashboardSection');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const contactForm = document.getElementById('contactForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');

const userTypeSelect = document.getElementById('userType');
const regUserTypeSelect = document.getElementById('regUserType');
const studentFields = document.getElementById('studentFields');
const companyFields = document.getElementById('companyFields');

// Dashboard elements
const studentDashboard = document.getElementById('studentDashboard');
const companyDashboard = document.getElementById('companyDashboard');
const adminDashboard = document.getElementById('adminDashboard');
const dashboardTitle = document.getElementById('dashboardTitle');

// Student dashboard elements
const viewJobsBtn = document.getElementById('viewJobsBtn');
const myApplicationsBtn = document.getElementById('myApplicationsBtn');
const jobsContainer = document.getElementById('jobsContainer');
const applicationsContainer = document.getElementById('applicationsContainer');

// Company dashboard elements
const postJobBtn = document.getElementById('postJobBtn');
const viewPostedJobsBtn = document.getElementById('viewPostedJobsBtn');
const viewApplicationsBtn = document.getElementById('viewApplicationsBtn');
const postJobFormContainer = document.getElementById('postJobFormContainer');
const postJobForm = document.getElementById('postJobForm');
const companyJobsContainer = document.getElementById('companyJobsContainer');
const companyApplicationsContainer = document.getElementById('companyApplicationsContainer');

// Admin dashboard elements
const manageStudentsBtn = document.getElementById('manageStudentsBtn');
const manageCompaniesBtn = document.getElementById('manageCompaniesBtn');
const viewAllJobsBtn = document.getElementById('viewAllJobsBtn');
const viewAllApplicationsBtn = document.getElementById('viewAllApplicationsBtn');
const adminContentContainer = document.getElementById('adminContentContainer');

// Profile Management Elements
const profilePhoto = document.getElementById('profilePhoto');
const photoUpload = document.getElementById('photoUpload');
const modalProfilePhoto = document.getElementById('modalProfilePhoto');
const modalPhotoUpload = document.getElementById('modalPhotoUpload');
const profileModal = document.getElementById('profileModal');
const closeProfileModalBtn = document.querySelector('#profileModal .close_btn');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');

// Modal elements
const resumeModal = document.getElementById('resumeModal');
const resumeUploadForm = document.getElementById('resumeUploadForm');
const closeResumeModalBtn = document.querySelector('#resumeModal .close_btn');
const cancelModalBtn = document.querySelector('.cancel_btn');
const applyJobIdInput = document.getElementById('applyJobId');

// Interview Modal elements
const interviewModal = document.getElementById('interviewModal');
const interviewForm = document.getElementById('interviewForm');
const closeInterviewModalBtn = document.querySelector('#interviewModal .close_btn');
const cancelInterviewBtn = document.querySelector('#interviewModal .cancel_btn');
const interviewApplicationIdInput = document.getElementById('interviewApplicationId');

// Notification container
const notificationContainer = document.getElementById('notificationContainer');

// Current user data
let currentUser = null;
let currentJobId = null;
let currentApplicationId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showHomepage();
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    // Navigation
    hamburger.addEventListener('click', toggleMobileMenu);
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHomepage();
        closeMobileMenu();
    });
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAbout();
        closeMobileMenu();
    });
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        showContact();
        closeMobileMenu();
    });
    loginNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
        closeMobileMenu();
    });
    registerNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
        closeMobileMenu();
    });

    // Homepage buttons
    getStartedBtn.addEventListener('click', showLogin);
    learnMoreBtn.addEventListener('click', showAbout);

    // Auth forms
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        showRegister();
    });
    
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLogin();
    });
    
    regUserTypeSelect.addEventListener('change', function() {
        studentFields.style.display = this.value === 'student' ? 'block' : 'none';
        companyFields.style.display = this.value === 'company' ? 'block' : 'none';
    });
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    contactForm.addEventListener('submit', handleContact);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Student dashboard actions
    viewJobsBtn.addEventListener('click', function() {
        showStudentJobs();
    });
    
    myApplicationsBtn.addEventListener('click', function() {
        showStudentApplications();
    });
    
    // Company dashboard actions
    postJobBtn.addEventListener('click', function() {
        showPostJobForm();
    });
    
    viewPostedJobsBtn.addEventListener('click', function() {
        showCompanyJobs();
    });
    
    viewApplicationsBtn.addEventListener('click', function() {
        showCompanyApplications();
    });
    
    // Post job form submission
    postJobForm.addEventListener('submit', handlePostJob);
    
    // Admin dashboard actions
    manageStudentsBtn.addEventListener('click', function() {
        loadAllStudents();
    });
    
    manageCompaniesBtn.addEventListener('click', function() {
        loadAllCompanies();
    });
    
    viewAllJobsBtn.addEventListener('click', function() {
        loadAllJobs();
    });
    
    viewAllApplicationsBtn.addEventListener('click', function() {
        loadAllApplications();
    });

    // Profile Management Events
    profilePhoto.addEventListener('click', showProfileModal);
    photoUpload.addEventListener('change', handlePhotoUpload);
    modalPhotoUpload.addEventListener('change', handleModalPhotoUpload);
    closeProfileModalBtn.addEventListener('click', hideProfileModal);
    saveProfileBtn.addEventListener('click', saveProfileChanges);
    deleteAccountBtn.addEventListener('click', deleteAccount);

    // Modal events
    closeResumeModalBtn.addEventListener('click', closeResumeModal);
    cancelModalBtn.addEventListener('click', closeResumeModal);
    resumeUploadForm.addEventListener('submit', handleResumeUpload);
    
    // Interview modal events
    closeInterviewModalBtn.addEventListener('click', closeInterviewModal);
    cancelInterviewBtn.addEventListener('click', closeInterviewModal);
    interviewForm.addEventListener('submit', handleInterviewSchedule);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === resumeModal) {
            closeResumeModal();
        }
        if (e.target === profileModal) {
            hideProfileModal();
        }
        if (e.target === interviewModal) {
            closeInterviewModal();
        }
    });
}

// Navigation functions
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

function showHomepage() {
    hideAllSections();
    homepageSection.style.display = 'block';
    updateNavActiveState('home');
}

function showAbout() {
    hideAllSections();
    aboutSection.style.display = 'block';
    updateNavActiveState('about');
}

function showContact() {
    hideAllSections();
    contactSection.style.display = 'block';
    updateNavActiveState('contact');
}

function showLogin() {
    hideAllSections();
    demoAccountsSection.style.display = 'block';
    loginSection.style.display = 'block';
    updateNavActiveState('login');
}

function showRegister() {
    hideAllSections();
    registerSection.style.display = 'block';
    updateNavActiveState('register');
}

function updateNavActiveState(activeSection) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section
    if (activeSection === 'home') homeLink.classList.add('active');
    if (activeSection === 'about') aboutLink.classList.add('active');
    if (activeSection === 'contact') contactLink.classList.add('active');
    if (activeSection === 'login') loginNavLink.classList.add('active');
    if (activeSection === 'register') registerNavLink.classList.add('active');
}

function hideAllSections() {
    homepageSection.style.display = 'none';
    aboutSection.style.display = 'none';
    contactSection.style.display = 'none';
    demoAccountsSection.style.display = 'none';
    loginSection.style.display = 'none';
    registerSection.style.display = 'none';
    dashboardSection.style.display = 'none';
}

// Notification System
function showNotification(title, message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-header">
            <span class="notification-title">${title}</span>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Close button event
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
    
    return notification;
}

// Loading state helper
async function withLoading(callback, button = null) {
    if (button) {
        const originalText = button.textContent;
        button.innerHTML = '<div class="loading"></div> Loading...';
        button.disabled = true;
        
        try {
            await callback();
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    } else {
        await callback();
    }
}

// Auth functions
async function handleLogin(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    await withLoading(async () => {
        const formData = new FormData(loginForm);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
            userType: formData.get('userType')
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                showNotification('Login Successful', `Welcome back, ${currentUser.name}!`, 'success');
                showDashboard();
            } else {
                showNotification('Login Failed', result.error || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Login Error', 'An error occurred during login. Please try again.', 'error');
        }
    }, submitButton);
}

async function handleRegister(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    await withLoading(async () => {
        const formData = new FormData(registerForm);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            userType: formData.get('userType')
        };
        
        // Add additional fields based on user type
        if (userData.userType === 'student') {
            userData.major = formData.get('major');
            userData.academicYear = formData.get('academicYear');
        } else if (userData.userType === 'company') {
            userData.industry = formData.get('industry');
            userData.website = formData.get('website');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Registration Successful', 'Your account has been created! Please login.', 'success');
                registerForm.reset();
                showLogin();
            } else {
                showNotification('Registration Failed', result.error || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('Registration Error', 'An error occurred during registration. Please try again.', 'error');
        }
    }, submitButton);
}

async function handleContact(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    await withLoading(async () => {
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Message Sent', result.message, 'success');
                contactForm.reset();
            } else {
                showNotification('Message Failed', result.error || 'Failed to send message.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showNotification('Message Error', 'An error occurred while sending your message. Please try again.', 'error');
        }
    }, submitButton);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem(`profilePhoto_${currentUser ? currentUser.id : ''}`);
    showNotification('Logged Out', 'You have been successfully logged out.', 'info');
    showHomepage();
    loginForm.reset();
}

// Dashboard functions
function showDashboard() {
    hideAllSections();
    dashboardSection.style.display = 'block';
    
    // Hide all dashboards first
    studentDashboard.style.display = 'none';
    companyDashboard.style.display = 'none';
    adminDashboard.style.display = 'none';
    
    // Show appropriate dashboard based on user type
    if (currentUser.userType === 'student') {
        dashboardTitle.textContent = `Student Dashboard - Welcome, ${currentUser.name}`;
        studentDashboard.style.display = 'block';
        showStudentJobs();
        loadProfilePhoto();
    } else if (currentUser.userType === 'company') {
        dashboardTitle.textContent = `Company Dashboard - Welcome, ${currentUser.name}`;
        companyDashboard.style.display = 'block';
        showCompanyJobs();
        loadProfilePhoto();
    } else if (currentUser.userType === 'admin') {
        dashboardTitle.textContent = `Admin Dashboard - Welcome, ${currentUser.name}`;
        adminDashboard.style.display = 'block';
        adminContentContainer.innerHTML = '<p>Select an option from the menu to manage the system.</p>';
        loadProfilePhoto();
    }
    
    // Update user info in header
    document.getElementById('userEmail').textContent = currentUser.email;
}

// Profile Management Functions
function loadProfilePhoto() {
    const savedPhoto = localStorage.getItem(`profilePhoto_${currentUser.id}`);
    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
    }
}

function showProfileModal() {
    // Populate modal with current user data
    document.getElementById('modalUserName').value = currentUser.name;
    document.getElementById('modalUserEmail').value = currentUser.email;
    document.getElementById('modalUserType').value = currentUser.userType;
    
    // Load current profile photo
    const savedPhoto = localStorage.getItem(`profilePhoto_${currentUser.id}`);
    if (savedPhoto) {
        modalProfilePhoto.src = savedPhoto;
    } else {
        modalProfilePhoto.src = profilePhoto.src;
    }
    
    // Show additional fields based on user type
    if (currentUser.userType === 'student') {
        document.getElementById('studentAdditionalFields').style.display = 'block';
        document.getElementById('companyAdditionalFields').style.display = 'none';
        document.getElementById('modalUserMajor').value = currentUser.major || '';
        document.getElementById('modalUserYear').value = currentUser.academicYear || '';
    } else if (currentUser.userType === 'company') {
        document.getElementById('studentAdditionalFields').style.display = 'none';
        document.getElementById('companyAdditionalFields').style.display = 'block';
        document.getElementById('modalUserIndustry').value = currentUser.industry || '';
        document.getElementById('modalUserWebsite').value = currentUser.website || '';
    } else {
        document.getElementById('studentAdditionalFields').style.display = 'none';
        document.getElementById('companyAdditionalFields').style.display = 'none';
    }
    
    profileModal.style.display = 'flex';
}

function hideProfileModal() {
    profileModal.style.display = 'none';
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePhoto.src = e.target.result;
            localStorage.setItem(`profilePhoto_${currentUser.id}`, e.target.result);
            showNotification('Profile Photo Updated', 'Your profile photo has been updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function handleModalPhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            modalProfilePhoto.src = e.target.result;
            profilePhoto.src = e.target.result;
            localStorage.setItem(`profilePhoto_${currentUser.id}`, e.target.result);
            showNotification('Profile Photo Updated', 'Your profile photo has been updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

async function saveProfileChanges() {
    await withLoading(async () => {
        const updatedData = {
            name: document.getElementById('modalUserName').value,
            email: document.getElementById('modalUserEmail').value
        };
        
        // Add additional fields based on user type
        if (currentUser.userType === 'student') {
            updatedData.major = document.getElementById('modalUserMajor').value;
            updatedData.academicYear = document.getElementById('modalUserYear').value;
        } else if (currentUser.userType === 'company') {
            updatedData.industry = document.getElementById('modalUserIndustry').value;
            updatedData.website = document.getElementById('modalUserWebsite').value;
        }
        
        try {
            let endpoint, method;
            
            if (currentUser.userType === 'student') {
                endpoint = `${API_BASE_URL}/students/${currentUser.id}`;
            } else if (currentUser.userType === 'company') {
                endpoint = `${API_BASE_URL}/companies/${currentUser.id}`;
            } else {
                showNotification('Profile Update', 'Admin profiles cannot be edited through this interface.', 'warning');
                return;
            }
            
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Update current user data
                Object.assign(currentUser, updatedData);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Update dashboard display
                dashboardTitle.textContent = `${currentUser.userType.charAt(0).toUpperCase() + currentUser.userType.slice(1)} Dashboard - Welcome, ${currentUser.name}`;
                document.getElementById('userEmail').textContent = currentUser.email;
                
                showNotification('Profile Updated', 'Your profile has been updated successfully!', 'success');
                hideProfileModal();
            } else {
                showNotification('Profile Update Failed', result.error || 'Failed to update profile.', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Profile Update Error', 'An error occurred while updating profile.', 'error');
        }
    }, saveProfileBtn);
}

async function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }
    
    await withLoading(async () => {
        try {
            let endpoint;
            
            if (currentUser.userType === 'student') {
                endpoint = `${API_BASE_URL}/students/${currentUser.id}`;
            } else if (currentUser.userType === 'company') {
                endpoint = `${API_BASE_URL}/companies/${currentUser.id}`;
            } else {
                showNotification('Account Deletion', 'Admin accounts cannot be deleted through this interface.', 'warning');
                return;
            }
            
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Account Deleted', 'Your account has been deleted successfully!', 'success');
                // Clear profile photo from localStorage
                localStorage.removeItem(`profilePhoto_${currentUser.id}`);
                handleLogout();
            } else {
                showNotification('Account Deletion Failed', result.error || 'Failed to delete account.', 'error');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            showNotification('Account Deletion Error', 'An error occurred while deleting account.', 'error');
        }
    }, deleteAccountBtn);
}

// Student Dashboard Functions
function showStudentJobs() {
    jobsContainer.style.display = 'grid';
    applicationsContainer.style.display = 'none';
    loadJobs();
}

function showStudentApplications() {
    jobsContainer.style.display = 'none';
    applicationsContainer.style.display = 'grid';
    loadStudentApplications();
}

// Company Dashboard Functions
function showPostJobForm() {
    postJobFormContainer.style.display = 'block';
    companyJobsContainer.style.display = 'none';
    companyApplicationsContainer.style.display = 'none';
}

function showCompanyJobs() {
    postJobFormContainer.style.display = 'none';
    companyJobsContainer.style.display = 'grid';
    companyApplicationsContainer.style.display = 'none';
    loadCompanyJobs();
}

function showCompanyApplications() {
    postJobFormContainer.style.display = 'none';
    companyJobsContainer.style.display = 'none';
    companyApplicationsContainer.style.display = 'grid';
    loadCompanyApplications();
}

// Job Functions
async function loadJobs() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        const jobs = await response.json();
        
        if (response.ok) {
            displayJobs(jobs);
        } else {
            console.error('Failed to load jobs');
            showNotification('Error', 'Failed to load jobs. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        showNotification('Error', 'Failed to load jobs. Please check your connection.', 'error');
    }
}

function displayJobs(jobs) {
    jobsContainer.innerHTML = '';
    
    if (jobs.length === 0) {
        jobsContainer.innerHTML = '<div class="card_container"><div class="card_title_container"><p>No job opportunities available at the moment. Please check back later.</p></div></div>';
        return;
    }
    
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'card_container';
        
        jobCard.innerHTML = `
            <div class="card_title_container">
                <h3 class="card_title">${job.title}</h3>
                <p class="card_desc">${job.description}</p>
                <p class="card_details"><strong>Requirements:</strong> ${job.requirements}</p>
                <p class="card_details"><strong>Location:</strong> ${job.location}</p>
                <p class="card_details"><strong>Type:</strong> ${job.type}</p>
                <p class="card_details"><strong>Posted by:</strong> ${job.companyName}</p>
                <p class="card_details"><strong>Posted on:</strong> ${new Date(job.posted_date).toLocaleDateString()}</p>
            </div>
            <div class="card_footer_container">
                <button class="action_button apply_btn" data-job-id="${job.id}">Apply Now</button>
            </div>
        `;
        
        jobsContainer.appendChild(jobCard);
    });
    
    // Add event listeners to apply buttons
    document.querySelectorAll('.apply_btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            openResumeModal(jobId);
        });
    });
}

function openResumeModal(jobId) {
    currentJobId = jobId;
    applyJobIdInput.value = jobId;
    resumeModal.style.display = 'flex';
    resumeUploadForm.reset();
}

function closeResumeModal() {
    resumeModal.style.display = 'none';
    currentJobId = null;
}

async function handleResumeUpload(e) {
    e.preventDefault();
    
    if (!currentJobId) {
        showNotification('Application Error', 'No job selected.', 'error');
        return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    await withLoading(async () => {
        const formData = new FormData(resumeUploadForm);
        formData.append('studentId', currentUser.id);
        formData.append('jobId', currentJobId);
        
        try {
            const response = await fetch(`${API_BASE_URL}/applications`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Application Submitted', 'Your application has been submitted successfully!', 'success');
                closeResumeModal();
                showStudentApplications();
            } else {
                showNotification('Application Failed', result.error || 'Failed to submit application.', 'error');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            showNotification('Application Error', 'An error occurred while applying. Please try again.', 'error');
        }
    }, submitButton);
}

async function loadStudentApplications() {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/student/${currentUser.id}`);
        const applications = await response.json();
        
        if (response.ok) {
            displayStudentApplications(applications);
        } else {
            console.error('Failed to load applications');
            showNotification('Error', 'Failed to load applications.', 'error');
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        showNotification('Error', 'Failed to load applications. Please check your connection.', 'error');
    }
}

function displayStudentApplications(applications) {
    applicationsContainer.innerHTML = '';
    
    if (applications.length === 0) {
        applicationsContainer.innerHTML = '<div class="card_container"><div class="card_title_container"><p>You have not applied for any jobs yet.</p></div></div>';
        return;
    }
    
    applications.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'card_container';
        
        let statusClass = 'status_pending';
        if (app.status === 'approved') statusClass = 'status_approved';
        if (app.status === 'rejected') statusClass = 'status_rejected';
        if (app.status === 'interview') statusClass = 'status_interview';
        
        appCard.innerHTML = `
            <div class="card_title_container">
                <h3 class="card_title">${app.jobTitle}</h3>
                <p class="card_desc">${app.companyName}</p>
                <p class="card_details"><strong>Applied on:</strong> ${new Date(app.applied_date).toLocaleDateString()}</p>
                <p class="card_details"><strong>Status:</strong> <span class="status_badge ${statusClass}">${app.status}</span></p>
                ${app.resume_file ? `<p class="card_details"><strong>Resume:</strong> Uploaded</p>` : ''}
                ${app.interview_date ? `
                    <div class="interview_details">
                        <h4>Interview Scheduled</h4>
                        <p><strong>Date:</strong> ${new Date(app.interview_date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${app.interview_time}</p>
                        <p><strong>Mode:</strong> ${app.interview_mode}</p>
                        <p><strong>Location:</strong> ${app.interview_location}</p>
                        ${app.interview_notes ? `<p><strong>Notes:</strong> ${app.interview_notes}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        
        applicationsContainer.appendChild(appCard);
    });
}

// Company Job Functions
async function handlePostJob(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    await withLoading(async () => {
        const formData = new FormData(postJobForm);
        const jobData = {
            companyId: currentUser.id,
            title: formData.get('title'),
            description: formData.get('description'),
            requirements: formData.get('requirements'),
            location: formData.get('location'),
            type: formData.get('type')
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Job Posted', 'Job posted successfully!', 'success');
                postJobForm.reset();
                showCompanyJobs();
            } else {
                showNotification('Job Posting Failed', result.error || 'Failed to post job.', 'error');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            showNotification('Job Posting Error', 'An error occurred while posting the job. Please try again.', 'error');
        }
    }, submitButton);
}

async function loadCompanyJobs() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/company/${currentUser.id}`);
        const jobs = await response.json();
        
        if (response.ok) {
            displayCompanyJobs(jobs);
        } else {
            console.error('Failed to load company jobs');
            showNotification('Error', 'Failed to load your job posts.', 'error');
        }
    } catch (error) {
        console.error('Error loading company jobs:', error);
        showNotification('Error', 'Failed to load job posts. Please check your connection.', 'error');
    }
}

function displayCompanyJobs(jobs) {
    companyJobsContainer.innerHTML = '';
    
    if (jobs.length === 0) {
        companyJobsContainer.innerHTML = '<div class="card_container"><div class="card_title_container"><p>You have not posted any jobs yet.</p></div></div>';
        return;
    }
    
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'card_container';
        
        jobCard.innerHTML = `
            <div class="card_title_container">
                <h3 class="card_title">${job.title}</h3>
                <p class="card_desc">${job.description}</p>
                <p class="card_details"><strong>Requirements:</strong> ${job.requirements}</p>
                <p class="card_details"><strong>Location:</strong> ${job.location}</p>
                <p class="card_details"><strong>Type:</strong> ${job.type}</p>
                <p class="card_details"><strong>Posted on:</strong> ${new Date(job.posted_date).toLocaleDateString()}</p>
            </div>
            <div class="card_footer_container">
                <button class="action_button delete_job_btn" data-job-id="${job.id}">Delete</button>
            </div>
        `;
        
        companyJobsContainer.appendChild(jobCard);
    });
    
    document.querySelectorAll('.delete_job_btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            deleteJob(jobId);
        });
    });
}

async function deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job posting?')) {
        return;
    }
    
    await withLoading(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Job Deleted', 'Job deleted successfully!', 'success');
                loadCompanyJobs();
            } else {
                showNotification('Job Deletion Failed', result.error || 'Failed to delete job.', 'error');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            showNotification('Job Deletion Error', 'An error occurred while deleting the job. Please try again.', 'error');
        }
    });
}

async function loadCompanyApplications() {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/company/${currentUser.id}`);
        const applications = await response.json();
        
        if (response.ok) {
            displayCompanyApplications(applications);
        } else {
            console.error('Failed to load company applications');
            showNotification('Error', 'Failed to load applications.', 'error');
        }
    } catch (error) {
        console.error('Error loading company applications:', error);
        showNotification('Error', 'Failed to load applications. Please check your connection.', 'error');
    }
}

function displayCompanyApplications(applications) {
    companyApplicationsContainer.innerHTML = '';
    
    if (applications.length === 0) {
        companyApplicationsContainer.innerHTML = '<div class="card_container"><div class="card_title_container"><p>No applications received yet.</p></div></div>';
        return;
    }
    
    applications.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'card_container';
        
        let statusClass = 'status_pending';
        if (app.status === 'approved') statusClass = 'status_approved';
        if (app.status === 'rejected') statusClass = 'status_rejected';
        if (app.status === 'interview') statusClass = 'status_interview';
        
        appCard.innerHTML = `
            <div class="card_title_container">
                <h3 class="card_title">${app.studentName}</h3>
                <p class="card_desc">${app.studentEmail}</p>
                <p class="card_details"><strong>Major:</strong> ${app.studentMajor}</p>
                <p class="card_details"><strong>Applied for:</strong> ${app.jobTitle}</p>
                <p class="card_details"><strong>Applied on:</strong> ${new Date(app.applied_date).toLocaleDateString()}</p>
                <p class="card_details"><strong>Status:</strong> <span class="status_badge ${statusClass}">${app.status}</span></p>
                ${app.interview_date ? `
                    <div class="interview_details">
                        <h4>Interview Scheduled</h4>
                        <p><strong>Date:</strong> ${new Date(app.interview_date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${app.interview_time}</p>
                        <p><strong>Mode:</strong> ${app.interview_mode}</p>
                        <p><strong>Location:</strong> ${app.interview_location}</p>
                        ${app.interview_notes ? `<p><strong>Notes:</strong> ${app.interview_notes}</p>` : ''}
                    </div>
                ` : ''}
            </div>
            <div class="card_footer_container">
                <div class="action_container">
                    ${app.resume_file ? 
                        `<button class="action_button download_btn" data-resume="${app.resume_file}">Download Resume</button>` : 
                        '<button class="action_button" disabled>No Resume</button>'
                    }
                    <button class="action_button approve_btn" data-app-id="${app.id}">Approve</button>
                    <button class="action_button interview_btn" data-app-id="${app.id}">Interview</button>
                    <button class="action_button reject_btn" data-app-id="${app.id}">Reject</button>
                </div>
            </div>
        `;
        
        companyApplicationsContainer.appendChild(appCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.approve_btn').forEach(button => {
        button.addEventListener('click', function() {
            const appId = this.getAttribute('data-app-id');
            updateApplicationStatus(appId, 'approved');
        });
    });
    
    document.querySelectorAll('.reject_btn').forEach(button => {
        button.addEventListener('click', function() {
            const appId = this.getAttribute('data-app-id');
            updateApplicationStatus(appId, 'rejected');
        });
    });
    
    document.querySelectorAll('.interview_btn').forEach(button => {
        button.addEventListener('click', function() {
            const appId = this.getAttribute('data-app-id');
            openInterviewModal(appId);
        });
    });
    
    document.querySelectorAll('.download_btn').forEach(button => {
        button.addEventListener('click', function() {
            const resumeFile = this.getAttribute('data-resume');
            downloadResume(resumeFile);
        });
    });
}

function openInterviewModal(applicationId) {
    currentApplicationId = applicationId;
    interviewApplicationIdInput.value = applicationId;
    interviewModal.style.display = 'flex';
    interviewForm.reset();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('interviewDate').min = today;
}

function closeInterviewModal() {
    interviewModal.style.display = 'none';
    currentApplicationId = null;
}

async function handleInterviewSchedule(e) {
    e.preventDefault();
    
    if (!currentApplicationId) {
        showNotification('Interview Scheduling', 'No application selected.', 'error');
        return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    await withLoading(async () => {
        const formData = new FormData(interviewForm);
        const interviewData = {
            applicationId: currentApplicationId,
            date: formData.get('interviewDate'),
            time: formData.get('interviewTime'),
            mode: formData.get('interviewMode'),
            location: formData.get('interviewLocation'),
            notes: formData.get('additionalNotes')
        };
        
        try {
            // First update application status to interview
            await updateApplicationStatus(currentApplicationId, 'interview', interviewData);
            closeInterviewModal();
            showCompanyApplications();
        } catch (error) {
            console.error('Error scheduling interview:', error);
            showNotification('Interview Scheduling Error', 'An error occurred while scheduling the interview. Please try again.', 'error');
        }
    }, submitButton);
}

async function updateApplicationStatus(applicationId, status, interviewData = null) {
    try {
        const updateData = { status };
        
        if (interviewData) {
            Object.assign(updateData, {
                interview_date: interviewData.date,
                interview_time: interviewData.time,
                interview_mode: interviewData.mode,
                interview_location: interviewData.location,
                interview_notes: interviewData.notes
            });
        }
        
        const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Application Updated', 'Application status updated successfully!', 'success');
            loadCompanyApplications();
        } else {
            showNotification('Application Update Failed', result.error || 'Failed to update application status.', 'error');
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        showNotification('Application Update Error', 'An error occurred while updating the application status. Please try again.', 'error');
    }
}

function downloadResume(filename) {
    window.open(`${API_BASE_URL}/resume/${filename}`, '_blank');
}

// Admin Functions
async function loadAllStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        const students = await response.json();
        
        if (response.ok) {
            displayAllStudents(students);
        } else {
            console.error('Failed to load students');
            showNotification('Error', 'Failed to load students.', 'error');
        }
    } catch (error) {
        console.error('Error loading students:', error);
        showNotification('Error', 'Failed to load students. Please check your connection.', 'error');
    }
}

function displayAllStudents(students) {
    adminContentContainer.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    `;
    const header = document.createElement('h3');
    header.textContent = 'All Registered Students';
    header.style.margin = '0';
    container.appendChild(header);
    
    if (students.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No students registered yet.';
        container.appendChild(message);
    } else {
        const table = document.createElement('table');
        table.className = 'admin_table';
        table.style.width = '100%';
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Major</th>
                    <th>Academic Year</th>
                    <th>Registered Date</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.major || 'N/A'}</td>
                        <td>${student.academicYear || 'N/A'}</td>
                        <td>${new Date(student.registeredDate).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        container.appendChild(table);
    }
    
    adminContentContainer.appendChild(container);
}

async function loadAllCompanies() {
    try {
        const response = await fetch(`${API_BASE_URL}/companies`);
        const companies = await response.json();
        
        if (response.ok) {
            displayAllCompanies(companies);
        } else {
            console.error('Failed to load companies');
            showNotification('Error', 'Failed to load companies.', 'error');
        }
    } catch (error) {
        console.error('Error loading companies:', error);
        showNotification('Error', 'Failed to load companies. Please check your connection.', 'error');
    }
}


function displayAllCompanies(companies) {
    adminContentContainer.innerHTML = '';
    
    // Create a flex container
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    `;
    
    // Add header
    const header = document.createElement('h3');
    header.textContent = 'All Registered Companies';
    header.style.margin = '0';
    container.appendChild(header);
    
    if (companies.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No companies registered yet.';
        message.style.color = 'var(--gray-color)';
        container.appendChild(message);
    } else {
        // Add table
        const table = document.createElement('table');
        table.className = 'admin_table';
        table.style.width = '100%';
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Industry</th>
                    <th>Website</th>
                    <th>Registered Date</th>
                </tr>
            </thead>
            <tbody>
                ${companies.map(company => `
                    <tr>
                        <td>${company.name}</td>
                        <td>${company.email}</td>
                        <td>${company.industry || 'N/A'}</td>
                        <td>${company.website ? `<a href="${company.website}" target="_blank">${company.website}</a>` : 'N/A'}</td>
                        <td>${new Date(company.registeredDate).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        container.appendChild(table);
    }
    
    adminContentContainer.appendChild(container);
}

async function loadAllJobs() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        const jobs = await response.json();
        
        if (response.ok) {
            displayAllJobs(jobs);
        } else {
            console.error('Failed to load jobs');
            showNotification('Error', 'Failed to load jobs.', 'error');
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        showNotification('Error', 'Failed to load jobs. Please check your connection.', 'error');
    }
}

function displayAllJobs(jobs) {
    adminContentContainer.innerHTML = '<h3>All Job Postings</h3>';
    
    if (jobs.length === 0) {
        adminContentContainer.innerHTML += '<div class="card_container"><div class="card_title_container"><p>No job postings available.</p></div></div>';
        return;
    }
    
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'card_container';
        
        jobCard.innerHTML = `
            <div class="card_title_container">
                <h3 class="card_title">${job.title}</h3>
                <p class="card_desc">${job.description}</p>
                <p class="card_details"><strong>Company:</strong> ${job.companyName}</p>
                <p class="card_details"><strong>Requirements:</strong> ${job.requirements}</p>
                <p class="card_details"><strong>Location:</strong> ${job.location}</p>
                <p class="card_details"><strong>Type:</strong> ${job.type}</p>
                <p class="card_details"><strong>Posted on:</strong> ${new Date(job.posted_date).toLocaleDateString()}</p>
            </div>
        `;
        
        adminContentContainer.appendChild(jobCard);
    });
}

async function loadAllApplications() {
    try {
        adminContentContainer.innerHTML = '<p>Loading applications from all companies...</p>';
        
        const companiesResponse = await fetch(`${API_BASE_URL}/companies`);
        const companies = await companiesResponse.json();
        
        if (!companiesResponse.ok) {
            throw new Error('Failed to load companies');
        }
        
        let allApplications = [];
        
        for (const company of companies) {
            const response = await fetch(`${API_BASE_URL}/applications/company/${company.id}`);
            if (response.ok) {
                const applications = await response.json();
                allApplications = allApplications.concat(applications);
            }
        }
        
        displayAllApplications(allApplications);
    } catch (error) {
        console.error('Error loading all applications:', error);
        adminContentContainer.innerHTML = '<div class="card_container"><div class="card_title_container"><p>Error loading applications.</p></div></div>';
        showNotification('Error', 'Failed to load applications.', 'error');
    }
}

function displayAllApplications(applications) {
    adminContentContainer.innerHTML = '';
    
    // Create simple container
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        width: 100%;
    `;
    
    // Header on first line
    const header = document.createElement('h3');
    header.textContent = 'All Applications';
    header.style.margin = '0';
    container.appendChild(header);
    
    if (applications.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No applications submitted yet.';
        message.style.color = 'var(--gray-color)';
        container.appendChild(message);
    } else {
        // Table on next line
        const table = document.createElement('table');
        table.className = 'admin_table';
        table.style.cssText = `
            width: 100%;
            margin-top: 0.5rem;
        `;
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${applications.map(app => `
                    <tr>
                        <td>${app.studentName || 'N/A'}</td>
                        <td>${app.studentEmail || 'N/A'}</td>
                        <td>${app.jobTitle || 'N/A'}</td>
                        <td>${app.companyName || 'N/A'}</td>
                        <td>${app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'N/A'}</td>
                        <td><span class="status_badge status_${app.status || 'pending'}">${app.status || 'pending'}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        container.appendChild(table);
    }
    
    adminContentContainer.appendChild(container);
}












// Add these functions to your script.js

// Enhanced Photo Upload Handler
async function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Invalid File', 'Please select an image file.', 'error');
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('File Too Large', 'Please select an image smaller than 2MB.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Update both profile photos
            profilePhoto.src = e.target.result;
            modalProfilePhoto.src = e.target.result;
            
            // Save to localStorage with user-specific key
            const userPhotoKey = `profilePhoto_${currentUser.id}_${currentUser.userType}`;
            localStorage.setItem(userPhotoKey, e.target.result);
            
            showNotification('Profile Photo Updated', 'Your profile photo has been updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Enhanced Modal Photo Upload Handler
async function handleModalPhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Invalid File', 'Please select an image file.', 'error');
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('File Too Large', 'Please select an image smaller than 2MB.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Update both profile photos
            modalProfilePhoto.src = e.target.result;
            profilePhoto.src = e.target.result;
            
            // Save to localStorage with user-specific key
            const userPhotoKey = `profilePhoto_${currentUser.id}_${currentUser.userType}`;
            localStorage.setItem(userPhotoKey, e.target.result);
            
            showNotification('Profile Photo Updated', 'Your profile photo has been updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Enhanced Profile Photo Loader
function loadProfilePhoto() {
    const userPhotoKey = `profilePhoto_${currentUser.id}_${currentUser.userType}`;
    const savedPhoto = localStorage.getItem(userPhotoKey);
    
    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
        
        // Set a default photo based on user type if no photo exists
        const defaultStudentPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%234a6ee0'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='40' text-anchor='middle' fill='white'%3E👨‍🎓%3C/text%3E%3C/svg%3E";
        const defaultCompanyPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%236a11cb'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='40' text-anchor='middle' fill='white'%3E🏢%3C/text%3E%3C/svg%3E";
        const defaultAdminPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%2317a2b8'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='40' text-anchor='middle' fill='white'%3E👨‍💼%3C/text%3E%3C/svg%3E";
        
        if (!savedPhoto) {
            if (currentUser.userType === 'student') {
                profilePhoto.src = defaultStudentPhoto;
            } else if (currentUser.userType === 'company') {
                profilePhoto.src = defaultCompanyPhoto;
            } else if (currentUser.userType === 'admin') {
                profilePhoto.src = defaultAdminPhoto;
            }
        }
    }
}

// Enhanced Profile Modal Show Function
function showProfileModal() {
    // Populate modal with current user data
    document.getElementById('modalUserName').value = currentUser.name;
    document.getElementById('modalUserEmail').value = currentUser.email;
    document.getElementById('modalUserType').value = currentUser.userType;
    
    // Load current profile photo
    const userPhotoKey = `profilePhoto_${currentUser.id}_${currentUser.userType}`;
    const savedPhoto = localStorage.getItem(userPhotoKey);
    
    if (savedPhoto) {
        modalProfilePhoto.src = savedPhoto;
    } else {
        // Set default photo based on user type
        const defaultStudentPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%234a6ee0'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='40' text-anchor='middle' fill='white'%3E👨‍🎓%3C/text%3E%3C/svg%3E";
        const defaultCompanyPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%236a11cb'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='40' text-anchor='middle' fill='white'%3E🏢%3C/text%3E%3C/svg%3E";
        const defaultAdminPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%2317a2b8'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='40' text-anchor='middle' fill='white'%3E👨‍💼%3C/text%3E%3C/svg%3E";
        
        if (currentUser.userType === 'student') {
            modalProfilePhoto.src = defaultStudentPhoto;
        } else if (currentUser.userType === 'company') {
            modalProfilePhoto.src = defaultCompanyPhoto;
        } else if (currentUser.userType === 'admin') {
            modalProfilePhoto.src = defaultAdminPhoto;
        }
    }
    
    // Show additional fields based on user type
    if (currentUser.userType === 'student') {
        document.getElementById('studentAdditionalFields').style.display = 'block';
        document.getElementById('companyAdditionalFields').style.display = 'none';
        document.getElementById('modalUserMajor').value = currentUser.major || '';
        document.getElementById('modalUserYear').value = currentUser.academicYear || '';
    } else if (currentUser.userType === 'company') {
        document.getElementById('studentAdditionalFields').style.display = 'none';
        document.getElementById('companyAdditionalFields').style.display = 'block';
        document.getElementById('modalUserIndustry').value = currentUser.industry || '';
        document.getElementById('modalUserWebsite').value = currentUser.website || '';
    } else {
        document.getElementById('studentAdditionalFields').style.display = 'none';
        document.getElementById('companyAdditionalFields').style.display = 'none';
    }
    
    profileModal.style.display = 'flex';
}

// Enhanced Logout Function
function handleLogout() {
    // Don't clear profile photos on logout - they are user-specific
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('Logged Out', 'You have been successfully logged out.', 'info');
    showHomepage();
    loginForm.reset();
}