import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

app.use(  
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

app.get("/subscribe", async (req, res) => {
  const tier = req.query.tier as string;
  console.log(tier);

  type Tier = "starter" | "startup" | "advanced" | "enterprise";

  const tiers: Record<Tier, { productId: string; priceId: string }> = {
    starter: {
      productId: "prod_RcSk7O75b2np4b",
      priceId: "price_1QjDolRuTMaRJMyauUcmHHN0",
    },
    startup: {
      productId: "prod_RcSlQXF8IGq56o",
      priceId: "price_1QjDpYRuTMaRJMya4fDFLTBZ",
    },
    advanced: {
      productId: "prod_RcSlLkybzGY3Wk",
      priceId: "price_1QjDqLRuTMaRJMyaraHj6HuQ",
    },
    enterprise: {
      productId: "prod_RcSmzHnTKigXKP",
      priceId: "price_1QjDqvRuTMaRJMyaZT46Mtbl",
    },
  };

  if (!tier) {
    return res.send("Subscription tier not found");
  }

  const normalizedTier = tier.toLowerCase() as Tier;
  const selectedTier = tiers[normalizedTier];

  if (!selectedTier) {
    return res.send("Subscription tier not found");
  }

  const priceId = selectedTier.priceId;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FALLBACK_URL}`,
    });

    console.log(session);

    if (session.url) {
      res.send({
        session_id: session.id,
        url: session.url,
      });
    } else {
      res
        .status(500)
        .send("An error occurred while creating the subscription.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the subscription.");
  }
});

// Success and cancel routes
app.get("/success", async (req, res) => {
  const sessionId = req.query.session_id as string;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log(session);

  res.redirect(`${process.env.BASE_URL}}/customers/${session.customer}`);
});

// Customer portal route
app.get("/customers/:customerId", async (req, res) => {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: req.params.customerId,
      return_url: `${process.env.FALLBACK_URL}`,
    });

    res.redirect(portalSession.url);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while creating the customer portal session.");
  }
});

// Webhook endpoint
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET_KEY as string
    );
  } catch (err) {
    console.error(`Webhook Error: ${err}`);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("New Subscription started!", event.data);
      break;
    case "invoice.paid":
      console.log("Invoice paid", event.data);
      break;
    case "invoice.payment_failed":
      console.log("Invoice payment failed!", event.data);
      break;
    case "customer.subscription.updated":
      console.log("Subscription updated!", event.data);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});

app.listen(port, () => {
  console.log(`Server is running on ${process.env.BASE_URL}`);
});
