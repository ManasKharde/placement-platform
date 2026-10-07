const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const CATALOG_PATH = path.resolve(__dirname, 'mongopractice_catalog.json');

const batch3Lectures = [
  {
    topic_order: 23,
    slug: 'mongo-lecture-23-arithmetic-aggregation-operators',
    title: 'Lecture 23: Arithmetic Aggregation Operators — $add, $subtract, $multiply, $divide, $mod, $pow, $sqrt, $abs, $ceil, $floor, $round & $trunc',
    duration_minutes: 20,
    video_url: 'http://www.youtube.com/watch?v=RMKf2AS9r34',
    video_title: 'MongoDB Arithmetic Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/#arithmetic-expression-operators',
    short_description: 'Perform mathematical calculations and decimal rounding inside $project and $addFields stages using $add, $subtract, $multiply, $divide, $mod, $pow, $sqrt, $abs, $ceil, $floor, $round, and $trunc.',
    problemSelector: { topics: ['aggregation', 'projection'], keywords: ['multiply', 'add', 'subtract', 'divide', 'round', 'total', 'price', 'discount', 'math', 'sum'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
MongoDB **Arithmetic Expression Operators** perform mathematical computations on numeric fields (or static numbers) inside aggregation stages such as \`$project\`, \`$addFields\`, and \`$group\`.

### 💡 Core Arithmetic & Exponential Operators
* **\`$add: [ <num1>, <num2>, ... ]\`:** Adds two or more numbers (or field references like \`["$price", "$quantity"]\`) together.
* **\`$subtract: [ <num1>, <num2> ]\`:** Subtracts the second value from the first value (\`num1 - num2\`).
* **\`$multiply: [ <num1>, <num2>, ... ]\`:** Multiplies two or more numbers together (e.g., computing order line-item totals via \`["$price", "$quantity"]\`).
* **\`$divide: [ <dividend>, <divisor> ]\`:** Divides the first number by the second number and returns the floating-point quotient.
* **\`$mod: [ <dividend>, <divisor> ]\`:** Divides the first number by the second number and returns the **remainder** (e.g., \`[10, 3]\` returns \`1\`).
* **\`$pow: [ <base>, <exponent> ]\`:** Raises \`<base>\` to the power of \`<exponent>\` (e.g., \`[2, 3]\` -> \`2 * 2 * 2 = 8\`).
* **\`$sqrt: <number>\`:** Calculates the square root of a non-negative number (e.g., \`{ $sqrt: 16 }\` -> \`4\`).

### 💡 Sign & Decimal Rounding Operators
* **\`$abs: <number>\`:** Returns the unsigned absolute value of a number (e.g., \`-9.2\` -> \`9.2\`).
* **\`$ceil: <number>\`:** Rounds a decimal number **up** to the smallest integer greater than or equal to the value (e.g., \`9.2\` -> \`10\`, \`9.8\` -> \`10\`).
* **\`$floor: <number>\`:** Rounds a decimal number **down** to the largest integer less than or equal to the value (e.g., \`9.8\` -> \`9\`, \`9.2\` -> \`9\`).
* **\`$round: <number>\`:** Rounds to the nearest integer (\`.5\` and above rounds up like \`$ceil\`; below \`.5\` rounds down like \`$floor\`).
* **\`$trunc: <number>\`:** Truncates (strips) the fractional decimal digits without rounding (e.g., \`4.8\` -> \`4\`, \`4.2\` -> \`4\`).

### 🛠️ Practical Arithmetic Pipeline Examples
\`\`\`javascript
// 1. Compute sum, difference, and total cost ($multiply) on sales documents
db.sales.aggregate([
  {
    $project: {
      product: 1,
      price: 1,
      quantity: 1,
      sumResult: { $add: ["$price", "$quantity"] },
      diffResult: { $subtract: ["$price", "$quantity"] },
      totalCost: { $multiply: ["$price", "$quantity"] }
    }
  }
])

// 2. Division, Modulo, Power, and Square Root
db.sales.aggregate([
  {
    $project: {
      quotient: { $divide: [10, 2] },   // 5
      remainder: { $mod: [10, 3] },     // 1
      cubed: { $pow: [2, 3] },          // 8
      root16: { $sqrt: 16 }             // 4
    }
  }
])

// 3. Decimal Rounding & Sign Handling ($abs, $ceil, $floor, $round, $trunc)
db.sales.aggregate([
  {
    $project: {
      absoluteVal: { $abs: -9.2 },      // 9.2
      ceilingVal: { $ceil: 9.2 },       // 10
      floorVal: { $floor: 9.8 },        // 9
      roundedUp: { $round: 9.8 },       // 10
      roundedDown: { $round: 9.3 },     // 9
      truncatedVal: { $trunc: 4.8 }     // 4
    }
  }
])
\`\`\``
  },
  {
    topic_order: 24,
    slug: 'mongo-lecture-24-string-aggregation-operators',
    title: 'Lecture 24: String Aggregation Operators — $concat, $split, $toUpper, $toLower, $strLenCP, $substrCP, $trim, $replaceAll & $regexFindAll',
    duration_minutes: 50,
    video_url: 'http://www.youtube.com/watch?v=r4xAUGR7m3s',
    video_title: 'MongoDB String Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/#string-expression-operators',
    short_description: 'Transform, measure, slice, trim, replace, and regex-search text fields in aggregation pipelines using MongoDB string operators.',
    problemSelector: { topics: ['aggregation', 'projection'], keywords: ['string', 'concat', 'upper', 'lower', 'length', 'split', 'trim', 'substr', 'replace', 'name'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
MongoDB provides a comprehensive suite of **String Aggregation Operators** to format text, normalize casing, extract substrings, strip whitespace, replace tokens, and run regex extractions inside \`$project\` and \`$addFields\`.

### 💡 Case, Length, Concatenation & Splitting Operators
* **\`$toString: <expr>\`:** Converts a numeric, boolean, or date value into a string.
* **\`$toUpper: <str>\` & \`$toLower: <str>\`:** Converts a string to all uppercase or all lowercase characters.
* **\`$strLenBytes: <str>\` & \`$strLenCP: <str>\`:** Returns the length of a string in UTF-8 bytes (\`$strLenBytes\`) or Unicode code points/characters (\`$strLenCP\`).
* **\`$strcasecmp: [<str1>, <str2>]\`:** Performs a case-insensitive comparison of two strings (returns \`0\` if equal, \`1\` if first is greater, \`-1\` if smaller).
* **\`$concat: [<str1>, <str2>, ...]\`:** Joins multiple strings into one combined string.
* **\`$split: [<str>, <delimiter>]\`:** Splits a string around \`<delimiter>\` (such as \`" "\` or \`"-"\`) and returns an array of substrings.

### 💡 Substring, Trimming, Replacement & Regex Operators
* **\`$substrBytes\` & \`$substrCP: [<str>, <startIndex>, <count>]\`:** Extracts \`<count>\` characters starting from 0-based \`<startIndex>\` (replaces deprecated \`$substr\`).
* **\`$trim\`, \`$ltrim\`, \`$rtrim\`:** Removes leading/trailing whitespace (or specified \`chars\`) from both sides (\`$trim\`), left side only (\`$ltrim\`), or right side only (\`$rtrim\`) via \`{ input: "$name", chars: "..." }\`.
* **\`$replaceOne\` & \`$replaceAll\`:** Replaces the first occurrence (\`$replaceOne\`) or every occurrence (\`$replaceAll\`) of a substring via \`{ input: "$name", find: "old", replacement: "new" }\`.
* **\`$indexOfBytes\` & \`$indexOfCP\`:** Returns the 0-based index of the first occurrence of a substring (or \`-1\` if not found).
* **\`$regexMatch\`, \`$regexFind\`, \`$regexFindAll\`:** Evaluates a regular expression inside an aggregation stage:
  * \`$regexMatch\` returns \`true\` or \`false\`.
  * \`$regexFind\` returns an object \`{ match, idx, captures }\` for the **first** match.
  * \`$regexFindAll\` returns an array of match objects for **all** occurrences in the string.

### 🛠️ Practical String Operator Pipeline Examples
\`\`\`javascript
// 1. Casing, Character Length, Concatenation, and Splitting
db.students.aggregate([
  {
    $project: {
      upperName: { $toUpper: "$name" },
      lowerName: { $toLower: "$name" },
      nameLength: { $strLenCP: "$name" },
      fullLabel: { $concat: ["$name", " - ", "$class"] },
      nameParts: { $split: ["$name", " "] }
    }
  }
])

// 2. Substring Extraction, Trimming, and Substring Replacement
db.students.aggregate([
  {
    $project: {
      firstThreeChars: { $substrCP: ["$name", 0, 3] },
      cleanedName: { $trim: { input: "$name" } },
      updatedName: {
        $replaceAll: {
          input: "$name",
          find: "Kumar",
          replacement: "Singh"
        }
      }
    }
  }
])

// 3. Regex Pattern Extraction with $regexFindAll
db.students.aggregate([
  {
    $project: {
      name: 1,
      matches: {
        $regexFindAll: {
          input: "$name",
          regex: /K/
        }
      }
    }
  }
])
\`\`\``
  },
  {
    topic_order: 25,
    slug: 'mongo-lecture-25-date-aggregation-operators',
    title: 'Lecture 25: Date Aggregation Operators — $year, $month, $dayOfMonth, $dateAdd, $dateSubtract, $dateDiff, $dateFromParts & $dateToString',
    duration_minutes: 38,
    video_url: 'http://www.youtube.com/watch?v=bKIFrtpwAws',
    video_title: 'MongoDB Date Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/#date-expression-operators',
    short_description: 'Extract date components, add or subtract time intervals, compute date differences, construct dates with timezones, and format human-readable date strings with $dateToString.',
    problemSelector: { topics: ['aggregation', 'find'], keywords: ['date', 'year', 'month', 'day', 'time', 'hour', 'created', 'order', 'after', 'before'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
When dates are stored properly in MongoDB's native **\`ISODate\`** format, **Date Aggregation Operators** let you extract calendar components, perform date arithmetic, calculate elapsed time between dates, and format human-readable date strings for frontend UIs.

### 💡 Date Component Extraction Operators
* **Calendar Parts:** **\`$year\`**, **\`$month\`** (1–12), **\`$week\`** (0–53), **\`$dayOfMonth\`** (1–31), **\`$dayOfWeek\`** (1=Sunday to 7=Saturday), **\`$dayOfYear\`** (1–366).
* **ISO 8601 Calendar Parts (Monday = Day 1):** **\`$isoDayOfWeek\`** (1=Monday to 7=Sunday), **\`$isoWeek\`**, **\`$isoWeekYear\`**.
* **Time Parts:** **\`$hour\`** (0–23), **\`$minute\`** (0–59), **\`$second\`** (0–59), **\`$millisecond\`** (0–999).

### 💡 Date Math, Construction & Formatting Operators
* **\`$dateAdd\` & \`$dateSubtract\`:** Adds or subtracts a time interval from a date:
  \`{ startDate: "$dob", unit: "day" | "month" | "year" | "hour", amount: 5 }\`.
* **\`$dateDiff\`:** Computes the difference between two dates in the specified \`unit\`:
  \`{ startDate: "$dob", endDate: ISODate("2025-12-31T00:00:00Z"), unit: "year" | "day" }\`.
* **\`$dateFromParts\` & \`$dateToParts\`:** Constructs an \`ISODate\` from numeric \`{ year, month, day, hour, minute, timezone }\` parts, or decomposes an \`ISODate\` into an object containing all its individual parts.
* **\`$dateTrunc\`:** Truncates a date down to the first day/instant of the specified \`unit\` (e.g., \`unit: "month"\` resets \`15 Jan 2008\` to \`01 Jan 2008\`).
* **\`$dateToString\`:** Formats an \`ISODate\` into a readable custom string using format specifiers (\`%d\` = 2-digit day, \`%b\` = abbreviated month name like \`Jan\`, \`%m\` = 2-digit month, \`%Y\` = 4-digit year):
  \`{ date: "$dob", format: "%d-%b-%Y" }\` -> \`"15-Jan-2008"\`.
* **\`$toDate\` & \`$dateFromString\`:** Converts a date string (like \`"20 March 2018"\`) or Unix millisecond timestamp into a native \`ISODate\`.

### 🛠️ Practical Date Operator Pipeline Examples
\`\`\`javascript
// 1. Extract Year, Month, Day, Hour, Minute, and format with $dateToString
db.students.aggregate([
  {
    $project: {
      name: 1,
      birthYear: { $year: "$dob" },
      birthMonth: { $month: "$dob" },
      dayOfMonth: { $dayOfMonth: "$dob" },
      dayOfWeek: { $dayOfWeek: "$dob" },
      isoWeekday: { $isoDayOfWeek: "$dob" },
      formattedDOB: {
        $dateToString: {
          date: "$dob",
          format: "%d-%b-%Y"
        }
      }
    }
  }
])

// 2. Date Arithmetic: $dateAdd, $dateSubtract, and $dateDiff
db.students.aggregate([
  {
    $project: {
      name: 1,
      plusFiveDays: {
        $dateAdd: { startDate: "$dob", unit: "day", amount: 5 }
      },
      minusOneMonth: {
        $dateSubtract: { startDate: "$dob", unit: "month", amount: 1 }
      },
      ageInYears2025: {
        $dateDiff: {
          startDate: "$dob",
          endDate: ISODate("2025-12-31T00:00:00Z"),
          unit: "year"
        }
      }
    }
  }
])

// 3. Construct Date with Timezone ($dateFromParts) & Deconstruct ($dateToParts)
db.students.aggregate([
  {
    $project: {
      constructedDate: {
        $dateFromParts: {
          year: 2025,
          month: 1,
          day: 7,
          hour: 15,
          minute: 45,
          timezone: "Europe/London"
        }
      },
      dobParts: {
        $dateToParts: { date: "$dob", timezone: "UTC" }
      }
    }
  }
])
\`\`\``
  },
  {
    topic_order: 26,
    slug: 'mongo-lecture-26-array-aggregation-operators',
    title: 'Lecture 26: Array Aggregation Operators — $arrayElemAt, $firstN/$lastN, $maxN/$minN, $slice, $sortArray, $reverseArray, $size, $in, $filter, $map & $objectToArray',
    duration_minutes: 54,
    video_url: 'http://www.youtube.com/watch?v=ZR8P6-gCfME',
    video_title: 'MongoDB Array Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/#array-expression-operators',
    short_description: 'Index, slice, sort, reverse, search, filter, map, and convert arrays in MongoDB aggregation pipelines using native array expression operators.',
    problemSelector: { topics: ['aggregation', 'find'], keywords: ['array', 'size', 'slice', 'element', 'first', 'last', 'filter', 'tags', 'skills', 'items'], count: 12 },
    summary_markdown: `### 📌 Topic Overview
MongoDB's **Array Aggregation Operators** let you inspect, slice, sort, filter, transform, and convert array fields inside \`$project\` and \`$addFields\` without needing to \`$unwind\` the array first.

### 💡 Element Access, Slicing & Ordering Operators
* **\`$arrayElemAt: [<array>, <index>]\`:** Returns the element at 0-based \`<index>\` (negative indices count backward from the end, e.g., \`-1\` is the last element).
* **\`$firstN\` & \`$lastN: { input: <array>, n: <count> }\`:** Returns the first \`n\` or last \`n\` elements of an array.
* **\`$maxN\` & \`$minN: { input: <array>, n: <count> }\`:** Returns the \`n\` largest or \`n\` smallest values from a numeric array.
* **\`$slice: [<array>, <position>, <n>]\`:** Extracts a subset of \`n\` elements from \`<array>\` starting at \`<position>\`.
* **\`$sortArray: { input: <array>, sortBy: 1 | -1 | { field: 1 } }\`:** Sorts an array of primitives or sub-documents in ascending (\`1\`) or descending (\`-1\`) order.
* **\`$reverseArray: <array>\`:** Reverses the order of elements in an array.

### 💡 Array Inspection, Transformation & Conversion Operators
* **\`$size: <array>\`:** Returns the total number of elements in an array.
* **\`$isArray: <field>\`:** Returns \`true\` if the operand is an array, or \`false\` otherwise.
* **\`$in: [<value>, <array>]\`:** Returns \`true\` if \`<value>\` exists inside \`<array>\`, or \`false\` otherwise.
* **\`$indexOfArray: [<array>, <searchValue>]\`:** Returns the 0-based index of \`<searchValue>\` in \`<array>\` (or \`-1\` if not found).
* **\`$concatArrays: [<array1>, <array2>]\`:** Concatenates two or more arrays into a single array.
* **\`$filter: { input: <array>, as: "<var>", cond: <expr> }\`:** Filters array elements matching boolean \`cond\` (referencing each element via \`"$$<var>"\`).
* **\`$map: { input: <array>, as: "<var>", in: <expr> }\`:** Applies an expression to every element in an array and returns the transformed array.
* **\`$reduce: { input: <array>, initialValue: <val>, in: <expr> }\`:** Reduces an array to a single accumulated scalar value using \`$$value\` and \`$$this\`.
* **\`$zip\` & \`$range\`:** \`$zip\` transposes parallel arrays together by index; \`$range: [<start>, <end>, <step>]\` generates a sequence of integers.
* **\`$objectToArray\` & \`$arrayToObject\`:** Converts a key-value object \`{ name: "Ram", age: 25 }\` into an array of \`[ { k: "name", v: "Ram" }, { k: "age", v: 25 } ]\` pairs (and vice versa).

### 🛠️ Practical Array Operator Pipeline Examples
\`\`\`javascript
// 1. Indexing, Slicing, Sorting, Reversing, and Sizing Arrays
db.students.aggregate([
  {
    $project: {
      name: 1,
      secondSkill: { $arrayElemAt: ["$skills", 1] },
      firstTwoSkills: { $firstN: { input: "$skills", n: 2 } },
      topTwoMarks: { $maxN: { input: "$marks", n: 2 } },
      slicedSkills: { $slice: ["$skills", 1, 2] },
      sortedMarks: { $sortArray: { input: "$marks", sortBy: 1 } },
      reversedSkills: { $reverseArray: "$skills" },
      totalSkillsCount: { $size: "$skills" }
    }
  }
])

// 2. Searching ($in, $indexOfArray), Filtering ($filter), and Mapping ($map)
db.students.aggregate([
  {
    $project: {
      name: 1,
      knowsPython: { $in: ["Python", "$skills"] },
      pythonIndex: { $indexOfArray: ["$skills", "Python"] },
      highMarks: {
        $filter: {
          input: "$marks",
          as: "m",
          cond: { $gte: ["$$m", 60] }
        }
      },
      bonusMarks: {
        $map: {
          input: "$marks",
          as: "m",
          in: { $add: ["$$m", 5] }
        }
      }
    }
  }
])

// 3. Converting an Embedded Object into [{ k, v }] Array with $objectToArray
db.personal.aggregate([
  {
    $project: {
      addressArray: { $objectToArray: "$address" }
    }
  }
])
\`\`\``
  },
  {
    topic_order: 27,
    slug: 'mongo-lecture-27-type-conversion-operators-convert-type-isnumber',
    title: 'Lecture 27: Type Conversion & Inspection Operators — $toString, $toInt, $toLong, $toDouble, $toDecimal, $toBool, $toObjectId, $convert, $type & $isNumber',
    duration_minutes: 25,
    video_url: 'http://www.youtube.com/watch?v=rQXuHD4wWcg',
    video_title: 'MongoDB Type Operators Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/convert/',
    short_description: 'Cast field values between BSON types on the fly using $toString, $toInt, $toLong, $toDouble, $toDecimal, $toBool, $toObjectId, and $convert, and inspect types with $type and $isNumber.',
    problemSelector: { topics: ['aggregation', 'projection'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
When unvalidated data is imported into MongoDB (for example, numeric ages stored as quoted strings \`"22"\`), mathematical operators fail unless you cast the values first. **Type Aggregation Operators** convert values across BSON types and inspect field types inside aggregation pipelines.

### 💡 Shorthand Type Casting Operators (\`$to*\`)
* **\`$toString: <expr>\`:** Converts numbers, booleans, or \`ISODate\` values into strings.
* **\`$toInt: <expr>\`:** Converts a numeric string (\`"22"\`), boolean (\`true\` -> \`1\`, \`false\` -> \`0\`), or floating-point double (\`33.58\` -> \`33\`, truncating decimals) into a **32-bit Integer**.
* **\`$toLong: <expr>\`:** Converts a value into a **64-bit Integer (\`Long\`)**.
* **\`$toDouble: <expr>\`:** Converts a value into a **64-bit Floating-Point \`Double\`**.
* **\`$toDecimal: <expr>\`:** Converts a value into a high-precision **128-bit \`Decimal128\`** (ideal for financial/currency calculations). Converts \`ISODate\` to Unix epoch milliseconds.
* **\`$toBool: <expr>\`:** Converts a value to Boolean (\`0\` -> \`false\`; any non-zero number, non-empty string, or date -> \`true\`; \`null\` -> \`null\`).
* **\`$toObjectId: <24-hex-char-string>\`:** Converts a 24-character hexadecimal string into a native MongoDB \`ObjectId\`.

### 💡 Universal Conversion & Type Inspection Operators
* **\`$convert: { input: <expr>, to: "<bsonType>" }\`:** Universal conversion operator that can replace any \`$to*\` operator (supports \`"int"\`, \`"long"\`, \`"double"\`, \`"decimal"\`, \`"string"\`, \`"bool"\`, \`"date"\`, \`"objectId"\`).
* **\`$type: <field>\`:** Returns the BSON data type name of the field as a string (e.g., \`"string"\`, \`"int"\`, \`"double"\`, \`"date"\`, \`"bool"\`).
* **\`$isNumber: <field>\`:** Returns \`true\` if the field is any numeric BSON type (\`int\`, \`long\`, \`double\`, \`decimal\`), or \`false\` otherwise.

### 🛠️ Practical Type Conversion & Inspection Examples
\`\`\`javascript
// 1. Shorthand Type Conversions ($toInt, $toDouble, $toDecimal, $toBool, $toString)
db.students.aggregate([
  {
    $project: {
      name: 1,
      intAge: { $toInt: "$age" },               // "22" -> 22
      longAge: { $toLong: "$age" },             // "22" -> Long("22")
      doubleMarks: { $toDouble: "$marks" },     // 64-bit float
      decimalMarks: { $toDecimal: "$marks" },   // 128-bit Decimal128
      boolMarks: { $toBool: "$marks" },         // Non-zero -> true
      stringDOB: { $toString: "$dob" },         // ISODate -> ISO string
      convertedObjId: {
        $toObjectId: "6712a8f9c0ffee1234567890"
      }
    }
  }
])

// 2. Universal $convert + Type Inspection ($type and $isNumber)
db.students.aggregate([
  {
    $project: {
      name: 1,
      convertedAge: {
        $convert: {
          input: "$age",
          to: "int"
        }
      },
      ageFieldType: { $type: "$age" },          // e.g. "string"
      marksFieldType: { $type: "$marks" },      // e.g. "int" or "double"
      isMarksNumeric: { $isNumber: "$marks" },  // true
      isDobNumeric: { $isNumber: "$dob" }       // false
    }
  }
])
\`\`\``
  },
  {
    topic_order: 28,
    slug: 'mongo-lecture-28-conditional-aggregation-operators-cond-ifnull-switch',
    title: 'Lecture 28: Conditional Aggregation Operators — $cond, $ifNull & Multi-Branch $switch',
    duration_minutes: 23,
    video_url: 'http://www.youtube.com/watch?v=EOE8FNRC6gU',
    video_title: 'MongoDb Conditional Operators Tutorial in Hindi Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/#conditional-expression-operators',
    short_description: 'Build dynamic decision logic, discount calculations, null fallbacks, and multi-tier grading systems inside aggregation pipelines using $cond, $ifNull, and $switch.',
    problemSelector: { topics: ['aggregation', 'projection'], count: 10 },
    summary_markdown: `### 📌 Topic Overview
MongoDB provides three **Conditional Aggregation Operators** to evaluate branching logic inside \`$project\` and \`$addFields\`:
* **\`$cond\`** for single \`if / then / else\` conditions.
* **\`$ifNull\`** for substituting missing or \`null\` fields with fallback values.
* **\`$switch\`** for multi-branch \`case / then / default\` grading or tiering logic.

### 💡 Detailed Breakdown of All 3 Conditional Operators
* **\`$cond: { if: <booleanExpr>, then: <trueValue>, else: <falseValue> }\`:**
  * Evaluates \`if\`. When \`true\`, returns \`then\`; when \`false\`, returns \`else\`.
  * Can also take a boolean field directly (e.g., \`if: "$discounted"\`) and perform math inside \`then\` (such as applying a 10% discount via \`{ $multiply: ["$price", 0.9] }\`).
* **\`$ifNull: [ <fieldExpr>, <replacementValueIfNull> ]\`:**
  * Evaluates \`<fieldExpr>\`. If the field exists and is not \`null\`, returns its value. If the field is \`null\` or completely missing from the document, returns \`<replacementValueIfNull>\` (e.g., \`"No Email"\`).
* **\`$switch: { branches: [ { case: <expr1>, then: <val1> }, ... ], default: <fallbackVal> }\`:**
  * Evaluates an ordered array of \`branches\`. Returns the \`then\` value of the **first** branch whose \`case\` evaluates to \`true\`. If no branch matches, returns \`default\`.

### 🛠️ Practical $cond, $ifNull & $switch Examples
\`\`\`javascript
// 1. $cond: Categorize products & compute 10% discounted Final Price
db.products.aggregate([
  {
    $project: {
      name: 1,
      originalPrice: "$price",
      priceCategory: {
        $cond: {
          if: { $gt: ["$price", 1000] },
          then: "Expensive",
          else: "Affordable"
        }
      },
      finalPrice: {
        $cond: {
          if: "$discounted",
          then: { $multiply: ["$price", 0.9] },
          else: "$price"
        }
      }
    }
  }
])

// 2. $ifNull: Provide "No Email" fallback when email is null or missing
db.users.aggregate([
  {
    $project: {
      name: 1,
      email: { $ifNull: ["$email", "No Email"] }
    }
  }
])

// 3. $switch: Multi-tier student division grading based on percentage
db.students.aggregate([
  {
    $project: {
      name: 1,
      percentage: 1,
      grade: {
        $switch: {
          branches: [
            { case: { $gte: ["$percentage", 80] }, then: "Merit" },
            { case: { $gte: ["$percentage", 60] }, then: "First Division" },
            { case: { $gte: ["$percentage", 45] }, then: "Second Division" },
            { case: { $gte: ["$percentage", 33] }, then: "Third Division" }
          ],
          default: "Fail"
        }
      }
    }
  }
])
\`\`\``
  },
  {
    topic_order: 29,
    slug: 'mongo-lecture-29-capped-collections-circular-buffers-collmod',
    title: 'Lecture 29: Capped Collections — Fixed-Size Circular Buffers (capped, size, max), $natural Sort, isCapped() & collMod',
    duration_minutes: 23,
    video_url: 'http://www.youtube.com/watch?v=1WOIh7Apf5A',
    video_title: 'MongoDb Capped Collection Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/core/capped-collections/',
    short_description: 'Create and manage fixed-capacity Capped Collections for high-throughput logs and telemetry streams, query in insertion order with $natural, and resize limits via collMod.',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
A **Capped Collection** is a fixed-size circular collection in MongoDB that automatically overwrites its **oldest documents** (FIFO — First-In, First-Out) once it reaches its allocated byte \`size\` or maximum document count (\`max\`), making it ideal for application logs, IoT sensor streams, and audit trails.

### 💡 Core Mechanics of Capped Collections
* **Dual Capacity Limits (\`size\` and \`max\`):**
  * **\`capped: true\`:** Enables circular buffer behavior on the collection.
  * **\`size: <bytes>\` (Mandatory):** Maximum storage size in bytes (e.g., \`51200\` bytes = \`50 KB\`, since \`1 KB = 1024 bytes\`).
  * **\`max: <count>\` (Optional):** Maximum number of documents allowed (e.g., \`max: 5\`). Whichever limit (\`size\` or \`max\`) is reached first triggers automatic eviction of the oldest document on the next insert.
* **Insertion-Order Retrieval (\`$natural\`):** Capped collections guarantee insertion order on disk. Use \`.sort({ $natural: -1 })\` to retrieve the most recently inserted logs first, or \`.sort({ $natural: 1 })\` (default) for oldest first.
* **Checking Capped Status (\`isCapped()\`):** \`db.<collection>.isCapped()\` returns \`true\` if the collection is capped, or \`false\` otherwise.
* **Converting an Existing Collection (\`convertToCapped\`):** \`db.runCommand({ convertToCapped: "<collection>", size: <bytes> })\` converts a standard collection into a capped collection (note: \`max\` cannot be enforced via \`convertToCapped\`; only byte \`size\` applies).
* **Updating Capped Limits (\`collMod\`):** Use \`db.runCommand({ collMod: "<collection>", cappedMax: <newMax>, cappedSize: <newBytes> })\` to resize an existing capped collection on the fly.

### 🛠️ Practical Capped Collection Commands
\`\`\`javascript
// 1. Create a Capped Collection "log" limited to 50 KB (51,200 bytes) and max 5 documents
db.createCollection("log", {
  capped: true,
  size: 51200,
  max: 5
})

// 2. Verify whether collections are capped
db.log.isCapped()       // true
db.students.isCapped()  // false

// 3. Query logs from newest to oldest using $natural: -1
db.log.find().sort({ $natural: -1 })

// 4. Convert an existing standard collection into a Capped Collection (size in bytes)
db.runCommand({
  convertToCapped: "students",
  size: 51200
})

// 5. Modify max documents or byte size on an existing Capped Collection via collMod
db.runCommand({
  collMod: "log",
  cappedMax: 7
})

db.runCommand({
  collMod: "log",
  cappedSize: 100000
})
\`\`\``
  },
  {
    topic_order: 30,
    slug: 'mongo-lecture-30-indexes-explain-executionstats-compound-unique-text-wildcard',
    title: 'Lecture 30: Indexing & Query Optimization — COLLSCAN vs. IXSCAN, explain("executionStats"), Single, Compound, Unique, Text & Wildcard Indexes',
    duration_minutes: 35,
    video_url: 'http://www.youtube.com/watch?v=eax7V8RKjkE',
    video_title: 'MongoDB Indexes Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/indexes/',
    short_description: 'Eliminate slow collection scans (COLLSCAN) using B-Tree indexes (IXSCAN), analyze query plans with explain("executionStats"), and master Single-Field, Compound, Unique, Text, Wildcard ($**), and Multikey Array indexes.',
    problemSelector: { topics: ['indexes'], count: 12 },
    summary_markdown: `### 📌 Topic Overview
Without an index, MongoDB must perform a **Collection Scan (\`COLLSCAN\`)**, inspecting every single document in the collection to find matches. Creating an **Index** builds an in-memory B-Tree lookup structure so MongoDB jumps directly to matching records via an **Index Scan (\`IXSCAN\` / \`EXPRESS_IXSCAN\`)**.

### 💡 Analyzing Query Performance & Managing Indexes
* **\`.explain("executionStats")\`:** Appended to any \`find()\` query to inspect the query planner stage (\`COLLSCAN\` vs. \`IXSCAN\`), \`totalDocsExamined\`, and execution time in milliseconds.
* **\`db.<collection>.createIndex({ <field>: 1 | -1 }, <options>)\`:** Creates an ascending (\`1\`) or descending (\`-1\`) index.
* **\`db.<collection>.getIndexes()\`:** Lists all active indexes on the collection (note that \`_id_1\` is created automatically by MongoDB on every collection).
* **\`db.<collection>.dropIndex("<index_name>")\`:** Deletes a specific index by its name (e.g., \`"name_-1"\`).

### 💡 Complete Index Types Covered
* **1. Single-Field Index:** Indexes a single frequently queried field: \`createIndex({ name: -1 })\`.
* **2. Compound Index:** Indexes multiple fields together in a specific sort order: \`createIndex({ class: 1, age: -1 })\`. Accelerates queries filtering on \`class\` and sorting by \`age\`.
* **3. Unique Index:** Enforces uniqueness across a field so duplicate values (such as duplicate \`email\` addresses) are rejected with \`E11000 duplicate key error\`: \`createIndex({ email: 1 }, { unique: true })\`.
* **4. Text Index:** Tokenizes string/paragraph fields for fast full-text word search:
  * Create: \`createIndex({ name: "text" })\`
  * Query: \`find({ $text: { $search: "Khan" } })\`
* **5. Wildcard Index (\`$**\`):** Automatically indexes **all fields** across every document: \`createIndex({ "$**": 1 })\`. Useful for unpredictable schemas, though it consumes significantly more RAM.
* **6. Multikey Index (Array Field Index):** Calling \`createIndex({ skills: 1 })\` on an array field automatically indexes every individual element inside the array.

### 🛠️ Practical Indexing & Query Plan Analysis
\`\`\`javascript
// 1. Inspect query execution plan BEFORE and AFTER indexing
db.students.find({ name: "Aamir Khan" }).explain("executionStats")
// Before index: stage = "COLLSCAN", totalDocsExamined = 7

db.students.createIndex({ name: -1 })
db.students.find({ name: "Aamir Khan" }).explain("executionStats")
// After index: stage = "IXSCAN", totalDocsExamined = 1

// 2. Inspect and drop an existing index
db.students.getIndexes()
db.students.dropIndex("name_-1")

// 3. Compound Index (class ascending, age descending)
db.students.createIndex({ class: 1, age: -1 })
db.students.find({ class: "BCA" }).sort({ age: -1 }).explain("executionStats")

// 4. Unique Index on email (prevents duplicate emails & uses EXPRESS_IXSCAN)
db.students.createIndex({ email: 1 }, { unique: true })

// 5. Full-Text Index & $text / $search query
db.students.createIndex({ name: "text" })
db.students.find({ $text: { $search: "Khan" } })

// 6. Wildcard Index across all fields & Multikey Index on an Array field
db.students.createIndex({ "$**": 1 })
db.students2.createIndex({ skills: 1 })
\`\`\``
  },
  {
    topic_order: 31,
    slug: 'mongo-lecture-31-mongoimport-json-database-tools',
    title: 'Lecture 31: Importing JSON Datasets — MongoDB Database Tools Setup & mongoimport CLI',
    duration_minutes: 10,
    video_url: 'http://www.youtube.com/watch?v=9svsSHQTpUI',
    video_title: 'MongoDB Import JSON Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/database-tools/mongoimport/',
    short_description: 'Install MongoDB Command Line Database Tools, configure the Windows System PATH, and import external JSON files or JSON arrays into MongoDB collections using mongoimport.',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
To bulk-import external \`.json\` or \`.csv\` files exported from MySQL, Oracle, PostgreSQL, or third-party APIs into MongoDB, MongoDB provides the standalone **\`mongoimport\`** CLI utility inside the **MongoDB Command Line Database Tools** package.

### 💡 Installing MongoDB Database Tools & Setting \`PATH\`
* **Download & Install:** Download the **MongoDB Command Line Database Tools (\`.msi\`)** package from \`[mongodb.com/try/download/database-tools](https://mongodb.com/try/download/database-tools)\` and complete the installer.
* **System Environment Variable (\`Path\`):** Copy the installed tools binary path:
  \`C:\\Program Files\\MongoDB\\Tools\\100\\bin\`
  and add it to your Windows **System Variables -> \`Path\`** so \`mongoimport\`, \`mongodump\`, and \`mongorestore\` can be run from any terminal.
* **Run in OS Terminal (NOT inside \`mongosh\`):** \`mongoimport\` is an operating-system command-line executable. Always run it directly from Windows Command Prompt / PowerShell / macOS Terminal—outside of \`mongosh\`.

### 💡 \`mongoimport\` CLI Flags Breakdown
* **\`<file_path>\`:** Path to the source JSON file (e.g., \`D:\\test.json\`).
* **\`-d <db_name>\` (or \`--db\`):** Target database name (e.g., \`-d school\`).
* **\`-c <collection_name>\` (or \`--collection\`):** Optional target collection name (e.g., \`-c testing\`). If omitted, \`mongoimport\` automatically creates a collection named after the JSON filename (\`test\`).
* **\`--jsonArray\`:** Required when the JSON file contains an **array of objects** \`[ { ... }, { ... } ]\` rather than newline-delimited JSON objects.

### 🛠️ Practical mongoimport Workflow
\`\`\`bash
# 1. Run mongoimport directly in Windows Command Prompt (outside mongosh)
mongoimport D:\\test.json -d school -c testing --jsonArray
# Output: 2 document(s) imported successfully. 0 document(s) failed to import.

# 2. Verify imported collection and documents inside mongosh
mongosh
use school
show collections
db.testing.find()
\`\`\``
  },
  {
    topic_order: 32,
    slug: 'mongo-lecture-32-mongodump-and-mongorestore-backup-recovery',
    title: 'Lecture 32: Database Backup & Disaster Recovery — mongodump & mongorestore CLI Utilities',
    duration_minutes: 26,
    video_url: 'http://www.youtube.com/watch?v=Yr_dPdSPhbw',
    video_title: 'MongoDB Database Backup and Restore Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/database-tools/mongodump/',
    short_description: 'Create binary BSON backups of single collections, specific databases, or entire MongoDB servers using mongodump and restore them with mongorestore.',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
Production databases require regular backups for **disaster recovery**, **accidental deletion protection**, **server migration**, and **compliance auditing**. MongoDB provides two paired CLI utilities in the Database Tools suite: **\`mongodump\`** (exports binary \`.bson\` data + \`.metadata.json\` index/schema files) and **\`mongorestore\`** (restores binary dumps back into MongoDB).

### 💡 Backing Up Data with \`mongodump\`
Always run \`mongodump\` in your OS Command Prompt (exit \`mongosh\` first using \`exit\`):
* **1. Backup an Entire Database:**
  \`mongodump -d <db_name> -o <output_folder>\` (or \`--db <db_name> --out <output_folder>\`)
  Exports every collection in \`<db_name>\` as \`<collection>.bson\` and \`<collection>.metadata.json\` inside \`<output_folder>/<db_name>/\`.
* **2. Backup a Single Collection Only:**
  \`mongodump -d <db_name> -c <collection_name> -o <output_folder>\`
* **3. Full Server Backup (All Databases at Once):**
  \`mongodump -o <output_folder>\` (omitting \`-d\` and \`-c\` backs up every database on the server).

### 💡 Restoring Data with \`mongorestore\`
* **1. Restore a Single Collection:**
  \`mongorestore -d <target_db> -c <target_collection> <path_to_file.bson>\`
* **2. Restore an Entire Database (Into Original or New Database Name):**
  \`mongorestore -d <target_db> <path_to_db_backup_folder>\`
  For example, you can clone the \`school\` backup into a brand-new \`office\` database via \`mongorestore -d office C:\\backup\\school\`.
* **3. Restore All Databases & Drop Existing Data First (\`--dir\` & \`--drop\`):**
  \`mongorestore --dir <backup_root_folder> --drop\`
  The \`--drop\` flag drops existing collections before restoring so clean snapshot state is guaranteed.

### 🛠️ Practical Backup & Restore CLI Commands
\`\`\`bash
# --- MONGODUMP (BACKUP) ---
# 1. Backup the entire "school" database to C:\\backup
mongodump -d school -o C:\\backup
# Equivalent long form:
mongodump --db school --out C:\\backup

# 2. Backup ONLY the "students" collection from "school"
mongodump -d school -c students -o C:\\backup

# 3. Backup ALL databases on the MongoDB server
mongodump -o C:\\backup


# --- MONGORESTORE (RECOVERY) ---
# 4. Restore a single collection from its .bson file
mongorestore -d school -c students C:\\backup\\school\\students.bson

# 5. Restore the "school" backup into a new database named "office"
mongorestore -d office C:\\backup\\school

# 6. Restore all databases from C:\\backup, dropping existing collections first
mongorestore --dir C:\\backup --drop
\`\`\``
  },
  {
    topic_order: 33,
    slug: 'mongo-lecture-33-authentication-rbac-user-management',
    title: 'Lecture 33: Authentication & Role-Based Access Control (RBAC) — mongod.cfg Authorization, createUser, db.auth & Built-In Roles',
    duration_minutes: 39,
    video_url: 'http://www.youtube.com/watch?v=90szdRqZTeo',
    video_title: 'MongoDB Authentication & User Management Tutorial in Hindi / Urdu',
    official_docs_url: 'https://www.mongodb.com/docs/manual/core/authentication/',
    short_description: 'Secure MongoDB servers by enabling authorization in mongod.cfg, creating administrative and database-scoped users, authenticating via db.auth(), and managing RBAC roles.',
    problemSelector: { count: 0 },
    summary_markdown: `### 📌 Topic Overview
By default, a fresh local MongoDB installation allows anyone connecting on port \`27017\` to read, modify, or drop any database without logging in. In production, you must enable **Access Control (Authentication)** and assign **Role-Based Access Control (RBAC)** permissions to each user.

### 💡 Built-In MongoDB Roles Hierarchy
* **Database User & Admin Roles (Scoped to a Specific Database):**
  * **\`read\`:** Can only read data (\`find\`, \`aggregate\`); cannot insert, update, or delete.
  * **\`readWrite\`:** Can read and modify data (\`insert\`, \`update\`, \`delete\`) in the target database.
  * **\`dbAdmin\`:** Schema validation, indexing, and collection statistics (no user management).
  * **\`userAdmin\`:** Can create and modify users and roles on that database.
  * **\`dbOwner\`:** Combines \`readWrite\`, \`dbAdmin\`, and \`userAdmin\` on that specific database.
* **All-Database & Superuser Roles (Created in \`admin\` Database):**
  * **\`readAnyDatabase\` / \`userAdminAnyDatabase\` / \`dbAdminAnyDatabase\`:** Global administrative privileges across all databases.
  * **\`root\`:** Full superuser access to all databases, users, and server operations.
  * **\`backup\` & \`restore\`:** Dedicated roles for running \`mongodump\` and \`mongorestore\`.

### 💡 Enabling Authorization in \`mongod.cfg\`
1. Open \`C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.cfg\` as Administrator.
2. Uncomment \`security:\` and indent \`authorization: enabled\` by 2 spaces:
   \`\`\`yaml
   security:
     authorization: enabled
   \`\`\`
3. Open \`services.msc\` (Win + R -> \`services.msc\`), right-click **MongoDB Server**, and click **Restart**.

### 🛠️ Complete User & Role Management Lifecycle in \`mongosh\`
\`\`\`javascript
// 1. Switch to "admin" DB and create the primary "root" superuser
use admin
db.createUser({
  user: "admin",
  pwd: "admin123",
  roles: [
    { role: "root", db: "admin" }
  ]
})

// 2. Authenticate as "admin" (returns { ok: 1 })
db.auth("admin", "admin123")

// 3. Create a read-only "developer" user for the "school" database
db.createUser({
  user: "developer",
  pwd: "dev123",
  roles: [
    { role: "read", db: "school" }
  ]
})

// 4. Inspect users in the current database
db.getUsers()
db.getUser("developer")

// 5. Upgrade "developer" role to "readWrite" or grant/revoke additional roles
db.updateUser("developer", {
  roles: [
    { role: "readWrite", db: "school" }
  ]
})

db.grantRolesToUser("developer", [
  { role: "dbOwner", db: "school" }
])

db.revokeRolesFromUser("developer", [
  { role: "read", db: "school" }
])

// 6. Change password & drop users
db.changeUserPassword("developer", "pass123")
db.dropUser("developer")
// Drop all users in current DB with majority write concern:
// db.dropAllUsers({ w: "majority", wtimeout: 5000 })
\`\`\``
  }
];

function sanitizeUrl(u) {
  if (!u) return '';
  const match = u.match(/\[(.*?)\]\((.*?)\)/);
  if (match) return match[2].trim();
  return u.trim();
}

function cleanMarkdown(raw) {
  if (!raw) return '';
  let md = raw.replace(/>\s*🎥\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/>\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/\]*\]/gi, '');
  md = md.replace(/<\/?think>/gi, '');

  // Convert tables to bullet points
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

    // Strip table divider lines
    if (/^\|[-:\s|]+\|$/.test(trimmed)) continue;

    // Convert table row to bullet
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim()).filter(c => c.length > 0);
      if (cells.length > 0) {
        result.push('* **' + cells[0].replace(/^\*\*(.*?)\*\*$/, '$1') + ':** ' + cells.slice(1).join(' — '));
      }
      continue;
    }

    // Strip horizontal rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      continue;
    }

    // Replace blockquotes with bullet points
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

function normalizePattern(t) {
  return (t || '')
    .replace(/\b(SKU-\d+|Item \d+|\d+)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

async function seedMongoDBBatch3() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding MongoDB Track Batch 3 (Lectures 23 to 33) ---');
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

    // 3. Query existing problems from Lectures 1 to 22 to block duplicates
    const batch12Res = await client.query(`
      SELECT practice_problems
      FROM topics
      WHERE track_id = $1 AND topic_order <= 22;
    `, [trackId]);

    const usedProblemIds = new Set();
    const usedPatternKeys = new Set();

    for (const row of batch12Res.rows) {
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
    console.log(`Blocked ${usedProblemIds.size} problem IDs already assigned to Lectures 1 to 22.`);

    // 4. Smart Diversity Selector for Batch 3
    function matchesCriteria(q, order) {
      const titleLower = (q.title || '').toLowerCase();
      const eq = (q.expectedQuery || '').toLowerCase();
      const tags = (q.tags || []).map(t => t.toLowerCase());
      const topic = (q.topic || '').toLowerCase();
      const cat = (q.category || '').toLowerCase();

      if (order === 23) {
        // Arithmetic Aggregation Operators
        const arithmeticKeywords = ['multiply', 'add', 'subtract', 'divide', 'round', 'total', 'price', 'discount', 'math', 'sum', '$multiply', '$add', '$subtract', '$divide', '$mod', '$pow', '$sqrt', '$abs', '$ceil', '$floor', '$round', '$trunc', 'cost', 'calculate'];
        return arithmeticKeywords.some(k => eq.includes(k) || tags.includes(k) || titleLower.includes(k));
      } else if (order === 24) {
        // String Aggregation Operators
        const stringKeywords = ['string', 'concat', 'upper', 'lower', 'length', 'split', 'trim', 'substr', 'replace', 'name', '$concat', '$substr', '$toupper', '$tolower', '$strlen', '$trim', '$replace', '$regex'];
        return stringKeywords.some(k => eq.includes(k) || tags.includes(k) || titleLower.includes(k));
      } else if (order === 25) {
        // Date Aggregation Operators
        const dateKeywords = ['date', 'year', 'month', 'day', 'time', 'hour', 'created', 'order', 'after', 'before', 'joined', 'dob', 'born', '$year', '$month', '$day', '$date'];
        return dateKeywords.some(k => eq.includes(k) || tags.includes(k) || titleLower.includes(k));
      } else if (order === 26) {
        // Array Aggregation Operators
        const arrayKeywords = ['array', 'size', 'slice', 'element', 'first', 'last', 'filter', 'tags', 'skills', 'items', '$size', '$slice', '$elemmatch', '$filter', '$map', '$sortarray', 'hobbies', 'scores'];
        return arrayKeywords.some(k => eq.includes(k) || tags.includes(k) || titleLower.includes(k));
      } else if (order === 27) {
        // Type Conversion Operators
        const typeKeywords = ['type', 'convert', 'isnumber', 'int', 'string', 'double', 'decimal', 'bool', 'objectid', '$type', '$toint', '$tostring', '$todouble', '$tobool', 'numeric', 'number'];
        return typeKeywords.some(k => eq.includes(k) || tags.includes(k) || titleLower.includes(k));
      } else if (order === 28) {
        // Conditional Aggregation Operators
        const condKeywords = ['cond', 'switch', 'ifnull', 'condition', 'conditional', 'if', 'else', 'case', 'branch', 'status', 'grade', 'tier', 'category', 'discount', 'classification', '$cond', '$switch', '$ifnull'];
        return condKeywords.some(k => eq.includes(k) || tags.includes(k) || titleLower.includes(k));
      } else if (order === 30) {
        // MongoDB Indexes
        const indexKeywords = ['index', 'indexes', 'search', 'query', 'find', 'sort', 'explain', 'executionstats', 'unique'];
        if (topic.includes('index') || cat.includes('index') || tags.includes('indexes') || tags.includes('index')) return true;
        return indexKeywords.some(k => eq.includes(k) || tags.includes(k) || titleLower.includes(k));
      }
      return true;
    }

    function selectCuratedProblems(lecture) {
      const count = lecture.problemSelector ? (lecture.problemSelector.count ?? 0) : 0;
      if (count === 0) {
        return [];
      }

      const order = lecture.topic_order;
      const picked = [];

      // Pass 1: Strict criteria + unique pattern
      for (const q of catalog) {
        if (usedProblemIds.has(q._id)) continue;
        const pat = normalizePattern(q.title);
        if (usedPatternKeys.has(pat)) continue;

        if (matchesCriteria(q, order)) {
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
          if (matchesCriteria(q, order)) {
            picked.push(q);
            usedProblemIds.add(q._id);
            if (picked.length >= count) break;
          }
        }
      }

      // Pass 3: Unused question fallback with unique pattern
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

    // 5. Upsert Lectures 23 to 33
    for (const lec of batch3Lectures) {
      const cleanSummary = cleanMarkdown(lec.summary_markdown);
      const curatedProblems = selectCuratedProblems(lec);
      const problemsJson = JSON.stringify(curatedProblems);
      const sanitizedDocUrl = sanitizeUrl(lec.official_docs_url);
      const sanitizedVideoUrl = sanitizeUrl(lec.video_url);

      const docLinksJson = JSON.stringify([
        {
          title: `MongoDB Official Manual — ${lec.title.split('—')[0].trim()}`,
          url: sanitizedDocUrl,
          link: sanitizedDocUrl
        }
      ]);

      const videoLinksJson = JSON.stringify([
        {
          title: lec.video_title || lec.title,
          url: sanitizedVideoUrl,
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
          sanitizedDocUrl,
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
          sanitizedDocUrl,
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
      `, [topicId, lec.video_title || lec.title, sanitizedVideoUrl, lec.duration_minutes || 20]);

      // Insert documentation resource
      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'documentation', 10);
      `, [topicId, `MongoDB Manual — ${lec.title}`, sanitizedDocUrl]);

      // Insert problems (if any)
      for (const prob of curatedProblems) {
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, difficulty, estimated_minutes)
          VALUES ($1, $2, $3, 'problem', $4, 15);
        `, [topicId, prob.title, prob.url, prob.difficulty]);
      }

      console.log(`[SEED] Lecture ${lec.topic_order} (ID:${topicId}): ${lec.slug} | MdLen: ${cleanSummary.length} | Problems: ${curatedProblems.length}`);
    }

    // 6. Safely update total_topics and estimated_hours on tracks if columns exist
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tracks' AND column_name IN ('total_topics', 'estimated_hours');
    `);
    const cols = colCheck.rows.map(r => r.column_name);
    if (cols.includes('total_topics') && cols.includes('estimated_hours')) {
      await client.query(`UPDATE tracks SET total_topics = 33, estimated_hours = 25 WHERE id = $1;`, [trackId]);
      console.log('[TRACK] Updated total_topics = 33, estimated_hours = 25 for MongoDB Mastery.');
    } else if (cols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 33 WHERE id = $1;`, [trackId]);
      console.log('[TRACK] Updated total_topics = 33 for MongoDB Mastery.');
    }

    await client.query('COMMIT');
    console.log('--- MongoDB Batch 3 Seeded Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Batch 3 seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedMongoDBBatch3();
