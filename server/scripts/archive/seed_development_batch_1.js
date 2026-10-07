const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const batch1Lectures = [
  {
    topic_order: 1,
    slug: 'node-lecture-1-introduction-to-nodejs-architecture-v8-libuv',
    title: 'Lecture 1: Introduction to Node.js — Client vs. Server Architecture, V8 Engine, libuv & Why Node.js Excels at Scalable Backends',
    duration_minutes: 46,
    video_url: 'http://www.youtube.com/watch?v=AZzV3wZCvI4',
    video_title: 'Lecture 1: Introduction to NodeJS | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Node.js Official Docs — Introduction to Node.js',
        url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
        link: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs'
      }
    ],
    short_description: 'Understand what Node.js is, how Client-Side and Server-Side responsibilities differ, and how V8 and libuv combine to power non-blocking, event-driven backend architectures.',
    summary_markdown: `### 📌 Topic Overview
**Node.js** is neither a programming language nor a framework—it is an open-source, cross-platform **JavaScript Runtime Environment** created by Ryan Dahl in 2009 that executes JavaScript code outside of a web browser using Chrome's **V8 Engine** and the **\`libuv\`** C library.

### 💡 Client-Side (Browser) vs. Server-Side (Node.js) Responsibilities
* **Client-Side (Browser JS / React):** Runs on the end user's device. Responsible for rendering UI, handling DOM events, animations, and sending HTTP requests. Has **window** and **document** objects, but cannot directly access server databases or the OS file system for security reasons.
* **Server-Side (Node.js):** Runs on cloud servers. Responsible for business logic, database queries (SQL/NoSQL), authentication/authorization, file system operations, and serving REST APIs or dynamic HTML. Has **global** and **process** objects, and no DOM (\`window\` or \`document\` do not exist).

### 💡 Internal Architecture of Node.js (V8 + \`libuv\`)
* **Google V8 Engine (C++):** Parses and compiles JavaScript code directly into fast native machine code using Just-In-Time (JIT) compilation.
* **\`libuv\` (C Library):** Gives Node.js access to the operating system's **asynchronous, non-blocking I/O** (file system, network sockets, DNS, child processes), manages the **Event Loop**, and maintains a background **Worker Thread Pool** for heavy I/O tasks.
* **Why Node.js Excels at I/O-Heavy Workloads:** Traditional multi-threaded servers (like Apache/Java Tomcat) spawn a dedicated OS thread per request (consuming ~1–2 MB RAM per thread and blocking on DB waits). Node.js uses a **single main event-loop thread** that delegates I/O waits to \`libuv\`, allowing a single lightweight server to handle tens of thousands of concurrent connections!

### 🛠️ Browser Global vs. Node.js Runtime Environment
\`\`\`javascript
// In Node.js, DOM objects (window, document) do NOT exist:
// console.log(window); // ReferenceError: window is not defined

// Instead, Node.js provides server-level globals:
console.log("Node.js Version:", process.version);
console.log("Operating System Platform:", process.platform);
console.log("Current Working Directory:", process.cwd());
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-1-q1',
        title: 'Q1: Is Node.js a programming language or a framework? How does it work internally?',
        difficulty: 'Easy',
        answer: 'Node.js is neither a language nor a framework—it is a cross-platform JavaScript runtime environment built on Chrome\'s V8 JavaScript engine and the libuv C++ library. V8 compiles and executes JavaScript code into native machine code, while libuv provides the Event Loop, Worker Thread Pool, and non-blocking OS-level I/O bindings (file system, TCP/UDP sockets, DNS).'
      },
      {
        id: 'node-lec-1-q2',
        title: 'Q2: How can a single-threaded Node.js server handle 10,000+ concurrent requests without blocking, compared to traditional thread-per-request servers?',
        difficulty: 'Medium',
        answer: 'In traditional thread-per-request servers, each incoming request occupies a separate OS thread that sits idle and blocks RAM while waiting for database queries or disk I/O. Node.js uses an Event-Driven, Non-Blocking I/O model: the single main thread receives a request, immediately hands off any slow I/O operation (DB query, file read, network call) to the OS kernel or libuv thread pool, and immediately moves on to serve the next user\'s request. When the I/O finishes, a callback is queued in the Event Loop.'
      },
      {
        id: 'node-lec-1-q3',
        title: 'Q3: For what types of applications is Node.js ideal, and when should you avoid running heavy tasks directly on the Node.js main thread?',
        difficulty: 'Medium',
        answer: 'Node.js is ideal for I/O-bound, data-intensive, real-time applications such as REST/GraphQL APIs, chat/WebSocket servers, streaming platforms, and microservices. You should avoid running heavy CPU-bound synchronous tasks (such as video encoding, image compression, matrix multiplication, or synchronous cryptography) directly on the main thread because a CPU-heavy task blocks the single Event Loop thread and freezes responses for all connected users (unless offloaded to Worker Threads or a separate microservice).'
      },
      {
        id: 'node-lec-1-q4',
        title: 'Q4: What are the key differences between JavaScript running in a Browser vs. JavaScript running in Node.js?',
        difficulty: 'Easy',
        answer: '1) Global Object & APIs: Browsers provide window, document (DOM), localStorage, and Web APIs; Node.js provides global, process, Buffer, and OS modules like fs, path, http, and crypto. 2) Environment Control: In a browser, you cannot control which browser version the user has installed; in Node.js, you control the exact runtime version on your server. 3) Sandbox vs. OS Access: Browser JS is sandboxed from the user\'s hard drive; Node.js has full access to the server\'s file system and network ports.'
      },
      {
        id: 'node-lec-1-q5',
        title: 'Q5: What role does libuv play in Node.js if the V8 engine already executes JavaScript?',
        difficulty: 'Medium',
        answer: 'The V8 engine only knows how to parse ECMAScript, manage the Call Stack and Memory Heap, and run garbage collection—it has no concept of files, network sockets, or OS timers. libuv is a multi-platform C library that implements the Node.js Event Loop, asynchronous TCP/UDP sockets, DNS resolution, file system operations, and a C thread pool (defaulting to 4 threads) to make cross-platform non-blocking I/O possible.'
      },
      {
        id: 'node-lec-1-q6',
        title: 'Q6: Why should critical validation and business logic always be enforced on the Backend (Node.js) even if Frontend validation exists?',
        difficulty: 'Easy',
        answer: 'Frontend code runs entirely on the client\'s machine and can be inspected, modified, or bypassed using browser DevTools, Postman, or cURL. Therefore, client-side validation is only for user experience (UX), while server-side validation, authentication, and pricing/business rules in Node.js are mandatory for actual security and data integrity.'
      }
    ]
  },
  {
    topic_order: 2,
    slug: 'node-lecture-2-installing-nodejs-ide-setup-repl-first-script',
    title: 'Lecture 2: Installing Node.js & Environment Setup — IDE Configuration, Running Scripts, Node REPL & First fs Script',
    duration_minutes: 47,
    video_url: 'http://www.youtube.com/watch?v=sqTH6_xjhBY',
    video_title: 'Lecture 2: Installing NodeJS | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Node.js Official Docs — REPL (Read-Eval-Print Loop)',
        url: 'https://nodejs.org/api/repl.html',
        link: 'https://nodejs.org/api/repl.html'
      }
    ],
    short_description: 'Set up Node.js LTS across Windows, macOS, and Linux, configure VS Code for backend development, execute JavaScript files from the terminal, and use the interactive Node REPL.',
    summary_markdown: `### 📌 Topic Overview
Before building backend servers, a developer needs a properly configured **Node.js LTS (Long-Term Support)** runtime, an **IDE (Integrated Development Environment)** like VS Code, and familiarity with executing scripts via the CLI and testing expressions in the **Node REPL**.

### 💡 Node.js Installation & Version Verification
* **LTS vs. Current Version:** Always prefer the **LTS (Long-Term Support)** version for production stability and enterprise library compatibility.
* **Verifying CLI Installation:** Installing Node.js automatically installs both the **node** runtime binary and **npm** (Node Package Manager):
  * \`node -v\` (or \`node --version\`) — prints installed Node.js version.
  * \`npm -v\` — prints installed NPM version.

### 💡 Executing Node.js Code: Script Mode vs. Interactive REPL
1. **Script Mode (\`node <filename.js>\`):** Executes an entire JavaScript file from top to bottom (e.g., \`node first.js\`).
2. **Node REPL (Read-Eval-Print Loop):** Typing \`node\` in the terminal with no filename launches an interactive shell (just like the browser DevTools Console):
   * **Read:** Reads the JavaScript expression typed by the user.
   * **Eval:** Evaluates/executes the expression in V8.
   * **Print:** Prints the returned result to the terminal.
   * **Loop:** Loops back to wait for the next command (use \`.exit\` or \`Ctrl + C\` twice to quit).

### 🛠️ Writing & Running Your First Node.js File System Script (\`first.js\`)
\`\`\`javascript
// File: first.js
// Run in terminal: node first.js
const fs = require("fs");

console.log("Completing Coding is the best!");

// Asynchronously write data to output.txt using the built-in 'fs' core module
fs.writeFile("output.txt", "Writing File using Node.js fs module", (err) => {
  if (err) {
    console.log("Error occurred:", err);
  } else {
    console.log("File written successfully!");
  }
});
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-2-q1',
        title: 'Q1: What is the Node.js REPL, what do the 4 letters stand for, and when do developers use it?',
        difficulty: 'Easy',
        answer: 'REPL stands for Read-Eval-Print Loop. Launching node in the terminal without arguments opens an interactive environment that: 1) Reads JavaScript input, 2) Evaluates the code in V8, 3) Prints the result, and 4) Loops back for the next input. Developers use it for quick prototyping, testing regular expressions, inspecting built-in modules, and debugging small snippets without creating a file.'
      },
      {
        id: 'node-lec-2-q2',
        title: 'Q2: What is the difference between Node.js LTS (Even-numbered) and Current (Odd-numbered) releases?',
        difficulty: 'Easy',
        answer: 'Even-numbered major releases (like Node 20, 22) enter Active LTS (Long-Term Support) and receive 30 months of critical bug fixes, security patches, and stability guarantees—making them the mandatory choice for production servers. Odd-numbered releases (like Node 21, 23) are short-lived experimental feature releases supported for only ~6 months.'
      },
      {
        id: 'node-lec-2-q3',
        title: 'Q3: In the Node REPL, what does the special underscore (_) variable hold?',
        difficulty: 'Easy',
        answer: 'In the Node.js REPL, the underscore (_) variable automatically stores the evaluated result of the most recently executed expression (for example, if you type 10 + 20 and press Enter, typing _ * 2 on the next line evaluates to 60).'
      },
      {
        id: 'node-lec-2-q4',
        title: 'Q4: Why does fs.writeFile("output.txt", data, callback) take a callback function as its 3rd argument?',
        difficulty: 'Medium',
        answer: 'Because fs.writeFile is an asynchronous, non-blocking I/O method! Instead of freezing the Node.js main thread while the hard drive writes the file, Node hands the disk write task to libuv and continues executing the file. Once the OS finishes writing (or encounters a permission/disk error), libuv invokes the error-first callback (err) => { ... }.'
      },
      {
        id: 'node-lec-2-q5',
        title: 'Q5: How do you access command-line arguments passed when running a Node script (e.g., node app.js port=4000)?',
        difficulty: 'Medium',
        answer: 'Using the built-in process.argv array! process.argv[0] is the path to the node executable, process.argv[1] is the path to the executed script file (app.js), and process.argv.slice(2) contains all additional user-supplied command-line arguments.'
      },
      {
        id: 'node-lec-2-q6',
        title: 'Q6: What is an IDE (Integrated Development Environment), and how does it differ from a plain text editor?',
        difficulty: 'Easy',
        answer: 'A plain text editor (like Notepad) only edits raw text characters. An IDE (or extensible code editor like VS Code) consolidates the code editor, syntax highlighter, IntelliSense/autocompletion, integrated terminal, Git version control client, and step-through debugger into a single unified workspace.'
      }
    ]
  },
  {
    topic_order: 3,
    slug: 'node-lecture-3-first-node-server-dns-http-protocols-core-modules',
    title: 'Lecture 3: First Node.js Server — How DNS & Web Protocols (HTTP/HTTPS/TCP) Work, Core Modules, require() & http.createServer()',
    duration_minutes: 39,
    video_url: 'http://www.youtube.com/watch?v=nNihy9kZmIU',
    video_title: 'Lecture 3: First Node Server | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Node.js Official Docs — HTTP Core Module & http.createServer()',
        url: 'https://nodejs.org/api/http.html',
        link: 'https://nodejs.org/api/http.html'
      }
    ],
    short_description: 'Trace how DNS resolution (Root, TLD, Authoritative servers) and TCP/HTTP/HTTPS protocols route web traffic, import built-in Core Modules via require(), and launch your first Node.js HTTP server.',
    summary_markdown: `### 📌 Topic Overview
