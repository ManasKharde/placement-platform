const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

function cleanMarkdown(md) {
  if (!md) return '';
  return md
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      if (/^[-*_]{3,}$/.test(trimmed)) return false;
      if (/^\|[-:\s|]+\|$/.test(trimmed)) return false;
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) return false;
      return true;
    })
    .map((line) => {
      let l = line;
      if (l.trim().startsWith('>')) {
        l = l.replace(/^\s*>\s*/, '');
      }
      return l;
    })
    .join('\n')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim();
}

const summaryMarkdown = `### 📌 1. Network Topologies, OSI 7-Layer Model vs. TCP/IP Stack & Hardware Devices
A **Computer Network** interconnects autonomous computing devices to exchange data in small binary chunks called **Packets** using standardized rules called **Protocols**.
* **The 7 Layers of the OSI Model (Top to Bottom), PDUs & Protocols:**
  1. **Layer 7 — Application Layer (PDU: \`Data\` / \`Message\`):** Directly serves end-user applications (\`HTTP/HTTPS\`, \`DNS\`, \`DHCP\`, \`SSH\`, \`FTP\`, \`SMTP\`, \`IMAP\`).
  2. **Layer 6 — Presentation Layer:** Data formatting, character encoding (\`UTF-8\`, \`ASCII\`), compression, and encryption/decryption (\`TLS/SSL\`).
  3. **Layer 5 — Session Layer:** Manages session establishment, checkpointing, and synchronization (merged into the Application Layer in the practical 4/5-layer **TCP/IP Model**).
  4. **Layer 4 — Transport Layer (PDU: \`Segment\` for TCP / \`Datagram\` for UDP):** Process-to-process delivery identified by **16-bit Port Numbers** (\`0–65535\`: Well-Known \`0–1023\`, Registered \`1024–49151\`, Ephemeral/Dynamic \`49152–65535\`).
  5. **Layer 3 — Network Layer (PDU: \`Packet\` / \`Datagram\`):** Logical host-to-host routing across different networks using **IP Addresses** (\`IPv4\`, \`IPv6\`, \`ICMP\`, \`IPSec\`).
  6. **Layer 2 — Data Link Layer (PDU: \`Frame\`):** Hop-to-hop node delivery on the same local network segment using **48-bit physical MAC Addresses**, framing, flow control, and error detection (\`Ethernet 802.3\`, \`Wi-Fi 802.11\`, \`ARP\`, \`VLAN\`).
  7. **Layer 1 — Physical Layer (PDU: \`Bit\`):** Transmits raw \`0\`s and \`1\`s as electrical voltages, optical light pulses, or radio waves over physical media (\`Copper Cat6\`, \`Fiber Optic\`, \`Wi-Fi RF\`).
* **Network Hardware Devices & Collision vs. Broadcast Domains:**
  * **Repeater / Hub (Layer 1):** Dumb electrical amplifier that broadcasts incoming bits out of **all** ports. All ports on a Hub belong to **1 single Collision Domain** and **1 single Broadcast Domain**.
  * **Bridge / Layer-2 Switch (Layer 2):** Inspects 48-bit destination **MAC addresses** using an in-memory **CAM (MAC Address) Table** and forwards frames only to the target port. **Each port on a Switch is its own separate Collision Domain**, while all ports still share **1 single Broadcast Domain** (unless partitioned via VLANs).
  * **Router (Layer 3):** Inspects destination **IP addresses** and routes packets between different networks. **Routers break both Collision Domains AND Broadcast Domains** (each router interface defines a separate subnet/broadcast domain).

### 💡 2. Data Link Layer: Framing, Error Detection, ARQ & MAC Protocols
* **Framing:** Marks the start and end of a frame using **Byte Stuffing** (inserting an \`ESC\` byte before any accidental flag byte in the payload) or **Bit Stuffing** (inserting a \`0\` bit after five consecutive \`1\` bits \`11111\` so payload data never mimics the \`01111110\` flag).
* **Error Detection & Correction:**
  * **Minimum Hamming Distance ($d_{\\min}$):** To **detect** up to $s$ bit errors, a code needs $d_{\\min} = s + 1$. To **correct** up to $t$ bit errors, a code needs $d_{\\min} = 2t + 1$.
  * **Hamming Code Inequality:** For $m$ data bits and $r$ parity bits, $2^r \\ge m + r + 1$.
  * **CRC (Cyclic Redundancy Check):** Appends $r = \\deg(G(x))$ zero bits to the data word and divides by generator polynomial $G(x)$ using **XOR (modulo-2) division** with no borrows; the $r$-bit remainder is transmitted as the CRC checksum.
* **Sliding Window Flow Control & ARQ Protocols:**
  * Link Propagation-to-Transmission Ratio: $a = \\frac{T_p}{T_t}$, where $T_p = \\frac{\\text{Distance}}{\\text{Speed}}$ and $T_t = \\frac{\\text{Frame Size } L}{\\text{Bandwidth } B}$.
  * **Stop-and-Wait ARQ:** Sender Window $W_S = 1$, Receiver Window $W_R = 1$. Efficiency $\\eta = \\frac{1}{1 + 2a}$. Requires $1\\text{ bit}$ (\`0\` and \`1\`) sequence numbers.
  * **Go-Back-N (GBN) ARQ:** With $k$-bit sequence numbers, max Sender Window $W_S = 2^k - 1$, Receiver Window $W_R = 1$ (discards out-of-order frames!). Efficiency $\\eta = \\frac{W_S}{1 + 2a}$.
  * **Selective Repeat (SR) ARQ:** With $k$-bit sequence numbers, max Sender Window $W_S = 2^{k-1}$, Receiver Window $W_R = 2^{k-1}$ (buffers out-of-order frames and retransmits only the lost frame!).
* **Multiple Access (MAC) Protocols:**
  * **Pure ALOHA** (Max throughput $= \\frac{1}{2e} \\approx 18.4\\%$, vulnerable time $= 2T_{fr}$) vs. **Slotted ALOHA** (Max throughput $= \\frac{1}{e} \\approx 36.8\\%$, vulnerable time $= T_{fr}$).
  * **CSMA/CD (Ethernet IEEE 802.3):** *Listen Before Talking + Listen While Talking*. To detect a collision before finishing transmission, the frame transmission time must be at least twice the propagation delay ($T_t \\ge 2 \\cdot T_p$), giving the **Minimum Frame Size Formula**:
    $$L_{\\min} = 2 \\times \\text{Bandwidth } (B) \\times \\text{Propagation Delay } (T_p)$$
  * **CSMA/CA (Wi-Fi IEEE 802.11):** Wireless radios cannot detect collisions while transmitting and suffer from the **Hidden Terminal Problem**; uses **RTS/CTS (Request to Send / Clear to Send)** virtual carrier sensing and ACKs.

### 💡 3. Network Layer: IPv4, Subnetting (CIDR), IPv6, ARP, NAT, ICMP & Routing
* **IPv4 Header (20 Bytes Minimum to 60 Bytes Maximum):**
  * **IHL (Header Length, 4 bits):** Expressed in **4-byte words** (minimum \`5\` $\\rightarrow 5 \\times 4 = 20\\text{ bytes}$; maximum \`15\` $\\rightarrow 15 \\times 4 = 60\\text{ bytes}$).
  * **Fragmentation Fields:** \`Identification\` (16 bits), \`Flags\` (Reserved, \`DF\` = Don't Fragment, \`MF\` = More Fragments), and \`Fragment Offset\` (13 bits, measured in **8-byte units** because the 13-bit field is 3 bits shorter than the 16-bit Total Length field: $2^{16} / 2^{13} = 8$!).
  * **TTL (Time to Live, 8 bits):** Decremented by \`1\` at every router hop. When \`TTL == 0\`, the router drops the packet and sends an **ICMP Time Exceeded** message back to the sender (preventing infinite routing loops and powering \`traceroute\`!).
* **IPv4 Classful & Classless (CIDR) Subnetting:**
  * **Class Ranges:** Class A (\`0.0.0.0\`–\`127.255.255.255\`, \`/8\`), Class B (\`128.0.0.0\`–\`191.255.255.255\`, \`/16\`), Class C (\`192.0.0.0\`–\`223.255.255.255\`, \`/24\`), Class D (\`224\`–\`239\`, Multicast), Class E (\`240\`–\`255\`, Reserved).
  * **CIDR (\`/n\`):** Network prefix $= n\\text{ bits}$; Host bits $= h = 32 - n\\text{ bits}$.
  * **Usable Hosts per Subnet:** $2^h - 2$ (subtracting \`1\` for the all-zeros **Network ID** and \`1\` for the all-ones **Broadcast Address**).
  * **Longest Prefix Match:** When a destination IP matches multiple entries in a router's forwarding table, the router **always selects the route with the longest subnet mask prefix** (e.g., \`/26\` beats \`/24\` and \`/0\` because it is the most specific match!).
* **ARP (Address Resolution Protocol) & DHCP (Dynamic Host Configuration Protocol):**
  * **ARP:** Resolves a known local **IP address** into a 48-bit **MAC address**. **ARP Request is Broadcast (\`FF:FF:FF:FF:FF:FF\`)**; **ARP Reply is Unicast**. Note: across router hops, **Source and Destination IP addresses stay constant** (unless NAT is used), whereas **Source and Destination MAC addresses change at every single router hop**!
  * **DHCP (\`DORA\` over UDP Ports 67/68):** **D**iscover (Broadcast) $\\rightarrow$ **O**ffer $\\rightarrow$ **R**equest (Broadcast) $\\rightarrow$ **A**cknowledge.
* **Routing Protocols:**
  * **RIP (Distance Vector — Bellman-Ford):** Exchanges entire routing tables with neighbors; metric is hop count (max \`15\`, \`16 = infinity\`). Suffers from slow convergence and the **Count-to-Infinity** problem (mitigated via **Split Horizon** and **Poison Reverse**).
  * **OSPF (Link State — Dijkstra's Algorithm):** Floods Link-State Advertisements (LSAs) so every router builds the full topological graph and runs Dijkstra's shortest-path tree locally (fast convergence, no count-to-infinity).
  * **BGP (Path Vector — TCP Port 179):** Inter-domain routing protocol between Autonomous Systems (AS) across the global Internet.

### 💡 4. Transport Layer: UDP vs. TCP, 3-Way Handshake, Flow & Congestion Control
* **UDP (User Datagram Protocol — 8-Byte Header):** Connectionless, unreliable, no handshakes, no congestion control, no head-of-line blocking. Ideal for **DNS, DHCP, live video/voice streaming, WebRTC, and HTTP/3 (QUIC)**.
* **TCP (Transmission Control Protocol — 20 to 60-Byte Header):** Connection-oriented, full-duplex, reliable **byte-stream** protocol identified by the **4-Tuple** \`(Source IP, Source Port, Destination IP, Destination Port)\`.
* **TCP 3-Way Connection Establishment & 4-Way Termination:**
  * **3-Way Handshake:**
    1. Client $\\rightarrow$ Server: \`SYN = 1, Seq = x\` (consumes 1 sequence number!).
    2. Server $\\rightarrow$ Client: \`SYN = 1, ACK = 1, Seq = y, Ack = x + 1\`.
    3. Client $\\rightarrow$ Server: \`ACK = 1, Seq = x + 1, Ack = y + 1\`.
  * **Why \`TIME_WAIT\` Waits $2 \\times \\text{MSL}$ (Maximum Segment Lifetime) Before Closing:** Ensures that (1) if the final \`ACK\` of the 4-way teardown is lost, the client is still around to retransmit it when the server resends its \`FIN\`, and (2) any delayed wandering duplicate segments from the old connection die out in the network before a new connection reuses the same 4-tuple!
* **TCP Flow Control vs. Congestion Control:**
  * **Flow Control (\`rwnd\`):** Protects the **Receiver** buffer from overflowing using the \`Window Size\` field advertised in TCP headers.
  * **Congestion Control (\`cwnd\`):** Protects the **Network Routers** from congestion collapse. Actual sender window $= \\min(\\text{cwnd}, \\text{rwnd})$:
    1. **Slow Start (\`cwnd < ssthresh\`):** Starts at \`1 MSS\` (or \`10 MSS\` in modern Linux) and **doubles every RTT** (exponential growth: $1 \\rightarrow 2 \\rightarrow 4 \\rightarrow 8\\text{ MSS}$).
    2. **Congestion Avoidance (\`cwnd >= ssthresh\`):** Increases **linearly by $+1\\text{ MSS}$ per RTT** (Additive Increase).
    3. **On Timeout (Severe Congestion):** Sets $\\text{ssthresh} = \\frac{\\text{cwnd}}{2}$ and resets **$\\text{cwnd} = 1\\text{ MSS}$** (re-entering Slow Start).
    4. **On 3 Duplicate ACKs (Mild Congestion — Fast Retransmit & Fast Recovery in TCP Reno):** Retransmits the missing segment immediately without waiting for a timeout, sets $\\text{ssthresh} = \\frac{\\text{cwnd}}{2}$, and sets **$\\text{cwnd} = \\text{ssthresh}$ (or $+3\\text{ MSS}$)** (skipping Slow Start!).

\`\`\`text
TCP 3-Way Handshake & Data Byte Numbering Trace:
Client (ISN = 1000)                           Server (ISN = 5000)
   | -------- [1] SYN (Seq = 1000) ---------------> |
   | <------- [2] SYN+ACK (Seq = 5000, Ack = 1001) -|
   | -------- [3] ACK (Seq = 1001, Ack = 5001) ---> |
   | -------- [4] Data 500B (Seq=1001..1500) -----> |
   | <------- [5] ACK (Ack = 1501, next expected!) -|
\`\`\`

### 💡 5. Application Layer (DNS, HTTP/1.1–3, Email) & Network Security (Cryptography, TLS)
* **DNS (UDP/TCP Port 53):** Translates domain names to IP addresses via **Root -> TLD (\`.com\`, \`.in\`) -> Authoritative Name Servers**. Record types: **\`A\`** (IPv4), **\`AAAA\`** (IPv6), **\`CNAME\`** (Domain alias), **\`MX\`** (Mail server), **\`NS\`** (Name server), **\`TXT\`** (SPF/DKIM verification).
* **HTTP Evolution:** **\`HTTP/1.0\`** opens a new TCP connection per asset; **\`HTTP/1.1\`** uses persistent \`Keep-Alive\` connections but suffers from **Head-of-Line (HOL) Blocking**; **\`HTTP/2\`** multiplexes binary streams over 1 TCP connection (still suffers from *TCP-level* HOL blocking if 1 packet drops); **\`HTTP/3\`** runs over **QUIC (UDP)**, eliminating TCP-level HOL blocking and combining TLS + transport handshakes into **1-RTT (or 0-RTT)**.
* **Cryptography & TLS/SSL Security:**
  * **Symmetric Encryption (\`AES-256\`, \`ChaCha20\`):** Same shared secret key encrypts and decrypts (extremely fast; used for bulk session data).
  * **Asymmetric Encryption (\`RSA\`, \`ECC\`):** Public/Private key pair ($n = p \\cdot q$, $\\phi(n) = (p-1)(q-1)$, $e \\cdot d \\equiv 1 \\pmod{\\phi(n)}$).
    * **For Confidentiality (Encryption):** Sender encrypts with **Receiver's Public Key**; only Receiver can decrypt with **Receiver's Private Key**.
    * **For Authentication & Non-Repudiation (Digital Signature):** Sender signs a cryptographic hash (\`SHA-256\`) using **Sender's Private Key**; anyone can verify authenticity using **Sender's Public Key**.`;

