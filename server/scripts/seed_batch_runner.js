const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = require('../config/db');

function cleanUrl(url) {
  if (!url) return url;
  const match = url.match(/\((https?:\/\/[^\s)]+)\)/);
  if (match) return match[1];
  return url.replace(/^\[|\]$/g, '').trim();
}

const SYSTEM_DESIGN_PART_4_DATA = [
  {
    title: "System Design Concepts: Meeting Design Requirements",
    url: cleanUrl("[https://youtu.be/YhC7yYDG6i0](https://youtu.be/YhC7yYDG6i0)"),
    slug: "meeting-design-requirements",
    duration: 8,
    mcqs: [
      { q: "According to the CAP theorem, if a system prioritizes Consistency and Partition Tolerance (CP), what must it sacrifice during a network failure?", o: ["Scalability", "Availability", "Performance", "Security"], ca: "Availability", ci: 1, exp: "If a system requires strict consistency, it must stop responding (sacrificing availability) if a network partition prevents nodes from syncing." },
      { q: "What does 'Five Nines' (99.999%) availability represent in terms of system downtime?", o: ["5 hours per month", "5 days per year", "About 5 minutes of downtime per year", "5 seconds per day"], ca: "About 5 minutes of downtime per year", ci: 2, exp: "Five Nines is a gold standard for highly available enterprise systems, allowing only roughly 5.26 minutes of total downtime annually." },
      { q: "What is the primary difference between an SLO (Service Level Objective) and an SLA (Service Level Agreement)?", o: ["SLOs are external, SLAs are internal", "SLOs are technical goals; SLAs are formal business contracts with financial penalties if those goals are not met", "SLOs measure speed, SLAs measure security", "There is no difference"], ca: "SLOs are technical goals; SLAs are formal business contracts with financial penalties if those goals are not met", ci: 1, exp: "An engineering team sets an SLO of 99.9% uptime as a goal. The business signs an SLA promising 99.9% uptime, offering refunds if the system drops below it." },
      { q: "What metric is used to measure 'Throughput' in a web server environment?", o: ["Milliseconds (ms)", "Requests Per Second (RPS)", "Megabytes (MB)", "Gigahertz (GHz)"], ca: "Requests Per Second (RPS)", ci: 1, exp: "Throughput measures the total volume of work a system can handle in a given timeframe, typically quantified as Requests Per Second." },
      { q: "What does 'Graceful Degradation' mean in system resilience?", o: ["The database deleting old records automatically", "The system entirely shutting down to protect data", "Designing the system so that if a non-critical feature fails, the core functionality remains accessible to the user", "Downgrading from HTTPS to HTTP"], ca: "Designing the system so that if a non-critical feature fails, the core functionality remains accessible to the user", ci: 2, exp: "If a recommendation engine microservice crashes on an e-commerce site, graceful degradation ensures the user can still search for and buy products." }
    ]
  },
  {
    title: "Data Centers in System Design",
    url: cleanUrl("[https://youtu.be/6PjFbvaDhKU](https://youtu.be/6PjFbvaDhKU)"),
    slug: "data-centers-system-design",
    duration: 4,
    mcqs: [
      { q: "What is the primary purpose of a Multi-Data Center architecture?", o: ["To centralize all data into one physical room", "To reduce hardware costs", "To provide geographic redundancy (failover) and minimize latency by placing servers closer to global users", "To force users onto a VPN"], ca: "To provide geographic redundancy (failover) and minimize latency by placing servers closer to global users", ci: 2, exp: "Having a data center in the US and another in Europe ensures that if the US center loses power, the European center keeps the app alive, while also providing fast local load times." },
      { q: "How does Geo-DNS route a user to the optimal data center?", o: ["It asks the user to select their region", "It uses the client's IP address to determine their geographic location and resolves the domain to the IP of the physically closest data center", "It routes traffic randomly", "It measures ping times using JavaScript"], ca: "It uses the client's IP address to determine their geographic location and resolves the domain to the IP of the physically closest data center", ci: 1, exp: "Geo-DNS acts as a global traffic cop. An IP from Tokyo gets routed to the Asian data center; an IP from London gets routed to the European data center." },
      { q: "What happens to the load balancer's routing rules if 'Data Center 2' experiences a catastrophic failure?", o: ["It stops serving users completely", "It queues requests until Data Center 2 comes back online", "It instantly updates routing rules to direct 100% of global traffic to the healthy 'Data Center 1'", "It switches to UDP protocol"], ca: "It instantly updates routing rules to direct 100% of global traffic to the healthy 'Data Center 1'", ci: 2, exp: "Active-Active architectures ensure that if one data center dies, the global load balancer immediately funnels all traffic to the surviving data center to prevent downtime." },
      { q: "In AWS terminology, what is an 'Availability Zone' (AZ)?", o: ["A specific country where AWS operates", "A logical grouping of one or more physical data centers within a region, equipped with redundant power and networking to survive isolated failures", "A reserved block of IP addresses", "A pricing tier for bandwidth"], ca: "A logical grouping of one or more physical data centers within a region, equipped with redundant power and networking to survive isolated failures", ci: 1, exp: "A Region (like `us-east-1`) contains multiple Availability Zones (like `us-east-1a`, `us-east-1b`). If AZ 'a' floods, AZ 'b' is physically distant enough to survive." },
      { q: "Why is 'Component Decoupling' (Microservices) essential for scaling across data centers?", o: ["It allows frontend and backend to use different databases", "It forces all code into a single file", "It allows independent scaling of specific bottlenecks (e.g., scaling the payment service independently of the user profile service) across regions", "It converts JSON to XML"], ca: "It allows independent scaling of specific bottlenecks (e.g., scaling the payment service independently of the user profile service) across regions", ci: 2, exp: "Monoliths must be scaled entirely. Microservices allow targeted scaling, optimizing resource usage across distributed data centers." }
    ]
  },
  {
    title: "Proxy Servers: How Proxies Work",
    url: cleanUrl("[https://youtu.be/sYhKiPzGPYc](https://youtu.be/sYhKiPzGPYc)"),
    slug: "proxy-servers-explained",
    duration: 7,
    mcqs: [
      { q: "What distinguishes a Forward Proxy from a Reverse Proxy?", o: ["Forward proxies balance loads; reverse proxies cache images", "A Forward Proxy sits in front of the CLIENT to hide the client's identity; a Reverse Proxy sits in front of the SERVER to hide and protect the backend servers", "Forward proxies encrypt data; reverse proxies decrypt it", "There is no difference"], ca: "A Forward Proxy sits in front of the CLIENT to hide the client's identity; a Reverse Proxy sits in front of the SERVER to hide and protect the backend servers", ci: 1, exp: "Forward proxies act on behalf of the user (e.g., bypassing network restrictions). Reverse proxies act on behalf of the web application (e.g., load balancing, security)." },
      { q: "Why do corporations often use internal Forward Proxies for employee networks?", o: ["To speed up compiling code", "To monitor, filter, and control outbound internet usage, block malicious sites, and cache frequently visited pages to save bandwidth", "To generate SSL certificates", "To route database queries"], ca: "To monitor, filter, and control outbound internet usage, block malicious sites, and cache frequently visited pages to save bandwidth", ci: 1, exp: "A corporate forward proxy intercepts an employee's request to a website, scans it for malware, checks if it violates policy, and caches the result for the next employee." },
      { q: "What is an 'Anonymous Proxy'?", o: ["A proxy that uses Tor routing exclusively", "A proxy that identifies itself as a proxy but strips the user's original IP address from the forwarded request headers", "A proxy that drops 50% of packets", "A proxy that only works on the dark web"], ca: "A proxy that identifies itself as a proxy but strips the user's original IP address from the forwarded request headers", ci: 1, exp: "It provides basic anonymity by hiding the client's actual IP from the destination server, though the server still knows it is talking to a proxy." },
      { q: "Which of the following relies heavily on Reverse Proxy architecture?", o: ["A standard home WiFi router", "A Local Area Network (LAN)", "Content Delivery Networks (CDNs) and Load Balancers", "A desktop VPN client"], ca: "Content Delivery Networks (CDNs) and Load Balancers", ci: 2, exp: "CDNs and Load Balancers sit in front of the origin servers. The client talks to the CDN (the reverse proxy), which fetches data from the hidden backend." },
      { q: "What is 'SSL Offloading' (SSL Termination) performed by a Reverse Proxy?", o: ["Forcing users to use unencrypted HTTP", "Decrypting incoming HTTPS traffic at the proxy level and forwarding it as plain HTTP to the internal backend servers to save them CPU processing power", "Generating fake SSL certificates", "Encrypting database hard drives"], ca: "Decrypting incoming HTTPS traffic at the proxy level and forwarding it as plain HTTP to the internal backend servers to save them CPU processing power", ci: 1, exp: "Decrypting TLS/SSL is computationally heavy. The reverse proxy handles the math, allowing the internal backend servers to focus purely on application logic." }
    ]
  },
  {
    title: "The Essential Guide to Load Balancing Strategies and Techniques",
    url: cleanUrl("[https://youtu.be/mpQfVNcLHGA](https://youtu.be/mpQfVNcLHGA)"),
    slug: "load-balancing-strategies",
    duration: 6,
    mcqs: [
      { q: "What is the primary function of a Load Balancer?", o: ["To minimize frontend CSS files", "To distribute incoming network traffic across a group of backend servers, preventing any single server from becoming overwhelmed", "To encrypt database passwords", "To assign IP addresses to home network devices"], ca: "To distribute incoming network traffic across a group of backend servers, preventing any single server from becoming overwhelmed", ci: 1, exp: "Load balancers sit in front of your servers and route client requests to maximize speed, ensure high availability, and prevent server crashes due to overload." },
      { q: "What does the 'Round Robin' load balancing algorithm do?", o: ["It routes all traffic to the server with the fastest CPU", "It routes traffic sequentially to each server in the cluster, one after the other", "It randomly assigns traffic to any available server", "It sends traffic only to the server with the least active connections"], ca: "It routes traffic sequentially to each server in the cluster, one after the other", ci: 1, exp: "Round Robin is a simple algorithm that passes each new request to the next server in line, ensuring an even distribution of requests mathematically." },
      { q: "What is the main advantage of the 'Least Connections' algorithm over Round Robin?", o: ["It is faster to compute", "It prevents a server from getting overloaded if it is currently processing long-lived, complex requests while other servers sit idle", "It forces users to reconnect", "It encrypts the payload"], ca: "It prevents a server from getting overloaded if it is currently processing long-lived, complex requests while other servers sit idle", ci: 1, exp: "Round Robin blindly hands out tasks. Least Connections intelligently routes traffic to the server with the fewest active tasks, making it ideal for variable-length workloads." },
      { q: "Why do Load Balancers perform 'Health Checks'?", o: ["To check for viruses in user uploads", "To continuously monitor backend servers and instantly stop sending traffic to any server that goes offline or crashes", "To monitor the temperature of the server room", "To verify the SSL certificate expiration"], ca: "To continuously monitor backend servers and instantly stop sending traffic to any server that goes offline or crashes", ci: 1, exp: "Health checks ensure high availability. If a server fails to respond to a ping or HTTP request, the load balancer removes it from the pool so users don't encounter error pages." },
      { q: "What happens if a Single Point of Failure (SPOF) Load Balancer goes offline?", o: ["Traffic is automatically routed to the database", "All connected backend servers become inaccessible to the internet, bringing the entire application down", "The application switches to a backup proxy", "Servers become public facing"], ca: "All connected backend servers become inaccessible to the internet, bringing the entire application down", ci: 1, exp: "Because all traffic funnels through the load balancer, its failure cuts off the backend completely. Redundant load balancers (Active-Passive failover setups) are required to prevent this." }
    ]
  },
  {
    title: "SQL Tutorial for Beginners",
    url: cleanUrl("[https://youtu.be/4TymQ6qQjzc](https://youtu.be/4TymQ6qQjzc)"),
    slug: "sql-tutorial-beginners",
    duration: 8,
    mcqs: [
      { q: "What defines the strict schema of a traditional SQL database?", o: ["Data is stored in dynamic JSON documents", "Data is structured into rigidly defined tables with specific rows and strongly typed columns", "Data is stored as a network of nodes and edges", "Data is stored entirely in RAM"], ca: "Data is structured into rigidly defined tables with specific rows and strongly typed columns", ci: 1, exp: "A relational database enforces a strict blueprint. Every row in a 'Users' table must have the exact columns (ID, Name, Age) with exact data types (Integer, Varchar) defined by the schema." },
      { q: "What is the functional purpose of a Primary Key?", o: ["To encrypt the row data", "To uniquely identify a specific row/record within a table", "To link two tables together", "To sort the data alphabetically"], ca: "To uniquely identify a specific row/record within a table", ci: 1, exp: "A primary key (like a User ID) guarantees uniqueness. No two rows can have the same primary key, ensuring accurate querying and relationship building." },
      { q: "What is the purpose of a Foreign Key?", o: ["To allow external APIs to access the table", "To create a column that explicitly references the Primary Key of another table, establishing a strict relational link between the two", "To map JSON to SQL", "To encrypt passwords"], ca: "To create a column that explicitly references the Primary Key of another table, establishing a strict relational link between the two", ci: 1, exp: "If an 'Orders' table has a 'customer_id' column, that column is a foreign key pointing to the primary key in the 'Customers' table, tying the data together." },
      { q: "What is the difference between an INNER JOIN and a LEFT JOIN?", o: ["There is no difference", "INNER JOIN returns only rows that have matching values in both tables; LEFT JOIN returns all rows from the left table, and fills in NULL for missing matches on the right", "INNER JOIN modifies data; LEFT JOIN reads data", "INNER JOIN is faster than LEFT JOIN"], ca: "INNER JOIN returns only rows that have matching values in both tables; LEFT JOIN returns all rows from the left table, and fills in NULL for missing matches on the right", ci: 1, exp: "An INNER JOIN between Customers and Orders only returns customers who have placed an order. A LEFT JOIN returns all customers, showing NULL if they haven't ordered anything." },
      { q: "How do Database Indexes dramatically improve query performance?", o: ["By compressing the table data", "By storing a specialized, sorted data structure (like a B-Tree) that allows the database engine to find records in logarithmic time instead of scanning every single row sequentially", "By caching the result in the browser", "By upgrading the CPU"], ca: "By storing a specialized, sorted data structure (like a B-Tree) that allows the database engine to find records in logarithmic time instead of scanning every single row sequentially", ci: 1, exp: "Without an index, searching for a user named 'Zack' requires a Full Table Scan (checking every row). An index organizes the data so the engine can skip straight to 'Z' instantly." }
    ]
  },
  {
    title: "SQL Transactions and ACID Properties",
    url: cleanUrl("[https://youtu.be/LoxO-P7hhUQ](https://youtu.be/LoxO-P7hhUQ)"),
    slug: "sql-transactions-acid",
    duration: 7,
    mcqs: [
      { q: "In the context of SQL, what is the definition of a Transaction?", o: ["A financial payment", "A sequence of one or more SQL operations treated as a single, indivisible logical unit of work", "An automated backup script", "A query that returns more than 100 rows"], ca: "A sequence of one or more SQL operations treated as a single, indivisible logical unit of work", ci: 1, exp: "Transactions ensure that a block of queries (like updating two different balances during a fund transfer) execute together completely, or fail completely." },
      { q: "What does the 'Atomicity' property guarantee in an ACID-compliant database?", o: ["That data is compressed down to the atomic level", "That a transaction is all-or-nothing; if any single statement fails, the entire transaction is rolled back, leaving the database unchanged", "That the server will never crash", "That passwords are encrypted"], ca: "That a transaction is all-or-nothing; if any single statement fails, the entire transaction is rolled back, leaving the database unchanged", ci: 1, exp: "If a transfer deducts $100 from Account A but crashes before adding it to Account B, Atomicity guarantees the $100 is returned to Account A automatically via a rollback." },
      { q: "What does the 'Isolation' property of ACID ensure?", o: ["That databases are disconnected from the internet", "That concurrent transactions execute as if they were running serially, preventing them from interfering with each other's intermediate uncommitted states", "That primary keys are hidden", "That data is isolated into shards"], ca: "That concurrent transactions execute as if they were running serially, preventing them from interfering with each other's intermediate uncommitted states", ci: 1, exp: "If two users try to buy the last concert ticket at the exact same millisecond, Isolation locks the row so that Transaction A finishes before Transaction B can read the available ticket count." },
      { q: "What is a 'Dirty Read' anomaly in a database?", o: ["Reading a corrupted disk sector", "When a transaction reads data that has been updated by another concurrent transaction but has NOT yet been committed", "Reading data from a deleted table", "Reading data that is older than 24 hours"], ca: "When a transaction reads data that has been updated by another concurrent transaction but has NOT yet been committed", ci: 1, exp: "If Transaction B reads a bank balance modified by Transaction A, and then Transaction A rolls back, Transaction B has made a decision based on phantom 'dirty' data that technically never existed." },
      { q: "Which SQL isolation level provides the strictest protection, eliminating dirty reads, non-repeatable reads, and phantom reads entirely?", o: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"], ca: "Serializable", ci: 3, exp: "Serializable is the highest isolation level. It forces transactions to execute sequentially, guaranteeing perfect data accuracy at the cost of significantly reduced concurrency and performance bottlenecks." }
    ]
  },
  {
    title: "Hands-On Load Balancer Setup: Distribute Traffic Across Servers",
    url: cleanUrl("[https://youtu.be/CyWTPmlkOzU](https://youtu.be/CyWTPmlkOzU)"),
    slug: "load-balancer-hands-on",
    duration: 9,
    mcqs: [
      { q: "When setting up a Load Balancer, why is it critical to use a 'Regional' configuration rather than a 'Global' one for location-specific servers?", o: ["Global balancers are too expensive", "A Global load balancer forces all worldwide traffic through one physical entry point, severely increasing latency for users far from that location", "Regional balancers are the only ones that support HTTP", "Global balancers block IP addresses"], ca: "A Global load balancer forces all worldwide traffic through one physical entry point, severely increasing latency for users far from that location", ci: 1, exp: "If your servers are in San Francisco, setting up a global load balancer in Europe means an American user's request travels to Europe and back to San Francisco, creating massive latency." },
      { q: "What is required to achieve 'High Availability' when provisioning load balancers?", o: ["Configuring at least two (redundant) load balancer instances so that if one crashes, the failover unit instantly takes over", "Purchasing an expensive domain name", "Using a NoSQL database", "Setting the load balancer to port 8080"], ca: "Configuring at least two (redundant) load balancer instances so that if one crashes, the failover unit instantly takes over", ci: 0, exp: "A single load balancer is a catastrophic Single Point of Failure (SPOF). High Availability requires redundant pairs (Active-Passive or Active-Active) to ensure 100% uptime." },
      { q: "In a typical load balancer forwarding rule setup, how are ports mapped?", o: ["The load balancer listens on public Port 80/443 and forwards traffic to the backend server's internal application port (e.g., 3000)", "The load balancer listens on Port 3000 and forwards to Port 80", "The load balancer maps all ports to Port 22", "Ports are randomized for security"], ca: "The load balancer listens on public Port 80/443 and forwards traffic to the backend server's internal application port (e.g., 3000)", ci: 0, exp: "Users hit the standard HTTP/HTTPS ports (80/443) on the load balancer. The load balancer proxies that traffic over the private network to Node.js/Python running on port 3000/5000." },
      { q: "Why must backend droplets/servers be located in the exact same physical Data Center as the Regional Load Balancer?", o: ["Because they must share a monitor", "Because the load balancer routes traffic over the ultra-fast internal private network, which doesn't span across different physical data centers", "Because DigitalOcean charges extra for cross-region", "Because of timezone differences"], ca: "Because the load balancer routes traffic over the ultra-fast internal private network, which doesn't span across different physical data centers", ci: 1, exp: "Routing traffic over the public internet between a load balancer in NY and a server in SF defeats the purpose. They must sit in the same facility to utilize private VPC networking." },
      { q: "What happens automatically if the load balancer's continuous 'Health Check' detects that Server B has crashed?", o: ["The load balancer crashes", "The load balancer instantly stops routing new user traffic to Server B, funneling 100% of requests to healthy servers until Server B recovers", "The load balancer deletes Server B", "The load balancer sends an email to the users"], ca: "The load balancer instantly stops routing new user traffic to Server B, funneling 100% of requests to healthy servers until Server B recovers", ci: 1, exp: "Health checks guarantee that users are never served an error page. If a server stops responding to internal pings, it is temporarily evicted from the routing pool." }
    ]
  },
  {
    title: "REST vs GraphQL",
    url: cleanUrl("[https://youtu.be/FI_jvrgT52E](https://youtu.be/FI_jvrgT52E)"),
    slug: "rest-vs-graphql-comparison",
    duration: 7,
    mcqs: [
      { q: "What is a defining architectural constraint of RESTful APIs?", o: ["They use WebSockets exclusively", "They are strictly stateful and maintain client sessions in RAM", "They are stateless, meaning each HTTP request must contain all contextual data (like auth tokens) needed to process it independently", "They only return XML data"], ca: "They are stateless, meaning each HTTP request must contain all contextual data (like auth tokens) needed to process it independently", ci: 2, exp: "Because REST is stateless, the server doesn't remember who you are. This statelessness allows horizontal scaling because any server can process any request independently." },
      { q: "What specific data-fetching problem does GraphQL solve that REST struggles with?", o: ["Data encryption failures", "The 'Over-fetching' and 'Under-fetching' of data; GraphQL allows clients to explicitly request only the exact fields they need in a single round-trip", "SQL Injection attacks", "Image optimization"], ca: "The 'Over-fetching' and 'Under-fetching' of data; GraphQL allows clients to explicitly request only the exact fields they need in a single round-trip", ci: 1, exp: "In REST, hitting `/users/1` might return 50 fields when you only needed `name`. In GraphQL, you send a query asking explicitly for `name`, and nothing else is transmitted." },
      { q: "How do API endpoints differ conceptually between REST and GraphQL?", o: ["REST has one endpoint; GraphQL has many", "REST maps multiple unique URLs to specific resources (e.g., /users, /posts); GraphQL exposes one single endpoint (e.g., /graphql) that handles all queries and mutations", "REST uses UDP; GraphQL uses TCP", "There is no difference in endpoint structure"], ca: "REST maps multiple unique URLs to specific resources (e.g., /users, /posts); GraphQL exposes one single endpoint (e.g., /graphql) that handles all queries and mutations", ci: 1, exp: "REST relies on routing mechanisms to map URLs to controllers. GraphQL relies on a single POST endpoint where the payload dictates what resolver functions execute." },
      { q: "How is caching typically handled differently between REST and GraphQL?", o: ["GraphQL caches automatically; REST requires third-party libraries", "REST natively leverages built-in HTTP caching mechanisms (like ETags and Cache-Control headers); GraphQL operates entirely via POST requests, making native HTTP caching extremely difficult", "Both use the exact same caching methods", "Neither supports caching"], ca: "REST natively leverages built-in HTTP caching mechanisms (like ETags and Cache-Control headers); GraphQL operates entirely via POST requests, making native HTTP caching extremely difficult", ci: 1, exp: "Because a GraphQL endpoint is a single URL accessed via POST, CDNs and browsers cannot automatically cache it like they can with a unique REST GET URL." },
      { q: "What acts as the strict contract between the client and server in GraphQL?", o: ["The HTTP Status Codes", "The SQL Database Schema", "A strongly typed GraphQL Schema defining all available types, queries, and mutations", "The Redux Store"], ca: "A strongly typed GraphQL Schema defining all available types, queries, and mutations", ci: 2, exp: "The GraphQL schema explicitly defines the exact shape of the graph, acting as documentation and validation. Clients know exactly what they can ask for and what type it will be." }
    ]
  },
  {
    title: "How to Design APIs Like a Senior Engineer (REST, GraphQL, Auth, Security)",
    url: cleanUrl("[https://youtu.be/Rrd6xkyjPB8](https://youtu.be/Rrd6xkyjPB8)"),
    slug: "api-design-senior-engineer",
    duration: 95,
    mcqs: [
      { q: "What is the primary difference between Authentication and Authorization in API security?", o: ["They are interchangeable terms", "Authentication confirms WHO the user is (Identity); Authorization determines WHAT the user is allowed to do (Permissions)", "Authentication uses tokens; Authorization uses passwords", "Authentication is for frontend; Authorization is for backend"], ca: "Authentication confirms WHO the user is (Identity); Authorization determines WHAT the user is allowed to do (Permissions)", ci: 1, exp: "Logging in verifies your identity (Authentication). Attempting to delete a database table checks if you have 'Admin' rights to perform that action (Authorization)." },
      { q: "What is the key functional distinction between an Access Token and a Refresh Token?", o: ["Access tokens are stored in local storage; Refresh tokens are stored in Redux", "Access tokens are short-lived (e.g., 15 mins) and sent with every API request; Refresh tokens are long-lived and securely stored to silently fetch new access tokens when they expire", "Access tokens are for REST; Refresh tokens are for GraphQL", "There is no functional distinction"], ca: "Access tokens are short-lived (e.g., 15 mins) and sent with every API request; Refresh tokens are long-lived and securely stored to silently fetch new access tokens when they expire", ci: 1, exp: "If an Access Token is stolen, the damage is limited to 15 minutes. The Refresh Token is kept securely in an HTTP-Only cookie, protecting the user's permanent session." },
      { q: "Why is OAuth 2.0 classified as an 'Authorization Framework' rather than an 'Authentication Method'?", o: ["Because it uses JSON", "Because it proves identity natively", "Because it does not tell the app WHO you are; it merely issues an access token proving the user granted the app permission to access specific resources on their behalf", "Because it only works with Google"], ca: "Because it does not tell the app WHO you are; it merely issues an access token proving the user granted the app permission to access specific resources on their behalf", ci: 2, exp: "OAuth 2.0 (like 'Connect to Google Drive') gives the app a token to read your files. It doesn't authenticate your identity to the app itself. OpenID Connect (OIDC) layers identity on top of OAuth." },
      { q: "What does the 'Role-Based Access Control' (RBAC) model rely on to enforce API security?", o: ["Dynamic environment variables like time of day", "Specific Access Control Lists (ACL) attached to every single file", "Assigning users to predefined Roles (e.g., Admin, Editor, Viewer), where each Role contains a fixed set of granted permissions", "It relies entirely on JWT expiration"], ca: "Assigning users to predefined Roles (e.g., Admin, Editor, Viewer), where each Role contains a fixed set of granted permissions", ci: 2, exp: "RBAC is the most common model. Instead of assigning 50 distinct permissions to a user, you assign them the 'Admin' role, which inherently possesses those 50 permissions." },
      { q: "How does implementing 'Rate Limiting' on an API Gateway protect backend infrastructure?", o: ["It encrypts the incoming JSON payload", "It restricts the maximum number of HTTP requests a specific IP or User can make within a defined time window, mitigating abuse, brute-force, and DDoS attacks", "It forces users to upgrade their subscription", "It compresses video files"], ca: "It restricts the maximum number of HTTP requests a specific IP or User can make within a defined time window, mitigating abuse, brute-force, and DDoS attacks", ci: 1, exp: "If a malicious script tries to guess a password 10,000 times a second, a Rate Limiter at the gateway intercepts and drops the traffic, returning an HTTP 429 Too Many Requests." }
    ]
  }
];

async function appendLecturesToSystemDesignTrack() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Locate the System Design Track
    const trackRes = await client.query(`SELECT id FROM tracks WHERE slug = 'frontend-system-design';`);
    if (trackRes.rows.length === 0) {
      throw new Error("Track 'frontend-system-design' not found. Run the previous seed scripts first.");
    }
    const sdTrackId = trackRes.rows[0].id;
    console.log(`Found Web Architecture & Frontend System Design Track (ID: ${sdTrackId})`);

    const creatorName = 'Hayk Simonyan';
    const creatorChannelUrl = cleanUrl('[https://www.youtube.com/@HaykSimonyan](https://www.youtube.com/@HaykSimonyan)');

    // 2. Append Lectures 31-39 (composite covering lectures 31-44)
    for (const [index, data] of SYSTEM_DESIGN_PART_4_DATA.entries()) {
      let topicId;
      const checkTopic = await client.query(`SELECT id FROM topics WHERE slug = $1;`, [data.slug]);
      
      const topicOrder = index + 31; // Ordering 31 to 39

      // Normalize MCQs for the frontend schema - options stored strictly as simple flat strings
      const letters = ["A", "B", "C", "D"];
      const normalizedQs = data.mcqs.map((m, qIdx) => ({
        id: qIdx + 1,
        question: m.q,
        type: "multiple_choice",
        options: m.o, // SIMPLE FLAT STRINGS
        correct_answer: m.ca,
        correct_index: m.ci,
        correctAnswer: letters[m.ci] || "A",
        answer: letters[m.ci] || "A",
        explanation: m.exp
      }));

      const videoLinks = JSON.stringify([
        {
          title: data.title,
          url: data.url,
          duration_minutes: data.duration,
          creator_name: creatorName,
          creator_channel_url: creatorChannelUrl
        }
      ]);

      const insertParams = [
        data.title,                       // $1 name
        data.title,                       // $2 title
        data.slug,                        // $3 slug
        topicOrder,                       // $4 topic_order
        'Advanced System Concepts',       // $5 module_name
        data.duration,                    // $6 duration_minutes
        data.duration,                    // $7 estimated_minutes
        data.url,                         // $8 video_url
        data.title,                       // $9 video_title
        `Comprehensive overview of ${data.title.split(':')[0].split('Explained')[0].trim()} covering low-level transport mechanisms, architectural scaling, and system persistence.`, // $10 short_description
        `Comprehensive overview of ${data.title.split(':')[0].split('Explained')[0].trim()} covering low-level transport mechanisms, architectural scaling, and system persistence.`, // $11 description
        `> **Architecture Overview:** Essential technical concepts and structural principles vital for robust, scalable web architectures. Focus deeply on the mechanical trade-offs discussed in this module.`, // $12 summary_markdown
        `> **Architecture Overview:** Essential technical concepts and structural principles vital for robust, scalable web architectures. Focus deeply on the mechanical trade-offs discussed in this module.`, // $13 theory_summary
        JSON.stringify(normalizedQs),      // $14 practice_items
        videoLinks,                       // $15 video_links
        creatorName,                      // $16 creator_name
        creatorChannelUrl                 // $17 creator_channel_url
      ];

      if (checkTopic.rows.length === 0) {
        const ins = await client.query(`
          INSERT INTO topics (
            name, title, slug, topic_order, module_name, 
            duration_minutes, estimated_minutes, video_url, video_title, 
            short_description, description, summary_markdown, theory_summary, 
            practice_items, video_links, creator_name, creator_channel_url
          )
          VALUES (
            $1, $2, $3, $4, $5, 
            $6, $7, $8, $9, 
            $10, $11, $12, $13, 
            $14::jsonb, $15::jsonb, $16, $17
          )
          RETURNING id;
        `, insertParams);
        topicId = ins.rows[0].id;
      } else {
        topicId = checkTopic.rows[0].id;
        await client.query(`
          UPDATE topics SET 
            name = $1,
            title = $2,
            slug = $3,
            topic_order = $4,
            module_name = $5,
            duration_minutes = $6,
            estimated_minutes = $7,
            video_url = $8,
            video_title = $9,
            short_description = $10,
            description = $11,
            summary_markdown = $12,
            theory_summary = $13,
            practice_items = $14::jsonb,
            video_links = $15::jsonb,
            creator_name = $16,
            creator_channel_url = $17
          WHERE id = $18;
        `, [...insertParams, topicId]);
      }

      // Bind to track
      const mapCheck = await client.query(`SELECT 1 FROM track_topics WHERE track_id = $1 AND topic_id = $2;`, [sdTrackId, topicId]);
      if (mapCheck.rows.length === 0) {
        await client.query(`INSERT INTO track_topics (track_id, topic_id, topic_order) VALUES ($1, $2, $3);`, [sdTrackId, topicId, topicOrder]);
      } else {
        await client.query(`UPDATE track_topics SET topic_order = $3 WHERE track_id = $1 AND topic_id = $2;`, [sdTrackId, topicId, topicOrder]);
      }

      // Upsert Resource mapping
      const resCheck = await client.query(`SELECT 1 FROM information_schema.tables WHERE table_name = 'resources';`);
      if (resCheck.rows.length > 0) {
        const existRes = await client.query(`SELECT id FROM resources WHERE topic_id = $1 AND resource_type = 'video';`, [topicId]);
        if (existRes.rows.length === 0) {
          await client.query(`
            INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes, creator_name, creator_channel_url)
            VALUES ($1, $2, $3, 'video', $4, $5, $6);
          `, [topicId, data.title, data.url, data.duration, creatorName, creatorChannelUrl]);
        } else {
          await client.query(`
            UPDATE resources 
            SET title = $1, url = $2, estimated_minutes = $3, creator_name = $4, creator_channel_url = $5 
            WHERE topic_id = $6 AND resource_type = 'video';
          `, [data.title, data.url, data.duration, creatorName, creatorChannelUrl, topicId]);
        }
      }
      
      console.log(`Appended Topic [${topicOrder}/39]: ${data.title} (ID: ${topicId})`);
    }

    // 3. Update the Track's Overall Stats (Sums duration from all 39 topics)
    const statsRes = await client.query(`
      SELECT COUNT(t.id)::int as total_topics, COALESCE(SUM(t.duration_minutes), 0)::int as total_minutes 
      FROM topics t
      JOIN track_topics tt ON tt.topic_id = t.id
      WHERE tt.track_id = $1;
    `, [sdTrackId]);
    
    const totalTopics = parseInt(statsRes.rows[0].total_topics);
    const totalHours = Math.ceil(parseInt(statsRes.rows[0].total_minutes) / 60);

    await client.query(`
      UPDATE tracks 
      SET total_topics = $1, duration_hours = $2 
      WHERE id = $3;
    `, [totalTopics, totalHours, sdTrackId]);

    // 4. Recalculate Path Totals for 'React' path
    const pathRes = await client.query(`SELECT id FROM preparation_paths WHERE slug ILIKE '%react%' OR name ILIKE '%react%' LIMIT 1;`);
    if (pathRes.rows.length > 0) {
      const pathId = pathRes.rows[0].id;
      const tableCheck = await client.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name IN ('path_tracks', 'preparation_path_tracks');
      `);
      const joinTable = tableCheck.rows.map(r => r.table_name).includes('preparation_path_tracks') ? 'preparation_path_tracks' : 'path_tracks';
      
      const sumRes = await client.query(`
        SELECT COALESCE(SUM(t.total_topics), 0)::int AS total_topics, COUNT(pt.track_id)::int AS total_tracks
        FROM ${joinTable} pt JOIN tracks t ON pt.track_id = t.id WHERE pt.path_id = $1;
      `, [pathId]);

      await client.query(`
        UPDATE preparation_paths SET total_tracks = $1, total_topics = $2 WHERE id = $3;
      `, [sumRes.rows[0].total_tracks, sumRes.rows[0].total_topics, pathId]);
    }

    await client.query('COMMIT');
    console.log(`\nSuccessfully appended Lectures 31-44 to Frontend System Design Track!`);
    console.log(`Track now has ${totalTopics} topics evaluated at ~${totalHours} hours.`);

    // Verification CLI Outputs
    const trackTopicsRes = await client.query(`
      SELECT tt.topic_order, t.id AS topic_id, t.title, t.slug, t.duration_minutes, jsonb_array_length(t.practice_items) AS question_count
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = $1
      ORDER BY tt.topic_order ASC;
    `, [sdTrackId]);
    console.log('\n--- ALL 39 TOPICS IN SYSTEM DESIGN TRACK ---');
    console.table(trackTopicsRes.rows);

    const trackDetailsRes = await client.query(`
      SELECT id, title, slug, total_topics, duration_hours, evaluation_type
      FROM tracks
      WHERE id = $1;
    `, [sdTrackId]);
    console.log('\n--- TRACK METRICS ---');
    console.table(trackDetailsRes.rows);

    if (pathRes.rows.length > 0) {
      const pathVerify = await client.query(`
        SELECT id, name, total_tracks, total_topics
        FROM preparation_paths
        WHERE id = $1;
      `, [pathRes.rows[0].id]);
      console.log('\n--- PATH METRICS ---');
      console.table(pathVerify.rows);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

appendLecturesToSystemDesignTrack();
