/* ==============================
   BUG REPORT SYSTEM FOR DUMBASSGAMES
   ============================== */

// Bug Report Modal Functions
function showBugReportModal() {
    const modal = document.getElementById('bugReportModal');
    const form = document.getElementById('bugReportForm');
    const successDiv = document.getElementById('bugReportSuccess');
    
    if (modal) {
        // Reset form and show form, hide success
        form.style.display = 'block';
        successDiv.style.display = 'none';
        form.reset();
        
        // Auto-detect browser and device info
        const browserInfo = detectBrowser();
        const deviceInfo = detectDevice();
        
        document.getElementById('bugBrowser').value = browserInfo;
        document.getElementById('bugDevice').value = deviceInfo;
        
        // Set up character counters
        setupCharacterCounters();
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log('🐛 Bug report modal opened');
    }
}

function hideBugReportModal() {
    const modal = document.getElementById('bugReportModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('🐛 Bug report modal closed');
    }
}

function detectBrowser() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        const version = userAgent.match(/Chrome\/(\d+)/);
        browser = `Chrome ${version ? version[1] : 'Unknown'}`;
    } else if (userAgent.includes('Firefox')) {
        const version = userAgent.match(/Firefox\/(\d+)/);
        browser = `Firefox ${version ? version[1] : 'Unknown'}`;
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        const version = userAgent.match(/Version\/(\d+)/);
        browser = `Safari ${version ? version[1] : 'Unknown'}`;
    } else if (userAgent.includes('Edg')) {
        const version = userAgent.match(/Edg\/(\d+)/);
        browser = `Edge ${version ? version[1] : 'Unknown'}`;
    }
    
    return browser;
}

function detectDevice() {
    const userAgent = navigator.userAgent;
    let device = 'Desktop';
    
    if (/Android/i.test(userAgent)) {
        device = 'Android Device';
    } else if (/iPhone/i.test(userAgent)) {
        device = 'iPhone';
    } else if (/iPad/i.test(userAgent)) {
        device = 'iPad';
    } else if (/Windows/i.test(userAgent)) {
        device = 'Windows PC';
    } else if (/Macintosh/i.test(userAgent)) {
        device = 'Mac';
    } else if (/Linux/i.test(userAgent)) {
        device = 'Linux PC';
    }
    
    // Add screen resolution for additional context
    if (screen.width && screen.height) {
        device += ` (${screen.width}x${screen.height})`;
    }
    
    return device;
}

function setupCharacterCounters() {
    const description = document.getElementById('bugDescription');
    const steps = document.getElementById('bugSteps');
    const descCounter = document.getElementById('bugDescCharCount');
    const stepsCounter = document.getElementById('bugStepsCharCount');
    
    if (description && descCounter) {
        description.addEventListener('input', function() {
            const count = this.value.length;
            const max = 1000;
            descCounter.textContent = count;
            
            if (count > max) {
                descCounter.classList.add('over-limit');
            } else {
                descCounter.classList.remove('over-limit');
            }
        });
    }
    
    if (steps && stepsCounter) {
        steps.addEventListener('input', function() {
            const count = this.value.length;
            const max = 500;
            stepsCounter.textContent = count;
            
            if (count > max) {
                stepsCounter.classList.add('over-limit');
            } else {
                stepsCounter.classList.remove('over-limit');
            }
        });
    }
}

// Handle bug report form submission
document.addEventListener('DOMContentLoaded', function() {
    const bugReportForm = document.getElementById('bugReportForm');
    if (bugReportForm) {
        bugReportForm.addEventListener('submit', handleBugReportSubmission);
    }
    
    // Close modal when clicking outside
    const bugReportModal = document.getElementById('bugReportModal');
    if (bugReportModal) {
        bugReportModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideBugReportModal();
            }
        });
    }
});

