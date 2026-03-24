/**
 * Migration script — creates / syncs all tables in the SQLite database.
 * Run with:  npm run migrate  OR  node migrate.js
 */
const sequelize = require("./database");
require("./models"); // register models

async function migrate() {
  try {
    await sequelize.sync({ force: false }); // force:true would drop & recreate
    console.log("Migration complete — all tables synced.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
