const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const hldBatch3 = [
  // ===========================================================================
  // TOPIC 7: CONSISTENT HASHING
  // ===========================================================================
  {
    topic_order: 7,
    slug: 'hld-consistent-hashing',
    title: 'Consistent Hashing',
    module_name: 'High Level Design',
    duration_minutes: 31,
    video_url: 'https://youtu.be/IC5Y1EE-aj4',
    video_title: 'Consistent Hashing - System Design',
    short_description: 'Solve distributed cache reshuffling and database sharding bottlenecks using Hash Rings, Virtual Nodes, and bounded key redistributions.',
    summary_markdown: `### 📌 1. The Flaw of Traditional Modulo Hashing
* In naive sharding, keys are mapped to servers using \`hash(key) % N\` where \`N\` is the number of servers.
* **The Problem:** Adding or removing a single server changes \`N\` to \`N+1\` or \`N-1\`. This causes almost **all existing keys to map to new nodes**, triggering massive cache invalidation storms and database connection saturation.

### 💡 2. The Consistent Hashing Ring
* Both servers and data keys are mapped onto an abstract circular address space (**Hash Ring**, typically 0 to $2^{32}-1$).
* **Mapping Logic:** To locate the server for a given key, hash the key to a position on the ring and walk **clockwise** until encountering the first available server node.
* **Minimal Disruption:** Adding or removing a node only redistributes keys located between the affected node and its immediate predecessor (on average only $K/N$ keys move), leaving all other servers completely untouched.

### 💡 3. Virtual Nodes (Vnodes)
* **Hot Spot Problem:** With few physical nodes, random hashing positions can leave servers unevenly spaced, causing one node to hold 80% of data while others sit idle.
* **Solution:** Assign multiple **Virtual Nodes** (e.g., 100–300 tokens per physical node) spread throughout the ring. This balances load uniformly and ensures failed node capacity is shared equally across all survivors.`,
    practice_items: [
      {
        id: 'hld-v7-q1',
        questionNumber: 1,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q1: Failure of Modulo Hashing in Distributed Caching',
        question: 'Why does standard modulo hashing (hash(key) % N) fail catastrophically in a distributed caching tier like Memcached or Redis when servers are dynamically scaled up or down?',
        answer: '**Detailed Answer:**\n\nUnder standard modulo hashing, if you have 4 cache servers ($N = 4$), a key with hash 14 maps to server $14 \\% 4 = 2$.\n\nIf one server crashes or you scale out to 5 servers ($N = 5$), the denominator changes for all future lookups. The same key now evaluates to $14 \\% 5 = 4$. \n\n**The Catastrophe:** Nearly **100% of all cached keys across the entire cluster instantly miss**, because their modulo hash resolves to the wrong physical node. This causes a massive "Cache Stampede" (Thundering Herd) where millions of client queries bypass the cache and hit the primary database simultaneously, leading to catastrophic database outages.'
      },
      {
        id: 'hld-v7-q2',
        questionNumber: 2,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q2: Mechanism of the Consistent Hashing Ring',
        question: 'Explain how Consistent Hashing maps keys to servers on a conceptual ring. What fraction of keys must be moved when a new server joins a cluster of N nodes?',
        answer: '**Detailed Answer:**\n\n**Mechanism:**\n1. A fixed 360-degree circular integer range (e.g., $0$ to $2^{32}-1$) forms the Hash Ring.\n2. Server IP addresses or identifiers are hashed using a uniform function (e.g., MurmurHash) and placed at coordinates on the ring.\n3. Incoming request keys are hashed using the exact same function to determine their ring coordinates.\n4. To route a key, the algorithm traverses the ring **clockwise** from the key coordinate until it reaches the first server node.\n\n**Fraction of Keys Moved:**\nWhen a new server joins, it only assumes responsibility for keys situated between itself and its immediate counter-clockwise neighbor. On average, only **$K/N$ keys** (where $K$ is total keys and $N$ is total servers) need to be reassigned, leaving the remaining $(N-1)/N$ keys completely intact.'
      },
      {
        id: 'hld-v7-q3',
        questionNumber: 3,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q3: Non-Uniform Distribution & Virtual Nodes',
        question: 'What is the "Hot Spot" problem in basic Consistent Hashing, and how do Virtual Nodes (Vnodes) mathematically resolve data skewness?',
        answer: '**Detailed Answer:**\n\n**The Hot Spot Problem:** With a small number of physical nodes (e.g., 3 servers), random hash outputs often place nodes close together on the ring. One server may end up responsible for 70% of the ring circumference while another covers only 5%, leading to CPU exhaustion and out-of-memory crashes on the overburdened node.\n\n**Virtual Nodes Solution:**\nInstead of placing each physical server on the ring once, each physical server is mapped to multiple logical points (e.g., 100 to 256 "virtual nodes" created by hashing `server_ip#1`, `server_ip#2`, etc.).\n\nBecause hundreds of virtual nodes per server are interweaved randomly across the ring, the law of large numbers guarantees an evenly distributed circumference for each physical machine (standard deviation drops drastically). If a physical machine fails, its load is evenly inherited by all remaining nodes rather than overwhelming a single neighbor.'
      },
      {
        id: 'hld-v7-q4',
        questionNumber: 4,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Very Hard',
        title: 'Q4: Consistent Hashing with Replication for High Availability',
        question: 'In distributed storage engines like Apache Cassandra or Amazon DynamoDB, how is Consistent Hashing adapted to maintain replication factors (e.g., RF=3) while surviving node failures?',
        answer: '**Detailed Answer:**\n\nTo achieve fault tolerance, storage engines do not store data on only one node on the ring:\n1. **Replication Walk:** When a key is hashed, it routes clockwise to the first node (the "Coordinator" or Primary replica).\n2. **Preference List:** The coordinator automatically routes copies of the write to the next $N-1$ physically distinct nodes appearing immediately clockwise on the ring.\n3. **Physical Node Diversity:** The ring topology aware router ensures that these next clockwise virtual nodes map to distinct physical server racks or availability zones to prevent co-located power failure loss.\n4. **Quorum Consistency:** Reads and writes use quorum formulas ($R + W > N$) over these clockwise replicas. If one replica node crashes, the remaining nodes on the ring handle the read/write seamlessly.'
      },
      {
        id: 'hld-v7-q5',
        questionNumber: 5,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q5: Identifying Affected Key Ranges During Rebalancing',
        question: 'When a new node S_new is inserted onto a consistent hash ring between existing nodes S_prev and S_next, describe the exact key range that must be migrated and which node offloads the data.',
        answer: '**Detailed Answer:**\n\nOn a clockwise consistent hash ring:\n1. Prior to insertion, all keys falling in the arc between `S_prev` and `S_next` routed clockwise into `S_next`.\n2. When `S_new` is inserted between `S_prev` and `S_next`, the ring partition between `(S_prev, S_new]` now routes directly to `S_new`.\n3. Therefore, the only affected key range is `(S_prev, S_new]`.\n4. **Data Offloading:** `S_next` is the only node that held those keys. `S_next` streams that specific subset of keys over to `S_new` and evicts them from its own storage. No other nodes on the ring participate in the migration.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 8: HOW VIDEO STREAMING WORKS ON SCALE
  // ===========================================================================
  {
    topic_order: 8,
    slug: 'hld-video-streaming-architecture',
    title: 'How Video Streaming Works on Scale',
    module_name: 'High Level Design',
    duration_minutes: 31,
    video_url: 'https://youtu.be/-JtjQ-OA7XE',
    video_title: 'How Video Streaming Works on Scale - System Design',
    short_description: 'Architecting high-scale video delivery pipelines using Adaptive Bitrate Streaming (ABR), HLS, MPEG-DASH, and chunked media transcoding.',
    summary_markdown: `### 📌 1. Progressive Download vs. Streaming
* **Progressive Download:** The browser downloads an entire monolithic \`.mp4\` file over HTTP.
  * *Flaws:* High initial buffering latency, wasted server bandwidth if user stops watching after 10 seconds, and no adaptation to changing network bandwidth.
* **True Streaming:** Media is chopped into short, discrete chunks (2–6 seconds each) downloaded dynamically as playback progresses.

### 💡 2. Adaptive Bitrate Streaming (ABR)
* **The Core Problem:** Mobile users move between fast Wi-Fi and slow cellular networks, while screens range from smartwatches to 4K TVs.
* **ABR Solution:** Video files are pre-transcoded into multiple resolution and bitrate tiers (e.g., 240p, 360p, 720p, 1080p, 4K).
* **Dynamic Player Adaptation:** The client video player continuously monitors buffer occupancy and download throughput. If bandwidth drops, it requests the next 3-second chunk in 480p instead of 1080p, preventing playback stalls and buffering spinners.

### 💡 3. Protocols: HLS & MPEG-DASH
* **HLS (HTTP Live Streaming by Apple):** Uses \`.m3u8\` playlist files and \`.ts\` / \`.mp4\` segment chunks. A Master Manifest lists available qualities; child manifests list chronological chunk URLs.
* **MPEG-DASH:** Open international standard using XML-based Media Presentation Description (\`.mpd\`) manifests.`,
    practice_items: [
      {
        id: 'hld-v8-q1',
        questionNumber: 1,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q1: Progressive Download vs Streaming Bandwidth Wastage',
        question: 'Why does hosting raw .mp4 files with Progressive Download cause massive financial losses in cloud egress fees for platforms like YouTube or Netflix when users abandon videos early?',
        answer: '**Detailed Answer:**\n\nIn Progressive Download, when a user clicks play, the client requests the whole file or aggressively buffers hundreds of megabytes ahead via HTTP byte-range requests.\n\nIf a user opens a 2-hour 1080p video (~2.5 GB) and clicks away after 15 seconds, the progressive player may have already downloaded 300 MB to 1 GB of data. Across hundreds of millions of users, paying cloud egress fees (e.g., AWS CloudFront / S3 data transfer out at $0.08/GB) on unwatched buffered data burns millions of dollars.\n\nChunk-based streaming (HLS/DASH) fetches data in small 2-to-6-second chunks strictly on-demand. If the user leaves after 15 seconds, only ~15 seconds of media data was downloaded, reducing wasted egress bandwidth to nearly zero.'
      },
      {
        id: 'hld-v8-q2',
        questionNumber: 2,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q2: How Adaptive Bitrate Streaming (ABR) Prevents Playback Freezes',
        question: 'Explain the internal algorithmic mechanism of Adaptive Bitrate Streaming (ABR). How does a video player shift quality mid-playback without audio/video de-sync?',
        answer: '**Detailed Answer:**\n\n1. **Pre-Transcoding:** During video ingestion, FFmpeg processes raw media into multiple discrete bitrate/resolution profiles (e.g., 360p at 500kbps, 720p at 2.5Mbps, 1080p at 5Mbps). Each stream is sliced into identical time-aligned chunks (e.g., exactly 4.00 seconds).\n2. **Manifest Files:** A master manifest file (`master.m3u8`) describes these streams to the client player.\n3. **Client Heuristics:** The client video player runs an ABR algorithm measuring two metrics: *Download Throughput* (how fast chunk $N$ downloaded) and *Buffer Length* (how many seconds of decoded video remain in memory).\n4. **Seamless Switching:** If buffer health declines because network throughput dipped below 5Mbps, the player finishes decoding chunk $K$ in 1080p and requests chunk $K+1$ from the 480p playlist. Because chunk keyframes (I-frames) are strictly time-synchronized across all encoded bitrates, the player transitions instantly with zero audio crackle, visual freeze, or buffering spinners.'
      },
      {
        id: 'hld-v8-q3',
        questionNumber: 3,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q3: Master Manifest vs Media Manifest in HLS',
        question: 'Describe the hierarchical structure of HLS playlists. What is the difference between a Master Manifest (.m3u8) and a Variant/Media Manifest (.m3u8)?',
        answer: '**Detailed Answer:**\n\nHLS utilizes a two-tier manifest hierarchy:\n\n1. **Master Manifest (`master.m3u8`):** This is the entry point URL loaded by the client player. It contains metadata about all available video and audio streams (codecs, resolutions, aspect ratios, and target bitrates). It does NOT contain video segment chunk links. Instead, it links to child playlist URLs.\n\n2. **Variant / Media Manifest (e.g., `720p.m3u8`, `1080p.m3u8`):** Each media manifest corresponds to one specific encoding profile. It contains the ordered list of actual media segment file URLs (e.g., `segment_001.ts`, `segment_002.ts`) along with their exact durations (`#EXTINF:4.0`).\n\nThe client first fetches the Master Manifest once, selects an initial profile, fetches that profile\'s Media Manifest, and starts downloading chunk files sequentially.'
      },
      {
        id: 'hld-v8-q4',
        questionNumber: 4,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Very Hard',
        title: 'Q4: Asynchronous Video Transcoding Ingestion Pipeline',
        question: 'Design the backend architecture for a video upload and ingestion pipeline that converts a 4K raw video upload into HLS multi-bitrate streams without blocking web servers.',
        answer: '**Detailed Answer:**\n\n1. **Pre-signed S3 Upload:** The client requests an upload URL from an API Gateway. The server returns a pre-signed S3 PUT URL, allowing the client to upload the 5GB raw video directly to an S3 Ingestion Bucket, bypassing application server memory.\n2. **S3 Event Notification:** Upon upload completion, S3 triggers an event notification to an AWS SNS topic or SQS queue.\n3. **Orchestration & Fan-Out:** An orchestrator service pulls the task and submits parallel jobs to a cluster of worker instances (e.g., AWS Batch / ECS running FFmpeg or AWS Elemental MediaConvert).\n4. **Chunking & Transcoding:** Workers slice and encode the video into chunks (240p, 480p, 720p, 1080p, 4K) and generate the `.m3u8` playlist files.\n5. **Destination Bucket & CDN:** The resulting segments and manifests are written to an S3 Origin Bucket fronted by Amazon CloudFront (CDN) with aggressive edge-caching configured for immutable `.ts` segment files.\n6. **Callback:** The worker writes a completion status to the database, notifying the user via WebSockets/Push notification that processing is finished.'
      },
      {
        id: 'hld-v8-q5',
        questionNumber: 5,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q5: Caching Video Segments at CDN Edge Locations',
        question: 'Why are chunked streaming protocols (HLS/DASH) inherently ideal for Content Delivery Networks (CDNs), while legacy protocols like RTMP are not?',
        answer: '**Detailed Answer:**\n\n1. **Standard HTTP/HTTPS Delivery:** HLS and DASH run over standard HTTP port 80/443 using standard `GET` requests. They bypass strict enterprise firewalls and require no proprietary streaming server software on edge routers.\n2. **Cacheability of Immutable Segments:** Every media segment (e.g., `segment_105.ts`) represents an immutable static file that never changes. CDNs can cache segments indefinitely at edge PoPs with high Cache-Hit Ratios (>98%). Once one viewer in a city watches a viral video chunk, subsequent viewers in that region receive it directly from the local edge cache with zero origin server traffic.\n3. **RTMP Limitations:** Legacy RTMP relies on persistent, stateful TCP socket connections over non-standard port 1935. Standard edge caching proxies cannot cache RTMP streams, requiring expensive dedicated media streaming servers that fail to scale elastically.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 9: SYSTEM DESIGN OF UPI PAYMENTS
  // ===========================================================================
  {
    topic_order: 9,
    slug: 'hld-upi-payments-system-design',
    title: 'System Design of UPI Payments',
    module_name: 'High Level Design',
    duration_minutes: 25,
    video_url: 'https://youtu.be/fqySz1Me2pI',
    video_title: 'System Design of UPI Payments',
    short_description: 'Architectural breakdown of India\'s Unified Payments Interface: VPA abstractions, NPCI central switch, TPAP apps, and multi-bank 2PC transaction settlements.',
    summary_markdown: `### 📌 1. Legacy Digital Payments vs. UPI
* **Pre-UPI Banking:** IMPS, NEFT, RTGS required sharing sensitive 16-digit account numbers, IFSC codes, and branch identifiers.
* **UPI (Unified Payments Interface):** Built by NPCI (National Payments Corporation of India), introduces the **Virtual Payment Address (VPA)** abstraction (e.g., \`username@bankhandle\`) eliminating raw bank detail exposure.

### 💡 2. Architectural Participants in UPI
* **TPAP (Third-Party Application Provider):** Consumer-facing frontends (Google Pay, PhonePe, Paytm).
* **Payer / Payee PSP (Payment Service Provider Banks):** TPAPs partner with authorized banking members (e.g., Axis, ICICI, Yes Bank) who possess direct gateway clearance into NPCI.
* **NPCI Central Switch:** The central, secure national clearinghouse and message routing backbone that manages settlement and inter-bank handshakes.
* **Remitter (Payer) Bank & Beneficiary (Payee) Bank:** Core Banking Systems (CBS) holding actual user checking accounts.

### 💡 3. Transaction Flow & 2-Phase Commit
* **Push Transaction (Pay):** Payer authorizes PIN on trusted NPCI library $\\rightarrow$ Remitter Bank debits funds $\\rightarrow$ NPCI instructs Beneficiary Bank to credit funds $\\rightarrow$ Dual acknowledgment triggers success.
* **Rollback on Timeout:** If Beneficiary bank fails to acknowledge credit within timeout thresholds, NPCI triggers automatic reversal credit back to the remitter to preserve ledger consistency.`,
    practice_items: [
      {
        id: 'hld-v9-q1',
        questionNumber: 1,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q1: The VPA Abstraction and Security',
        question: 'How does the Virtual Payment Address (VPA) in UPI eliminate the systemic security vulnerabilities of traditional bank transfers (NEFT/IMPS)?',
        answer: '**Detailed Answer:**\n\nTraditional bank transfers require the payee to disclose their exact bank account number, account holder name, and IFSC branch code. Exposing this information introduces risks of social engineering, identity theft, and fraudulent mandates.\n\n**The VPA Abstraction:**\nA Virtual Payment Address (VPA, e.g., `user@okicici`) decouples identity from physical bank storage:\n1. **Zero Exposure:** The payer and merchant only ever see the string alias; the underlying 16-digit account number and branch routing code remain hidden inside NPCI\'s encrypted registry.\n2. **Portability:** A user can switch their underlying savings account from HDFC to SBI without changing their public VPA identifier.\n3. **Interoperability:** Any TPAP app can transfer funds to any other TPAP app because the VPA resolves globally through the central NPCI directory.'
      },
      {
        id: 'hld-v9-q2',
        questionNumber: 2,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q2: Roles of TPAP vs PSP Bank vs NPCI',
        question: 'Differentiate the architectural responsibilities between a TPAP (like Google Pay or PhonePe), a PSP Bank (like Yes Bank or ICICI), and the NPCI Central Switch in a UPI transaction.',
        answer: '**Detailed Answer:**\n\n1. **TPAP (Third-Party Application Provider - e.g., PhonePe, GPay):**\n   * Consumer-facing UI layer.\n   * Manages user login, QR code scanning, transaction history, and initiates the payment intent.\n   * TPAPs are NOT licensed banks and have ZERO direct access to the NPCI core financial switch.\n\n2. **PSP Bank (Payment Service Provider - e.g., Axis Bank, ICICI Bank):**\n   * Licensed banking institution acting as the sponsor/gateway for the TPAP.\n   * Validates client digital signatures and securely connects to NPCI\'s closed financial network on behalf of the TPAP.\n\n3. **NPCI Central Switch (National Payments Corporation of India):**\n   * The central clearinghouse and routing engine.\n   * Maintains the global lookup table mapping VPAs to Core Banking System (CBS) account numbers.\n   * Orchestrates the inter-bank debit/credit instructions and guarantees multilateral netting and final settlement between banks.'
      },
      {
        id: 'hld-v9-q3',
        questionNumber: 3,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Very Hard',
        title: 'Q3: End-to-End Push Transaction Lifecycle',
        question: 'Trace the end-to-end lifecycle of a successful UPI Push transaction from the moment user A enters their UPI PIN to when user B receives funds.',
        answer: '**Detailed Answer:**\n\n1. **Intent Creation:** User A enters user B\'s VPA and amount on PhonePe. PhonePe sends this intent to its sponsor PSP Bank (e.g., Yes Bank).\n2. **NPCI Address Resolution:** PSP Bank routes the request to NPCI. NPCI resolves user B\'s VPA to their underlying bank (e.g., HDFC Bank, Account XYZ).\n3. **PIN Entry via Common Library:** PhonePe renders NPCI\'s encrypted Common Library (CL) MPIN screen. The PIN is encrypted on the device hardware using the remitter bank\'s public key and sent securely via NPCI to the Remitter Bank.\n4. **Debit Phase:** Remitter Bank verifies the MPIN and balance. It debits user A\'s account by 1,000 INR and sends a signed `Debit Success` acknowledgment to NPCI.\n5. **Credit Phase:** NPCI sends a credit instruction to Beneficiary Bank (HDFC). HDFC credits user B\'s account by 1,000 INR and responds with `Credit Success`.\n6. **Dual Confirmation:** NPCI marks the transaction `COMPLETED`, records the inter-bank settlement obligation, and broadcasts success notifications down to both Remitter and Beneficiary PSPs, which notify the mobile apps via WebSockets/push.'
      },
      {
        id: 'hld-v9-q4',
        questionNumber: 4,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q4: Handling Beneficiary Bank Downtime & Reversals',
        question: 'During a UPI transaction, user A\'s account is debited, but user B\'s bank crashes before acknowledging the credit. How does the distributed transaction resolve without money vanishing?',
        answer: '**Detailed Answer:**\n\nThis represents a distributed two-phase transaction partition:\n1. **Timeout Detection:** When NPCI sends the credit instruction to the Beneficiary Bank, it starts a strict timeout timer (e.g., 5–10 seconds). If the Beneficiary Bank times out or throws a 5xx error, the credit state is marked `UNKNOWN` or `FAILED`.\n2. **Automatic Reversal Instruction:** NPCI refuses to mark the transaction successful. Because user A was debited, NPCI emits a compensating reversal command to the Remitter Bank: *ReverseDebit(Amount)*.\n3. **De-escalation to Auto-Reconciliation:** If immediate reversal fails due to network partitions, the transaction enters an asynchronous clearing queue. At end-of-day reconciliation (or during automated batch settlement rounds), NPCI reconciles bank statement files. If the Beneficiary Bank confirms no credit took place, NPCI forces an automated refund (T+1 days mandate) back to User A\'s account, ensuring absolute mathematical balance across ledgers.'
      },
      {
        id: 'hld-v9-q5',
        questionNumber: 5,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q5: Push vs Pull Transactions in UPI',
        question: 'Differentiate between a Push transaction and a Pull transaction (Collect Request) in UPI architecture. What additional security controls govern Pull requests?',
        answer: '**Detailed Answer:**\n\n1. **Push Transaction (Payer Initiated):** The payer initiates the transfer (e.g., sending money to a friend or scanning a merchant QR). The payer proactively pushes funds to the receiver.\n\n2. **Pull Transaction (Payee Initiated / Collect Request):** The payee initiates a payment demand (e.g., a merchant or food delivery app requests 500 INR from `user@upi`).\n\n**Security Controls on Pull Requests:**\n* In a Pull transaction, the request arrives on the payer\'s app as a "Collect Request Notification".\n* Money CANNOT be automatically deducted. The payer must explicitly inspect the requester\'s verified merchant name, approve the request, and physically enter their UPI PIN on the secure NPCI library screen.\n* Spam Filters: NPCI and TPAPs enforce daily limits and spam heuristics to auto-block unknown VPAs from flooding users with fraudulent collect requests.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 10: WHAT ARE BLOOM FILTERS?
  // ===========================================================================
  {
    topic_order: 10,
    slug: 'hld-bloom-filters',
    title: 'What are Bloom Filters?',
    module_name: 'High Level Design',
    duration_minutes: 21,
    video_url: 'https://youtu.be/vz0QUa4CS3o',
    video_title: 'What are Bloom Filters? | System Design',
    short_description: 'Master probabilistic data structures, bit arrays, hash functions, and false-positive trade-offs for high-speed membership verification.',
    summary_markdown: `### 📌 1. The Membership Problem at Scale
* Systems like Twitter/X (username availability), Google Chrome (malicious URL checking), and database engines (LSM-tree disk seek prevention) must check if an item exists among hundreds of millions of records.
* **Standard Hash Maps:** $O(1)$ lookups, but memory consumption is $O(N)$—storing 100M string usernames in RAM consumes gigabytes of memory.
* **Database Queries:** Running \`SELECT WHERE username = '...' \` across disk-bound B-Trees causes excessive I/O bottlenecks.

### 💡 2. The Bloom Filter Solution
* A **Bloom Filter** is a space-efficient, probabilistic data structure designed to test whether an element is a member of a set.
* **Component Anatomy:** Consists of a **Bit Array of size $m$** initialized to all $0$s and **$k$ independent uniform hash functions**.
* **Insertion:** Pass the element through all $k$ hash functions to get $k$ array indices; set the bits at those positions to $1$.
* **Query:** Hash the search key through all $k$ hash functions. If **ANY** bit is $0$, the element is **definitely NOT in the set**. If **ALL** bits are $1$, the element is **PROBABLY in the set**.

### 💡 3. The Core Guarantee & Trade-offs
* **Zero False Negatives:** If a Bloom Filter says "Not Present", it is 100% guaranteed to be absent.
* **Possible False Positives:** Due to overlapping bit collisions from other elements, it may claim an item is present when it isn't.
* **No Deletion:** Standard Bloom Filters do not support deleting elements because resetting a bit to $0$ might accidentally delete bits shared by other elements.`,
    practice_items: [
      {
        id: 'hld-v10-q1',
        questionNumber: 1,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q1: The Fundamental Trade-off of Bloom Filters',
        question: 'Why are Bloom Filters described as "Probabilistic" data structures? What is the core mathematical guarantee regarding False Negatives vs False Positives?',
        answer: '**Detailed Answer:**\n\nBloom Filters are probabilistic because they trade deterministic accuracy for extreme memory compression.\n\n**The Core Guarantee:**\n1. **False Negatives are IMPOSSIBLE (0%):** If the Bloom Filter reports that an element does not exist, it is **100% mathematically certain that the element is NOT in the set**. If it had been inserted, all $k$ corresponding hash bits would have been toggled to 1.\n2. **False Positives are POSSIBLE (>0%):** If the filter reports that an element exists, it means the element is **probably in the set**. Because other previously inserted elements may have independently set those same bit coordinates to 1, the filter can report a collision match for an item that was never inserted.\n\n*Summary:* "Definitely No, or Maybe Yes."'
      },
      {
        id: 'hld-v10-q2',
        questionNumber: 2,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q2: Username Availability Architecture with Bloom Filters',
        question: 'Design a high-throughput username registration system for a social network with 100M users using a Bloom Filter to protect the primary PostgreSQL database from query exhaustion.',
        answer: '**Detailed Answer:**\n\n**The Problem:** Users typing in sign-up forms fire hundreds of queries checking if variations (`john`, `john1`, `john_doe`) are taken. Querying PostgreSQL directly creates disk I/O bottlenecks.\n\n**The Architecture:**\n1. Maintain an in-memory Bloom Filter in Redis or application memory representing all registered usernames.\n2. When a user checks `desired_username`, pass it to the Bloom Filter first:\n   * **Case A: Bloom Filter returns FALSE:** Because there are zero false negatives, the username is **guaranteed available**. The system immediately returns "Available" with zero database queries.\n   * **Case B: Bloom Filter returns TRUE:** The username is *probably taken*. Only in this minority case does the server query PostgreSQL (`SELECT 1 FROM users WHERE username = ...`) to confirm whether it is genuinely taken or a rare false positive.\n3. **Result:** >95% of unavailable searches and available queries are resolved in nanoseconds from RAM, offloading 90%+ of read traffic from the primary database.'
      },
      {
        id: 'hld-v10-q3',
        questionNumber: 3,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q3: Why Standard Bloom Filters Cannot Support Deletions',
        question: 'Why is it impossible to delete an item from a standard Bloom Filter? How does a Counting Bloom Filter solve this limitation?',
        answer: '**Detailed Answer:**\n\n**Why Deletions Fail in Standard Filters:**\nIn a standard Bloom filter, inserting an element sets $k$ bits to `1`. If you attempt to delete an element by setting its $k$ bits back to `0`, you will inadvertently destroy the bits belonging to *other* previously inserted elements that happen to share those same bit positions. This would introduce False Negatives, violating the data structure\'s fundamental invariant.\n\n**The Solution: Counting Bloom Filter**\nInstead of a single-bit array of 0s and 1s, an array of small integer counters (e.g., 4-bit integers) is used.\n* **Insertion:** Increment the counter at each of the $k$ hashed positions by 1.\n* **Deletion:** Decrement the counter at each of the $k$ hashed positions by 1.\nAs long as counters do not overflow, elements can be safely deleted without corrupting shared entries, at the cost of 3–4× more memory consumption.'
      },
      {
        id: 'hld-v10-q4',
        questionNumber: 4,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Very Hard',
        title: 'Q4: Bloom Filters in Storage Engines (LSM-Trees in Cassandra / RocksDB)',
        question: 'How do database engines like Apache Cassandra, Google Bigtable, and RocksDB utilize Bloom Filters to prevent expensive disk seeks on SSTables?',
        answer: '**Detailed Answer:**\n\nIn Log-Structured Merge (LSM) tree databases like Cassandra, data is initially written to an in-memory Memtable and periodically flushed to immutable on-disk files called **SSTables (Sorted String Tables)**. Over time, dozens of SSTables accumulate on disk for a single partition.\n\n**The Bottleneck:** To read a key that doesn\'t exist, or to find a key written days ago, the database would have to perform physical disk seeks across every single SSTable file on disk.\n\n**The Bloom Filter Optimization:**\nEvery SSTable on disk has a small corresponding Bloom Filter held in RAM.\nBefore reading an SSTable from disk, the engine checks its in-memory Bloom filter:\n* If the filter returns `0`, the key is guaranteed not in that SSTable. The engine skips the file completely without touching the disk.\n* Only if the filter returns `1` does the engine execute a disk I/O seek.\nThis eliminates over 90% of redundant disk read operations, keeping point-lookup read latency predictable.'
      },
      {
        id: 'hld-v10-q5',
        questionNumber: 5,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q5: Tuning Parameters: Array Size (m) vs Hash Functions (k)',
        question: 'What is the relationship between the bit array size (m), the number of hash functions (k), the number of inserted elements (n), and the False Positive probability (p)?',
        answer: '**Detailed Answer:**\n\nThe False Positive probability $p$ is governed by the saturation of the bit array:\n\n$$p \\approx \\left(1 - e^{-kn/m}\\right)^k$$\n\n1. **Array Size ($m$):** Increasing the bit array size $m$ spreads bits across more coordinates, reducing bit collisions and lowering the false positive rate.\n2. **Number of Elements ($n$):** As more elements are inserted, the ratio of 1s in the array increases. If $n$ grows too large, the array fills with 1s, and the false positive rate approaches 100%.\n3. **Optimal Number of Hashes ($k$):** For a given array size $m$ and item count $n$, the optimal number of hash functions that minimizes false positives is mathematically given by:\n$$k = \\frac{m}{n} \\ln(2) \\approx 0.7 \\times \\frac{m}{n}$$\nIf $k$ is too low, differentiation is poor; if $k$ is too high, each insertion sets too many bits, rapidly saturating the array.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 11: MULTI-CONFERENCE VIDEO CALLS (WebRTC vs SFU vs MCU)
  // ===========================================================================
  {
    topic_order: 11,
    slug: 'hld-video-conferencing-webrtc-sfu-mcu',
    title: 'Multi-Conference Video Calls (WebRTC vs SFU vs MCU)',
    module_name: 'High Level Design',
    duration_minutes: 24,
    video_url: 'https://youtu.be/Zaz6hYVm-WE',
    video_title: 'System Design Behind Multi-Conference Video Calls - WebRTC vs SFU vs MCU',
    short_description: 'Architecture of group video calling applications: WebRTC peer-to-peer limits, Mesh bottlenecks, MCU mixing overhead, and SFU selective routing.',
    summary_markdown: `### 📌 1. Peer-to-Peer WebRTC (1:1 Calls)
* **WebRTC:** Enables browser-to-browser real-time audio/video transmission over UDP without an intermediate media server.
* **Limitation:** Ideal and practically free for 1-on-1 calls, but breaks down when three or more participants join.

### 💡 2. Mesh Peer-to-Peer Architecture
* Every participant opens direct P2P connections to every other participant.
* **The Fatal Flaw:** For $N$ peers, each client must upload $N-1$ video streams and download $N-1$ video streams ($O(N)$ uplink bandwidth). At 5–6 participants, consumer residential upload bandwidth collapses and devices overheat.

### 💡 3. Centralized Media Architectures: MCU vs. SFU
* **MCU (Multipoint Control Unit):**
  * Clients send 1 stream to the server. The server decodes, mixes all audio/video into a single composite mosaic grid video stream, encodes it, and sends 1 stream back to each user.
  * *Pros:* Client needs minimal download bandwidth.
  * *Cons:* Massive server CPU cost, high latency lag, and client cannot independently pin, resize, or mute individual speakers.
* **SFU (Selective Forwarding Unit - e.g., Zoom, Google Meet, Mediasoup):**
  * Clients send 1 uplink stream to the server.
  * The server **does NOT decode or composite** media; it acts as a lightweight router/switch, forwarding individual streams to other participants.
  * *Pros:* Extremely low server CPU, low latency, and full client layout flexibility. This is the industry standard for scalable video conferencing.`,
    practice_items: [
      {
        id: 'hld-v11-q1',
        questionNumber: 1,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q1: Why Mesh WebRTC Fails for Group Video Calls',
        question: 'Why does a pure Peer-to-Peer Mesh WebRTC architecture fail to scale beyond 4 to 5 participants in a group video call? Analyze the bandwidth equation.',
        answer: '**Detailed Answer:**\n\nIn a full Mesh WebRTC architecture, there is no central media server. Every participant must establish an independent P2P connection to every other participant.\n\n**The Bandwidth Equation:**\nFor $N$ participants in a call:\n* Each client must maintain $N - 1$ uplink (upload) video streams.\n* Each client must maintain $N - 1$ downlink (download) video streams.\n* Total peer connections in the room $= \\frac{N(N - 1)}{2}$.\n\n**The Failure:**\nMost residential and mobile connections have asymmetric bandwidth (high download, low upload—often capped at 2–5 Mbps upload). If each HD stream requires 1.5 Mbps, a call with 6 participants requires each client to upload $5 \\times 1.5 = 7.5\\text{ Mbps}$ simultaneously. Client uplink bandwidth saturates, hardware encoders overload, and frame rates drop to zero.'
      },
      {
        id: 'hld-v11-q2',
        questionNumber: 2,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q2: MCU (Multipoint Control Unit) Architecture & Bottlenecks',
        question: 'How does an MCU (Multipoint Control Unit) solve the client upload bandwidth problem, and what massive server-side bottlenecks does it introduce?',
        answer: '**Detailed Answer:**\n\n**How MCU Solves Bandwidth:**\nEvery participant uploads exactly ONE stream to the central MCU server. The MCU decodes all incoming video streams, mixes/composites them into a single video frame (a 2x2 or 3x3 video grid), mixes the audio tracks into a single stereo channel, re-encodes the composite video, and transmits a single video stream back to each participant. Client upload and download bandwidth is capped at $O(1)$.\n\n**Server-Side Bottlenecks:**\n1. **Severe CPU/GPU Load:** Real-time decoding and re-encoding of high-definition video is one of the most computationally expensive tasks in computing. An MCU server can only support a small number of concurrent rooms before maxing out CPU cores.\n2. **High Latency:** Decoding, resizing, compositing, and re-encoding introduces 100–300ms of processing delay, destroying real-time conversational interactivity.\n3. **Loss of Client Flexibility:** Because the server hard-codes the grid layout into the pixels, individual clients cannot locally resize a speaker\'s window, pin a screen share, or mute one annoying participant locally.'
      },
      {
        id: 'hld-v11-q3',
        questionNumber: 3,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q3: SFU (Selective Forwarding Unit) Mechanism',
        question: 'Explain why the Selective Forwarding Unit (SFU) architecture has become the undisputed industry standard for platforms like Zoom and Google Meet.',
        answer: '**Detailed Answer:**\n\nAn SFU strikes the optimal architectural balance between client bandwidth and server compute:\n\n1. **Single Uplink:** Each participant encodes and transmits exactly **ONE** audio/video stream to the SFU server ($O(1)$ client upload).\n2. **Zero Transcoding on Server:** The SFU server does NOT decode, render, or re-encode video packets. It acts as an intelligent, high-speed router. It inspects RTP packet headers and forwards individual video streams to the other participants ($N-1$ downlink streams).\n3. **Negligible Server CPU:** Because it routes raw network packets without decoding video pixels, an SFU server can handle thousands of concurrent video streams on modest CPU hardware.\n4. **Client-Side Rendering Independence:** Because each client receives discrete video streams for each participant, the client app can freely decide how to render them—pinning a speaker in full-screen, showing active speakers in high-res, muting individuals, or rendering thumbnails in low-res.'
      },
      {
        id: 'hld-v11-q4',
        questionNumber: 4,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Very Hard',
        title: 'Q4: Simulcast and Scalable Video Coding (SVC) in SFUs',
        question: 'In an SFU architecture with 20 participants, sending high-definition video of all 20 participants to every client will overload client downlink bandwidth. How does Simulcast resolve this?',
        answer: '**Detailed Answer:**\n\n**The Problem:** While client upload is fixed at 1 stream, downloading 19 separate 1080p video streams requires ~30 Mbps download bandwidth and heavy client CPU decoding power.\n\n**The Solution: Simulcast**\n1. Instead of publishing one 1080p stream, the publishing client simultaneously encodes and uploads **three distinct quality layers** of its own camera stream to the SFU: Low (180p @ 100kbps), Medium (360p @ 350kbps), and High (720p @ 1.5Mbps).\n2. **Selective Forwarding Intelligence:**\n   * The SFU forwards the **High** layer of the *Active Speaker* to all participants (since they occupy the large display area).\n   * For all other participants rendered as tiny grid thumbnails, the SFU forwards only their **Low** or **Medium** streams.\n   * If a client is on a poor mobile connection, the SFU drops them down to receiving lower layers across the board.\nSimulcast keeps total client downlink bandwidth under 2–3 Mbps regardless of how many people join the conference room.'
      },
      {
        id: 'hld-v11-q5',
        questionNumber: 5,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q5: Signaling vs Media Planes in WebRTC',
        question: 'What is the distinction between the "Signaling Plane" and the "Media Plane" in a video conferencing system? Why does WebRTC not define a signaling protocol?',
        answer: '**Detailed Answer:**\n\n1. **The Signaling Plane:**\n   * The control coordination channel used before media can flow.\n   * Used to exchange session descriptions (SDP: codecs, encryption keys) and network candidates (ICE candidates: public IP/port mappings discovered via STUN/TURN servers).\n   * Operates over standard TCP/WebSocket connections via standard web servers.\n\n2. **The Media Plane:**\n   * The actual real-time pipeline carrying encrypted audio/video payloads (SRTP/SRTCP) directly between peers or to an SFU.\n   * Operates over low-latency **UDP** to prioritize speed over guaranteed packet delivery.\n\n**Why WebRTC Doesn\'t Define Signaling:**\nWebRTC deliberately omitted a standardized signaling protocol to give developers complete architectural freedom. Applications can use WebSockets, SIP, MQTT, or HTTP polling depending on their existing infrastructure, while WebRTC strictly focuses on high-performance media transmission.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 12: GOSSIP PROTOCOL SYSTEM DESIGN
  // ===========================================================================
  {
    topic_order: 12,
    slug: 'hld-gossip-protocol',
    title: 'Gossip Protocol System Design',
    module_name: 'High Level Design',
    duration_minutes: 35,
    video_url: 'https://youtu.be/TUc_hPtxyf8',
    video_title: 'Gossip Protocol System Design',
    short_description: 'Decentralized peer-to-peer cluster state management, node liveness detection, and epidemic information dissemination across distributed clusters.',
    summary_markdown: `### 📌 1. Centralized State vs. Decentralized P2P
* **Centralized Coordination (e.g., ZooKeeper / Master Node):** A single master node monitors heartbeats and maintains cluster membership.
  * *Trade-off:* Strong consistency, but introduces a Single Point of Failure (SPOF) and a throughput bottleneck as cluster size grows to thousands of nodes.
* **Point-to-Point & Eager Broadcast:** Nodes broadcasting to all $N$ peers creates $O(N^2)$ network packet floods, saturating network interfaces.

### 💡 2. The Gossip (Epidemic) Protocol
* Inspired by the spread of rumors or biological epidemics in human populations.
* **Algorithm:** Every $T$ milliseconds, each node randomly selects a small subset of $k$ neighbor nodes (the "fan-out", e.g., $k=3$) and transmits its internal state and heartbeat vector.
* **Exponential Information Spread:** In just $O(\\log N)$ rounds, a state update or node failure announcement spreads to **100% of all nodes in the cluster with overwhelming mathematical probability**.

### 💡 3. Failure Detection & Real-World Systems
* **Heartbeat Counters:** Each node increments an internal monotonic sequence counter. If node A notices node B's counter hasn't incremented for a threshold duration, B is marked as suspect, and then declared dead.
* **Used by:** Apache Cassandra (cluster membership & schema sync), Amazon DynamoDB, Redis Cluster, and HashiCorp Consul/Serf.`,
    practice_items: [
      {
        id: 'hld-v12-q1',
        questionNumber: 1,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q1: Failure of Centralized Cluster Coordination at Scale',
        question: 'Why does a centralized master-worker heartbeat architecture (e.g., single leader tracking node health) become an architectural bottleneck in clusters containing 10,000+ nodes?',
        answer: '**Detailed Answer:**\n\nIn a centralized heartbeat architecture, all $N$ worker nodes must periodically send a ping/heartbeat packet to a central master node.\n\n1. **Network Ingress Saturation:** At 10,000 nodes pinging every second, the master node must process 10,000 inbound network packets and context switches per second solely for health checks.\n2. **Single Point of Failure (SPOF):** If the master node crashes, the entire cluster loses membership awareness, partition detection, and discovery capabilities.\n3. **Network Partition Vulnerability:** If a network blip isolates the master node from a healthy sub-rack of 2,000 nodes, the master may erroneously declare all 2,000 nodes dead, triggering destructive, unnecessary rebalancing storms.'
      },
      {
        id: 'hld-v12-q2',
        questionNumber: 2,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q3: Mechanism and Propagation Speed of Gossip Protocol',
        question: 'Explain the algorithmic mechanics of the Gossip Protocol. Mathematically, why does information spread across a cluster of N nodes in O(log N) rounds?',
        answer: '**Detailed Answer:**\n\n**Mechanics:**\n1. Each node maintains a local membership list containing IP addresses, heartbeat generation counters, and timestamps for all known peers.\n2. Periodically (e.g., every 1 second), each node randomly selects $k$ peers (fan-out factor, typically 3).\n3. The node transmits its state/delta to those $k$ chosen peers via lightweight UDP packets.\n4. The receiving peers merge the updates with their local tables by selecting the highest observed generation counters, and randomly gossip to $k$ other peers on their next tick.\n\n**Mathematical Propagation ($O(\\log N)$):**\nThis behaves like an epidemic or tree branch. At round 0, 1 node knows. At round 1, $1 + k$ nodes know. At round $r$, roughly $(k+1)^r$ nodes are infected. This exponential branching guarantees that even in a massive cluster of 100,000 nodes with a fan-out of $k=3$, the entire cluster reaches consensus in approximately $\\log_3(100,000) \\approx 11$ communication rounds.'
      },
      {
        id: 'hld-v12-q3',
        questionNumber: 3,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q3: Decentralized Failure Detection via Generation Counters',
        question: 'How does a decentralized Gossip cluster determine that a specific node has crashed without a master node declaring the failure?',
        answer: '**Detailed Answer:**\n\n1. **Monotonic Heartbeat Counters:** Every node maintains an internal integer counter called its `heartbeat_version`. On every local timer tick, node X increments its own counter: `X: {version: 104, timestamp: T}`.\n2. **Gossip Exchange:** Node X gossips this counter to its random neighbors. Neighbors update their table: "Node X is at version 104".\n3. **Suspect Threshold:** If node Y observes that Node X\'s `heartbeat_version` has not advanced for a predefined duration (e.g., 10 seconds / $T_{\\text{fail}}$), node Y does not immediately kill node X (which could be a temporary GC pause). Instead, node Y marks node X as `SUSPECT`.\n4. **Gossip of Suspicion:** Node Y gossips: "Node X is SUSPECT". If no node in the cluster receives a refreshed heartbeat from Node X within a confirmation window, consensus converges and node X is declared `DEAD`, prompting the cluster to evict it and rebalance partitions.'
      },
      {
        id: 'hld-v12-q4',
        questionNumber: 4,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Very Hard',
        title: 'Q4: Anti-Entropy vs Rumor-Mongering (Dissemination) Protocols',
        question: 'Compare "Rumor-Mongering" (Dissemination) and "Anti-Entropy" styles of Gossip protocols. How do they complement each other in Cassandra or Consul?',
        answer: '**Detailed Answer:**\n\n1. **Rumor-Mongering (Dissemination / Best-Effort):**\n   * When a state change occurs (e.g., node boots or parameter updates), it is treated as a "hot rumor".\n   * It is eagerly gossiped to random peers for a fixed number of rounds until it is considered "stale".\n   * *Pros:* Extremely fast, minimal bandwidth.\n   * *Cons:* Network packet drops over UDP can leave a small percentage of nodes unaware of the update.\n\n2. **Anti-Entropy (Full Reconciliation):**\n   * A background sync process running at longer intervals (e.g., minutes).\n   * Two randomly chosen nodes compare their entire state tables (often using Merkle Trees to minimize data exchange) and exchange missing deltas to guarantee absolute convergence.\n\n**Complementary Usage:** Systems use Rumor-Mongering for near-instantaneous broadcast of events and heartbeats, while Anti-Entropy runs continuously in the background as a safety net to repair any dropped gossip messages, guaranteeing eventual consistency.'
      },
      {
        id: 'hld-v12-q5',
        questionNumber: 5,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q5: Trade-offs of Gossip Protocol: Eventual Consistency vs Strong Consistency',
        question: 'Why is Gossip Protocol categorized under AP (Availability & Partition Tolerance) systems in the CAP theorem? In what scenarios is Gossip an inappropriate choice?',
        answer: '**Detailed Answer:**\n\n**AP Classification:**\nUnder the CAP theorem, Gossip prioritizes High Availability and Partition Tolerance over Strong Consistency. Because state spreads asynchronously in $O(\\log N)$ time, nodes hold slightly different views of cluster state during propagation. There is no single atomic linearizable truth; the system operates under **Eventual Consistency**.\n\n**Inappropriate Scenarios:**\n1. **Distributed Locks & Leader Election:** Mutual exclusion requires strict atomic agreement (e.g., Raft or Paxos). If two nodes believe they both hold a lock due to gossip convergence lag, split-brain corruption occurs.\n2. **Financial Balances & Inventory Allocation:** Deducting bank balances or allocating the final seat on a flight requires immediate linearizable ACID transactions. Gossip is designed for metadata, membership, and eventual consistency replication, never for real-time transactional locking.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 13: MASTER QUEUES (Push vs Pull, Worker Ordering)
  // ===========================================================================
  {
    topic_order: 13,
    slug: 'hld-message-queues-architecture',
    title: 'Master Queues',
    module_name: 'High Level Design',
    duration_minutes: 31,
    video_url: 'https://youtu.be/2tCfITBVKjA',
    video_title: 'Master Queues | System Design Interview',
    short_description: 'Deep dive into asynchronous messaging: Push vs Pull delivery models, consumer deduplication, exponential backoff, and preserving FIFO ordering under parallel workers.',
    summary_markdown: `### 📌 1. Synchronous Bottlenecks & Asynchronous Queues
* **Synchronous Bottleneck:** In a user registration flow, creating a DB record and immediately calling an external email service (e.g., SES/SendGrid) ties up HTTP worker threads. If the email API slows down or rate limits, signups freeze.
* **The Asynchronous Queue:** The API inserts the user into the DB, immediately enqueues a \`SendWelcomeEmail\` job onto a Message Queue, and returns HTTP 201. A decoupled background worker processes the job asynchronously.

### 💡 2. Queue Models: Push vs. Pull
* **Push-Based (e.g., RabbitMQ):**
  * The central message broker actively pushes messages out to connected worker sockets.
  * *Pros:* Low latency, built-in broker-side message deduplication.
  * *Cons:* Fast incoming spikes can overwhelm slow consumers unless strict consumer pre-fetch limits (\`qos\`) are configured.
* **Pull-Based (e.g., AWS SQS, BullMQ, Kafka):**
  * Workers actively poll the queue at their own pace via long-polling.
  * *Pros:* Consumer controls processing rate naturally—ideal for batching and respecting third-party rate limits.
  * *Cons:* Requires managing consumer polling intervals, exponential backoff for empty queues, and client-side deduplication.

### 💡 3. The FIFO Fallacy Under Concurrency
* **Misconception:** Standard queues guarantee First-In-First-Out processing.
* **The Reality:** While the queue *dispatches* in order, having multiple concurrent workers processing tasks destroys execution order because worker processing times vary.
* **Solution (Kafka):** Partitioning by entity ID (e.g., \`user_id\`) ensures all sequential events for that entity land on the same partition, consumed by exactly one worker thread.`,
    practice_items: [
      {
        id: 'hld-v13-q1',
        questionNumber: 1,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q1: Push-Based vs Pull-Based Queue Models',
        question: 'Contrast Push-based message queues (e.g., RabbitMQ) with Pull-based message queues (e.g., AWS SQS). Which model is superior when consumers have highly variable processing times?',
        answer: '**Detailed Answer:**\n\n1. **Push-Based (e.g., RabbitMQ):**\n   * The broker maintains active TCP socket connections to workers and pushes messages as soon as they arrive.\n   * *Advantage:* Minimal message delivery latency.\n   * *Risk:* If a task takes 30 seconds to process and the broker pushes 20 tasks to that worker, the worker\'s RAM/CPU is overwhelmed unless backpressure/prefetch limits are strictly tuned.\n\n2. **Pull-Based (e.g., AWS SQS, Kafka):**\n   * Workers initiate requests (`ReceiveMessage`) only when they have free capacity to do work.\n\n**Superior Model for Variable Tasks:**\n**Pull-based queues are strictly superior** for workloads with unpredictable execution times (e.g., video transcoding, PDF generation, AI inference). Slow workers pull only when ready, while fast workers pull continuously, achieving natural, dynamic load balancing without risk of consumer buffer overflow.'
      },
      {
        id: 'hld-v13-q2',
        questionNumber: 2,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q2: The FIFO Fallacy Under Parallel Workers',
        question: 'A developer assumes using a FIFO queue guarantees that events for an order (CREATED -> PAID -> SHIPPED) will execute in order. Why does this assumption completely fail when multiple worker instances consume from the queue?',
        answer: '**Detailed Answer:**\n\nEven if a message broker dispatches messages in strict chronological FIFO order, having multiple concurrent workers destroys sequential execution:\n\n**The Race Condition Scenario:**\n1. The queue dispatches Event 1 (`CREATED`) to Worker A at timestamp 0ms.\n2. The queue immediately dispatches Event 2 (`PAID`) to Worker B at timestamp 1ms.\n3. Worker A experiences an unexpected CPU spike, garbage collection pause, or network hiccup while connecting to the database.\n4. Worker B completes in 5ms and writes `PAID` to the database.\n5. Worker A finally finishes at 50ms and writes `CREATED`, overwriting the database status back to `CREATED`.\n\n*The Architectural Law:* **FIFO dispatch does NOT equal FIFO execution.** Concurrency at the worker tier inherently reorders operations unless partitioning locks are enforced.'
      },
      {
        id: 'hld-v13-q3',
        questionNumber: 3,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q3: Solving Order Reordering via Partitioning (Kafka)',
        question: 'How does Apache Kafka guarantee both strict sequential processing for a specific user AND high horizontal scalability across 50 consumer worker threads?',
        answer: '**Detailed Answer:**\n\nKafka resolves this via **Topic Partitions and Consumer Groups**:\n\n1. **Message Keying:** When an event is produced, the producer assigns `user_id` (or `order_id`) as the Message Key.\n2. **Consistent Partition Hashing:** Kafka hashes the key (`hash(user_id) % num_partitions`), guaranteeing that all events for that specific user land in the exact same Partition.\n3. **Single Consumer Rule:** Within a Consumer Group, Kafka enforces a strict invariant: **a single partition is assigned to exactly ONE consumer worker thread**.\n4. **Scalability:** Events for User 123 go to Partition 1 (consumed sequentially by Thread A). Events for User 456 go to Partition 2 (consumed sequentially by Thread B).\nThis delivers strict chronological ordering on an entity level while scaling horizontally across dozens of parallel worker threads across distinct partitions.'
      },
      {
        id: 'hld-v13-q4',
        questionNumber: 4,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q4: Preventing Consumer Starvation and API Waste (Exponential Backoff)',
        question: 'In a Pull-based queue system like AWS SQS, continuously polling an empty queue burns financial costs and CPU cycles. How do Long Polling and Exponential Backoff resolve this?',
        answer: '**Detailed Answer:**\n\n1. **Short Polling Flaw:** In short polling, a worker queries SQS every 100ms. If the queue is empty, SQS returns empty HTTP 200 responses. At millions of polls per day, this burns CPU and racks up massive AWS API request charges.\n\n2. **Long Polling (`WaitTimeSeconds = 20`):** Instead of returning immediately when empty, SQS holds the worker\'s HTTP connection open for up to 20 seconds. If a message arrives during that window, it is dispatched immediately. This reduces empty responses by >90%.\n\n3. **Exponential Backoff:** If successive long polls continue returning empty results, the worker dynamically increases its sleep duration (e.g., wait 1s, then 2s, 4s, up to 60s max). The moment a message is retrieved, the backoff timer resets to zero, ensuring instant responsiveness when traffic returns.'
      },
      {
        id: 'hld-v13-q5',
        questionNumber: 5,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Very Hard',
        title: 'Q5: At-Least-Once Delivery and Consumer Idempotency',
        question: 'Distributed message queues universally provide "At-Least-Once" delivery rather than "Exactly-Once". Explain why duplicate messages occur and how to design an Idempotent Consumer.',
        answer: '**Detailed Answer:**\n\n**Why Duplicates Occur:**\nA worker pulls a message, processes the business logic (e.g., charges a credit card $50), and sends an `ACK` (acknowledgment) back to the queue. If a network partition drops the `ACK` packet, the queue\'s visibility timeout expires. The queue assumes the worker crashed and re-delivers the exact same message to another worker, causing a duplicate execution.\n\n**Designing an Idempotent Consumer:**\nConsumers must be designed so executing the same message multiple times produces the exact same outcome without secondary side effects:\n1. **Unique Message Deduplication ID:** Every message includes a unique `idempotency_key` (e.g., UUID generated at event origin).\n2. **Atomic Lock / Unique Constraint:** Before processing, the worker attempts to insert the key into an ACID database table (`INSERT INTO processed_events (id) VALUES (...)`).\n3. **Deduplication Check:** If the database throws a unique constraint violation error, the worker recognizes it as a duplicate, skips the payment logic, and immediately sends an `ACK` to discard the duplicate message safely.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 14: CORE SYSTEM DESIGN PATTERNS
  // ===========================================================================
  {
    topic_order: 14,
    slug: 'hld-core-system-design-patterns',
    title: 'Core System Design Patterns',
    module_name: 'High Level Design',
    duration_minutes: 20,
    video_url: 'https://youtu.be/OdNpY3WQniQ',
    video_title: 'System Design Patterns you should Master Right Now',
    short_description: 'Architectural patterns: Microservices vs Monoliths, Database-per-Service trade-offs, Circuit Breaker resilience, Event Sourcing, and CQRS.',
    summary_markdown: `### 📌 1. Monolith vs. Microservices
* **Monolith:** Single unified codebase and deployment pipeline. Simple to develop, debug, and query, but scaling requires replicating the entire application, and a single uncaught exception can bring down the entire system.
* **Microservices:** Decoupled independent domain services communicating over network APIs. Enables polyglot tech stacks, independent scaling, and failure isolation, at the cost of distributed networking complexity.

### 💡 2. Database-per-Service Pattern
* Each microservice strictly owns its own dedicated database.
* **The Benefit:** True domain isolation; no foreign service can corrupt another service's tables.
* **The Trade-off:** Cross-service SQL \`JOIN\`s are strictly impossible. Data must be joined at the application level, or aggregated via event-driven materialized views.

### 💡 3. The Circuit Breaker Pattern
* Prevents **Cascading Failures** across distributed microservices.
* **States:**
  * **CLOSED:** Normal state. Calls flow through to the downstream service.
  * **OPEN:** If error thresholds are exceeded (e.g., 50% failure rate over 10 seconds), the circuit trips open. Calls fail fast immediately without hitting the broken downstream service, allowing it breathing room to recover.
  * **HALF-OPEN:** After a timeout, trial requests are allowed through. If they succeed, the circuit resets to CLOSED; if they fail, it re-opens.`,
    practice_items: [
      {
        id: 'hld-v14-q1',
        questionNumber: 1,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Moderate',
        title: 'Q1: Monolith vs Microservices Blast Radius',
        question: 'Compare the "Blast Radius" of an unhandled runtime exception or memory leak in a Monolithic architecture versus a Microservices architecture.',
        answer: '**Detailed Answer:**\n\n**Monolithic Blast Radius (100% System Failure):**\nIn a monolith, all business domains (Authentication, Orders, Payments, Notifications, PDF Export) share a single runtime process, memory heap, and thread pool.\nIf a memory leak occurs in a low-priority background feature like "PDF Export", the memory exhaustion crashes the entire Node.js/Java process. As a result, critical core features like "User Login" and "Checkout" are dragged down completely.\n\n**Microservices Blast Radius (Fault Isolation):**\nEach domain runs in an independent container with dedicated CPU/RAM allocations.\nIf the "PDF Export Service" crashes or runs out of memory, its container restarts in isolation. The "Payment Service" and "Auth Service" continue serving users with zero downtime, bounding the blast radius strictly to the offending feature.'
      },
      {
        id: 'hld-v14-q2',
        questionNumber: 2,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q2: The Problem with Shared Databases in Microservices',
        question: 'Why is sharing a single relational database across multiple microservices considered an architectural anti-pattern? How does "Database-per-Service" solve this?',
        answer: '**Detailed Answer:**\n\n**The Anti-Pattern (Shared Database):**\nWhen multiple microservices share one database, the decoupling is an illusion:\n1. **Hidden Coupling:** Service A modifying a table schema breaks Service B without warning.\n2. **Lock Contention:** Heavy batch updates from an analytics service lock tables needed by low-latency customer checkout services.\n3. **Security Vulnerability:** A bug in an auxiliary service can accidentally wipe or leak sensitive user password records.\n\n**The Solution (Database-per-Service):**\nEach microservice strictly possesses private data storage. No other service can connect directly to that database; access is strictly gated behind published REST/gRPC APIs.\nThis enables polyglot persistence (e.g., Auth uses MongoDB, Payments uses PostgreSQL, Analytics uses ClickHouse) and ensures complete data schema autonomy.'
      },
      {
        id: 'hld-v14-q3',
        questionNumber: 3,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q3: Solving Distributed Joins in Database-per-Service',
        question: 'In a Database-per-Service architecture, an order management UI needs to display Order details alongside User profile data and Payment status. Because cross-database SQL JOINs are impossible, how do you architect this read operation?',
        answer: '**Detailed Answer:**\n\nTwo primary architectural patterns resolve this:\n\n1. **API Composition (Application-Level Join):**\n   * An API Gateway or aggregator service issues concurrent requests to `GET /orders/123`, `GET /users/456`, and `GET /payments/789`.\n   * The aggregator combines the three JSON payloads in memory and returns a composite object to the client.\n   * *Best for:* Low-to-medium throughput queries with simple relationships.\n\n2. **CQRS with Materialized Views (Event-Driven Aggregation):**\n   * Whenever User or Payment updates occur, they publish domain events (`UserUpdated`, `PaymentCaptured`) to a Kafka event bus.\n   * An Order Read Model service consumes these events and updates a denormalized read database (e.g., Elasticsearch or MongoDB).\n   * Client queries read the pre-joined, materialized view in a single fast lookup with zero cross-service network calls.'
      },
      {
        id: 'hld-v14-q4',
        questionNumber: 4,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Hard',
        title: 'Q4: The Circuit Breaker Pattern States and Cascading Failure',
        question: 'Explain how the Circuit Breaker pattern prevents Cascading Failures in microservices. Detail the state transitions between CLOSED, OPEN, and HALF-OPEN.',
        answer: '**Detailed Answer:**\n\n**Cascading Failure Prevention:**\nIf Service C becomes sluggish and times out, Service B keeps calling it, blocking its own thread pool. In turn, Service A blocks waiting on Service B. Thread pool exhaustion cascades upstream until the entire application goes offline.\n\n**Circuit Breaker State Machine:**\n1. **CLOSED (Normal Operation):** All requests pass through to the downstream service. The circuit breaker tracks failure rates.\n2. **OPEN (Fail Fast):** If the failure rate exceeds a threshold (e.g., >50% errors over 10 seconds), the circuit trips to OPEN. For the next 30 seconds, **all incoming calls are failed immediately locally** (or served via fallback cache) without attempting to reach the downstream service. This prevents upstream thread starvation and gives the downstream service breathing room to recover.\n3. **HALF-OPEN (Trial Probe):** After the cooldown period, the circuit allows a small number of trial requests through. If they succeed, it assumes the downstream service has recovered and transitions back to **CLOSED**. If any trial request fails, it immediately resets to **OPEN**.'
      },
      {
        id: 'hld-v14-q5',
        questionNumber: 5,
        type: 'subjective',
        category: 'High Level Design',
        difficulty: 'Very Hard',
        title: 'Q5: Distributed Transactions: 2PC vs Saga Pattern',
        question: 'When a business transaction spans multiple microservices with separate databases, traditional ACID transactions fail. Compare Two-Phase Commit (2PC) with the Saga Pattern.',
        answer: '**Detailed Answer:**\n\n1. **Two-Phase Commit (2PC):**\n   * Relies on a centralized coordinator that executes in two phases: *Prepare* (all databases lock rows and vote commit readiness) and *Commit* (coordinator executes the commit).\n   * *Flaws:* Highly blocking. Database row locks are held across slow network hops. If the coordinator or any database network blips, locks remain held, causing severe latency and deadlock bottlenecks. It is fundamentally unscalable in cloud microservices.\n\n2. **Saga Pattern (Compensating Transactions):**\n   * The transaction is broken into a series of local transactions in each microservice.\n   * Each service updates its own database and emits an event triggering the next step (e.g., Order Created -> Payment Deducted -> Inventory Reserved).\n   * **Compensating Action on Failure:** If step 3 (Inventory) fails because stock is depleted, the Saga issues reverse compensating transactions backward (Refund Payment -> Cancel Order).\n   * *Advantage:* Highly scalable, completely non-blocking, and embraces eventual consistency without holding distributed database locks.'
      }
    ]
  }
];

async function runBatchRunner() {
  const client = await pool.connect();
  try {
    console.log('=== SEEDING SYSTEM DESIGN HLD BATCH 3 (TOPICS 7 TO 14) ===\n');
    await client.query('BEGIN');

    // 1. Locate track where slug = 'system-design'
    const trackRes = await client.query(`
      SELECT id, title, slug, total_topics 
      FROM tracks 
      WHERE slug = 'system-design' 
      LIMIT 1;
    `);

    if (trackRes.rows.length === 0) {
      throw new Error("Track with slug 'system-design' not found!");
    }

    const track = trackRes.rows[0];
    const trackId = track.id;
    console.log(`Found Track: ID ${trackId} | Title: "${track.title}" | Slug: "${track.slug}"`);

    const creatorName = 'Piyush Garg';
    const creatorChannelUrl = 'https://www.youtube.com/@piyushgarg195';

    // 2. Upsert Topics 7 to 14
    for (const item of hldBatch3) {
      console.log(`Processing Topic ${item.topic_order}: "${item.title}" (${item.slug})...`);

      const cleanVideoUrlMatch = item.video_url.match(/https?:\/\/[^\s\)\]]+/);
      const cleanVideoUrl = cleanVideoUrlMatch ? cleanVideoUrlMatch[0] : item.video_url;
      const practiceJson = JSON.stringify(item.practice_items);
      const docLinksJson = JSON.stringify([]);
      const videoLinksJson = JSON.stringify([{
        title: item.video_title,
        url: cleanVideoUrl,
        platform: 'YouTube'
      }]);

      let topicRes = await client.query(`SELECT id FROM topics WHERE slug = $1 LIMIT 1;`, [item.slug]);
      let topicId;

      if (topicRes.rows.length > 0) {
        topicId = topicRes.rows[0].id;
        console.log(`  - Updating existing topic ID: ${topicId}`);
        await client.query(`
          UPDATE topics SET
            title = $1,
            name = $1,
            topic_order = $2,
            short_description = $3,
            description = $3,
            summary_markdown = $4,
            theory_summary = $4,
            practice_items = $5::jsonb,
            practice_problems = $5::jsonb,
            doc_links = $6::jsonb,
            video_links = $7::jsonb,
            creator_name = $8,
            creator_channel_url = $9,
            track_id = $10,
            module_name = $11,
            subtrack = $11,
            estimated_minutes = $12,
            difficulty = 'Hard'
          WHERE id = $13;
        `, [
          item.title,
          item.topic_order,
          item.short_description,
          item.summary_markdown,
          practiceJson,
          docLinksJson,
          videoLinksJson,
          creatorName,
          creatorChannelUrl,
          trackId,
          item.module_name,
          item.duration_minutes,
          topicId
        ]);
      } else {
        console.log(`  - Inserting new topic...`);
        const insertRes = await client.query(`
          INSERT INTO topics (
            title, name, slug, topic_order, short_description, description,
            summary_markdown, theory_summary,
            practice_items, practice_problems, doc_links, video_links,
            creator_name, creator_channel_url, track_id, module_name, subtrack,
            estimated_minutes, difficulty
          ) VALUES (
            $1, $1, $2, $3, $4, $4,
            $5, $5,
            $6::jsonb, $6::jsonb, $7::jsonb, $8::jsonb,
            $9, $10, $11, $12, $12,
            $13, 'Hard'
          ) RETURNING id;
        `, [
          item.title,
          item.slug,
          item.topic_order,
          item.short_description,
          item.summary_markdown,
          practiceJson,
          docLinksJson,
          videoLinksJson,
          creatorName,
          creatorChannelUrl,
          trackId,
          item.module_name,
          item.duration_minutes
        ]);
        topicId = insertRes.rows[0].id;
        console.log(`  - Inserted topic ID: ${topicId}`);
      }

      // Link in track_topics
      await client.query(`
        DELETE FROM track_topics WHERE track_id = $1 AND topic_order = $2;
      `, [trackId, item.topic_order]);

      await client.query(`
        INSERT INTO track_topics (track_id, topic_id, topic_order)
        VALUES ($1, $2, $3)
        ON CONFLICT (track_id, topic_id) DO UPDATE SET topic_order = EXCLUDED.topic_order;
      `, [trackId, topicId, item.topic_order]);

      // Sync resources table for video
      await client.query(`
        DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('problem', 'practice', 'video', 'documentation');
      `, [topicId]);

      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'video', $4);
      `, [topicId, item.video_title, cleanVideoUrl, item.duration_minutes]);

      console.log(`  ✅ Successfully seeded Topic ${item.topic_order} with ${item.practice_items.length} subjective Q&As!\n`);
    }

    // 3. Update total_topics = 14 on system-design track
    await client.query(`
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS total_topics INTEGER DEFAULT 0;
    `);
    await client.query(`
      UPDATE tracks 
      SET total_topics = 14 
      WHERE id = $1;
    `, [trackId]);
    console.log(`Updated System Design track (ID ${trackId}) total_topics = 14`);

    await client.query('COMMIT');

    // 4. Verification Query: print summary table of all 14 topics under system-design track
    const summaryRes = await client.query(`
      SELECT 
        tt.topic_order,
        t.id AS topic_id,
        t.title,
        t.slug,
        t.module_name,
        jsonb_array_length(t.practice_items) AS q_count,
        t.creator_name,
        t.estimated_minutes
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = $1
      ORDER BY tt.topic_order ASC;
    `, [trackId]);

    const updatedTrackRes = await client.query(`
      SELECT id, title, slug, total_topics 
      FROM tracks 
      WHERE id = $1;
    `, [trackId]);

    console.log('\n=== SYSTEM DESIGN TRACK VERIFICATION ===');
    console.log('Track Info:', updatedTrackRes.rows[0]);
    console.log('\nAll Topics in Track:');
    console.table(summaryRes.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error in seed_batch_runner:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

runBatchRunner();