async function handleBugReportSubmission(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBugBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '⏳ SUBMITTING...';
    submitBtn.disabled = true;
    
    try {
        // Collect form data
        const formData = {
            title: document.getElementById('bugTitle').value.trim(),
            category: document.getElementById('bugCategory').value,
            severity: document.getElementById('bugSeverity').value,
            description: document.getElementById('bugDescription').value.trim(),
            steps: document.getElementById('bugSteps').value.trim(),
            browser: document.getElementById('bugBrowser').value.trim(),
            device: document.getElementById('bugDevice').value.trim(),
            contact: document.getElementById('bugContact').value.trim(),
            // Metadata
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: window.firebaseAuth?.currentUser?.uid || 'anonymous',
            userEmail: window.firebaseAuth?.currentUser?.email || 'anonymous',
            status: 'new',
            id: generateBugReportId()
        };
        
        // Validate required fields
        if (!formData.title || !formData.category || !formData.description) {
            throw new Error('Please fill in all required fields');
        }
        
        // Check description length
        if (formData.description.length > 1000) {
            throw new Error('Description must be under 1000 characters');
        }
        
        if (formData.steps.length > 500) {
            throw new Error('Steps to reproduce must be under 500 characters');
        }
        
        // Submit to Firebase
        const success = await submitBugReportToFirebase(formData);
        
        if (success) {
            // Show success message
            showBugReportSuccess(formData.id);
            
            // Log analytics
            if (window.gtag) {
                window.gtag('event', 'bug_report_submitted', {
                    'event_category': 'user_feedback',
                    'event_label': formData.category,
                    'custom_parameter_1': formData.severity
                });
            }
            
            console.log('✅ Bug report submitted successfully:', formData.id);
        } else {
            throw new Error('Failed to submit bug report');
        }
        
    } catch (error) {
        console.error('❌ Error submitting bug report:', error);
        
        // Show user-friendly error
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showError(`🐛 Failed to submit bug report: ${error.message}`);
        } else {
            alert(`❌ Error: ${error.message}`);
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function generateBugReportId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `BUG-${timestamp}-${random.toUpperCase()}`;
}

async function submitBugReportToFirebase(bugData) {
    try {
        if (!window.firebaseDb || !window.firebaseAddDoc) {
            console.error('❌ Firebase not available for bug reports');
            return false;
        }
        
        // Create bugs collection reference
        const bugsCollection = window.firebaseCollection ? 
            window.firebaseCollection(window.firebaseDb, 'bugs') : 
            null;
            
        if (!bugsCollection) {
            console.error('❌ Could not create bugs collection');
            return false;
        }
        
        // Add to Firebase
        const docRef = await window.firebaseAddDoc(bugsCollection, bugData);
        console.log('✅ Bug report saved to Firebase:', docRef.id);
        
        return true;
        
    } catch (error) {
        console.error('❌ Firebase error submitting bug report:', error);
        
        // Fallback: Try to save to localStorage for later sync
        try {
            const savedBugs = JSON.parse(localStorage.getItem('pendingBugReports') || '[]');
            savedBugs.push(bugData);
            localStorage.setItem('pendingBugReports', JSON.stringify(savedBugs));
            console.log('💾 Bug report saved locally for later sync');
            return true;
        } catch (localError) {
            console.error('❌ Failed to save bug report locally:', localError);
            return false;
        }
    }
}

function showBugReportSuccess(reportId) {
    const form = document.getElementById('bugReportForm');
    const successDiv = document.getElementById('bugReportSuccess');
    const reportIdSpan = document.getElementById('bugReportId');
    
    if (form && successDiv && reportIdSpan) {
        form.style.display = 'none';
        successDiv.style.display = 'block';
        reportIdSpan.textContent = reportId;
        
        // Auto-hide modal after 5 seconds
        setTimeout(() => {
            hideBugReportModal();
        }, 5000);
    }
}

// Make functions globally available
window.showBugReportModal = showBugReportModal;
window.hideBugReportModal = hideBugReportModal;

console.log('🐛 Bug report system loaded successfully!');