Before writing a backend server, you must understand how a user typing \`https://example.com\` in a browser actually reaches your Node.js process running on a remote machine—and how Node's built-in **\`http\` Core Module** listens for those incoming connections.

### 💡 How DNS (Domain Name System) & the Web Work
1. **DNS Resolution (The Internet's Phonebook):** Computers communicate via numeric **IP Addresses** (e.g., \`87.52.0.13\`), not human-readable domain names. When a browser requests \`example.com\`, the **DNS Resolver** queries a 3-tier hierarchy:
   * **Root DNS Server:** Directs the query to the appropriate Top-Level Domain server based on the extension (\`.com\`, \`.in\`, \`.org\`, \`.ai\`).
   * **TLD (Top-Level Domain) Server:** Manages domains for that specific extension (e.g., Verisign for \`.com\`) and points to the domain's Authoritative Name Server.
   * **Authoritative DNS Server:** Returns the exact **IP Address** registered for \`example.com\`.
2. **TCP Handshake & HTTP/HTTPS Protocols:**
   * **TCP (Transmission Control Protocol):** Establishes a reliable, ordered connection (3-way handshake) between the client IP and server IP and re-transmits any lost packets.
   * **HTTP (Hypertext Transfer Protocol):** Defines the request-response message format over TCP (transmits data in plain text; default port \`80\`).
   * **HTTPS (HTTP Secure):** Encrypts HTTP payloads using **SSL/TLS** so attackers on the network cannot intercept passwords or tokens (default port \`443\`).

### 💡 Node.js Core Modules & The \`require()\` Keyword
* **Core Modules:** Built directly into the Node.js binary (\`fs\`, \`http\`, \`https\`, \`path\`, \`os\`, \`crypto\`, \`url\`). They require **zero \`npm install\`** and are high-performance.
* **How \`require()\` Works:**
  * Imports core modules (\`require('http')\`), third-party \`node_modules\` packages (\`require('express')\`), or local files (\`require('./myModule')\` — \`.js\` extension is optional).
  * **Module Caching:** Modules are **cached after the first \`require()\` call**, so requiring the same module in 10 files does not reload or re-execute it 10 times!

### 🛠️ Creating & Listening on Your First Node.js HTTP Server
\`\`\`javascript
// File: app.js
const http = require("http");

// Create an HTTP server with a request listener callback (req, res)
const server = http.createServer((req, res) => {
  console.log("Incoming Request Received:", req.url, req.method, req.headers);
});

const PORT = 3001;

// Bind server to PORT so the Event Loop continuously listens for client requests
server.listen(PORT, () => {
  console.log(\`Server running on address http://localhost:\${PORT}\`);
});
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-3-q1',
        title: 'Q1: Walk through the complete lifecycle of what happens when a user types a URL (like https://google.com) into a browser and presses Enter.',
        difficulty: 'Medium',
        answer: '1) DNS Resolution: The browser checks its cache, then asks the DNS Resolver to resolve the domain name through the Root DNS Server -> TLD (.com) DNS Server -> Authoritative DNS Server to obtain the server\'s IP address. 2) TCP & TLS Handshake: The browser establishes a TCP 3-way handshake (SYN, SYN-ACK, ACK) with the server IP on port 443 (and completes the TLS encryption handshake for HTTPS). 3) HTTP Request: The browser sends an HTTP GET request packet containing headers, path, and cookies. 4) Server Processing & HTTP Response: The Node.js server processes the request and sends back an HTTP status code, headers, and HTML/JSON payload, which the browser renders.'
      },
      {
        id: 'node-lec-3-q2',
        title: 'Q2: How does Node.js resolve a module path when you call require("X"), and what is Module Caching?',
        difficulty: 'Medium',
        answer: 'When require("X") is called: 1) If X does not start with "./" or "/", Node first checks if X is a built-in Core Module (like "http" or "fs"). 2) If not a core module, Node searches the local node_modules folder, walking up parent directories if needed. 3) If X starts with "./", "../", or "/", Node resolves it as a local file or directory path (automatically appending .js, .json, or /index.js). Once loaded the first time, Node caches the exported object in require.cache—subsequent require("X") calls return the cached instance immediately in O(1) time.'
      },
      {
        id: 'node-lec-3-q3',
        title: 'Q3: Why did running node app.js exit immediately when we only called http.createServer(), and what does server.listen(PORT) actually do?',
        difficulty: 'Easy',
        answer: 'http.createServer(callback) only instantiates a Server object in memory—it does not bind to a network socket, so Node sees no active handles in the Event Loop and exits immediately. Calling server.listen(PORT) binds the process to a specific TCP port on the OS network interface and registers an active listener handle in the Event Loop so the server stays alive indefinitely waiting for incoming requests.'
      },
      {
        id: 'node-lec-3-q4',
        title: 'Q4: What is a Port Number, what does the error Error: listen EADDRINUSE: address already in use :::3000 mean, and how do you fix it?',
        difficulty: 'Easy',
        answer: 'While an IP address identifies a specific machine on the network (like a building address), a Port Number (0–65535) identifies the specific application/process door on that machine (e.g., 80 for HTTP, 443 for HTTPS, 3000 for dev server). EADDRINUSE means another process (such as a previous Node server instance you forgot to stop) is already bound to port 3000. Fix it by stopping the existing terminal process with Ctrl + C (or killing the PID) or binding to another port like 3001.'
      },
      {
        id: 'node-lec-3-q5',
        title: 'Q5: What is the difference between HTTP, HTTPS, and TCP?',
        difficulty: 'Easy',
        answer: 'TCP is a Transport Layer (Layer 4) protocol responsible for establishing a connection, splitting data into packets, guaranteeing packet delivery, and reassembling them in exact order. HTTP is an Application Layer (Layer 7) protocol built on top of TCP that defines the structure of web requests and responses (headers, methods, status codes) in plain text. HTTPS is HTTP layered over TLS/SSL encryption so the data payload cannot be eavesdropped or tampered with in transit.'
      },
      {
        id: 'node-lec-3-q6',
        title: 'Q6: What is 127.0.0.1 (localhost), and does a request to localhost go out to the internet or DNS server?',
        difficulty: 'Easy',
        answer: '127.0.0.1 (mapped to the hostname localhost in the OS hosts file) is the standard IPv4 Loopback Address. Requests sent to localhost:3000 bypass external DNS servers and physical network cards entirely, looping back directly inside the local operating system kernel to reach your local Node.js server.'
      }
    ]
  },
  {
    topic_order: 4,
    slug: 'node-lecture-4-request-response-routing-headers-redirects',
    title: 'Lecture 4: Request & Response Lifecycle — Inspecting req (url, method, headers), Sending HTML via res, URL Routing & 302 Redirects',
    duration_minutes: 63,
    video_url: 'http://www.youtube.com/watch?v=9HYAaXwS7I4',
    video_title: 'Lecture 4: Request & Response | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Node.js Official Docs — Anatomy of an HTTP Transaction',
        url: 'https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction',
        link: 'https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction'
      }
    ],
    short_description: 'Inspect incoming HTTP requests (req.url, req.method, req.headers), construct HTML responses using res.setHeader, res.write, and res.end, implement multi-page routing, and trigger 302 redirects.',
    summary_markdown: `### 📌 Topic Overview
