const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const CATALOG_PATH = path.resolve(__dirname, 'mongopractice_catalog.json');

const batch1Lectures = [
  {
    topic_order: 1,
    slug: 'mongo-lecture-1-nosql-foundations-bson-vs-json',
    title: 'Lecture 1: MongoDB & NoSQL Foundations — Collections, Documents & BSON vs. JSON',
    duration_minutes: 16,
    video_url: 'http://www.youtube.com/watch?v=q1V1A9ZcpKo',
    video_title: 'MongoDB Introduction Tutorial in Hindi/Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/introduction/',
    short_description: 'Understand how NoSQL document databases differ from relational SQL tables, how BSON extends JSON with binary types, and why MongoDB excels at horizontal scaling (Sharding) and high-availability Replication.',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
MongoDB is a leading open-source **NoSQL (Non-Relational) Document Database** that stores data as flexible, JSON-like documents encoded in **BSON (Binary JSON)** rather than rigid rows and columns.

### 💡 SQL (RDBMS) vs. NoSQL (MongoDB) Architecture
* **Storage Terminology:** Relational databases store data in **Tables** made of **Rows** (records) and **Columns** (fields). MongoDB stores data inside **Collections** made of individual **Documents** containing **Key-Value Fields**.
* **Schema Flexibility:** SQL databases enforce a **fixed schema**—adding a new attribute (such as \`married: true\`) for a single user requires altering the entire table. MongoDB provides a **flexible schema** where each document in a collection can hold different fields or nested structures dynamically.
* **Relationships vs. Document Locality:** RDBMS platforms (PostgreSQL, MySQL, Oracle) split entities across normalized tables and require multi-table \`JOIN\` queries. MongoDB co-locates related data inside rich nested documents and arrays for high-speed single-query reads.

### 🔍 JSON vs. BSON (Binary JSON)
While developers write queries and documents in standard human-readable **JSON**, MongoDB's storage engine persists data on disk in **BSON (Binary JSON)**:
* **Encoding Format:** JSON is plain text (UTF-8 strings), whereas BSON is machine-optimized **binary encoding**.
* **Storage Size & Speed:** Text-based JSON has parsing overhead; BSON is lightweight, compact, and significantly faster for the database engine to traverse and index.
* **Extended Data Types:** Standard JSON only supports \`String\`, \`Number\`, \`Boolean\`, \`Array\`, \`Object\`, and \`null\`. BSON replaces generic numbers with explicit **32-bit Integer (\`int\`)**, **64-bit Integer (\`long\`)**, and **64-bit Floating Point (\`double\`)**, and adds native **\`ObjectId\`**, **\`Date\` (\`ISODate\`)**, **\`Timestamp\`**, and **\`Regular Expression\`** types.

### 🛠️ Relational Row vs. MongoDB BSON Document
\`\`\`javascript
// Equivalent MongoDB Document inside the "users" Collection
{
  "_id": ObjectId("6712a8f9c0ffee1234567890"),
  "name": "Salman Khan",
  "age": 25,
  "gender": "Male",
  "married": false,
  "skills": ["Node.js", "MongoDB", "React"]
}
\`\`\`

### ⚠️ Key Architectural Benefits of MongoDB
* **Horizontal Scaling via Sharding:** When a single database server reaches capacity, MongoDB automatically partitions data across multiple parallel servers (**Shards**) to handle massive write/read throughput.
* **High Availability via Replication:** MongoDB maintains synchronized **Replica Sets** (cloned nodes across servers or regions) so that if a primary node fails, a secondary node automatically takes over with zero data loss.
* **Built-In Geospatial & Real-Time Analytics:** Native support for location coordinates (e.g., mapping apps) and high-frequency binary writes (e.g., stock market tick streams).`
  },
  {
    topic_order: 2,
    slug: 'mongo-lecture-2-windows-installation-compass-mongosh',
    title: 'Lecture 2: MongoDB Environment Setup on Windows — Community Server 8.0, Compass GUI & mongosh',
    duration_minutes: 14,
    video_url: 'http://www.youtube.com/watch?v=skBh4ft-IjI',
    video_title: 'MongoDB Installation on Windows Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/',
    short_description: 'Install MongoDB Community Server 8.0 (MSI), MongoDB Compass GUI, and MongoDB Shell (mongosh) on 64-bit Windows, configure System and User PATH variables, and verify local connections on port 27017.',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
Running MongoDB locally on a 64-bit Windows 10/11 machine requires three core components: **MongoDB Community Server** (the background database engine), **MongoDB Compass** (the official visual GUI), and **MongoDB Shell (\`mongosh\`)** (the interactive command-line interface).

### 💡 Core Components & Installation Workflow
* **64-Bit OS Requirement:** MongoDB 8.0+ strictly requires a 64-bit Windows operating system. Always select the **\`.msi\` installer package** (rather than \`.zip\`) for automated service registration.
* **Run MongoDB as a Windows Service:** During the "Complete" installation wizard, keep **"Install MongoDB as a Service"** checked so the \`mongod\` server starts automatically on system boot.
* **MongoDB Compass GUI:** Installed alongside the server; connects by default to \`mongodb://localhost:27017\` and displays the three built-in system databases (\`admin\`, \`config\`, and \`local\`).
* **MongoDB Shell (\`mongosh\`):** Downloaded separately from the MongoDB Tools page and installed into a clean directory such as \`C:\\mongosh\\\`.

### 🛠️ Configuring Windows Environment Variables (\`PATH\`)
To run \`mongod\` and \`mongosh\` from any Command Prompt window without typing full file paths:
* **System Variables \`Path\`:** Add the MongoDB Server binary folder:
  \`C:\\Program Files\\MongoDB\\Server\\8.0\\bin\`
* **User Variables \`Path\`:** Add the MongoDB Shell directory:
  \`C:\\mongosh\`

### 🛠️ Verifying the Installation in Command Prompt
\`\`\`bash
# 1. Start the interactive MongoDB Shell (connects to mongodb://127.0.0.1:27017)
mongosh

# 2. List all default system databases (admin, config, local)
show dbs
\`\`\`

### ⚠️ Common Setup Pitfalls
* **Command Not Recognized:** If \`mongosh\` throws *"is not recognized as an internal or external command"*, restart your Command Prompt after saving the Environment Variables so Windows reloads the updated \`PATH\`.`
  },
  {
    topic_order: 3,
    slug: 'mongo-lecture-3-macos-installation-homebrew-mongod',
    title: 'Lecture 3: MongoDB Installation on macOS — Homebrew, mongod Data Directories & Service Management',
    duration_minutes: 9,
    video_url: 'http://www.youtube.com/watch?v=iEb-ap9TOO0',
    video_title: 'MongoDB Installation on MacOS Tutorial in Hindi/Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/',
    short_description: 'Set up MongoDB Community Edition on macOS using Xcode Command Line Tools and Homebrew, configure the /data/db storage path with mongod --dbpath, and manage background services.',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
On macOS, MongoDB Community Edition is officially distributed and managed through the **Homebrew** package manager, alongside Xcode Command Line Tools and \`brew services\`.

### 💡 Step-by-Step macOS Setup
* **Xcode Command Line Tools:** Required by Homebrew to compile native dependencies on macOS.
* **Official MongoDB Homebrew Tap:** Registers MongoDB's official formula repository before installing \`mongodb-community\`.
* **Data Directory Binding (\`--dbpath\`):** If \`mongod\` is invoked directly without a configured storage directory, it exits with a \`NonExistentPath\` error unless you create and bind a \`data/db\` folder in your home directory.

### 🛠️ Terminal Commands for macOS Installation & Startup
\`\`\`bash
# 1. Install Xcode Command Line Tools
xcode-select --install

# 2. Tap the official MongoDB Homebrew repository & update brew
brew tap mongodb/brew
brew update

# 3. Install MongoDB Community Server 8.0
brew install mongodb-community@8.0

# 4. Verify installed version
mongod --version

# 5. Start (or stop) MongoDB as a background macOS service
brew services start mongodb-community@8.0
# To stop later: brew services stop mongodb-community@8.0

# 6. Create a custom data directory in your home folder & attach dbpath
mkdir -p ~/data/db
sudo mongod --dbpath /Users/<your-username>/data/db

# 7. Launch MongoDB Shell and inspect databases
mongosh
show dbs
\`\`\`

### ⚠️ Best Practices on macOS
* **Prefer \`brew services start\`:** Using \`brew services start mongodb-community\` automatically uses Homebrew's preconfigured config file and data path so you don't need to manually pass \`--dbpath\` on every reboot.`
  },
  {
    topic_order: 4,
    slug: 'mongo-lecture-4-create-drop-databases-and-collections',
    title: 'Lecture 4: Database & Collection Lifecycle — use, createCollection, renameCollection & drop',
    duration_minutes: 16,
    video_url: 'http://www.youtube.com/watch?v=P3ePCC1K40Q',
    video_title: 'MongoDB Create Database & Collections Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/method/db.createCollection/',
    short_description: 'Master mongosh administrative commands to create, switch, inspect, rename, and drop databases and collections using use, db.createCollection(), renameCollection(), drop(), and dropDatabase().',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
In MongoDB, data is organized hierarchically: a **Server** hosts multiple **Databases** (e.g., \`school\`), each Database contains multiple **Collections** (e.g., \`students\`, \`library\`), and each Collection stores **Documents**.

### 💡 Core Database & Collection Commands
* **\`show dbs\`:** Lists all databases that physically exist on disk. Note that a newly switched database (via \`use school\`) will **not** appear in \`show dbs\` until at least one collection is created inside it.
* **\`use <db_name>\`:** Dual-purpose command—switches to an existing database if it exists, or initializes a new database context in memory if it does not.
* **\`db\`:** Prints the name of the currently active database context.
* **\`db.createCollection("<name>")\`:** Explicitly creates a new collection inside the active database and returns \`{ ok: 1 }\`.
* **\`show collections\`:** Lists all collections inside the current database.
* **\`db.<collection>.renameCollection("<new_name>")\`:** Renames an existing collection in place.
* **\`db.<collection>.drop()\`:** Permanently removes a specific collection and returns \`true\`.
* **\`db.dropDatabase()\`:** Permanently deletes the currently active database and all collections inside it.
* **\`db.help()\` & \`db.<collection>.help()\`:** Built-in interactive manual listing all available database-level and collection-level methods.

### 🛠️ Practical mongosh Lifecycle Session
\`\`\`javascript
// 1. Inspect existing databases and create/switch to "school"
show dbs
use school
db // Outputs: school

// 2. Create collections inside "school"
db.createCollection("students")
db.createCollection("library")
show collections

// 3. Rename "students" collection to "student"
db.students.renameCollection("student")
show collections

// 4. Built-in help methods
db.help()
db.student.help()

// 5. Drop a single collection vs. dropping the entire database
db.library.drop()       // Returns: true
db.dropDatabase()       // Returns: { ok: 1, dropped: 'school' }
\`\`\`

### ⚠️ Naming Rules & Best Practices
* **Collection Naming:** Avoid spaces in collection names; use lowercase snake_case (\`student_records\`) or camelCase (\`studentRecords\`).
* **Case Sensitivity:** \`createCollection\` and \`renameCollection\` are strict JavaScript methods and must be written in exact **camelCase**.`
  },
  {
    topic_order: 5,
    slug: 'mongo-lecture-5-insert-documents-insertone-insertmany',
    title: 'Lecture 5: Inserting Documents — insertOne(), insertMany() & ObjectId Generation',
    duration_minutes: 13,
    video_url: 'http://www.youtube.com/watch?v=SaPPUV6tVRM',
    video_title: 'MongoDB Insert Document in Collection Tutorial in Hindi Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/tutorial/insert-documents/',
    short_description: 'Insert single and bulk BSON documents into MongoDB collections using db.collection.insertOne() and db.collection.insertMany(), and inspect automatic _id ObjectId keys.',
    problemSelector: { topic: 'find', count: 6, difficulty: 'Easy' },
    summary_markdown: `### 📌 Topic Overview
MongoDB provides two primary write methods to add new documents into a collection: **\`insertOne()\`** for a single document object and **\`insertMany()\`** for an array of multiple document objects.

### 💡 Single vs. Bulk Document Insertion
* **\`db.<collection>.insertOne({ ... })\`:** Accepts a single JSON object enclosed in curly braces \`{}\`. Returns \`{ acknowledged: true, insertedId: ObjectId("...") }\`.
* **\`db.<collection>.insertMany([ { ... }, { ... } ])\`:** Accepts an **array of objects** enclosed in square brackets \`[]\`. Returns \`{ acknowledged: true, insertedIds: { '0': ObjectId("..."), '1': ObjectId("...") } }\`.
* **Automatic \`_id\` (\`ObjectId\`) Generation:** Every document in MongoDB requires a unique primary key named \`_id\`. If you omit \`_id\` during insertion, MongoDB automatically generates a globally unique 12-byte \`ObjectId\` for that document.
* **Implicit Collection Creation:** Calling \`insertOne()\` or \`insertMany()\` on a collection that does not yet exist will automatically create the collection on the fly.

### 🛠️ Practical Insertion Examples
\`\`\`javascript
// 1. Insert a single student document using insertOne()
db.students.insertOne({
  name: "Akshay Kumar",
  age: 25,
  class: "BCA"
})
// Response: { acknowledged: true, insertedId: ObjectId('...') }

// 2. Insert multiple student documents at once using insertMany()
db.students.insertMany([
  {
    name: "Salman Khan",
    age: 24,
    class: "BCA"
  },
  {
    name: "John Abraham",
    age: 21,
    class: "BCom"
  }
])

// 3. Verify inserted documents
db.students.find()
\`\`\`

### ⚠️ Common Mistakes & Why Schema Validation Matters
* **Forgetting Square Brackets in \`insertMany()\`:** Passing comma-separated objects \`insertMany({a:1}, {b:2})\` without outer square brackets \`[ ... ]\` throws a syntax error because the second argument is reserved for write options.
* **Unvalidated Types:** By default, MongoDB's flexible schema allows inserting \`class: 200\` (a number) even when other documents store \`class: "BCA"\` (a string). Use **JSON Schema Validation** (covered in Lecture 7) to prevent invalid types in production.`
  },
  {
    topic_order: 6,
    slug: 'mongo-lecture-6-bson-data-types-isodate-arrays-objects',
    title: 'Lecture 6: MongoDB BSON Data Types — Int32/Int64, Double, ISODate, Arrays, Objects & ObjectId',
    duration_minutes: 22,
    video_url: 'http://www.youtube.com/watch?v=Z3pnpP90K7c',
    video_title: 'MongoDB Data Types Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/bson-types/',
    short_description: 'Explore BSON data types in depth including 32-bit vs. 64-bit Integers, Doubles, Booleans, ISODate() & new Date() with UTC/timezone offsets, Null, Arrays, and nested Objects.',
    problemSelector: { topic: 'find', count: 8 },
    summary_markdown: `### 📌 Topic Overview
MongoDB supports rich **BSON data types** that let you store numbers with exact bit precision, timezone-aware dates, lists, and deeply nested sub-documents inside a single record.

### 💡 Complete BSON Data Types Breakdown
* **\`ObjectId\`:** 12-byte unique identifier automatically assigned to \`_id\`.
* **\`String\`:** UTF-8 text enclosed in single or double quotes (e.g., \`"Yahoo Baba"\`). Warning: quoting a number like \`"25"\` stores it as a String and prevents mathematical operations.
* **\`32-bit Integer (int)\`:** Whole numbers between \`-2,147,483,648\` and \`+2,147,483,647\` (~214 Crore). Consumes **4 bytes** of storage.
* **\`64-bit Integer (long)\`:** Whole numbers exceeding the 32-bit range (up to \`±9.22 × 10^18\`). Consumes **8 bytes** of storage. MongoDB automatically promotes integers exceeding the 32-bit limit to 64-bit.
* **\`Double\`:** Floating-point decimal values (e.g., \`weight: 68.55\`).
* **\`Boolean (bool)\`:** Unquoted \`true\` or \`false\`.
* **\`Null\`:** Unquoted \`null\` representing an absent or empty value (e.g., \`kids: null\`).
* **\`Array\`:** Ordered list of values enclosed in \`[ ... ]\` (e.g., \`hobbies: ["Music", "Sports"]\`).
* **\`Object (Embedded Document)\`:** Nested key-value document enclosed in \`{ ... }\` (e.g., \`address: { street: "MG Road", city: "Delhi", zip: 110001 }\`).
* **\`Date\` (\`ISODate\` / \`new Date\`):** Stores date and time as a 64-bit integer representing milliseconds since the Unix epoch, enabling date range queries and date extraction functions.

### 🛠️ Date & Time Formats in MongoDB (\`ISODate\` & \`new Date\`)
Never store dates as plain strings (\`"20-10-2024"\`), or you will lose MongoDB's native date comparison and extraction methods.
* **UTC Time (\`Z\`):** \`ISODate("2024-10-18T18:30:00Z")\` — Coordinated Universal Time.
* **Positive Offset (e.g., CET):** \`ISODate("2024-10-18T18:30:00+02:00")\` — 2 hours ahead of UTC.
* **Negative Offset (e.g., EST):** \`ISODate("2024-10-18T18:30:00-05:00")\` — 5 hours behind UTC.
* **Current Server Timestamp:** \`new Date()\` (with empty parentheses) automatically captures the exact current date and time at insertion.

### 🛠️ Inserting a Document Using All Core BSON Types
\`\`\`javascript
db.personal.insertOne({
  name: "Mohan Kumar",
  age: 28,                                  // 32-bit Integer (4 bytes)
  married: true,                            // Boolean
  dob: ISODate("2000-10-25T08:00:00Z"),     // UTC Date
  createdAt: new Date(),                    // Current Timestamp
  weight: 72.5,                             // Double
  kids: null,                               // Null
  hobbies: ["Travel", "Books", "Music"],    // Array of Strings
  address: {                                // Embedded Object
    street: "75 Park Avenue",
    city: "Mumbai",
    zip: 400001
  }
})
\`\`\``
  },
  {
    topic_order: 7,
    slug: 'mongo-lecture-7-json-schema-validation-collmod',
    title: 'Lecture 7: JSON Schema Validation — $jsonSchema, bsonType, enum, Nested Rules & collMod',
    duration_minutes: 31,
    video_url: 'http://www.youtube.com/watch?v=mO81XZAmFr8',
    video_title: 'MongoDB JSON Schema Validation Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/',
    short_description: 'Enforce strict document structure and data integrity in MongoDB using validator and $jsonSchema during createCollection() or on existing collections via db.runCommand({ collMod }).',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
While MongoDB is schema-flexible by default, production applications require **JSON Schema Validation** (\`$jsonSchema\`) so users cannot accidentally insert strings into numeric fields (like \`age: "hello"\`) or omit mandatory fields.

### 💡 Core \`$jsonSchema\` Properties & Constraints
* **\`validator: { $jsonSchema: { ... } }\`:** Passed as the second argument to \`db.createCollection()\` or applied to an existing collection via \`db.runCommand({ collMod: "<collection>", validator: ... })\`.
* **\`required: ["field1", "field2"]\`:** Array specifying which fields must be present in every document. Fields omitted from \`required\` remain optional.
* **\`bsonType\`:** Enforces the exact data type for a property:
  * \`"string"\`, \`"int"\` (for Integer), \`"double"\`, \`"bool"\` (for Boolean), \`"date"\`, \`"array"\`, \`"object"\`.
* **\`minimum\` & \`maximum\`:** Numeric range bounds for \`"int"\` and \`"double"\` fields (e.g., \`minimum: 5, maximum: 20\`).
* **\`enum\`:** Restricts a field to a predefined whitelist of values (e.g., \`enum: ["BCA", "BTech", "BSc"]\`).
* **\`items\` (Array Validation):** Validates the data type of elements inside an \`"array"\` (e.g., \`items: { bsonType: "string" }\`).
* **Nested \`properties\` (Object Validation):** Validates required fields and \`bsonType\` rules inside nested embedded objects (such as \`address.street\`, \`address.city\`, \`address.zip\`).

### 🛠️ 1. Creating a New Collection with JSON Schema Validation
\`\`\`javascript
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      title: "Student Object Validation",
      required: ["name", "age", "course"],
      properties: {
        name: {
          bsonType: "string",
          description: "Name must be a string and is required"
        },
        age: {
          bsonType: "int",
          minimum: 5,
          maximum: 20,
          description: "Age must be an integer between 5 and 20"
        },
        course: {
          bsonType: "string",
          enum: ["BCA", "BTech", "BSc"],
          description: "Course must be one of: BCA, BTech, BSc"
        }
      }
    }
  }
})
\`\`\`

### 🛠️ 2. Applying Validation to an Existing Collection (\`collMod\`)
\`\`\`javascript
db.runCommand({
  collMod: "personal",
  validator: {
    $jsonSchema: {
      required: ["name", "age", "married", "address"],
      properties: {
        name: { bsonType: "string" },
        age: { bsonType: "int" },
        married: { bsonType: "bool" },
        hobbies: {
          bsonType: "array",
          items: { bsonType: "string", description: "Each hobby must be a string" }
        },
        address: {
          bsonType: "object",
          required: ["street", "city", "zip"],
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            zip: { bsonType: "int" }
          }
        }
      }
    }
  }
})
\`\`\`

### ⚠️ Critical Syntax Rules
* **Shorthand Type Names:** Always use \`"int"\` (not \`"integer"\`) and \`"bool"\` (not \`"boolean"\`) inside \`bsonType\`, and capitalize the \`S\` in \`$jsonSchema\` and \`T\` in \`bsonType\`.`
  },
  {
    topic_order: 8,
    slug: 'mongo-lecture-8-update-replace-documents-field-array-operators',
    title: 'Lecture 8: Updating & Replacing Documents — updateOne, updateMany, Field & Array Update Operators',
    duration_minutes: 34,
    video_url: 'http://www.youtube.com/watch?v=Aox_DHFnqTg',
    video_title: 'MongoDB Update & Replace Documents Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/update/',
    short_description: 'Modify documents using updateOne(), updateMany(), and replaceOne() with field operators ($set, $unset, $rename, $inc, $mul, $min, $max, $currentDate) and array operators ($push, $addToSet, $pop, $pull, $pullAll).',
    problemSelector: { topic: 'update', count: 12 },
    summary_markdown: `### 📌 Topic Overview
MongoDB provides three core methods to modify existing documents: **\`updateOne(filter, update)\`** (updates the first matching document), **\`updateMany(filter, update)\`** (updates all matching documents), and **\`replaceOne(filter, replacement)\`** (replaces the entire document while keeping its \`_id\`).

### 💡 Field Update Operators
* **\`$set\`:** Updates the value of existing fields or adds new fields if they do not exist.
* **\`$unset\`:** Completely removes a field from the document (e.g., \`{ $unset: { age: "" } }\`).
* **\`$rename\`:** Renames a field key without altering its value (e.g., \`{ $rename: { "skills": "coding_skills" } }\`).
* **\`$inc\`:** Increments (or decrements with a negative number) a numeric field by a specified amount (e.g., \`{ $inc: { age: 2 } }\`).
* **\`$mul\`:** Multiplies a numeric field by a factor (e.g., \`{ $mul: { age: 2 } }\`).
* **\`$min\`:** Updates the field ONLY if the specified value is **less than** the existing field value.
* **\`$max\`:** Updates the field ONLY if the specified value is **greater than** the existing field value.
* **\`$currentDate\`:** Sets a field to the current UTC date/timestamp (e.g., \`{ $currentDate: { lastModified: true } }\`).

### 💡 Array Update Operators
* **\`$push\`:** Appends a new value to the end of an array (allows duplicates).
* **\`$addToSet\`:** Appends a value to an array **only if it does not already exist** in the array (prevents duplicates).
* **\`$pop\`:** Removes the **last** element of an array when passed \`1\` (\`{ $pop: { skills: 1 } }\`) or the **first** element when passed \`-1\` (\`{ $pop: { skills: -1 } }\`).
* **\`$pull\`:** Removes all occurrences of a specific matching value from anywhere in an array (e.g., \`{ $pull: { skills: "Python" } }\`).
* **\`$pullAll\`:** Removes multiple specified values from an array at once (e.g., \`{ $pullAll: { skills: ["HTML", "JavaScript"] } }\`).

### 🛠️ Practical Update & Replace Examples
\`\`\`javascript
// 1. Update fields on a single document with $set and $inc
db.students.updateOne(
  { _id: ObjectId("671398e3d620709480d144bd") },
  {
    $set: { class: "BTech" },
    $inc: { age: 2 }
  }
)

// 2. Bulk update all BCA students to BIT & stamp lastModified date
db.students.updateMany(
  { class: "BCA" },
  {
    $set: { class: "BIT" },
    $currentDate: { lastModified: true }
  }
)

// 3. Array modifications: $addToSet (unique append) and $pullAll
db.students.updateOne(
  { name: "Salman Khan" },
  { $addToSet: { skills: "Java" } }
)

db.students.updateOne(
  { name: "John Abraham" },
  { $pullAll: { skills: ["JavaScript", "HTML"] } }
)

// 4. Replace an entire document while preserving its _id
db.students.replaceOne(
  { name: "Shahid Kapoor" },
  {
    name: "Saif Ali Khan",
    age: 21,
    skills: ["Go", "C++"]
  }
)
\`\`\``
  },
  {
    topic_order: 9,
    slug: 'mongo-lecture-9-delete-documents-deleteone-deletemany',
    title: 'Lecture 9: Deleting Documents — deleteOne(), deleteMany() & Collection Truncation',
    duration_minutes: 9,
    video_url: 'http://www.youtube.com/watch?v=cUq0upSof34',
    video_title: 'MongoDB Delete Document Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/tutorial/remove-documents/',
    short_description: 'Remove single matching documents by _id or filter using deleteOne(), bulk-delete matching records with deleteMany(), and empty entire collections safely using deleteMany({}).',
    problemSelector: { topic: 'delete', count: 10 },
    summary_markdown: `### 📌 Topic Overview
MongoDB provides two targeted methods for deleting documents from a collection: **\`deleteOne(filter)\`** and **\`deleteMany(filter)\`**.

### 💡 Single vs. Bulk Deletion Behavior
* **\`db.<collection>.deleteOne({ field: value })\`:** Searches the collection and deletes **only the very first document** that matches the filter criteria, even if multiple documents match. Returns \`{ acknowledged: true, deletedCount: 1 }\`.
* **Deleting by \`_id\` (Best Practice):** Because multiple documents can share the same \`name\` or \`class\`, always pass \`{ _id: ObjectId("...") }\` to \`deleteOne()\` when deleting a specific user record in production.
* **\`db.<collection>.deleteMany({ field: value })\`:** Deletes **all documents** in the collection that match the filter criteria and returns the total \`deletedCount\`.
* **Truncating a Collection (\`deleteMany({})\`):** Passing an empty filter object \`{}\` to \`deleteMany({})\` deletes every document in the collection while keeping the collection itself (and its indexes/validators) intact.

### 🛠️ Practical Deletion Examples
\`\`\`javascript
// 1. Delete a specific student safely using their unique _id
db.students.deleteOne({
  _id: ObjectId("67164551290b41d4bc701c11")
})
// Returns: { acknowledged: true, deletedCount: 1 }

// 2. Delete only the FIRST document where class is "BCA"
db.students.deleteOne({ class: "BCA" })

// 3. Delete ALL documents where class is "BCA"
db.students.deleteMany({ class: "BCA" })
// Returns: { acknowledged: true, deletedCount: 2 }

// 4. Delete all documents in the collection (empty filter object {} is mandatory)
db.students.deleteMany({})
\`\`\`

### ⚠️ Common Mistakes
* **Calling \`deleteMany()\` Without \`{}\`:** Calling \`db.students.deleteMany()\` with empty parentheses throws a missing filter error; you must explicitly pass \`{}\` (\`db.students.deleteMany({})\`) to confirm deleting all documents.`
  },
  {
    topic_order: 10,
    slug: 'mongo-lecture-10-find-projection-sort-limit-skip-count',
    title: 'Lecture 10: Querying Documents — find(), findOne(), Projection, count(), sort(), limit() & skip()',
    duration_minutes: 25,
    video_url: 'http://www.youtube.com/watch?v=THQP1EhvTDk',
    video_title: 'MongoDB Find Document Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/tutorial/query-documents/',
    short_description: 'Query collections with find() and findOne(), shape output fields using inclusion/exclusion Projections, and chain cursor methods (.count(), .sort(), .limit(), .skip()) for pagination.',
    problemSelector: { topics: ['find', 'projection'], count: 12 },
    summary_markdown: `### 📌 Topic Overview
Reading data in MongoDB relies on **\`find(query, projection)\`** and **\`findOne(query, projection)\`**, combined with chainable cursor methods (\`.projection()\`, \`.count()\`, \`.sort()\`, \`.limit()\`, \`.skip()\`) to shape, order, and paginate results.

### 💡 Querying & Projection Mechanics
* **\`db.<collection>.find(query)\`:** Returns a cursor containing **all** documents matching the query filter. Calling \`find()\` or \`find({})\` returns every document in the collection.
* **\`db.<collection>.findOne(query)\`:** Returns only the **first** document matching the query filter (or \`null\` if none match).
* **Projection (Shaping Output Fields):** Passed as the second argument \`find(query, { field: 1 })\` or chained via \`.projection({ field: 1 })\`:
  * **\`1\` (Inclusion):** Includes the specified field in the returned documents. All other fields (except \`_id\`) are automatically hidden.
  * **\`0\` (Exclusion):** Excludes the specified field. Note that \`_id\` is always returned by default unless you explicitly specify \`_id: 0\`.

### 💡 Cursor Chaining: Count, Sort, Limit & Skip (Pagination)
* **\`.count()\`:** Returns the integer count of documents matching the \`find()\` filter.
* **\`.sort({ field: 1 | -1 })\`:** Orders results by \`field\` in **ascending order (\`1\`)** (A-Z, smallest to largest) or **descending order (\`-1\`)** (Z-A, largest to smallest).
* **\`.limit(n)\`:** Restricts the result set to at most \`n\` documents.
* **\`.skip(n)\`:** Skips the first \`n\` documents before returning results. Combining \`.limit(pageSize).skip((page - 1) * pageSize)\` powers backend API pagination.

### 🛠️ Practical Query, Projection & Pagination Examples
\`\`\`javascript
// 1. Find all BCA students vs. only the first BCA student
db.students.find({ class: "BCA" })
db.students.findOne({ class: "BCA" })

// 2. Projection: Show ONLY name and class, hiding _id
db.students.find(
  { class: "BCA" },
  { name: 1, class: 1, _id: 0 }
)
// Equivalent chained method:
db.students.find({ class: "BCA" }).projection({ name: 1, class: 1, _id: 0 })

// 3. Count matching records
db.students.find({ class: "BCA" }).count()

// 4. Sort students by age descending (-1) and project name + age
db.students.find({}, { name: 1, age: 1, _id: 0 }).sort({ age: -1 })

// 5. Pagination with limit() and skip() (3 records per page)
db.students.find().limit(3).skip(0) // Page 1: Records 1, 2, 3
db.students.find().limit(3).skip(3) // Page 2: Records 4, 5, 6
db.students.find().limit(3).skip(6) // Page 3: Record 7
\`\`\``
  },
  {
    topic_order: 11,
    slug: 'mongo-lecture-11-comparison-query-operators',
    title: 'Lecture 11: Comparison Query Operators — $eq, $ne, $gt, $gte, $lt, $lte, $in & $nin',
    duration_minutes: 16,
    video_url: 'http://www.youtube.com/watch?v=3HHyQOV-9LU',
    video_title: 'MongoDB Comparison Query Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/query-comparison/',
    short_description: 'Write expressive filter queries across find(), updateMany(), and deleteMany() using MongoDB comparison operators: $eq, $ne, $gt, $gte, $lt, $lte, $in, and $nin.',
    problemSelector: { topic: 'find', keywords: ['$gt', '$lt', '$gte', '$lte', '$ne', '$in', '$nin', 'greater', 'less', 'between', 'not', 'in'], count: 12 },
    summary_markdown: `### 📌 Topic Overview
MongoDB **Comparison Query Operators** allow you to filter documents by numeric ranges, inequalities, and set memberships inside \`find()\`, \`updateOne()\` / \`updateMany()\`, and \`deleteOne()\` / \`deleteMany()\`.

### 💡 All 8 Comparison Operators
Every comparison operator is placed inside a nested object attached to the target field: \`{ <field>: { <$operator>: <value> } }\`.
* **\`$eq\` (Equal To):** Matches values strictly equal to the target value (\`{ age: { $eq: 20 } }\` is equivalent to \`{ age: 20 }\`).
* **\`$ne\` (Not Equal To):** Matches all documents where the field value does NOT equal the target value (\`{ class: { $ne: "BCA" } }\`).
* **\`$gt\` (Greater Than):** Matches numeric or date values strictly greater than the target (\`{ age: { $gt: 20 } }\` -> 21, 22, 23...).
* **\`$gte\` (Greater Than or Equal To):** Matches values greater than or equal to the target (\`{ age: { $gte: 20 } }\` -> 20, 21, 22...).
* **\`$lt\` (Less Than):** Matches values strictly less than the target (\`{ age: { $lt: 20 } }\` -> 19, 18...).
* **\`$lte\` (Less Than or Equal To):** Matches values less than or equal to the target (\`{ age: { $lte: 20 } }\` -> 20, 19...).
* **\`$in\` (In Array):** Matches documents where the field value equals **any** value in the provided array (\`{ class: { $in: ["BCA", "BSc"] } }\` — cleaner alternative to multiple OR conditions).
* **\`$nin\` (Not In Array):** Matches documents where the field value does **not** match any value in the array (\`{ age: { $nin: [20, 24] } }\`).

### 🛠️ Practical Comparison Queries in find(), updateMany() & deleteMany()
\`\`\`javascript
// 1. Range & Inequality Queries in find()
db.students.find({ age: { $gt: 20 } })
db.students.find({ age: { $lte: 20 } })
db.students.find({ class: { $ne: "BCA" } })

// 2. Matching Multiple Values with $in and $nin
db.students.find({ age: { $in: [20, 24] } })
db.students.find({ class: { $in: ["BCA", "BSc"] } })
db.students.find({ class: { $nin: ["BCA", "BSc"] } })

// 3. Using Comparison Operators inside updateMany()
// Promote all students younger than 20 to class "12th"
db.students.updateMany(
  { age: { $lt: 20 } },
  { $set: { class: "12th" } }
)

// 4. Using Comparison Operators inside deleteMany()
// Delete all students younger than 20
db.students.deleteMany({ age: { $lt: 20 } })
\`\`\``
  }
];

function cleanMarkdown(raw) {
  if (!raw) return '';
  let md = raw.replace(/>\s*🎥\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/>\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/\]*\]/gi, '');
  md = md.replace(/<\/?think>/gi, '');
  
  // Remove markdown tables if any
  const lines = md.split('\n');
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^\|[-:\s|]+\|$/.test(line)) continue;
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.slice(1, -1).split('|').map(c => c.trim()).filter(c => c.length > 0);
      if (cells.length > 0) {
        result.push('* **' + cells[0].replace(/^\*\*(.*?)\*\*$/, '$1') + ':** ' + cells.slice(1).join(' — '));
      }
      continue;
    }
    result.push(lines[i]);
  }
  md = result.join('\n');

  // Strip horizontal rules
  md = md.split('\n').filter(line => {
    const t = line.trim();
    return t !== '---' && t !== '***' && t !== '___';
  }).join('\n');

  // Replace blockquotes with bullet points
  md = md.split('\n').map(line => {
    const t = line.trim();
    if (t.startsWith('> ')) return '* ' + t.replace(/^>\s*/, '');
    return line;
  }).join('\n');

  return md.replace(/\n{3,}/g, '\n\n').trim();
}

