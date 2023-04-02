const aboutMed = document.querySelector(".about_med");
const goDrugsBtn = document.querySelector(".goDrugs");
const createNewBtn = document.querySelector(".createNew");
const successModal = document.querySelector(".success_modal");

aboutMed.defaultValue =
  aboutMed.dataset.value != undefined ? aboutMed.dataset.value : "";

goDrugsBtn.addEventListener("click", () => {
  window.location.replace("/drugs");
  document.body.style.height = "100%";
  document.body.style.overflow = "unset";
});

createNewBtn.addEventListener("click", () => {
  window.location.replace("/add_new_drug");
  document.body.style.height = "100%";
  document.body.style.overflow = "unset";
});

if (successModal !== null) {
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";
}
