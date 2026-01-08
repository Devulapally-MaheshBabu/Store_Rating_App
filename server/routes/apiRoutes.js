const express = require("express");
const router = express.Router();
const db = require("../db");

// Importing routs
const {
  signup,
  login,
  getAdminStats,
  getAllUsers,
  addStore,
  addUser,
  submitRating,
} = require("../controllers/authController");

const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// ==========================================
// Public Route
// ==========================================
router.post("/signup", signup);
router.post("/login", login);

// =--=-=-=-=-=-=-=-=Get All Stores 
router.get("/stores", verifyToken, async (req, res) => {
  try {
    const { search = "", sort = "name", order = "ASC" } = req.query;
    const orderBy = sort === "rating" ? "rating" : "name";

    const query = `
            SELECT * FROM stores 
            WHERE name LIKE ? OR address LIKE ? 
            ORDER BY ${orderBy} ${order}
        `;
    const [stores] = await db.execute(query, [`%${search}%`, `%${search}%`]);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Adim routs 
// ==========================================

router.get(
  "/admin/stats",
  verifyToken,
  checkRole(["System Administrator"]),
  getAdminStats
);

router.get(
  "/admin/users",
  verifyToken,
  checkRole(["System Administrator"]),
  getAllUsers
);

router.post(
  "/admin/add-store",
  verifyToken,
  checkRole(["System Administrator"]),
  addStore
);

router.post(
  "/admin/add-user",
  verifyToken,
  checkRole(["System Administrator"]),
  addUser
);

// ==========================================
// Normal routes
// ==========================================
router.post("/rating", verifyToken, submitRating);

module.exports = router;