Every time a client hits a Node.js server, the \`http.createServer((req, res) => { ... })\` callback receives two critical objects:
1. **\`req\` (\`http.IncomingMessage\`):** Contains everything sent by the client.
2. **\`res\` (\`http.ServerResponse\`):** Used by the server to configure headers, status codes, and send data back to the client.

### 💡 Inspecting the Request Object (\`req\`) & Exiting the Event Loop
* **\`req.url\`:** The path requested by the client after the domain/port (e.g., \`"/"\`, \`"/products"\`, \`"/submit-details"\`).
* **\`req.method\`:** The HTTP verb used (\`"GET"\` when navigating to a URL, \`"POST"\` when submitting a form).
* **\`req.headers\`:** Key-value metadata about the client (\`host\`, \`user-agent\`, \`accept-language\`, \`cookie\`).
* **\`process.exit()\`:** Immediately terminates the Node.js Event Loop and shuts down the server process (rarely used in live servers, which are meant to run 24/7).

### 💡 Sending Responses (\`res\`), Routing & \`302\` Redirects
* **\`res.setHeader("Content-Type", "text/html")\`:** Informs the browser that the response payload is HTML.
* **\`res.write("...")\` & \`res.end()\`:** \`res.write()\` streams chunks of response data to the client, and **\`res.end()\`** signals that the response is complete.
* **Crucial Rule:** Calling \`res.write()\` or \`res.setHeader()\` **after** \`res.end()\` has already been executed throws a fatal runtime error (\`ERR_HTTP_HEADERS_SENT\` / \`write after end\`)! Always \`return res.end();\` inside conditional route blocks so execution stops immediately.
* **Redirecting the Client (\`302 Found\`):** To redirect a user after a \`POST\` form submission back to \`"/"\`, set **\`res.statusCode = 302\`** and **\`res.setHeader("Location", "/")\`** before calling **\`res.end()\`**.

### 🛠️ Multi-Route Node.js Server with Form Input & 302 Redirect
\`\`\`javascript
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html><head><title>Complete Coding</title></head><body>");
    res.write("<h1>Enter Your Details:</h1>");
    res.write('<form action="/submit-details" method="POST">');
    res.write('<input type="text" name="username" placeholder="Enter your name"><br>');
    res.write('<label for="male">Male</label><input type="radio" id="male" name="gender" value="male">');
    res.write('<label for="female">Female</label><input type="radio" id="female" name="gender" value="female"><br>');
    res.write('<input type="submit" value="Submit">');
    res.write("</form></body></html>");
    return res.end(); // Mandatory 'return' so code below does not execute!
  } else if (req.url.toLowerCase() === "/submit-details" && req.method === "POST") {
    fs.writeFileSync("user.txt", "Prashant Jain");
    res.statusCode = 302;               // 302 = Temporary Redirect
    res.setHeader("Location", "/");     // Redirect browser back to Home '/'
    return res.end();
  }

  // Fallback response for any other route
  res.setHeader("Content-Type", "text/html");
  res.write("<html><body><h1>Like / Share / Subscribe</h1></body></html>");
  res.end();
});

server.listen(3001);
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-4-q1',
        title: 'Q1: Why do we get the error "Cannot set headers after they are sent to the client" (ERR_HTTP_HEADERS_SENT) in Node.js, and how do we prevent it?',
        difficulty: 'Medium',
        answer: 'Once res.end() (or res.send() in Express) is called, the HTTP headers and response body are flushed over the TCP socket and the response is closed. However, calling res.end() does NOT automatically exit the JavaScript function! If an if (req.url === "/") block calls res.end() without a return statement (or without an else block), execution continues to the lines below and tries to call res.setHeader() or res.write() a second time on the same closed response. Always write return res.end(); to exit the callback immediately.'
      },
      {
        id: 'node-lec-4-q2',
        title: 'Q2: How do you perform an HTTP Redirect in a raw Node.js http server, and what is the difference between Status Code 301 and 302?',
        difficulty: 'Medium',
        answer: 'To redirect in raw Node.js, set res.statusCode = 302, set the target URL via res.setHeader("Location", "/new-path"), and call res.end(). Status 302 (Found / Temporary Redirect) tells the browser that the redirect is temporary (used after POST form submissions in the Post/Redirect/Get pattern). Status 301 (Moved Permanently) tells browsers and search engines to cache the redirect permanently and update bookmarks/SEO links.'
      },
      {
        id: 'node-lec-4-q3',
        title: 'Q3: What is the difference between GET and POST requests when submitting an HTML <form>?',
        difficulty: 'Easy',
        answer: '1) GET appends form fields directly into the URL query string (?username=rohit&gender=male), making them visible in browser history/bookmarks and limited by URL length; GET should only be used for idempotent data retrieval/search. 2) POST sends form fields inside the HTTP Request Body stream (not in the URL), supports large payloads and file uploads, and is used when creating or mutating state on the server.'
      },
      {
        id: 'node-lec-4-q4',
        title: 'Q4: Why does a browser send TWO requests to your Node.js server when you open http://localhost:3001/ in a tab?',
        difficulty: 'Easy',
        answer: 'The first request is GET / for the webpage HTML itself. Immediately after, the browser automatically sends a second background request GET /favicon.ico to fetch the small icon displayed on the browser tab!'
      },
      {
        id: 'node-lec-4-q5',
        title: 'Q5: What is the difference between res.write() and res.end()?',
        difficulty: 'Easy',
        answer: 'res.write(chunk) sends a chunk of the response body to the client stream and can be called multiple times to stream HTML or data progressively. res.end([data]) MUST be called exactly once on every response: it optionally sends a final chunk of data and signals to the client that the response transmission is complete.'
      },
      {
        id: 'node-lec-4-q6',
        title: 'Q6: Why should you never call process.exit() inside an HTTP request handler in a production web server?',
        difficulty: 'Easy',
        answer: 'process.exit() immediately kills the entire Node.js OS process and stops the Event Loop! If User A triggers a route containing process.exit(), the entire web server shuts down, dropping all active connections and making the website offline for every other user.'
      }
    ]
  },
  {
    topic_order: 5,
    slug: 'node-lecture-5-parsing-requests-streams-chunks-buffers-commonjs-modules',
    title: 'Lecture 5: Parsing Requests — Streams, Chunks, Buffers (req.on("data"), req.on("end"), Buffer.concat), URLSearchParams & CommonJS Modules',
    duration_minutes: 77,
    video_url: 'http://www.youtube.com/watch?v=u2CKVFcvaxA',
    video_title: 'Lecture 5: Parsing Request | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Node.js Official Docs — Buffer & Stream APIs',
        url: 'https://nodejs.org/api/buffer.html',
        link: 'https://nodejs.org/api/buffer.html'
      }
    ],
    short_description: 'Process incoming POST payloads using Node.js Streams, Chunks, and Buffers (req.on("data"), req.on("end"), Buffer.concat), decode form data with URLSearchParams, and modularize code using module.exports.',
    summary_markdown: `### 📌 Topic Overview
When a client sends a \`POST\` request (whether a small login form or a 6 GB video upload), the payload does **not** arrive at the server in one giant piece. Instead, data travels across the network as a continuous **Stream** of small binary packets called **Chunks**.

### 💡 Streams, Chunks & Buffers in Node.js
* **Stream:** Continuous flow of data over time from source (Client socket) to destination (Server). Allows Node.js to start processing data immediately without waiting for the entire file to finish uploading, keeping RAM usage minimal.
* **Chunk:** Each individual fragment of binary data emitted by a stream as it arrives.
* **Buffer:** A temporary fixed-size allocation of raw binary memory (outside the V8 Heap) that collects and holds binary **Chunks** until they are ready to be decoded into a UTF-8 string via **\`Buffer.concat(body).toString()\`**.

### 💡 Step-by-Step Pipeline for Parsing a \`POST\` Request Body
1. **Listen for \`"data"\` Events (\`req.on("data", chunk => ...)\`):** Fires every time a new binary chunk arrives. Push each \`chunk\` into an array \`const body = []\`.
2. **Listen for the \`"end"\` Event (\`req.on("end", () => ...)\`):** Fires once all chunks have arrived.
3. **Concatenate & Decode (\`Buffer.concat(body).toString()\`):** Combines all binary chunks and decodes them into a URL-encoded string like \`"username=Prashant+Jain&gender=male"\`.
4. **Parse Key-Value Pairs (\`URLSearchParams\` & \`Object.fromEntries\`):**
   * Pass the string into \`const params = new URLSearchParams(fullBody)\`.
   * Convert it into a clean JavaScript object: \`const bodyObject = Object.fromEntries(params)\`.

### 💡 Splitting Code into Custom Modules (\`module.exports\`)
To keep \`app.js\` clean, move the request handler into \`user.js\` and export it using **\`module.exports = userRequestHandler\`** (or export multiple items as an object \`module.exports = { handler: ..., extra: ... }\`).

### 🛠️ Complete Stream Buffering & \`URLSearchParams\` Parsing Example
\`\`\`javascript
// File: user.js
const fs = require("fs");

const userRequestHandler = (req, res) => {
  if (req.url === "/submit-details" && req.method === "POST") {
    const body = [];

    // 1. Collect each incoming binary Buffer chunk from the Readable Stream
    req.on("data", (chunk) => {
      console.log("Received Chunk:", chunk);
      body.push(chunk);
    });

    // 2. When stream ends, concatenate chunks, decode to string, and parse key-values
    req.on("end", () => {
      const fullBody = Buffer.concat(body).toString();
      console.log("Raw Decoded Body:", fullBody); // e.g. "username=Prashant+Jain&gender=male"

      const params = new URLSearchParams(fullBody);
      const bodyObject = Object.fromEntries(params);
      console.log("Parsed Object:", bodyObject); // { username: "Prashant Jain", gender: "male" }

      fs.writeFileSync("user.txt", JSON.stringify(bodyObject));
    });

    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
};

module.exports = userRequestHandler;
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-5-q1',
        title: 'Q1: What are Streams, Chunks, and Buffers in Node.js, and why does Node.js receive POST request bodies as Streams instead of a single pre-loaded object?',
        difficulty: 'Medium',
        answer: 'A Stream is an abstract interface for working with continuous flowing data over time. A Chunk is a small fragment of data emitted by a stream, and a Buffer is a raw binary memory allocation used to temporarily hold chunks before processing. Node.js receives HTTP bodies as Streams because a client might upload a 2 GB file—if Node waited to load the entire 2 GB payload into RAM before invoking your handler, just a few concurrent uploads would crash the server with an Out-Of-Memory error!'
      },
      {
        id: 'node-lec-5-q2',
        title: 'Q2: Why can\'t you access the parsed POST body synchronously right after calling req.on("data", ...) and req.on("end", ...)?',
        difficulty: 'Medium',
        answer: 'req.on("data", cb) and req.on("end", cb) only register asynchronous event listeners—they do NOT pause execution! The chunks arrive over the network asynchronously in the background. Therefore, the complete body is ONLY available inside the req.on("end", () => { ... }) callback after all chunks have been received.'
      },
      {
        id: 'node-lec-5-q3',
        title: 'Q3: How does Buffer.concat(body).toString() work, and how does URLSearchParams convert "username=Prashant+Jain&gender=male" into a JS object?',
        difficulty: 'Medium',
        answer: 'Each chunk pushed into the body array during "data" events is a binary Buffer instance. Buffer.concat(body) merges all those Buffer instances into a single contiguous Buffer, and .toString() decodes the UTF-8 bytes into a URL-encoded string ("username=Prashant+Jain&gender=male"). Passing that string to new URLSearchParams(fullBody) parses the key=value pairs and decodes "+" / "%20" into spaces, and Object.fromEntries(params) converts those [key, value] entries into a plain object { username: "Prashant Jain", gender: "male" }.'
      },
      {
        id: 'node-lec-5-q4',
        title: 'Q4: What are the 4 types of Streams in Node.js?',
        difficulty: 'Medium',
        answer: '1) Readable Streams: Streams from which data can be read (e.g., http.IncomingMessage req, fs.createReadStream). 2) Writable Streams: Streams to which data can be written (e.g., http.ServerResponse res, fs.createWriteStream). 3) Duplex Streams: Streams that are both Readable and Writable simultaneously (e.g., TCP net.Socket). 4) Transform Streams: Duplex streams that modify or transform data as it passes through (e.g., zlib.createGzip compression).'
      },
      {
        id: 'node-lec-5-q5',
        title: 'Q5: What is the difference between module.exports and exports in Node.js CommonJS modules?',
        difficulty: 'Hard',
        answer: 'In every CommonJS file, module.exports is the actual object returned by require(). The variable exports is simply a shorthand reference pointer initialized to point to module.exports (let exports = module.exports). If you attach properties via exports.handler = fn, it works because it mutates the shared object. However, if you reassign exports = fn directly, you break the reference to module.exports, and require() will return an empty object {}! Therefore, always use module.exports = ... when exporting a single function or object.'
      },
      {
        id: 'node-lec-5-q6',
        title: 'Q6: Where are Node.js Buffer instances allocated in memory?',
        difficulty: 'Hard',
        answer: 'Buffer instances represent fixed-length sequences of raw binary bytes and are allocated in C++ memory outside the V8 JavaScript Heap (though backed by ArrayBuffer references), allowing Node.js to manipulate binary network packets and file streams directly without V8 string encoding overhead.'
      }
    ]
  },
  {
    topic_order: 6,
    slug: 'node-lecture-6-event-loop-phases-libuv-worker-threads-async-code',
    title: 'Lecture 6: Event Loop & Asynchronous Code — Event-Driven Programming, V8 vs. libuv Thread Pool, Event Loop Phases & writeFileSync vs. writeFile',
    duration_minutes: 50,
    video_url: 'http://www.youtube.com/watch?v=Pk9J0SvNXUs',
    video_title: 'Lecture 6: Event Loop and Async Code | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Node.js Official Docs — The Node.js Event Loop, Timers, and process.nextTick()',
        url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
        link: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick'
      }
    ],
    short_description: 'Master the 6 phases of the Node.js Event Loop (Timers, Pending Callbacks, Poll, Check, Close), process.nextTick() priority, libuv Worker Threads, and why fs.writeFileSync must be replaced with async fs.writeFile.',
    summary_markdown: `### 📌 Topic Overview
