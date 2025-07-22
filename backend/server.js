const app = require("./backEndApp/app");
const serverless = require("serverless-http");

module.exports = serverless(app);

// Local test support
// if (require.main === module) {
//   const port = process.env.PORT || 3000;
//   app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
// }
