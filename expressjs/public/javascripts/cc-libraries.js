const getLibrariesButton = document.querySelector("#get-libraries");
const responsesDiv = document.querySelector("#responses");

getLibrariesButton.addEventListener("click", async () => {
  const response = await fetch("/cc-libraries");
  const json = await response.json();

  const libraryNamesList = json.libraries
    .map(
      (library) =>
        `<li data-libs-id="${library.id}">${library.name} <button onclick="showLibraryContent('${library.id}')">Show contents</button></li>`
    )
    .join("");

  responsesDiv.innerHTML = `<ul>${libraryNamesList}</ul>`;
});

const showLibraryContent = async (id) => {
  const response = await fetch(`/cc-libraries/${id}`);
  const json = await response.json();

  const libraryElementsList = json.elements
    .map((element) => `<li>${element.name}</li>`)
    .join("");

  const parentLibary = document.querySelector(`[data-libs-id="${id}"]`);
  parentLibary.innerHTML += `<ul>${libraryElementsList}</ul>`;
};
