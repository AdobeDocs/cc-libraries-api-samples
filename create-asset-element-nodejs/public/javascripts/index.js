const fileInput = document.querySelector("#file");
const submitButton = document.querySelector("#submit");
const warningPar = document.querySelector("#warning");

fileInput.addEventListener("change", (e) => {
  resetUI();

  const size = e.target.files[0].size;

  if (size > 5000000) {
    warn("File is too big.");
  }
});

const warn = (warning) => {
  submitButton.setAttribute("disabled", "");
  warningPar.textContent = warning;
};

const resetUI = () => {
  submitButton.removeAttribute("disabled");
  warningPar.textContent = "";
};
