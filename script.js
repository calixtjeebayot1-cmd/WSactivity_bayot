const form = document.querySelector("#registration-form");
const statusMessage = document.querySelector("#form-status");
const passwordInput = document.querySelector("#password");
const togglePasswordButton = document.querySelector("#toggle-password");

const fields = {
  studentId: document.querySelector("#student-id"),
  fullName: document.querySelector("#full-name"),
  email: document.querySelector("#email"),
  phone: document.querySelector("#phone"),
  birthDate: document.querySelector("#birth-date"),
  gender: document.querySelector('input[name="gender"]'),
  program: document.querySelector("#program"),
  yearLevel: document.querySelector("#year-level"),
  password: passwordInput,
  confirmPassword: document.querySelector("#confirm-password"),
  address: document.querySelector("#address"),
  agreement: document.querySelector("#agreement")
};

function validateField(name) {
  const field = fields[name];
  const value = name === "password" || name === "confirmPassword"
    ? field.value
    : field.value.trim();

  if (name === "gender") {
    return form.querySelector('input[name="gender"]:checked')
      ? ""
      : "Please select a gender.";
  }

  if (name === "agreement") {
    return field.checked ? "" : "Please confirm that your information is correct.";
  }

  if (!value) {
    return `${field.dataset.label} is required.`;
  }

  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address.";
  }

  if (name === "phone" && (
    !/^\+?[0-9\s()-]+$/.test(value) ||
    value.replace(/\D/g, "").length < 7 ||
    value.replace(/\D/g, "").length > 15
  )) {
    return "Enter a valid phone number (7–15 digits; +, spaces, dashes, and parentheses are allowed).";
  }

  if (name === "birthDate" && new Date(`${value}T00:00:00`) > new Date()) {
    return "Date of birth cannot be in the future.";
  }

  if (name === "password" && value.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (name === "confirmPassword" && value !== fields.password.value) {
    return "Passwords do not match.";
  }

  return "";
}

function showFieldError(field, message) {
  const errorElement = document.getElementById(field.dataset.errorTarget);
  errorElement.textContent = message;

  if (field.name === "gender") {
    form.querySelectorAll('input[name="gender"]').forEach((radio) => {
      if (message) {
        radio.classList.add("error");
      } else {
        radio.classList.remove("error");
      }
    });
    if (message) {
      field.closest("fieldset").classList.add("error");
    } else {
      field.closest("fieldset").classList.remove("error");
    }
  } else {
    if (message) {
      field.classList.add("error");
    } else {
      field.classList.remove("error");
    }
  }
}

function validateAndShow(name) {
  const field = fields[name];
  const message = validateField(name);
  showFieldError(field, message);
  return message === "";
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  statusMessage.textContent = "";

  ["studentId", "fullName", "email", "phone", "birthDate", "address"].forEach((name) => {
    fields[name].value = fields[name].value.trim();
  });

  const isValid = Object.keys(fields).map(validateAndShow).every(Boolean);
  if (isValid) {
    statusMessage.textContent = "Registration successful!";
  }
});

form.addEventListener("input", function(event) {
  const name = Object.keys(fields).find((key) => fields[key] === event.target);
  if (!name) {
    return;
  }

  const errorElement = document.getElementById(fields[name].dataset.errorTarget);
  if (errorElement.textContent) {
    validateAndShow(name);
  }

  if (name === "password" && document.getElementById(fields.confirmPassword.dataset.errorTarget).textContent) {
    validateAndShow("confirmPassword");
  }
});

form.addEventListener("change", function(event) {
  if (event.target.name === "gender") {
    validateAndShow("gender");
  } else if (event.target === fields.program || event.target === fields.yearLevel || event.target === fields.agreement) {
    const name = Object.keys(fields).find((key) => fields[key] === event.target);
    if (document.getElementById(fields[name].dataset.errorTarget).textContent) {
      validateAndShow(name);
    }
  }
});

togglePasswordButton.addEventListener("click", function() {
  const isVisible = togglePasswordButton.classList.toggle("visible");
  passwordInput.type = isVisible ? "text" : "password";
  togglePasswordButton.textContent = isVisible ? "Hide" : "Show";
  togglePasswordButton.setAttribute("aria-pressed", String(isVisible));
});

form.addEventListener("reset", function() {
  window.setTimeout(function() {
    Object.keys(fields).forEach((name) => {
      showFieldError(fields[name], "");
    });
    statusMessage.textContent = "";
    togglePasswordButton.classList.remove("visible");
    passwordInput.type = "password";
    togglePasswordButton.textContent = "Show";
    togglePasswordButton.setAttribute("aria-pressed", "false");
  }, 0);
});