This lecture dives deep into **Event-Driven Programming** in Node.js: how the single-threaded **Event Loop** coordinates with **\`libuv\`'s Worker Thread Pool**, the exact phase order of the Node.js Event Loop, and why blocking synchronous methods like \`fs.writeFileSync()\` are dangerous in web servers.

### 💡 The 6 Phases of the Node.js Event Loop & Microtask Priority
Unlike the simplified browser Event Loop diagram, the **Node.js \`libuv\` Event Loop** cycles through distinct phases in order:
1. **Timers Phase:** Executes callbacks scheduled by **\`setTimeout()\`** and **\`setInterval()\`** whose threshold time has expired.
2. **Pending Callbacks (I/O Callbacks) Phase:** Executes I/O callbacks deferred to the next loop iteration (such as certain TCP socket errors).
3. **Idle, Prepare Phase:** Used internally by Node/\`libuv\`.
4. **Poll Phase:** Retrieves new I/O events and executes I/O-related callbacks (such as **\`fs.readFile\` / \`fs.writeFile\`**, incoming HTTP/network data).
5. **Check Phase:** Executes callbacks scheduled specifically via **\`setImmediate()\`**.
6. **Close Callbacks Phase:** Executes close event callbacks (e.g., \`socket.on("close", ...)\`).
* **Microtask Priority Between Phases:** Before moving from one phase to the next, Node drains the **\`process.nextTick()\` queue** (highest priority!) and the **Promise Microtask queue** (\`Promise.resolve().then()\`).

### 💡 Blocking (\`fs.writeFileSync\`) vs. Non-Blocking (\`fs.writeFile\`)
* **\`fs.writeFileSync("user.txt", data)\` (Blocking — BAD in Request Handlers):** Forces the single main Event Loop thread to wait for the OS disk write to finish before doing anything else—freezing the server for all other users!
* **\`fs.writeFile("user.txt", data, err => { ... })\` (Non-Blocking — GOOD):** Offloads the file write to a **\`libuv\` Worker Thread** and only sends the **\`302\` redirect inside the callback** once the file write completes.

### 🛠️ Proper Asynchronous File Write + Redirect Inside \`req.on("end")\`
\`\`\`javascript
// Correct Non-Blocking Pattern: Send 302 Redirect ONLY inside fs.writeFile callback!
req.on("end", () => {
  const fullBody = Buffer.concat(body).toString();
  const params = new URLSearchParams(fullBody);
  const bodyObject = Object.fromEntries(params);

  // Offloads disk write to libuv Worker Thread Pool without blocking Event Loop:
  fs.writeFile("user.txt", JSON.stringify(bodyObject), (err) => {
    console.log("Data written successfully!");
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  });
});
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-6-q1',
        title: 'Q1: Why was it a bug in Lecture 5 to place res.statusCode = 302 and res.end() OUTSIDE the req.on("end") and fs.writeFile() callbacks?',
        difficulty: 'Medium',
        answer: 'Because req.on("end") and fs.writeFile() are asynchronous! If res.end() is placed outside req.on("end"), the server immediately sends the 302 redirect response back to the client BEFORE the request chunks have even finished arriving or been written to disk! Furthermore, if downstream code depends on the newly written file (or database record) on the redirected page, the redirected GET / request will arrive before fs.writeFile has finished writing. Placing res.end() inside the fs.writeFile callback guarantees the response is sent only after the write succeeds.'
      },
      {
        id: 'node-lec-6-q2',
        title: 'Q2: Explain the difference between fs.writeFileSync() and fs.writeFile(). When (if ever) is it acceptable to use Sync methods in Node.js?',
        difficulty: 'Easy',
        answer: 'fs.writeFileSync() blocks the single main Event Loop thread until the disk operation finishes, preventing the server from accepting or processing any other user requests during that time. fs.writeFile() is non-blocking: it delegates the disk write to libuv\'s worker thread pool and invokes a callback when done. Sync methods (readFileSync) are ONLY acceptable once at initial server startup (e.g., loading config/SSL certificates before server.listen()), NEVER inside HTTP request handlers!'
      },
      {
        id: 'node-lec-6-q3',
        title: 'Q3: What is the difference between process.nextTick(), Promise.resolve().then(), setTimeout(fn, 0), and setImmediate()?',
        difficulty: 'Hard',
        answer: '1) process.nextTick(fn) has the highest priority of all asynchronous callbacks in Node.js—it runs immediately after the current synchronous operation completes, even before Promises and before the Event Loop continues! 2) Promise.resolve().then(fn) runs in the Microtask queue right after process.nextTick. 3) setTimeout(fn, 0) runs in the Timers phase (Phase 1) of the Event Loop. 4) setImmediate(fn) runs in the Check phase (Phase 5) immediately after the Poll I/O phase.'
      },
      {
        id: 'node-lec-6-q4',
        title: 'Q4: Inside an I/O callback (like fs.readFile), which executes first: setTimeout(fn, 0) or setImmediate(fn)?',
        difficulty: 'Hard',
        answer: 'Inside an fs.readFile callback, setImmediate(fn) is 100% guaranteed to execute BEFORE setTimeout(fn, 0)! Why? Because fs.readFile callbacks execute during the Poll Phase (Phase 4) of the Event Loop. The very next phase after Poll is the Check Phase (Phase 5), which runs setImmediate() callbacks—whereas setTimeout() must wait for the loop to wrap all the way back around to the Timers Phase (Phase 1).'
      },
      {
        id: 'node-lec-6-q5',
        title: 'Q5: How many worker threads does libuv\'s Thread Pool have by default, what tasks use it, and can it be increased?',
        difficulty: 'Medium',
        answer: 'By default, libuv\'s Thread Pool has 4 worker threads. It is used for operations that do not have native non-blocking OS kernel APIs across all platforms: specifically File System (fs.*) operations, DNS lookups (dns.lookup), crypto (crypto.pbkdf2, randomBytes), and zlib compression. You can increase the pool size (up to 1024) by setting the environment variable process.env.UV_THREADPOOL_SIZE = 8.'
      },
      {
        id: 'node-lec-6-q6',
        title: 'Q6: Trace the exact console output order of: console.log("1"); setTimeout(() => console.log("2"), 0); setImmediate(() => console.log("3")); Promise.resolve().then(() => console.log("4")); process.nextTick(() => console.log("5")); console.log("6");',
        difficulty: 'Hard',
        answer: 'First, synchronous code runs on the Call Stack: "1", then "6". Next, Node drains process.nextTick: "5". Next, Node drains Promise microtasks: "4". Finally, the Event Loop enters Timers and Check phases: "2" and "3" (in top-level main module, "2" usually runs before "3"). Output: 1 -> 6 -> 5 -> 4 -> 2 -> 3.'
      }
    ]
  },
  {
    topic_order: 7,
    slug: 'node-lecture-7-npm-package-json-scripts-dependencies-nodemon',
    title: 'Lecture 7: NPM (Node Package Manager) & Developer Tooling — npm init, package.json, Custom Scripts, devDependencies & nodemon',
    duration_minutes: 26,
    video_url: 'http://www.youtube.com/watch?v=Y-hNztFGOXo',
    video_title: 'Lecture 7: NPM and Tools | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'NPM Official Docs — Configuring package.json & Scripts',
        url: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json',
        link: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json'
      }
    ],
    short_description: 'Initialize Node.js projects with npm init, configure package.json scripts (npm start vs. npm run), manage dependencies vs. devDependencies, understand transitive dependencies in node_modules, and automate server reloads with nodemon.',
    summary_markdown: `### 📌 Topic Overview
