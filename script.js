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

function initCmsMobileLightbox() {
    const cmsMain = document.getElementById("cms-main");
    if (!cmsMain) return;

    const mq = window.matchMedia("(max-width: 960px)");
    const images = Array.from(cmsMain.querySelectorAll("img.cms-image"));
    if (!images.length) return;

    let lightbox = document.getElementById("cms-lightbox");
    let lightboxImg = null;
    let closeBtn = null;

    function ensureLightbox() {
        lightbox = document.getElementById("cms-lightbox");
        if (lightbox) {
            lightboxImg = lightbox.querySelector(".cms-lightbox__img");
            closeBtn = lightbox.querySelector(".cms-lightbox__close");
            return;
        }

        lightbox = document.createElement("div");
        lightbox.id = "cms-lightbox";
        lightbox.className = "cms-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Image preview");

        const inner = document.createElement("div");
        inner.className = "cms-lightbox__inner";

        lightboxImg = document.createElement("img");
        lightboxImg.className = "cms-lightbox__img";
        lightboxImg.alt = "";

        closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "cms-lightbox__close";
        closeBtn.setAttribute("aria-label", "Close image preview");
        closeBtn.textContent = "×";

        inner.appendChild(closeBtn);
        inner.appendChild(lightboxImg);
        lightbox.appendChild(inner);
        document.body.appendChild(lightbox);

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        closeBtn.addEventListener("click", closeLightbox);
    }

    function openLightbox(img) {
        ensureLightbox();
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || "";
        document.body.classList.add("cms-no-scroll");
        lightbox.classList.add("is-open");
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("is-open");
        document.body.classList.remove("cms-no-scroll");
        if (lightboxImg) {
            lightboxImg.src = "";
            lightboxImg.alt = "";
        }
    }

    function addCaptionSubtext() {
        const captions = Array.from(cmsMain.querySelectorAll(".cms-image-wrap .cms-caption"));
        captions.forEach((cap) => {
            const next = cap.nextElementSibling;
            if (next && next.classList && next.classList.contains("cms-caption-sub")) return;
            const sub = document.createElement("p");
            sub.className = "cms-caption-sub";
            sub.innerHTML = "<em>Click Image to Enlarge</em>";
            cap.insertAdjacentElement("afterend", sub);
        });
    }

    function bind(enable) {
        images.forEach((img) => {
            img.classList.toggle("cms-image--enlargeable", enable);
            img.removeEventListener("click", img.__cmsLightboxHandler);
            img.removeEventListener("keydown", img.__cmsLightboxKeyHandler);

            if (!enable) {
                img.removeAttribute("tabindex");
                img.removeAttribute("role");
                img.removeAttribute("aria-label");
                return;
            }

            img.setAttribute("tabindex", "0");
            img.setAttribute("role", "button");
            img.setAttribute("aria-label", (img.alt ? img.alt + ". " : "") + "Tap to enlarge");

            const handler = () => openLightbox(img);
            const keyHandler = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(img);
                }
            };

            img.__cmsLightboxHandler = handler;
            img.__cmsLightboxKeyHandler = keyHandler;

            img.addEventListener("click", handler);
            img.addEventListener("keydown", keyHandler);
        });

        if (enable) addCaptionSubtext();
        if (!enable) closeLightbox();
    }

    function onKeydown(e) {
        if (e.key === "Escape") closeLightbox();
    }

    document.addEventListener("keydown", onKeydown);

    bind(mq.matches);

    mq.addEventListener("change", (e) => {
        bind(e.matches);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initCmsMobileLightbox();
});
