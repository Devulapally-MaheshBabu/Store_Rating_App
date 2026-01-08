const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/apiRoutes");

const app = express();

// --=--=-=-=-Middleware
app.use(cors());
app.use(express.json());

// =-=-=-=-=-Use Routes
app.use("/api", apiRoutes);

// =============Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
