const getLibrariesButton = document.querySelector("#get-libraries");
const responsesDiv = document.querySelector("#responses");

getLibrariesButton.addEventListener("click", async () => {
  const response = await fetch("/cc-libraries/data");
  const jsonResponse = await response.json();

  const libraryNamesList = jsonResponse.libraries
    .map(
      (library) =>
        `<li data-libs-id="${library.id}">${library.name} <button onclick="showLibraryContent('${library.id}')">Show contents</button></li>`
    )
    .join("");

  responsesDiv.innerHTML = `<ul>${libraryNamesList}</ul>`;
});

const showLibraryContent = async (libraryId) => {
  const response = await fetch(`/cc-libraries/data/${libraryId}`);
  const libraryJson = await response.json();

  const libraryElementsList = libraryJson.elements
    .map((element) => {
      return `<li data-element-id="${element.id}">${element.name}<button onclick="showElementDetails('${libraryId}', '${element.id}')">Show details</button></li>`;
    })
    .join("");

  const parentLibary = document.querySelector(`[data-libs-id="${libraryId}"]`);
  parentLibary.innerHTML += `<ul>${libraryElementsList}</ul>`;
};

const showElementDetails = async (libraryId, elementId) => {
  const parentElement = document.querySelector(
    `[data-element-id="${elementId}"]`
  );

  const response = await fetch(`/cc-libraries/data/${libraryId}/${elementId}`);
  const elementJson = await response.json();

  const elementMetadataList = getElementMetadataList(elementJson);
  const imageListItem = await getImageListItem(elementJson);

  parentElement.innerHTML += `<ul>${elementMetadataList}${imageListItem}</ul>`;
};

const getElementMetadataList = (elementJson) => {
  const createdDate = new Date(elementJson.created_date);
  const modifiedDate = new Date(elementJson.modified_date);
  const type = elementJson.type;

  const elementDetails = [createdDate, modifiedDate, type]
    .map((detail) => {
      return `<li>${detail}</li>`;
    })
    .join("");

  return elementDetails;
};

const getImageListItem = async (elementJson) => {
  const thumbnailUrl = elementJson.thumbnail.rendition;
  const dataUrl = await getImageData(thumbnailUrl);

  const imageListItem = `<li><img src="${dataUrl}"></li>`;
  return imageListItem;
};

const getImageData = async (url) => {
  const response = await fetch(`/cc-libraries/image?url=${url}`);
  const dataUrl = await response.text();

  return dataUrl;
};
