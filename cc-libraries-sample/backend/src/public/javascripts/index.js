const loginButton = document.querySelector("#adobe-auth-login");

if (loginButton) {
  loginButton.addEventListener("click", async (e) => {
    try {
      const res = await fetch("/adobe-auth/login");
      const jsonRes = await res.json();
      location.href = jsonRes.requestUrl;
    } catch (error) {
      console.log(error);
    }
  });
}

const logoutButton = document.querySelector("#adobe-auth-logout");

if (logoutButton) {
  logoutButton.addEventListener("click", async (e) => {
    try {
      const res = await fetch("/adobe-auth/logout");
      const jsonRes = await res.json();

      location.href = jsonRes.requestUrl;
    } catch (error) {
      console.log(error);
    }
  });
}

const librariesDiv = document.querySelector("#libraries");
const ccLibrariesButton = document.querySelector("#get-libraries");

if (ccLibrariesButton && librariesDiv) {
  ccLibrariesButton.addEventListener("click", async (e) => {
    try {
      const res = await fetch("/cc-libraries/data");
      const jsonRes = await res.json();

      const libraryNamesList = jsonRes.libraries
        .map(
          (library) => `<li data-libs-id="${library.id}">${library.name}</li>`
        )
        .join("");

      librariesDiv.innerHTML = `<h2>My CC Libraries</h2><ul>${libraryNamesList}</ul>`;
    } catch (error) {
      console.log(error);
    }
  });
}
