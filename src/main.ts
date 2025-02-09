document.addEventListener("DOMContentLoaded", () => {
  const buttonContainer = document.getElementById("button-container");

  document.querySelectorAll(".start-btn").forEach(button => {
      button.addEventListener("click", (event) => {
          const option = event.target.getAttribute("data-option");
          buttonContainer.style.display = "none"; // Oculta el menú
          loadApp(option);
      });
  });

  function loadApp(option) {
      const container = document.getElementById("app-container");
      if (!container) {
          const newContainer = document.createElement("div");
          newContainer.id = "app-container";
          document.body.appendChild(newContainer);
      } else {
          container.innerHTML = ""; // Limpia la escena
      }

      import("./app.js").then(module => {
          const app = new module.App(option);
          app.init();
      });
  }

  document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
          buttonContainer.style.display = "flex"; // Muestra el menú
      }
  });
});
