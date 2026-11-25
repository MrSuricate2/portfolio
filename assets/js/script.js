'use strict';

// element toggle function
const elementToggleFunc = function (elem) {
  if (!elem) return;
  elem.classList.toggle("active");
}



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
    const isExpanded = sidebar.classList.contains("active");
    sidebarBtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  });
}



// project variables
const projectItem = document.querySelectorAll("[data-project-item]");
const modalContainer = document.querySelector("[data-modal-container]"); // <dialog>
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");

// modal variable
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// Exit animation needs `overlay` + discrete `display` transitions (Chromium/Safari 18).
// Probe instead of trusting CSS.supports (Firefox parses allow-discrete but ignores it for display).
let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) return false;
  const probe = document.createElement("div");
  probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransition = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay();
}

async function closeModal() {
  if (!modalContainer.open) return;
  if (!supportsTopLayerExit()) {
    modalContainer.setAttribute("data-closing", "");
    const animations = modalContainer.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 2000)),
      ]);
    }
    if (!modalContainer.hasAttribute("data-closing")) return;
    modalContainer.removeAttribute("data-closing");
  }
  modalContainer.close();
}

// Tooltips: replace native `title` on icons with interest-triggered popover hints
// (interestfor + popover="hint" + CSS anchor positioning). Where one of these APIs
// is missing, the native `title` is kept untouched.
const supportsHintTooltips = (() => {
  if (!("interestForElement" in HTMLButtonElement.prototype)) return false;
  if (!CSS.supports("anchor-name: --a")) return false;
  const probe = document.createElement("div");
  probe.popover = "hint";
  return probe.popover === "hint";
})();

let tooltipCount = 0;
const normalizeText = (s) => (s || "").replace(/\s+/g, " ").trim();

// Yield to the main thread so pending input/rendering can run between chunks of work
const yieldToMain = () =>
  "scheduler" in window && "yield" in scheduler
    ? scheduler.yield()
    : new Promise((resolve) => setTimeout(resolve, 0));

// Async + time-sliced: ~90 icons are converted without creating one long task (INP)
async function enhanceTooltips(root = document) {
  if (!supportsHintTooltips) return;

  let deadline = performance.now() + 50;
  for (const img of root.querySelectorAll("img[title]")) {
    if (performance.now() >= deadline) {
      await yieldToMain();
      deadline = performance.now() + 50;
    }

    const text = normalizeText(img.title);
    if (!text || img.closest("button, a, [data-project-text]")) continue;

    const id = `tip-${++tooltipCount}`;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "tip-trigger";
    trigger.setAttribute("interestfor", id);

    const hint = document.createElement("div");
    hint.id = id;
    hint.className = "tip";
    hint.setAttribute("popover", "hint");
    hint.textContent = text;

    img.removeAttribute("title");
    img.replaceWith(trigger);
    trigger.append(img);
    trigger.after(hint); // right after the trigger so it reads in sequence

    // Hint repeating the accessible name (img alt): nothing to add.
    // Otherwise expose it as the trigger's description.
    if (normalizeText(img.alt) !== text) {
      hint.setAttribute("role", "tooltip");
      trigger.setAttribute("aria-describedby", id);
    }
  }
}

// add click event to all modal items
for (const element of projectItem) {
  element.addEventListener("click", function () {
    modalTitle.innerHTML = this.querySelector("[data-project-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-project-text]").innerHTML;
    enhanceTooltips(modalText);
    modalContainer.showModal();
  });
}

modalCloseBtn.addEventListener("click", closeModal);

// Esc / closedby="any" light dismiss: route through closeModal so they animate too
modalContainer.addEventListener("cancel", (e) => {
  if (supportsTopLayerExit()) return;
  e.preventDefault();
  closeModal();
});

// light-dismiss fallback where `closedby` is unsupported (Safari)
if (!("closedBy" in HTMLDialogElement.prototype)) {
  const outside = (e) => {
    const r = modalContainer.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  let pressedOutside = false;
  modalContainer.addEventListener("pointerdown", (e) => { pressedOutside = outside(e); });
  modalContainer.addEventListener("pointerup", (e) => { if (pressedOutside && outside(e)) closeModal(); });
}

// not needed for first paint: run once the browser is idle
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => enhanceTooltips(), { timeout: 2000 });
} else {
  setTimeout(() => enhanceTooltips(), 200);
}

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
  this.setAttribute("aria-expanded", this.classList.contains("active") ? "true" : "false");
});