function normalizePattern(t) {
  return t
    .replace(/\b(SKU-\d+|Item \d+|\d+)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

async function seedMongoDBBatch1() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding MongoDB Track Batch 1 (Lectures 1 to 11) ---');
    await client.query('BEGIN');

    // 1. Locate track
    const trackRes = await client.query(`
      SELECT id, slug, name, parent_track_id FROM tracks WHERE slug = 'mongodb-mastery' LIMIT 1;
    `);
    if (trackRes.rows.length === 0) {
      throw new Error("Track 'mongodb-mastery' not found in database.");
    }
    const track = trackRes.rows[0];
    const trackId = track.id;
    console.log(`Target Track: [ID:${trackId}] ${track.name} (parent_track_id: ${track.parent_track_id})`);

    // 2. Remove old dummy placeholder topics in this track (keep none or only mongo-lecture-%)
    const removedRes = await client.query(`
      DELETE FROM topics
      WHERE track_id = $1 AND (slug NOT LIKE 'mongo-lecture-%' OR slug IS NULL)
      RETURNING id, slug, name;
    `, [trackId]);
    if (removedRes.rows.length > 0) {
      console.log(`Cleaned up ${removedRes.rows.length} old dummy topics from track ${trackId}`);
    }

    // Clean track_topics for this track to refresh ordering cleanly
    await client.query(`DELETE FROM track_topics WHERE track_id = $1;`, [trackId]);

    // 3. Load catalog
    if (!fs.existsSync(CATALOG_PATH)) {
      throw new Error(`Catalog file not found at ${CATALOG_PATH}. Please run fetch_mongopractice_catalog.js first.`);
    }
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
    console.log(`Loaded ${catalog.length} questions from catalog.`);

    // Smart Diversity Selector State
    const usedQuestionIds = new Set();
    const usedPatternKeys = new Set();

    function selectCuratedProblems(lecture) {
      const criteria = lecture.problemSelector;
      const count = criteria.count || 0;
      if (count <= 0) return [];

      const picked = [];

      // Filter condition based on lecture
      const matchesCriteria = (q) => {
        const titleLower = q.title.toLowerCase();
        const eq = (q.expectedQuery || '');
        const tags = (q.tags || []).map(t => t.toLowerCase());

        if (lecture.topic_order === 5) {
          // Lecture 5: Basic find & equality, Easy
          return (q.difficulty === 'Easy') &&
                 !eq.includes('$') &&
                 !eq.includes('.sort(') &&
                 !eq.includes('.limit(') &&
                 !eq.includes('.skip(') &&
                 !eq.includes('.aggregate');
        } else if (lecture.topic_order === 6) {
          // Lecture 6: BSON data types (dates, booleans, arrays, dot-notation)
          return eq.includes('true') ||
                 eq.includes('false') ||
                 eq.includes('Date') ||
                 eq.includes('.') ||
                 tags.includes('date') ||
                 tags.includes('boolean');
        } else if (lecture.topic_order === 8) {
          // Lecture 8: Update / array & field structures
          return eq.includes('$elemMatch') ||
                 eq.includes('$size') ||
                 eq.includes('$all') ||
                 tags.includes('array') ||
                 tags.includes('$size') ||
                 tags.includes('$elemMatch') ||
                 tags.includes('dot notation');
        } else if (lecture.topic_order === 9) {
          // Lecture 9: Delete / inequality / negative filters
          return eq.includes('$ne') ||
                 eq.includes('$nin') ||
                 eq.includes('$not') ||
                 eq.includes('$nor') ||
                 tags.includes('$ne');
        } else if (lecture.topic_order === 10) {
          // Lecture 10: Projection, count, sort, limit, skip
          return eq.includes('.sort(') ||
                 eq.includes('.limit(') ||
                 eq.includes('.skip(') ||
                 titleLower.includes('project') ||
                 tags.includes('projection') ||
                 tags.includes('sort') ||
                 tags.includes('limit') ||
                 tags.includes('skip');
        } else if (lecture.topic_order === 11) {
          // Lecture 11: Comparison query operators
          return eq.includes('$gt') ||
                 eq.includes('$gte') ||
                 eq.includes('$lt') ||
                 eq.includes('$lte') ||
                 eq.includes('$in') ||
                 eq.includes('$nin') ||
                 titleLower.includes('between') ||
                 tags.includes('comparison');
        }

        return true;
      };

      // Pass 1: Criteria match + unique pattern
      for (const q of catalog) {
        if (usedQuestionIds.has(q._id)) continue;
        const pat = normalizePattern(q.title);
        if (usedPatternKeys.has(pat)) continue;

        if (matchesCriteria(q)) {
          picked.push(q);
          usedQuestionIds.add(q._id);
          usedPatternKeys.add(pat);
          if (picked.length >= count) break;
        }
      }

      // Pass 2: Criteria match, allowing duplicate patterns if needed
      if (picked.length < count) {
        for (const q of catalog) {
          if (usedQuestionIds.has(q._id)) continue;
          if (matchesCriteria(q)) {
            picked.push(q);
            usedQuestionIds.add(q._id);
            if (picked.length >= count) break;
          }
        }
      }

      // Pass 3: Unused question fallback
      if (picked.length < count) {
        for (const q of catalog) {
          if (usedQuestionIds.has(q._id)) continue;
          const pat = normalizePattern(q.title);
          if (!usedPatternKeys.has(pat)) {
            picked.push(q);
            usedQuestionIds.add(q._id);
            usedPatternKeys.add(pat);
            if (picked.length >= count) break;
          }
        }
      }

      return picked.slice(0, count).map((q, idx) => ({
        id: `mongo-${lecture.topic_order}-prob-${idx + 1}`,
        problemId: `${q.serialNumber}`,
        title: `Problem #${q.serialNumber}: ${q.title}`,
        name: `Problem #${q.serialNumber}: ${q.title}`,
        url: `https://mongopractice.online/mongodb-practice-questions/${q._id}`,
        link: `https://mongopractice.online/mongodb-practice-questions/${q._id}`,
        external_url: `https://mongopractice.online/mongodb-practice-questions/${q._id}`,
        difficulty: q.difficulty || 'Easy',
        platform: 'MongoPractice',
        description: q.description || `Solve "${q.title}" on MongoPractice using MongoDB.`
      }));
    }

    // 4. Seed each lecture in batch1Lectures
    for (const lec of batch1Lectures) {
      const cleanSummary = cleanMarkdown(lec.summary_markdown);
      const curatedProblems = selectCuratedProblems(lec);
      const problemsJson = JSON.stringify(curatedProblems);
      const docLinksJson = JSON.stringify([
        {
          title: `MongoDB Official Manual — ${lec.title.split('—')[0].trim()}`,
          url: lec.official_docs_url,
          link: lec.official_docs_url
        }
      ]);

      const videoLinksJson = JSON.stringify([
        {
          title: lec.video_title || lec.title,
          url: lec.video_url,
          duration: `${lec.duration_minutes || 20}m`,
          creator_name: 'Yahoo Baba',
          creator_channel_url: 'https://www.youtube.com/@YahooBaba'
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
            creator_name = 'Yahoo Baba',
            creator_channel_url = 'https://www.youtube.com/@YahooBaba',
            track_id = $9
          WHERE id = $10;
        `, [
          lec.title,
          lec.topic_order,
          lec.short_description,
          cleanSummary,
          lec.official_docs_url,
          problemsJson,
          docLinksJson,
          videoLinksJson,
          trackId,
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
            'Yahoo Baba', 'https://www.youtube.com/@YahooBaba', $10
          ) RETURNING id;
        `, [
          lec.title,
          lec.slug,
          lec.topic_order,
          lec.short_description,
          cleanSummary,
          lec.official_docs_url,
          problemsJson,
          docLinksJson,
          videoLinksJson,
          trackId
        ]);
        topicId = insertRes.rows[0].id;
      }

      // Ensure track_topics mapping
      await client.query(`
        INSERT INTO track_topics (track_id, topic_id, topic_order)
        VALUES ($1, $2, $3)
        ON CONFLICT (track_id, topic_id) DO UPDATE SET topic_order = EXCLUDED.topic_order;
      `, [trackId, topicId, lec.topic_order]);

      // Sync resources table for problem and doc links
      await client.query(`
        DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('problem', 'practice', 'video', 'documentation');
      `, [topicId]);

      // Insert video resource
      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'video', $4);
      `, [topicId, lec.video_title || lec.title, lec.video_url, lec.duration_minutes || 20]);

      // Insert documentation resource
      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'documentation', 10);
      `, [topicId, `MongoDB Manual — ${lec.title}`, lec.official_docs_url]);

      // Insert problems
      for (const prob of curatedProblems) {
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, difficulty, estimated_minutes)
          VALUES ($1, $2, $3, 'problem', $4, 15);
        `, [topicId, prob.title, prob.url, prob.difficulty]);
      }

      console.log(`[SEED] Lecture ${lec.topic_order} (ID:${topicId}): ${lec.slug} | MdLen: ${cleanSummary.length} | Problems: ${curatedProblems.length}`);
    }

    await client.query('COMMIT');
    console.log('--- MongoDB Batch 1 Seeded Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedMongoDBBatch1();
