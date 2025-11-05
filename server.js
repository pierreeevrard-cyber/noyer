// server.js
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
const stripe = new Stripe("sk_test_51SQ7b0KtSUAGLnZOxFZggrBfTg252Kbx0gHBDZIPM2dnIB4B6wN6NIN4rHN55NiUJyrXMcs9lnydk548w0uB5QGE001fAtuM6M");

app.use(express.json());
app.use(
  cors({
    origin: ["https://pierreevrard-cyber.github.io", "http://localhost:5500"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: "price_1SQ7cBKtSUAGLnZOJicoE24U",
          quantity: 1,
        },
      ],
      success_url:
        "https://pierreevrard-cyber.github.io/noyer-eligibility/success.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "https://pierreevrard-cyber.github.io/noyer-eligibility/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Serveur Stripe Noyer actif");
});

app.listen(4242, () =>
  console.log("✅ Serveur Stripe démarré sur http://localhost:4242")
);
