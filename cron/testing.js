import cron from "node-cron";

export const testing = () => {

    console.log("Testing function schedule");

  cron.schedule("* * * * *", () => {
    console.log("Running at the oreffered time");
  });
};

// minute || hour || day || month || dayOfWeek