**NPM (Node Package Manager)** serves two essential roles in the Node.js ecosystem:
1. It is the **world's largest online public registry** of open-source JavaScript packages (\`express\`, \`mongoose\`, \`nodemon\`, \`react\`).
2. It is a **command-line project manager** that initializes \`package.json\`, runs custom automation scripts, and resolves project dependencies.

### 💡 Initializing a Project & \`package.json\` Scripts
* **\`npm init\` (or \`npm init -y\`):** Creates the **\`package.json\`** manifest file containing project metadata (\`name\`, \`version\`, \`main\` entry point, \`scripts\`, \`dependencies\`, and \`devDependencies\`).
* **Special Scripts vs. Custom Scripts:**
  * **\`"start": "nodemon app.js"\`:** Because \`start\` (and \`test\`) are reserved lifecycle names in NPM, you can run it directly via **\`npm start\`**!
  * **Custom Script Names (e.g., \`"dev"\`):** Any non-standard script name **requires the \`run\` keyword**: **\`npm run dev\`** (running \`npm dev\` without \`run\` fails as an unknown command).

### 💡 Installing Packages, \`devDependencies\` & \`node_modules\`
* **Production Dependencies (\`npm install express\` or \`--save\`):** Packages required at runtime in production. Recorded under \`"dependencies"\`.
* **Development Dependencies (\`npm install nodemon --save-dev\` or \`-D\`):** Tools only needed during local development (like \`nodemon\`, \`tailwindcss\`, testing libraries). Recorded under \`"devDependencies"\`.
* **Global Installation (\`npm install -g nodemon\`):** Installs a CLI tool system-wide on your machine rather than inside a single project folder.
* **Transitive Dependencies & Why \`node_modules\` Is Never Committed to Git:** Installing 1 package (\`nodemon\`) automatically installs ~30 packages into \`node_modules\` because \`nodemon\` depends on other packages. You **always ignore \`node_modules/\` in \`.gitignore\`** and only commit \`package.json\` (and \`package-lock.json\`). Running **\`npm install\`** recreates the entire folder.

### 🛠️ Example \`package.json\` & Essential NPM Commands
\`\`\`json
{
  "name": "npm-test-server",
  "version": "1.0.0",
  "description": "Node.js project with nodemon auto-reload",
  "main": "app.js",
  "scripts": {
    "start": "nodemon app.js",
    "dev": "nodemon app.js"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
\`\`\`

\`\`\`bash
# 1. Initialize package.json
npm init -y

# 2. Install nodemon as a Development Dependency (-D / --save-dev)
npm install nodemon --save-dev

# 3. Recreate node_modules from package.json after cloning a repository
npm install

# 4. Run standard 'start' script vs. custom 'dev' script
npm start
npm run dev
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-7-q1',
        title: 'Q1: What is the difference between dependencies and devDependencies in package.json?',
        difficulty: 'Easy',
        answer: '"dependencies" (installed via npm install <pkg>) are packages required by your application to run in production (such as express, mongoose, jsonwebtoken, bcrypt). "devDependencies" (installed via npm install <pkg> --save-dev or -D) are tools only needed during local development, building, or testing (such as nodemon, eslint, jest, tailwindcss). When deploying to production with npm install --omit=dev (or --production), devDependencies are skipped to keep the production container small and secure.'
      },
      {
        id: 'node-lec-7-q2',
        title: 'Q2: Why can we run "npm start" directly, whereas a custom script named "dev" requires "npm run dev"?',
        difficulty: 'Easy',
        answer: 'In NPM, only four built-in lifecycle script names have shorthand top-level CLI aliases: start, stop, restart, and test (so npm start is a built-in alias for npm run start). For any custom script name defined in package.json (such as "dev", "build", or "seed"), you must explicitly use npm run <script-name> so NPM doesn\'t confuse your script name with a built-in NPM CLI command.'
      },
      {
        id: 'node-lec-7-q3',
        title: 'Q3: Why do we never push the node_modules folder to GitHub, and what are Transitive Dependencies?',
        difficulty: 'Easy',
        answer: 'When you install a single package like nodemon or express, that package relies on its own sub-dependencies, which in turn rely on further sub-dependencies—these are called Transitive Dependencies, and they quickly balloon node_modules to thousands of files and hundreds of megabytes. Because package.json and package-lock.json record the exact dependency tree, node_modules is excluded via .gitignore and reconstructed on any machine by running npm install.'
      },
      {
        id: 'node-lec-7-q4',
        title: 'Q4: What is Semantic Versioning (SemVer) in package.json (e.g., "^3.1.7" vs. "~3.1.7")?',
        difficulty: 'Medium',
        answer: 'SemVer follows MAJOR.MINOR.PATCH (3.1.7): MAJOR (3) increments for breaking changes, MINOR (1) increments for backward-compatible new features, and PATCH (7) increments for backward-compatible bug fixes. The caret (^3.1.7) allows automatic updates to any minor or patch version within Major version 3 (i.e., >=3.1.7 <4.0.0). The tilde (~3.1.7) is stricter and only allows patch updates within Minor version 3.1 (i.e., >=3.1.7 <3.2.0). No prefix ("3.1.7" via --save-exact) locks the exact version.'
      },
      {
        id: 'node-lec-7-q5',
        title: 'Q5: What is the difference between package.json and package-lock.json?',
        difficulty: 'Medium',
        answer: 'package.json defines the version ranges (like "^4.18.0") of your direct dependencies, scripts, and project metadata. package-lock.json is auto-generated by NPM and locks the exact resolved version number, download URL, and cryptographic integrity hash of every direct AND transitive dependency in node_modules—guaranteeing that every developer and production server installs the exact same dependency tree.'
      },
      {
        id: 'node-lec-7-q6',
        title: 'Q6: Why did running "nodemon app.js" directly in the terminal fail when nodemon was only installed locally, but worked inside "npm start"?',
        difficulty: 'Medium',
        answer: 'When you install a package locally (without -g), its binary executable is placed inside ./node_modules/.bin/nodemon, which is NOT in your operating system\'s global PATH variable—so typing nodemon directly in the terminal fails unless you install it globally (npm i -g nodemon) or use npx nodemon. However, when you run npm start, NPM automatically adds ./node_modules/.bin to the execution PATH for all package.json scripts!'
      }
    ]
  },
  {
    topic_order: 8,
    slug: 'node-lecture-8-errors-and-debugging-syntax-runtime-logical-vscode-debugger',
    title: 'Lecture 8: Errors & Debugging in Node.js — Syntax, Runtime, and Logical Errors, VS Code Breakpoints & Debugging Async Callbacks',
    duration_minutes: 35,
    video_url: 'http://www.youtube.com/watch?v=gG47rm_vg8M',
    video_title: 'Lecture 8: Errors and Debugging | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Node.js Official Docs — Debugging Node.js Guide',
        url: 'https://nodejs.org/en/learn/getting-started/debugging',
        link: 'https://nodejs.org/en/learn/getting-started/debugging'
      }
    ],
    short_description: 'Classify Syntax, Runtime, and Logical errors in Node.js, read stack traces effectively, inspect live variables and Call Stacks with VS Code Breakpoints, and debug asynchronous callbacks with nodemon.',
    summary_markdown: `### 📌 Topic Overview
Every backend engineer must be able to systematically diagnose and fix the **3 categories of programming errors** (**Syntax**, **Runtime**, and **Logical**) using stack traces and the interactive **VS Code Node.js Debugger** rather than relying solely on scattered \`console.log()\` statements.

### 💡 The 3 Categories of Errors in Node.js
1. **Syntax Errors (Caught Immediately Before Execution):**
   * Violating JavaScript grammar rules (e.g., missing a closing parenthesis, unclosed string quotes, using a reserved keyword as a variable name \`let new = 5;\`, or \`const x;\` without initialization).
   * Easiest to fix because the parser immediately points to the exact file and line number and refuses to start the server.
2. **Runtime Errors (Crash During Execution):**
   * Valid syntax that asks the engine to perform an impossible operation at runtime:
   * Referencing an undeclared variable (\`console.log(x)\` -> \`ReferenceError: x is not defined\`).
   * Calling a number as a function (\`let num = 98; num();\` -> \`TypeError: num is not a function\`).
   * Calling \`res.write()\` after \`res.end()\`, or passing invalid single-quoted JSON into \`JSON.parse()\`.
3. **Logical Errors (Hardest to Catch — Silent Wrong Output):**
   * The server runs without crashing, but produces the wrong result due to faulty developer logic:
   * Using assignment \`=\` instead of comparison \`===\` inside an \`if\` condition (\`if (num = 10)\` always assigns \`10\` and evaluates to truthy!).
   * Off-by-one loop bounds (\`i <= arr.length\` reading \`undefined\` past the end of the array).
   * Accidental string concatenation instead of addition (\`"10" + 5\` producing \`"105"\` instead of \`15\`).

### 💡 Using the VS Code Debugger & Debugging Async Callbacks
* **Breakpoints & Debugger Controls:** Click to the left of a line number to set a red **Breakpoint** and launch **Run -> Start Debugging (Node.js)**:
  * **Continue (Play):** Resume normal execution until the next breakpoint.
  * **Step Over:** Execute the current line and move to the next line in the same function.
  * **Step Into:** Dive inside the function being called on the current line.
  * **Step Out:** Finish the current function and return to its caller.
* **Crucial Rule for Debugging Async Callbacks (\`req.on('data')\`, \`fs.writeFile\`):** Stepping over \`req.on('end', () => { ... })\` only registers the listener—it will NOT pause inside the callback unless you **place a separate Breakpoint directly inside the callback body**!

### 🛠️ Configuring \`.vscode/launch.json\` to Auto-Restart Debugger with \`nodemon\`
\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program with Nodemon",
      "skipFiles": ["<node_internals>/**"],
      "program": "\${workspaceFolder}/app.js",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "console": "integratedTerminal"
    }
  ]
}
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-8-q1',
        title: 'Q1: Compare Syntax Errors, Runtime Errors, and Logical Errors with a concrete JavaScript/Node.js example of each.',
        difficulty: 'Easy',
        answer: '1) Syntax Error: Violates JS language grammar rules and prevents the script from starting at all (e.g., const a; without an initializer or missing a closing bracket). 2) Runtime Error: Syntactically valid code that fails during execution when attempting an illegal operation (e.g., let num = 10; num(); throws TypeError: num is not a function, or calling res.setHeader() after res.end()). 3) Logical Error: Code runs without throwing any error, but produces incorrect output due to flawed logic (e.g., writing if (x = 10) instead of if (x === 10), or looping i <= arr.length).'
      },
      {
        id: 'node-lec-8-q2',
        title: 'Q2: When debugging a Node.js server with VS Code Breakpoints, why does clicking "Step Over" on req.on("end", () => { ... }) skip right past the callback body?',
        difficulty: 'Medium',
        answer: 'Because req.on("end", callback) is an asynchronous event listener registration! At the moment that line executes synchronously, it only registers the callback function with the stream and moves on; the callback itself will only be invoked later by the Event Loop after all network chunks arrive. To pause execution inside an asynchronous callback, you must place an explicit breakpoint inside the body of the callback function itself.'
      },
      {
        id: 'node-lec-8-q3',
        title: 'Q3: What is the difference between "Step Over", "Step Into", and "Step Out" in a debugger?',
        difficulty: 'Easy',
        answer: '1) Step Over executes the current line of code (including any function calls on that line) as a single step and pauses on the very next line in the current function. 2) Step Into enters inside the function being called on the current line so you can trace its internal execution line-by-line. 3) Step Out finishes executing the remainder of the current function at full speed and pauses at the line in the parent caller function where it returns.'
      },
      {
        id: 'node-lec-8-q4',
        title: 'Q4: Why did if (num = 10) print 10 even when let num = 5 was declared right above it?',
        difficulty: 'Easy',
        answer: 'Because a single equals sign (=) is the assignment operator, not a comparison operator! The expression (num = 10) overwrites num with the value 10 and evaluates to 10. Since 10 is a non-zero truthy value in JavaScript, the if-branch always executes!'
      },
      {
        id: 'node-lec-8-q5',
        title: 'Q5: How do you read a Node.js Error Stack Trace to quickly find the bug in your own code?',
        difficulty: 'Easy',
        answer: 'The first line of a stack trace shows the Error Type and message (e.g., TypeError: num is not a function). Below that is the Call Stack trace starting from the deepest point where the error occurred. Ignore lines pointing to internal node:... modules (like node:internal/modules/cjs/loader) and look for the topmost line containing your own project file path and line:column number (e.g., at runtime (/workspace/runtime.js:4:3)).'
      },
      {
        id: 'node-lec-8-q6',
        title: 'Q6: What can you do with the Debug Console and Variables panel while paused at a Breakpoint in VS Code?',
        difficulty: 'Easy',
        answer: 'While paused at a breakpoint, the Variables panel lets you inspect all Local, Closure, and Global variables in scope and even modify their values in memory on the fly to test different branches. The Debug Console acts as a live REPL scoped to the paused line, allowing you to evaluate arbitrary JS expressions against the live variables.'
      }
    ]
  },
  {
    topic_order: 9,
    slug: 'node-lecture-9-introduction-to-expressjs-middleware-routing-res-send',
    title: 'Lecture 9: Introduction to Express.js — Why Express?, Middleware Pipeline (app.use, req, res, next), Execution Order, res.send() & Route Matching',
    duration_minutes: 59,
    video_url: 'http://www.youtube.com/watch?v=J-QgmSzyA_A',
    video_title: 'Lecture 9: Introduction to express.js | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Express.js Official Docs — Using Middleware',
        url: 'https://expressjs.com/en/guide/using-middleware.html',
        link: 'https://expressjs.com/en/guide/using-middleware.html'
      }
    ],
    short_description: 'Transition from verbose raw Node.js http code to Express.js, master the Middleware pipeline (app.use, req, res, next), understand path matching differences between app.use() and app.get()/app.post(), and send responses with res.send().',
    summary_markdown: `### 📌 Topic Overview
Writing a large production web application using only Node's raw \`http.createServer\` quickly becomes painful: you have to manually concatenate stream chunks, set headers, and write giant \`if/else\` chains for \`req.url\` and \`req.method\`. **Express.js** is a minimal, fast, unopinionated web framework built on top of Node.js that organizes request processing into a clean **Middleware Pipeline** and **Routing table**.

