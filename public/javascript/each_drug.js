const deleteBtn = document.querySelector(".delete");
const modalDelete = document.querySelector(".modal_delete");
const rejectDelete = document.querySelector(".reject_delete");

deleteBtn.addEventListener("click", () => {
  modalDelete.style.display = "flex";
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";
});

rejectDelete.addEventListener("click", () => {
  modalDelete.style.display = "none";
  document.body.style.height = "100%";
  document.body.style.overflow = "unset";
});
