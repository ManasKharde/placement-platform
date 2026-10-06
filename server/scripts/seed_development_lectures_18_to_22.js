const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const lectures18To22 = [
  {
    topic_order: 18,
    slug: 'node-lecture-18-mongoose-odm-schemas-models-populate-relations-hooks',
    title: 'Lecture 18: Mongoose ODM — Schemas, Models, Validation, ref & .populate() Relations & Pre/Post Middleware Hooks',
    duration_minutes: 73,
    video_url: 'http://www.youtube.com/watch?v=IegWwNkcTxg',
    video_title: 'Lecture 17: Introduction to Mongoose | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Mongoose Official Docs — Schemas, Models & Populate Guide',
        url: 'https://mongoosejs.com/docs/guide.html',
        link: 'https://mongoosejs.com/docs/guide.html'
      }
    ],
    short_description: 'Eliminate boilerplate MongoDB driver code using Mongoose ODM, enforce application-level Schemas and data validation, link collections using ref and .populate(), and automate cascading deletes with pre hooks.',
    summary_markdown: `### 📌 Topic Overview
While MongoDB's schema-less flexibility is powerful, writing raw \`getDB().collection(...)\` queries and manually converting \`new ObjectId(String(id))\` across a large codebase is repetitive and error-prone (a single typo in a field name silently saves bad data). **Mongoose** is an **ODM (Object Data Modeling)** library for Node.js and MongoDB that provides structured **Schemas**, automatic **Type Casting & Validation**, built-in **CRUD methods**, **Cross-Collection Relations (\`populate\`)**, and **Lifecycle Hooks**.

### 💡 Defining a Mongoose Schema & Model
1. **Define the Schema (\`new mongoose.Schema({ ... })\`):** Declares field names, data types (\`String\`, \`Number\`, \`Boolean\`, \`Date\`, \`mongoose.Schema.Types.ObjectId\`), \`required: true\` constraints, and default values.
2. **Compile the Model (\`mongoose.model("Home", homeSchema)\`):**
   * Mongoose automatically pluralizes and lowercases the model name \`"Home"\` to bind to the **\`homes\`** collection!
   * Provides powerful built-in query methods out of the box—eliminating 80% of manual model code:
     * **\`home.save()\`** (inserts new document OR updates existing document),
     * **\`Home.find()\`** (returns array directly—no \`.toArray()\` needed!),
     * **\`Home.findById(homeId)\`** (automatically casts string \`homeId\` to \`ObjectId\`!),
     * **\`Home.findByIdAndDelete(homeId)\`**.

### 💡 Relational References (\`ref\` & \`.populate()\`) & Mongoose \`pre\` Hooks
* **Cross-Collection References:** In \`favouriteSchema\`, define:
  \`houseId: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true, unique: true }\`
* **\`.populate("houseId")\`:** Calling \`Favourite.find().populate("houseId")\` automatically performs a lookup join and replaces each \`houseId\` \`ObjectId\` with the **full \`Home\` document object**!
* **Cascading Delete Hook (\`homeSchema.pre\`):** Register \`homeSchema.pre("findOneAndDelete", async function(next) { ... })\` on \`homeSchema\` so whenever a \`Home\` is deleted via \`findByIdAndDelete()\`, Mongoose automatically deletes its reference from the \`Favourite\` collection first!

### 🛠️ Complete Mongoose Schema, \`populate()\`, and \`pre\` Hook Example
\`\`\`javascript
// File: models/home.js
const mongoose = require("mongoose");
const Favourite = require("./favourite");

const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photoUrl: String,
  description: String
});

// Pre-hook: Automatically cascade delete from Favourite whenever a Home is deleted!
homeSchema.pre("findOneAndDelete", async function(next) {
  const homeId = this.getQuery()._id;
  await Favourite.deleteMany({ houseId: homeId });
  next();
});

module.exports = mongoose.model("Home", homeSchema);

// File: models/favourite.js
const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Favourite", favouriteSchema);
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-18-q1',
        title: 'Q1: What is an ODM (Object Data Modeling) library like Mongoose, and how does it improve upon the native MongoDB Node.js driver?',
        difficulty: 'Easy',
        answer: 'An ODM (Object Data Modeler) maps JavaScript objects in your Node.js application to BSON documents in MongoDB (just like an ORM such as Prisma or Sequelize maps objects to SQL tables). Compared to the raw mongodb driver, Mongoose provides: 1) Application-level Schema enforcement and data validation (required, min/max, enum). 2) Automatic type casting (automatically converting string IDs to ObjectId). 3) Built-in relational population (.populate()). 4) Pre/Post lifecycle middleware hooks. 5) Concise query methods (find, findById, save) without manual cursor .toArray() or getDB() boilerplate.'
      },
      {
        id: 'node-lec-18-q2',
        title: 'Q2: How do ref and .populate() work in Mongoose to join documents across collections?',
        difficulty: 'Medium',
        answer: 'When defining a schema field that stores another document\'s ID, you set type: mongoose.Schema.Types.ObjectId and ref: "Home" (the target Model name). When querying that collection, chaining .populate("houseId") instructs Mongoose to query the referenced "homes" collection behind the scenes and replace the ObjectId reference with the full hydrated Home document.'
      },
      {
        id: 'node-lec-18-q3',
        title: 'Q3: Why did we register homeSchema.pre("findOneAndDelete", ...) when our controller actually called Home.findByIdAndDelete(homeId)?',
        difficulty: 'Hard',
        answer: 'In Mongoose, Model.findByIdAndDelete(id) is a shorthand wrapper that internally executes Model.findOneAndDelete({ _id: id })! Therefore, query middleware hooks for findByIdAndDelete are registered on the "findOneAndDelete" event, where this.getQuery()._id gives you the exact _id being deleted so you can cascade-delete related records before the main deletion runs.'
      },
      {
        id: 'node-lec-18-q4',
        title: 'Q4: In Mongoose, why don\'t we need to wrap string IDs in new ObjectId(id) when calling Home.findById(req.params.homeId)?',
        difficulty: 'Easy',
        answer: 'Because Mongoose knows from the schema that _id is of type ObjectId and automatically casts 24-character hex strings into MongoDB ObjectId instances before sending the query to MongoDB.'
      },
      {
        id: 'node-lec-18-q5',
        title: 'Q5: What happens if a user submits an extra field in req.body that is NOT defined in your Mongoose Schema?',
        difficulty: 'Medium',
        answer: 'By default, Mongoose schemas enforce strict: true mode. Any extra properties passed to new Home(req.body) or update queries that are not declared in homeSchema are automatically stripped out and NOT saved to MongoDB—protecting your database from mass-assignment pollution.'
      },
      {
        id: 'node-lec-18-q6',
        title: 'Q6: How does Mongoose map the model name in mongoose.model("Home", homeSchema) to a collection name in MongoDB?',
        difficulty: 'Easy',
        answer: 'By default, Mongoose passes the model name ("Home") through an internal pluralization and lowercasing utility, binding it to the "homes" collection (and "Person" to "people", "User" to "users").'
      }
    ]
  },
  {
    topic_order: 19,
    slug: 'node-lecture-19-cookies-and-sessions-stateless-http-express-session-mongodbstore',
    title: 'Lecture 19: Cookies & Sessions — Stateless HTTP, Client Cookies (res.cookie) vs. Server Sessions (express-session & MongoDBStore)',
    duration_minutes: 95,
    video_url: 'http://www.youtube.com/watch?v=1GFXygmMvU4',
    video_title: 'Lecture 18: Cookies and Sessions | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Express.js Official Docs — express-session Middleware',
        url: 'https://expressjs.com/en/resources/middleware/session.html',
        link: 'https://expressjs.com/en/resources/middleware/session.html'
      }
    ],
    short_description: 'Overcome HTTP statelessness using Cookies and Sessions, understand why raw client-side cookies can be tampered with, and persist encrypted server-side sessions in MongoDB using express-session and connect-mongodb-session.',
    summary_markdown: `### 📌 Topic Overview
