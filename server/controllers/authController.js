const db = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "super_secret_key";

// ---user registretion---
exports.signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (name.length < 10 || name.length > 40) {
      return res.status(400).json({ error: "Name must be 10-50 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role || "Normal User";

    // ================ Database
    await db.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, userRole]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- --------------user login ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = users[0];

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------adim---
exports.getAdminStats = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT COUNT(*) as c FROM users");
    const [stores] = await db.execute("SELECT COUNT(*) as c FROM stores");
    const [ratings] = await db.execute("SELECT COUNT(*) as c FROM ratings");

    res.json({
      users: users[0].c,
      stores: stores[0].c,
      ratings: ratings[0].c,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- -------------get all users---
exports.getAllUsers = async (req, res) => {
  try {
    const { search = "", sort = "name", order = "ASC" } = req.query;

    // ===============Search query to filter by Name, Email, or Role
    const query = `
            SELECT id, name, email, address, role 
            FROM users 
            WHERE name LIKE ? OR email LIKE ? OR role LIKE ?
            ORDER BY ${sort} ${order}
        `;

    const [users] = await db.execute(query, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ]);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- -=-=-=-=-=-Add new store ---
exports.addStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;

  
    await db.execute(
      "INSERT INTO stores (name, email, address) VALUES (?, ?, ?)",
      [name, email, address]
    );
    res.json({ message: "Store added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------add new user ---
exports.addUser = async (req, res) => {

  exports.signup(req, res);
};
// ---Submit Rating ---
exports.submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.id;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }

        const query = `
            INSERT INTO ratings (user_id, store_id, rating) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE rating = VALUES(rating)
        `;

        await db.execute(query, [userId, storeId, rating]);
        
        await db.execute(`
            UPDATE stores s 
            SET rating = (SELECT AVG(rating) FROM ratings WHERE store_id = s.id)
            WHERE id = ?
        `, [storeId]);

        res.json({ message: "Rating submitted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};