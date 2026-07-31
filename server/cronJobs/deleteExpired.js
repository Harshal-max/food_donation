// cronJobs/deleteExpired.js
import cron from "node-cron";
import Item from "../models/Item.js"; // Adjust path if needed

const startDeleteExpiredItemsJob = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("🧹 Running cron job to delete expired items...");

    const now = new Date();

    try {
      // NOTE: previously this queried `perishable`/`expiryTime`, which don't
      // exist on the Item schema (it's `isPerishable`/`deleteAfter`) - so this
      // job silently deleted nothing. Fixed to match the real schema fields.
      const result = await Item.deleteMany({
        isPerishable: true,
        deleteAfter: { $lte: now },
      });

      if (result.deletedCount > 0) {
        console.log(`✅ Deleted ${result.deletedCount} expired perishable items.`);
      }
    } catch (err) {
      console.error("❌ Cron job error:", err.message);
    }
  });
};

export default startDeleteExpiredItemsJob;
