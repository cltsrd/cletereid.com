const modalBackdrop = document.getElementById("contact-modal");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
const contactTriggers = document.querySelectorAll(".contact-trigger");
const closeButtons = document.querySelectorAll("[data-close-modal]");

function openModal(event) {
    if (event) event.preventDefault();
    if (!modalBackdrop) return;

    modalBackdrop.classList.add("is-visible");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeModal() {
    if (!modalBackdrop) return;

    modalBackdrop.classList.remove("is-visible");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
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

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.classList.toggle("is-active", isOpen);
    });
}
