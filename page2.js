// === CONFIG ===
const N8N_WEBHOOK_URL = "https://noyer-stripe-server.onrender.com/create-checkout-session";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("extra-form");
  const sendBtn = document.getElementById("sendBtn");
  const statusEl = document.getElementById("status");

  const nomAgenceInput = document.getElementById("nom_agence");
  const pageUrlInput = document.getElementById("page_url");
  const exampleUrlInput = document.getElementById("example_url");

  // Récupérer les données de la page précédente
  const params = new URLSearchParams(window.location.search);
  const agencyName = params.get("agency_name") || "";
  const pageUrl = params.get("page_url") || "";
  const exampleUrl = params.get("example_url") || "";

  // Préremplir les champs
  nomAgenceInput.value = agencyName;
  pageUrlInput.value = pageUrl;
  exampleUrlInput.value = exampleUrl;

  // Empêcher modification sur les champs principaux
  pageUrlInput.readOnly = true;
  exampleUrlInput.readOnly = true;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    sendBtn.disabled = true;
    statusEl.style.color = "#ccc";
    statusEl.textContent = "⏳ Envoi des données...";

    try {
      const data = {
        nom_agence: nomAgenceInput.value.trim(),
        page_url: pageUrlInput.value.trim(),
        example_url: exampleUrlInput.value.trim(),
        extra_bien: document.getElementById("extra_bien").value.trim(),
        logo: document.getElementById("logo").value.trim(),
        photo1: document.getElementById("photo1").value.trim(),
        photo2: document.getElementById("photo2").value.trim(),
      };

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur de réponse serveur");

      statusEl.style.color = "#7bd88f";
      statusEl.textContent = "✅ Données envoyées avec succès !";
    } catch (err) {
      console.error(err);
      statusEl.style.color = "#ff6b6b";
      statusEl.textContent = "❌ Erreur lors de l’envoi. Réessayez.";
    } finally {
      sendBtn.disabled = false;
    }
  });
});
