const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const batch2Lectures = [
  {
    topic_order: 13,
    slug: 'node-lecture-13-mvc-architecture-models-views-controllers-separation-of-concerns',
    title: 'Lecture 13: MVC (Model-View-Controller) Architecture — Separation of Concerns, Models, Controllers & Refactoring Express Apps',
    duration_minutes: 102,
    video_url: 'http://www.youtube.com/watch?v=N3rkdpBjmH8',
    video_title: 'Lecture 13: MVC Architecture | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'MDN Web Docs — MVC (Model-View-Controller) Architecture Pattern',
        url: 'https://developer.mozilla.org/en-US/docs/Glossary/MVC',
        link: 'https://developer.mozilla.org/en-US/docs/Glossary/MVC'
      }
    ],
    short_description: 'Refactor growing Express.js codebases using the MVC (Model-View-Controller) design pattern to cleanly separate data persistence, UI templates, and request-handling business logic.',
    summary_markdown: `### 📌 Topic Overview
As an application grows, placing routing, HTML rendering, array/file storage, and business logic inside the same route files creates unmaintainable spaghetti code. **MVC (Model-View-Controller)** is an architectural pattern that enforces **Separation of Concerns** by dividing the application into three distinct layers.

### 💡 The 3 Pillars of MVC Architecture
1. **Model (\`models/home.js\` — Data & Storage Layer):**
   * Defines the structure (schema/class) of data entities (e.g., \`Home\` with \`houseName\`, \`price\`, \`location\`, \`rating\`, \`photoUrl\`).
   * Manages all data persistence operations (\`save()\`, \`fetchAll()\`, reading/writing to \`data/homes.json\` or a database).
   * Does **not** know anything about HTTP \`req\`/\`res\` objects or EJS templates.
2. **View (\`views/store/\`, \`views/host/\` — Presentation Layer):**
   * Responsible solely for how data looks to the user (\`home-list.ejs\`, \`add-home.ejs\`, \`bookings.ejs\`, \`404.ejs\`).
   * Organized into actor-specific subfolders (\`views/store/\` for guests vs. \`views/host/\` for property hosts).
3. **Controller (\`controllers/storeController.js\`, \`hostController.js\`, \`errors.js\` — Coordinator Layer):**
   * Sits between the **Model** and the **View**.
   * Receives incoming requests from \`routes/\`, extracts user input (\`req.body\`), calls methods on the **Model** (\`home.save()\`, \`Home.fetchAll()\`), and passes the resulting data to the **View** (\`res.render()\`).

### 💡 Handling Asynchronous File Reads in \`Home.fetchAll(callback)\`
Because \`fs.readFile()\` inside \`Home.fetchAll()\` is **asynchronous**, \`Home.fetchAll()\` cannot simply \`return\` the parsed array synchronously! Instead, the Controller passes a **callback function** into \`Home.fetchAll(registeredHomes => { res.render(...); })\` so the View is rendered only after the JSON file finishes reading from disk.

### 🛠️ Implementing a Model (\`models/home.js\`) & Controller (\`controllers/hostController.js\`)
\`\`\`javascript
// File: models/home.js
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");
const homeDataPath = path.join(rootDir, "data", "homes.json");

module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
  }

  save() {
    Home.fetchAll((registeredHomes) => {
      registeredHomes.push(this);
      fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (err) => {
        if (err) console.log("Error writing homes.json:", err);
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(homeDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }
};

// File: controllers/hostController.js
const Home = require("../models/home");

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl } = req.body;
  const home = new Home(houseName, price, location, rating, photoUrl);
  home.save();
  res.render("host/home-added", { pageTitle: "Home Added Successfully" });
};
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-13-q1',
        title: 'Q1: Explain the responsibilities of Model, View, and Controller in the MVC architecture pattern, and how Express Routers fit into MVC.',
        difficulty: 'Easy',
        answer: '1) Model: Manages the data structure, validation rules, and direct persistence logic (reading/writing to files or databases). 2) View: Handles the presentation/UI layer displayed to the user (such as EJS templates or React views). 3) Controller: Acts as the middleman—it receives user input from routes, invokes Model methods to read/mutate data, and selects which View to render. In Express, Routers act as the entry dispatcher that maps URLs and HTTP verbs to the appropriate Controller action.'
      },
      {
        id: 'node-lec-13-q2',
        title: 'Q2: Why did Home.fetchAll() return undefined when we tried to return JSON.parse(data) directly from inside fs.readFile(), and how did passing a callback solve it?',
        difficulty: 'Medium',
        answer: 'fs.readFile() is an asynchronous non-blocking operation. When Home.fetchAll() is called, it registers the fs.readFile callback with libuv and immediately finishes executing before the disk read even completes—so fetchAll() itself returns undefined! Any return statement inside the fs.readFile callback only returns to internal libuv callers, not to the Controller. By passing a callback function Home.fetchAll((homes) => res.render(...)), the Controller defers rendering until fs.readFile invokes callback(JSON.parse(data)).'
      },
      {
        id: 'node-lec-13-q3',
        title: 'Q3: Why is fetchAll() defined as a static method on the Home class while save() is defined as an instance method?',
        difficulty: 'Easy',
        answer: 'save() operates on a specific single Home instance that was just instantiated with new Home(houseName, price, ...) (using this to save that specific home). In contrast, fetchAll() retrieves the entire collection of all homes from storage and does not belong to any single home instance—so calling Home.fetchAll() directly on the class without instantiating a dummy new Home() is semantically clean.'
      },
      {
        id: 'node-lec-13-q4',
        title: 'Q4: How does MVC make migrating from JSON file storage to SQL or MongoDB later in a project so easy?',
        difficulty: 'Medium',
        answer: 'Because of Separation of Concerns! Since all data persistence logic is encapsulated strictly inside the Model layer (models/home.js), your Views (views/*.ejs), Routers (routes/*.js), and almost all Controller logic remain untouched when switching databases. You only rewrite the internal implementation of save(), fetchAll(), and findById() inside the Model.'
      },
      {
        id: 'node-lec-13-q5',
        title: 'Q5: What happens in a REST API (where React is the frontend) to the "V" (View) in MVC on the Express backend?',
        difficulty: 'Easy',
        answer: 'In a decoupled REST API architecture (like MERN), the View layer moves entirely to the client-side React application, while the Express backend follows an MC (Model-Controller / Route-Controller-Service-Model) pattern where Controllers return JSON responses (res.json()) instead of calling res.render().'
      },
      {
        id: 'node-lec-13-q6',
        title: 'Q6: Why should you never access req.body or call res.render() directly inside a Model file?',
        difficulty: 'Easy',
        answer: 'Coupling a Model to HTTP req and res objects violates Separation of Concerns and prevents the Model from being reused in non-HTTP contexts (such as background cron jobs, WebSockets, CLI scripts, or unit tests). Models should only accept plain data arguments and return data/Promises.'
      }
    ]
  },
  {
    topic_order: 14,
    slug: 'node-lecture-14-dynamic-paths-part-1-route-params-detail-pages-favourites',
    title: 'Lecture 14: Dynamic Paths (Part 1) — Route Parameters (:homeId, req.params), Detail Pages & Building the Favourite Model',
    duration_minutes: 66,
    video_url: 'http://www.youtube.com/watch?v=qbHmaHjOKPE',
    video_title: 'Lecture 14: Dynamic Path Part - 1 | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Express.js Official Docs — Route Parameters (req.params)',
        url: 'https://expressjs.com/en/guide/routing.html#route-parameters',
        link: 'https://expressjs.com/en/guide/routing.html#route-parameters'
      }
    ],
    short_description: 'Define dynamic route segments using Express colon syntax (:homeId), extract IDs via req.params, look up single entities with Home.findById(), and build a Favourite model.',
    summary_markdown: `### 📌 Topic Overview