### 💡 What Is Middleware in Express.js? (\`(req, res, next) => { ... }\`)
* Instead of one monolithic request handler function, Express processes an incoming request through a **chain of Middleware functions** executed in the exact top-to-bottom order they are defined in code.
* Every middleware function receives 3 arguments: **\`(req, res, next)\`**:
  * It can inspect or modify \`req\` and \`res\` (e.g., logging, authentication, parsing \`req.body\`).
  * It must either **end the request-response cycle** (via **\`res.send()\`**) OR call **\`next()\`** to pass control to the next middleware in the chain!
  * **Warning:** If a middleware neither calls \`next()\` nor sends a response, the client browser hangs forever! And once \`res.send()\` is called, you must **not** call \`next()\` if downstream middleware also tries to call \`res.send()\`.

### 💡 Crucial Distinction: \`app.use(path, ...)\` vs. \`app.get(path, ...)\` / \`app.post(path, ...)\`
* **\`app.use("/", callback)\` (Prefix & All-Method Matching):**
  * Matches **ALL HTTP methods** (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`).
  * Matches **prefix paths**: \`app.use("/", ...)\` matches \`"/"\`, \`"/contact-us"\`, \`"/products/123"\`—every single URL starts with \`"/"\`!
* **\`app.get("/", callback)\` & \`app.post("/contact-us", callback)\` (Exact Path & Exact Method Matching):**
  * Matches **only the specified HTTP verb** (\`GET\` or \`POST\`) AND matches the **exact URL path** (\`app.get("/", ...)\` only matches \`"/"\`, NOT \`"/contact-us"\`).
* **How \`res.send()\` Simplifies Responses:** Unlike \`res.write()\` + \`res.end()\`, **\`res.send("<h1>Hello</h1>")\`** automatically sets the \`Content-Type\` header (\`text/html\` for strings, \`application/json\` for objects/arrays), sets \`Content-Length\`, and ends the response in a single call!

### 🛠️ Express.js Server, Logging Middleware & Route Handling
\`\`\`javascript
const express = require("express");
const app = express();

// 1. Global Logging Middleware (calls next() so request continues downstream)
app.use((req, res, next) => {
  console.log("1st Dummy Middleware:", req.url, req.method);
  next();
});

// 2. Exact GET Route for Home Page '/'
app.get("/", (req, res, next) => {
  res.send("<h1>Welcome to Complete Coding</h1>");
});

// 3. GET & POST Routes for '/contact-us'
app.get("/contact-us", (req, res, next) => {
  res.send(\`
    <h1>Please give your details here</h1>
    <form action="/contact-us" method="POST">
      <input type="text" name="name" placeholder="Enter your name" />
      <input type="email" name="email" placeholder="Enter your email" />
      <input type="submit" />
    </form>
  \`);
});

app.post("/contact-us", (req, res, next) => {
  res.send("<h1>We will contact you shortly!</h1>");
});

// app.listen() internally calls http.createServer(app) and binds to port 3002
app.listen(3002, () => {
  console.log("Server running on address http://localhost:3002");
});
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-9-q1',
        title: 'Q1: What is Middleware in Express.js, what are its 3 parameters, and what happens if you forget to call next() or res.send()?',
        difficulty: 'Easy',
        answer: 'Middleware in Express.js is a function that has access to the request object (req), the response object (res), and the next middleware function (next) in the application\'s request-response pipeline. Middleware can execute any code, mutate req/res (like attaching req.body or req.user), end the request-response cycle (via res.send()), or pass control to the next middleware via next(). If a middleware neither ends the response nor calls next(), the request hangs indefinitely until the client browser times out.'
      },
      {
        id: 'node-lec-9-q2',
        title: 'Q2: Why does placing app.use("/", (req, res) => res.send("Home")) at the top of your file block "/contact-us" from ever being reached, whereas app.get("/", ...) does not?',
        difficulty: 'Medium',
        answer: 'Because app.use(path, fn) performs PREFIX matching across ALL HTTP methods! Since every path (including "/contact-us" and "/users") starts with the prefix "/", app.use("/", ...) intercepts every incoming request and sends the "Home" response immediately without calling next(). In contrast, app.get("/", fn) performs EXACT path matching (and only for GET requests), so GET "/contact-us" skips past app.get("/", ...) and reaches app.get("/contact-us", ...).'
      },
      {
        id: 'node-lec-9-q3',
        title: 'Q3: What advantages does Express\'s res.send() provide over raw Node.js res.setHeader(), res.write(), and res.end()?',
        difficulty: 'Easy',
        answer: 'res.send(body) inspects the data type of body and automatically sets the correct Content-Type header (text/html for strings, application/json for objects/arrays, application/octet-stream for Buffers), automatically calculates and sets the Content-Length header, serializes objects to JSON if needed, writes the payload, and closes the response stream—all in a single method call.'
      },
      {
        id: 'node-lec-9-q4',
        title: 'Q4: Why is the top-to-bottom order of middleware and route declarations critical in Express.js?',
        difficulty: 'Easy',
        answer: 'Express evaluates middleware and routes strictly in the sequential order they are registered in your code. When a request arrives, Express runs each matching middleware from top to bottom until one sends a response and stops calling next(). Therefore, logging and body-parsing middleware must be placed at the top before route handlers, and 404 catch-all middleware must be placed at the very bottom.'
      },
      {
        id: 'node-lec-9-q5',
        title: 'Q5: How does app.listen(PORT) work under the hood in Express? Why don\'t we need to require("http") anymore?',
        difficulty: 'Medium',
        answer: 'In Express, the app object returned by express() is actually a valid Node.js (req, res) request handler function! When you call app.listen(PORT, callback), Express internally imports Node\'s core http module and executes return http.createServer(this).listen(...).'
      },
      {
        id: 'node-lec-9-q6',
        title: 'Q6: Can you call res.send() twice inside the same route handler or across two middlewares chained with next()?',
        difficulty: 'Easy',
        answer: 'No! Because res.send() flushes the HTTP headers and closes the response stream (internally calling res.end()), calling res.send() a second time on the same request throws Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client.'
      }
    ]
  },
  {
    topic_order: 10,
    slug: 'node-lecture-10-expressjs-deep-dive-body-parser-router-sendfile-404',
    title: 'Lecture 10: Express.js Deep Dive — Body Parsing (express.urlencoded), Modular Routing (express.Router), Serving HTML (res.sendFile), path Utility & 404 Catch-All',
    duration_minutes: 73,
    video_url: 'http://www.youtube.com/watch?v=uY4cMWoZFMs',
    video_title: 'Lecture 10: express.js DeepDive | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Express.js Official Docs — Routing & express.Router()',
        url: 'https://expressjs.com/en/guide/routing.html',
        link: 'https://expressjs.com/en/guide/routing.html'
      }
    ],
    short_description: 'Parse form payloads in one line with express.urlencoded(), split routes across files with express.Router(), serve HTML views using res.sendFile() and path.join(), and add a 404 catch-all page.',
    summary_markdown: `### 📌 Topic Overview
In raw Node.js, parsing a \`POST\` request body required manually listening to \`req.on("data")\`, concatenating \`Buffer\`s on \`req.on("end")\`, and running \`URLSearchParams\`. In **Express.js**, built-in middleware and modular routers reduce that entire workflow to clean, maintainable architecture.

### 💡 1-Line Request Body Parsing (\`express.urlencoded()\` / \`body-parser\`)
* Calling **\`app.use(express.urlencoded({ extended: false }))\`** (or \`bodyParser.urlencoded()\`) before your routes automatically collects all incoming stream chunks, decodes the URL-encoded form payload, and attaches the parsed JavaScript object directly onto **\`req.body\`**!
* Without this middleware, \`req.body\` is \`undefined\`.

### 💡 Modular Routing with \`express.Router()\` & Common Path Prefixes
Instead of cramming 50 routes into \`app.js\`, split routes by feature/actor into a \`routes/\` folder (e.g., \`routes/userRouter.js\` and \`routes/hostRouter.js\`):
* Create a mini-router via **\`const hostRouter = express.Router();\`**.
* **Common Path Prefix Mounting:** Mounting **\`app.use("/host", hostRouter)\`** in \`app.js\` automatically prefixes every route inside \`hostRouter\` with \`"/host"\` (so \`hostRouter.get("/add-home", ...)\` responds to \`GET /host/add-home\`).

### 💡 Serving Separate HTML View Files (\`res.sendFile\` & \`rootDir\` Helper)
* Rather than writing HTML strings inside JS files, place HTML files inside a \`views/\` folder (\`views/home.html\`, \`views/addHome.html\`, \`views/404.html\`) and serve them via **\`res.sendFile(absolutePath)\`**.
* **Cross-Platform Absolute Paths (\`utils/pathUtil.js\`):** Use Node's \`path\` module (\`path.dirname(require.main.filename)\` and \`path.join(rootDir, "views", "home.html")\`) so file paths work identically on Windows and macOS/Linux.
* **404 Catch-All Middleware:** Placed at the **very bottom** of \`app.js\` after all routers: \`app.use((req, res, next) => res.status(404).sendFile(path.join(rootDir, "views", "404.html")))\`.

### 🛠️ Modular Express Architecture (Airbnb Project Setup)
\`\`\`javascript
// File: utils/pathUtil.js
const path = require("path");
module.exports = path.dirname(require.main.filename);

// File: routes/hostRouter.js
const path = require("path");
const express = require("express");
const hostRouter = express.Router();
const rootDir = require("../utils/pathUtil");

hostRouter.get("/add-home", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "addHome.html"));
});

hostRouter.post("/add-home", (req, res, next) => {
  console.log("Parsed Form Data:", req.body); // Populated by express.urlencoded()!
  res.sendFile(path.join(rootDir, "views", "homeAdded.html"));
});

module.exports = hostRouter;

// File: app.js
const path = require("path");
const express = require("express");
const userRouter = require("./routes/userRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtil");

const app = express();

// 1. Parse URL-encoded form bodies into req.body
app.use(express.urlencoded({ extended: false }));

// 2. Mount modular routers (with "/host" common prefix on hostRouter)
app.use(userRouter);
app.use("/host", hostRouter);

// 3. Catch-All 404 Middleware (MUST be placed last!)
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(3000);
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-10-q1',
        title: 'Q1: Why is req.body undefined by default in an Express POST route, and what is the difference between express.urlencoded() and express.json()?',
        difficulty: 'Easy',
        answer: 'By default, Express does not parse incoming request body streams to avoid unnecessary overhead on GET requests or custom file streams. To populate req.body: 1) app.use(express.urlencoded()) parses HTML <form> submissions sent with Content-Type: application/x-www-form-urlencoded. 2) app.use(express.json()) parses JSON payloads sent by fetch/Axios API clients with Content-Type: application/json.'
      },
      {
        id: 'node-lec-10-q2',
        title: 'Q2: What is express.Router(), and how does mounting app.use("/host", hostRouter) work?',
        difficulty: 'Easy',
        answer: 'express.Router() creates a modular, mountable "mini-app" capable of holding its own middleware and route definitions (get, post, put, delete) in a separate file. When you mount it in app.js via app.use("/host", hostRouter), Express strips the "/host" prefix before matching routes inside hostRouter—so a route defined as hostRouter.get("/add-home") cleanly handles requests to GET "/host/add-home".'
      },
      {
        id: 'node-lec-10-q3',
        title: 'Q3: Why must res.sendFile() be given an absolute path via path.join(), and why does path.join(rootDir, "views", "home.html") beat string concatenation?',
        difficulty: 'Medium',
        answer: 'res.sendFile() requires an absolute file system path (unless a root option is specified). Using path.join(rootDir, "views", "home.html") instead of string concatenation (rootDir + "/views/home.html") automatically normalizes directory separators across operating systems—using backslashes (\\) on Windows and forward slashes (/) on Linux and macOS.'
      },
      {
        id: 'node-lec-10-q4',
        title: 'Q4: Why must the 404 Catch-All middleware be registered at the very bottom of app.js after all routers, and why should it call res.status(404)?',
        difficulty: 'Easy',
        answer: 'Because an un-pathed app.use((req, res) => ...) matches every URL and HTTP method! Placing it at the bottom ensures it only runs if none of the valid routes above it matched and ended the response. Calling res.status(404) before .sendFile() is critical because otherwise Express sends the 404 HTML page with a 200 OK HTTP status code, misleading browsers, API clients, and search engines into thinking the broken URL succeeded.'
      },
      {
        id: 'node-lec-10-q5',
        title: 'Q5: What is the difference between __dirname and path.dirname(require.main.filename)?',
        difficulty: 'Medium',
        answer: '__dirname always returns the absolute directory path of the specific file in which __dirname is written (so inside routes/userRouter.js, __dirname points to the /routes folder, requiring "../views/home.html"). In contrast, path.dirname(require.main.filename) always returns the root directory of the main entry-point file that started the application (app.js), providing a consistent project root reference from any subfolder.'
      },
      {
        id: 'node-lec-10-q6',
        title: 'Q6: Why did Express 4.16+ re-introduce express.urlencoded() and express.json() directly on the express object instead of requiring the external body-parser package?',
        difficulty: 'Easy',
        answer: 'In early Express 4, body-parser was extracted into a separate NPM package, forcing almost every single Express project to install body-parser manually. Starting in Express 4.16+, body-parser was bundled back into Express core, so express.urlencoded() and express.json() work out-of-the-box without installing an extra package.'
      }
    ]
  },
  {
    topic_order: 11,
    slug: 'node-lecture-11-serving-static-files-express-static-tailwind-css-setup',
    title: 'Lecture 11: Serving Static Assets & Styling with Tailwind CSS — express.static() Middleware, public Folder & Tailwind CLI Pipeline',
    duration_minutes: 30,
    video_url: 'http://www.youtube.com/watch?v=GNTDLqKWknw',
    video_title: 'Lecture 11: Styling using Tailwind | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Express.js Official Docs — Serving Static Files in Express',
        url: 'https://expressjs.com/en/starter/static-files.html',
        link: 'https://expressjs.com/en/starter/static-files.html'
      }
    ],
    short_description: 'Understand why backend server directories are private by default, expose CSS/images safely using express.static("public"), and configure the Tailwind CSS CLI build pipeline.',
    summary_markdown: `### 📌 Topic Overview
