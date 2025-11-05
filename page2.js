const WEBHOOK_URL = "https://pierre07.app.n8n.cloud/webhook/8f68d709-e3f9-4bd3-b6bb-929358163dcf";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const pageUrlInput = document.getElementById("page_url");
  const exampleUrlInput = document.getElementById("example_url");
  const photo1Input = document.getElementById("photo1");
  const photo2Input = document.getElementById("photo2");
  const form = document.getElementById("extra-form");
  const statusEl = document.getElementById("status");
  const btn = document.getElementById("sendBtn");

  // Pré-remplir les champs verrouillés
  pageUrlInput.value = params.get("page_url") || "";
  exampleUrlInput.value = params.get("example_url") || "";

  // --- Validation des extensions d’images ---
  function isValidImageUrl(url) {
    return /\.(jpg|jpeg|png|webp|avif)$/i.test(url);
  }

  function validateImages() {
    const photo1 = photo1Input.value.trim();
    const photo2 = photo2Input.value.trim();

    if (photo1 && !isValidImageUrl(photo1)) {
      statusEl.style.color = "#ff6b6b";
      statusEl.textContent = "⚠️ L’URL de la première photo n’est pas une image valide (.jpg, .png, .webp, .avif).";
      btn.disabled = true;
      return false;
    }

    if (photo2 && !isValidImageUrl(photo2)) {
      statusEl.style.color = "#ff6b6b";
      statusEl.textContent = "⚠️ L’URL de la deuxième photo n’est pas une image valide (.jpg, .png, .webp, .avif).";
      btn.disabled = true;
      return false;
    }

    statusEl.textContent = "";
    btn.disabled = false;
    return true;
  }

  photo1Input.addEventListener("input", validateImages);
  photo2Input.addEventListener("input", validateImages);

  // --- Envoi du formulaire ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateImages()) return; // stop si les images sont invalides

    btn.disabled = true;
    statusEl.textContent = "⏳ Envoi en cours…";

    const data = {
      nom_agence: document.getElementById("nom_agence").value.trim(),
      page_url: pageUrlInput.value.trim(),
      example_url: exampleUrlInput.value.trim(),
      extra_bien: document.getElementById("extra_bien").value.trim(),
      photo1: photo1Input.value.trim(),
      photo2: photo2Input.value.trim(),
      logo: document.getElementById("logo").value.trim(),
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      statusEl.style.color = "#7bd88f";
      statusEl.textContent = "✅ Données envoyées avec succès !";
    } catch (err) {
      statusEl.style.color = "#ff6b6b";
      statusEl.textContent = "❌ Erreur pendant l’envoi. Réessayez.";
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
});
