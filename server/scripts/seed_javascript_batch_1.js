const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const batch1Lectures = [
  {
    topic_order: 1,
    slug: 'js-lecture-1-introduction-v8-engine-ecmascript-nodejs-runtime',
    title: 'Lecture 1: Introduction to JavaScript — Why JS Exists, ECMAScript, V8 Engine & Browser vs. Node.js Runtime',
    duration_minutes: 49,
    video_url: 'http://www.youtube.com/watch?v=611_04Ml25c',
    video_title: 'Javascript Full Course | Introduction to JAVASCRIPT | Javascript Full Course #01',
    doc_links: [
      {
        title: 'MDN Web Docs — JavaScript Guide & Introduction',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction'
      }
    ],
    short_description: 'Understand from first principles why JavaScript was created, how ECMAScript standardizes the language across browser engines, and how embedding V8 inside C++ created Node.js for full-stack MERN development.',
    summary_markdown: `### 📌 Topic Overview
While **HTML** defines the structural skeleton of a webpage and **CSS** controls visual styling and transitions, neither can execute logic, handle button click events dynamically, or compute data on the client side. **JavaScript** was created by Brendan Eich in 1995 (in 10 days at Netscape) to serve as the interactive brain of the web.

### 💡 The Browser Wars & ECMAScript Standardization
* **Why Standardization Was Needed:** Early browsers (Netscape Navigator vs. Microsoft Internet Explorer with JScript) implemented incompatible scripting behaviors, forcing developers to write separate codebases for different browsers.
* **ECMA International & ECMAScript (ES):** Standardized under **ECMA-262**. **ECMAScript** is the official specification (the rulebook), while **JavaScript** is the concrete implementation of that specification.
* **Major Milestones:** **ES5 (2009)** standardized strict mode and array methods; **ES6 / ES2015** introduced \`let\`, \`const\`, Arrow Functions, Promises, Classes, and ES Modules.

### 💡 JavaScript Engines & Runtime Environments
A CPU only understands binary machine code, not plain-text JavaScript. Every environment that runs JavaScript relies on a **JavaScript Engine**:
* **Google V8 Engine:** Written in C++, powers Google Chrome, Microsoft Edge, Brave, and **Node.js**. Uses a **Just-In-Time (JIT)** compilation pipeline (**Ignition** interpreter generates bytecode + **TurboFan** optimizing compiler compiles hot code directly into native machine code).
* **SpiderMonkey:** Mozilla's engine powering Firefox.
* **JavaScriptCore (Nitro):** Apple's engine powering Safari.
* **Why Node.js Unlocked Full-Stack JS:** In 2009, Ryan Dahl extracted Google's open-source C++ **V8 Engine** out of Chrome and embedded it into a standalone C++ runtime (**Node.js**) with file-system, network, and OS bindings—allowing developers to run JavaScript outside the browser via \`node index.js\`.

### 🛠️ Running JavaScript in Node.js vs. Browser
\`\`\`javascript
// File: first.js
// Execute in terminal using: node first.js
console.log("Hello Coder Army! JavaScript running outside the browser on V8.");

const num1 = 10;
const num2 = 20;
console.log("Sum:", num1 + num2); // Output: Sum: 30
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-1-q1',
        title: 'Q1: What is the difference between ECMAScript and JavaScript?',
        difficulty: 'Easy',
        answer: 'ECMAScript (standardized as ECMA-262 by ECMA International) is the official language specification that defines the syntax, types, and behavior rules of the language. JavaScript is the practical implementation of the ECMAScript specification, combined with host environment APIs (like the DOM, fetch, and localStorage in browsers, or fs and http in Node.js).'
      },
      {
        id: 'js-lec-1-q2',
        title: 'Q2: How does the Google V8 Engine execute JavaScript code? Is JS interpreted or compiled?',
        difficulty: 'Medium',
        answer: 'Modern JavaScript engines like V8 use Just-In-Time (JIT) compilation, which combines both interpretation and compilation. First, the parser converts JS source code into an Abstract Syntax Tree (AST). Second, the Ignition interpreter converts the AST into bytecode and begins executing it immediately. Third, while running, the profiler monitors "hot" functions (code executed repeatedly) and passes them to the TurboFan optimizing compiler, which compiles them into highly optimized native machine code.'
      },
      {
        id: 'js-lec-1-q3',
        title: 'Q3: What is Node.js, and how does it allow JavaScript to run outside the browser?',
        difficulty: 'Easy',
        answer: 'Node.js is an open-source, cross-platform C++ runtime environment that embeds Chrome\'s V8 JavaScript engine alongside libuv (for asynchronous I/O and the event loop). Because V8 compiles JavaScript into native machine instructions independent of HTML/DOM, wrapping V8 with C++ system bindings allows JavaScript to access the file system, network sockets, and OS processes on a server.'
      },
      {
        id: 'js-lec-1-q4',
        title: 'Q4: Are console.log, setTimeout, and document.getElementById part of core JavaScript (ECMAScript)?',
        difficulty: 'Medium',
        answer: 'No. None of them are part of the core ECMAScript specification. They are Host / Environment APIs provided by the runtime environment (Web APIs in the browser, or C++ bindings in Node.js). Note that document.getElementById exists only in the browser DOM environment and throws a ReferenceError in Node.js.'
      },
      {
        id: 'js-lec-1-q5',
        title: 'Q5: Why can a C++ program embed and execute JavaScript files?',
        difficulty: 'Hard',
        answer: 'Because the V8 engine itself is a C++ library. Any C++ application can include the V8 header files, initialize a V8 Isolate and Context in RAM, pass a raw JavaScript string or file into V8, and let V8 compile and execute those instructions on the CPU.'
      },
      {
        id: 'js-lec-1-q6',
        title: 'Q6: Why did the web standardize on JavaScript instead of running languages like C++ or Java directly in the browser DOM?',
        difficulty: 'Easy',
        answer: 'Browsers needed a lightweight, memory-safe, dynamically typed scripting language that could run inside a strict security sandbox without manual memory allocation pointers or separate compilation steps before page load. JavaScript was built specifically to manipulate UI elements safely in real time.'
      }
    ]
  },
  {
    topic_order: 2,
    slug: 'js-lecture-2-variables-data-types-var-let-const-mutability',
    title: 'Lecture 2: Variables & Data Types — var, let, const, 7 Primitives vs. Reference Types & Mutability',
    duration_minutes: 69,
    video_url: 'http://www.youtube.com/watch?v=UXYJGHhuGA8',
    video_title: 'JavaScript Variables & Data Types Explained(var, let, const, mutable) | Javascript Full Course #02',
    doc_links: [
      {
        title: 'MDN Web Docs — JavaScript Data Types and Data Structures',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures'
      }
    ],
    short_description: 'Master variable declarations (let, const, var), all 7 primitive data types vs. non-primitive reference types, typeof quirks, and why primitives are strictly immutable while objects are mutable.',
    summary_markdown: `### 📌 Topic Overview
JavaScript is a **dynamically typed** language—you do not declare data types ahead of time (let x = 10 can later hold "Rohit"). Every value in JavaScript falls into one of two categories: **Primitive Data Types (7 types)** or **Non-Primitive / Reference Data Types (\`Object\`)**.

### 💡 Variable Declarations: \`let\`, \`const\`, and Legacy \`var\`
* **\`let\`:** Block-scoped variable whose binding can be reassigned later (\`let age = 20; age = 30;\`), but cannot be redeclared in the same scope.
* **\`const\`:** Block-scoped constant binding that **must be initialized at declaration** and cannot be reassigned to a new value or reference.
* **\`var\` (Legacy — Avoid in Modern Code):** Function-scoped (ignores \`if\` and \`for\` block curly braces), allows accidental duplicate redeclarations (\`var a = 10; var a = 20;\`), and initializes to \`undefined\` during hoisting.

### 💡 The 7 Primitive Data Types (Immutable Values)
1. **\`number\`:** 64-bit IEEE-754 floating-point values (handles both integers and decimals up to \`2^53 - 1\`, i.e., \`9007199254740991\`).
2. **\`bigint\`:** Arbitrary-precision integers beyond \`2^53 - 1\`, created by appending \`n\` (e.g., \`90071992547409912345n\`).
3. **\`string\`:** Immutable sequence of UTF-16 characters enclosed in \`""\`, \`''\`, or \`\`\`\`.
4. **\`boolean\`:** Logical \`true\` or \`false\`.
5. **\`undefined\`:** Default value automatically assigned by JS to a declared variable that has not yet been initialized.
6. **\`null\`:** Intentional absence of any object/value assigned explicitly by the developer.
7. **\`symbol\`:** Guaranteed unique and immutable primitive identifier (e.g., \`Symbol("id")\`).

### 💡 Non-Primitive Data Types & Mutability Philosophy
* **Non-Primitives (\`Object\`, \`Array\`, \`Function\`):** Stored by **reference**.
* **Why Primitives Are Immutable:** If you run \`let str = "Rohit"; str[0] = "M";\`, the string remains \`"Rohit"\`. Reassigning \`let a = 10; a = 20;\` does not mutate the value \`10\` in memory—it creates a new value \`20\` and points \`a\` to it.
* **Why Non-Primitives Are Mutable:** Copying an object (\`let obj2 = obj1\`) copies the **memory reference**, not the object itself. Mutating \`obj2.age = 30\` directly mutates \`obj1.age\` because both variables point to the same underlying object.

### 🛠️ Code Examples: Primitives, \`typeof\` Quirks & Reference Mutation
\`\`\`javascript
// 1. All 7 Primitive Data Types & typeof operator
let num = 42;                         // typeof -> "number"
let big = 9007199254740999n;          // typeof -> "bigint"
let str = "Coder Army";               // typeof -> "string"
let isPlaced = true;                  // typeof -> "boolean"
let uninit;                           // typeof -> "undefined"
let emptyVal = null;                  // typeof -> "object" (Famous 1995 JS bug!)
let sym = Symbol("unique_id");        // typeof -> "symbol"

// 2. Primitive Immutability (Pass by Value behavior)
let a = 10;
let b = a;
b = 20;
console.log(a, b); // 10, 20 (a is completely unaffected)

let name = "Rohit";
name[0] = "M";     // Ignored silently in non-strict mode
console.log(name); // "Rohit" (Strings are immutable)

// 3. Non-Primitive Mutability (Shared Reference)
const user1 = { name: "Rohit", age: 20 };
const user2 = user1; // Copies reference address, NOT a new object!
user2.age = 25;
console.log(user1.age); // 25 (Both point to the exact same object)
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-2-q1',
        title: 'Q1: What are the exact differences between var, let, and const?',
        difficulty: 'Easy',
        answer: '1) Scope: var is function-scoped (leaks out of if/for blocks), whereas let and const are strictly block-scoped ({ ... }). 2) Redeclaration: var allows redeclaring the same identifier in the same scope; let and const throw a SyntaxError. 3) Reassignment: var and let can be reassigned; const cannot be reassigned after initialization. 4) Hoisting: var is initialized to undefined during the memory phase, while let and const remain uninitialized in the Temporal Dead Zone (TDZ) until their declaration line.'
      },
      {
        id: 'js-lec-2-q2',
        title: 'Q2: Why does typeof null return "object" in JavaScript?',
        difficulty: 'Medium',
        answer: 'This is a historical bug from the very first 1995 implementation of JavaScript. In the original 32-bit engine, values were represented with type tags in the lowest bits, where 000 denoted an Object. The null pointer was represented as all zero bits (0x00), causing the engine to misread its type tag as 000 ("object"). The committee later rejected fixing it because changing typeof null to "null" would break millions of existing production websites.'
      },
      {
        id: 'js-lec-2-q3',
        title: 'Q3: If a variable is declared with const (e.g., const user = { name: "Rohit" }), why can we still modify user.name = "Mohit"?',
        difficulty: 'Easy',
        answer: 'Because const makes the variable binding (the memory reference stored in user) constant, NOT the underlying object value itself. Mutating a property inside the object (user.name = "Mohit") does not change the memory address that user points to. However, attempting to reassign user = { name: "Mohit" } throws a TypeError: Assignment to constant variable because that tries to point user to a brand-new memory address.'
      },
      {
        id: 'js-lec-2-q4',
        title: 'Q4: What does it mean that Primitive Data Types are immutable in JavaScript?',
        difficulty: 'Medium',
        answer: 'Immutability means a primitive value itself can never be altered in place once created in memory. For example, if let str = "hello", trying to change str[0] = "H" has no effect, and methods like str.toUpperCase() return a brand-new string ("HELLO") without modifying the original string. When you write let x = 10; x = 20;, you are not mutating the number 10 into 20; you are pointing the variable x to a new memory location holding 20.'
      },
      {
        id: 'js-lec-2-q5',
        title: 'Q5: What is the difference between null and undefined?',
        difficulty: 'Easy',
        answer: 'undefined means a variable has been declared (or an object property/function return was accessed) but no value has been assigned to it yet—it is the engine\'s default placeholder. null is an explicit assignment value used by developers to represent "no value" or an intentionally empty object reference. Also, typeof undefined is "undefined", while typeof null is "object".'
      },
      {
        id: 'js-lec-2-q6',
        title: 'Q6: When do you need BigInt in JavaScript, and what is Number.MAX_SAFE_INTEGER?',
        difficulty: 'Medium',
        answer: 'Standard JavaScript Numbers use 64-bit IEEE-754 double-precision floats, which allocate 53 bits for the significand (mantissa). Therefore, the largest exact integer JS can safely represent without losing precision is 2^53 - 1 (9,007,199,254,740,991, or Number.MAX_SAFE_INTEGER). Beyond this limit, expressions like 9007199254740992 + 1 === 9007199254740992 evaluate to true due to precision loss! BigInt (created by appending n, like 9007199254740993n) stores arbitrarily large integers accurately.'
      }
    ]
  },
  {
    topic_order: 3,
    slug: 'js-lecture-3-memory-management-stack-vs-heap-v8-pointer-tagging',
    title: 'Lecture 3: Memory Management Internals — Stack vs. Heap (First Principles), V8 Pointer Tagging & Smi',
    duration_minutes: 86,
    video_url: 'http://www.youtube.com/watch?v=WRBFDQR0oM4',
    video_title: 'JavaScript Memory Management Explained: Stack vs Heap (First Principle) | Javascript Full Course #03',
    doc_links: [
      {
        title: 'MDN Web Docs — JavaScript Memory Management & Garbage Collection',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management'
      }
    ],
    short_description: 'Deconstruct from first principles how RAM is organized into Stack and Heap, debunk the myth that all primitives live on the Stack, and understand V8 Smi (Small Integers) and Pointer Tagging.',
    summary_markdown: `### 📌 Topic Overview
Most superficial tutorials claim *"all primitives are stored on the Stack and all objects are stored on the Heap."* In a dynamically typed engine like **Google V8**, that statement is architecturally inaccurate. Understanding how V8 actually manages **Stack**, **Heap**, **Small Integers (\`Smi\`)**, and **Tagged Pointers** from first principles reveals why JavaScript handles mutability and references the way it does.

### 💡 Why Can't Everything Live Inside a Contiguous Stack?
* **How the Call Stack Works:** The Stack is a fast, fixed-size, contiguous region of RAM managed in strict LIFO (Last-In, First-Out) order using a CPU stack pointer.
* **The Dynamic Typing Problem:** In C++, \`int a = 10\` is guaranteed to always be 4 bytes on the stack. In JavaScript, \`let a = 10\` can be reassigned on the very next line to a 50-character string or a 10,000-element array! If large strings or dynamic objects were stored directly inline on the contiguous Stack, growing them would require shifting every single variable below them in RAM—destroying performance.
* **The Solution (Stack Pointers + Dynamic Heap):** Variable bindings (execution frame slots) live on the **Stack**, holding compact memory addresses (pointers) that point to actual values allocated dynamically in the **Heap**.

### 💡 V8 Engine Optimization: \`Smi\` (Small Integers) & Pointer Tagging
Allocating a Heap object for every tiny loop counter (\`i = 0, 1, 2...\`) would be too slow. V8 solves this using **Pointer Tagging** (inspection of the Least Significant Bit, LSB):
* **Memory Alignment Fact:** On 32-bit/64-bit architectures, word-aligned Heap memory addresses are multiples of 4 or 8, meaning their binary representation always ends in \`0\`!
* **Tag Bit (\`0\` vs. \`1\`):** V8 uses the last bit of a slot on the Stack as a tag:
  * **LSB = \`0\` (\`Smi\` — Small Integer):** The value is stored **directly inline on the Stack** as a fast unboxed integer (31-bit signed integer on 32-bit systems), avoiding any Heap lookup!
  * **LSB = \`1\` (\`HeapObject\` Pointer):** Indicates that the slot holds a memory address pointing to a **Heap Object** (which includes Strings, Floating-Point \`HeapNumber\`s, \`BigInt\`s, \`Boolean\`/\`null\`/\`undefined\` singletons, Arrays, and Objects).

### 🛠️ Visualizing V8 Memory Allocation & Immutability
\`\`\`javascript
// 1. Smi (Small Integer): Stored inline in the Stack frame (Tag bit = 0)
let count = 10; 

// 2. Heap allocations (Tag bit = 1 -> Points to V8 Heap):
// Strings, Floats (HeapNumber), and BigInts are allocated on the Heap,
// but they are IMMUTABLE. Reassigning creates a new Heap entry and updates the Stack pointer:
let name = "Rohit";
let copyName = name; // Both Stack slots point to the same Heap string "Rohit"
name = "Mohit";      // Allocates "Mohit" in Heap and updates 'name' pointer; 'copyName' still points to "Rohit"

// 3. Mutable Heap Objects (Arrays & Objects):
// Mutating a property modifies the Heap block in place WITHOUT changing the Stack pointer!
let user1 = { balance: 500 };
let user2 = user1;   // Both Stack slots hold the exact same Heap pointer
user2.balance = 900; // Modifies the Heap block in place -> user1.balance is now 900!
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-3-q1',
        title: 'Q1: Is it true that all Primitive data types are stored on the Stack in V8? How does V8 actually store primitives vs. objects?',
        difficulty: 'Hard',
        answer: 'No, that is a common misconception from statically typed languages like C++. Because JavaScript variables are dynamically typed and strings/BigInts can be arbitrarily large, V8 only stores Small Integers (Smi) directly inline inside the Stack frame. Strings, floating-point numbers (HeapNumber), BigInts, and oddballs (null, undefined, true, false singletons) are allocated in the V8 Heap, while the Stack frame holds tagged pointers referencing them. The difference between primitives and objects is not where they live, but that primitives are immutable (reassignment points the Stack slot to a new Heap address) whereas objects are mutable in place.'
      },
      {
        id: 'js-lec-3-q2',
        title: 'Q2: What is Pointer Tagging in the V8 Engine, and how does V8 distinguish a Small Integer (Smi) from a Heap Pointer?',
        difficulty: 'Hard',
        answer: 'Because aligned memory addresses in RAM are multiples of 4 (or 8), their lowest binary bit (Least Significant Bit) is naturally 0. V8 exploits this by using the lowest bit of every value slot as a tag: if the last bit is 0, V8 treats the remaining bits directly as an inline Small Integer (Smi) without dereferencing memory. If the last bit is 1, V8 treats the value as a pointer to an object allocated on the Heap.'
      },
      {
        id: 'js-lec-3-q3',
        title: 'Q3: Why can\'t dynamic objects or variable-length strings be stored directly inline on the Call Stack?',
        difficulty: 'Medium',
        answer: 'The Call Stack relies on contiguous memory blocks and fixed offsets so the CPU can push and pop stack frames in O(1) time. If an object or string stored inline in the middle of the Stack grew in size (e.g., adding keys to an object or concatenating a string), it would overwrite adjacent stack frames or require copying and shifting the entire Stack in RAM.'
      },
      {
        id: 'js-lec-3-q4',
        title: 'Q4: If two variables hold let a = "Rohit" and let b = a, do they duplicate the string in RAM?',
        difficulty: 'Medium',
        answer: 'No. Because strings are immutable, V8 uses string interning and shared references. Both a and b on the Stack point to the exact same "Rohit" string address in the Heap. Because strings cannot be mutated in place, sharing the address is 100% safe—if b is later reassigned to "Mohit", b\'s Stack pointer simply updates to point to a new Heap address without affecting a.'
      },
      {
        id: 'js-lec-3-q5',
        title: 'Q5: How does Garbage Collection (GC) work in JavaScript\'s Heap?',
        difficulty: 'Medium',
        answer: 'V8 uses a Generational Garbage Collector (Orinoco) based on the Mark-and-Sweep algorithm. It divides the Heap into a Young Generation (Nursery/Intermediate for newly allocated short-lived objects, cleaned frequently by the Scavenger) and an Old Generation (for long-lived objects). Starting from "roots" (active Call Stack variables and global references), the GC marks all reachable Heap objects and sweeps (frees) any unreachable memory blocks.'
      },
      {
        id: 'js-lec-3-q6',
        title: 'Q6: Why are null, undefined, true, and false never duplicated in memory no matter how many variables use them?',
        difficulty: 'Easy',
        answer: 'V8 pre-allocates singletons (called "Oddballs") in a read-only root section of the Heap for null, undefined, true, and false when the engine boots. Every variable assigned undefined or true simply points to that single read-only address.'
      }
    ]
  },
  {
    topic_order: 4,
    slug: 'js-lecture-4-operators-type-coercion-conditionals-loops',
    title: 'Lecture 4: Operators, Type Coercion, Conditionals & Loops — == vs. ===, 0.1 + 0.2, Short-Circuiting & Bitwise',
    duration_minutes: 68,
    video_url: 'http://www.youtube.com/watch?v=7dMQr2-T--4',
    video_title: 'JavaScript Conditionals, Loops & Operators Explained | Javascript Full Course #04',
    doc_links: [
      {
        title: 'MDN Web Docs — Expressions and Operators',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators'
      }
    ],
    short_description: 'Master arithmetic, assignment, comparison (== vs. ===), logical short-circuiting (&&, ||), bitwise operators, IEEE-754 floating-point precision (0.1 + 0.2), and control flow loops.',
    summary_markdown: `### 📌 Topic Overview
JavaScript operators behave differently from statically typed languages whenever operands have mismatched types due to **Implicit Type Coercion**. Mastering strict vs. loose equality, floating-point binary representation, and logical short-circuit evaluation is essential for technical interviews.

### 💡 Loose Equality (\`==\`) vs. Strict Equality (\`===\`)
* **Loose Equality (\`==\`):** Performs **Type Coercion** before comparing. If you compare \`5 == "5"\`, JS converts \`"5"\` to the number \`5\` and returns \`true\`.
* **Strict Equality (\`===\`):** Checks **both Data Type and Value** without coercion. \`5 === "5"\` immediately returns \`false\`.
* **Special Equality Rules in Interviews:**
  * \`null == undefined\` is **\`true\`**, but \`null === undefined\` is **\`false\`**.
  * \`null\` only loosely equals \`undefined\` and \`null\` (so \`null == 0\` is **\`false\`**!), even though relational operators coerce \`null\` to \`0\` (\`null >= 0\` is **\`true\`**!).
  * \`NaN === NaN\` and \`NaN == NaN\` are both **\`false\`**! Always use \`Number.isNaN(val)\` to check for \`NaN\`.

### 💡 Why Does \`0.1 + 0.2 === 0.3\` Evaluate to \`false\`?
* Computers store numbers in **base-2 (binary)**. Just as \`1/3\` is an infinite repeating decimal in base-10 (\`0.33333...\`), \`0.1\` (\`1/10\`) and \`0.2\` (\`1/5\`) are **infinite repeating fractions in binary** (\`0.0001100110011...\`).
* Because 64-bit IEEE-754 floats truncate at 53 bits of precision, adding the binary approximations produces \`0.30000000000000004\`.
* **Production Fix:** Store currency in integer smallest units (paise/cents) or compare with \`Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON\`.

### 💡 Truthy/Falsy Values & Logical Short-Circuiting (\`&&\`, \`||\`, \`!\`)
* **The 8 Falsy Values in JS:** \`false\`, \`0\`, \`-0\`, \`0n\`, \`""\` (empty string), \`null\`, \`undefined\`, and \`NaN\`. Everything else (including \`"0"\`, \`[]\`, and \`{}\`) is **Truthy**.
* **\`&&\` (Logical AND):** Evaluates left-to-right and returns the **first falsy operand**, or the **last operand** if all are truthy (e.g., \`"Rohit" && "Mohit"\` returns \`"Mohit"\`; \`0 && "Mohit"\` returns \`0\`).
* **\`||\` (Logical OR):** Evaluates left-to-right and returns the **first truthy operand**, or the **last operand** if all are falsy (e.g., \`"" || "Default"\` returns \`"Default"\`).

### 🛠️ Code Examples: Coercion, Floating-Point Precision & Loops
\`\`\`javascript
// 1. Loose (==) vs. Strict (===) Equality & null/NaN Quirks
console.log(10 == "10");          // true (string "10" coerced to number 10)
console.log(10 === "10");         // false (different types)
console.log(null == undefined);   // true
console.log(null === undefined);  // false
console.log(null == 0);           // false (null only loosely equals undefined)
console.log(null >= 0);           // true  (relational >= coerces null to 0!)
console.log(NaN === NaN);         // false

// 2. IEEE-754 Floating Point Precision Problem
console.log(0.1 + 0.2);           // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);   // false
console.log(Number((0.1 + 0.2).toFixed(2)) === 0.3); // true

// 3. Logical Short-Circuiting (Returns actual operand values, not just booleans!)
console.log("Coder" && "Army");   // "Army" (first is truthy, returns second)
console.log(0 && "Army");         // 0      (short-circuits on first falsy value)
console.log("" || "Fallback");    // "Fallback" (returns first truthy value)

// 4. Bitwise AND (&) vs. Bitwise OR (|) on binary bits
console.log(2 & 3); // 2 (010 & 011 = 010)
console.log(2 & 5); // 0 (010 & 101 = 000)
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-4-q1',
        title: 'Q1: Why does 0.1 + 0.2 === 0.3 return false in JavaScript, and how do you handle financial calculations safely?',
        difficulty: 'Medium',
        answer: 'JavaScript numbers follow the 64-bit IEEE-754 binary floating-point standard. In base-2, fractions whose denominators are not powers of 2 (such as 1/10 = 0.1 and 1/5 = 0.2) cannot be represented finitely—they become infinite repeating binary fractions (0.0001100110011...). When truncated to 53 mantissa bits and added together, the rounding error yields 0.30000000000000004. For financial systems, always store and compute amounts as integers in the smallest currency unit (e.g., paise or cents: 10 + 20 === 30) or use Decimal/BigInt libraries.'
      },
      {
        id: 'js-lec-4-q2',
        title: 'Q2: Explain why null > 0 is false, null == 0 is false, but null >= 0 is true!',
        difficulty: 'Hard',
        answer: 'Because the Equality check (==) and Relational Comparisons (> < >= <=) follow two completely different ECMAScript specification algorithms! Relational operators convert null to a number (ToNumber(null) -> 0), so null > 0 becomes 0 > 0 (false) and null >= 0 becomes 0 >= 0 (true). However, the Abstract Equality (==) specification explicitly states that null only equals null or undefined and never coerces null to a number, so null == 0 is false.'
      },
      {
        id: 'js-lec-4-q3',
        title: 'Q3: What is the output of console.log("Rohit" && 42) and console.log(0 || "Default")? Why don\'t they return true or false?',
        difficulty: 'Easy',
        answer: 'In JavaScript, && and || are value-selector operators that return the actual evaluated operand value rather than coercing to a boolean. Logical AND (&&) returns the first falsy operand it encounters, or the final operand if all are truthy—so "Rohit" && 42 returns 42. Logical OR (||) returns the first truthy operand it encounters, or the final operand if all are falsy—so 0 || "Default" returns "Default".'
      },
      {
        id: 'js-lec-4-q4',
        title: 'Q4: List all 8 Falsy values in JavaScript. Are empty arrays [] and empty objects {} truthy or falsy?',
        difficulty: 'Easy',
        answer: 'The 8 falsy values in JavaScript are: false, 0, -0, 0n (BigInt zero), "" (empty string), null, undefined, and NaN. Empty arrays [] and empty objects {} are Object references, and every Object in JavaScript is strictly Truthy (so if ([]) executes the if-block). However, [] == false evaluates to true because loose equality coerces [] -> "" -> 0.'
      },
      {
        id: 'js-lec-4-q5',
        title: 'Q5: Why is NaN === NaN false, and what is the difference between isNaN() and Number.isNaN()?',
        difficulty: 'Medium',
        answer: 'Per the IEEE-754 specification, NaN ("Not-a-Number") represents an invalid mathematical result (like 0/0 or Number("abc")), and two invalid results are never equal to each other, so NaN === NaN is false. The global isNaN("hello") coerces its argument to a number first and returns true for strings, whereas Number.isNaN(val) does NOT coerce the value and returns true ONLY if the value is currently of type number and its value is NaN.'
      },
      {
        id: 'js-lec-4-q6',
        title: 'Q6: What is the difference between Logical AND (&&) and Bitwise AND (&)? Why does 2 & 3 equal 2 while 2 & 5 equals 0?',
        difficulty: 'Easy',
        answer: 'Logical && operates on truthiness of whole expressions and short-circuits. Bitwise & converts both numbers to 32-bit binary integers and compares them bit-by-bit (1 & 1 = 1, otherwise 0). Since 2 is 010 in binary and 3 is 011, 010 & 011 = 010 (2). Since 5 is 101 in binary, 010 & 101 = 000 (0).'
      }
    ]
  },
  {
    topic_order: 5,
    slug: 'js-lecture-5-numbers-math-object-random-number-generation-prng',
    title: 'Lecture 5: Numbers, Math Object & Random Generation — toFixed, toPrecision, PRNG Seeds & CSPRNG Security',
    duration_minutes: 58,
    video_url: 'http://www.youtube.com/watch?v=HTcT-TuraHM',
    video_title: 'JavaScript Numbers & Math Object Explained | Random Number Generation | Javascript Full Course #05',
    doc_links: [
      {
        title: 'MDN Web Docs — Math Built-In Object Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math'
      },
      {
        title: 'MDN Web Docs — Number Built-In Object Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number'
      }
    ],
    short_description: 'Format numbers with toFixed() and toPrecision(), master Math methods, derive the universal bounded random integer formula, and understand why Math.random() is unsafe for OTPs or gambling apps.',
    summary_markdown: `### 📌 Topic Overview
This lecture explores JavaScript's **\`Number\`** methods, the built-in **\`Math\`** object, how to derive bounded random integer formulas from first principles, and how Pseudo-Random Number Generators (**PRNGs**) work under the hood.

### 💡 Essential \`Number\` Formatting Methods
* **\`num.toFixed(digits)\`:** Formats a number to \`digits\` decimal places after the dot and **returns a \`String\`** (e.g., \`(10.5678).toFixed(2)\` -> \`"10.57"\`). Convert back using \`Number(...)\` if further math is needed.
* **\`num.toPrecision(totalDigits)\`:** Formats a number to a specified **total number of significant digits** (before + after decimal) and returns a \`String\` (e.g., \`(10.5678).toPrecision(3)\` -> \`"10.6"\`).
* **\`num.toString(radix)\`:** Converts a number to a string in base \`radix\` (e.g., \`(10).toString(2)\` -> \`"1010"\` in binary).
* **Avoid \`new Number(10)\`:** Creates a Heap wrapper \`Object\` (\`typeof new Number(10) === "object"\`), causing \`new Number(10) === new Number(10)\` to evaluate to \`false\` because it compares two distinct object memory addresses!

### 💡 Deriving the Universal Random Integer Formula (\`min\` to \`max\` Inclusive)
* **\`Math.random()\`:** Returns a floating-point number in the half-open interval \`[0, 1)\` (includes \`0\`, strictly less than \`1\`, e.g., \`0.0\` to \`0.999999...\`).
* **0 to \`N - 1\` (e.g., \`0\` to \`9\`):** Multiply by \`10\` (\`[0, 9.999...)\`) and apply \`Math.floor()\`: \`Math.floor(Math.random() * 10)\`.
* **1 to \`N\` (e.g., Dice Roll \`1\` to \`6\`):** \`Math.floor(Math.random() * 6) + 1\`.
* **Universal Formula for Any Range \`[min, max]\` Inclusive:**
  * Total number of possible outcomes = \`(max - min + 1)\`.
  * Shift starting offset by \`+ min\`:
  * **\`Math.floor(Math.random() * (max - min + 1)) + min\`**

### 💡 Why \`Math.random()\` Is Predictable (PRNG Internals & Security)
* Deterministic computers cannot generate true randomness purely from math; \`Math.random()\` uses a **Pseudo-Random Number Generator (PRNG)** (such as xorshift128+ in V8) initialized with a starting **Seed** value (often derived from system clock/state).
* Because the next output is computed deterministically from the internal state (\`next = (a * seed + c) % m\`), an attacker who observes a sequence of outputs can reverse-engineer the seed and predict every future "random" number!
* **Never use \`Math.random()\` for OTPs, Password Reset Tokens, or Real-Money Gaming/Poker.** Instead, use a Cryptographically Secure PRNG (**CSPRNG**) like **\`crypto.getRandomValues()\`** or **\`crypto.randomInt()\`** (which harvests hardware entropy like CPU thermal noise, mouse jitter, and disk I/O timing).

### 🛠️ Code Examples: Number Methods, Math & Random Range Formula
\`\`\`javascript
// 1. Number formatting methods (Note: they return Strings!)
const price = 245.6789;
console.log(price.toFixed(2));      // "245.68" (String)
console.log(price.toPrecision(4));  // "245.7"  (4 total significant digits)

// 2. Core Math methods
console.log(Math.floor(4.9));       // 4
console.log(Math.ceil(4.1));        // 5
console.log(Math.round(4.5));       // 5
console.log(Math.trunc(-4.9));      // -4 (strips decimal, whereas Math.floor(-4.9) is -5)

// 3. Universal Random Integer Generator between [min, max] inclusive
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Dice roll (1 to 6):
console.log(getRandomIntInclusive(1, 6));
// 4-Digit OTP range (1000 to 9999):
console.log(getRandomIntInclusive(1000, 9999));
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-5-q1',
        title: 'Q1: Derive the formula to generate a random integer between min and max (both inclusive) using Math.random(). Why do we use Math.floor() instead of Math.round()?',
        difficulty: 'Medium',
        answer: 'The formula is Math.floor(Math.random() * (max - min + 1)) + min. Since Math.random() returns [0, 1), multiplying by total outcomes (max - min + 1) scales the range to [0, max - min + 0.9999...). Applying Math.floor() maps every integer bucket to an equal width of 1.0 (0 to max - min), and adding min shifts the range to [min, max]. Using Math.round() instead of Math.floor() would produce an uneven distribution where the boundary numbers (min and max) have only half the probability (0.5 bucket width) of the middle numbers!'
      },
      {
        id: 'js-lec-5-q2',
        title: 'Q2: Why should you NEVER use Math.random() to generate OTPs, session tokens, or card shuffles in a real-money game?',
        difficulty: 'Hard',
        answer: 'Because Math.random() is a Pseudo-Random Number Generator (PRNG, specifically xorshift128+ in V8) optimized for speed, not cryptographic unpredictability. Given a small sample of consecutive outputs from Math.random(), an attacker can mathematically reconstruct the internal state/seed of the PRNG and predict 100% of future outputs. For security-sensitive tasks, always use Web Crypto API (crypto.getRandomValues() or Node\'s crypto.randomInt()), which uses OS-level hardware entropy (mouse movements, thermal sensors, interrupt timings).'
      },
      {
        id: 'js-lec-5-q3',
        title: 'Q3: What is the return type of (123.456).toFixed(2), and what is the difference between toFixed() and toPrecision()?',
        difficulty: 'Easy',
        answer: 'Both toFixed() and toPrecision() return a String, not a Number! toFixed(n) specifies the number of digits strictly after the decimal point (e.g., (123.456).toFixed(2) -> "123.46"). toPrecision(n) specifies the total number of significant digits across the entire number before and after the decimal point (e.g., (123.456).toPrecision(4) -> "123.5").'
      },
      {
        id: 'js-lec-5-q4',
        title: 'Q4: Why does new Number(20) == new Number(20) return false, while Number("20") === 20 returns true?',
        difficulty: 'Medium',
        answer: 'Calling Number("20") without the new keyword acts as a type-conversion function and returns a primitive number 20. Calling new Number(20) with the new keyword constructs a heap-allocated Number wrapper Object. When comparing two objects with == or ===, JavaScript compares their memory references, and two distinct new Number(20) allocations have different memory addresses.'
      },
      {
        id: 'js-lec-5-q5',
        title: 'Q5: What is the difference between Math.floor() and Math.trunc() on negative numbers like -4.7?',
        difficulty: 'Easy',
        answer: 'Math.floor(-4.7) rounds down toward negative infinity, returning -5. Math.trunc(-4.7) simply strips the fractional decimal digits toward zero, returning -4.'
      },
      {
        id: 'js-lec-5-q6',
        title: 'Q6: Why does calling a method on a number literal like 42.toFixed(2) throw a SyntaxError, whereas (42).toFixed(2) or 42..toFixed(2) works?',
        difficulty: 'Medium',
        answer: 'In JavaScript grammar, the first dot after an integer literal (42.) is parsed as a decimal point for a floating-point number, leaving no dot for property access. Wrapping the number in parentheses (42).toFixed(2) or using two dots 42..toFixed(2) disambiguates the decimal point from the member-access dot operator, allowing JS to auto-box the primitive into a temporary Number object.'
      }
    ]
  },
  {
    topic_order: 6,
    slug: 'js-lecture-6-strings-and-date-object-utc-epoch-methods',
    title: 'Lecture 6: Strings & Date Object In-Depth — Template Literals, String Methods, Unix Epoch & UTC vs. Local Time',
    duration_minutes: 66,
    video_url: 'http://www.youtube.com/watch?v=8dgsUGEgPXo',
    video_title: 'JavaScript Strings & Dates Explained In-Depth | Javascript Full Course #06',
    doc_links: [
      {
        title: 'MDN Web Docs — String Built-In Object Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String'
      },
      {
        title: 'MDN Web Docs — Date Built-In Object Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date'
      }
    ],
    short_description: 'Master ES6 template literals, essential string manipulation methods (slice, substring, replaceAll, split, trim), and JavaScript Date internals (Unix Epoch milliseconds, 0-indexed months, and UTC vs. IST local time).',
    summary_markdown: `### 📌 Topic Overview
Strings and Dates are two of the most heavily used data structures in web development. This lecture covers modern **ES6 Template Literals**, non-mutating **String methods**, and how JavaScript's **\`Date\`** object represents time internally using **Unix Epoch milliseconds** and **UTC (Coordinated Universal Time)**.

### 💡 Modern Strings & Essential String Methods
Because strings are **immutable primitives**, every string method returns a **brand-new string** without modifying the original string:
* **Template Literals (\` \`...\` \`):** Backtick strings support multi-line text without syntax errors and inline expression interpolation via \`\${expression}\`.
* **Searching:** \`str.includes("sub")\`, \`str.indexOf("sub")\`, \`str.lastIndexOf("sub")\`, \`str.startsWith()\`, \`str.endsWith()\`.
* **Extracting Substrings:**
  * **\`str.slice(start, end)\`:** Extracts from \`start\` up to (but not including) \`end\`. **Supports negative indices** (e.g., \`str.slice(-4)\` extracts the last 4 characters).
  * **\`str.substring(start, end)\`:** Similar to \`slice\`, but **treats negative indices as \`0\`** and automatically swaps \`start\` and \`end\` if \`start > end\`.
* **Transforming:** \`str.toUpperCase()\`, \`str.toLowerCase()\`, \`str.trim()\` / \`trimStart()\` / \`trimEnd()\`, \`str.replace(old, new)\`, \`str.replaceAll(old, new)\`, and \`str.split(delimiter)\` (converts a string into an Array).

### 💡 JavaScript \`Date\` Internals: Unix Epoch & UTC vs. Local Time
* **Unix Epoch Milliseconds:** Internally, a JavaScript \`Date\` is a single integer counting milliseconds elapsed since **January 1, 1970, 00:00:00 UTC**. Calling \`Date.now()\` or \`new Date().getTime()\` returns this exact millisecond timestamp, which is completely timezone-independent (ideal for countdown timers and database timestamps).
* **Quirk — Months Are 0-Indexed in Numeric Constructors:**
  * When passing numbers \`new Date(2025, 9, 18)\`, month \`0\` is January and month \`9\` is **October**!
  * However, when passing an ISO string \`new Date("2025-10-18")\`, month \`10\` is **October** (1-indexed).
* **UTC vs. Local Time (e.g., IST = UTC + 5:30):** Servers and databases always communicate in **UTC** (ending in \`Z\`, e.g., \`2025-10-01T12:00:00.000Z\`). When a browser renders that UTC date using \`.toString()\` or \`.toLocaleString()\`, it automatically converts it to the user's local OS timezone (adding \`+5 hours 30 minutes\` in India).

### 🛠️ Code Examples: String Manipulation & Date/Timezone Handling
\`\`\`javascript
// 1. Template Literals & String Extraction (slice vs. substring)
const course = "Strike is coming soon";
console.log(\`Announcement: \${course.toUpperCase()}!\`);

console.log(course.slice(0, 6));      // "Strike"
console.log(course.slice(-4));        // "soon" (negative index counts from end)
console.log(course.substring(-4, 6)); // "Strike" (negative treated as 0)

// 2. Replace, Split, and Trim
const rawInput = "   rohit,mohit,aman   ";
const namesArray = rawInput.trim().split(",");
console.log(namesArray); // ["rohit", "mohit", "aman"]

// 3. Date Object, Unix Epoch Milliseconds & 0-Indexed Months
const nowMs = Date.now(); // Milliseconds since Jan 1, 1970 UTC
const octDateNumeric = new Date(2025, 9, 18); // Month 9 = October!
const octDateString = new Date("2025-10-18T00:00:00Z"); // String = 1-indexed October

console.log(octDateString.toISOString());  // Always UTC ("...Z")
console.log(octDateString.toString());     // Converted to local timezone (e.g., IST +05:30)
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-6-q1',
        title: 'Q1: What is the difference between String.prototype.slice() and String.prototype.substring()?',
        difficulty: 'Medium',
        answer: 'Both extract characters from startIndex up to (but excluding) endIndex, but they differ in two ways: 1) Negative arguments: slice() accepts negative indices and counts backward from the end of the string (e.g., "Rohit".slice(-2) -> "it"), whereas substring() clamps any negative number or NaN to 0. 2) Swapped arguments: if start > end (e.g., (4, 1)), substring(4, 1) automatically swaps them to substring(1, 4), whereas slice(4, 1) returns an empty string "".'
      },
      {
        id: 'js-lec-6-q2',
        title: 'Q2: How can primitives like strings have methods like "rohit".toUpperCase() if primitives are not objects?',
        difficulty: 'Medium',
        answer: 'JavaScript uses a mechanism called Auto-Boxing (Primitive Wrapper Objects). Whenever you access a property or method on a string, number, or boolean primitive, the JS engine momentarily wraps the primitive inside a temporary new String(str) object in memory, executes the method from String.prototype, returns the new result, and immediately discards the temporary wrapper object.'
      },
      {
        id: 'js-lec-6-q3',
        title: 'Q3: Why does new Date(2025, 10, 1) create a date in November instead of October, while new Date("2025-10-01") creates a date in October?',
        difficulty: 'Easy',
        answer: 'JavaScript\'s Date constructor inherited C/Java\'s legacy struct tm convention where numeric month arguments are 0-indexed (0 = January, 9 = October, 10 = November, 11 = December), while days of the month are 1-indexed (1–31). However, ISO-8601 date strings ("2025-10-01") follow standard human calendar numbering (01 = January, 10 = October).'
      },
      {
        id: 'js-lec-6-q4',
        title: 'Q4: Why should backend APIs always store and transmit timestamps in UTC (ISO-8601) or Unix Epoch milliseconds?',
        difficulty: 'Medium',
        answer: 'Users and servers are distributed across different timezones (e.g., a server in US-East serving users in India at UTC+5:30 and London at UTC+0). Storing UTC timestamps (like 2025-10-18T14:00:00Z or Date.now() epoch milliseconds) provides a single unambiguous point in time. When sent to the browser, the client\'s Date object automatically renders that UTC timestamp in the user\'s local OS timezone.'
      },
      {
        id: 'js-lec-6-q5',
        title: 'Q5: What is the difference between str.replace() and str.replaceAll()?',
        difficulty: 'Easy',
        answer: 'When passed a string pattern, str.replace("a", "b") replaces ONLY the very first occurrence of "a" (unless a global regex /a/g is used). str.replaceAll("a", "b") (introduced in ES2021) replaces every occurrence of the substring across the entire string without requiring a regular expression.'
      },
      {
        id: 'js-lec-6-q6',
        title: 'Q6: How do you calculate the exact number of days, hours, minutes, and seconds remaining for a countdown timer between now and a target future date?',
        difficulty: 'Medium',
        answer: 'Subtract the current millisecond timestamp from the target millisecond timestamp: const diffMs = targetDate.getTime() - Date.now(). Then compute: days = Math.floor(diffMs / (1000 * 60 * 60 * 24)), hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24), minutes = Math.floor((diffMs / (1000 * 60)) % 60), and seconds = Math.floor((diffMs / 1000) % 60).'
      }
    ]
  },
  {
    topic_order: 7,
    slug: 'js-lecture-7-arrays-in-depth-methods-sorting-internal-object-structure',
    title: 'Lecture 7: JavaScript Arrays In-Depth — Mutation vs. Non-Mutation, splice, flat, .sort() & Why Arrays Are Objects',
    duration_minutes: 70,
    video_url: 'http://www.youtube.com/watch?v=fuA8BQkQO_E',
    video_title: 'JavaScript Arrays Explained In-Depth  | Javascript Full Course #07',
    doc_links: [
      {
        title: 'MDN Web Docs — Array Built-In Object Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array'
      }
    ],
    short_description: 'Master array manipulation (push/pop, shift/unshift, slice vs. splice, spread, flat, lexicographical vs. numeric sort) and understand why JavaScript arrays are actually specialized Objects.',
    summary_markdown: `### 📌 Topic Overview
In C++ or Java, an array is a fixed-size, contiguous block of homogeneous memory where \`arr[i]\` is computed via \`base_address + i * sizeof(type)\`. In JavaScript, an **Array** can hold mixed types (\`[10, "Rohit", true, { a: 1 }]\`), grow dynamically, and even accept custom string keys (\`arr.name = "test"\`)—because **a JavaScript Array is actually a specialized Object under the hood** (\`typeof [] === "object"\`).

### 💡 Mutating vs. Non-Mutating Array Methods
* **End of Array (Fast O(1) — Mutates Original):**
  * **\`arr.push(val)\`:** Appends to the end.
  * **\`arr.pop()\`:** Removes and returns the last element.
* **Start of Array (Slow O(N) — Mutates Original):**
  * **\`arr.unshift(val)\`:** Inserts at index \`0\` (shifts all existing elements right).
  * **\`arr.shift()\`:** Removes index \`0\` (shifts all existing elements left).
* **\`slice(start, end)\` (Non-Mutating) vs. \`splice(start, deleteCount, ...items)\` (Mutating):**
  * **\`slice\`:** Returns a shallow copy of a portion of the array without modifying the original array.
  * **\`splice\`:** Modifies the original array in place by deleting \`deleteCount\` elements starting at \`start\` and optionally inserting new \`items\`.
* **Combining & Flattening Arrays (Non-Mutating):**
  * **Spread Operator (\`[...arr1, ...arr2]\`):** Cleaner modern alternative to \`arr1.concat(arr2)\`.
  * **\`arr.flat(depth)\`:** Flattens nested sub-arrays up to \`depth\` levels (use \`arr.flat(Infinity)\` to flatten arbitrarily deep nesting).

### 💡 The \`.sort()\` Trap: Lexicographical (UTF-16) vs. Numeric Sorting
* By default, \`arr.sort()\` converts every element into a **String** and sorts them **lexicographically (dictionary order by UTF-16 code units)**!
* As a result, \`[10, 100, 25, 5].sort()\` outputs \`[10, 100, 25, 5]\` because \`"100"\` comes before \`"25"\` alphabetically (\`"1" < "2"\`)!
* **Fix:** Always pass a numeric comparator callback:
  * **Ascending:** \`arr.sort((a, b) => a - b)\`
  * **Descending:** \`arr.sort((a, b) => b - a)\`

### 🛠️ Code Examples: Array Operations, Sorting & Object Proof
\`\`\`javascript
// 1. slice (non-mutating) vs. splice (mutating in-place)
const nums = [10, 20, 30, 40, 50];
const sliced = nums.slice(1, 4);      // [20, 30, 40], nums is unchanged
const spliced = nums.splice(1, 2, 99); // Removes [20, 30] and inserts 99 in place
console.log(nums);                    // [10, 99, 40, 50]

// 2. Fixing the Default Lexicographical .sort() Trap
const scores = [100, 25, 5, 42, 10];
console.log([...scores].sort());               // [10, 100, 25, 42, 5] (Dictionary order!)
console.log([...scores].sort((a, b) => a - b)); // [5, 10, 25, 42, 100] (Numeric Ascending)
console.log([...scores].sort((a, b) => b - a)); // [100, 42, 25, 10, 5] (Numeric Descending)

// 3. Flattening Nested Arrays & Checking Array Type
const nested = [1, [2, [3, [4]]]];
console.log(nested.flat(Infinity));   // [1, 2, 3, 4]
console.log(typeof nested);           // "object"
console.log(Array.isArray(nested));   // true (Always use Array.isArray!)
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-7-q1',
        title: 'Q1: Why is a JavaScript Array not a true traditional array like in C++, and why does typeof [] return "object"?',
        difficulty: 'Medium',
        answer: 'A traditional C++ array is a fixed-length, contiguous block of RAM storing elements of a single fixed byte-size so index lookup is base_address + index * size. In JavaScript, an array can hold heterogeneous data types (numbers, strings, objects) whose sizes vary, can grow/shrink dynamically, can have sparse holes, and can even hold arbitrary key-value properties (arr.foo = "bar"). Internally, a JS Array is an Object whose keys are stringified indices ("0", "1", "2") with an auto-updating length property and Array.prototype methods.'
      },
      {
        id: 'js-lec-7-q2',
        title: 'Q2: Why does [10, 5, 100, 25].sort() output [10, 100, 25, 5], and how does the comparator (a, b) => a - b work?',
        difficulty: 'Easy',
        answer: 'When called without arguments, Array.prototype.sort() converts each element to a string ("10", "5", "100", "25") and compares their UTF-16 character codes left-to-right. Since "1" (code 49) is less than "2" (code 50) and "5" (code 53), "100" is placed before "25" and "5". Passing (a, b) => a - b instructs sort() to check the sign of the return value: if negative (a < b), a comes first; if positive (a > b), b comes first; if 0, their relative order is preserved.'
      },
      {
        id: 'js-lec-7-q3',
        title: 'Q3: What is the exact difference between Array.prototype.slice() and Array.prototype.splice()?',
        difficulty: 'Easy',
        answer: '1) Mutability: slice(start, end) does NOT mutate the original array—it returns a new shallow-copied sub-array. splice(start, deleteCount, ...items) directly mutates the original array in place and returns an array of the deleted elements. 2) Capabilities: slice can only extract elements, whereas splice can delete, insert, or replace elements anywhere inside the array.'
      },
      {
        id: 'js-lec-7-q4',
        title: 'Q4: How do you reliably check if a variable is an Array in JavaScript if typeof returns "object"?',
        difficulty: 'Easy',
        answer: 'Always use Array.isArray(value). Unlike typeof (which returns "object" for arrays, null, and plain objects), Array.isArray([]) returns true and even works reliably across different iframes/realms where instanceof Array might fail.'
      },
      {
        id: 'js-lec-7-q5',
        title: 'Q5: Why are push() and pop() much faster than unshift() and shift() on large arrays?',
        difficulty: 'Medium',
        answer: 'push() and pop() add or remove elements at the end of the array in O(1) amortized time because no existing indices change. unshift() and shift() add or remove at index 0, which forces the engine to re-index and shift every single remaining element in the array by 1 position, taking O(N) linear time.'
      },
      {
        id: 'js-lec-7-q6',
        title: 'Q6: What happens if you assign arr[100] = "hello" on an array const arr = [1, 2]?',
        difficulty: 'Medium',
        answer: 'JavaScript creates a "sparse array" (an array with empty slots). arr.length immediately becomes 101, and indices 2 through 99 become empty slots (which return undefined if accessed, and downgrade V8\'s internal representation from a fast packed C-like backing store to a slower dictionary hash-map mode).'
      }
    ]
  },
  {
    topic_order: 8,
    slug: 'js-lecture-8-objects-in-depth-crud-destructuring-shallow-deep-copy-symbols',
    title: 'Lecture 8: JavaScript Objects In-Depth — Dot vs. Bracket Notation, Symbol, Shallow vs. Deep Copy, Destructuring & Hidden Classes',
    duration_minutes: 70,
    video_url: 'http://www.youtube.com/watch?v=iuZkPCBBV5U',
    video_title: 'JavaScript Objects Explained In-Depth  | Javascript Full Course #08',
    doc_links: [
      {
        title: 'MDN Web Docs — Object Built-In Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object'
      }
    ],
    short_description: 'Master Object CRUD operations, dot vs. dynamic bracket notation, Object.keys/values/entries, destructuring, shallow copy ({...obj}) vs. deep copy (structuredClone), Symbol keys, and V8 Hidden Classes.',
    summary_markdown: `### 📌 Topic Overview
Objects are the foundational building blocks of JavaScript. Every object stores data as **Key-Value Pairs** (where keys are automatically coerced to **Strings** or **\`Symbol\`s**, and values can be any primitive, array, nested object, or function/method).

### 💡 Dot Notation vs. Bracket Notation (\`obj.key\` vs. \`obj[expr]\`)
* **Dot Notation (\`user.age\`):** Clean and fast, but only works for valid identifier names known statically at write-time.
* **Bracket Notation (\`user["home address"]\` or \`user[dynamicVar]\`):** Mandatory when:
  1. The key contains **spaces**, hyphens, or starts with a digit (e.g., \`user["email id"]\`).
  2. You are accessing a property using a **dynamic variable** (e.g., \`const key = "age"; user[key]\` looks up \`"age"\`, whereas \`user.key\` looks for a literal property named \`"key"\`).
  3. The key is a **\`Symbol\`** (\`const sym = Symbol("id"); user[sym] = 101;\`).

### 💡 Iteration, Destructuring & \`Symbol\` Data Type
* **Static Enumeration Methods:** \`Object.keys(user)\` (array of keys), \`Object.values(user)\` (array of values), and \`Object.entries(user)\` (array of \`[key, value]\` pairs, ideal for \`for...of\` loops).
* **Object Destructuring:** Extract properties into variables cleanly: \`const { name, age: userAge, address: { city } } = user;\`.
* **Hidden \`Symbol\` Keys:** Properties keyed by a \`Symbol\` (\`{[sym]: "secret"}\`) are skipped by \`for...in\`, \`Object.keys()\`, and \`JSON.stringify()\`, preventing accidental key collisions in libraries.

### 💡 Shallow Copy vs. Deep Copy
* **Reference Assignment (\`const u2 = u1\`):** Not a copy at all! Both point to the exact same object.
* **Shallow Copy (\`{ ...u1 }\` or \`Object.assign({}, u1)\`):** Copies **top-level primitives** into a new object, but **nested objects/arrays still share the same memory reference**! Modifying \`u2.address.city\` will still mutate \`u1.address.city\`.
* **Deep Copy (\`structuredClone(u1)\`):** Recursively clones every nested object and array into completely independent memory blocks.

### 🛠️ Code Examples: Dynamic Keys, Destructuring & Shallow vs. Deep Copy
\`\`\`javascript
const idSym = Symbol("user_id");
const user = {
  name: "Rohit",
  "account balance": 3400,
  [idSym]: 991,
  address: { city: "Kotdwar", pin: 246149 }
};

// 1. Dot vs. Bracket Notation & Deleting Properties
console.log(user.name);               // "Rohit"
console.log(user["account balance"]); // 3400
console.log(user[idSym]);             // 991
delete user["account balance"];

// 2. Object Destructuring (with aliasing and nested extraction)
const { name: fullName, address: { city } } = user;
console.log(fullName, city); // "Rohit", "Kotdwar"

// 3. Shallow Copy ({ ...user }) vs. Deep Copy (structuredClone)
const shallowCopy = { ...user };
shallowCopy.address.city = "Delhi"; // MUTATES user.address.city too!

const deepCopy = structuredClone({ name: "Rohit", address: { city: "Kotdwar" } });
deepCopy.address.city = "Mumbai";   // Original object remains "Kotdwar"!
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-8-q1',
        title: 'Q1: What is the difference between a Shallow Copy and a Deep Copy of an object in JavaScript? How do {...obj}, JSON.parse(JSON.stringify(obj)), and structuredClone(obj) compare?',
        difficulty: 'Medium',
        answer: 'A Shallow Copy (created via {...obj} or Object.assign({}, obj)) creates a new top-level object and copies top-level primitive values, but copies only the memory references of nested objects/arrays—so mutating a nested object in the copy mutates the original. A Deep Copy recursively clones all nested levels. JSON.parse(JSON.stringify(obj)) performs a deep copy but fails on Date objects (turns them into strings), undefined, functions, Symbols, BigInts, and circular references. Modern JavaScript\'s built-in structuredClone(obj) performs a true deep copy that properly preserves Dates, Maps, Sets, nested objects, and circular references.'
      },
      {
        id: 'js-lec-8-q2',
        title: 'Q2: When must you use Bracket Notation obj[key] instead of Dot Notation obj.key?',
        difficulty: 'Easy',
        answer: 'You must use Bracket Notation in three scenarios: 1) When the property name is stored in a dynamic variable or expression (obj[variableName]), because obj.variableName looks for the literal string key "variableName". 2) When the property key contains spaces, hyphens, or special characters, or starts with a number (e.g., obj["first name"]). 3) When the property key is a Symbol (obj[mySymbol]).'
      },
      {
        id: 'js-lec-8-q3',
        title: 'Q3: What is the Symbol data type, and why is it used as an object key?',
        difficulty: 'Medium',
        answer: 'Every call to Symbol("desc") returns a guaranteed unique primitive value (Symbol("id") === Symbol("id") is false). When used as an object property key ({ [mySym]: 123 }), it prevents property name collisions with third-party code or future object keys, and it remains hidden from standard iteration (for...in, Object.keys(), Object.entries(), JSON.stringify()), only accessible via the Symbol reference itself or Object.getOwnPropertySymbols().'
      },
      {
        id: 'js-lec-8-q4',
        title: 'Q4: What is the difference between Object.freeze(obj) and Object.seal(obj)?',
        difficulty: 'Medium',
        answer: 'Object.seal(obj) prevents adding new properties or deleting existing properties (sets configurable: false), but still allows modifying the values of existing writable properties. Object.freeze(obj) goes further: it prevents adding, deleting, AND modifying any existing property values (sets writable: false and configurable: false). Note that both are shallow—nested objects inside a frozen object must be frozen recursively if deep immutability is required.'
      },
      {
        id: 'js-lec-8-q5',
        title: 'Q5: Why should you use for...of with Object.keys(obj) / Object.entries(obj) instead of a raw for...in loop?',
        difficulty: 'Medium',
        answer: 'A raw for (let key in obj) loop iterates over all enumerable string properties of the object PLUS any enumerable properties inherited up the prototype chain! In contrast, Object.keys(obj), Object.values(obj), and Object.entries(obj) return only the object\'s own enumerable properties (ignoring inherited prototype properties).'
      },
      {
        id: 'js-lec-8-q6',
        title: 'Q6: How does the V8 Engine optimize object property access internally using Hidden Classes (Shapes) and Inline Caching?',
        difficulty: 'Hard',
        answer: 'Because JS objects can have properties added dynamically, a naive hash-map lookup on every obj.x access would be slow. V8 attaches a "Hidden Class" (Shape/Map) to every object that records the exact memory offset of each property key, while storing the property values in a contiguous array. When multiple objects share the same property creation order, they share the same Hidden Class, allowing V8 to use Inline Caching to read obj.x in a single O(1) memory offset instruction just like a C++ struct!'
      }
    ]
  },
  {
    topic_order: 9,
    slug: 'js-lecture-9-functions-declarations-expressions-arrow-rest-iife-callbacks',
    title: 'Lecture 9: Functions In-Depth — Declarations vs. Expressions, Arrow Functions, Rest vs. Spread, IIFE & Callbacks',
    duration_minutes: 53,
    video_url: 'http://www.youtube.com/watch?v=iY8LlFRLpXQ',
    video_title: 'JavaScript Functions Explained In-Depth | Javascript Full Course #09',
    doc_links: [
      {
        title: 'MDN Web Docs — JavaScript Functions Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions'
      }
    ],
    short_description: 'Master Function Declarations, Function Expressions, ES6 Arrow Functions (implicit return and object literal parentheses), Default and Rest parameters (...args), IIFEs, and Callback functions.',
    summary_markdown: `### 📌 Topic Overview
In JavaScript, functions are **First-Class Citizens**—they can be stored in variables, passed as arguments to other functions (callbacks), and returned from functions. This lecture covers every way to define and invoke functions in modern JavaScript.

### 💡 3 Ways to Define a Function
* **1. Function Declaration:** \`function add(a, b) { return a + b; }\`
  * Fully hoisted during the memory creation phase (can be called before its definition line).
* **2. Function Expression:** \`const add = function(a, b) { return a + b; };\`
  * Stored inside a variable. Follows the hoisting/TDZ rules of \`const\` / \`let\` (cannot be called before initialization).
* **3. ES6 Arrow Function (\`=>\`):** \`const add = (a, b) => a + b;\`
  * **Implicit Return:** Omitting curly braces \`{}\` after \`=>\` automatically returns the expression.
  * **Returning an Object Literal Implicitly:** Because \`{}\` after \`=>\` is parsed as a function block body, you **must wrap an implicitly returned object literal in parentheses**: \`const createUser = (name) => ({ name: name });\`.

### 💡 Default Parameters, Rest Parameters (\`...\`) & IIFE
* **Default Parameters:** \`function greet(name = "Guest") { ... }\` — used when an argument is omitted or \`undefined\`.
* **Rest Parameter (\`...nums\`) vs. Spread Operator (\`...arr\`):**
  * **Rest (\`...nums\` in function parameter list):** Collects an arbitrary number of individual arguments into a real JavaScript **Array**.
  * **Spread (\`...arr\` in function call or array/object literal):** Unpacks an array or object into individual elements.
* **IIFE (Immediately Invoked Function Expression):** \`(function() { ... })();\` or \`(() => { ... })();\` — executes immediately upon definition to create an isolated scope and avoid polluting global variables.
* **Callback Functions:** A function passed as an argument into another function to be executed later (e.g., after an event, timer, or data operation finishes).

### 🛠️ Code Examples: Arrow Functions, Rest Parameters, IIFE & Callbacks
\`\`\`javascript
// 1. Arrow Function: Implicit Return & Returning an Object Literal
const square = x => x * x;
const makeUser = (name, age) => ({ name, age }); // Parentheses () around {} are mandatory!
console.log(square(6), makeUser("Rohit", 22));

// 2. Rest Parameter (...nums) handles any number of arguments as a real Array
function sumAll(...nums) {
  let total = 0;
  for (let n of nums) total += n;
  return total;
}
console.log(sumAll(10, 20, 30, 40)); // 100

// 3. IIFE (Immediately Invoked Function Expression)
(() => {
  const secretKey = "DB_CONN_123";
  console.log("IIFE initialized isolated environment.");
})();

// 4. Passing a Callback Function
function processOrder(amount, callback) {
  console.log("Processing payment of ₹" + amount);
  callback();
}
processOrder(500, () => console.log("Payment confirmed! Sending receipt."));
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-9-q1',
        title: 'Q1: What are the key differences between Regular Functions and ES6 Arrow Functions?',
        difficulty: 'Medium',
        answer: '1) this binding: Regular functions have their own dynamic this determined by how they are called; Arrow functions do NOT have their own this and instead inherit this lexically from their enclosing scope. 2) arguments object: Regular functions have the array-like arguments object; Arrow functions do not (use rest parameters ...args instead). 3) Constructor usage: Regular functions can be called with new; Arrow functions cannot be used as constructors (new arrowFn() throws a TypeError) and have no prototype property. 4) Syntax: Arrow functions support concise implicit returns.'
      },
      {
        id: 'js-lec-9-q2',
        title: 'Q2: Why does const getUser = () => { name: "Rohit" } return undefined instead of an object, and how do you fix it?',
        difficulty: 'Easy',
        answer: 'In an arrow function, curly braces {} immediately following the => arrow are parsed by the JavaScript engine as the start of a multi-line function block body, and name: "Rohit" is parsed as a labeled statement with no return! To implicitly return an object literal from an arrow function, wrap the curly braces in parentheses: const getUser = () => ({ name: "Rohit" }).'
      },
      {
        id: 'js-lec-9-q3',
        title: 'Q3: What is the difference between the Rest Parameter (...args) and the Spread Operator (...arr)?',
        difficulty: 'Easy',
        answer: 'Although both use the three-dots (...) syntax, they are exact opposites: 1) Rest Parameter is used in function declarations (function sum(...args)) or destructuring to gather multiple individual arguments into a single Array. 2) Spread Operator is used in function calls (Math.max(...arr)) or array/object literals ([...arr1, ...arr2]) to unpack an iterable/object into individual elements.'
      },
      {
        id: 'js-lec-9-q4',
        title: 'Q4: Why are Rest Parameters (...args) preferred over the legacy arguments object?',
        difficulty: 'Medium',
        answer: '1) arguments is an "array-like" object (it has indexed elements and a length property, but lacks Array.prototype methods like map, filter, or reduce), whereas ...args is a genuine Array instance. 2) arguments does not exist inside ES6 Arrow Functions, whereas ...args works in all functions. 3) ...args allows capturing only the remaining parameters after named parameters (e.g., function(first, ...rest)).'
      },
      {
        id: 'js-lec-9-q5',
        title: 'Q5: What is an IIFE (Immediately Invoked Function Expression) and why is it used?',
        difficulty: 'Easy',
        answer: 'An IIFE is a function wrapped in parentheses and invoked immediately after its definition: (() => { ... })(). It is used to execute initialization logic immediately while creating a private scope so internal variables do not leak into or pollute the global scope.'
      },
      {
        id: 'js-lec-9-q6',
        title: 'Q6: What is the difference between Function Parameters and Function Arguments, and when do Default Parameters trigger?',
        difficulty: 'Easy',
        answer: 'Parameters are the placeholder variable names listed in the function definition (function add(a, b)), while Arguments are the actual values passed when invoking the function (add(10, 20)). A default parameter (function greet(name = "Guest")) triggers ONLY when the argument is omitted or explicitly passed as undefined—passing null (greet(null)) will NOT trigger the default value; name will remain null!'
      }
    ]
  },
  {
    topic_order: 10,
    slug: 'js-lecture-10-execution-context-hoisting-temporal-dead-zone-call-stack',
    title: 'Lecture 10: How JavaScript Code Runs & Hoisting — Execution Context (GEC), Memory vs. Execution Phase & TDZ',
    duration_minutes: 48,
    video_url: 'http://www.youtube.com/watch?v=ijPq-u3y9cs',
    video_title: 'How JavaScript Code Runs | Hoisting in Javascript | Javascript Full Course #10',
    doc_links: [
      {
        title: 'MDN Web Docs — Hoisting & Execution Context Glossary',
        url: 'https://developer.mozilla.org/en-US/docs/Glossary/Hoisting',
        link: 'https://developer.mozilla.org/en-US/docs/Glossary/Hoisting'
      }
    ],
    short_description: 'Trace step-by-step how JavaScript creates the Global Execution Context (GEC), runs the Memory Allocation Phase and Code Execution Phase on the Call Stack, and enforces Hoisting and the Temporal Dead Zone (TDZ).',
    summary_markdown: `### 📌 Topic Overview
JavaScript does **not** execute code in a single blind top-to-bottom pass. Whenever a script runs, the engine creates a **Global Execution Context (\`GEC\`)** on the **Call Stack** and processes the code in **two distinct phases**:
1. **Phase 1: Memory Allocation (Creation) Phase**
2. **Phase 2: Code Execution Phase**

### 💡 How the 2 Phases Work (The Real Mechanism Behind Hoisting)
* **Phase 1 — Memory Allocation Phase (Before Any Line Executes):**
  * **\`var\` variables:** Allocated memory and initialized to **\`undefined\`**.
  * **\`function\` declarations:** Allocated memory in the Heap and the identifier is bound to the **actual function object/bytecode pointer**.
  * **\`let\` and \`const\` variables:** Allocated memory, but marked as **\`<uninitialized>\`** inside the **Temporal Dead Zone (TDZ)**.
* **Phase 2 — Code Execution Phase:**
  * The engine walks through the code line-by-line, assigning actual values (\`10\`, \`20\`) to variables and pushing a **new Function Execution Context (\`FEC\`)** onto the Call Stack whenever a function is invoked. Once a function returns, its Execution Context is popped off the Call Stack and garbage-collected.

### 💡 Debunking the "Hoisting Moves Code to the Top" Myth
* **The Myth:** Many tutorials claim *"JavaScript physically moves variable and function declarations to the top of the file."*
* **The Reality:** Not a single line of code is moved! **Hoisting** is simply the consequence of **Phase 1 (Memory Allocation Phase)** scanning declarations before **Phase 2 (Execution Phase)** begins.
* **Why Function Expressions & Arrow Functions Cannot Be Called Before Definition:**
  * If you write \`const add = (a, b) => a + b;\` (or \`var add = function() {}\`), \`add\` is treated as a **variable** during Phase 1 (\`<uninitialized>\` in TDZ for \`const\`/\`let\`, or \`undefined\` for \`var\`), NOT a function declaration! Calling \`add()\` before that line throws a \`ReferenceError\` (for \`let\`/\`const\`) or \`TypeError: add is not a function\` (for \`var\`).

### 🛠️ Tracing Hoisting & Temporal Dead Zone (TDZ)
\`\`\`javascript
// 1. Function Declarations are bound in Phase 1 -> Can be called early!
console.log(sum(10, 20)); // Outputs: 30

// 2. 'var' is initialized to 'undefined' in Phase 1
console.log(a);           // Outputs: undefined
var a = 10;

// 3. 'let' and 'const' are <uninitialized> in TDZ during Phase 1
// console.log(b);        // Throws ReferenceError: Cannot access 'b' before initialization
let b = 20;

function sum(num1, num2) {
  return num1 + num2;
}

// 4. Function Expression stored in const/var cannot be called before its line:
// greet();               // ReferenceError (if const/let) or TypeError (if var)
const greet = function() {
  console.log("Hello!");
};
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-10-q1',
        title: 'Q1: Walk through the two phases of an Execution Context in JavaScript. What happens to var, let, const, and function declarations in Phase 1?',
        difficulty: 'Medium',
        answer: 'Every Execution Context (Global or Function) executes in two phases: 1) Memory Allocation (Creation) Phase: The engine scans the scope for declarations. var variables are allocated and initialized to undefined; function declarations are allocated in the Heap and bound completely to their identifier; let and const declarations are allocated in the scope environment but left <uninitialized> (in the Temporal Dead Zone). 2) Code Execution Phase: The engine executes statements line-by-line, assigning actual values to variables and pushing new Function Execution Contexts onto the Call Stack for each function call.'
      },
      {
        id: 'js-lec-10-q2',
        title: 'Q2: Are let and const hoisted in JavaScript? What is the Temporal Dead Zone (TDZ)?',
        difficulty: 'Medium',
        answer: 'Yes, let and const ARE hoisted—the engine knows they exist in the scope during Phase 1 (Memory Allocation). However, unlike var (which is initialized to undefined), let and const remain <uninitialized>. The Temporal Dead Zone (TDZ) is the time window between entering the scope (Phase 1) and executing the actual line where the let or const variable is initialized in Phase 2. Accessing the variable anywhere inside the TDZ throws a ReferenceError: Cannot access variable before initialization.'
      },
      {
        id: 'js-lec-10-q3',
        title: 'Q3: What is the difference in error when calling var fn = () => {} vs. const fn = () => {} before its declaration line?',
        difficulty: 'Hard',
        answer: 'With var fn = () => {}, during Phase 1 fn is initialized to undefined. When fn() is called before the assignment line, JS tries to invoke undefined as a function and throws a TypeError: fn is not a function. With const fn = () => {}, fn is <uninitialized> inside the Temporal Dead Zone during Phase 1, so referencing fn before its declaration line throws a ReferenceError: Cannot access \'fn\' before initialization.'
      },
      {
        id: 'js-lec-10-q4',
        title: 'Q4: Why is the popular definition "Hoisting physically moves declarations to the top of the file" technically incorrect?',
        difficulty: 'Easy',
        answer: 'The JavaScript engine never rewrites or moves source code lines upward. Instead, hoisting is a byproduct of the engine\'s two-pass architecture: the compiler/interpreter registers variable and function identifiers in the Lexical Environment memory table during the Creation Phase before executing the first line of code in the Execution Phase.'
      },
      {
        id: 'js-lec-10-q5',
        title: 'Q5: What happens to a Function Execution Context (FEC) on the Call Stack once the function executes its return statement?',
        difficulty: 'Easy',
        answer: 'As soon as a function finishes executing and returns its value to the caller, its Function Execution Context is immediately popped off the Call Stack, and its local stack variables are destroyed (unless referenced by an inner closure in the Heap).'
      },
      {
        id: 'js-lec-10-q6',
        title: 'Q6: Where is a function\'s executable code actually stored in V8 when its metadata object is allocated in the Heap?',
        difficulty: 'Hard',
        answer: 'In V8, when a function is created, a JSFunction object (storing properties like name and length: number of parameters) is allocated in the Heap. That object holds an internal pointer to V8\'s dedicated Code Space in RAM, where the compiled Ignition bytecode (and TurboFan machine code) for that function body resides.'
      }
    ]
  },
  {
    topic_order: 11,
    slug: 'js-lecture-11-scope-lexical-environment-closures-higher-order-functions',
    title: 'Lecture 11: Scope, Lexical Environment, Closures & Higher-Order Functions — Data Encapsulation & Factory Patterns',
    duration_minutes: 49,
    video_url: 'http://www.youtube.com/watch?v=UBCPtXXMAWs',
    video_title: 'Closure in Javascript | Scope and High order function in javascript | Javascript Full Course #11',
    doc_links: [
      {
        title: 'MDN Web Docs — Closures & Lexical Scoping Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures'
      }
    ],
    short_description: 'Master Global, Function, and Block scope, the Lexical Scope Chain, how Closures preserve outer variables in the Heap for private state encapsulation, and Higher-Order Functions.',
    summary_markdown: `### 📌 Topic Overview
**Closures** and **Lexical Scoping** are among the most frequently asked topics in JavaScript interviews. They explain how inner functions remember variables from their outer parent function **even after the outer function has finished executing and been popped off the Call Stack**.

### 💡 Scope & The "One-Way Glass" Lexical Scope Chain
* **3 Types of Scope in JS:**
  1. **Global Scope:** Accessible everywhere in the file.
  2. **Function (Local) Scope:** Variables declared inside a function (\`var\`, \`let\`, \`const\`) are accessible only inside that function.
  3. **Block Scope (\`{ ... }\`):** \`let\` and \`const\` declared inside an \`if\`, \`for\`, or \`while\` block cannot be accessed outside that block. **\`var\` ignores block scope** and leaks out to the enclosing function or global scope!
* **Lexical Scoping & Scope Chain:** Scope is determined by **where a function is physically written in the code** (at author time), not where it is called. If a variable is not found in the current function's local memory, JS walks up the outer **Lexical Environment** chain until it reaches the Global Scope.

### 💡 What Is a Closure & How Does It Work in Memory?
* **Definition:** A **Closure** is a function bundled together with references to its surrounding **Lexical Environment** (the "backpack" of outer variables it depends on).
* **Memory Mechanics:** Normally, when \`outer()\` returns, its local variables are destroyed. However, if \`outer()\` returns an \`inner\` function that references \`count\`, V8 moves \`count\` into a **Context object in the Heap** so \`inner()\` retains a live reference to \`count\` (not a frozen copy, but the actual reference!).
* **Real-World Use Case (Data Privacy / Encapsulation):** Closures allow creating **private variables** (like a bank account \`balance\`) that external code cannot tamper with directly (\`account.balance = 999999\` is impossible), exposing only controlled methods (\`deposit()\`, \`withdraw()\`, \`getBalance()\`).

### 💡 Higher-Order Functions (HOFs)
A **Higher-Order Function** is any function that does at least one of the following:
1. Accepts another function as an argument (e.g., \`Array.prototype.map\`, \`filter\`, \`setTimeout\`).
2. Returns a new function as its result (e.g., function factories / multiplier generators).

### 🛠️ Code Examples: Closures, Private Bank Account & Higher-Order Functions
\`\`\`javascript
// 1. Classic Closure Counter (Preserves 'count' reference in Heap after createCounter returns)
function createCounter() {
  let count = 0;
  return function increment() {
    count++;
    return count;
  };
}
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 2. Real-World Closure: Private Bank Account Balance (Data Encapsulation)
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable! Cannot be accessed directly outside.

  return {
    deposit(amount) {
      if (amount > 0 && typeof amount === "number") {
        balance += amount;
        return balance;
      }
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      return "Insufficient funds";
    },
    getBalance() {
      return balance;
    }
  };
}

const rohitAccount = createBankAccount(500);
console.log(rohitAccount.deposit(200));    // 700
console.log(rohitAccount.withdraw(100));   // 600
console.log(rohitAccount.balance);         // undefined (Protected from direct mutation!)

// 3. Higher-Order Function (Returns a customized multiplier function)
function createMultiplier(factor) {
  return (number) => number * factor;
}
const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(10), triple(10)); // 20, 30
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-11-q1',
        title: 'Q1: What is a Closure in JavaScript, and how can an inner function still access outer variables after the outer function has popped off the Call Stack?',
        difficulty: 'Medium',
        answer: 'A Closure is the combination of a function and the lexical environment within which that function was declared. When the JS engine sees that an inner function references variables from its parent function, V8 allocates those captured variables in a Context object on the Heap rather than destroying them when the parent\'s stack frame pops off the Call Stack. The returned inner function holds a live reference pointer to that Heap Context.'
      },
      {
        id: 'js-lec-11-q2',
        title: 'Q2: How do you use Closures to implement Private Variables (Data Encapsulation) in JavaScript? Give a Bank Account example.',
        difficulty: 'Medium',
        answer: 'If balance is stored as a normal object property (user.balance = 500), any external script can accidentally set user.balance = "hacked" or -9999. By declaring let balance = 500 inside a factory function createBankAccount() and returning an object containing deposit(), withdraw(), and getBalance() methods, balance is hidden inside the closure scope. External code cannot access balance directly and can only interact with it through the validated methods.'
      },
      {
        id: 'js-lec-11-q3',
        title: 'Q3: Classic Interview Output Question: What is the difference between using var i vs. let i inside a for loop with setTimeout?',
        difficulty: 'Hard',
        answer: 'In for (var i = 1; i <= 3; i++) { setTimeout(() => console.log(i), 1000); }, var is function/global-scoped, so there is only ONE shared i variable in memory. By the time the 3 callbacks run after 1 second, the loop has finished and i is 4, so it prints "4, 4, 4". When using for (let i = 1; i <= 3; i++), let is block-scoped and JavaScript creates a brand-new lexical binding of i for each loop iteration, so each closure captures its own i and prints "1, 2, 3"!'
      },
      {
        id: 'js-lec-11-q4',
        title: 'Q4: Does a Closure capture a snapshot copy of the outer variable\'s value, or a live reference to the variable?',
        difficulty: 'Medium',
        answer: 'A Closure captures a live reference to the variable binding in the outer Lexical Environment, NOT a frozen copy! If the outer function (or a sibling inner function sharing the same closure) modifies the variable before or after the closure is returned, the closure sees the updated value.'
      },
      {
        id: 'js-lec-11-q5',
        title: 'Q5: What is a Higher-Order Function (HOF)? How does it relate to First-Class Functions?',
        difficulty: 'Easy',
        answer: '"First-Class Functions" is a language property meaning functions are treated like any other value (can be assigned to variables, passed as arguments, and returned). A "Higher-Order Function" is a specific function that takes advantage of this property by either accepting one or more functions as arguments (callbacks, like map/filter) or returning a function as its output.'
      },
      {
        id: 'js-lec-11-q6',
        title: 'Q6: Can Closures cause Memory Leaks in production applications? How do you prevent them?',
        difficulty: 'Hard',
        answer: 'Yes. Because a closure keeps its referenced outer variables alive in the Heap for as long as the inner function itself is reachable, holding onto a closure (e.g., in an unremoved DOM event listener or global timer) prevents the Garbage Collector from freeing large objects captured in that scope. To prevent leaks, remove event listeners/timers on cleanup and set unused references to null.'
      }
    ]
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

async function seedJavaScriptBatch1() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding JavaScript Track Batch 1 (Lectures 1 to 11) ---');
    await client.query('BEGIN');

    // 1. Create or update track 'javascript-mastery'
    let trackRes = await client.query(`SELECT id, slug, name FROM tracks WHERE slug = 'javascript-mastery' LIMIT 1;`);
    let trackId;

    const trackName = 'JavaScript & Modern ES6+ Architecture';
    const trackDesc = 'Master JavaScript from first principles—V8 memory internals, execution contexts, closures, prototypes, DOM architecture, Event Loop concurrency, Promises, async/await, and ES6+ patterns for Node.js and React.';

    if (trackRes.rows.length > 0) {
      trackId = trackRes.rows[0].id;
      await client.query(`
        UPDATE tracks SET
          name = $1,
          title = $1,
          description = $2,
          evaluation_type = 'practice',
          is_published = true,
          level = 'Intermediate'
        WHERE id = $3;
      `, [trackName, trackDesc, trackId]);
      console.log(`Updated existing track: [ID:${trackId}] ${trackName}`);
    } else {
      const insertTrack = await client.query(`
        INSERT INTO tracks (name, title, slug, description, evaluation_type, is_published, level, track_order)
        VALUES ($1, $1, 'javascript-mastery', $2, 'practice', true, 'Intermediate', 3)
        RETURNING id;
      `, [trackName, trackDesc]);
      trackId = insertTrack.rows[0].id;
      console.log(`Created new track: [ID:${trackId}] ${trackName}`);
    }

    // 2. Map track into preparation paths (Node.js, React, Full-Stack MERN)
    const targetPaths = [3, 4, 6];
    for (const pathId of targetPaths) {
      const existingMapping = await client.query(`
        SELECT id FROM path_tracks WHERE path_id = $1 AND track_id = $2;
      `, [pathId, trackId]);
      if (existingMapping.rows.length === 0) {
        const maxOrderRes = await client.query(`
          SELECT COALESCE(MAX(track_order), 0) AS max_order FROM path_tracks WHERE path_id = $1;
        `, [pathId]);
        const nextOrder = parseInt(maxOrderRes.rows[0].max_order, 10) + 1;
        await client.query(`
          INSERT INTO path_tracks (path_id, track_id, track_order)
          VALUES ($1, $2, $3);
        `, [pathId, trackId, nextOrder]);
        console.log(`Mapped track ${trackId} to path ${pathId} at order ${nextOrder}`);
      }
    }

    // 3. Remove any placeholder/dummy topics in javascript-mastery that do not match js-lecture-%
    await client.query(`
      DELETE FROM track_topics 
      WHERE track_id = $1 
        AND topic_id IN (
          SELECT id FROM topics WHERE track_id = $1 AND slug NOT LIKE 'js-lecture-%'
        );
    `, [trackId]);

    await client.query(`
      DELETE FROM topics 
      WHERE track_id = $1 AND slug NOT LIKE 'js-lecture-%';
    `, [trackId]);

    // 4. Upsert Lectures 1 to 11
    for (const lec of batch1Lectures) {
      const cleanSummary = cleanMarkdown(lec.summary_markdown);
      const sanitizedVideoUrl = sanitizeUrl(lec.video_url);

      const practiceArray = lec.interview_questions.map((q) => ({
        id: q.id,
        problemId: q.id.replace(/^js-lec-/, ''),
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
      const primaryDocUrl = sanitizedDocs[0]?.url || 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';

      const videoLinksJson = JSON.stringify([
        {
          title: lec.video_title || lec.title,
          url: sanitizedVideoUrl,
          duration: `${lec.duration_minutes || 45}m`,
          creator_name: 'Coder Army',
          creator_channel_url: 'https://www.youtube.com/@CoderArmy9'
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
            creator_name = 'Coder Army',
            creator_channel_url = 'https://www.youtube.com/@CoderArmy9',
            track_id = $9
          WHERE id = $10;
        `, [
          lec.title,
          lec.topic_order,
          lec.short_description,
          cleanSummary,
          primaryDocUrl,
          practiceJson,
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
            'Coder Army', 'https://www.youtube.com/@CoderArmy9', $10
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
          trackId
        ]);
        topicId = insertRes.rows[0].id;
      }

      // Ensure track_topics mapping
      await client.query(`
        DELETE FROM track_topics WHERE track_id = $1 AND topic_order = $2;
      `, [trackId, lec.topic_order]);

      await client.query(`
        INSERT INTO track_topics (track_id, topic_id, topic_order)
        VALUES ($1, $2, $3)
        ON CONFLICT (track_id, topic_id) DO UPDATE SET topic_order = EXCLUDED.topic_order;
      `, [trackId, topicId, lec.topic_order]);

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

    await client.query('COMMIT');
    console.log('--- JavaScript Batch 1 Seeded Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('JavaScript Batch 1 seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedJavaScriptBatch1();