By design, the **HTTP protocol is stateless**: every request arrives as an independent transaction, and the server immediately forgets who the client is once the response is sent. To remember that a user has logged in across page navigations, web applications use **Cookies** and **Sessions**.

### 💡 Client-Side Cookies (\`res.cookie\`) & Why They Are Unsafe Alone
* **How Cookies Work:** When a user logs in, the server sends a \`Set-Cookie: isLoggedIn=true\` HTTP response header via **\`res.cookie("isLoggedIn", true)\`**.
* The browser stores that key-value pair and **automatically attaches \`Cookie: isLoggedIn=true\`** in the request headers of every subsequent request to that domain!
* **The Fatal Security Flaw of Raw Client Cookies:** Because cookies live in the user's browser, any user can open **Chrome DevTools -> Application -> Cookies**, manually type \`isLoggedIn = true\` without logging in, and bypass your authentication!

### 💡 Server-Side Sessions (\`express-session\` + \`connect-mongodb-session\`)
* **How Sessions Solve Tampering:**
  1. Sensitive state (\`isLoggedIn: true\`, \`user: { _id, email, userType }\`) is stored **on the Server (inside MongoDB)**—never in the client's browser!
  2. The server generates a cryptographically signed **Session ID** (\`connect.sid\`) and sends **only that opaque Session ID** in an \`HttpOnly\` cookie to the browser.
  3. On every request, \`express-session\` verifies the signature of \`connect.sid\` using your server \`secret\` and loads the matching session data from MongoDB into **\`req.session\`**.
* **Why Store Sessions in MongoDB (\`connect-mongodb-session\`) Instead of Server RAM?**
  * If sessions are stored in server memory (RAM), restarting \`nodemon\`/the server wipes out all active sessions (logging everyone out!), and memory overflows under heavy traffic. Persisting sessions in a MongoDB \`sessions\` collection keeps users logged in across server restarts and multiple load-balanced servers!

### 🛠️ Configuring \`express-session\` with \`MongoDBStore\` & Logout Destruction
\`\`\`javascript
// 1. In app.js: Configure express-session backed by MongoDBStore
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions"
});

app.use(
  session({
    secret: "KnowledgeGateCompleteCodingSecret",
    resave: false,
    saveUninitialized: true,
    store: store
  })
);

// 2. In controllers/authController.js: Create & Destroy Session
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-19-q1',
        title: 'Q1: What is the difference between a Cookie and a Session? Why is storing isLoggedIn=true directly in a plain client-side cookie a critical security vulnerability?',
        difficulty: 'Medium',
        answer: 'A Cookie is a small piece of key-value text stored directly on the client\'s browser and sent with every HTTP request. A Session stores user state securely on the server (or in a database like MongoDB) and gives the client browser only a cryptographically signed Session ID (connect.sid) inside a cookie. If you store isLoggedIn=true in a plain cookie, any attacker can open Browser DevTools -> Application -> Cookies, manually add or edit isLoggedIn=true, and impersonate an authenticated user! With server-side sessions, an attacker cannot guess or forge a valid signed Session ID.'
      },
      {
        id: 'node-lec-19-q2',
        title: 'Q2: Why should you never use the default in-memory MemoryStore of express-session in production, and why do we use connect-mongodb-session instead?',
        difficulty: 'Medium',
        answer: '1) Volatile State: MemoryStore keeps sessions in the Node.js process RAM—every time the server restarts or redeploys, all users are immediately logged out. 2) Memory Leaks: Under production traffic, thousands of sessions accumulate in RAM and crash the Node process. 3) Horizontal Scaling: If you run 3 Node.js server instances behind a load balancer, User A\'s session in Server 1\'s RAM will not exist when their next request hits Server 2! Storing sessions in MongoDB solves all three problems.'
      },
      {
        id: 'node-lec-19-q3',
        title: 'Q3: What do the secret, resave: false, and saveUninitialized: true/false options do in express-session?',
        difficulty: 'Medium',
        answer: '1) secret: A secret key used to sign the session ID cookie (HMAC) so the server can detect if a client tampered with the cookie value. 2) resave: false tells express-session NOT to force-write the session back to the database on every single request if the session data was not modified during that request. 3) saveUninitialized: false prevents saving empty, unmodified session documents to MongoDB for anonymous visitors who haven\'t logged in yet.'
      },
      {
        id: 'node-lec-19-q4',
        title: 'Q4: What do the HttpOnly, Secure, and SameSite flags on a Cookie do for web security?',
        difficulty: 'Hard',
        answer: '1) HttpOnly: Prevents client-side JavaScript (document.cookie) from reading the cookie, protecting session IDs from being stolen via XSS attacks. 2) Secure: Ensures the browser only transmits the cookie over encrypted HTTPS connections, never over plain HTTP. 3) SameSite (Strict / Lax): Restricts the browser from sending the cookie on cross-site requests initiated by third-party domains, defending against CSRF (Cross-Site Request Forgery) attacks.'
      },
      {
        id: 'node-lec-19-q5',
        title: 'Q5: What happens when you call req.session.destroy(callback) during Logout?',
        difficulty: 'Easy',
        answer: 'req.session.destroy() deletes the user\'s session document from the server/MongoDB sessions collection and invalidates req.session so that even if the client browser still holds the old connect.sid cookie, the server no longer recognizes it as an active session.'
      },
      {
        id: 'node-lec-19-q6',
        title: 'Q6: Why did we copy req.isLoggedIn = req.session.isLoggedIn inside a top-level middleware in app.js?',
        difficulty: 'Easy',
        answer: 'By attaching req.isLoggedIn (or res.locals.isLoggedIn) in a global middleware registered right after express-session, every downstream route, controller, and authentication guard can cleanly read the login state without duplicating session lookup logic.'
      }
    ]
  },
  {
    topic_order: 20,
    slug: 'node-lecture-20-authentication-authorization-express-validator-bcrypt-rbac',
    title: 'Lecture 20: Authentication & Authorization — express-validator, Password Hashing with bcryptjs, RBAC & User-Scoped Data',
    duration_minutes: 132,
    video_url: 'http://www.youtube.com/watch?v=y_Ia7RP4rzk',
    video_title: 'Lecture 19: Authentication & Authorization | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'express-validator Official Docs — Validation & Sanitization Chains',
        url: 'https://express-validator.github.io/docs/',
        link: 'https://express-validator.github.io/docs/'
      }
    ],
    short_description: 'Build production-grade Authentication and Role-Based Authorization (guest vs. host), validate and sanitize signup forms with express-validator, hash passwords irreversibly with bcryptjs, and scope favourites per user.',
    summary_markdown: `### 📌 Topic Overview
