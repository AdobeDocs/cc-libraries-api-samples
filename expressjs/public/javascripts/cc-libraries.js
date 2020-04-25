const getLibrariesButton = document.querySelector("#get-libraries");
const responsesDiv = document.querySelector("#responses");

getLibrariesButton.addEventListener("click", async () => {
  const response = await fetch("/cc-libraries");
  const json = await response.json();

  const libraryNamesList = json.libraries
    .map((library) => `<li>${library.name}</li>`)
    .join("");

  responsesDiv.innerHTML = `<ul>${libraryNamesList}</ul>`;
});