In an e-commerce or property booking app like Airbnb, you cannot hardcode a separate static route for every single listing (\`/homes/1\`, \`/homes/2\`, ..., \`/homes/10000\`). **Dynamic Route Parameters** allow a single Express route pattern (\`/homes/:homeId\`) to capture variable segments from the URL and load the matching entity dynamically.

### 💡 Express Route Parameters (\`:paramName\` & \`req.params\`)
* **Defining a Dynamic Path Segment:** Prefix the variable segment with a colon (\`:\`) in your router:
  **\`storeRouter.get("/homes/:homeId", storeController.getHomeDetails);\`**
* **Extracting the Value (\`req.params\`):** When a user clicks \`<a href="/homes/<%= home.id %>">Details</a>\` (e.g., \`/homes/0.84921\`), Express populates **\`req.params\`** as \`{ homeId: "0.84921" }\`.
* **Implementing \`Home.findById(homeId, callback)\`:** Reads all homes via \`Home.fetchAll()\`, finds the matching object using \`homes.find(h => h.id === homeId)\`, and passes it to the callback. If \`home\` is \`undefined\` (invalid ID), redirect safely to \`"/homes"\`.

### 💡 Building the \`Favourite\` Model (\`models/favourite.js\`)
* Stores an array of favourited \`homeId\` strings inside \`data/favourite.json\` (normalizing data by storing only reference IDs rather than duplicating entire home objects!).
* **\`Favourite.addToFavourite(homeId, callback)\`:** Reads existing IDs, checks \`if (favourites.includes(homeId))\` to prevent duplicate entries, and writes the updated array back to \`favourite.json\`.
* **Joining Favourite IDs with Home Objects:** In \`getFavouriteList\`, call \`Favourite.getFavourites(favIds => { Home.fetchAll(homes => { const favHomes = homes.filter(h => favIds.includes(h.id)); ... }); })\`.

### 🛠️ Dynamic Route Parameter, \`findById()\` & \`Favourite\` Model
\`\`\`javascript
// 1. In routes/storeRouter.js: Dynamic path parameter ':homeId'
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);

// 2. In controllers/storeController.js: Extract req.params.homeId
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId, (home) => {
    if (!home) {
      console.log("Home not found for ID:", homeId);
      return res.redirect("/homes");
    }
    res.render("store/home-detail", {
      home: home,
      pageTitle: "Home Detail",
      currentPage: "Home"
    });
  });
};

// 3. In models/home.js: Static findById lookup
static findById(homeId, callback) {
  this.fetchAll((homes) => {
    const homeFound = homes.find((home) => home.id === homeId);
    callback(homeFound);
  });
}
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-14-q1',
        title: 'Q1: How do Route Parameters (:id) work in Express.js, and why does route declaration order matter when combining "/homes/favourites" and "/homes/:homeId"?',
        difficulty: 'Medium',
        answer: 'A route parameter (:homeId) acts as a wildcard placeholder for any non-empty URL segment at that position and stores the captured string in req.params.homeId. Because ":homeId" matches ANY string, if you register router.get("/homes/:homeId", ...) BEFORE static sub-routes like router.get("/homes/favourites", ...), a request to "/homes/favourites" will be intercepted by "/homes/:homeId" with req.params.homeId === "favourites"! Always register specific static routes above dynamic parameterized routes.'
      },
      {
        id: 'node-lec-14-q2',
        title: 'Q2: Why did our Favourite model store only an array of homeId strings in favourite.json instead of copying the entire Home object?',
        difficulty: 'Medium',
        answer: 'This follows the database principle of Normalization (Single Source of Truth). If you duplicated the entire Home object inside favourite.json and the host later updated the home\'s price or photo in homes.json, the copy inside favourite.json would become stale and out-of-sync! Storing only the homeId reference ensures that when we look up favourites against Home.fetchAll(), users always see the latest updated home details.'
      },
      {
        id: 'node-lec-14-q3',
        title: 'Q3: What is the data type of req.params.homeId when a user visits /homes/42, and what bug can happen if home.id is stored as a Number?',
        difficulty: 'Easy',
        answer: 'Every value inside req.params is ALWAYS a String (so req.params.homeId is "42"). If home.id was stored as a numeric 42, strict equality home.id === req.params.homeId (42 === "42") will evaluate to false! Always ensure consistent types (either store IDs as strings or convert via Number(req.params.homeId) / String(home.id)).'
      },
      {
        id: 'node-lec-14-q4',
        title: 'Q4: How do you pass a home.id from an EJS card button when submitting a POST "/favourites" request without putting the ID in the URL?',
        difficulty: 'Easy',
        answer: 'Place a hidden input field inside the <form action="/favourites" method="POST">: <input type="hidden" name="id" value="<%= home.id %>" />. When the user clicks the Submit button, the browser sends id in the POST request body (req.body.id) without displaying the input box on the UI.'
      },
      {
        id: 'node-lec-14-q5',
        title: 'Q5: What should a controller do if Home.findById(req.params.homeId) returns undefined (e.g., a user typed a non-existent or deleted ID in the URL)?',
        difficulty: 'Easy',
        answer: 'If you pass home: undefined directly into res.render("store/home-detail", { home }), the EJS template will crash with TypeError: Cannot read properties of undefined (reading \'houseName\'). Always guard with if (!home) return res.redirect("/homes") (or render a 404 page) before calling res.render().'
      },
      {
        id: 'node-lec-14-q6',
        title: 'Q6: Can a single Express route have multiple route parameters (e.g., /users/:userId/bookings/:bookingId)?',
        difficulty: 'Easy',
        answer: 'Yes! Express supports multiple route parameters in the same path pattern. A request to /users/101/bookings/555 will populate req.params with { userId: "101", bookingId: "555" }.'
      }
    ]
  },
  {
    topic_order: 15,
    slug: 'node-lecture-15-dynamic-paths-part-2-query-params-edit-delete-cascade',
    title: 'Lecture 15: Dynamic Paths (Part 2) — Query Parameters (req.query), Edit/Update Workflows & Cascading Delete Operations',
    duration_minutes: 53,
    video_url: 'http://www.youtube.com/watch?v=68UFRuVyim8',
    video_title: 'Lecture 14: Dynamic Path Part - 2 | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Express.js Official Docs — req.query & Request Object Reference',
        url: 'https://expressjs.com/en/5x/api.html#req.query',
        link: 'https://expressjs.com/en/5x/api.html#req.query'
      }
    ],
    short_description: 'Extract URL query parameters with req.query, reuse form templates for both Create and Edit workflows, update existing records in place, and implement cascading deletes across related models.',
    summary_markdown: `### 📌 Topic Overview
Completing full CRUD on the Airbnb Host dashboard requires **Editing existing homes** (pre-filling the form with current values and updating in place rather than creating a duplicate entry) and **Deleting homes** (including removing deleted home IDs from the \`Favourite\` list so no orphaned references remain).

### 💡 Path Parameters (\`req.params\`) vs. Query Parameters (\`req.query\`)
* **Path Parameters (\`/host/edit-home/:homeId\`):** Mandatory part of the route structure identifying a specific resource. Read via **\`req.params.homeId\`**.
* **Query Parameters (\`?editing=true&sort=price\`):** Optional key-value modifiers appended after \`?\` and separated by \`&\`. You do **not** declare query parameters in the router path string! Express parses them automatically into **\`req.query\`** (e.g., \`req.query.editing === "true"\`).
* **Important Quirk:** Just like \`req.params\`, all values in \`req.query\` are **Strings** (\`"true"\`, not boolean \`true\`), so convert via \`const editing = req.query.editing === "true";\`.

### 💡 Reusing \`edit-home.ejs\` for Both Add & Edit + Cascading Delete
1. **Unified Form Template (\`views/host/edit-home.ejs\`):**
   * Form \`action\` switches dynamically: \`action="/host/<%= editing ? 'edit-home' : 'add-home' %>"\`.
   * Inputs pre-fill existing values when \`editing\` is true: \`value="<%= editing ? home.houseName : '' %>"\`.
   * Includes \`<input type="hidden" name="id" value="<%= home.id %>" />\` when editing.
2. **Upsert Logic in \`home.save()\`:**
   * If \`this.id\` already exists, update the existing element inside \`registeredHomes\` using \`.map(h => h.id === this.id ? this : h)\`.
   * Otherwise, generate \`this.id = Math.random().toString()\` and \`.push(this)\`.
3. **Cascading Delete (\`Home.deleteById\` + \`Favourite.deleteById\`):**
   * When a Host deletes a property (\`POST /host/delete-home/:homeId\`), \`Home.deleteById(homeId)\` removes the home from \`homes.json\` **AND** invokes \`Favourite.deleteById(homeId)\` so the deleted home is also purged from \`favourite.json\`!

### 🛠️ Edit Controller (\`req.params\` + \`req.query\`) & Cascading \`deleteById\`
\`\`\`javascript
// 1. In controllers/hostController.js: Handle GET /host/edit-home/:homeId?editing=true
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true"; // Convert string "true" to boolean!

  Home.findById(homeId, (home) => {
    if (!home) return res.redirect("/host/host-home-list");
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing
    });
  });
};

// 2. In models/home.js: Delete Home AND cascade delete from Favourite model
static deleteById(homeId, callback) {
  this.fetchAll((homes) => {
    const updatedHomes = homes.filter((home) => home.id !== homeId);
    fs.writeFile(homeDataPath, JSON.stringify(updatedHomes), (err) => {
      if (!err) {
        Favourite.deleteById(homeId, callback);
      }
    });
  });
}
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-15-q1',
        title: 'Q1: Compare req.params, req.query, and req.body in Express.js. When should each be used?',
        difficulty: 'Easy',
        answer: '1) req.params (Route/Path Parameters, e.g., /homes/:homeId): Used to identify a specific mandatory resource in the URL hierarchy; defined in the route pattern with a colon (:). 2) req.query (Query String Parameters, e.g., ?editing=true&page=2): Used for optional flags, filtering, sorting, or pagination on GET requests; not declared in the route path string. 3) req.body (Request Payload): Used for sending larger or sensitive structured data in POST/PUT/PATCH requests (requires express.urlencoded() or express.json() middleware).'
      },
      {
        id: 'node-lec-15-q2',
        title: 'Q2: Why did we check req.query.editing === "true" instead of if (req.query.editing) when parsing the query parameter?',
        difficulty: 'Easy',
        answer: 'Because URL query values are always parsed as Strings! If someone passed ?editing=false in the URL, the non-empty string "false" is actually Truthy in JavaScript (so if ("false") would evaluate to true!). Explicitly comparing req.query.editing === "true" guarantees a proper boolean true/false result.'
      },
      {
        id: 'node-lec-15-q3',
        title: 'Q3: Why did we use a POST form (<form action="/host/delete-home/<%= home.id %>" method="POST">) for deleting a home instead of a simple <a href> GET link or DELETE method?',
        difficulty: 'Medium',
        answer: 'Two reasons: 1) Standard HTML <form> tags in browsers only support GET and POST methods natively (they do not support method="DELETE" without JavaScript fetch() or method-override middleware). 2) Destructive actions that mutate or delete server data must NEVER use GET links, because browser prefetchers, web crawlers, or accidental link shares would trigger GET URLs and wipe out database records!'
      },
      {
        id: 'node-lec-15-q4',
        title: 'Q4: What is a "Cascading Delete" (Referential Integrity), and why did Home.deleteById() also need to call Favourite.deleteById()?',
        difficulty: 'Medium',
        answer: 'When a parent entity (a Home) is deleted from homes.json, any foreign key references to that homeId still sitting inside favourite.json become "orphaned references." Without cascading the delete to Favourite.deleteById(homeId), the Favourites page would continue storing dead IDs (or crash when trying to render deleted homes).'
      },
      {
        id: 'node-lec-15-q5',
        title: 'Q5: In the Edit Home form, why did we need <input type="hidden" name="id" value="<%= home.id %>" /> when submitting POST /host/edit-home?',
        difficulty: 'Easy',
        answer: 'When the user submits the Edit Home form to POST /host/edit-home, the server needs to know WHICH existing home ID in homes.json should be overwritten with the updated form fields. Since the user shouldn\'t see or edit the internal ID string, passing it in a hidden input ensures req.body.id is sent along with the updated houseName, price, and location.'
      },
      {
        id: 'node-lec-15-q6',
        title: 'Q6: How does reusing a single edit-home.ejs template with an editing boolean flag compare to maintaining separate add-home.ejs and edit-home.ejs files?',
        difficulty: 'Easy',
        answer: 'Because Add Home and Edit Home share 95% identical form inputs and Tailwind styling, maintaining two separate files violates DRY (any new field added to Home would have to be manually updated in two places). Using a single template parameterized by editing (true vs. false) keeps the form UI consistent in one file.'
      }
    ]
  },
  {
    topic_order: 16,
    slug: 'node-lecture-16-sql-in-nodejs-mysql2-connection-pool-parameterized-queries',
    title: 'Lecture 16: Introduction to SQL in Node.js — Relational Databases, mysql2 Connection Pools & Parameterized Queries',
    duration_minutes: 86,
    video_url: 'http://www.youtube.com/watch?v=-6xGHdkwx_M',
    video_title: 'Lecture 15: Introduction to SQL | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'MySQL2 Official Docs — Using Promise Connection Pools in Node.js',
        url: 'https://sidorares.github.io/node-mysql2/docs',
        link: 'https://sidorares.github.io/node-mysql2/docs'
      }
    ],
    short_description: 'Replace flat JSON files with a relational SQL database in Node.js using mysql2, manage concurrent queries with Connection Pools (createPool().promise()), and prevent SQL Injection using ? parameterized placeholders.',
    summary_markdown: `### 📌 Topic Overview
Storing application data in flat JSON files (\`homes.json\`) fails in production because every read/write loads and rewrites the entire file in memory, lacks concurrent locking for thousands of users, and cannot index or join large datasets efficiently. This lecture migrates our Node.js backend to a **Relational Database (SQL)** using **\`mysql2\`**.

### 💡 Relational (SQL) vs. Non-Relational (NoSQL) Databases
* **SQL (RDBMS — MySQL, PostgreSQL, Oracle):** Stores data in structured **Tables** with strict **Columns (Schema)** and **Rows (Records/Tuples)**. Enforces strict data types (\`INT\`, \`VARCHAR\`, \`DECIMAL(10,2)\`, \`DOUBLE\`) and relational integrity across normalized tables.
* **NoSQL (MongoDB, DynamoDB):** Stores flexible schema-less documents/collections optimized for horizontal scaling and rapid iteration.

### 💡 Connecting Node.js to SQL: Why Connection Pools (\`mysql.createPool\`):
* **Single Connection Problem (\`createConnection\`):** If you open only 1 database connection, simultaneous requests from 500 users must wait in a single-file line for each query to finish, and if the connection drops, the app fails.
* **Connection Pool (\`mysql.createPool({...}).promise()\`):** Maintains a pool of reusable, open database connections. Concurrent requests borrow an available connection from the pool, execute their query via Promises, and automatically release the connection back to the pool!

### 💡 Preventing SQL Injection with Parameterized Queries (\`?\`)
* **Never concatenate user input into SQL strings!** Instead, pass \`?\` placeholders into **\`db.execute("INSERT INTO homes (...) VALUES (?, ?, ?, ?, ?)", [val1, val2, ...])\`**.
* **\`db.execute()\` Return Structure:** Returns a Promise resolving to a 2-element array **\`[rows, fields]\`** (use array destructuring \`const [homes] = await db.execute(...)\`).

### 🛠️ Configuring \`mysql2\` Promise Pool & SQL Model Methods
\`\`\`javascript
// File: utils/databaseUtil.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "airbnb"
});

module.exports = pool.promise();

// File: models/home.js (SQL Implementation)
const db = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl, description, id) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description = description;
    this.id = id;
  }

  save() {
    if (this.id) {
      // Update existing record safely using ? placeholders
      return db.execute(
        "UPDATE homes SET houseName=?, price=?, location=?, rating=?, photoUrl=?, description=? WHERE id=?",
        [this.houseName, this.price, this.location, this.rating, this.photoUrl, this.description, this.id]
      );
    } else {
      // Insert new record safely
      return db.execute(
        "INSERT INTO homes (houseName, price, location, rating, photoUrl, description) VALUES (?, ?, ?, ?, ?, ?)",
        [this.houseName, this.price, this.location, this.rating, this.photoUrl, this.description]
      );
    }
  }

  static fetchAll() {
    return db.execute("SELECT * FROM homes");
  }

  static findById(homeId) {
    return db.execute("SELECT * FROM homes WHERE id=?", [homeId]);
  }

  static deleteById(homeId) {
    return db.execute("DELETE FROM homes WHERE id=?", [homeId]);
  }
};
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-16-q1',
        title: 'Q1: Why do we use a Connection Pool (mysql.createPool) instead of a single Connection (mysql.createConnection) in a Node.js backend?',
        difficulty: 'Medium',
        answer: '1) Concurrency: A single connection can only execute one query at a time—if 100 users hit your API simultaneously, 99 users are blocked waiting in line. A Connection Pool maintains multiple open connections in parallel so concurrent requests run simultaneously. 2) Latency & Resilience: Establishing a new TCP + authentication handshake with a database on every HTTP request is slow; a pool keeps warm connections ready for reuse and automatically replaces dropped connections.'
      },
      {
        id: 'node-lec-16-q2',
        title: 'Q2: What is SQL Injection, and how does db.execute("SELECT * FROM homes WHERE id = ?", [homeId]) prevent it?',
        difficulty: 'Medium',
        answer: 'SQL Injection occurs when untrusted user input is concatenated directly into a SQL string (e.g., SELECT * FROM homes WHERE id = ${homeId}). An attacker can pass "1 OR 1=1; DROP TABLE homes;--" to bypass filters or destroy data. Using parameterized queries (? placeholders with db.execute(sql, values)) sends the SQL command structure and the user data parameters separately via a prepared statement protocol—so the database treats the input strictly as literal data, never as executable SQL commands.'
      },
      {
        id: 'node-lec-16-q3',
        title: 'Q3: When calling db.execute("SELECT * FROM homes").then(([homes, fields]) => ...), why do we destructure [homes, fields] as an array?',
        difficulty: 'Easy',
        answer: 'The mysql2 promise wrapper resolves db.execute() and db.query() with a 2-element tuple array: index 0 (homes) contains the actual array of matching database row objects (or ResultSetHeader for INSERT/UPDATE/DELETE), and index 1 (fields) contains column metadata definitions.'
      },
      {
        id: 'node-lec-16-q4',
        title: 'Q4: Why did flat JSON file storage (homes.json) fail to scale compared to a DBMS?',
        difficulty: 'Easy',
        answer: '1) Memory & I/O Overhead: Modifying a single field in a 500 MB JSON file requires reading the entire 500 MB file into RAM, parsing it, and rewriting the entire 500 MB file back to disk. 2) Race Conditions: If two concurrent requests write to homes.json at the same millisecond, one overwrites the other\'s changes. 3) No Indexing: Finding a record by ID requires an O(N) linear scan, whereas a DBMS uses B-Tree indexes for O(log N) lookups.'
      },
      {
        id: 'node-lec-16-q5',
        title: 'Q5: What is the difference between db.query() and db.execute() in mysql2?',
        difficulty: 'Medium',
        answer: 'db.query() interpolates placeholders on the client side before sending a plain text SQL query to the MySQL server. db.execute() uses MySQL\'s binary Prepared Statement protocol: the server compiles the SQL statement once and executes it with binary parameters, offering stronger SQL injection protection and faster repeated execution.'
      },
      {
        id: 'node-lec-16-q6',
        title: 'Q6: Why do we configure the id column in our SQL homes table with PRIMARY KEY and AUTO_INCREMENT?',
        difficulty: 'Easy',
        answer: 'PRIMARY KEY enforces that every row has a unique, non-null identifier and automatically builds a clustered B-Tree index on id for instant lookups. AUTO_INCREMENT delegates unique sequential ID generation to the database engine itself, eliminating any risk of duplicate IDs across concurrent inserts.'
      }
    ]
  },
  {
    topic_order: 17,
    slug: 'node-lecture-17-mongodb-integration-atlas-native-driver-objectid-crud',
    title: 'Lecture 17: MongoDB Integration in Node.js — MongoDB Atlas Cloud, Official mongodb Driver, ObjectId & Document CRUD',
    duration_minutes: 90,
    video_url: 'http://www.youtube.com/watch?v=dfgnVPB4muo',
    video_title: 'Lecture 16: Introduction to MongoDB | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'MongoDB Official Docs — Node.js Driver Quick Start & CRUD Operations',
        url: 'https://www.mongodb.com/docs/drivers/node/current/',
        link: 'https://www.mongodb.com/docs/drivers/node/current/'
      }
    ],
    short_description: 'Provision a cloud database cluster on MongoDB Atlas, connect your Express server using a singleton getDB() utility, and execute native CRUD operations with ObjectId, insertOne, find, updateOne, and deleteOne.',
    summary_markdown: `### 📌 Topic Overview
In the **MERN Stack**, **MongoDB** is the primary database because it stores data as BSON (Binary JSON) documents that map 1-to-1 to JavaScript objects without requiring rigid relational table migrations or expensive multi-table joins at massive scale.

### 💡 Singleton Database Connection Pattern (\`mongoConnect\` & \`getDB\`)
* **Bad Practice:** Calling \`MongoClient.connect()\` inside every single model method opens a brand-new TCP/TLS connection to MongoDB Atlas on every request, adding huge latency and exhausting connection limits!
* **Best Practice (\`utils/databaseUtil.js\`):**
  1. Connect to MongoDB Atlas **once** when the Express server boots (\`mongoConnect(callback)\` inside \`app.js\` before \`app.listen()\`).
  2. Cache the connected database instance in a private module variable \`let _db;\`.
  3. Export a synchronous getter **\`getDB()\`** that returns \`_db\` (or throws an error if \`_db\` is not initialized) so any model can immediately run \`getDB().collection("homes")\`.

### 💡 Native MongoDB Driver CRUD & The \`ObjectId\` Trap
* **Create (\`insertOne\`):** \`db.collection("homes").insertOne(this)\` — automatically generates a unique \`_id: new ObjectId("...")\` on the document.
* **Read All (\`find().toArray()\`):** \`db.collection("homes").find()\` returns a **Cursor** (stream pointer), NOT an array! Chain **\`.toArray()\`** to get the Promise of all documents.
* **Read Single by \`_id\` (\`new ObjectId(String(homeId))\`):**
  * **Crucial Trap:** In MongoDB, \`_id\` is stored as a special **\`ObjectId\`** object, NOT a plain string! Querying \`{ _id: homeId }\` with a string returns \`null\`.
  * **Fix:** Import \`{ ObjectId } = require("mongodb")\` and query **\`{ _id: new ObjectId(String(homeId)) }\`** followed by **\`.next()\`** (or use \`findOne()\`).
* **Update (\`updateOne\` with \`$set\`):** \`db.collection("homes").updateOne({ _id: new ObjectId(String(this._id)) }, { $set: updateFields })\`.
* **Delete (\`deleteOne\`):** \`db.collection("homes").deleteOne({ _id: new ObjectId(String(homeId)) })\`.

### 🛠️ Singleton \`databaseUtil.js\` & Native MongoDB Model CRUD
\`\`\`javascript
// File: utils/databaseUtil.js
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const MONGO_URL = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority";
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
    .then((client) => {
      console.log("Connected to MongoDB Atlas!");
      _db = client.db("airbnb");
      callback();
    })
    .catch((err) => {
      console.log("Error while connecting to Mongo:", err);
    });
};

const getDB = () => {
  if (!_db) {
    throw new Error("Mongo not connected!");
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;

// File: models/home.js (Native MongoDB Driver)
const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/databaseUtil");

module.exports = class Home {
  static findById(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .find({ _id: new ObjectId(String(homeId)) })
      .next();
  }
};
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-17-q1',
        title: 'Q1: Why do we initialize MongoClient.connect() once in app.js and cache _db via getDB() instead of connecting inside every model query?',
        difficulty: 'Medium',
        answer: 'Connecting to a cloud database like MongoDB Atlas involves DNS resolution, TCP handshake, TLS encryption negotiation, and SCRAM authentication—which can take 200–500ms! If you called MongoClient.connect() on every HTTP request, every API call would suffer huge latency and you would quickly hit Atlas\'s maximum concurrent connection limit. Connecting once at server startup and sharing the pooled _db reference via getDB() allows queries to execute in a few milliseconds.'
      },
      {
        id: 'node-lec-17-q2',
        title: 'Q2: Why does db.collection("homes").find({ _id: req.params.homeId }) return null even when a document with that ID exists in MongoDB?',
        difficulty: 'Medium',
        answer: 'Because req.params.homeId is a plain String (e.g., "6738a..."), whereas MongoDB stores document primary keys (_id) as a 12-byte binary BSON ObjectId type! In MongoDB, a String never equals an ObjectId. You must wrap the string using new ObjectId(String(homeId)) from the mongodb package when querying, updating, or deleting by _id.'
      },
      {
        id: 'node-lec-17-q3',
        title: 'Q3: What does db.collection("homes").find() return in the native MongoDB driver, and why do we call .toArray() or .next() on it?',
        difficulty: 'Medium',
        answer: 'collection.find() does NOT immediately return an array of documents—it returns a MongoDB Cursor object (a pointer to the result set on the server). If a collection has 1 million documents, returning a Cursor allows you to iterate or batch-stream results without crashing Node\'s RAM. Calling .toArray() instructs the cursor to fetch all matching documents into a JS array Promise, while .next() fetches only the first matching document from the cursor.'
      },
      {
        id: 'node-lec-17-q4',
        title: 'Q4: Why do we only start app.listen(PORT) inside the callback of mongoConnect(() => { app.listen(PORT); })?',
        difficulty: 'Easy',
        answer: 'If app.listen(PORT) started before MongoClient.connect() finished establishing the database connection, early incoming user requests would call getDB() while _db is still undefined and crash with "Error: Mongo not connected!". Starting the HTTP server inside the mongoConnect callback guarantees the database is ready before accepting traffic.'
      },
      {
        id: 'node-lec-17-q5',
        title: 'Q5: When updating a document with updateOne({ _id: new ObjectId(String(this._id)) }, { $set: updateFields }), why shouldn\'t _id be included inside the $set object?',
        difficulty: 'Easy',
        answer: 'In MongoDB, the primary key _id of an existing document is strictly immutable. Attempting to overwrite or modify _id inside a $set update operation (especially if this._id is a string while the stored _id is an ObjectId) throws an immutable field error.'
      },
      {
        id: 'node-lec-17-q6',
        title: 'Q6: Why do NoSQL document databases like MongoDB scale horizontally (Sharding) more easily than traditional normalized SQL databases?',
        difficulty: 'Medium',
        answer: 'In a normalized SQL database, a single entity\'s data is split across 5–10 related tables, requiring cross-table JOINs. If those tables are split across different physical servers (shards), cross-network joins become slow and complex. MongoDB co-locates related data inside self-contained BSON documents, allowing collections to be partitioned (sharded) across many servers with fast single-document reads.'
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

async function seedDevelopmentBatch2() {
  const client = await pool.connect();
  try {
    console.log('=== SEEDING DEVELOPMENT TRACK BATCH 2 (Lectures 13 to 17) ===');
    await client.query('BEGIN');

    // 1. Locate the exact Development track seeded in Batch 1
    const devTrackLookup = await client.query(`
      SELECT track_id FROM topics WHERE slug = 'node-lecture-1-introduction-to-nodejs-architecture-v8-libuv' LIMIT 1;
    `);

    if (devTrackLookup.rows.length === 0) {
      throw new Error("Batch 1 lecture 1 not found! Please run Batch 1 first.");
    }

    const devTrackId = devTrackLookup.rows[0].track_id;
    console.log(`Found Development Track: [ID:${devTrackId}]`);

    const creatorName = 'Complete Coding by Prashant Sir';
    const creatorChannelUrl = 'https://www.youtube.com/@CompleteCodingByPrashantSir';

    // 2. Upsert Lectures 13 to 17
    for (const lec of batch2Lectures) {
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

    // 3. Update track metadata (total_topics = 17 and estimated_hours) if columns exist
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tracks' AND column_name IN ('total_topics', 'estimated_hours');
    `);
    const availableCols = colCheck.rows.map(r => r.column_name);

    if (availableCols.includes('total_topics') && availableCols.includes('estimated_hours')) {
      await client.query(`
        UPDATE tracks SET total_topics = 17, estimated_hours = 25 WHERE id = $1;
      `, [devTrackId]);
    } else if (availableCols.includes('total_topics')) {
      await client.query(`
        UPDATE tracks SET total_topics = 17 WHERE id = $1;
      `, [devTrackId]);
    }

    await client.query('COMMIT');
    console.log('--- Development Track Batch 2 (Lectures 13 to 17) Seeded Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Development Batch 2 seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedDevelopmentBatch2();
