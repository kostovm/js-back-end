# JavaScript Back-End Course Repository

This repository contains three server-side SPA applications built with **Node.js**, **Express**, **Handlebars**, and **MongoDB** as part of the JavaScript Back-End course at SoftUni. The applications cover all final exam requirements and include full CRUD functionality, authentication, and additional interactive features.

## Features
- **User authentication** – Register, login, and logout functionality.
- **CRUD operations** – Create, edit, and delete entries.
- **Interactive functionality** – Users can interact with entries using a "like-like" feature (named Purchase, Donate, or Like depending on the app). Users can click only once per entry if they are not the author.
- **Pages & Navigation**:
  - Page displaying all entries.
  - Details page for each entry.
  - Search functionality.

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/kostovm/js-back-end.git
   cd js-back-end
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Ensure you have **MongoDB** installed and running locally or provide a connection string.
4. Start the application:
   ```sh
   npm start
   ```

## Technologies Used
- **Node.js** – Backend runtime environment.
- **Express.js** – Web framework for handling routes and middleware.
- **Express-Handlebars** – Template engine for rendering views.
- **MongoDB & Mongoose** – Database and ODM for data management.
- **Bcrypt** – Password hashing for authentication security.
- **JSON Web Tokens (JWT)** – Token-based authentication.
- **Cookie-Parser** – Middleware for handling cookies.

## Notes
- The `node_modules` folder is not included in the repository and must be installed separately.
- The database must be set up before running the applications.

---
Feel free to explore and modify the applications as needed!
