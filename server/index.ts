import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { 
  getActiveReferrals, 
  getCompletedReferrals, 
  completeReferral,
  handleTransferWebhook 
} from "./routes/referrals";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Referral system routes
  app.get("/api/referrals/active/:referrerId", getActiveReferrals);
  app.get("/api/referrals/completed/:referrerId", getCompletedReferrals);
  app.put("/api/referrals/:referralId/complete", completeReferral);
  app.post("/api/webhooks/transfer-completed", handleTransferWebhook);

  return app;
}