This lecture builds a complete production **Signup, Login, and Role-Based Access Control (RBAC)** system—covering the critical distinction between **Authentication** and **Authorization**, server-side input validation, cryptographic password hashing, and user-isolated data relationships.

### 💡 Authentication vs. Authorization
* **Authentication ("Who are you?"):** Verifying a user's identity (e.g., checking their email and password at login, or verifying an ID card at the college gate).
* **Authorization ("What are you allowed to do?"):** Determining what resources and actions an authenticated user has permission to access based on their role (\`userType: "guest"\` can view and favourite homes, whereas \`userType: "host"\` can add, edit, and delete homes).

### 💡 Server-Side Validation (\`express-validator\`)
Client-side HTML5 validation (\`required\`, \`type="email"\`) can be easily bypassed via Postman or DevTools. Use **\`express-validator\`** (\`check()\`, \`validationResult()\`) in your route array to enforce strict rules on the server:
* Trim whitespace and validate names (\`isLength({ min: 2 })\`, \`matches(/^[A-Za-z\\s]+$/)\`).
* Validate and normalize emails (\`isEmail()\`, \`normalizeEmail()\`).
* Enforce strong passwords (\`isLength({ min: 8 })\`, uppercase, lowercase, number, special char, and custom \`.custom((value, { req }) => value === req.body.confirmPassword)\`).

### 💡 Password Hashing with \`bcryptjs\` & User-Scoped Favourites
* **Never store plain-text passwords in MongoDB!** If your database is leaked, plain-text passwords expose every user's account.
* **One-Way Hashing (\`bcrypt.hash(password, 12)\`):** Converts \`"MyPass@123"\` into an irreversible salted 60-character hash (\`$2a$12$...\`) using **12 salt rounds** (making brute-force and rainbow-table attacks computationally infeasible).
* **Verifying Login (\`bcrypt.compare(plainPassword, user.password)\`):** Hashes the login input with the stored salt and returns \`true\` if they match.
* **User-Scoped Favourites:** Instead of a global \`Favourite\` collection shared by everyone, store \`favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }]\` directly inside the **\`User\`** schema!

### 🛠️ \`express-validator\` Chain & \`bcryptjs\` Signup/Login Controller
\`\`\`javascript
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// 1. Validation Middleware Array + Signup Controller
exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should be at least 2 characters long")
    .matches(/^[A-Za-z\\s]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number"),

  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  async (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: { firstName, lastName, email, userType }
      });
    }

    // Hash password with 12 salt rounds before saving User
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
    await user.save();
    res.redirect("/login");
  }
];
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-20-q1',
        title: 'Q1: What is the difference between Authentication and Authorization? Give the HTTP status codes for each failure.',
        difficulty: 'Easy',
        answer: 'Authentication verifies WHO the user is (confirming identity via credentials like email/password, OTP, or session token). If authentication fails or is missing, the server returns HTTP 401 Unauthorized (Unauthenticated). Authorization verifies WHAT permissions or roles an already-authenticated user has (e.g., checking if req.session.user.userType === "host" before allowing access to /host/add-home). If an authenticated guest tries to access a host-only route, the server returns HTTP 403 Forbidden.'
      },
      {
        id: 'node-lec-20-q2',
        title: 'Q2: What is the difference between Encryption and Hashing? Why must passwords always be Hashed (with Salt) rather than Encrypted?',
        difficulty: 'Medium',
        answer: 'Encryption is a two-way reversible function: data encrypted with a key can be decrypted back to plain text if someone obtains the key. Hashing is a one-way irreversible mathematical function: you can never reverse a hash back into the original password! If an attacker steals your database and your encryption key, encrypted passwords can all be decrypted; with hashing (like bcrypt), they cannot. Furthermore, bcrypt automatically generates a unique random "Salt" per user before hashing (with a configurable work factor like 12 rounds), ensuring two users with the same password produce completely different hashes and defeating Rainbow Table attacks.'
      },
      {
        id: 'node-lec-20-q3',
        title: 'Q3: If bcrypt hashes are one-way and cannot be decrypted, how does bcrypt.compare(inputPassword, storedHash) verify a user\'s password at login?',
        difficulty: 'Medium',
        answer: 'A 60-character bcrypt hash string ($2a$12$<22-char-salt><31-char-hash>) embeds the algorithm version, the cost factor (12 rounds), and the exact random salt used when the password was originally hashed! When bcrypt.compare(inputPassword, storedHash) runs, it extracts that salt from storedHash, hashes inputPassword using the exact same salt and 12 rounds, and checks if the resulting hash string matches storedHash.'
      },
      {
        id: 'node-lec-20-q4',
        title: 'Q4: What is the difference between Input Validation and Input Sanitization in express-validator?',
        difficulty: 'Easy',
        answer: 'Validation checks whether the input meets required rules (e.g., .isEmail(), .isLength({ min: 8 }), .isIn(["guest", "host"])) and records an error if it fails. Sanitization modifies and cleans the input before processing (e.g., .trim() removes leading/trailing spaces, .normalizeEmail() lowercases and canonicalizes email addresses, .escape() escapes HTML entities).'
      },
      {
        id: 'node-lec-20-q5',
        title: 'Q5: When a signup form fails validation (HTTP 422), why do we pass oldInput back into res.render("auth/signup", { errors, oldInput })?',
        difficulty: 'Easy',
        answer: 'For good user experience (UX)! Without oldInput, if a user fills out 6 fields on a signup form and makes a small typo in confirmPassword, re-rendering the page would wipe out all their typed inputs and force them to retype everything from scratch. Pre-filling value="<%= oldInput.firstName %>" preserves their valid inputs while displaying the specific validation error messages.'
      },
      {
        id: 'node-lec-20-q6',
        title: 'Q6: Why did we move the favourites array inside the User Mongoose Schema instead of keeping a separate global Favourite collection?',
        difficulty: 'Easy',
        answer: 'In a multi-user application, each logged-in user must have their own personal list of favourited homes! Storing favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }] as an array on the User document scopes favourites per user and allows fetching a user\'s favourite homes in one query via User.findById(req.session.user._id).populate("favourites").'
      }
    ]
  },
  {
    topic_order: 21,
    slug: 'node-lecture-21-file-upload-and-download-multer-multipart-form-data-fs-unlink',
    title: 'Lecture 21: File Uploads & Downloads — multipart/form-data, multer Storage & MIME Filters, Static Serving & fs.unlink() Cleanup',
    duration_minutes: 65,
    video_url: 'http://www.youtube.com/watch?v=837d-bTG6Xs',
    video_title: 'Lecture 20: File Upload & Download | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Multer Official Documentation — Handling multipart/form-data in Express',
        url: 'https://github.com/expressjs/multer#readme',
        link: 'https://github.com/expressjs/multer#readme'
      }
    ],
    short_description: 'Configure HTML file pickers with enctype="multipart/form-data", process binary image uploads in Express using multer (diskStorage and fileFilter), store file paths in MongoDB, and clean up replaced files with fs.unlink().',
    summary_markdown: `### 📌 Topic Overview
Standard HTML forms use \`application/x-www-form-urlencoded\`, which can only transmit text strings—if you put \`<input type="file" name="photo">\` inside a default form, only the filename string is sent, **not the actual binary file**! Uploading images or PDFs requires setting **\`enctype="multipart/form-data"\`** on the HTML \`<form>\` and using the **\`multer\`** middleware on the Express server.

### 💡 Configuring \`multer\` (\`diskStorage\` & \`fileFilter\`)
Because \`express.urlencoded()\` cannot parse \`multipart/form-data\` binary streams, install and configure **\`multer\`**:
1. **\`multer.diskStorage({ destination, filename })\`:**
   * **\`destination: (req, file, cb) => cb(null, "uploads/")\`** — specifies the folder where uploaded files are saved on disk.
   * **\`filename: (req, file, cb) => cb(null, randomString(10) + "-" + file.originalname)\`** — prefixes a random string so two users uploading \`"house.jpg"\` never overwrite each other's files!
2. **\`fileFilter: (req, file, cb) => ...\`:**
   * Inspects **\`file.mimetype\`** on the server (\`["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)\`) because client-side \`accept="image/*"\` on \`<input type="file">\` can be easily bypassed by users!
3. **Accessing Uploaded File vs. Text Fields:**
   * \`app.use(multer({ storage, fileFilter }).single("photo"))\` populates **\`req.file\`** (with \`req.file.path\`, \`filename\`, \`mimetype\`) AND populates **\`req.body\`** with the remaining text fields!

### 💡 Serving Uploaded Images & Deleting Old Files (\`fs.unlink\`)
* **Never store binary images directly inside MongoDB documents** (BSON documents have a 16 MB limit and large blobs slow down queries). Store the file on disk (or S3/Cloudinary) and save **only the relative path (\`req.file.path\`)** in MongoDB!
* **Expose \`/uploads\` Statically:** Mount \`app.use("/uploads", express.static(path.join(rootDir, "uploads")))\` so \`<img src="/<%= home.photo %>">\` loads the image.
* **Clean Up Orphaned Files on Edit (\`fs.unlink\`):** When a host uploads a new photo while editing a home, delete the old photo from disk using **\`fs.unlink(oldFilePath, err => ...)\`** so old unused images don't fill up the server hard drive!

### 🛠️ Complete \`multer\` Configuration & \`fs.unlink\` File Cleanup
\`\`\`javascript
const multer = require("multer");
const fs = require("fs");

// 1. Configure Custom Disk Storage (Destination + Collision-Safe Filename)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Math.random().toString(36).substring(2, 12);
    cb(null, uniquePrefix + "-" + file.originalname);
  }
});

// 2. Server-Side MIME Type Filter (Allow only PNG/JPG/JPEG)
const fileFilter = (req, file, cb) => {
  if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    cb(null, true);  // Accept file
  } else {
    cb(null, false); // Reject file
  }
};

app.use(multer({ storage, fileFilter }).single("photo"));

// 3. In postEditHome Controller: Delete old image file when a new photo is uploaded
if (req.file) {
  fs.unlink(home.photo, (err) => {
    if (err) console.log("Error deleting old image:", err);
  });
  home.photo = req.file.path;
}
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-21-q1',
        title: 'Q1: Why must an HTML <form> include enctype="multipart/form-data" when uploading files, and why can\'t express.urlencoded() parse it?',
        difficulty: 'Easy',
        answer: 'By default, HTML forms use enctype="application/x-www-form-urlencoded", which URL-encodes text keys and values into a single string (key1=val1&key2=val2) and cannot efficiently encode raw binary file streams (it only sends the filename string). Setting enctype="multipart/form-data" splits the HTTP request body into multiple MIME parts separated by a boundary string—allowing raw binary file bytes and text fields to be streamed together. Because express.urlencoded() only understands URL-encoded text, a multipart parser like multer is required.'
      },
      {
        id: 'node-lec-21-q2',
        title: 'Q2: Why do we store only the file path/URL (req.file.path) in MongoDB instead of storing the raw binary image file directly inside the MongoDB document?',
        difficulty: 'Medium',
        answer: '1) Document Size Limit: MongoDB enforces a strict 16 MB maximum size per BSON document. 2) RAM & Query Performance: Databases cache working sets of documents in RAM for fast indexing and querying. Stuffing multi-megabyte binary images inside documents bloats RAM, evicts indexes from cache, and makes simple queries slow and expensive. Storing files on disk or object storage (AWS S3 / Cloudinary) and saving only the lightweight URL string in MongoDB is the universal industry standard.'
      },
      {
        id: 'node-lec-21-q3',
        title: 'Q3: Why is server-side MIME type validation in multer\'s fileFilter mandatory even if you already added accept="image/jpeg, image/png" to the HTML <input type="file">?',
        difficulty: 'Easy',
        answer: 'The HTML accept attribute is merely a UI hint for the user\'s OS file picker dialog—a user can easily select "All Files (*.*)" in the dialog or send a malicious .exe / .sh / .html file directly via Postman or cURL! multer\'s server-side fileFilter inspects file.mimetype on the server and rejects unauthorized file types before they are written to disk.'
      },
      {
        id: 'node-lec-21-q4',
        title: 'Q4: Why did we prefix a random string (or timestamp/UUID) to file.originalname inside multer.diskStorage\'s filename callback?',
        difficulty: 'Easy',
        answer: 'If User A uploads a photo named "image.jpg" and User B later uploads a different photo also named "image.jpg", saving both under file.originalname in the same uploads/ directory would cause User B\'s file to overwrite User A\'s photo! Prefixing a unique random string or timestamp guarantees unique filenames on disk.'
      },
      {
        id: 'node-lec-21-q5',
        title: 'Q5: When a host edits a home without selecting a new file in the file picker, what is the value of req.file, and how should the controller handle it?',
        difficulty: 'Easy',
        answer: 'If the user leaves the file input empty during an Edit submission (or uploads an invalid file type rejected by fileFilter), req.file is undefined. In postEditHome, you must check if (req.file) before updating home.photo—if req.file is undefined, keep the existing home.photo path intact; if req.file exists, delete the old file via fs.unlink(home.photo) and update home.photo = req.file.path.'
      },
      {
        id: 'node-lec-21-q6',
        title: 'Q6: How do you restrict a downloadable file (like house rules PDFs) so only authenticated users can download it instead of exposing it publicly via express.static()?',
        difficulty: 'Medium',
        answer: 'Store the private files in a non-public folder (e.g., rules/ outside of public/), create an authenticated GET route GET /rules/:homeId protected by your auth middleware (if (!req.session.isLoggedIn) return res.redirect("/login")), and use res.download(filePath, customFileName) to stream the file only to authorized users.'
      }
    ]
  },
  {
    topic_order: 22,
    slug: 'node-lecture-22-rest-apis-json-requests-cors-decoupled-mern-architecture',
    title: 'Lecture 22: REST APIs, JSON Requests & CORS — Decoupled MERN Architecture, express.json(), HTTP Status Codes & Full-Stack Integration',
    duration_minutes: 97,
    video_url: 'http://www.youtube.com/watch?v=n-7KgmUFvuI',
    video_title: 'Lecture 21: REST API and JSON Requests | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'MDN Web Docs — Cross-Origin Resource Sharing (CORS) Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
        link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'
      }
    ],
    short_description: 'Architect decoupled RESTful APIs for React and mobile clients, parse JSON payloads with express.json(), configure CORS middleware, use semantic HTTP verbs and status codes, and connect a React frontend to an Express/MongoDB backend.',
    summary_markdown: `### 📌 Topic Overview
In Lectures 1–21, our Express server rendered full HTML pages on the server using **EJS (Server-Side Rendering)**. However, modern **MERN Stack** and multi-platform architectures decouple the **Frontend** (a standalone React SPA on port \`5173\`, plus iOS and Android apps) from the **Backend** (an Express **REST API** on port \`3000\`). Instead of returning HTML views via \`res.render()\`, a REST API exchanges lightweight **JSON data** via **\`res.json()\`**!

### 💡 Core Principles of REST (Representational State Transfer) APIs
1. **Client-Server Separation:** The React frontend handles UI state and routing; the Express backend handles data persistence and business rules. Because the backend speaks pure JSON, the **exact same REST API** serves Web (React), iOS, and Android apps simultaneously!
2. **Statelessness:** Every API request from the client contains all the information needed to process it (e.g., JWT token in \`Authorization\` header, JSON payload in \`req.body\`) without relying on server-rendered view state.
3. **Resource-Based Nouns & Semantic HTTP Verbs:**
   * **\`GET /api/todo\`:** Fetch all todo items (\`200 OK\`).
   * **\`POST /api/todo\`:** Create a new todo item (\`201 Created\`).
   * **\`PUT /api/todo/:id\` or \`PATCH /api/todo/:id/completed\`:** Update an existing item (\`200 OK\`).
   * **\`DELETE /api/todo/:id\`:** Delete an item (\`200 OK\` or \`204 No Content\`).

### 💡 Essential Express Middleware for REST APIs (\`express.json()\` & \`cors\`)
* **\`app.use(express.json())\`:** Parses incoming \`Content-Type: application/json\` payloads sent by \`fetch()\` or Axios into **\`req.body\`**.
* **CORS (Cross-Origin Resource Sharing — \`app.use(cors())\`):**
  * When your React frontend (\`http://localhost:5173\`) calls your Express backend (\`http://localhost:3000\`), the browser's **Same-Origin Policy** blocks the request because the ports (origins) differ!
  * Installing and registering **\`const cors = require("cors"); app.use(cors());\`** adds the \`Access-Control-Allow-Origin\` headers so the browser allows your React app to communicate with your Express API.

### 🛠️ Complete Express REST API Server + Controller (\`todoItemsController.js\`)
\`\`\`javascript
// File: app.js (Pure REST API Backend)
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoItemsRouter = require("./routes/todoItemsRouter");

const app = express();

// 1. Parse JSON request bodies & enable Cross-Origin Resource Sharing (CORS)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// 2. Mount REST API routes
app.use("/api/todo", todoItemsRouter);

// File: controllers/todoItemsController.js
const TodoItem = require("../models/TodoItem");

exports.createTodoItem = async (req, res, next) => {
  const { task, date } = req.body;
  const todoItem = new TodoItem({ task, date });
  await todoItem.save();
  res.status(201).json(todoItem); // 201 Created + JSON response
};

exports.getTodoItems = async (req, res, next) => {
  const todoItems = await TodoItem.find();
  res.json(todoItems);
};

exports.markCompleted = async (req, res, next) => {
  const { id } = req.params;
  const todoItem = await TodoItem.findById(id);
  todoItem.completed = true;
  await todoItem.save();
  res.json(todoItem);
};

exports.deleteTodoItem = async (req, res, next) => {
  const { id } = req.params;
  await TodoItem.findByIdAndDelete(id);
  res.status(204).json({ _id: id });
};
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-22-q1',
        title: 'Q1: Compare Server-Side Rendering (EJS) with a Decoupled REST API Architecture (React + Express). Why do modern companies prefer REST APIs?',
        difficulty: 'Easy',
        answer: 'In Server-Side Rendering (EJS), the backend fetches data, compiles HTML templates on the server, and sends full HTML pages on every navigation—tightly coupling the backend to web HTML. In a REST API architecture, the Express backend only sends and receives raw JSON data (res.json()), while a decoupled frontend (React) renders the UI on the client. Companies prefer REST APIs because: 1) Multi-Platform Reuse: The exact same Express REST API can simultaneously power a React web app, an iOS app, and an Android app. 2) Faster UX: Only tiny JSON payloads travel over the network instead of full-page reloads. 3) Independent Scaling: Frontend and backend teams can deploy and scale independently.'
      },
      {
        id: 'node-lec-22-q2',
        title: 'Q2: What is CORS (Cross-Origin Resource Sharing), why does a browser block React (localhost:5173) from calling Express (localhost:3000) by default, and how does the cors middleware fix it?',
        difficulty: 'Medium',
        answer: 'For security, browsers enforce the Same-Origin Policy, which restricts scripts loaded from one Origin (protocol + domain + port, e.g., http://localhost:5173) from reading responses from a different Origin (http://localhost:3000)—preventing malicious websites from making unauthorized requests to APIs in your browser. The cors() middleware in Express attaches HTTP response headers like Access-Control-Allow-Origin: *, Access-Control-Allow-Methods, and Access-Control-Allow-Headers, explicitly telling the browser that the frontend origin is permitted to access the API.'
      },
      {
        id: 'node-lec-22-q3',
        title: 'Q3: What is a CORS Preflight Request (HTTP OPTIONS method), and when does the browser send it?',
        difficulty: 'Hard',
        answer: 'Before sending a "non-simple" cross-origin request—such as a DELETE, PUT, or PATCH request, or a POST request with Content-Type: application/json or custom Authorization headers—the browser automatically sends a lightweight HTTP OPTIONS preflight request to the server first. The server responds with Access-Control-Allow-Methods and Access-Control-Allow-Headers confirming whether those methods/headers are allowed; only after the preflight succeeds does the browser send the actual request!'
      },
      {
        id: 'node-lec-22-q4',
        title: 'Q4: What is the difference between HTTP PUT and HTTP PATCH in a REST API, and which HTTP methods are Idempotent?',
        difficulty: 'Medium',
        answer: 'PUT is used to completely replace an entire resource representation at a given URI (sending all fields), whereas PATCH is used to apply a partial update to specific fields of a resource (such as toggling { completed: true } on a Todo item). An HTTP method is "Idempotent" if making the exact same request 1 time or 10 times produces the exact same server state: GET, PUT, and DELETE are idempotent, whereas POST is NOT idempotent (calling POST /api/todo 10 times creates 10 separate todo items!).'
      },
      {
        id: 'node-lec-22-q5',
        title: 'Q5: Why did we need app.use(express.json()) in Lecture 22 when we already had app.use(express.urlencoded()) in earlier lectures?',
        difficulty: 'Easy',
        answer: 'In earlier lectures, data was submitted via standard HTML <form> tags, which encode payloads as application/x-www-form-urlencoded (parsed by express.urlencoded()). In a React REST client, fetch() sends payloads via JSON.stringify(data) with header Content-Type: application/json—which requires app.use(express.json()) to parse the JSON stream into req.body.'
      },
      {
        id: 'node-lec-22-q6',
        title: 'Q6: What are the standard HTTP Status Codes used across REST API responses (200, 201, 204, 400, 401, 403, 404, 422, 500)?',
        difficulty: 'Easy',
        answer: '2xx Success: 200 OK (standard GET/PUT/PATCH success), 201 Created (resource created via POST), 204 No Content (successful DELETE with empty body). 4xx Client Errors: 400 Bad Request (malformed syntax), 401 Unauthorized (not logged in / invalid token), 403 Forbidden (logged in, but insufficient role permissions), 404 Not Found (resource ID does not exist), 422 Unprocessable Entity (validation failed). 5xx Server Errors: 500 Internal Server Error (unhandled backend crash/exception).'
      }
    ]
  }
];

function sanitizeUrl(raw) {
  if (!raw) return '';
  let u = raw.trim();
  const mdMatch = u.match(/\[.*?\]\((https?:\/\/[^\s\)]+)\)/);
  if (mdMatch) {
    u = mdMatch[1];
  }
  u = u.replace(/^[\[\(]+/, '').replace(/[\]\)]+$/, '');
  return u.trim();
}

function cleanMarkdown(raw) {
  if (!raw) return '';
  let md = raw.replace(/>\s*🎥\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/>\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/\]*\]/gi, '');
  md = md.replace(/<\/?think>/gi, '');

  const lines = md.split('\n');
  const result = [];
  let inCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }

    if (inCode) {
      result.push(line);
      continue;
    }

    if (/^\|[-:\s|]+\|$/.test(trimmed)) continue;

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim()).filter(c => c.length > 0);
      if (cells.length > 0) {
        result.push('* **' + cells[0].replace(/^\*\*(.*?)\*\*$/, '$1') + ':** ' + cells.slice(1).join(' — '));
      }
      continue;
    }

    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      continue;
    }

    if (trimmed.startsWith('>')) {
      const withoutGt = trimmed.replace(/^>+\s*/, '');
      if (!withoutGt) continue;
      if (withoutGt.startsWith('* ') || withoutGt.startsWith('- ')) {
        result.push(withoutGt);
      } else {
        result.push('* ' + withoutGt);
      }
      continue;
    }

    result.push(line);
  }

  md = result.join('\n');
  return md.replace(/\n{3,}/g, '\n\n').trim();
}

async function seedDevelopmentLectures18To22() {
  const client = await pool.connect();
  try {
    console.log('=== SEEDING DEVELOPMENT TRACK LECTURES 18 TO 22 ===');
    await client.query('BEGIN');

    // 1. Locate Development track by querying Lecture 1's track_id
    const devTrackLookup = await client.query(`
      SELECT track_id FROM topics WHERE slug = 'node-lecture-1-introduction-to-nodejs-architecture-v8-libuv' LIMIT 1;
    `);

    if (devTrackLookup.rows.length === 0) {
      throw new Error("Lecture 1 not found! Please ensure Batch 1 is seeded.");
    }

    const devTrackId = devTrackLookup.rows[0].track_id;
    console.log(`Found Development Track: [ID:${devTrackId}]`);

    const creatorName = 'Complete Coding by Prashant Sir';
    const creatorChannelUrl = 'https://www.youtube.com/@CompleteCodingByPrashantSir';

    // 2. Upsert Lectures 18 to 22
    for (const lec of lectures18To22) {
      const cleanSummary = cleanMarkdown(lec.summary_markdown);
      const sanitizedVideoUrl = sanitizeUrl(lec.video_url);

      const practiceArray = lec.interview_questions.map((q) => ({
        id: q.id,
        problemId: q.id.replace(/^node-lec-/, ''),
        title: q.title,
        name: q.title,
        difficulty: q.difficulty,
        description: q.answer,
        answer: q.answer,
        platform: 'Technical Interview QA',
        url: null,
        link: null
      }));

      const practiceJson = JSON.stringify(practiceArray);

      const sanitizedDocs = (lec.doc_links || []).map((doc) => ({
        title: doc.title,
        url: sanitizeUrl(doc.url || doc.link),
        link: sanitizeUrl(doc.url || doc.link)
      }));
      const docLinksJson = JSON.stringify(sanitizedDocs);
      const primaryDocUrl = sanitizedDocs[0]?.url || 'https://nodejs.org/en/learn';

      const videoLinksJson = JSON.stringify([
        {
          title: lec.video_title || lec.title,
          url: sanitizedVideoUrl,
          duration: `${lec.duration_minutes || 45}m`,
          creator_name: creatorName,
          creator_channel_url: creatorChannelUrl
        }
      ]);

      // Check if topic exists
      const existing = await client.query(`SELECT id FROM topics WHERE slug = $1 LIMIT 1;`, [lec.slug]);
      let topicId;

      if (existing.rows.length > 0) {
        topicId = existing.rows[0].id;
        await client.query(`
          UPDATE topics SET
            name = $1,
            title = $1,
            topic_order = $2,
            short_description = $3,
            description = $3,
            summary_markdown = $4,
            theory_summary = $4,
            official_docs_url = $5,
            practice_items = $6::jsonb,
            practice_problems = $6::jsonb,
            doc_links = $7::jsonb,
            video_links = $8::jsonb,
            creator_name = $9,
            creator_channel_url = $10,
            track_id = $11
          WHERE id = $12;
        `, [
          lec.title,
          lec.topic_order,
          lec.short_description,
          cleanSummary,
          primaryDocUrl,
          practiceJson,
          docLinksJson,
          videoLinksJson,
          creatorName,
          creatorChannelUrl,
          devTrackId,
          topicId
        ]);
      } else {
        const insertRes = await client.query(`
          INSERT INTO topics (
            name, title, slug, topic_order, short_description, description,
            summary_markdown, theory_summary, official_docs_url,
            practice_items, practice_problems, doc_links, video_links,
            creator_name, creator_channel_url, track_id
          ) VALUES (
            $1, $1, $2, $3, $4, $4,
            $5, $5, $6,
            $7::jsonb, $7::jsonb, $8::jsonb, $9::jsonb,
            $10, $11, $12
          ) RETURNING id;
        `, [
          lec.title,
          lec.slug,
          lec.topic_order,
          lec.short_description,
          cleanSummary,
          primaryDocUrl,
          practiceJson,
          docLinksJson,
          videoLinksJson,
          creatorName,
          creatorChannelUrl,
          devTrackId
        ]);
        topicId = insertRes.rows[0].id;
      }

      // Map in track_topics (clean order collision first)
      await client.query(`
        DELETE FROM track_topics WHERE track_id = $1 AND topic_order = $2;
      `, [devTrackId, lec.topic_order]);

      await client.query(`
        INSERT INTO track_topics (track_id, topic_id, topic_order)
        VALUES ($1, $2, $3)
        ON CONFLICT (track_id, topic_id) DO UPDATE SET topic_order = EXCLUDED.topic_order;
      `, [devTrackId, topicId, lec.topic_order]);

      // Sync resources table for video and documentation
      await client.query(`
        DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('problem', 'practice', 'video', 'documentation');
      `, [topicId]);

      // Insert video resource
      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'video', $4);
      `, [topicId, lec.video_title || lec.title, sanitizedVideoUrl, lec.duration_minutes || 45]);

      // Insert documentation resource(s)
      for (const doc of sanitizedDocs) {
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
          VALUES ($1, $2, $3, 'documentation', 10);
        `, [topicId, doc.title, doc.url]);
      }

      console.log(`[SEED] Lecture ${lec.topic_order} (ID:${topicId}): ${lec.slug} | MdLen: ${cleanSummary.length} | Questions: ${practiceArray.length}`);
    }

    // 3. Update track metadata (total_topics = 22 and estimated_hours) if columns exist
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tracks' AND column_name IN ('total_topics', 'estimated_hours');
    `);
    const availableCols = colCheck.rows.map(r => r.column_name);

    if (availableCols.includes('total_topics') && availableCols.includes('estimated_hours')) {
      await client.query(`
        UPDATE tracks SET total_topics = 22, estimated_hours = 30 WHERE id = $1;
      `, [devTrackId]);
      console.log('Updated tracks metadata: total_topics = 22, estimated_hours = 30');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`
        UPDATE tracks SET total_topics = 22 WHERE id = $1;
      `, [devTrackId]);
      console.log('Updated tracks metadata: total_topics = 22');
    }

    await client.query('COMMIT');
    console.log('--- Development Track Lectures 18 to 22 Seeded Successfully (Total: 22 Topics) ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Development Lectures 18 to 22 seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedDevelopmentLectures18To22();
