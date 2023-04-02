const search = document.querySelector(".search");
const all = document.querySelector(".all");
const nonDiscount = document.querySelector(".non_discount");
const discount = document.querySelector(".with_discount");

search.addEventListener("input", (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const select = urlParams.get("select");
  fetch(`/drugs?search=${event.target.value}&select=${select}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  window.location.replace(
    `/drugs?search=${event.target.value}&select=${select}`
  );
});

all.addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get("search") || "";
  window.location.replace(`/drugs?search=${search}&select=all`);
});

nonDiscount.addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get("search") || "";
  window.location.replace(`/drugs?search=${search}&select=non_discount`);
});

discount.addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get("search") || "";
  window.location.replace(`/drugs?search=${search}&select=discount`);
});