// add event in all select items
for (const element of selectItems) {
  element.addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    select.setAttribute("aria-expanded", "false");
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (const element of filterItems) {
    if (selectedValue === "tout") {
      element.classList.add("active");
    } else if (selectedValue === element.dataset.category.toLowerCase()) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (const element of filterBtn) {
  element.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formMessage = document.getElementById('formMessage');

// Fonction de validation du formulaire
function validateForm() {
  const name = document.querySelector('[name="fullname"]');
  const message = document.querySelector('[name="message"]');
  
  // Validation nom (min 2 caractères, pas de chiffres)
  if (name.value.length < 2 || /\d/.test(name.value)) {
    name.setCustomValidity('Le nom doit contenir au moins 2 caractères sans chiffres');
  } else {
    name.setCustomValidity('');
  }
  
  // Validation message (min 10 caractères)
  if (message.value.length < 10) {
    message.setCustomValidity('Le message doit contenir au moins 10 caractères');
  } else {
    message.setCustomValidity('');
  }

  const consentCheckbox = document.getElementById('consent');
  
  if (form.checkValidity() && consentCheckbox && consentCheckbox.checked) {
    formBtn.removeAttribute("disabled");
  } else {
    formBtn.setAttribute("disabled", "");
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedValidate = debounce(validateForm, 300);
// add event to all form input field
for (const element of formInputs) {
  element.addEventListener("input", debouncedValidate);
}

const consentCheckbox = document.getElementById('consent');
if (consentCheckbox) {
  consentCheckbox.addEventListener('change', validateForm);
}

// Charge une nouvelle question captcha (usage unique côté serveur)
async function loadCaptcha() {
  const question = document.getElementById('captchaQuestion');
  const input = document.getElementById('captcha');
  if (!question || !input) return;

  input.value = '';
  try {
    const response = await fetch('captcha.php', { cache: 'no-store' });
    const data = await response.json();
    question.textContent = data.success ? data.question : 'Question indisponible, rechargez la page.';
  } catch (error) {
    console.error('Erreur captcha:', error);
    question.textContent = 'Question indisponible, rechargez la page.';
  }
}

loadCaptcha();

// Fonction pour afficher un message
function showFormMessage(message, type = 'success') {
  if (!formMessage) return;
  
  formMessage.style.display = 'block';
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  
  // Scroll vers le message
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fonction pour réinitialiser le formulaire
function resetContactForm() {
  form.reset();
  formBtn.setAttribute("disabled", "");
  
  // Cacher le message après 5 secondes
  setTimeout(() => {
    if (formMessage) {
      formMessage.style.display = 'none';
    }
  }, 5000);
}

// Gestion de la soumission du formulaire
if (form) {
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    // Désactiver le bouton pendant l'envoi
    formBtn.setAttribute("disabled", "");
    const buttonText = formBtn.querySelector('span');
    const originalText = buttonText.textContent;
    buttonText.textContent = 'Envoi en cours...';
    
    // Cacher le message précédent
    if (formMessage) {
      formMessage.style.display = 'none';
    }
    
    try {
      // Récupérer les données du formulaire
      const formData = new FormData(form);
      
      // Envoyer la requête
      const response = await fetch('send-email.php', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        showFormMessage(data.message, 'success');
        resetContactForm();
      } else {
        showFormMessage(data.message, 'error');
        validateForm(); // Réactiver le bouton si le formulaire est toujours valide
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      showFormMessage('Une erreur est survenue. Veuillez réessayer plus tard.', 'error');
      validateForm(); // Réactiver le bouton
    } finally {
      // Restaurer le texte du bouton
      buttonText.textContent = originalText;
      // Le captcha est à usage unique : on en demande un nouveau
      loadCaptcha().then(validateForm);
    }
  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (const element of navigationLinks) {
  element.addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      const navType = this.dataset.navLink;
      if (navType && navType === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        navigationLinks[i].setAttribute("aria-current", "page");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
        navigationLinks[i].removeAttribute("aria-current");
      }
    }
  });
}