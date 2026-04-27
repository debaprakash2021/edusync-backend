import cron from "node-cron";
import Subscription from "../models/subscription.model.js";

export const expireSubscriptions = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await Subscription.updateMany(
        {
          status: "ACTIVE",
          endDate: { $lt: new Date() },
        },
        { status: "EXPIRED" }
      );
      console.log(`Expired ${result.modifiedCount} subscriptions`);
    } catch (err) {
      console.error("Subscription expiry cron failed:", err.message);
    }
  });
};