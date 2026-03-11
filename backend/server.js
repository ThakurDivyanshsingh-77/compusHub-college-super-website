require("dotenv").config();
const app = require("./app");
const initDb = require("./scripts/initDb");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initDb();
  } catch (err) {
    console.error("Failed to initialize database schema:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`CampusHub backend running on port ${PORT}`);
  });
})();
