const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const CATALOG_PATH = path.resolve(__dirname, 'mongopractice_catalog.json');

const batch2Lectures = [
  {
    topic_order: 12,
    slug: 'mongo-lecture-12-logical-query-operators-and-or-nor-not',
    title: 'Lecture 12: Logical Query Operators — $and, $or, $nor & $not',
    duration_minutes: 21,
    video_url: 'http://www.youtube.com/watch?v=QXbmrRJmxNs',
    video_title: 'MongoDB Logical Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/query-logical/',
    short_description: 'Combine multiple filter conditions across single or multiple fields in find(), updateMany(), and deleteMany() using MongoDB logical operators: $and, $or, $nor, and $not.',
    problemSelector: { topics: ['find'], keywords: ['and', 'or', 'not', 'nor', 'both', 'either', 'neither', 'between', 'range'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
When a single field comparison is not enough, MongoDB **Logical Query Operators** allow you to combine multiple conditions across one or more fields inside \`find()\`, \`updateOne()\` / \`updateMany()\`, and \`deleteOne()\` / \`deleteMany()\`.

### 💡 All 4 Logical Query Operators
* **\`$and\` (Logical AND):** Joins an array of query clauses \`{ $and: [ { <cond1> }, { <cond2> } ] }\` and returns documents that satisfy **all** conditions simultaneously (e.g., \`age > 20\` AND \`class == "BTech"\`).
* **\`$or\` (Logical OR):** Joins an array of query clauses \`{ $or: [ { <cond1> }, { <cond2> } ] }\` and returns documents that satisfy **at least one** of the conditions.
* **\`$nor\` (Logical NOR):** Joins an array of query clauses \`{ $nor: [ { <cond1> }, { <cond2> } ] }\` and returns documents that **fail all** specified conditions (the exact inverse of \`$or\`).
* **\`$not\` (Field-Level Negation):** Inverts the effect of a single operator expression on a specific field: \`{ <field>: { $not: { <$operator>: <value> } } }\`. Unlike \`$and\`, \`$or\`, and \`$nor\`, \`$not\` takes a single condition object (NOT an array) and is placed inside the field key.

### 🛠️ Practical Logical Operator Queries
\`\`\`javascript
// 1. $and: Students with age strictly between 20 and 25 (21, 22, 23, 24)
db.students.find({
  $and: [
    { age: { $gt: 20 } },
    { age: { $lt: 25 } }
  ]
}, { name: 1, age: 1, class: 1, _id: 0 })

// 2. $and across different fields: Age > 20 AND Class is "BTech"
db.students.find({
  $and: [
    { age: { $gt: 20 } },
    { class: { $eq: "BTech" } }
  ]
})

// 3. $or: Students who are EITHER older than 20 OR enrolled in "BTech"
db.students.find({
  $or: [
    { age: { $gt: 20 } },
    { class: { $eq: "BTech" } }
  ]
})

// 4. $nor: Students who are NEITHER older than 20 NOR enrolled in "BTech"
db.students.find({
  $nor: [
    { age: { $gt: 20 } },
    { class: { $eq: "BTech" } }
  ]
})

// 5. $not (Field-Level): Students whose age is NOT greater than 20 (i.e. <= 20)
db.students.find({
  age: { $not: { $gt: 20 } }
})

// 6. Using $and inside deleteMany()
db.students.deleteMany({
  $and: [
    { age: { $gt: 20 } },
    { class: { $eq: "BTech" } }
  ]
})
\`\`\`

### ⚠️ Common Syntax Mistakes
* **Placing \`$not\` at the Top Level or Passing an Array:** \`$not\` must always be nested inside a field (\`{ age: { $not: { $gt: 20 } } }\`). Writing \`{ $not: [ ... ] }\` at the top level throws an \`unknown top level operator: $not\` error.`
  },
  {
    topic_order: 13,
    slug: 'mongo-lecture-13-element-query-operators-exists-type',
    title: 'Lecture 13: Element Query Operators — $exists & $type (BSON Type Filtering)',
    duration_minutes: 11,
    video_url: 'http://www.youtube.com/watch?v=NnWG59wMYIs',
    video_title: 'MongoDB Element Query Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/query-element/',
    short_description: 'Filter documents by field presence or absence using $exists and audit or query fields by their underlying BSON storage type using $type.',
    problemSelector: { topics: ['find'], keywords: ['exists', 'type', 'missing', 'null', 'field', 'string', 'array', 'number'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
Because MongoDB has a flexible schema, some documents in a collection may omit optional fields or accidentally store values in the wrong data type (such as storing \`age: "24"\` as a String instead of an Integer). **Element Query Operators** (\`$exists\` and \`$type\`) let you query metadata about fields rather than their values.

### 💡 Core Element Operators
* **\`$exists\` (Field Presence Check):** Syntax: \`{ <field>: { $exists: <true | false> } }\`
  * **\`true\`:** Matches all documents that contain the specified field (including documents where the field value is \`null\`).
  * **\`false\`:** Matches all documents where the specified field is completely missing.
* **\`$type\` (BSON Data Type Check):** Syntax: \`{ <field>: { $type: <BSON alias | number | array> } }\`
  * Matches documents where the value of \`<field>\` is stored as the specified BSON type.
  * Common BSON string aliases: \`"string"\` (code \`2\`), \`"int"\` (32-bit integer, code \`16\`), \`"long"\` (64-bit integer, code \`18\`), \`"double"\` (code \`1\`), \`"bool"\` (code \`8\`), \`"date"\` (code \`9\`), \`"array"\` (code \`4\`), \`"object"\` (code \`3\`), \`"null"\` (code \`10\`).
  * **Multiple Types:** Pass an array of types (e.g., \`{ age: { $type: ["double", "int"] } }\`) to match documents where the field is either a 32-bit integer or a floating-point double.

### 🛠️ Practical $exists & $type Queries
\`\`\`javascript
// 1. Find students where the "class" field is completely missing
db.students.find({
  class: { $exists: false }
})

// 2. Find students where the "class" field exists
db.students.find({
  class: { $exists: true }
})

// 3. Data Auditing: Find records where "age" was mistakenly stored as a String ("24")
db.students.find({
  age: { $type: "string" }
})

// 4. Find records where "age" is strictly a 32-bit Integer ("int")
db.students.find({
  age: { $type: "int" }
})

// 5. Find records where "age" is EITHER a Double OR a 32-bit Integer
db.students.find({
  age: { $type: ["double", "int"] }
})

// 6. Querying by numeric BSON type code (1 = "double")
db.students.find({
  age: { $type: 1 }
})
\`\`\``
  },
  {
    topic_order: 14,
    slug: 'mongo-lecture-14-evaluation-query-operators-regex-expr-mod',
    title: 'Lecture 14: Evaluation Query Operators — $regex, $expr, $mod & $jsonSchema',
    duration_minutes: 23,
    video_url: 'http://www.youtube.com/watch?v=bYgbqchjtgI',
    video_title: 'MongoDB Evaluation Query Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/query-evaluation/',
    short_description: 'Perform pattern matching with $regex, compare fields within the same document using $expr and arithmetic operators, and filter by division remainders with $mod.',
    problemSelector: { topics: ['find'], keywords: ['regex', 'pattern', 'start', 'end', 'contain', 'expr', 'mod', 'divisible', 'even', 'odd', 'name'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
**Evaluation Query Operators** unlock advanced search capabilities that standard comparison operators cannot express: pattern matching inside strings (\`$regex\`), comparing two fields inside the same document (\`$expr\`), and modulo arithmetic filtering (\`$mod\`).

### 💡 Core Evaluation Operators
* **\`$regex\` (Regular Expression Pattern Matching):**
  * **Substring Match:** \`{ name: { $regex: "Khan" } }\` matches \`"Khan"\` anywhere in the string (case-sensitive by default).
  * **Case-Insensitive Match (\`i\` flag):** Use slash notation \`{ name: { $regex: /khan/i } }\` or \`{ name: { $regex: "khan", $options: "i" } }\` to ignore letter casing.
  * **Starts With (\`^\`):** \`{ name: { $regex: "^A" } }\` matches names starting with \`A\` (e.g., \`"Akshay Kumar"\`, \`"Aamir Khan"\`).
  * **Ends With (\`$\`):** \`{ name: { $regex: "or$" } }\` matches names ending with \`"or"\` (e.g., \`"Shahid Kapoor"\`).
* **\`$expr\` (Intra-Document Field Comparison & Aggregation Expressions):**
  * Allows using aggregation expressions (like \`$gt\`, \`$lt\`, \`$multiply\`, \`$add\`) inside \`find()\` to compare two fields in the **same document**.
  * Field references inside \`$expr\` must be prefixed with a dollar sign (\`"$spent"\`, \`"$budget"\`).
* **\`$mod\` (Modulo Division Filter):**
  * Syntax: \`{ <field>: { $mod: [ <divisor>, <remainder> ] } }\`.
  * Divides the numeric field value by \`<divisor>\` and matches documents where the remainder equals \`<remainder>\` (e.g., \`[2, 0]\` for even numbers, \`[7, 0]\` for multiples of 7).

### 🛠️ Practical Evaluation Operator Examples
\`\`\`javascript
// 1. $regex: Case-insensitive substring, prefix (^), and suffix ($) searches
db.students.find({ name: { $regex: /khan/i } })
db.students.find({ name: { $regex: "^A" } })
db.students.find({ name: { $regex: "or$" } })

// 2. $expr: Find monthlyBudget categories where "spent" exceeded "budget"
db.monthlyBudget.find({
  $expr: {
    $gt: ["$spent", "$budget"]
  }
})

// 3. $expr with $multiply: Find products where selling "price" > 1.2x "cost"
db.sales.find({
  $expr: {
    $gt: [
      "$price",
      { $multiply: ["$cost", 1.2] }
    ]
  }
})

// 4. $mod: Find sales items whose "cost" is cleanly divisible by 7 (remainder 0)
db.sales.find({
  cost: { $mod: [7, 0] }
})
\`\`\``
  },
  {
    topic_order: 15,
    slug: 'mongo-lecture-15-findoneandupdate-findoneandreplace-findoneanddelete',
    title: 'Lecture 15: Atomic Find-and-Modify — findOneAndUpdate(), findOneAndReplace() & findOneAndDelete()',
    duration_minutes: 26,
    video_url: 'http://www.youtube.com/watch?v=8EuluG46ysk',
    video_title: 'MongoDB FindOneAndUpdate FindOneAndReplace FindOneAndDelete Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/',
    short_description: 'Atomically locate, modify, and return documents in a single round-trip using findOneAndUpdate(), findOneAndReplace(), and findOneAndDelete() with returnDocument, upsert, sort, and projection options.',
    problemSelector: { topics: ['update', 'delete'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
While \`updateOne()\`, \`replaceOne()\`, and \`deleteOne()\` only return status metadata (\`{ acknowledged: true, modifiedCount: 1 }\`), real-world backend APIs usually need the **actual document** back after modifying or deleting it. MongoDB provides three atomic methods that find, modify, and return the target document in a single operation:
* **\`findOneAndUpdate(filter, update, options)\`**
* **\`findOneAndReplace(filter, replacement, options)\`**
* **\`findOneAndDelete(filter, options)\`**

### 💡 Key Options Parameters
* **\`returnDocument: "before" | "after"\`:**
  * \`"before"\` (Default): Returns the original document state **before** the update/replacement was applied.
  * \`"after"\`: Returns the newly modified document state **after** the update/replacement was applied.
* **\`projection: { field: 1, _id: 0 }\`:** Shapes which fields are included in the returned document.
* **\`upsert: true | false\`:** Available on \`findOneAndUpdate\` and \`findOneAndReplace\`. When \`true\`, if no document matches \`filter\`, MongoDB inserts a new document instead of returning \`null\`.
* **\`sort: { field: 1 | -1 }\`:** When multiple documents match \`filter\` (e.g., two students named \`"Salman Khan"\`), \`sort\` determines which specific document gets updated, replaced, or deleted first (e.g., \`{ age: 1 }\` targets the youngest matching student).

### 🛠️ Practical Atomic Find-and-Modify Examples
\`\`\`javascript
// 1. findOneAndUpdate: Update age, return the UPDATED document ("after"), and project fields
db.students.findOneAndUpdate(
  { name: "Kartik Aaryan" },
  { $set: { age: 25 } },
  {
    returnDocument: "after",
    projection: { name: 1, age: 1, _id: 0 }
  }
)

// 2. findOneAndUpdate with upsert: Insert if student does not exist
db.students.findOneAndUpdate(
  { name: "Sachin Tendulkar" },
  { $set: { age: 25, class: "BIT" } },
  {
    returnDocument: "after",
    upsert: true
  }
)

// 3. findOneAndUpdate with sort: Among duplicate names, update the youngest student (age: 1)
db.students.findOneAndUpdate(
  { name: "Salman Khan" },
  { $set: { class: "BIT" } },
  { sort: { age: 1 }, returnDocument: "after" }
)

// 4. findOneAndReplace: Replace entire document while preserving _id
db.students.findOneAndReplace(
  { name: "Akshay Kumar" },
  { name: "Sanjay Dutt", age: 35, class: "BCom" },
  { returnDocument: "after" }
)

// 5. findOneAndDelete: Delete youngest matching record and return its deleted data
db.students.findOneAndDelete(
  { name: "Salman Khan" },
  {
    sort: { age: 1 },
    projection: { name: 1, _id: 0 }
  }
)
\`\`\``
  },
  {
    topic_order: 16,
    slug: 'mongo-lecture-16-aggregation-pipeline-match-sort-project-sample',
    title: 'Lecture 16: Aggregation Pipeline Foundations — $match, $count, $sort, $sortByCount, $project, $limit, $skip & $sample',
    duration_minutes: 27,
    video_url: 'http://www.youtube.com/watch?v=3sJbtnfmnYQ',
    video_title: 'MongoDB Aggregation Pipeline Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline/',
    short_description: 'Build multi-stage data processing pipelines with db.collection.aggregate([]) using $match, $count, $sort, $sortByCount, $project (with computed fields), $skip, $limit, and $sample.',
    problemSelector: { topics: ['aggregation', 'projection'], keywords: ['match', 'sort', 'project', 'limit', 'skip', 'count', 'sample'], count: 12 },
    summary_markdown: `### 📌 Topic Overview
The **MongoDB Aggregation Pipeline** (\`db.<collection>.aggregate([ stage1, stage2, ... ])\`) processes documents through a sequence of stages. Each stage transforms, filters, sorts, or reshapes the documents and passes its output directly into the next stage.

### 💡 Core Pipeline Stages Covered
* **\`$match\`:** Filters documents early in the pipeline using standard comparison (\`$gt\`, \`$lt\`) and logical (\`$and\`, \`$or\`) operators. Always place \`$match\` as the first stage to reduce the number of documents processed downstream.
* **\`$count\`:** Counts the total number of documents reaching that stage and outputs \`{ "<customFieldName>": <count> }\`.
* **\`$sort\`:** Orders documents by one or more fields (\`1\` for ascending, \`-1\` for descending). Supports multi-field tie-breaking (e.g., \`{ age: 1, name: 1 }\`).
* **\`$project\`:** Includes (\`1\`) or excludes (\`0\`) fields, and computes **new dynamic fields** using expressions (such as \`isValidAge: { $gt: ["$age", 20] }\`).
* **\`$sortByCount\`:** Groups incoming documents by a specified expression (e.g., \`"$class"\`), computes the count per distinct value, and automatically sorts the buckets in descending order of \`count\`.
* **\`$skip\` & \`$limit\`:** Paginates pipeline output. Always place \`$skip\` **before** \`$limit\` when building paginated pipelines.
* **\`$sample\`:** Randomly selects \`n\` documents from the collection: \`{ $sample: { size: 2 } }\`.

### 🛠️ Multi-Stage Aggregation Pipeline Examples
\`\`\`javascript
// 1. Multi-stage pipeline: $match -> $sort -> $project -> $skip -> $limit
db.students.aggregate([
  { $match: { age: { $gt: 20 } } },
  { $sort: { age: 1, name: 1 } },
  { $project: { name: 1, class: 1, _id: 0 } },
  { $skip: 0 },
  { $limit: 2 }
])

// 2. $project with a computed boolean field ("isValidAge")
db.students.aggregate([
  { $sort: { age: 1, name: 1 } },
  {
    $project: {
      name: 1,
      class: 1,
      _id: 0,
      isValidAge: { $gt: ["$age", 20] }
    }
  }
])

// 3. $match followed by $count
db.students.aggregate([
  { $match: { age: { $gt: 20 } } },
  { $count: "studentsAbove20" }
])

// 4. $sortByCount: Group by class, count students, and sort highest to lowest
db.students.aggregate([
  { $sortByCount: "$class" }
])
// Output: [ { _id: "BTech", count: 3 }, { _id: "BCA", count: 3 }, { _id: "BSc", count: 2 } ]

// 5. $sample: Fetch 2 random documents on each execution
db.students.aggregate([
  { $sample: { size: 2 } }
])
\`\`\``
  },
  {
    topic_order: 17,
    slug: 'mongo-lecture-17-aggregation-group-and-accumulator-operators',
    title: 'Lecture 17: Aggregation $group & Accumulators — $sum, $avg, $min, $max, $median, $push, $addToSet, $first/$last & $top/$bottom',
    duration_minutes: 31,
    video_url: 'http://www.youtube.com/watch?v=2sHcSQNvBm8',
    video_title: 'MongoDB Aggregation $group Operator Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/',
    short_description: 'Group documents by keys or across whole collections with $group and compute aggregates using $sum, $count, $avg, $min, $max, $median, $push, $addToSet, $first, $last, $topN, and $bottomN.',
    problemSelector: { topics: ['aggregation'], keywords: ['group', 'sum', 'avg', 'average', 'min', 'max', 'count', 'push', 'first', 'last', 'total'], count: 12 },
    summary_markdown: `### 📌 Topic Overview
The **\`$group\`** stage partitions incoming documents into groups based on a mandatory **\`_id\`** key expression (e.g., \`_id: "$class"\`, or \`_id: null\` to aggregate the entire collection into a single group) and applies **Accumulator Operators** to compute per-group metrics.

### 💡 Complete Accumulator Operators Reference
* **\`$sum\` & \`$count\`:** Use \`{ $sum: 1 }\` or \`{ $count: {} }\` to count documents in each group, or \`{ $sum: "$amount" }\` to sum a numeric field.
* **\`$avg\`, \`$min\`, \`$max\`:** Compute the arithmetic mean, minimum value, or maximum value of a numeric field per group.
* **\`$median\`:** Computes the middle value of a numeric distribution: \`{ $median: { input: "$age", method: "approximate" } }\`.
* **\`$push\` & \`$addToSet\`:** Collect field values from each group into an array (\`{ $push: "$name" }\`), push entire documents (\`{ $push: "$$ROOT" }\`), or collect only unique values (\`{ $addToSet: "$name" }\`).
* **\`$first\` & \`$last\`:** Return a field (or \`"$$ROOT"\`) from the first or last document encountered in each group.
* **\`$top\`, \`$topN\`, \`$bottom\`, \`$bottomN\`:** Sort documents **inside each group** via \`sortBy\` and return the top/bottom \`1\` or \`n\` records with selected \`output\` fields—without needing a separate prior \`$sort\` stage.

### 🛠️ Practical $group & Accumulator Queries
\`\`\`javascript
// 1. Group by class, count students, and sort by count descending
db.students.aggregate([
  {
    $group: {
      _id: "$class",
      count: { $sum: 1 },
      avgAge: { $avg: "$age" },
      minAge: { $min: "$age" },
      maxAge: { $max: "$age" }
    }
  },
  { $sort: { count: -1 } }
])

// 2. Collect student names (or full documents via $$ROOT) into an array per class
db.students.aggregate([
  {
    $group: {
      _id: "$class",
      studentNames: { $push: "$name" },
      uniqueNames: { $addToSet: "$name" },
      allRecords: { $push: "$$ROOT" }
    }
  }
])

// 3. Compute overall collection-wide Average & Median Age using _id: null
db.students.aggregate([
  {
    $group: {
      _id: null,
      overallAvgAge: { $avg: "$age" },
      medianAge: {
        $median: { input: "$age", method: "approximate" }
      }
    }
  }
])

// 4. $topN: Find the 3 youngest students inside each class group
db.students.aggregate([
  {
    $group: {
      _id: "$class",
      youngestThree: {
        $topN: {
          n: 3,
          output: ["$name", "$class", "$age"],
          sortBy: { age: 1 }
        }
      }
    }
  }
])
\`\`\``
  },
  {
    topic_order: 18,
    slug: 'mongo-lecture-18-aggregation-lookup-unwind-replaceroot-joins',
    title: 'Lecture 18: Joining Collections in MongoDB — $lookup, $unwind, $replaceRoot & $mergeObjects',
    duration_minutes: 30,
    video_url: 'http://www.youtube.com/watch?v=sIIJHVdm7sA',
    video_title: 'MongoDB Aggregation $lookUp Operator Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/',
    short_description: 'Perform Left Outer Joins across MongoDB collections using $lookup and flatten joined sub-documents into clean top-level objects with $unwind, $replaceRoot, $mergeObjects, and $arrayElemAt.',
    problemSelector: { topics: ['aggregation'], keywords: ['lookup', 'join', 'order', 'customer', 'unwind', 'merge', 'foreign', 'local'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
When normalized data is split across multiple collections (such as \`library\` books referencing \`students\`, or \`customers\` linked to \`orders\`), MongoDB's **\`$lookup\`** stage performs a **Left Outer Join** between collections in the same database.

### 💡 The 4 Mandatory Parameters of \`$lookup\`
* **\`from\`:** The target foreign collection name to join with (e.g., \`"students"\` or \`"orders"\`).
* **\`localField\`:** The field in the primary input collection holding the reference key (e.g., \`"student_id"\` in \`library\`).
* **\`foreignField\`:** The matching field in the \`from\` collection (e.g., \`"_id"\` in \`students\`).
* **\`as\`:** The name of the new array field added to each output document containing the matched foreign documents (e.g., \`"student"\` or \`"order_details"\`). If no match exists, \`as\` is an empty array \`[]\`.

### 💡 Flattening Joined Arrays with \`$unwind\` vs. \`$replaceRoot\`
* **\`$unwind: "$<arrayField>"\`:** Deconstructs the joined array so each matched object becomes a direct sub-object instead of a 1-element array.
* **\`$replaceRoot\` + \`$mergeObjects\` + \`$arrayElemAt\`:** Extracts the first matched object from the joined array (\`{ $arrayElemAt: ["$student", 0] }\`), merges its fields directly with the main document (\`"$$ROOT"\`), and promotes the merged result to the top level so there are no nested arrays or sub-objects.

### 🛠️ Practical $lookup & Root Flattening Pipelines
\`\`\`javascript
// 1. One-to-Many Join: Fetch all customers along with their placed orders array
db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customer_id",
      as: "order_details"
    }
  }
])

// 2. Join students with library books & flatten array with $unwind
db.students.aggregate([
  {
    $lookup: {
      from: "library",
      localField: "_id",
      foreignField: "student_id",
      as: "book"
    }
  },
  { $unwind: "$book" }
])

// 3. Join library with students & promote student fields to the top-level root
db.library.aggregate([
  {
    $lookup: {
      from: "students",
      localField: "student_id",
      foreignField: "_id",
      as: "student"
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          { $arrayElemAt: ["$student", 0] },
          "$$ROOT"
        ]
      }
    }
  },
  { $project: { student: 0 } }
])
\`\`\``
  },
  {
    topic_order: 19,
    slug: 'mongo-lecture-19-aggregation-bucket-and-bucketauto',
    title: 'Lecture 19: Range Bucketing in Aggregations — $bucket & $bucketAuto Stages',
    duration_minutes: 20,
    video_url: 'http://www.youtube.com/watch?v=i5X3BjvrB9U',
    video_title: 'MongoDB $bucket & $bucketAuto Operator Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/',
    short_description: 'Categorize numeric documents into custom histogram ranges using $bucket (with boundaries and default fallback) or automatically balanced range buckets using $bucketAuto.',
    problemSelector: { topics: ['aggregation'], keywords: ['bucket', 'range', 'group', 'count', 'average', 'sum', 'price', 'score'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
While \`$group\` groups documents by exact field values, **\`$bucket\`** and **\`$bucketAuto\`** group numeric documents into **value ranges (histograms)**—such as grouping students into academic divisions (\`33-45%\`, \`45-60%\`, \`60-80%\`, \`80-100%\`) or products into price tiers.

### 💡 \`$bucket\` vs. \`$bucketAuto\`
* **\`$bucket\` (Custom Manual Boundaries):**
  * **\`groupBy\`:** The numeric field expression to bucket on (e.g., \`"$percentage"\`).
  * **\`boundaries\`:** An ascending array of numeric range edges (e.g., \`[33, 45, 60, 80, 100]\`). Each bucket has an inclusive lower bound and exclusive upper bound \`[lower, upper)\`.
  * **\`default\`:** Fallback bucket name (e.g., \`"Fail Students"\` or \`"Other"\`) that catches any document falling outside the specified \`boundaries\`.
  * **\`output\` (Optional):** Specifies accumulator metrics per bucket (\`$sum\`, \`$avg\`, \`$push\`). If omitted, MongoDB defaults to returning \`{ count: <number> }\`.
* **\`$bucketAuto\` (Automatic Evenly-Distributed Buckets):**
  * Instead of manual \`boundaries\`, you specify **\`buckets: <integer>\`** (e.g., \`buckets: 3\`).
  * MongoDB automatically inspects the min/max values of \`groupBy\` and calculates balanced range boundaries (\`_id: { min: ..., max: ... }\`) so documents are distributed as evenly as possible across the requested number of buckets.

### 🛠️ Practical $bucket & $bucketAuto Examples
\`\`\`javascript
// 1. $bucket: Group students into custom percentage divisions with a "Fail Students" fallback
db.students.aggregate([
  {
    $bucket: {
      groupBy: "$percentage",
      boundaries: [33, 45, 60, 80, 100],
      default: "Fail Students",
      output: {
        count: { $sum: 1 }
      }
    }
  }
])

// 2. $bucketAuto: Automatically partition students into 3 balanced percentage tiers
db.students.aggregate([
  {
    $bucketAuto: {
      groupBy: "$percentage",
      buckets: 3,
      output: {
        count: { $sum: 1 },
        average_percentage: { $avg: "$percentage" },
        total_percentage: { $sum: "$percentage" }
      }
    }
  }
])
\`\`\``
  },
  {
    topic_order: 20,
    slug: 'mongo-lecture-20-aggregation-addfields-unwind-cond-ifnull',
    title: 'Lecture 20: Transforming Fields & Arrays — $addFields, $unwind, $concat, $concatArrays, $ifNull, $cond & $$REMOVE',
    duration_minutes: 34,
    video_url: 'http://www.youtube.com/watch?v=xLdOjrX46Kw',
    video_title: 'MongoDB $addFields & $unwind Operator Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/addFields/',
    short_description: 'Append computed fields without dropping existing ones using $addFields, conditionally strip fields with $$REMOVE, $ifNull, and $cond, and deconstruct top-level or nested arrays with $unwind.',
    problemSelector: { topics: ['aggregation', 'projection'], keywords: ['unwind', 'addFields', 'array', 'tags', 'concat', 'sum', 'avg', 'null', 'cond'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
Unlike \`$project\` (which drops any field you do not explicitly list), **\`$addFields\`** preserves all existing fields in the document while adding new computed fields, overwriting existing fields, or conditionally removing unwanted fields via \`"$$REMOVE"\`. Meanwhile, **\`$unwind\`** deconstructs array fields into individual documents per array element.

### 💡 Key Operators & Expressions Covered
* **\`$addFields\`:** Appends new top-level fields or nested objects (e.g., \`"profile.age": 30\`) while keeping all original document properties intact.
* **\`$concat\`:** Concatenates an array of strings into a single string: \`{ $concat: ["$firstName", " ", "$lastName"] }\`.
* **\`"$$REMOVE"\`:** System variable that removes a field from the output document when assigned to it.
* **\`$ifNull\`:** Checks if a field is \`null\` or missing and substitutes a fallback value (or \`"$$REMOVE"\` to hide null fields completely): \`{ $ifNull: ["$city", "$$REMOVE"] }\`.
* **\`$cond\`:** Ternary conditional operator \`{ $cond: { if: <booleanExpr>, then: <trueVal>, else: <falseVal> } }\`.
* **\`$concatArrays\`:** Appends new elements to an existing array field inside an aggregation stage: \`{ $concatArrays: ["$marks", [70]] }\`.
* **\`$unwind\`:** Deconstructs an array field (top-level like \`"$sizes"\` or nested inside an object like \`"$items.tags"\`) so a document with 4 array elements outputs 4 separate documents.

### 🛠️ Practical $addFields & $unwind Pipelines
\`\`\`javascript
// 1. $addFields: Compute fullName, totalMarks, avgMarks, and hide firstName/lastName + null city
db.students.aggregate([
  {
    $addFields: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
      totalMarks: { $sum: "$marks" },
      averageMarks: { $avg: "$marks" },
      firstName: "$$REMOVE",
      lastName: "$$REMOVE",
      city: { $ifNull: ["$city", "$$REMOVE"] }
    }
  }
])

// 2. $addFields with $cond: Hide city field only when city equals "Delhi"
db.students.aggregate([
  {
    $addFields: {
      city: {
        $cond: {
          if: { $eq: ["$city", "Delhi"] },
          then: "$$REMOVE",
          else: "$city"
        }
      }
    }
  }
])

// 3. $addFields with $concatArrays: Append a 4th subject score (70) to student #1's marks array
db.students.aggregate([
  { $match: { _id: 1 } },
  {
    $addFields: {
      marks: { $concatArrays: ["$marks", [70]] }
    }
  }
])

// 4. $unwind on a top-level array ("$sizes") vs. a nested object array ("$items.tags")
db.inventory.aggregate([
  { $unwind: "$sizes" }
])

db.products.aggregate([
  { $unwind: "$items.tags" }
])
\`\`\``
  },
  {
    topic_order: 21,
    slug: 'mongo-lecture-21-aggregation-out-merge-unionwith',
    title: 'Lecture 21: Cross-Collection Pipeline Stages — $out, $merge & $unionWith',
    duration_minutes: 23,
    video_url: 'http://www.youtube.com/watch?v=jVw89Bh8zPE',
    video_title: 'MongoDB $out $merge & $unionWith Operator Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/',
    short_description: 'Materialize aggregation results into new collections using $out, incrementally merge or upsert pipeline outputs into existing collections with $merge, and combine multi-collection datasets on read with $unionWith.',
    problemSelector: { topics: ['aggregation'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
MongoDB provides three aggregation stages for working across multiple collections: **\`$out\`** (writes pipeline output into a brand-new or replaced collection), **\`$merge\`** (merges pipeline output into an existing collection without wiping non-matching data), and **\`$unionWith\`** (combines documents from two collections into a single read result set).

### 💡 Comparing \`$out\`, \`$merge\`, and \`$unionWith\`
* **\`$out: "<targetCollection>"\` (Terminal Stage):**
  * Creates a new collection containing the pipeline's output documents.
  * **Warning:** If \`<targetCollection>\` already exists, \`$out\` **completely replaces** its existing contents with the new pipeline output.
* **\`$merge: { into, on, whenMatched, whenNotMatched }\` (Terminal Stage):**
  * Writes pipeline results into an existing collection while preserving existing fields or non-matching documents:
  * **\`into\`:** Target collection name (e.g., \`"students"\`).
  * **\`on\`:** Unique matching key shared by both collections (e.g., \`"_id"\`).
  * **\`whenMatched\`:** Action when \`on\` matches: \`"merge"\` (combines new fields into existing document), \`"replace"\` (overwrites existing document), \`"keepExisting"\`, or \`"fail"\`.
  * **\`whenNotMatched\`:** Action when \`on\` does not match: \`"insert"\` (upserts as new document), \`"discard"\`, or \`"fail"\`.
* **\`$unionWith: { coll: "<otherCollection>" }\` (Read-Only Stage):**
  * Appends all documents from \`<otherCollection>\` directly into the current aggregation stream (similar to \`UNION ALL\` in SQL) without modifying any stored collection on disk.

### 🛠️ Practical $out, $merge & $unionWith Pipelines
\`\`\`javascript
// 1. $out: Group students by class and save the summary into a new "class_data" collection
db.students.aggregate([
  {
    $group: {
      _id: "$class",
      students: { $push: "$name" }
    }
  },
  { $out: "class_data" }
])

// 2. $merge: Merge "city" and "phone" from "personal" collection into "students" on "_id"
db.personal.aggregate([
  {
    $merge: {
      into: "students",
      on: "_id",
      whenMatched: "merge",
      whenNotMatched: "insert"
    }
  }
])

// 3. $unionWith: Combine current students ("students1") and alumni ("students2") in a single query
db.students1.aggregate([
  {
    $unionWith: {
      coll: "students2"
    }
  }
])
\`\`\``
  },
  {
    topic_order: 22,
    slug: 'mongo-lecture-22-aggregation-facet-and-fill',
    title: 'Lecture 22: Multi-Faceted Aggregations & Missing Data Imputation — $facet & $fill',
    duration_minutes: 31,
    video_url: 'http://www.youtube.com/watch?v=O3YTVz98XMw',
    video_title: 'MongoDB $facet & $fill Operator Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/',
    short_description: 'Execute multiple independent aggregation sub-pipelines in a single database query using $facet, and impute missing or null field values using $fill (constant value, locf, and linear interpolation).',
    problemSelector: { topics: ['aggregation'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
Dashboard APIs often need multiple analytics metrics from the same collection at once (e.g., top-selling products, total company revenue, and regional order counts). Instead of sending 3 separate database queries, **\`$facet\`** executes multiple independent sub-pipelines within a single \`aggregate()\` call. Additionally, **\`$fill\`** populates missing or \`null\` fields dynamically using constant values, prior records (\`locf\`), or linear interpolation (\`linear\`).

### 💡 Multi-Pipeline Analytics with \`$facet\`
* Syntax: \`{ $facet: { <outputField1>: [ stage1, stage2 ], <outputField2>: [ stage1, ... ] } }\`.
* Each key inside \`$facet\` runs its own independent array of pipeline stages on the same input documents and outputs its results as a dedicated array in a single combined response document.

### 💡 Imputing Missing / Null Values with \`$fill\`
* **Constant Value Fill:** \`output: { per: { value: 0 } }\` replaces any missing or \`null\` \`per\` field with \`0\`. (Note: specify either \`value\` OR \`method\`, never both together).
* **Last Observation Carried Forward (\`method: "locf"\`):** \`output: { per: { method: "locf" } }\` fills a missing value with the value from the immediately preceding document.
* **Linear Interpolation (\`method: "linear"\`):** Calculates the midpoint between the preceding document's value and the following document's value (e.g., between \`83\` and \`77\` -> fills \`80\`). **Requires \`sortBy\`** inside \`$fill\`.
* **\`partitionBy\` (Optional):** Partitions documents into independent groups (e.g., \`partitionBy: { class: "$class" }\`) before applying \`locf\` or \`linear\` filling.

### 🛠️ Practical $facet & $fill Examples
\`\`\`javascript
// 1. $facet: Compute Top 3 Products, Total Revenue, and Sales by Region in 1 query
db.sales.aggregate([
  {
    $facet: {
      topProducts: [
        {
          $group: {
            _id: "$product",
            totalSales: { $sum: { $multiply: ["$price", "$quantity"] } }
          }
        },
        { $sort: { totalSales: -1 } },
        { $limit: 3 }
      ],
      totalRevenue: [
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } }
          }
        }
      ],
      salesByRegion: [
        {
          $group: {
            _id: "$region",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]
    }
  }
])

// 2. $fill with a constant default value (0)
db.students.aggregate([
  {
    $fill: {
      output: {
        per: { value: 0 }
      }
    }
  }
])

// 3. $fill with linear interpolation partitioned by class and sorted by _id
db.students.aggregate([
  {
    $fill: {
      partitionBy: { class: "$class" },
      sortBy: { _id: 1 },
      output: {
        per: { method: "linear" }
      }
    }
  }
])
\`\`\``
  }
];

function cleanMarkdown(raw) {
  if (!raw) return '';
  let md = raw.replace(/>\s*🎥\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/>\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/\]*\]/gi, '');
  md = md.replace(/<\/?think>/gi, '');

  // Convert tables to bullet points
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
    if (t.startsWith('>')) {
      const withoutGt = t.replace(/^>+\s*/, '');
      if (!withoutGt) return '';
      if (withoutGt.startsWith('* ') || withoutGt.startsWith('- ')) {
        return withoutGt;
      }
      return '* ' + withoutGt;
    }
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

async function seedMongoDBBatch2() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding MongoDB Track Batch 2 (Lectures 12 to 22) ---');
    await client.query('BEGIN');

    // 1. Locate track
    const trackRes = await client.query(`
      SELECT id, slug, name, parent_track_id FROM tracks WHERE slug = 'mongodb-mastery' LIMIT 1;
    `);
    if (trackRes.rows.length === 0) {
      throw new Error("Track 'mongodb-mastery' not found in database.");
    }
    const trackId = trackRes.rows[0].id;
    console.log(`Target Track: [ID:${trackId}] ${trackRes.rows[0].name}`);

    // 2. Load catalog
    if (!fs.existsSync(CATALOG_PATH)) {
      throw new Error(`Catalog file not found at ${CATALOG_PATH}.`);
    }
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
    console.log(`Loaded ${catalog.length} questions from catalog.`);

    // 3. Query existing problems from Batch 1 (Lectures 1 to 11) to block duplicates
    const batch1Res = await client.query(`
      SELECT practice_problems
      FROM topics
      WHERE track_id = $1 AND topic_order <= 11;
    `, [trackId]);

    const usedProblemIds = new Set();
    const usedPatternKeys = new Set();

    for (const row of batch1Res.rows) {
      const probs = Array.isArray(row.practice_problems) ? row.practice_problems : [];
      for (const p of probs) {
        if (p.url) {
          const id = p.url.split('/').filter(Boolean).pop();
          usedProblemIds.add(id);
        }
        if (p.title) {
          usedPatternKeys.add(normalizePattern(p.title));
        }
      }
    }
    console.log(`Blocked ${usedProblemIds.size} problem IDs already assigned to Lectures 1 to 11.`);

    // 4. Smart Diversity Selector for Batch 2
    function selectCuratedProblems(lecture) {
      const count = lecture.problemSelector.count || 10;
      const order = lecture.topic_order;
      const picked = [];

      const matchesCriteria = (q) => {
        const titleLower = q.title.toLowerCase();
        const eq = (q.expectedQuery || '');
        const tags = (q.tags || []).map(t => t.toLowerCase());

        if (order === 12) {
          // Logical query operators ($and, $or, $nor, $not)
          return eq.includes('$or') || eq.includes('$and') || eq.includes('$nor') || eq.includes('$not') ||
                 tags.includes('$or') || tags.includes('$and') || tags.includes('$nor') || tags.includes('$not');
        } else if (order === 13) {
          // Element query operators ($exists, $type)
          return eq.includes('$exists') || eq.includes('$type') ||
                 tags.includes('$exists') || tags.includes('$type') ||
                 titleLower.includes('exists') || titleLower.includes('type') ||
                 titleLower.includes('null') || titleLower.includes('missing');
        } else if (order === 14) {
          // Evaluation query operators ($regex, $expr, $mod)
          return eq.includes('$regex') || eq.includes('$expr') || eq.includes('$mod') ||
                 tags.includes('$regex') || titleLower.includes('containing') ||
                 titleLower.includes('matching') || titleLower.includes('regex');
        } else if (order === 15) {
          // Atomic find and modify (challenging find, medium/hard filters)
          return tags.includes('find') && (q.difficulty === 'Medium' || q.difficulty === 'Hard');
        } else if (order === 16) {
          // Aggregation Pipeline ($match, $sort, $project, $limit, $skip, $count)
          return eq.includes('.aggregate') || tags.includes('aggregate') ||
                 tags.includes('$match') || tags.includes('$project') ||
                 tags.includes('$sort') || tags.includes('$limit') || tags.includes('$skip');
        } else if (order === 17) {
          // Aggregation $group & Accumulators ($sum, $avg, $min, $max)
          return eq.includes('$group') || eq.includes('$sum') || eq.includes('$avg') ||
                 tags.includes('$group') || tags.includes('$sum') || tags.includes('$avg') ||
                 titleLower.includes('group') || titleLower.includes('sum') || titleLower.includes('average');
        } else if (order === 18) {
          // Joining collections ($lookup, $unwind, orders, customers)
          return titleLower.includes('order') || titleLower.includes('customer') ||
                 eq.includes('customer') || eq.includes('order') ||
                 tags.includes('$unwind') || titleLower.includes('unwind');
        } else if (order === 19) {
          // Range bucketing ($bucket, price/quantity ranges)
          return eq.includes('price') || eq.includes('quantity') ||
                 titleLower.includes('price') || titleLower.includes('quantity') ||
                 titleLower.includes('between') || tags.includes('comparison');
        } else if (order === 20) {
          // Transforming fields & arrays ($addFields, $concat, arrays)
          return eq.includes('$concat') || tags.includes('array') ||
                 tags.includes('$size') || tags.includes('$all') ||
                 titleLower.includes('tag') || titleLower.includes('item');
        } else if (order === 21) {
          // Cross-collection / Pipelines ($out, $merge, multi-collection datasets)
          return tags.includes('aggregate') || eq.includes('.aggregate') ||
                 titleLower.includes('department') || titleLower.includes('all');
        } else if (order === 22) {
          // Multi-faceted aggregations & analytics
          return tags.includes('aggregate') || tags.includes('find');
        }

        return true;
      };

      // Pass 1: Strict criteria + unique pattern
      for (const q of catalog) {
        if (usedProblemIds.has(q._id)) continue;
        const pat = normalizePattern(q.title);
        if (usedPatternKeys.has(pat)) continue;

        if (matchesCriteria(q)) {
          picked.push(q);
          usedProblemIds.add(q._id);
          usedPatternKeys.add(pat);
          if (picked.length >= count) break;
        }
      }

      // Pass 2: Strict criteria, allow duplicate patterns if needed
      if (picked.length < count) {
        for (const q of catalog) {
          if (usedProblemIds.has(q._id)) continue;
          if (matchesCriteria(q)) {
            picked.push(q);
            usedProblemIds.add(q._id);
            if (picked.length >= count) break;
          }
        }
      }

      // Pass 3: Unused question fallback
      if (picked.length < count) {
        for (const q of catalog) {
          if (usedProblemIds.has(q._id)) continue;
          const pat = normalizePattern(q.title);
          if (!usedPatternKeys.has(pat)) {
            picked.push(q);
            usedProblemIds.add(q._id);
            usedPatternKeys.add(pat);
            if (picked.length >= count) break;
          }
        }
      }

      // Pass 4: Any unused question
      if (picked.length < count) {
        for (const q of catalog) {
          if (usedProblemIds.has(q._id)) continue;
          picked.push(q);
          usedProblemIds.add(q._id);
          if (picked.length >= count) break;
        }
      }

      return picked.slice(0, count).map((q, idx) => ({
        id: `mongo-${order}-prob-${idx + 1}`,
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

    // 5. Upsert Lectures 12 to 22
    for (const lec of batch2Lectures) {
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

      // Ensure track_topics mapping (clean any order collision first)
      await client.query(`
        DELETE FROM track_topics WHERE track_id = $1 AND topic_order = $2;
      `, [trackId, lec.topic_order]);

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
    console.log('--- MongoDB Batch 2 Seeded Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Batch 2 seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedMongoDBBatch2();