When a browser loads \`home.html\` and encounters \`<link rel="stylesheet" href="home.css">\`, the browser sends a separate \`GET /home.css\` HTTP request to your Express server. By default, **all server folders are private** (so clients cannot steal your backend source code like \`app.js\`), causing \`GET /home.css\` to fail with a **404 Not Found** unless you explicitly expose a static assets directory!

### 💡 Serving Static Files with \`express.static()\` & the \`public/\` Folder
* **Security Principle:** Never expose your entire project folder! Create a dedicated **\`public/\`** folder to hold only public client-side assets (CSS stylesheets, frontend images, client JS, downloadable PDFs).
* **Registering the Middleware:**
  **\`app.use(express.static(path.join(rootDir, "public")));\`**
* **How URL Resolution Works (\`href="/output.css"\`):**
  * When \`express.static(path.join(rootDir, "public"))\` receives a request for \`GET /output.css\` (or \`GET /home.css\`), it looks **inside** the \`public/\` folder (\`public/output.css\`) and serves it automatically!
  * **Important:** In your HTML \`<link>\` tag, write \`href="/output.css"\` (relative to the \`public\` root)—do **not** write \`/public/output.css\`!

### 💡 Integrating Tailwind CSS v3 CLI in an Express Project
Why use **Tailwind CSS**? It provides **mobile-first responsive design**, **utility-first classes** directly inside HTML (eliminating context-switching between \`.html\` and \`.css\` files), and **automatic purging** of unused CSS so your production stylesheet stays tiny:
1. **Install Dev Dependencies:** \`npm install -D tailwindcss postcss autoprefixer\`
2. **Initialize Config:** \`npx tailwindcss init\` (creates \`tailwind.config.js\`).
3. **Configure \`content\` Globs:** Set \`content: ["./views/*.html"]\` inside \`tailwind.config.js\` so Tailwind scans your HTML views for class names.
4. **Create \`views/input.css\`:** Add \`@tailwind base; @tailwind components; @tailwind utilities;\`.
5. **Run Tailwind Watcher into \`public/output.css\`:**
   \`npx tailwindcss -i ./views/input.css -o ./public/output.css --watch\`

### 🛠️ \`express.static()\` Setup & \`tailwind.config.js\`
\`\`\`javascript
// 1. In app.js: Expose the 'public' directory for static CSS, images, and assets
const path = require("path");
const express = require("express");
const rootDir = require("./utils/pathUtil");
const app = express();

app.use(express.static(path.join(rootDir, "public")));

// 2. In views/home.html: Link to /output.css (served from public/output.css)
// <link rel="stylesheet" href="/output.css" />

// 3. In tailwind.config.js: Scan all HTML files inside views/
module.exports = {
  content: ["./views/*.html"],
  theme: {
    extend: {}
  },
  plugins: []
};
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-11-q1',
        title: 'Q1: Why does linking a stylesheet via <link rel="stylesheet" href="home.css"> in an HTML file served by Express return a 404 error by default, and how does express.static() solve it?',
        difficulty: 'Easy',
        answer: 'For security reasons, Express does not expose any server-side files or directories to the public by default (otherwise users could type localhost:3000/app.js and read your backend code and secrets). When the browser requests GET /home.css, no route matches it, triggering the 404 handler. Adding app.use(express.static(path.join(rootDir, "public"))) registers middleware that checks if the requested file exists inside the designated public/ folder and serves it with the proper MIME type.'
      },
      {
        id: 'node-lec-11-q2',
        title: 'Q2: When using app.use(express.static(path.join(rootDir, "public"))), should your HTML link tag use href="/output.css" or href="/public/output.css"? Why?',
        difficulty: 'Easy',
        answer: 'You must use href="/output.css" (WITHOUT "/public")! Because express.static() mounts the contents of the public/ directory directly at the root URL "/", a request for GET /output.css maps to <rootDir>/public/output.css. If you wrote href="/public/output.css", Express would look for <rootDir>/public/public/output.css and return a 404.'
      },
      {
        id: 'node-lec-11-q3',
        title: 'Q3: Why is installing Tailwind CSS via the CLI build process preferred over using the Tailwind Play CDN <script> tag in production?',
        difficulty: 'Medium',
        answer: '1) Bundle Size & Tree-Shaking: The Play CDN downloads a massive JavaScript runtime and generates styles on the client\'s browser at runtime. The Tailwind CLI scans your ./views/*.html files at build time and outputs ONLY the exact CSS utility classes you actually used into public/output.css (often under 10 KB). 2) Performance & Caching: A static output.css file is cached by the browser and renders immediately without waiting for client-side JavaScript execution.'
      },
      {
        id: 'node-lec-11-q4',
        title: 'Q4: Why did Tailwind CSS fail to generate utility classes in public/output.css when the content array in tailwind.config.js had the wrong path glob?',
        difficulty: 'Easy',
        answer: 'Tailwind\'s JIT (Just-In-Time) compiler only generates CSS rules for utility classes it finds inside the files matched by the content array in tailwind.config.js. If content is empty or points to the wrong folder, Tailwind assumes zero utility classes are used and outputs a base reset file without your utility classes (like text-red-700).'
      },
      {
        id: 'node-lec-11-q5',
        title: 'Q5: What does "Mobile-First Responsive Design" mean in Tailwind CSS?',
        difficulty: 'Easy',
        answer: 'In Tailwind CSS, unprefixed utility classes (like text-sm or flex-col) apply to all screen sizes starting from mobile screens upward. Breakpoint prefixes like md:flex-row or lg:text-4xl apply at that breakpoint and above (min-width media queries), encouraging developers to design for mobile screens first and progressively enhance layouts for tablets and desktops.'
      },
      {
        id: 'node-lec-11-q6',
        title: 'Q6: Can you register multiple static directories or mount express.static() under a virtual URL prefix?',
        difficulty: 'Medium',
        answer: 'Yes! You can call app.use(express.static(...)) multiple times for different directories (Express searches them in registration order), or mount a virtual path prefix via app.use("/static", express.static(path.join(rootDir, "public"))), which serves files only when the URL starts with "/static/output.css".'
      }
    ]
  },
  {
    topic_order: 12,
    slug: 'node-lecture-12-dynamic-ui-using-ejs-templating-engine-partials',
    title: 'Lecture 12: Dynamic Server-Side UI with EJS — Template Engines (app.set("view engine", "ejs")), res.render(), EJS Tags & Reusable Partials',
    duration_minutes: 66,
    video_url: 'http://www.youtube.com/watch?v=WaObzvMEgd4',
    video_title: 'Lecture 12: Dynamic UI using EJS | NodeJS Complete Course in Hindi',
    doc_links: [
      {
        title: 'Express.js Official Docs — Using Template Engines with Express',
        url: 'https://expressjs.com/en/guide/using-template-engines.html',
        link: 'https://expressjs.com/en/guide/using-template-engines.html'
      }
    ],
    short_description: 'Render dynamic, personalized server-side HTML using EJS (Embedded JavaScript Templates), pass runtime data into res.render(), use EJS tags (<%= %>, <% %>, <%- %>), and eliminate duplicate markup with EJS Partials.',
    summary_markdown: `### 📌 Topic Overview
