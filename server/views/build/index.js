const urlParameters = new URLSearchParams(window.location.search);
const statuss = urlParameters.get("status");
const message = urlParameters.get("message");
const cards = document.querySelector(".card");
const statusIcon = document.getElementById("statusIcon");
const statusMessage = document.getElementById("statusMessage");
const button = document.getElementById("btn");
console.log(statuss);
console.log(message);
if (statuss === "success") {
  statusIcon.innerHTML = "✅";
  statusMessage.textContent = message;
  cards.classList.add("success");
  statusIcon.classList.add("success");
  statusMessage.classList.add("success");
  button.classList.add("showBtn");
} else if (statuss === "error") {
  statusIcon.innerHTML = "❌";
  statusMessage.textContent = message;
  cards.classList.add("error");
  statusIcon.classList.add("error");
  statusMessage.classList.add("error");
  button.classList.add("hideBtn");
}