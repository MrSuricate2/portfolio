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
  });
}



// project variables
const projectItem = document.querySelectorAll("[data-project-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  try {
    if (modalContainer && overlay) {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    }
  } catch (error) {
    console.error('Erreur dans la fonction modale:', error);
  }
}

// add click event to all modal items
for (const element of projectItem) {

  element.addEventListener("click", function () {
    modalTitle.innerHTML = this.querySelector("[data-project-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-project-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (const element of selectItems) {
  element.addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
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
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}