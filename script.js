const modalBackdrop = document.getElementById("contact-modal");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
const contactTriggers = document.querySelectorAll(".contact-trigger");
const closeButtons = document.querySelectorAll("[data-close-modal]");
const modalDialog = document.getElementById("contact-dialog");
const modalForm = modalDialog?.querySelector("form");
const submitButton = modalForm?.querySelector('button[type="submit"]');

let lastFocusedElement = null;
let focusableElements = [];
let firstFocusableElement = null;
let lastFocusableElement = null;

function getFocusableElements() {
    if (!modalDialog) return;
    
    const selectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    focusableElements = Array.from(modalDialog.querySelectorAll(selectors)).filter(
        el => !el.hasAttribute('disabled') && el.offsetParent !== null
    );
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
}

function trapFocus(event) {
    if (event.key !== 'Tab') return;
    
    if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
        }
    } else {
        if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
        }
    }
}

function openModal(event) {
    if (event) {
        event.preventDefault();
        lastFocusedElement = event.target;
    }
    if (!modalBackdrop) return;

    modalBackdrop.classList.add("is-visible");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    
    getFocusableElements();
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }
    
    document.addEventListener('keydown', trapFocus);
}

function closeModal() {
    if (!modalBackdrop) return;

    modalBackdrop.classList.remove("is-visible");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    
    document.removeEventListener('keydown', trapFocus);
    
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

if (modalBackdrop) {
    contactTriggers.forEach((el) => {
        el.addEventListener("click", openModal);
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    modalBackdrop.addEventListener("click", (event) => {
        if (event.target === modalBackdrop) closeModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modalBackdrop.classList.contains("is-visible")) {
            closeModal();
        }
    });
}

// Form validation and loading state
if (modalForm && submitButton) {
    modalForm.addEventListener("submit", (event) => {
        const isValid = modalForm.checkValidity();
        
        if (!isValid) {
            event.preventDefault();
            
            // Show validation messages
            const inputs = modalForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (!input.validity.valid) {
                    input.classList.add('invalid');
                    
                    // Remove invalid class on input
                    input.addEventListener('input', function handler() {
                        if (input.validity.valid) {
                            input.classList.remove('invalid');
                            input.removeEventListener('input', handler);
                        }
                    });
                }
            });
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.textContent = 'Sending...';
    });
}

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.classList.toggle("is-active", isOpen);
    });
}
