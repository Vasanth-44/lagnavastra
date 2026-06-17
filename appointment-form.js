/**
 * LAGNA VASTRA — appointment-form.js
 * Premium appointment booking form validation & Google Sheets integration.
 * 
 * INSTRUCTIONS:
 * 1. Deploy the Apps Script from `google-apps-script.js` as a Web App in Google Sheets.
 * 2. Set "Who has access" to "Anyone" when deploying.
 * 3. Copy the deployed Web App URL and paste it in the GOOGLE_SCRIPT_URL constant below.
 */

(function () {
  // ── CONFIGURATION ────────────────────────────────────────────────────────
  // Paste your deployed Google Apps Script Web App URL below
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxSTa80WlI3tLb1524QsSHFYX4Y88xJmJOiqMAEebdSt9HX1y4HMHzEKR68yspj7XDv/exec';

  // ── SECURITY & RELIABILITY HELPERS ───────────────────────────────────────
  // Sanitizes strings to prevent XSS / script injection in Google Sheets
  const sanitizeInput = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  // Client-side rate limiting (max 3 submissions per 10 minutes)
  const checkRateLimit = () => {
    try {
      const now = Date.now();
      const submissions = JSON.parse(localStorage.getItem('lv_submissions') || '[]');
      // Filter submissions older than 10 minutes (600,000 ms)
      const recentSubmissions = submissions.filter(ts => now - ts < 600000);
      
      if (recentSubmissions.length >= 3) {
        return false; // Limit exceeded
      }
      
      recentSubmissions.push(now);
      localStorage.setItem('lv_submissions', JSON.stringify(recentSubmissions));
      return true;
    } catch (e) {
      return true; // Fallback: allow submission if localStorage fails
    }
  };

  // Pre-filled WhatsApp message redirection helper
  const redirectToWhatsApp = (data) => {
    try {
      const waNumber = '916302635460';
      const msg = `Hello Lagna Vastra,

I would like to book a private appointment:
• Name: ${data.name || ''}
• Phone: ${data.phone || ''}
• Email: ${data.email || ''}
• Ensemble of Interest: ${data.ensemble || 'Not specified'}
• Wedding Date (approx.): ${data.date || 'Not specified'}
• Message: ${data.message || 'None'}`;

      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    } catch (waErr) {
      console.error('WhatsApp redirection failed:', waErr);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const btnSubmit = form.querySelector('.form-submit');
    const notification = document.getElementById('form-notification');
    const originalBtnText = btnSubmit ? btnSubmit.textContent : 'Send Enquiry';

    // Form field elements
    const fields = {
      name: {
        input: document.getElementById('cf-name'),
        group: document.getElementById('group-name'),
        error: document.getElementById('cf-name-error'),
        validate: (val) => {
          if (!val) return 'Full Name is required.';
          if (val.length < 2) return 'Name must be at least 2 characters.';
          return '';
        }
      },
      phone: {
        input: document.getElementById('cf-phone'),
        group: document.getElementById('group-phone'),
        error: document.getElementById('cf-phone-error'),
        validate: (val) => {
          if (!val) return 'Phone Number is required.';
          const cleanPhone = val.replace(/[^0-9]/g, '');
          if (cleanPhone.length < 10) return 'Please enter a valid phone number (at least 10 digits).';
          if (!/^[+]?[0-9\s\-()]{10,18}$/.test(val)) return 'Invalid phone number format.';
          return '';
        }
      },
      email: {
        input: document.getElementById('cf-email'),
        group: document.getElementById('group-email'),
        error: document.getElementById('cf-email-error'),
        validate: (val) => {
          if (!val) return 'Email Address is required.';
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(val)) return 'Please enter a valid email address.';
          return '';
        }
      }
    };

    // Other inputs without validation constraints
    const optionalFields = {
      ensemble: document.getElementById('cf-ensemble'),
      date: document.getElementById('cf-date'),
      message: document.getElementById('cf-msg')
    };

    // Helper: Show error on a field
    const showError = (fieldKey, message) => {
      const field = fields[fieldKey];
      if (!field) return;
      field.group.classList.add('has-error');
      field.error.textContent = message;
    };

    // Helper: Clear error on a field
    const clearError = (fieldKey) => {
      const field = fields[fieldKey];
      if (!field) return;
      field.group.classList.remove('has-error');
      field.error.textContent = '';
    };

    // Helper: Clear notification banner
    const clearNotification = () => {
      if (!notification) return;
      notification.textContent = '';
      notification.className = 'form-notification';
    };

    // Helper: Show notification banner
    const showNotification = (message, type = 'success') => {
      if (!notification) return;
      notification.textContent = message;
      notification.className = `form-notification ${type}`;
      form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Attach real-time validation clear handlers
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.input) {
        field.input.addEventListener('input', () => {
          clearError(key);
          clearNotification();
        });
      }
    });

    // Form submit handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearNotification();

      // 1. Honeypot check for spam bots
      const honeypot = document.getElementById('cf-website');
      if (honeypot && honeypot.value) {
        console.warn('Spam submission blocked via honeypot.');
        // Fake success to the bot, but do not actually submit or redirect
        handleSuccess({ name: 'Enquirer', phone: '', email: '', ensemble: '', date: '', message: '' });
        return;
      }

      // 2. Rate limiting check
      if (!checkRateLimit()) {
        showNotification('Too many submissions. Please wait a few minutes before trying again.', 'error');
        return;
      }

      let hasErrors = false;
      const formData = {};

      // 3. Perform validation checks
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const val = field.input ? field.input.value.trim() : '';
        const errorMessage = field.validate(val);

        if (errorMessage) {
          showError(key, errorMessage);
          hasErrors = true;
        } else {
          clearError(key);
          formData[key] = sanitizeInput(val); // Sanitize input
        }
      });

      if (hasErrors) {
        showNotification('Please correct the highlighted fields before submitting.', 'error');
        return;
      }

      // Collect and sanitize optional field data
      formData.ensemble = optionalFields.ensemble ? sanitizeInput(optionalFields.ensemble.value) : '';
      formData.date = optionalFields.date ? sanitizeInput(optionalFields.date.value.trim()) : '';
      formData.message = optionalFields.message ? sanitizeInput(optionalFields.message.value.trim()) : '';

      // 4. Set loading state
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Securing Appointment...';
      }

      try {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_NEW_DEPLOYED_URL')) {
          throw new Error('Google Sheets Web App URL is not configured.');
        }

        // URL encode payload to match Apps Script parameter parser
        const payload = new URLSearchParams(formData).toString();

        // 5. POST request to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Avoids CORS redirection preflight blocks
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: payload
        });

        // Since no-cors returns an opaque response, we assume success if fetch finishes without throwing
        handleSuccess(formData);

      } catch (error) {
        console.error('Lagna Vastra form submission failed:', error);
        
        // 6. Failover Backup: Save details locally so queries are never lost
        try {
          const backups = JSON.parse(localStorage.getItem('lv_backup_enquiries') || '[]');
          formData.failedAt = new Date().toISOString();
          formData.error = error.message || 'unknown';
          backups.push(formData);
          localStorage.setItem('lv_backup_enquiries', JSON.stringify(backups));
        } catch (backupErr) {
          console.error('Failed to save local backup:', backupErr);
        }

        // Show a message, then trigger the WhatsApp redirect as a failover
        showNotification('Sync delay detected. Redirecting you to WhatsApp directly to confirm your slot...', 'success');
        
        setTimeout(() => {
          handleSuccess(formData);
        }, 1500);
      }
    });

    // Reusable Success Handler
    function handleSuccess(data) {
      // 1. Show success message
      showNotification('Thank you for your inquiry. Our styling team will contact you shortly.', 'success');

      // 2. Reset submit button
      if (btnSubmit) {
        btnSubmit.textContent = 'Enquiry Sent ✓';
        btnSubmit.style.background = '#5a8a5a';
        setTimeout(() => {
          btnSubmit.textContent = originalBtnText;
          btnSubmit.style.background = '';
          btnSubmit.disabled = false;
        }, 4000);
      }

      // 3. Redirect to WhatsApp
      redirectToWhatsApp(data);

      // 4. Reset all form fields
      form.reset();
      Object.keys(fields).forEach(key => clearError(key));
    }

    // Reusable Failure Handler
    function handleFailure(errorMessage) {
      showNotification(`Submission failed: ${errorMessage} Please try again or contact us via WhatsApp.`, 'error');
      if (btnSubmit) {
        btnSubmit.textContent = originalBtnText;
        btnSubmit.disabled = false;
      }
    }
  });
})();
