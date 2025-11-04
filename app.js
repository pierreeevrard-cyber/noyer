// === CONFIG ===
// Mets ici l’URL "Production URL" du node Webhook (onglet Webhook URLs) — pas l'URL de test.
const N8N_WEBHOOK_URL = "https://pierre07.app.n8n.cloud/webhook/d086fafa-765a-43f0-8b40-8ed6e6b38142";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("eligibility-form");
  const urlInput = document.getElementById("url");
  const statusEl = document.getElementById("status");
  const btn = document.getElementById("verifyBtn");

  if (!form || !urlInput || !statusEl) {
    console.warn("IDs manquants dans le DOM (eligibility-form, url, status)");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.style.color = "#ccc";
    statusEl.textContent = "⏳ Vérification en cours…";
    btn.disabled = true;

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.value.trim() }),
        // Pas besoin de mode: 'no-cors' ici : on gère CORS côté n8n
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { eligible: false, reason: text || "Réponse invalide" }; }

      if (!res.ok) {
        throw new Error(data?.reason || `HTTP ${res.status}`);
      }

      if (data.eligible) {
        statusEl.style.color = "#7bd88f";
        statusEl.textContent = "✅ Éligible ! Votre site est compatible.";
      } else {
        statusEl.style.color = "#ff6b6b";
        statusEl.textContent = `❌ Non éligible. ${data.reason || ""}`.trim();
      }
    } catch (err) {
      console.error(err);
      statusEl.style.color = "#ff6b6b";
      statusEl.textContent = "⚠️ Erreur pendant la vérification. Réessayez.";
    } finally {
      btn.disabled = false;
    }
  });
});