Static \`.html\` files served via \`res.sendFile()\` show the exact same hardcoded content to every user. Real-world applications (like Airbnb home listings, stock tickers, or user dashboards) require **Dynamic UI** where HTML is generated at runtime based on database records or user state. **EJS (Embedded JavaScript)** is a template engine that lets you embed JavaScript variables, loops, and conditionals directly inside HTML templates on the server!

### 💡 Configuring EJS in Express (\`app.set\` & \`res.render\`)
1. **Install EJS:** \`npm install ejs\` (Express loads it automatically—no \`require('ejs')\` needed).
2. **Configure Express View Engine:**
   * **\`app.set("view engine", "ejs");\`** — tells Express to use EJS to compile templates.
   * **\`app.set("views", "views");\`** — tells Express which folder holds \`.ejs\` files (\`views/home.ejs\`).
3. **Render a Template with Dynamic Data:**
   * Replace \`res.sendFile(...)\` with **\`res.render("home", { registeredHomes, pageTitle: "airbnb Home" })\`**.
   * Express compiles \`views/home.ejs\`, injects the passed data object into the template, and sends pure HTML to the browser!

### 💡 Essential EJS Tags & Reusable Partials (\`include\`)
* **\`<%= variable %>\` (Escaped Output Tag):** Evaluates the JS expression and outputs the value into HTML safely (escapes \`<\` and \`>\` to prevent XSS). Use for user data like \`<%= home.houseName %>\` or \`<%= pageTitle %>\`.
* **\`<% code %>\` (Control-Flow Scriptlet Tag):** Executes JavaScript logic (\`forEach\` loops, \`if/else\` statements) with **no direct HTML output**:
  \`<% registeredHomes.forEach(home => { %> ... <% }) %>\`
* **\`<%- include('partials/nav') %>\` (Unescaped / Partial Include Tag):** Injects raw HTML from reusable **Partials** (\`views/partials/head.ejs\`, \`views/partials/nav.ejs\`) so common headers and navigation bars are defined in a single file instead of duplicated across 20 pages!
* **Remember Tailwind Config:** Update \`tailwind.config.js\` to \`content: ["./views/**/*.{html,ejs}"]\` so Tailwind scans \`.ejs\` templates and nested \`partials/\` folders!

### 🛠️ Configuring EJS, Rendering Data & Using Partials
\`\`\`javascript
// 1. In app.js: Configure EJS as the Express View Engine
app.set("view engine", "ejs");
app.set("views", "views");

// 2. In routes/userRouter.js: Pass dynamic array & pageTitle to res.render()
userRouter.get("/", (req, res, next) => {
  res.render("home", {
    registeredHomes: registeredHomes,
    pageTitle: "airbnb Home",
    currentPage: "Home"
  });
});
\`\`\`

\`\`\`html
<!-- 3. In views/home.ejs: Reusable Partials + Dynamic EJS Loop -->
<%- include('partials/head') %>
  </head>
  <body>
    <%- include('partials/nav') %>
    <main class="container mx-auto mt-8">
      <h2 class="text-3xl font-bold text-red-500">Here are our registered homes:</h2>
      <ul class="mt-4 space-y-2">
        <% registeredHomes.forEach(home => { %>
          <li class="p-4 bg-white shadow rounded-lg">
            <span class="font-semibold"><%= home.houseName %></span> — ₹<%= home.price %> / night
          </li>
        <% }) %>
      </ul>
    </main>
  </body>
</html>
\`\`\``,
    interview_questions: [
      {
        id: 'node-lec-12-q1',
        title: 'Q1: What is the difference between <%= value %>, <%- html %>, and <% code %> in EJS?',
        difficulty: 'Easy',
        answer: '1) <%= value %> evaluates the JavaScript expression and outputs the result as HTML-escaped text (converting <, >, & into safe HTML entities to prevent XSS attacks)—used for displaying dynamic variables like <%= home.houseName %>. 2) <%- html %> outputs the unescaped raw HTML string—used when including partials via <%- include("partials/nav") %>. 3) <% code %> is a scriptlet tag that executes control-flow JavaScript (such as if/else conditions or registeredHomes.forEach() loops) without outputting anything to the HTML.'
      },
      {
        id: 'node-lec-12-q2',
        title: 'Q2: What is the difference between res.sendFile() and res.render() in Express?',
        difficulty: 'Easy',
        answer: 'res.sendFile() streams a static file (like home.html) directly from disk to the client as-is without any variable substitution. res.render(viewName, localsObj) invokes the configured template engine (like EJS), compiles the views/<viewName>.ejs template by injecting the dynamic data from localsObj, and sends the resulting generated HTML string to the browser.'
      },
      {
        id: 'node-lec-12-q3',
        title: 'Q3: What are EJS Partials, and how do they enforce the DRY (Don\'t Repeat Yourself) principle?',
        difficulty: 'Easy',
        answer: 'Partials (stored in a folder like views/partials/head.ejs and views/partials/nav.ejs) are reusable template fragments containing shared UI components like the HTML <head>, navigation bar, or footer. By including them across all pages via <%- include("partials/nav") %>, any change to the navbar only needs to be made in one file instead of editing 20 separate page templates.'
      },
      {
        id: 'node-lec-12-q4',
        title: 'Q4: Does the client\'s web browser ever see EJS tags like <%= home.houseName %> when viewing page source?',
        difficulty: 'Easy',
        answer: 'No! EJS is a Server-Side Rendering (SSR) template engine. All <% %> and <%= %> tags are executed and stripped on the Node.js server during res.render(), which sends 100% standard, plain HTML to the client\'s browser.'
      },
      {
        id: 'node-lec-12-q5',
        title: 'Q5: When storing submitted homes in an in-memory array (const registeredHomes = []) inside hostRouter.js, why do all users see the same list and why does it reset when the server restarts?',
        difficulty: 'Medium',
        answer: 'Because module-scoped variables in a Node.js server live in the server\'s RAM and are shared across the entire Node process (and cached across require() calls). Every user hitting the server reads from that same in-memory array, and whenever nodemon or the server restarts, RAM is cleared—which is why real production apps persist state in a database like MongoDB or PostgreSQL.'
      },
      {
        id: 'node-lec-12-q6',
        title: 'Q6: Why did we need to update tailwind.config.js from "./views/*.html" to "./views/**/*.{html,ejs}" after migrating to EJS and Partials?',
        difficulty: 'Easy',
        answer: 'Two reasons: 1) Our view files now have the .ejs extension instead of .html. 2) We created a nested subfolder views/partials/ for head.ejs and nav.ejs. The recursive glob **/*.{html,ejs} ensures Tailwind scans both top-level views/ and all nested subdirectories for Tailwind utility classes.'
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

async function seedDevelopmentBatch1() {
  const client = await pool.connect();
  try {
    console.log('=== SEEDING DEVELOPMENT TRACK BATCH 1 (Lectures 1 to 12) ===');
    await client.query('BEGIN');

    // 1. Identify Development Track (Track ID 24)
    let devTrackRes = await client.query(`
      SELECT id, slug, name, title, description 
      FROM tracks 
      WHERE id = 24 OR slug = 'nodejs-express-architecture' 
      LIMIT 1;
    `);

    if (devTrackRes.rows.length === 0) {
      throw new Error("Development track (ID 24 / nodejs-express-architecture) not found!");
    }

    const devTrackId = devTrackRes.rows[0].id;
    console.log(`Identified Development Track: [ID:${devTrackId}] ${devTrackRes.rows[0].name} (${devTrackRes.rows[0].slug})`);

    // 2. Ensure Track title, name, description cleanly reflect Node.js, Express.js & Backend Development
    const trackName = 'Node.js, Express.js & Backend Development';
    const trackDesc = 'Master backend engineering with Node.js and Express.js from first principles—V8 runtime, libuv event loop, non-blocking I/O, streams & buffers, middleware architecture, REST API design, EJS dynamic UI, and production deployment.';
    await client.query(`
      UPDATE tracks SET
        name = $1,
        title = $1,
        description = $2,
        evaluation_type = 'practice',
        is_published = true,
        level = 'Intermediate'
      WHERE id = $3;
    `, [trackName, trackDesc, devTrackId]);
    console.log(`Updated Track metadata for ID ${devTrackId}: "${trackName}"`);

    // 3. Purge existing demo/placeholder topics mapped to Track 24
    // Find any topic mapped in track_topics for Track 24 that is NOT a real node-lecture-%
    const demoTopicsRes = await client.query(`
      SELECT tt.topic_id, t.name, t.slug 
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = $1 AND t.slug NOT LIKE 'node-lecture-%';
    `, [devTrackId]);

    const demoTopicIds = demoTopicsRes.rows.map(r => r.topic_id);
    console.log(`Found ${demoTopicIds.length} demo/placeholder topics mapped to track ${devTrackId}:`, demoTopicIds);

    // Delete mappings from track_topics for Track 24
    const deletedTt = await client.query(`
      DELETE FROM track_topics 
      WHERE track_id = $1 AND (
        topic_id IN (SELECT id FROM topics WHERE slug NOT LIKE 'node-lecture-%')
      );
    `, [devTrackId]);
    console.log(`Deleted ${deletedTt.rowCount} demo mapping(s) from track_topics for Track ${devTrackId}.`);

    // Also delete any topics in 'topics' table where track_id = devTrackId AND slug NOT LIKE 'node-lecture-%'
    // (making sure never to touch DSA 25, Postgres 654, Mongo 655, or JS 708)
    const directDemoTopicsRes = await client.query(`
      SELECT id, slug, name FROM topics 
      WHERE track_id = $1 
        AND slug NOT LIKE 'node-lecture-%'
        AND track_id NOT IN (25, 654, 655, 708);
    `, [devTrackId]);

    const directDemoIds = directDemoTopicsRes.rows.map(r => r.id);
    if (directDemoIds.length > 0) {
      console.log(`Deleting ${directDemoIds.length} direct demo topics owned by track ${devTrackId}:`, directDemoIds);
      await client.query(`DELETE FROM user_progress WHERE topic_id = ANY($1);`, [directDemoIds]);
      await client.query(`DELETE FROM resources WHERE topic_id = ANY($1);`, [directDemoIds]);
      await client.query(`DELETE FROM quizzes WHERE topic_id = ANY($1);`, [directDemoIds]);
      await client.query(`DELETE FROM track_topics WHERE topic_id = ANY($1);`, [directDemoIds]);
      await client.query(`DELETE FROM topics WHERE id = ANY($1);`, [directDemoIds]);
    }

    // 4. Upsert Lectures 1 to 12
    const creatorName = 'Complete Coding by Prashant Sir';
    const creatorChannelUrl = 'https://www.youtube.com/@CompleteCodingByPrashantSir';

    for (const lec of batch1Lectures) {
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

      // Check if topic already exists by slug
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

      console.log(`[SEED] Lecture ${lec.topic_order.toString().padStart(2, ' ')} (ID:${topicId}): ${lec.slug} | MdLen: ${cleanSummary.length} | Questions: ${practiceArray.length}`);
    }

    // 5. Ensure path mappings so Development track appears cleanly in preparation paths
    // Path 3 ('Node.js Backend Developer') already has track 24 at rank 3.
    // Ensure Path 1 ('Node.js Developer') and Path 6 ('Full Stack Web Developer (MERN)') also map track 24 at rank 3.
    for (const pathId of [1, 6]) {
      const existingMapping = await client.query(`
        SELECT id FROM path_tracks WHERE path_id = $1 AND track_id = $2;
      `, [pathId, devTrackId]);
      if (existingMapping.rows.length === 0) {
        await client.query(`
          INSERT INTO path_tracks (path_id, track_id, track_order)
          VALUES ($1, $2, 3)
          ON CONFLICT DO NOTHING;
        `, [pathId, devTrackId]);
        console.log(`Mapped Development track ${devTrackId} to path ${pathId} at order 3`);
      }
    }

    // Update track metadata columns if present
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tracks' AND column_name IN ('total_topics', 'estimated_hours');
    `);
    const availableCols = colCheck.rows.map(r => r.column_name);
    if (availableCols.includes('total_topics') && availableCols.includes('estimated_hours')) {
      await client.query(`UPDATE tracks SET total_topics = 12, estimated_hours = 18 WHERE id = $1;`, [devTrackId]);
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 12 WHERE id = $1;`, [devTrackId]);
    }

    await client.query('COMMIT');
    console.log('--- Development Batch 1 (Lectures 1 to 12) Seeded Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Development Batch 1 seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedDevelopmentBatch1();