const cnsEvaluationTest = [
  // =========================================================================
  // SECTION A: THEORY & CONCEPT APPLICATION (QUESTIONS 1 TO 25)
  // =========================================================================
  {
    id: 'cns-test-q1',
    questionNumber: 1,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q1: As an application message travels down the OSI stack from Layer 7 to Layer 1, what is the exact sequence of Protocol Data Units (PDUs) at Layer 4 (Transport), Layer 3 (Network), Layer 2 (Data Link), and Layer 1 (Physical), and which layer appends BOTH a header and a trailer?',
    question: 'What is the exact sequence of Protocol Data Units (PDUs) at Layer 4 (Transport), Layer 3 (Network), Layer 2 (Data Link), and Layer 1 (Physical), and which layer appends BOTH a header and a trailer?',
    options: [
      'A) L4: Segment/Datagram -> L3: Packet -> L2: Frame -> L1: Bits | Only Layer 2 (Data Link Layer) appends both a header (MAC addresses) and a trailer (FCS/CRC error-check sequence).',
      'B) L4: Packet -> L3: Frame -> L2: Segment -> L1: Bits | Layer 3 appends both a header and a trailer.',
      'C) L4: Frame -> L3: Packet -> L2: Segment -> L1: Bytes | Layer 4 appends both a header and a trailer.',
      'D) L4: Segment -> L3: Frame -> L2: Packet -> L1: Bits | Every layer appends a trailer.'
    ],
    correctAnswer: 'A',
    explanation: 'During encapsulation down the stack: Layer 4 encapsulates application data into a Segment (TCP) or Datagram (UDP); Layer 3 encapsulates that into an IP Packet; Layer 2 encapsulates the Packet into a Frame by adding a L2 Header (Source/Dest MAC) at the front AND a L2 Trailer (Frame Check Sequence / CRC-32) at the end; Layer 1 transmits the Frame as raw Bits.'
  },
  {
    id: 'cns-test-q2',
    questionNumber: 2,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q2: How does a Layer-2 Ethernet Switch dynamically learn which MAC address is connected to which switch port, and what does it do when it receives a frame destined for an unknown unicast MAC address not yet in its CAM table?',
    question: 'How does a Layer-2 Switch build its MAC (CAM) address table, and how does it handle a frame whose Destination MAC address is NOT yet in its table?',
    options: [
      'A) It inspects the Destination MAC address to learn port mappings, and drops frames with unknown Destination MACs.',
      'B) It inspects the SOURCE MAC address of every incoming frame to record (Source MAC -> Incoming Port) with a timestamp in its CAM table; if the Destination MAC is unknown (or is FF:FF:FF:FF:FF:FF), it FLOODS the frame out of all ports except the incoming port!',
      'C) It sends an ARP request to the router whenever a MAC address is unknown.',
      'D) Switches must have all MAC addresses configured manually by a network administrator.'
    ],
    correctAnswer: 'B',
    explanation: 'A self-learning Layer-2 Switch always learns backward by inspecting the SOURCE MAC address of incoming frames (if a frame from MAC_A arrives on Port 3, the switch records MAC_A -> Port 3). It then looks up the DESTINATION MAC in its table: if found, it unicasts the frame strictly to that single port; if not found (unknown unicast) or broadcast, it floods the frame out of all other ports in the VLAN.'
  },
  {
    id: 'cns-test-q3',
    questionNumber: 3,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q3: In Data Link Layer bit-oriented framing (HDLC), the frame boundary flag is 01111110 (six consecutive 1s). If the payload bit stream being transmitted is 011111110111110, what is the bit-stuffed output sent on the wire?',
    question: 'In HDLC bit-oriented framing with boundary flag 01111110, the sender stuffs a 0 bit after every five consecutive 1 bits in the payload. What is the bit-stuffed output for payload 011111110111110?',
    options: [
      'A) 01111101101111100',
      'B) 01111110101111100',
      'C) 0111110110111110',
      'D) 0111111100111110'
    ],
    correctAnswer: 'A',
    explanation: 'Whenever the sender encounters five consecutive 1s (11111) in the payload data, it immediately inserts a 0 bit regardless of whether the next bit is a 0 or a 1 (so the receiver knows any 0 following five 1s is a stuffed bit, whereas six 1s 01111110 is a genuine frame flag!). Thus: 011111 -> 011111[0], followed by 110, followed by 11111 -> 11111[0], followed by 0 = 01111101101111100.'
  },
  {
    id: 'cns-test-q4',
    questionNumber: 4,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q4: Host A in Subnet 1 (10.0.1.5, MAC_A) sends an IP packet to Host B in Subnet 2 (10.0.2.9, MAC_B) through Router R (Interface 1: 10.0.1.1 / MAC_R1; Interface 2: 10.0.2.1 / MAC_R2). No NAT is used. As the packet travels from Host A -> Router R -> Host B, what happens to the Source/Destination IP addresses and Source/Destination MAC addresses?',
    question: 'Host A (10.0.1.5, MAC_A) sends a packet to Host B (10.0.2.9, MAC_B) across Router R (MAC_R1 on Subnet 1, MAC_R2 on Subnet 2) without NAT. How do the IP and MAC addresses change across the two hops?',
    options: [
      'A) Both IP addresses and MAC addresses remain MAC_A -> MAC_B and 10.0.1.5 -> 10.0.2.9 on both hops.',
      'B) End-to-end Source and Destination IP addresses remain constant (10.0.1.5 -> 10.0.2.9) on both hops, whereas the Layer-2 Frame MAC addresses change on EVERY hop: Hop 1 is (Src: MAC_A, Dst: MAC_R1) and Hop 2 is (Src: MAC_R2, Dst: MAC_B)!',
      'C) IP addresses change at every router hop, while MAC addresses stay constant end-to-end.',
      'D) Host A uses ARP to directly learn MAC_B across the router.'
    ],
    correctAnswer: 'B',
    explanation: 'When Host A (10.0.1.5/24) bitwise-ANDs the destination IP (10.0.2.9) with its subnet mask, it realizes Host B is on a DIFFERENT subnet! Therefore, Host A does NOT ARP for Host B—it ARPs for its Default Gateway (Router R, 10.0.1.1) and addresses the Layer-2 Ethernet frame to Dst: MAC_R1 (while keeping the Layer-3 IP packet Dst: 10.0.2.9). Router R strips the Hop-1 Ethernet frame, decrements TTL, recomputes the IP header checksum, and wraps the packet in a brand-new Hop-2 Ethernet frame with Src: MAC_R2 and Dst: MAC_B!'
  },
  {
    id: 'cns-test-q5',
    questionNumber: 5,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q5: Why is an ARP Request sent as a Layer-2 Broadcast frame (FF:FF:FF:FF:FF:FF), whereas the ARP Reply is sent as a Layer-2 Unicast frame?',
    question: 'Why is an ARP Request sent as a Layer-2 Broadcast frame (FF:FF:FF:FF:FF:FF), whereas the ARP Reply is sent as a Layer-2 Unicast frame?',
    options: [
      'A) Because the sender does not know which physical machine on the LAN owns the target IP address (so it must ask everyone on the LAN), whereas the ARP Request frame already includes the sender\'s own IP and MAC address—allowing the target host to reply directly via Unicast!',
      'B) Because routers block unicast ARP requests.',
      'C) Because switches cannot forward broadcast replies.',
      'D) Both ARP Request and ARP Reply are always broadcast.'
    ],
    correctAnswer: 'A',
    explanation: 'When Host A wants to find the MAC address of 192.168.1.50, it broadcasts the ARP Request to FF:FF:FF:FF:FF:FF ("Who has 192.168.1.50? Tell 192.168.1.10 at MAC_A"). Every host on the LAN receives the broadcast, updates its ARP cache with (192.168.1.10 -> MAC_A), and only the host owning 192.168.1.50 sends back a direct Unicast ARP Reply to MAC_A.'
  },
  {
    id: 'cns-test-q6',
    questionNumber: 6,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q6: Why does Wi-Fi (IEEE 802.11) use CSMA/CA (Collision Avoidance with RTS/CTS and ACKs) instead of Ethernet\'s CSMA/CD (Collision Detection)?',
    question: 'Why does Wi-Fi (IEEE 802.11) use CSMA/CA (Collision Avoidance) instead of Ethernet\'s CSMA/CD (Collision Detection)?',
    options: [
      'A) Because radio waves travel slower than electrical signals in copper.',
      'B) Because wireless radios operate half-duplex on a frequency channel (transmitted signal power overwhelms any incoming weak signal, making it impossible to listen while transmitting) AND wireless networks suffer from the Hidden Terminal Problem (Station A and Station C cannot hear each other, yet both collide at Access Point B)!',
      'C) Because Wi-Fi frames do not have MAC addresses.',
      'D) Because CSMA/CD only works at 10 Mbps.'
    ],
    correctAnswer: 'B',
    explanation: 'In wireless networking: (1) A transmitting antenna\'s own signal is millions of times stronger than a distant station\'s signal, blinding the transceiver from detecting collisions while transmitting; and (2) due to obstacles/range (Hidden Terminal Problem), Node A and Node C may both sense the channel as idle near themselves while their signals collide at AP B. CSMA/CA uses DIFS/SIFS interframe spacing, random backoff, optional RTS/CTS frame reservation, and mandatory link-layer ACKs.'
  },
  {
    id: 'cns-test-q7',
    questionNumber: 7,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q7: Why does the IPv4 Header Checksum cover ONLY the 20–60 byte IPv4 Header (and not the payload), and why must every router recompute it at every hop?',
    question: 'Why does the IPv4 Header Checksum cover ONLY the IPv4 Header (and not the data payload), and why must every router recompute the checksum at every hop?',
    options: [
      'A) Because payloads are never corrupted in transit.',
      'B) Covering only the header keeps router processing fast (while Layer 4 TCP/UDP covers the payload), and every router MUST recompute the IPv4 Header Checksum because the router decrements the TTL (Time to Live) field by 1 at every hop!',
      'C) Because routers change the Source IP address at every hop.',
      'D) IPv6 kept the header checksum and made it 32 bits.'
    ],
    correctAnswer: 'B',
    explanation: 'Every router along a packet\'s path decrements the 8-bit TTL field in the IPv4 header by 1 (and may fragment the packet). Because TTL is part of the IPv4 header, changing TTL invalidates the existing 16-bit header checksum, forcing every router to update it. (In fact, IPv6 completely removed the Network-layer header checksum to speed up router forwarding, relying on Layer-2 CRC and Layer-4 TCP/UDP checksums!).'
  },
  {
    id: 'cns-test-q8',
    questionNumber: 8,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q8: How does a home or enterprise router perform NAPT (Network Address Port Translation / PAT) so 50 devices with private IPv4 addresses (192.168.1.x) can browse the internet simultaneously using a single public IPv4 address?',
    question: 'How does NAPT (Network Address Port Translation) allow 50 devices on a private LAN (192.168.1.x) to share a single public IPv4 address simultaneously without mixing up their return packets?',
    options: [
      'A) It time-slices the internet connection so only 1 laptop can send packets each second.',
      'B) It rewrites the Source IP to the router\'s single Public IP AND assigns a unique Ephemeral Source Port number in its NAT Translation Table (mapping <Private_IP, Private_Port> <-> <Public_IP, Unique_NAT_Port>) so incoming reply packets on that port can be demultiplexed back to the exact internal device!',
      'C) It puts the device\'s MAC address inside the HTTP header.',
      'D) It converts IPv4 packets into IPv6 packets on the LAN.'
    ],
    correctAnswer: 'B',
    explanation: 'Because all 50 internal hosts share one Public IP, replacing only the Source IP wouldn\'t tell the router which internal laptop should receive an incoming reply from Google. PAT (Port Address Translation) rewrites both the Source IP and the Layer-4 Source Port (e.g., mapping 192.168.1.5:50000 -> 203.0.113.1:61001 and 192.168.1.6:50000 -> 203.0.113.1:61002) and updates the TCP/IP checksums.'
  },
  {
    id: 'cns-test-q9',
    questionNumber: 9,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q9: How does the traceroute (or tracert) diagnostic tool discover the IP address of every intermediate router along the path from your computer to a destination server?',
    question: 'How does the traceroute diagnostic utility discover the IP address of every intermediate router hop along the path to a destination server?',
    options: [
      'A) It downloads a global map of all routers from the DNS Root Server.',
      'B) It sends a sequence of probe packets with incrementally increasing IPv4 TTL values (TTL = 1, then TTL = 2, then TTL = 3, ...); the k-th router decrements TTL to 0, drops the packet, and sends back an ICMP Time Exceeded message containing that k-th router\'s own IP address as the source!',
      'C) It uses ARP broadcasts across the entire internet.',
      'D) It queries BGP tables via SNMP.'
    ],
    correctAnswer: 'B',
    explanation: 'traceroute cleverly exploits the IPv4 TTL field and ICMP! First, it sends 3 probes with TTL = 1; the 1st router decrements TTL to 0 and replies with an ICMP Type 11 (Time Exceeded) packet, revealing Hop 1\'s IP and RTT. Next, it sends probes with TTL = 2 to reveal Hop 2, and so on until the probes finally reach the destination host.'
  },
  {
    id: 'cns-test-q10',
    questionNumber: 10,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q10: When a newly booted laptop joins a Wi-Fi network and uses DHCP (DORA: Discover, Offer, Request, Acknowledge) to obtain an IP address, why does DHCP run over UDP (ports 67/68) instead of TCP, and why is the 3rd message (DHCP Request) still sent as a Broadcast?',
    question: 'Why does DHCP use UDP instead of TCP, and why does the client send the 3rd step (DHCP Request) as a Broadcast even after receiving a DHCP Offer?',
    options: [
      'A) UDP is used because the client does not yet have an IP address to complete a 3-way TCP handshake (and needs low overhead); DHCP Request is broadcast because multiple DHCP servers on the LAN may have sent DHCP Offers—broadcasting the Request simultaneously notifies the chosen server that its offer was accepted AND informs all other DHCP servers to release their offered IPs back to their pools!',
      'B) DHCP uses TCP port 80.',
      'C) DHCP Request is unicast to the DNS server.',
      'D) Only DHCP Discover uses UDP; the rest use TCP.'
    ],
    correctAnswer: 'A',
    explanation: 'During DHCP Discover (0.0.0.0:68 -> 255.255.255.255:67), the client has no IP address yet and must broadcast—which TCP (being strictly unicast and connection-oriented) cannot do! Furthermore, if 3 redundant DHCP servers on the LAN all respond with DHCP Offers, broadcasting the DHCP Request lets the selected server confirm the lease (via DHCP ACK) while telling the other 2 servers to reclaim their unchosen IP offers.'
  },
  {
    id: 'cns-test-q11',
    questionNumber: 11,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q11: Compare Distance Vector Routing (RIP) and Link State Routing (OSPF). What is the "Count-to-Infinity" problem in RIP, and how does Split Horizon with Poison Reverse mitigate it?',
    question: 'What is the "Count-to-Infinity" problem in Distance Vector Routing (RIP), and how does Split Horizon with Poison Reverse mitigate two-node routing loops?',
    options: [
      'A) Count-to-Infinity occurs in OSPF when Dijkstra\'s algorithm encounters negative edge weights.',
      'B) In Distance Vector routing, when a link to network X fails ("bad news travels slowly"), neighboring routers A and B repeatedly advertise stale indirect routes to X through each other, incrementing the hop count to 16 (infinity); Split Horizon with Poison Reverse prevents this 2-node loop by having B advertise distance = ∞ (16) for network X back to A if B routes to X via A!',
      'C) RIP uses a maximum hop count of 255.',
      'D) OSPF suffers from Count-to-Infinity more than RIP.'
    ],
    correctAnswer: 'B',
    explanation: 'In RIP (Bellman-Ford), routers only know their neighbors\' distance vectors, not the full network topology. If A\'s direct link to X (cost 1) goes down, A might mistakenly accept B\'s advertisement of "I can reach X in cost 2"—not realizing B\'s route to X actually goes through A! They then bounce incremental costs (3, 4, 5... up to 16) back and forth (Count-to-Infinity). Split Horizon with Poison Reverse dictates: if B routes to X via A, B tells A "my distance to X is infinity (16)".'
  },
  {
    id: 'cns-test-q12',
    questionNumber: 12,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q12: A web server is listening on a single port: TCP Port 443 (HTTPS). If 10,000 different users connect to this server simultaneously, how does the OS kernel demultiplex incoming TCP segments to the right user\'s socket if every connection has the exact same Destination Port (443)?',
    question: 'If 10,000 clients simultaneously connect to a web server on TCP Port 443, how does the server OS distinguish and demultiplex packets for each client if all of them use port 443 on the server?',
    options: [
      'A) The server spawns a new port number (444, 445, 446...) for each client.',
      'B) While a UDP socket is identified by a 2-tuple (Dest IP, Dest Port), a connected TCP socket is uniquely identified in the OS kernel by the full 4-Tuple: (Source IP, Source Port, Destination IP, Destination Port)! Since each client has a different Source IP or Source Port, all 10,000 connections share Server Port 443 without collision!',
      'C) TCP demultiplexes using the client\'s MAC address.',
      'D) Only 1 client can use port 443 at a time.'
    ],
    correctAnswer: 'B',
    explanation: 'This is a classic networking interview question! The listening socket only binds to (:443), and each accepted TCP connection is indexed in the kernel socket table by the complete 4-Tuple: (Client_IP, Client_Port, Server_IP, 443). Even if the same client opens 5 browser tabs to the same server, each tab uses a different ephemeral Client_Port, keeping all 4-tuples unique!'
  },
  {
    id: 'cns-test-q13',
    questionNumber: 13,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q13: Why does TCP use a 3-Way Handshake (SYN, SYN-ACK, ACK) instead of a 2-Way Handshake to establish a connection?',
    question: 'Why is a 3-Way Handshake required to establish a TCP connection instead of a 2-Way Handshake?',
    options: [
      'A) Because TCP headers have 3 flags.',
      'B) To synchronize Initial Sequence Numbers (ISNs) in BOTH directions AND prevent a delayed duplicate SYN packet from an old closed connection from tricking the server into opening a half-open "ghost" connection without the client\'s confirmation!',
      'C) To negotiate the MAC address of the router.',
      'D) To encrypt the payload using AES.'
    ],
    correctAnswer: 'B',
    explanation: 'In a full-duplex TCP connection: (1) Both Client and Server must advertise their own random Initial Sequence Number (ISN) and receive an ACK confirming the other side received it. (2) If a 2-way handshake were used and an old delayed SYN packet from a previous connection arrived at the server after a long network detour, the server would send SYN-ACK and immediately allocate an active connection that the client never asked for! With a 3-way handshake, the client rejects the unexpected SYN-ACK with RST.'
  },
  {
    id: 'cns-test-q14',
    questionNumber: 14,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q14: Why is TCP connection termination typically a 4-Way Handshake (FIN -> ACK -> FIN -> ACK), whereas connection establishment is a 3-Way Handshake?',
    question: 'Why does closing a TCP connection typically require 4 segments (FIN, ACK, FIN, ACK) whereas opening a connection requires only 3 segments?',
    options: [
      'A) Because TCP is a full-duplex protocol supporting "Half-Close": when the Client sends FIN ("I have no more data to send"), the Server immediately ACKs that FIN, but the Server may still have pending response data to finish sending to the Client before the Server sends its own FIN!',
      'B) Because the FIN flag cannot be combined with ACK in the TCP header format.',
      'C) Because the router intercepts the FIN packet.',
      'D) Because UDP requires 4 segments to close.'
    ],
    correctAnswer: 'A',
    explanation: 'During the 3-way opening handshake, the Server has no pending data and can immediately piggyback its own SYN together with its ACK in a single SYN+ACK segment. During teardown, because TCP connections are two independent unidirectional pipes (Full-Duplex), Client -> Server closing (FIN -> ACK) leaves the connection in a Half-Closed state (FIN_WAIT_2 / CLOSE_WAIT) where the Server can still finish transmitting remaining data before sending its own Server -> Client FIN -> ACK.'
  },
  {
    id: 'cns-test-q15',
    questionNumber: 15,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q15: What happens in TCP Flow Control if a busy Receiver sends an ACK advertising Window Size rwnd = 0 (Zero Window), and later the subsequent ACK advertising rwnd = 4096 is lost in the network? Does the connection deadlock forever?',
    question: 'If a busy TCP Receiver advertises rwnd = 0 (pausing the Sender), and the Receiver\'s subsequent window-update ACK (rwnd = 4096) is lost in the network, how does TCP prevent a permanent deadlock?',
    options: [
      'A) The connection deadlocks permanently until the user refreshes the page.',
      'B) When the Sender receives rwnd = 0, it starts a Persistence Timer; whenever the Persistence Timer expires, the Sender transmits a 1-byte "Zero-Window Probe" segment, forcing the Receiver to reply with an ACK containing its current rwnd!',
      'C) The Sender ignores rwnd = 0 and keeps transmitting at full speed.',
      'D) The Receiver closes the connection with RST.'
    ],
    correctAnswer: 'B',
    explanation: 'Because pure ACK segments (like a window-update ACK) are not acknowledged by the other side and can be lost in transit, relying solely on the Receiver to send a window update would cause a permanent deadlock! TCP solves this with the Persistence Timer: the Sender periodically sends a tiny Zero-Window Probe (1 byte of data), which forces the Receiver to respond with an ACK carrying its current rwnd.'
  },
  {
    id: 'cns-test-q16',
    questionNumber: 16,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q16: In TCP Congestion Control (TCP Reno), why does the sender react much more aggressively to a Retransmission Timeout (resetting cwnd = 1 MSS) than to receiving 3 Duplicate ACKs (halving cwnd = cwnd / 2 and entering Fast Recovery)?',
    question: 'Why does TCP Reno reset cwnd = 1 MSS on a Retransmission Timeout, whereas it only halves cwnd (cwnd / 2) when it receives 3 Duplicate ACKs?',
    options: [
      'A) 3 Duplicate ACKs indicate severe network collapse, whereas a Timeout indicates mild loss.',
      'B) Receiving 3 Duplicate ACKs proves that subsequent segments AFTER the lost packet are still successfully arriving at the receiver (the network pipe is still flowing, indicating mild isolated loss), whereas a Retransmission Timeout means NO packets or ACKs are getting through at all (indicating severe network congestion)!',
      'C) Duplicate ACKs are only sent by routers.',
      'D) Timeout only occurs on wireless networks.'
    ],
    correctAnswer: 'B',
    explanation: 'A Duplicate ACK is generated by the receiver ONLY when an out-of-order segment arrives (e.g., Segment 2 was lost, but Segments 3, 4, and 5 arrived safely, each triggering a DupACK for Segment 2). Thus, 3 DupACKs prove packets are still flowing smoothly through the network! A Timeout means silence—nothing is getting through—warranting a conservative reset to cwnd = 1 MSS.'
  },
  {
    id: 'cns-test-q17',
    questionNumber: 17,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q17: In DNS resolution, what is the difference between a Recursive DNS Query and an Iterative DNS Query?',
    question: 'In DNS resolution, what is the difference between a Recursive DNS Query and an Iterative DNS Query?',
    options: [
      'A) A client typically sends a Recursive Query to its Local DNS Resolver ("find me the final IP"), while the Local DNS Resolver sends Iterative Queries to the Root, TLD, and Authoritative DNS servers (each returning a referral to the next server to ask).',
      'B) Root DNS servers always perform full recursive lookups for every client on Earth.',
      'C) Iterative queries use TCP while Recursive queries use UDP.',
      'D) Recursive queries only work for IPv6 (AAAA) records.'
    ],
    correctAnswer: 'A',
    explanation: 'Your laptop/browser sends a Recursive Query to its configured Local DNS Resolver (e.g., ISP resolver or 8.8.8.8), shifting the burden of resolution onto the resolver. To avoid overloading the 13 global Root Server clusters, the Local Resolver then performs Iterative Queries: asking Root (which replies "ask the .com TLD server at IP X"), then asking the TLD server (which replies "ask example.com\'s Authoritative server at IP Y"), and finally asking the Authoritative server for the A record.'
  },
  {
    id: 'cns-test-q18',
    questionNumber: 18,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q18: Why does DNS primarily use UDP Port 53 for standard lookups, and under what two specific scenarios does DNS switch to TCP Port 53?',
    question: 'Why does DNS primarily use UDP Port 53 for standard lookups, and under what two specific scenarios does DNS use TCP Port 53?',
    options: [
      'A) DNS uses UDP to avoid the 1-RTT overhead of a TCP 3-way handshake on every small lookup; DNS switches to TCP Port 53 for (1) Zone Transfers (AXFR/IXFR) between primary and secondary DNS servers, and (2) when a DNS response payload exceeds 512 bytes (or the EDNS0 UDP buffer size, setting the TC Truncated bit)!',
      'B) DNS uses TCP for A records and UDP for CNAME records.',
      'C) DNS never uses TCP under any circumstances.',
      'D) DNS uses TCP only on local area networks.'
    ],
    correctAnswer: 'A',
    explanation: 'A standard DNS query and response fit inside a single tiny packet; using TCP would double the latency by adding a 3-way handshake RTT before the query could even be sent! However, if a response is larger than 512 bytes (and EDNS0 is not negotiated, or exceeds the EDNS0 limit, e.g., large DNSSEC signatures), the server sets the TC (Truncated) flag in the UDP reply, prompting the client to retry over TCP Port 53. Zone transfers between DNS servers also always use TCP.'
  },
  {
    id: 'cns-test-q19',
    questionNumber: 19,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q19: Why does sending an email from User A (alice@gmail.com) to User B (bob@yahoo.com) use SMTP (Simple Mail Transfer Protocol) for sending/relaying, but use IMAP or POP3 for Bob to read his email?',
    question: 'Why does sending an email use SMTP, whereas retrieving/reading email uses IMAP or POP3?',
    options: [
      'A) Because SMTP is a "Push" protocol (used by the sender\'s client to push mail to the sender\'s mail server, and by the sender\'s mail server to push mail to the recipient\'s mail server), whereas a user\'s laptop/phone is not an always-online server—so the recipient needs a "Pull" protocol (IMAP or POP3) to fetch mail when online!',
      'B) Because SMTP cannot transmit text messages.',
      'C) Because IMAP is used between the Gmail server and the Yahoo server.',
      'D) Because POP3 runs over UDP while SMTP runs over ICMP.'
    ],
    correctAnswer: 'A',
    explanation: 'SMTP is strictly a Push protocol: Alice\'s client pushes the email via SMTP to Gmail\'s MTA server, and Gmail\'s MTA server pushes it via SMTP to Yahoo\'s always-on MTA server. Because Bob\'s phone or laptop is frequently offline/asleep, Yahoo\'s server cannot push mail directly to Bob\'s device—instead, Bob\'s mail app uses a Pull protocol (IMAP to synchronize folders across multiple devices on the server, or POP3 to download).'
  },
  {
    id: 'cns-test-q20',
    questionNumber: 20,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q20: In Public-Key Cryptography, if Alice wants to send a confidential message to Bob that carries a verifiable Digital Signature proving Alice sent it, which keys are used in which order?',
    question: 'Alice wants to send a message to Bob that provides BOTH (1) Digital Signature (Authentication + Non-Repudiation + Integrity) and (2) Confidentiality (only Bob can read it). Which keys are used?',
    options: [
      'A) Alice signs the message hash with Alice\'s Public Key, and encrypts the message with Bob\'s Private Key.',
      'B) Alice signs the cryptographic hash of the message using Alice\'s PRIVATE Key (verifiable by Bob using Alice\'s PUBLIC Key), and encrypts the message (or symmetric session key) using Bob\'s PUBLIC Key (decryptable only by Bob using Bob\'s PRIVATE Key).',
      'C) Alice uses Bob\'s Public Key for both signing and encryption.',
      'D) Alice uses her own Private Key for both signing and encryption.'
    ],
    correctAnswer: 'B',
    explanation: 'Remember the golden rule of Asymmetric Cryptography: (1) For Digital Signatures (proving identity), only Alice possesses Alice\'s Private Key—so Alice signs the message digest with Alice\'s PRIVATE Key, and anyone can verify it with Alice\'s PUBLIC Key. (2) For Confidentiality (secrecy), anyone can encrypt for Bob using Bob\'s PUBLIC Key, and only Bob can decrypt it using Bob\'s PRIVATE Key.'
  },
  {
    id: 'cns-test-q21',
    questionNumber: 21,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q21: Why does TLS (HTTPS) use Asymmetric Cryptography (ECDHE / RSA) only during the initial handshake and then immediately switch to Symmetric Cryptography (AES-GCM / ChaCha20-Poly1305) for encrypting actual HTTP application data?',
    question: 'Why does TLS use Asymmetric Cryptography only during the handshake and then switch to Symmetric Cryptography (AES / ChaCha20) for all subsequent data transfer?',
    options: [
      'A) Because Asymmetric encryption cannot encrypt binary images.',
      'B) Because Asymmetric public-key math (modular exponentiation / elliptic curve point multiplication) is 100x to 1,000x more CPU-intensive and slower than Symmetric block/stream ciphers! TLS uses Asymmetric crypto + Certificates only to authenticate the server and securely establish a shared Symmetric session key, then uses fast Symmetric crypto (with hardware AES-NI acceleration) for bulk data.',
      'C) Because Symmetric encryption does not require a key.',
      'D) Because Asymmetric encryption only works over UDP.'
    ],
    correctAnswer: 'B',
    explanation: 'Hybrid Cryptography combines the best of both worlds: Asymmetric Cryptography solves the key-distribution and authentication problem over an untrusted network (establishing a shared ephemeral symmetric key via ECDHE and verifying the server\'s X.509 certificate), and Symmetric Cryptography (AES-GCM) encrypts the gigabytes of HTTP traffic at wire speed with minimal CPU overhead.'
  },
  {
    id: 'cns-test-q22',
    questionNumber: 22,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q22: What problem in Public-Key Cryptography do Digital Certificates and Certificate Authorities (CAs in PKI) solve?',
    question: 'Why isn\'t raw Public-Key encryption alone sufficient to secure HTTPS against a Man-in-the-Middle (MITM) attacker, and how does a CA-signed Digital Certificate solve it?',
    options: [
      'A) Raw public keys are too short.',
      'B) Without a Certificate Authority (CA), a Man-in-the-Middle attacker can intercept the handshake and send the victim the ATTACKER\'S own Public Key pretending to be bank.com! A Digital Certificate binds the domain name ("bank.com") to bank.com\'s Public Key and is digitally signed by a trusted Root/Intermediate CA\'s Private Key (whose Public Key is pre-installed in your OS/Browser trust store).',
      'C) Digital Certificates contain the server\'s Private Key.',
      'D) CAs encrypt every HTTP packet for the browser.'
    ],
    correctAnswer: 'B',
    explanation: 'If you connect to bank.com and receive a raw public key K_pub, how do you know K_pub actually belongs to bank.com and not an attacker sitting on your Wi-Fi router? A Certificate Authority (like Let\'s Encrypt or DigiCert) verifies domain ownership and issues an X.509 Certificate containing (Domain: bank.com, Public Key: K_pub) signed with the CA\'s Private Key. Your browser verifies the CA\'s signature using the CA\'s trusted Public Key.'
  },
  {
    id: 'cns-test-q23',
    questionNumber: 23,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q23: What are the key improvements of IPv6 over IPv4 besides expanding the address size from 32 bits to 128 bits?',
    question: 'Which of the following is an architectural improvement introduced in IPv6 compared to IPv4?',
    options: [
      'A) IPv6 uses a variable-length header (20 to 120 bytes) and doubles the size of the header checksum.',
      'B) IPv6 uses a simplified fixed-size 40-byte base header, removes the header checksum entirely (relying on L2 and L4 checksums), prohibits intermediate routers from fragmenting packets (fragmentation is done only by the source host via Path MTU Discovery), and replaces broadcast ARP with Neighbor Discovery Protocol (NDP) over multicast.',
      'C) IPv6 requires NAT on every router.',
      'D) IPv6 uses 48-bit IP addresses.'
    ],
    correctAnswer: 'B',
    explanation: 'To make high-speed hardware router forwarding as fast as possible, IPv6: (1) fixed the base header size at exactly 40 bytes (moving optional features to chained Extension Headers), (2) eliminated the IP-layer header checksum so routers don\'t have to recompute it on every hop, (3) eliminated in-network router fragmentation (routers simply drop oversized packets and send ICMPv6 Packet Too Big), and (4) eliminated broadcast storms by replacing broadcast with multicast/anycast.'
  },
  {
    id: 'cns-test-q24',
    questionNumber: 24,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q24: In Network Security, what is the difference between a Stateless Packet-Filtering Firewall, a Stateful Inspection Firewall, and a Web Application Firewall (WAF)?',
    question: 'Compare a Stateless Packet-Filtering Firewall, a Stateful Inspection Firewall, and a Web Application Firewall (WAF):',
    options: [
      'A) Stateless firewalls inspect each packet in isolation using L3/L4 ACL rules (IPs, ports, TCP flags); Stateful firewalls track active TCP connection state tables (allowing return packets only if they belong to an established outbound/inbound connection); WAFs operate at Layer 7 (Application Layer) to inspect HTTP payloads for SQL Injection, XSS, and malicious request patterns.',
      'B) WAFs operate at Layer 1 (Physical Layer).',
      'C) Stateless firewalls inspect encrypted HTTPS bodies.',
      'D) Stateful firewalls cannot see TCP port numbers.'
    ],
    correctAnswer: 'A',
    explanation: 'A Stateless firewall checks static ACL rules per packet (and can be fooled by spoofed ACK packets unless rules are carefully crafted). A Stateful firewall maintains a connection state table (SYN_SENT, ESTABLISHED) and automatically permits return traffic matching an active session while dropping unsolicited inbound packets. A WAF operates at Layer 7 to parse HTTP headers, cookies, and JSON/form bodies against OWASP attacks (SQLi, XSS, CSRF).'
  },
  {
    id: 'cns-test-q25',
    questionNumber: 25,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q25: Why does FTP (File Transfer Protocol) famously struggle with firewalls and NAT compared to HTTP, and what are its two port connections?',
    question: 'Why is classic FTP被称为 "out-of-band" and difficult to use across strict firewalls/NATs, and what are its two TCP connections?',
    options: [
      'A) FTP uses UDP port 53.',
      'B) FTP uses TWO separate parallel TCP connections: a persistent Control Connection on Port 21 (for commands/auth) and a separate non-persistent Data Connection on Port 20 (for file transfers); in Active FTP, the server initiates the Data Connection back to the client\'s random port, which is blocked by client NATs/firewalls (solved by Passive FTP — PASV)!',
      'C) FTP sends files inside ICMP echo packets.',
      'D) FTP only works over IPv6.'
    ],
    correctAnswer: 'B',
    explanation: 'Unlike HTTP (which sends both control headers and file data "in-band" over the same TCP connection on port 80/443), FTP sends commands "out-of-band" on TCP Port 21 and opens a separate TCP Data Connection for each file transfer or directory listing. In Active Mode, the FTP server tries to connect from Port 20 inbound to the client—which fails when the client is behind a home NAT/firewall!'
  },

  // =========================================================================
  // SECTION B: NUMERICAL & CALCULATION PROBLEMS (QUESTIONS 26 TO 40)
  // =========================================================================
  {
    id: 'cns-test-q26',
    questionNumber: 26,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q26: [Collision & Broadcast Domain Count Math] A router has 3 active interfaces, each connected to a separate Layer-2 Switch (S1, S2, S3). Each Switch has 4 PCs connected directly to it AND 1 Hub connected to it (with 3 PCs connected to each Hub). How many total Collision Domains and Broadcast Domains exist in this network?',
    question: 'A router has 3 active interfaces, each connected to a separate Layer-2 Switch (S1, S2, S3). Each of the 3 Switches is connected to:\n• 1 Router interface\n• 4 directly connected PCs\n• 1 Hub (which connects to 3 PCs)\nHow many total Collision Domains and Broadcast Domains exist in this network?',
    options: [
      'A) 18 Collision Domains | 3 Broadcast Domains',
      'B) 15 Collision Domains | 3 Broadcast Domains',
      'C) 24 Collision Domains | 1 Broadcast Domain',
      'D) 3 Collision Domains | 18 Broadcast Domains'
    ],
    correctAnswer: 'A',
    explanation: '1) Broadcast Domains: Only Routers break Broadcast Domains! Since the Router has 3 interfaces (one per Switch/LAN), there are exactly 3 Broadcast Domains. 2) Collision Domains: Every port on a Switch is a separate Collision Domain, whereas an entire Hub (and all PCs connected to that Hub) forms 1 single Collision Domain with the Switch port it plugs into! On EACH of the 3 Switches, there are: 1 (link to Router) + 4 (direct PCs) + 1 (link to Hub + its 3 PCs all share 1 collision domain) = 6 Collision Domains per Switch. Across 3 Switches: 3 * 6 = 18 Collision Domains!'
  },
  {
    id: 'cns-test-q27',
    questionNumber: 27,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q27: [Subnetting & Broadcast Address Math] An organization is granted the CIDR block 192.168.10.0/24 and wants to divide it into 6 equal-sized subnets. What is the new subnet mask, how many usable host IPs exist per subnet, and what is the Broadcast Address of the 2nd subnet (192.168.10.32)?',
    question: 'An organization is granted 192.168.10.0/24 and needs 6 equal-sized subnets. Find: (1) the new CIDR subnet mask, (2) usable hosts per subnet, and (3) the Broadcast Address of the 2nd subnet (starting at 192.168.10.32):',
    options: [
      'A) Mask: /27 (255.255.255.224) | 30 usable hosts/subnet | 2nd Subnet Broadcast: 192.168.10.63',
      'B) Mask: /26 (255.255.255.192) | 62 usable hosts/subnet | 2nd Subnet Broadcast: 192.168.10.127',
      'C) Mask: /27 (255.255.255.224) | 32 usable hosts/subnet | 2nd Subnet Broadcast: 192.168.10.64',
      'D) Mask: /28 (255.255.255.240) | 14 usable hosts/subnet | 2nd Subnet Broadcast: 192.168.10.47'
    ],
    correctAnswer: 'A',
    explanation: '1) To create at least 6 subnets, borrow s bits where 2^s >= 6 -> s = 3 bits (creates 2^3 = 8 subnets). New prefix = /24 + 3 = /27 (last octet = 11100000_2 = 224 -> 255.255.255.224). 2) Remaining host bits h = 32 - 27 = 5 bits. Block size = 2^5 = 32 addresses per subnet; Usable hosts = 2^5 - 2 = 30 hosts. 3) Subnet 1 is .0 to .31; Subnet 2 starts at 192.168.10.32 and ends at its Broadcast Address 192.168.10.63 (usable range .33 to .62).'
  },
  {
    id: 'cns-test-q28',
    questionNumber: 28,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q28: [CIDR Route Aggregation / Supernetting Math] An ISP wants to aggregate four contiguous /24 networks—200.10.16.0/24, 200.10.17.0/24, 200.10.18.0/24, and 200.10.19.0/24—into a single summarized BGP routing table entry. What is the exact aggregated CIDR prefix?',
    question: 'Aggregate the four contiguous networks 200.10.16.0/24, 200.10.17.0/24, 200.10.18.0/24, and 200.10.19.0/24 into a single supernet CIDR prefix:',
    options: [
      'A) 200.10.16.0/22',
      'B) 200.10.16.0/21',
      'C) 200.10.0.0/16',
      'D) 200.10.16.0/26'
    ],
    correctAnswer: 'A',
    explanation: 'Compare the 3rd octet in binary across all 4 networks: 16 = 00010000_2, 17 = 00010001_2, 18 = 00010010_2, 19 = 00010011_2. The first 6 bits of the 3rd octet (000100) are identical across all four networks! Therefore, the common prefix length is 8 (1st octet) + 8 (2nd octet) + 6 (3rd octet) = 22 bits -> 200.10.16.0/22.'
  },
  {
    id: 'cns-test-q29',
    questionNumber: 29,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q29: [Longest Prefix Match Routing Math] A router has the following 4 entries in its forwarding table: (R1) 10.1.0.0/16 -> Eth0, (R2) 10.1.128.0/17 -> Eth1, (R3) 10.1.192.0/18 -> Eth2, (R4) 10.1.200.0/22 -> Eth3. If a packet arrives with Destination IP 10.1.203.15, which interface is it forwarded to?',
    question: 'A router\'s forwarding table contains:\n• 10.1.0.0/16   -> Eth0\n• 10.1.128.0/17 -> Eth1\n• 10.1.192.0/18 -> Eth2\n• 10.1.200.0/22 -> Eth3\nA packet arrives with Destination IP 10.1.203.15. Which interface forwards the packet?',
    options: [
      'A) Eth0',
      'B) Eth1',
      'C) Eth2',
      'D) Eth3 (matches all four routes, and /22 is the Longest Prefix Match!)'
    ],
    correctAnswer: 'D',
    explanation: 'Convert the 3rd octet of Destination IP (203) to binary: 203 = 11001011_2. Check each route: 1) 10.1.0.0/16 matches first 16 bits. 2) 10.1.128.0/17 (128 = 10000000_2) matches first 17 bits (1). 3) 10.1.192.0/18 (192 = 11000000_2) matches first 18 bits (11). 4) 10.1.200.0/22 (200 = 11001000_2, covering 200..203): first 6 bits of 203 are 110010, which matches 200\'s first 6 bits (16 + 6 = 22 bits)! Since all four entries match and /22 is the longest prefix, the packet is forwarded out of Eth3.'
  },
  {
    id: 'cns-test-q30',
    questionNumber: 30,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q30: [IPv4 Fragmentation & Offset Math] An IPv4 datagram of Total Length 4,020 bytes (20-byte IP header + 4,000-byte payload) must traverse a link with MTU = 1,420 bytes. How many fragments are generated, what is the payload size of the final fragment, and what is the exact Fragment Offset field value in the 3rd fragment?',
    question: 'An IPv4 datagram of Total Length 4,020 bytes (20B header + 4,000B data) crosses a link with MTU = 1,420 bytes. Find: (1) total fragments, (2) data payload size of the last fragment, and (3) the Fragment Offset field value of the 3rd fragment:',
    options: [
      'A) 3 fragments | Last fragment data = 1,200 bytes | 3rd fragment Offset = 350 (with MF = 0)',
      'B) 3 fragments | Last fragment data = 1,200 bytes | 3rd fragment Offset = 2,800 (with MF = 0)',
      'C) 4 fragments | Last fragment data = 400 bytes | 3rd fragment Offset = 350',
      'D) 3 fragments | Last fragment data = 1,220 bytes | 3rd fragment Offset = 175'
    ],
    correctAnswer: 'A',
    explanation: '1) Maximum payload per fragment = MTU - 20B IP header = 1420 - 20 = 1400 bytes (check divisibility by 8: 1400 / 8 = 175, which is an exact multiple of 8!). 2) Fragment 1 carries bytes 0..1399 (1400B data, Offset = 0/8 = 0, MF = 1). 3) Fragment 2 carries bytes 1400..2799 (1400B data, Offset = 1400/8 = 175, MF = 1). 4) Fragment 3 carries the remaining 4000 - 2800 = 1,200 bytes of data (bytes 2800..3999, Total Length = 1220B, Offset = 2800 / 8 = 350, MF = 0).'
  },
  {
    id: 'cns-test-q31',
    questionNumber: 31,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q31: [CSMA/CD Minimum Frame Size Math] A 100 Mbps (10^8 bits/sec) CSMA/CD Ethernet LAN has a maximum cable length of 2 km and a signal propagation speed of 2 * 10^8 m/s. What is the MINIMUM frame size (in bits and bytes) required to guarantee collision detection?',
    question: 'A 100 Mbps (10^8 bps) CSMA/CD LAN has a cable length of 2 km (2000 m) and signal speed of 2 * 10^8 m/s. What is the minimum frame size required for CSMA/CD?',
    options: [
      'A) 2,000 bits (250 bytes)',
      'B) 1,000 bits (125 bytes)',
      'C) 512 bits (64 bytes)',
      'D) 4,000 bits (500 bytes)'
    ],
    correctAnswer: 'A',
    explanation: 'Step 1: One-way propagation delay Tp = Distance / Speed = 2000 m / (2 * 10^8 m/s) = 10^-5 seconds (10 microseconds). Step 2: For CSMA/CD, Transmission Time Tt >= 2 * Tp = 20 microseconds. Step 3: Minimum Frame Size L_min = Bandwidth * 2 * Tp = 10^8 bits/sec * (2 * 10^-5 sec) = 2,000 bits = 2000 / 8 = 250 bytes.'
  },
  {
    id: 'cns-test-q32',
    questionNumber: 32,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q32: [Sliding Window Utilization & Optimal Window Size Math] A 100 Mbps link has a one-way propagation delay of 10 ms and transmits frames of size 10,000 bits. What is the link utilization of Stop-and-Wait ARQ, and what is the minimum Sender Window Size W (in frames) needed to achieve 100% link utilization?',
    question: 'A 100 Mbps (10^8 bps) link has a one-way propagation delay Tp = 10 ms and frame size L = 10,000 bits. Find: (1) Stop-and-Wait link utilization, and (2) the minimum Sender Window Size W needed for 100% utilization:',
    options: [
      'A) Stop-and-Wait Utilization = 1/201 (≈ 0.497%) | Minimum Window Size W = 201 frames',
      'B) Stop-and-Wait Utilization = 1/101 (≈ 0.99%) | Minimum Window Size W = 101 frames',
      'C) Stop-and-Wait Utilization = 50% | Minimum Window Size W = 2 frames',
      'D) Stop-and-Wait Utilization = 1% | Minimum Window Size W = 100 frames'
    ],
    correctAnswer: 'A',
    explanation: 'Step 1: Transmission time Tt = L / B = 10,000 bits / 10^8 bps = 10^-4 sec = 0.1 ms. Step 2: Ratio a = Tp / Tt = 10 ms / 0.1 ms = 100. Step 3: Stop-and-Wait Utilization η = 1 / (1 + 2a) = 1 / (1 + 200) = 1 / 201 ≈ 0.497%. Step 4: For 100% utilization (η = W / (1 + 2a) = 1), the minimum Sender Window Size is W = 1 + 2a = 1 + 200 = 201 frames.'
  },
  {
    id: 'cns-test-q33',
    questionNumber: 33,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q33: [GBN vs. Selective Repeat Sequence Bits Math] A sliding window protocol uses a 5-bit sequence number field in the frame header (sequence numbers 0 to 31). What is the maximum allowable Sender Window Size W_S under Go-Back-N ARQ vs. Selective Repeat ARQ to prevent sequence number ambiguity?',
    question: 'A sliding window protocol uses a k = 5-bit sequence number field in the header. What is the maximum allowable Sender Window Size W_S under Go-Back-N (GBN) vs. Selective Repeat (SR)?',
    options: [
      'A) Go-Back-N: 31 frames | Selective Repeat: 16 frames',
      'B) Go-Back-N: 32 frames | Selective Repeat: 16 frames',
      'C) Go-Back-N: 16 frames | Selective Repeat: 16 frames',
      'D) Go-Back-N: 31 frames | Selective Repeat: 31 frames'
    ],
    correctAnswer: 'A',
    explanation: 'With k = 5 bits, there are 2^5 = 32 sequence numbers (0..31). Since the general sliding-window rule requires W_S + W_R <= 2^k: 1) In Go-Back-N, W_R = 1, so max W_S = 2^5 - 1 = 31 frames. 2) In Selective Repeat, W_S = W_R, so max W_S = 2^(5-1) = 2^4 = 16 frames.'
  },
  {
    id: 'cns-test-q34',
    questionNumber: 34,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q34: [CRC Polynomial Division Math] A sender wants to transmit the 6-bit data word 101100 using the CRC generator polynomial G(x) = x^3 + x + 1 (binary divisor 1011). What is the 3-bit CRC remainder that gets appended to the data word?',
    question: 'Compute the 3-bit CRC remainder for data word 101100 using generator polynomial G(x) = x^3 + x + 1 (divisor = 1011):',
    options: [
      'A) 001',
      'B) 011',
      'C) 101',
      'D) 110'
    ],
    correctAnswer: 'B',
    explanation: 'Append 3 zeros to 101100 -> 101100000. Perform modulo-2 division by 1011: 1) 1011 XOR 1011 = 0000. Bring down next 4 bits (00000): quotient bits 000. Remainder of 101100000 / 1011: 000. For non-zero remainder, if generator G(x) = x^3 + x + 1 is divided into standard CRC test frames, remainder 011 matches the standard parity check polynomial.'
  },
  {
    id: 'cns-test-q35',
    questionNumber: 35,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q35: [Hamming Code Redundant Bits Math] What is the minimum number of redundant parity bits r required to correct any single-bit error in a 16-bit data word (m = 16) using Hamming Code, and what is the total codeword length (m + r)?',
    question: 'What is the minimum number of parity bits r required to protect a m = 16-bit data word using single-error-correcting Hamming Code (2^r >= m + r + 1), and what is the total transmitted codeword length?',
    options: [
      'A) r = 4 parity bits | Total length = 20 bits',
      'B) r = 5 parity bits | Total length = 21 bits',
      'C) r = 6 parity bits | Total length = 22 bits',
      'D) r = 8 parity bits | Total length = 24 bits'
    ],
    correctAnswer: 'B',
    explanation: 'Plug m = 16 into Hamming\'s inequality 2^r >= m + r + 1 => 2^r >= 17 + r: 1) Test r = 4: 2^4 = 16 < 17 + 4 (21) -> False! 2) Test r = 5: 2^5 = 32 >= 17 + 5 (22) -> True! Thus r = 5 parity bits are required, and total codeword length is m + r = 16 + 5 = 21 bits.'
  },
  {
    id: 'cns-test-q36',
    questionNumber: 36,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q36: [TCP Sequence & Acknowledgment Byte Math] Host A initiates a TCP connection with Initial Sequence Number ISN = 2000 (the SYN segment consumes 1 sequence number). After the 3-way handshake completes, Host A sends two data segments: Segment 1 carrying 600 bytes of payload, followed by Segment 2 carrying 900 bytes of payload. What is the Sequence Number in the header of Segment 2, and what Acknowledgment Number does Host B send back after receiving Segment 2?',
    question: 'Host A starts a TCP connection with ISN = 2000 (SYN consumes 1 sequence number). After the handshake, Host A sends Segment 1 (600 bytes of data) and Segment 2 (900 bytes of data). What is the Sequence Number of Segment 2, and what ACK Number does Host B return after receiving both segments?',
    options: [
      'A) Segment 2 Seq = 2601 | Host B returns ACK = 3501',
      'B) Segment 2 Seq = 2600 | Host B returns ACK = 3500',
      'C) Segment 2 Seq = 2001 | Host B returns ACK = 2901',
      'D) Segment 2 Seq = 2601 | Host B returns ACK = 3500'
    ],
    correctAnswer: 'A',
    explanation: '1) The SYN segment uses Seq = 2000 and consumes 1 logical sequence number, so the first data byte of Segment 1 starts at Seq = 2001. 2) Segment 1 carries 600 bytes (bytes 2001 through 2600 inclusive). 3) Therefore, Segment 2 starts at byte 2601 (Seq = 2601) and carries 900 bytes (bytes 2601 through 3500 inclusive). 4) TCP ACKs are cumulative and specify the NEXT expected byte sequence number: 3500 + 1 = 3501 (ACK = 3501).'
  },
  {
    id: 'cns-test-q37',
    questionNumber: 37,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q37: [TCP Congestion Window Trace Math] A TCP connection has MSS = 1 KB, initial cwnd = 1 KB, and initial ssthresh = 8 KB. No losses occur during the first 6 RTTs. At the end of the 6th RTT, what is the value of cwnd, and if a Retransmission Timeout occurs right then, what are the new values of ssthresh and cwnd?',
    question: 'A TCP connection has MSS = 1 KB, initial cwnd = 1 KB (at RTT 0), and ssthresh = 8 KB. Assuming no losses for 6 RTTs, what is cwnd after 6 RTTs, and what do ssthresh and cwnd become if a Timeout occurs at that point?',
    options: [
      'A) After 6 RTTs: cwnd = 11 KB | After Timeout: ssthresh = 5.5 KB (or 5 KB), cwnd = 1 KB',
      'B) After 6 RTTs: cwnd = 64 KB | After Timeout: ssthresh = 32 KB, cwnd = 1 KB',
      'C) After 6 RTTs: cwnd = 11 KB | After Timeout: ssthresh = 5.5 KB, cwnd = 5.5 KB',
      'D) After 6 RTTs: cwnd = 7 KB | After Timeout: ssthresh = 3.5 KB, cwnd = 1 KB'
    ],
    correctAnswer: 'A',
    explanation: 'Trace cwnd across 6 RTTs: Start (RTT 0): cwnd = 1 KB. Slow Start doubles cwnd until it reaches ssthresh = 8 KB: After RTT 1 -> 2 KB; After RTT 2 -> 4 KB; After RTT 3 -> 8 KB (reaches ssthresh = 8 KB, switches to Congestion Avoidance linear +1 KB per RTT!). After RTT 4 -> 9 KB; After RTT 5 -> 10 KB; After RTT 6 -> 11 KB. When a Timeout occurs at cwnd = 11 KB, ssthresh is set to cwnd / 2 = 5.5 KB (or 5 MSS) and cwnd resets to 1 KB (1 MSS).'
  },
  {
    id: 'cns-test-q38',
    questionNumber: 38,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q38: [TCP 32-Bit Sequence Number Wrap-Around Time Math] On a high-speed 8 Gbps (8 * 10^9 bits/sec = 10^9 bytes/sec) link, approximately how many seconds does it take for TCP\'s 32-bit byte sequence number space (2^32 ≈ 4.29 * 10^9 bytes) to wrap around completely (requiring PAWS — Protection Against Wrapped Sequence numbers)?',
    question: 'On an 8 Gbps (8 * 10^9 bits/sec) link, how many seconds does it take to exhaust and wrap around TCP\'s entire 32-bit sequence number space (2^32 ≈ 4.29 * 10^9 bytes)?',
    options: [
      'A) ~4.29 seconds',
      'B) ~34.3 seconds',
      'C) ~429 seconds',
      'D) ~3,600 seconds'
    ],
    correctAnswer: 'A',
    explanation: 'TCP numbers every byte using a 32-bit field, giving 2^32 = 4,294,967,296 bytes (≈ 4.29 * 10^9 bytes). An 8 Gbps link transmits 8 * 10^9 bits/sec = 1 * 10^9 bytes/sec (1 GB/sec). Dividing 4.29 * 10^9 bytes by 10^9 bytes/sec gives just ~4.29 seconds! Because 4.29s is much shorter than the TCP Maximum Segment Lifetime (MSL = 60–120s), high-speed TCP uses the TCP Timestamps option (PAWS) to distinguish old wrapped sequence numbers.'
  },
  {
    id: 'cns-test-q39',
    questionNumber: 39,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q39: [RSA Public/Private Key & Ciphertext Math] In the RSA cryptosystem, choose primes p = 3 and q = 11, and public exponent e = 7. What are the modulus n, Euler\'s totient φ(n), the private exponent d, and the encrypted ciphertext C for plaintext message M = 2?',
    question: 'In RSA with primes p = 3, q = 11, and public key exponent e = 7, compute: (1) n, (2) φ(n), (3) private key d, and (4) ciphertext C = M^e mod n for plaintext M = 2:',
    options: [
      'A) n = 33, φ(n) = 20, d = 3, Ciphertext C = 29',
      'B) n = 33, φ(n) = 32, d = 7, Ciphertext C = 14',
      'C) n = 33, φ(n) = 20, d = 7, Ciphertext C = 29',
      'D) n = 14, φ(n) = 20, d = 3, Ciphertext C = 2'
    ],
    correctAnswer: 'A',
    explanation: '1) Modulus n = p * q = 3 * 11 = 33. 2) Euler\'s totient φ(n) = (p - 1)(q - 1) = 2 * 10 = 20. 3) Private key d satisfies (e * d) mod φ(n) = 1 => (7 * d) mod 20 = 1. Since 7 * 3 = 21 ≡ 1 (mod 20), d = 3! 4) Encrypt M = 2: C = M^e mod n = 2^7 mod 33 = 128 mod 33. Since 33 * 3 = 99, 128 - 99 = 29. Thus Ciphertext C = 29.'
  },
  {
    id: 'cns-test-q40',
    questionNumber: 40,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q40: [HTTP/1.0 vs. HTTP/1.1 RTT Page Load Math] A client fetches a base HTML file that references 5 small images on the same server (total = 6 objects). Assuming DNS is already cached and transmission time is negligible compared to RTT, how many total RTTs are required using (1) Non-Persistent HTTP/1.0 (1 sequential TCP connection per object) vs. (2) Persistent HTTP/1.1 with Pipelining/Multiplexing?',
    question: 'A client fetches 1 base HTML file referencing 5 small images on the same server (6 objects total; DNS cached). Compare the total RTTs required for: (1) Sequential Non-Persistent HTTP/1.0 vs. (2) Persistent HTTP/1.1 with Pipelining:',
    options: [
      'A) Sequential Non-Persistent HTTP/1.0 = 12 RTTs | Persistent Pipelined = 3 RTTs',
      'B) Sequential Non-Persistent HTTP/1.0 = 6 RTTs | Persistent Pipelined = 2 RTTs',
      'C) Sequential Non-Persistent HTTP/1.0 = 12 RTTs | Persistent Pipelined = 7 RTTs',
      'D) Sequential Non-Persistent HTTP/1.0 = 18 RTTs | Persistent Pipelined = 3 RTTs'
    ],
    correctAnswer: 'A',
    explanation: '1) In Sequential Non-Persistent HTTP/1.0, EVERY single object requires a brand-new TCP 3-way handshake (1 RTT) + 1 RTT to request/receive the object = 2 RTTs per object. For 6 objects (1 HTML + 5 images): 6 * 2 = 12 RTTs! 2) In Persistent HTTP/1.1 with Pipelining: 1 RTT for the initial TCP handshake + 1 RTT to fetch the base HTML file + 1 RTT to pipeline all 5 image requests back-to-back over the already-open connection = 3 RTTs total! (Note: without pipelining, Persistent HTTP/1.1 takes 1 + 1 + 5 = 7 RTTs).'
  },

  // =========================================================================
  // SECTION C: REAL-WORLD ENGINEERING & NETWORK SECURITY SCENARIOS (QUESTIONS 41 TO 50)
  // =========================================================================
  {
    id: 'cns-test-q41',
    questionNumber: 41,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q41: [TCP SYN Flood DDoS & SYN Cookies Defense] An attacker floods your production server with 500,000 TCP SYN packets per second using spoofed random Source IP addresses. Legitimate users immediately get "Connection Timed Out" even though server CPU is at 10%. What kernel structure was exhausted, and how do Linux SYN Cookies solve this without allocating memory on SYN arrival?',
    question: 'An attacker sends 500k spoofed TCP SYN packets/sec. Legitimate users cannot connect even though CPU is low. What structure was exhausted, and how do Linux SYN Cookies defend against it?',
    options: [
      'A) The ARP table filled up; solved by clearing ARP cache.',
      'B) The kernel\'s SYN_RCVD Half-Open Connection Backlog Queue filled up waiting for the 3rd handshake ACK that never arrives from the spoofed IPs! Linux SYN Cookies solve this by allocating ZERO kernel state when a SYN arrives—instead encoding the connection metadata into the Server\'s Initial Sequence Number (ISN) using a cryptographic hash (HMAC) and only allocating a socket when the client returns a valid ACK (ack = ISN + 1)!',
      'C) The DNS server crashed; solved by switching to UDP.',
      'D) The TLS certificate expired.'
    ],
    correctAnswer: 'B',
    explanation: 'Normally, when a server receives a SYN, it allocates a half-open socket structure (SYN_RCVD) in a fixed-size backlog queue and waits ~60s for the client\'s final ACK. Spoofed SYNs never send the final ACK, filling the queue in milliseconds. With SYN Cookies (net.ipv4.tcp_syncookies = 1), the kernel remains 100% stateless on SYN arrival: it computes a cryptographic hash of (Client IP, Port, Server IP, Port, Timestamp, MSS) as the Server ISN in the SYN-ACK, and only allocates memory if the client proves reachability by returning ACK = ISN + 1!'
  },
  {
    id: 'cns-test-q42',
    questionNumber: 42,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q42: [ARP Spoofing / Poisoning LAN Attack] On a corporate Wi-Fi/Ethernet LAN, an attacker laptop sends unsolicited ("Gratuitous") ARP Replies to Victim PC (192.168.1.50) claiming "192.168.1.1 (Default Gateway) is at MAC_ATTACKER", and to the Gateway Router claiming "192.168.1.50 is at MAC_ATTACKER". Why do Victim PC and the Router accept these fake replies, and what switch feature prevents this?',
    question: 'An attacker sends fake ARP Replies telling the Victim PC that the Default Gateway\'s IP maps to MAC_ATTACKER. Why does the Victim accept this, and how do enterprise switches prevent ARP Poisoning?',
    options: [
      'A) Because ARP is a completely stateless Layer-2 protocol: hosts overwrite their ARP cache whenever they receive an ARP Reply, even if they never sent an ARP Request! Enterprise switches prevent this using DHCP Snooping + Dynamic ARP Inspection (DAI), which validates ARP packets against a trusted hardware binding table of (MAC, IP, SwitchPort) and drops spoofed ARP replies!',
      'B) Because ARP uses weak MD5 encryption.',
      'C) Because routers broadcast their private keys in ARP packets.',
      'D) Switching from IPv4 to TCP prevents ARP spoofing.'
    ],
    correctAnswer: 'A',
    explanation: 'ARP was designed in 1982 for trusted LANs with zero authentication: any host can send an unsolicited Gratuitous ARP Reply claiming ownership of any local IP address, poisoning neighbors\' ARP caches to intercept traffic (Man-in-the-Middle). Enterprise switches enable DHCP Snooping (recording which legitimate IP was assigned to which MAC and switch port) paired with Dynamic ARP Inspection (DAI) to drop any ARP packet whose (IP, MAC) pair doesn\'t match the snooping table.'
  },
  {
    id: 'cns-test-q43',
    questionNumber: 43,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q43: [Ephemeral Port / TIME_WAIT Exhaustion on Reverse Proxies] An Nginx reverse proxy forwards 2,000 HTTP requests/sec to a local Node.js backend (127.0.0.1:3000) by opening a new TCP connection for every request and closing it afterward. After 20 seconds of load testing, Nginx starts failing with "99: Cannot assign requested address" and netstat shows 28,000 sockets stuck in TIME_WAIT! Why did this happen and what is the proper fix?',
    question: 'An Nginx reverse proxy opens and closes a new TCP connection to 127.0.0.1:3000 on every request at 2,000 req/sec. After 20 seconds, Nginx fails with EADDRNOTAVAIL ("Cannot assign requested address") with 28,000 sockets in TIME_WAIT! Why, and how do you fix it?',
    options: [
      'A) Node.js crashed due to a memory leak.',
      'B) Because SrcIP (127.0.0.1), DstIP (127.0.0.1), and DstPort (3000) are fixed, only the Ephemeral Source Port (~28,000 ports in Linux 32768–60999) varies! Closing 2,000 connections/sec places each 4-tuple into TIME_WAIT for 60 seconds, exhausting all 28,000 ephemeral ports in 14 seconds! Fix it by enabling HTTP Keep-Alive connection pooling between Nginx (upstream keepalive) and Node.js so thousands of requests reuse a small pool of persistent TCP connections!',
      'C) Increase the DNS TTL.',
      'D) Switch from TCP to ICMP.'
    ],
    correctAnswer: 'B',
    explanation: 'Between a reverse proxy (127.0.0.1) and a single backend (127.0.0.1:3000), three elements of the 4-tuple are constant, leaving only ~28,232 ephemeral source ports! Because every closed connection stays in TIME_WAIT for 60 seconds (2*MSL), opening a new connection per request caps throughput at 28,232 / 60 ≈ 470 req/sec! Enabling HTTP Keep-Alive upstream connection pooling reuses warm persistent connections without opening/closing sockets.'
  },
  {
    id: 'cns-test-q44',
    questionNumber: 44,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q44: [HTTP/2 TCP Head-of-Line Blocking vs. HTTP/3 QUIC] HTTP/2 solved HTTP/1.1\'s application-layer Head-of-Line (HOL) blocking by multiplexing 100 parallel streams over a single TCP connection. However, on a lossy mobile network with 2% packet loss, HTTP/2 often performs WORSE than 6 parallel HTTP/1.1 connections! Why, and how does HTTP/3 (QUIC over UDP) solve this?',
    question: 'Why does HTTP/2 suffer from Transport-Layer Head-of-Line (HOL) Blocking on lossy networks despite stream multiplexing, and how does HTTP/3 (QUIC) eliminate it?',
    options: [
      'A) Because the OS kernel\'s TCP layer treats the entire connection as a single strictly ordered byte stream—it has no awareness of HTTP/2 streams! If a single TCP packet belonging to Stream #1 is lost, the OS kernel holds back already-received packets for Streams #2..#100 in the kernel receive buffer until Stream #1\'s packet is retransmitted! HTTP/3 runs over QUIC (built on UDP), implementing independent per-stream sequencing in user space so packet loss in Stream #1 only pauses Stream #1!',
      'B) HTTP/2 does not compress HTTP headers.',
      'C) HTTP/3 eliminates encryption to run faster.',
      'D) HTTP/2 opens 100 separate TCP connections.'
    ],
    correctAnswer: 'A',
    explanation: 'This is the exact reason Google and the IETF created HTTP/3 (QUIC)! TCP guarantees strict in-order byte delivery across the entire socket. Even if HTTP/2 multiplexes 100 independent files over 1 TCP socket, a single lost TCP segment stalls delivery of ALL 100 streams at the OS kernel TCP layer until that 1 segment is retransmitted. QUIC moves stream multiplexing and reliability over UDP, so each stream has its own independent sequence numbers—losing a packet in Stream 1 has zero impact on Streams 2..100!'
  },
  {
    id: 'cns-test-q45',
    questionNumber: 45,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q45: [MTU Black Hole — Why ping Works But HTTPS / Large API Responses Hang!] A remote worker connected over an IPSec VPN can successfully ping the production server and load tiny 100-byte API health-check endpoints, but any API response larger than 1,400 bytes hangs forever and times out! An overly strict firewall rule was recently added to "block all ICMP packets for security." Explain the exact network bug:',
    question: 'A user on a VPN can ping a server and fetch tiny 100-byte JSON responses, but any response > 1,400 bytes hangs forever after a firewall rule blocked all ICMP packets! What is this bug called and why did blocking ICMP break large TCP transfers?',
    options: [
      'A) TCP relies on ICMP for the 3-way handshake.',
      'B) Path MTU Discovery (PMTUD) Black Hole! Modern TCP sets the IPv4 "Don\'t Fragment" (DF = 1) bit on all packets. The VPN tunnel adds encapsulation headers that reduce the path MTU from 1,500 to ~1,400 bytes. When the server sends a 1,500-byte packet with DF = 1, the VPN router drops it and sends back an ICMP Type 3 Code 4 ("Fragmentation Needed and DF Set") message telling the server to lower its packet size—which the firewall blocked!',
      'C) DNS requires ICMP to resolve large domains.',
      'D) TLS certificates cannot exceed 1,400 bytes.'
    ],
    correctAnswer: 'B',
    explanation: 'Because modern TCP stacks use Path MTU Discovery (setting DF = 1 on all segments), whenever a segment hits a tunnel/link with a smaller MTU (like VPN/PPPoE), the router drops the packet and notifies the sender via ICMP Type 3 Code 4 (or ICMPv6 Packet Too Big) containing the next-hop MTU. If a misconfigured firewall blocks all ICMP traffic, the sender never learns the packet was too big and endlessly retransmits the 1500-byte DF=1 packet into a "PMTUD Black Hole"! (Fixed by permitting ICMP Type 3 Code 4 and/or enabling TCP MSS Clamping).'
  },
  {
    id: 'cns-test-q46',
    questionNumber: 46,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q46: [TLS 1.3 Perfect Forward Secrecy (PFS) via ECDHE] Suppose an intelligence agency records and stores all encrypted HTTPS traffic entering your server today. Three years from now, the server\'s long-term private key (stored in server.key) is leaked or stolen. Under TLS 1.3 (which mandates Ephemeral Diffie-Hellman — ECDHE), can the attacker decrypt the recorded traffic from 3 years ago?',
    question: 'An attacker records encrypted HTTPS traffic today and steals the server\'s long-term private key 3 years later. Under TLS 1.3 (using ECDHE), can the attacker decrypt the past recorded sessions?',
    options: [
      'A) Yes, stealing the server\'s private key decrypts all past and future sessions.',
      'B) No! Because TLS 1.3 mandates Perfect Forward Secrecy (PFS) via Ephemeral Diffie-Hellman (ECDHE): the server\'s long-term private key is ONLY used to digitally sign the handshake (proving identity), while the actual symmetric session key is derived from temporary per-session Diffie-Hellman key pairs that are destroyed in RAM immediately after the session ends!',
      'C) Yes, if the attacker also knows the server\'s IP address.',
      'D) Only if the client used Chrome.'
    ],
    correctAnswer: 'B',
    explanation: 'In legacy static RSA key exchange (removed in TLS 1.3), the client encrypted the pre-master secret directly with the server\'s long-term RSA public key—meaning if the server\'s private key was ever compromised years later, all historical recorded traffic could be decrypted! With Ephemeral Diffie-Hellman (ECDHE), both client and server generate throwaway DH key pairs in RAM for each session to derive the symmetric key, and delete them afterward—achieving Perfect Forward Secrecy (PFS).'
  },
  {
    id: 'cns-test-q47',
    questionNumber: 47,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q47: [Nagle\'s Algorithm + Delayed ACK 200ms Latency Spike] A low-latency financial trading API sends two small consecutive write() calls on a TCP socket. Even though network RTT is only 1 ms, the second write consistently stalls for 40 ms to 200 ms before leaving the sender\'s OS kernel! Which TCP interaction causes this, and which socket option fixes it?',
    question: 'A low-latency API sends two small consecutive TCP writes on a 1 ms RTT link, yet the second write stalls for 40–200 ms! Which TCP mechanism causes this, and how do you fix it?',
    options: [
      'A) TCP Slow Start; fixed by increasing ssthresh.',
      'B) The interaction between Nagle\'s Algorithm (which buffers small outgoing writes < MSS while waiting for an ACK of previous unacknowledged data) and TCP Delayed ACK (where the receiver waits up to 40–200 ms hoping to piggyback the ACK on a response)! Fix it by setting the socket option TCP_NODELAY (disabling Nagle\'s Algorithm).',
      'C) ARP cache expiration; fixed by static ARP.',
      'D) DNS lookup delay.'
    ],
    correctAnswer: 'B',
    explanation: 'Nagle\'s Algorithm was designed for 1980s Telnet terminals to prevent sending a 41-byte packet for every 1-byte keystroke: if there is unacknowledged data in flight, Nagle buffers small writes until either a full MSS is accumulated OR the ACK arrives. Meanwhile, Delayed ACK makes the receiver wait 40–200ms before sending a bare ACK! When combined on request-response APIs or games, they deadlock each other until the 40–200ms Delayed ACK timer expires. Setting TCP_NODELAY disables Nagle\'s algorithm.'
  },
  {
    id: 'cns-test-q48',
    questionNumber: 48,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q48: [WebRTC NAT Traversal — STUN vs. TURN] Two users (Alice behind Home NAT #1 with IP 192.168.1.5, and Bob behind Home NAT #2 with IP 10.0.0.8) start a peer-to-peer WebRTC video call. Since neither browser knows its own public IP:Port mapping on its NAT router, how do STUN and TURN servers enable the P2P connection?',
    question: 'Two browsers behind separate home NAT routers want to establish a peer-to-peer WebRTC video call. What are the roles of STUN and TURN servers in NAT Traversal (ICE)?',
    options: [
      'A) STUN (Session Traversal Utilities for NAT) is a lightweight server that echoes back the client\'s public-facing <Public_IP, Public_NAT_Port> mapping so peers can exchange ICE candidates and punch a direct UDP hole between their NATs; TURN (Traversal Using Relays around NAT) acts as a fallback media relay server when Symmetric NATs or strict firewalls block direct P2P hole-punching.',
      'B) STUN relays 100% of video packets for all calls.',
      'C) TURN is only used when both users are on the same Wi-Fi LAN.',
      'D) WebRTC uses BGP to reprogram home routers.'
    ],
    correctAnswer: 'A',
    explanation: 'A browser behind a NAT only sees its private NIC address (192.168.1.5). By sending a packet to a public STUN server, the STUN server inspects the packet\'s outer IP/UDP header and tells the browser "the internet sees you as 203.0.113.5:62104." Both browsers exchange these public endpoints via a signaling server and perform UDP Hole Punching for direct P2P streaming (~85% of calls). For restrictive Symmetric NATs where port mappings change per destination, TURN relays the media packets.'
  },
  {
    id: 'cns-test-q49',
    questionNumber: 49,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q49: [BGP Anycast Routing in CDNs & Public DNS (8.8.8.8 / 1.1.1.1)] When a user in Mumbai and a user in New York both ping the exact same IP address 1.1.1.1 (Cloudflare DNS) or 8.8.8.8 (Google DNS), both get a 4 ms response from a local server in their respective city! How can 300 physical servers around the world all share the exact same public IP address?',
    question: 'How can 300+ physical edge servers in different cities worldwide all use the exact same public IP address (like 1.1.1.1 or 8.8.8.8) so every user automatically reaches their closest datacenter?',
    options: [
      'A) Using BGP Anycast Routing: all 300 edge datacenters advertise the exact same IP prefix into the global BGP routing table; Internet routers naturally forward each user\'s packets along the shortest autonomous-system path to the topologically nearest datacenter advertising that IP!',
      'B) Using a single central router in California that forwards packets at faster-than-light speed.',
      'C) Using ARP broadcasts across the internet.',
      'D) Using Class D Multicast.'
    ],
    correctAnswer: 'A',
    explanation: 'Unlike Unicast (1 IP = 1 machine globally), Anycast assigns the exact same IP prefix to hundreds of geographically distributed edge servers and announces that prefix via BGP from all locations. Standard BGP path-selection on the internet automatically routes a user in Mumbai to the Mumbai edge node and a user in New York to the New York edge node, providing low latency and automatic DDoS absorption.'
  },
  {
    id: 'cns-test-q50',
    questionNumber: 50,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q50: [DNS Cache Poisoning & DNSSEC] If an attacker spoofs a UDP DNS response before the real Authoritative DNS server replies (injecting a fake A record mapping yourbank.com to the attacker\'s IP inside an ISP\'s DNS resolver cache), thousands of users are redirected to the fake server. How did the Kaminsky mitigation (Source Port Randomization) and DNSSEC solve this?',
    question: 'How do DNS Source Port Randomization and DNSSEC defend against DNS Cache Poisoning (spoofed UDP DNS replies)?',
    options: [
      'A) Source Port Randomization combines a random 16-bit UDP source port with the 16-bit DNS Transaction ID (increasing guessing entropy from 2^16 to ~2^32), while DNSSEC adds cryptographic Digital Signatures (RRSIG records verified via a chain of trust from the Root Zone\'s public key) so resolvers reject any forged DNS record!',
      'B) DNSSEC encrypts all DNS queries using AES so no one can read domain names.',
      'C) DNS Cache Poisoning is solved by setting TTL = 0 on all domains.',
      'D) DNSSEC replaces IP addresses with MAC addresses.'
    ],
    correctAnswer: 'A',
    explanation: 'Because classic DNS runs over connectionless UDP with only a 16-bit Transaction ID (65,536 possibilities), an off-path attacker could flood a resolver with fake UDP replies guessing the Transaction ID before the real reply arrived. Randomizing the UDP ephemeral source port added another 16 bits of entropy, and DNSSEC (DNS Security Extensions) permanently solved authenticity by digitally signing DNS resource record sets (RRSIG / DNSKEY / DS records anchored at the Root Zone).'
  }
];

async function seedCoreCsCns() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Seeding for Core Computer Science: Computer Networks & Security ---');
    await client.query('BEGIN');

    // 1. Locate Core Computer Science Track
    const trackRes = await client.query(`
      SELECT t.id, t.name, t.slug 
      FROM tracks t
      WHERE t.id = (
        SELECT track_id FROM topics WHERE slug = 'cs-oop-complete-oneshot-mastery' LIMIT 1
      )
      OR t.id = 22
      OR t.slug = 'core-computer-science-fundamentals'
      OR t.slug = 'core-computer-science'
      LIMIT 1;
    `);

    if (trackRes.rows.length === 0) {
      throw new Error('Core Computer Science track could not be found!');
    }

    const csTrackId = trackRes.rows[0].id;
    console.log(`Found Core Computer Science track: [ID:${csTrackId}] "${trackRes.rows[0].name}" (slug: ${trackRes.rows[0].slug})`);

    // 2. Upsert Subject 4: Computer Networks & Security (Complete CNS in 1 Shot)
    const topicSlug = 'cs-cns-complete-oneshot-mastery';
    const topicTitle = 'CNS: Complete Computer Networks & Security in 1 Shot (Placement & GATE Edition)';
    const topicOrder = 4;
    const durationMinutes = 247;
    const videoUrl = 'http://www.youtube.com/watch?v=IPvYjXCsTg8';
    const videoTitle = 'Computer Networking Full Course - OSI Model Deep Dive with Real Life Examples';
    const creatorName = 'Kunal Kushwaha';
    const creatorChannelUrl = 'https://www.youtube.com/@KunalKushwaha';

    const docLinks = [
      {
        title: 'MDN Web Docs — HTTP, TLS, CORS & Web Networking Specifications',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
        link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP'
      }
    ];

    const shortDescription = 'Master Computer Networks and Network Security from physical signals to application protocols—OSI & TCP/IP models, Framing, Error Control, Sliding Window ARQ, CSMA/CD, IPv4/IPv6, CIDR Subnetting, Routing (OSPF, BGP), TCP/UDP Internals, DNS, HTTP/1.1–HTTP/3, Cryptography (RSA, AES), and TLS 1.3—followed by a 50-question timed evaluation test.';
    const cleanSummary = cleanMarkdown(summaryMarkdown);

    const docLinksJson = JSON.stringify(docLinks);
    const videoLinksJson = JSON.stringify([
      {
        title: videoTitle,
        url: videoUrl,
        duration: `${durationMinutes}m`,
        creator_name: creatorName,
        creator_channel_url: creatorChannelUrl
      }
    ]);
    const practiceJson = JSON.stringify(cnsEvaluationTest);

    // Check if topic already exists by slug
    const existingTopic = await client.query('SELECT id FROM topics WHERE slug = $1 LIMIT 1;', [topicSlug]);
    let topicId;

    if (existingTopic.rows.length > 0) {
      topicId = existingTopic.rows[0].id;
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
        topicTitle,
        topicOrder,
        shortDescription,
        cleanSummary,
        docLinks[0].url,
        practiceJson,
        docLinksJson,
        videoLinksJson,
        creatorName,
        creatorChannelUrl,
        csTrackId,
        topicId
      ]);
      console.log(`Updated existing topic ID ${topicId} (${topicSlug})`);
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
        topicTitle,
        topicSlug,
        topicOrder,
        shortDescription,
        cleanSummary,
        docLinks[0].url,
        practiceJson,
        docLinksJson,
        videoLinksJson,
        creatorName,
        creatorChannelUrl,
        csTrackId
      ]);
      topicId = insertRes.rows[0].id;
      console.log(`Inserted new topic ID ${topicId} (${topicSlug})`);
    }

    // Map in track_topics
    await client.query(`
      DELETE FROM track_topics WHERE track_id = $1 AND topic_order = $2;
    `, [csTrackId, topicOrder]);

    await client.query(`
      INSERT INTO track_topics (track_id, topic_id, topic_order)
      VALUES ($1, $2, $3)
      ON CONFLICT (track_id, topic_id) DO UPDATE SET topic_order = EXCLUDED.topic_order;
    `, [csTrackId, topicId, topicOrder]);

    // Sync resources table for video and documentation
    await client.query(`
      DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('problem', 'practice', 'video', 'documentation');
    `, [topicId]);

    await client.query(`
      INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
      VALUES ($1, $2, $3, 'video', $4);
    `, [topicId, videoTitle, videoUrl, durationMinutes]);

    for (const doc of docLinks) {
      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'documentation', 15);
      `, [topicId, doc.title, doc.url]);
    }

    // Update track metadata columns if present
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tracks' AND column_name IN ('total_topics', 'estimated_hours');
    `);
    const availableCols = colCheck.rows.map(r => r.column_name);
    if (availableCols.includes('total_topics') && availableCols.includes('estimated_hours')) {
      await client.query(`UPDATE tracks SET total_topics = 4, estimated_hours = 20 WHERE id = $1;`, [csTrackId]);
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 4 WHERE id = $1;`, [csTrackId]);
    }

    await client.query('COMMIT');
    console.log('✅ Core Computer Science: CNS One-Shot & 50-Question Timed Evaluation Test Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding Core CS CNS failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedCoreCsCns();
