# Store Rating App

A full-stack web application that allows users to view and rate stores. The system features Role-Based Access Control (RBAC) with specific dashboards for System Administrators, Store Owners, and Normal Users.

##  Features

- **Authentication:** Secure Login and Signup with password hashing.
- **Role-Based Access Control:**
  - **System Administrator:** Can add stores, manage users, and view system statistics.
  - **Normal User:** Can search for stores and submit ratings (1-5 stars).
  - **Store Owner:** (In Progress) View dashboard and ratings for their specific store.
- **Dashboard:** Dynamic stats (Total Users, Total Stores, Total Ratings).
- **Search:** Real-time search functionality for stores and users.

## Tech Stack

- **Frontend:** React.js, Context API, Axios
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Styling:** CSS / Inline Styles

---

## ⚙️ How to Install & Run

Follow these steps to set up the project locally on your machine.

### 1. Clone the Repository
- ->Open your terminal and run:git clone [https://github.com/Devulapally-MaheshBabu/Store_Rating_App.git](https://github.com/Devulapally-MaheshBabu/Store_Rating_App.git)
cd Store_Rating_App
- ->cd server
- ->npm install
- ->Create the Security File :
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE
DB_NAME=store_rating_db
- ->Start the Serve : node server.js
- ->Setup the Frontend : cd client

##**Database Setup (MySQL)**

- CREATE DATABASE store_rating_db;
USE store_rating_db;
- ->Create Users Table :
- CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    address VARCHAR(255),
    role VARCHAR(50) DEFAULT 'Normal User'
);

- ->Create Stores Table :
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    address VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 0,
    rating_count INT DEFAULT 0
);

```bash
git clone [https://github.com/Devulapally-MaheshBabu/Store_Rating_App.git](https://github.com/Devulapally-MaheshBabu/Store_Rating_App.git)
cd Store_Rating_App
