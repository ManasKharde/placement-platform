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

const summaryMarkdown = `### 📌 1. What Is an Operating System, Dual-Mode Protection & Booting Sequence
An **Operating System (OS)** is the system software layer between hardware (CPU, RAM, Disk, I/O devices) and user applications, acting as a **Resource Manager (Allocator)** and **Control Program** so no single application can monopolize or crash the machine.
* **Dual-Mode Operation (Hardware Mode Bit):**
  * **User Mode (\`Mode Bit = 1\`):** Applications execute with restricted privileges and cannot directly access hardware I/O ports, alter page tables, or disable interrupts.
  * **Kernel / Supervisor Mode (\`Mode Bit = 0\`):** Full access to execute **Privileged Instructions**. Transitioning from User Mode to Kernel Mode occurs via a **System Call (\`trap\` / software interrupt)**, which flips the mode bit to \`0\`, executes the kernel handler, and resets the bit to \`1\` on return.
* **Kernel Architectures:**
  * **Monolithic Kernel (Linux, Unix):** Scheduling, file systems, device drivers, and memory management all run in Kernel Space (fast direct function calls, but a buggy driver can crash the kernel).
  * **Microkernel (Mach, QNX, Minix):** Only minimal essentials (IPC, basic scheduling, virtual memory) run in Kernel Space; file systems and device drivers run as isolated User-Space servers (high reliability and security, but higher IPC message-passing overhead).
* **System Boot Sequence:** Power On -> **BIOS / UEFI** (stored in non-volatile ROM/Flash) runs **POST (Power-On Self-Test)** -> reads **MBR / GPT** boot sector -> loads **Bootloader (GRUB)** -> loads **OS Kernel** into RAM -> Kernel spawns initial user-space process (**\`init\` / \`systemd\`, PID = 1**).

### 💡 2. Processes, PCB, 7-State Lifecycle, \`fork()\` & Threads
* **Program vs. Process:** A **Program** is a passive executable file on disk; a **Process** is an active program in execution residing in RAM with its own **4 memory segments**: **Text/Code**, **Data/BSS** (global & static variables), **Heap** (dynamic allocations growing upward), and **Stack** (local variables & function frames growing downward).
* **Process Control Block (PCB / \`task_struct\`):** Kernel data structure storing a process's **PID**, **Process State**, **Program Counter (PC)**, **CPU Registers**, **Scheduling Priority**, **Page Table Pointer**, and **Open File Descriptor Table**.
* **7-State Process Lifecycle & Schedulers:**
  * **New** $\\rightarrow$ (*Long-Term Job Scheduler*) $\\rightarrow$ **Ready** (in RAM) $\\leftrightarrow$ (*Short-Term CPU Scheduler / Dispatcher*) $\\leftrightarrow$ **Running** $\\rightarrow$ **Terminated**.
  * If a running process requests I/O, it moves to **Waiting / Blocked** (in RAM).
  * **Medium-Term Scheduler (Swapper):** Swaps inactive processes from RAM to Disk Swap Space (**Suspend Ready** and **Suspend Blocked**) to control the **Degree of Multiprogramming**.
* **Process Creation (\`fork()\` & \`exec()\`), Zombie & Orphan Processes:**
  * Calling \`fork()\` duplicates the calling process using **Copy-on-Write (CoW)** (parent and child share physical RAM pages marked read-only until either modifies a page). Returns **\`0\` to the Child** and **\`child_PID (> 0)\` to the Parent**.
  * **Zombie Process (\`<defunct>\`):** A child that has finished execution (\`exit()\`), but whose parent has not yet called **\`wait()\` / \`waitpid()\`** to read its exit status—so its PCB entry remains in the kernel process table consuming a PID!
  * **Orphan Process:** A child whose parent terminated before the child finished; immediately adopted by **\`init\` / \`systemd\` (PID 1)**, which periodically calls \`wait()\` to reap it cleanly.
* **Threads (Lightweight Processes):**
  * Threads within the same process **SHARE** the **Code Segment**, **Data Segment**, **Heap**, and **Open Files**, while each thread maintains its **OWN private Stack, CPU Registers, and Program Counter**!
  * Switching between threads of the same process is much faster than switching between processes because **the virtual address space (Page Table & TLB) does not need to be flushed**.

### 💡 3. CPU Scheduling Algorithms & Performance Metrics
* **Core Formulas:**
  * **Turnaround Time ($\\text{TAT}$):** $\\text{Completion Time (CT)} - \\text{Arrival Time (AT)}$
  * **Waiting Time ($\\text{WT}$):** $\\text{Turnaround Time (TAT)} - \\text{Burst Time (BT)}$
  * **Response Time ($\\text{RT}$):** $\\text{CPU First Allocation Time} - \\text{Arrival Time (AT)}$
* **Algorithm Comparison:**
  * **FCFS (First-Come, First-Served):** Non-preemptive. Suffers from the **Convoy Effect** (short I/O-bound processes stuck behind one long CPU-bound process).
  * **SJF (Shortest Job First) / SRTF (Shortest Remaining Time First):** Provably **optimal (minimum) Average Waiting Time**, but suffers from **Starvation** of long processes and requires predicting future burst times via **Exponential Averaging**: $\\tau_{n+1} = \\alpha t_n + (1 - \\alpha)\\tau_n$.
  * **Priority Scheduling:** Can be preemptive or non-preemptive. Solves starvation using **Aging** (gradually increasing the priority of processes waiting for a long time).
  * **Round Robin (RR):** Preemptive FCFS with a fixed **Time Quantum ($Q$)**. Optimal for time-sharing interactive systems (low Response Time). If $Q$ is too large, RR degenerates to FCFS; if $Q$ is too small, **Context Switch overhead** dominates CPU time.
  * **Highest Response Ratio Next (HRRN):** Non-preemptive policy that prevents starvation automatically by scheduling the process with maximum **Response Ratio**:
    $$\\text{Response Ratio} = \\frac{W + S}{S} = 1 + \\frac{\\text{Waiting Time}}{\\text{Burst Time}}$$

### 💡 4. Process Synchronization, Semaphores & Classic Concurrency Problems
* **Critical Section Problem (3 Mandatory Conditions):**
  1. **Mutual Exclusion:** At most 1 process can execute inside its Critical Section (CS) at any instant.
  2. **Progress:** If no process is in the CS and some wish to enter, only processes not in their Remainder Section participate in deciding who enters next, and the decision cannot be postponed indefinitely.
  3. **Bounded Waiting:** There exists an upper bound on the number of times other processes are allowed to enter their CS after a process has made a request to enter its CS (prevents starvation).
* **Peterson's 2-Process Software Solution (\`flag[2]\` and \`turn\`):** Satisfies all 3 conditions (Mutual Exclusion, Progress, Bounded Waiting) on sequential-consistency architectures.
* **Hardware Atomic Instructions:** \`TestAndSet(&lock)\` and \`CompareAndSwap(&val, expected, new_val)\` execute atomically in a single CPU bus cycle.
* **Mutex vs. Semaphore (\`P/wait\` and \`V/signal\`):**
  * **Mutex (Lock Ownership):** Only the exact thread that locked the mutex is permitted to unlock it!
  * **Semaphore (Signaling Mechanism):** An integer variable accessed via atomic \`wait(S)\` ($S\\text{--}$, block if $<0$) and \`signal(S)\` ($S\\text{++}$, wake a blocked process if $\\le 0$). Any thread can call \`signal(S)\`.

\`\`\`c
// Classic Bounded-Buffer Producer Synchronization using 3 Semaphores:
// mutex = 1 (binary), empty = N (counting), full = 0 (counting)
void producer() {
  while (true) {
    Item item = produceItem();
    wait(empty); // MUST wait on 'empty' BEFORE acquiring 'mutex' to avoid deadlock!
    wait(mutex);
    insertIntoBuffer(item);
    signal(mutex);
    signal(full);
  }
}
\`\`\`

### 💡 5. Deadlocks: Coffman Conditions, RAG & Banker's Algorithm
* **The 4 Necessary Coffman Conditions for Deadlock:**
  1. **Mutual Exclusion:** At least one resource is held in a non-shareable mode.
  2. **Hold and Wait:** A process holding at least one resource is waiting to acquire additional resources held by other processes.
  3. **No Preemption:** Resources cannot be forcibly preempted; they can only be released voluntarily by the holding process.
  4. **Circular Wait:** A closed chain of processes $\\{P_0, P_1, \\dots, P_n\\}$ exists where $P_0$ waits for $P_1$, ..., and $P_n$ waits for $P_0$.
* **Resource Allocation Graph (RAG):**
  * **Single Instance per Resource Type:** A cycle in the RAG is **both a Necessary AND Sufficient** condition for Deadlock.
  * **Multiple Instances per Resource Type:** A cycle is a **Necessary but NOT Sufficient** condition for Deadlock.
* **Banker's Algorithm (Deadlock Avoidance — Dijkstra):**
  * Maintains matrices **\`Max\`**, **\`Allocation\`**, **\`Need\` ($\\text{Need}[i] = \\text{Max}[i] - \\text{Allocation}[i]$)**, and vector **\`Available\`**.
  * Checks whether granting a request leaves the system in a **Safe State** (where a **Safe Sequence** $\\langle P_{i_1}, P_{i_2}, \\dots, P_{i_n} \\rangle$ exists such that $\\text{Need}[i] \\le \\text{Work}$ at each step). Note: An **Unsafe State** does not mean the system is currently deadlocked, only that a deadlock *could* occur if processes request their maximum claims!

### 💡 6. Memory Management: Paging, TLB, Virtual Memory & Page Replacement
* **Fragmentation:**
  * **External Fragmentation:** Total free RAM is enough to satisfy a request, but it is broken into non-contiguous holes (occurs in Variable-Partition Contiguous Allocation & Segmentation; solved by **Compaction** or **Paging**).
  * **Internal Fragmentation:** Allocated memory block is slightly larger than requested, wasting space *inside* the partition/page (occurs in Fixed Partitioning and **last page of Paging**; average waste per process = $\\frac{\\text{Page Size}}{2}$).
* **Paging & Address Translation Math:**
  * Logical Address ($m$ bits) is split into **Page Number ($p = m - d$ bits)** and **Page Offset ($d$ bits, where $\\text{Page Size} = 2^d$ bytes)**.
  * **Effective Memory Access Time ($\\text{EMAT}$) with TLB Hit Ratio $\\alpha$:**
    $$\\text{EMAT} = \\alpha(T_{\\text{TLB}} + T_{\\text{RAM}}) + (1 - \\alpha)(T_{\\text{TLB}} + 2 \\cdot T_{\\text{RAM}})$$
    *(for a 1-level page table where a TLB miss requires 1 RAM access for the Page Table + 1 RAM access for the data word).*
* **Virtual Memory, Demand Paging & Page Replacement:**
  * **FIFO:** Replaces the oldest loaded page. Suffers from **Belady's Anomaly** (increasing the number of allocated physical frames can *increase* the number of page faults, e.g., reference string \`1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5\` gives 9 faults with 3 frames vs. 10 faults with 4 frames!).
  * **Optimal (OPT / Belady's Min):** Replaces the page that will not be used for the longest time in the future (lowest possible page faults; theoretical benchmark).
  * **LRU (Least Recently Used) & Clock (Second-Chance):** Replaces the page whose last use is furthest in the past. Both OPT and LRU are **Stack Algorithms** ($S_k \\subseteq S_{k+1}$) and **never suffer from Belady's Anomaly**.
  * **Thrashing:** Occurs when processes lack enough frames to hold their active **Working Set** (pages used in window $\\Delta$), spending more time paging to/from disk than executing on the CPU.

### 💡 7. Disk Scheduling & Unix File System (\`inode\`) Internals
* **Disk Access Time:** $\\text{Seek Time}$ (moving read/write arm to cylinder — slowest!) $+ \\text{Rotational Latency}$ ($\\frac{1}{2 \\cdot \\text{RPS}}$) $+ \\text{Transfer Time}$.
* **Disk Scheduling Algorithms:** **FCFS** (fair, high seek time) $\\rightarrow$ **SSTF** (Shortest Seek Time First — greedy, can starve distant tracks) $\\rightarrow$ **SCAN (Elevator)** (moves to end of disk \`0\` or \`max\`, then reverses) $\\rightarrow$ **C-SCAN** (services in one direction only, jumps back to start for uniform wait time) $\\rightarrow$ **LOOK / C-LOOK** (reverses/jumps at the last requested cylinder instead of going all the way to the physical disk end).
* **Unix \`inode\` File Allocation:** Stores file metadata (permissions, size, reference link count) + **12 Direct Block Pointers**, **1 Singly Indirect Pointer**, **1 Doubly Indirect Pointer**, and **1 Triply Indirect Pointer**—providing $O(1)$ access for small files and massive capacity for multi-terabyte files.`;

const osEvaluationTest = [
  // =========================================================================
  // SECTION A: THEORY & CONCEPT APPLICATION (QUESTIONS 1 TO 25)
  // =========================================================================
  {
    id: 'os-test-q1',
    questionNumber: 1,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q1: Which of the following instructions is a Privileged Instruction that can ONLY be executed when the CPU hardware Mode Bit is 0 (Kernel Mode)?',
    question: 'Which of the following operations is a Privileged Instruction that can ONLY be executed when the CPU hardware Mode Bit is 0 (Kernel Mode), and will trigger a hardware trap if attempted in User Mode (Mode Bit = 1)?',
    options: [
      'A) Reading the system clock or executing a user-space function call.',
      'B) Modifying the Page Table Base Register (PTBR / CR3), disabling hardware interrupts, or switching the CPU from User Mode to Kernel Mode directly without a trap instruction.',
      'C) Allocating memory inside a user-space heap free list via malloc() when brk/mmap is not invoked.',
      'D) Executing floating-point division in CPU registers.'
    ],
    correctAnswer: 'B',
    explanation: 'Modifying memory management registers (like PTBR/CR3), halting the CPU, disabling hardware interrupts, and performing direct I/O port instructions are strictly Privileged Instructions restricted to Kernel Mode (Mode Bit = 0) so a user program cannot overwrite another process\'s memory or freeze the CPU.'
  },
  {
    id: 'os-test-q2',
    questionNumber: 2,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q2: What is the fundamental architectural trade-off between a Monolithic Kernel (like Linux) and a Microkernel (like QNX / Mach)?',
    question: 'What is the fundamental architectural trade-off between a Monolithic Kernel (like Linux) and a Microkernel (like QNX / Mach)?',
    options: [
      'A) Monolithic kernels run file systems, device drivers, and IPC inside a single Kernel address space (fast direct function calls, but a buggy driver crash can bring down the whole OS), whereas Microkernels run file systems and drivers as isolated User-Space servers (high fault isolation, but higher IPC context-switch overhead).',
      'B) Microkernels cannot support virtual memory or multitasking.',
      'C) Monolithic kernels run entirely in User Mode (Mode Bit = 1).',
      'D) Microkernels are faster at system calls because they require zero context switches.'
    ],
    correctAnswer: 'A',
    explanation: 'In a Monolithic Kernel, all core OS services (scheduling, virtual memory, VFS file systems, device drivers) share the same kernel address space—making communication fast via direct C function calls, at the risk that a null-pointer dereference in a third-party driver crashes the kernel. Microkernels move file systems and drivers into separate user-space processes that communicate via IPC messages—isolating crashes at the cost of extra message-passing and context-switch overhead.'
  },
  {
    id: 'os-test-q3',
    questionNumber: 3,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q3: In a 7-state process lifecycle model, which transition is impossible, and which scheduler controls the transition from "Ready" to "Suspend Ready"?',
    question: 'In a 7-state process lifecycle model, which state transition is IMPOSSIBLE, and which scheduler controls the transition from "Ready" (in RAM) to "Suspend Ready" (on Disk Swap)?',
    options: [
      'A) Impossible transition: Waiting/Blocked -> Running directly (must go through Ready first) | Controlled by: Medium-Term Scheduler (Swapper).',
      'B) Impossible transition: Running -> Ready (on time-quantum expiration) | Controlled by: Short-Term Scheduler.',
      'C) Impossible transition: Running -> Waiting (on I/O request) | Controlled by: Long-Term Scheduler.',
      'D) Impossible transition: Suspend Blocked -> Suspend Ready (when I/O completes while swapped out) | Controlled by: Dispatcher.'
    ],
    correctAnswer: 'A',
    explanation: 'When a Blocked/Waiting process\'s I/O completes, an interrupt moves the process to the Ready queue (or from Suspend Blocked to Suspend Ready)—it can NEVER jump directly from Waiting to Running without being selected from the Ready queue by the Short-Term CPU Scheduler! Meanwhile, the Medium-Term Scheduler (Swapper) swaps processes between Ready (RAM) and Suspend Ready (Disk) to manage memory pressure.'
  },
  {
    id: 'os-test-q4',
    questionNumber: 4,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q4: What is the exact difference between a Zombie Process and an Orphan Process in Unix/Linux?',
    question: 'What is the exact difference between a Zombie Process and an Orphan Process in Unix/Linux?',
    options: [
      'A) A Zombie process is still running an infinite loop on the CPU; an Orphan process has already terminated.',
      'B) A Zombie process has completed execution via exit() (releasing its RAM), but its PCB entry remains in the process table because its parent has not yet called wait()/waitpid() to read its exit status; an Orphan process is a still-running child whose parent terminated early and is adopted by init/systemd (PID 1).',
      'C) An Orphan process leaks PIDs permanently, while a Zombie process is automatically adopted by PID 1 while still running.',
      'D) Both Zombie and Orphan processes consume 100% CPU utilization.'
    ],
    correctAnswer: 'B',
    explanation: 'When a child terminates, the kernel frees its memory and open files, but keeps its Process Control Block (PID + exit status code) in the process table as a Zombie (<defunct>) until the parent calls wait()/waitpid(). Conversely, if a parent dies while its child is still running, the child becomes an Orphan and is immediately reparented to init/systemd (PID 1), which automatically reaps it when it eventually exits.'
  },
  {
    id: 'os-test-q5',
    questionNumber: 5,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q5: When a process spawns multiple threads within the same address space, which resources are SHARED among all threads, and which resources are PRIVATE to each individual thread?',
    question: 'When a process spawns multiple threads within the same address space, which resources are SHARED among all threads, and which resources are PRIVATE to each individual thread?',
    options: [
      'A) Shared: Stack and Registers | Private: Heap, Global Variables, and Code Segment',
      'B) Shared: Code (Text) Segment, Data/BSS (Global/Static variables), Heap, and Open File Descriptors | Private: Thread Stack, CPU Registers, and Program Counter (PC)',
      'C) Shared: Program Counter and Stack Pointer | Private: Open Files and Heap',
      'D) Threads share nothing; each thread gets a separate virtual address space.'
    ],
    correctAnswer: 'B',
    explanation: 'All threads of a process execute within the same virtual address space: they share the Code segment, Data/BSS segment (global and static variables), Heap memory, and Open File Descriptor table. However, because each thread executes an independent flow of control and function call chain simultaneously, each thread MUST have its own private Stack, Program Counter (PC), and CPU Register set.'
  },
  {
    id: 'os-test-q6',
    questionNumber: 6,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q6: In a pure User-Level Thread (Many-to-One) threading model (where the OS kernel is unaware of user threads), what happens if one user thread makes a blocking system call (e.g., reading from a disk or network socket)?',
    question: 'In a pure User-Level Thread (Many-to-One) threading model (where the OS kernel is unaware of user threads), what happens if one user thread makes a blocking system call?',
    options: [
      'A) Only that specific user thread blocks, and other user threads in the same process continue running on other CPU cores.',
      'B) The entire process (including all other runnable user-level threads inside it) is blocked by the kernel, AND user-level threads in a Many-to-One model can never run in true hardware parallelism across multiple CPU cores!',
      'C) The OS kernel automatically converts the user thread into a kernel thread.',
      'D) User-level threads require a mode switch to Kernel Mode on every thread switch.'
    ],
    correctAnswer: 'B',
    explanation: 'In a Many-to-One (User-Level) threading model, thread switching is extremely fast (done entirely in user space without a kernel mode switch). However, because the OS kernel sees only a single single-threaded process PCB: (1) if any user thread invokes a blocking syscall, the kernel blocks the entire process, and (2) only one user thread can execute on a CPU core at a time.'
  },
  {
    id: 'os-test-q7',
    questionNumber: 7,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q7: Compare Shared Memory IPC and Message Passing IPC (Pipes / Message Queues) between two processes on the same machine:',
    question: 'Compare Shared Memory IPC and Message Passing IPC (Pipes / Message Queues) between two processes on the same machine:',
    options: [
      'A) Message Passing is faster for transferring gigabytes of data because it requires zero system calls.',
      'B) Shared Memory requires system calls only initially to attach the shared memory region into both processes\' page tables—after which reads/writes happen at raw RAM speed with zero kernel intervention (though user processes must synchronize access themselves); Message Passing requires a Kernel Mode system call on every send/read.',
      'C) Shared Memory automatically provides mutual exclusion without semaphores or mutexes.',
      'D) Anonymous Pipes (pipe()) can be used between completely unrelated processes without a common ancestor.'
    ],
    correctAnswer: 'B',
    explanation: 'In Message Passing (pipes, sockets, message queues), every write() and read() copies data from User Space -> Kernel Buffer -> User Space via system calls. In Shared Memory (shmget/mmap), once the kernel maps the same physical RAM frames into both processes\' virtual address spaces, subsequent reads and writes occur directly in RAM with zero kernel traps—making Shared Memory the fastest IPC mechanism for large payloads!'
  },
  {
    id: 'os-test-q8',
    questionNumber: 8,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q8: Which CPU scheduling algorithm is mathematically proven to give the MINIMUM average waiting time for a given set of processes, and why can\'t it be implemented directly in a general-purpose OS?',
    question: 'Which CPU scheduling algorithm is mathematically proven to give the MINIMUM average waiting time for a given set of processes, and why can\'t it be implemented directly in a general-purpose OS?',
    options: [
      'A) Round Robin; because choosing the optimal time quantum is NP-Hard.',
      'B) Shortest Remaining Time First (Preemptive SJF); because the OS cannot know the exact future CPU burst length of a process before it executes (so it must estimate burst times using historical exponential averaging).',
      'C) First-Come, First-Served (FCFS); because arrival times cannot be measured.',
      'D) Multilevel Queue Scheduling; because priorities cannot change.'
    ],
    correctAnswer: 'B',
    explanation: 'By moving shorter jobs ahead of longer jobs, Shortest Job First (and its preemptive version, Shortest Remaining Time First — SRTF) reduces the waiting time of short jobs by much more than it increases the waiting time of long jobs, yielding the provably minimum average waiting time. In practice, future CPU burst durations are unknown upfront and are approximated via exponential averaging.'
  },
  {
    id: 'os-test-q9',
    questionNumber: 9,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q9: Consider the naïve "Strict Alternation" two-process synchronization algorithm using a shared variable turn (where P0 waits while(turn != 0); executes CS; sets turn = 1;). Which of the 3 Critical Section requirements does Strict Alternation VIOLATE?',
    question: 'Consider the "Strict Alternation" two-process synchronization algorithm using a shared variable turn (where P0 waits while(turn != 0); executes CS; sets turn = 1;). Which of the 3 Critical Section requirements does Strict Alternation VIOLATE?',
    options: [
      'A) It violates Mutual Exclusion.',
      'B) It satisfies Mutual Exclusion and Bounded Waiting, but VIOLATES Progress (because if P1 is in its Remainder Section and does not want to enter the CS, P0 is blocked from entering the CS twice in a row when turn == 1!).',
      'C) It satisfies Mutual Exclusion and Progress, but violates Bounded Waiting.',
      'D) It satisfies all 3 conditions (Mutual Exclusion, Progress, and Bounded Waiting).'
    ],
    correctAnswer: 'B',
    explanation: 'In Strict Alternation, only one process can enter the CS when turn matches its ID, so Mutual Exclusion holds, and since they strictly alternate, Bounded Waiting (bound = 1) holds. However, the Progress condition states that a process executing inside its Remainder Section must NOT block another process from entering the CS! If P0 exits the CS and sets turn = 1 while P1 is sleeping in its Remainder Section for an hour, P0 cannot re-enter the empty CS—violating Progress!'
  },
  {
    id: 'os-test-q10',
    questionNumber: 10,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q10: When is a busy-waiting Spinlock preferred over a blocking Mutex (which puts the waiting thread to sleep via a system call)?',
    question: 'When is a busy-waiting Spinlock preferred over a blocking Mutex (which puts the waiting thread to sleep via a system call)?',
    options: [
      'A) On a single-core (uniprocessor) system when the critical section holds a lock for 500ms.',
      'B) On a multi-core (multiprocessor) system when the lock is held for an extremely short duration (shorter than the time required to perform two context switches to sleep and wake a thread!).',
      'C) Whenever a thread performs disk I/O inside the critical section.',
      'D) Spinlocks are always slower than blocking mutexes in all scenarios.'
    ],
    correctAnswer: 'B',
    explanation: 'Putting a thread to sleep and waking it up later requires two expensive Kernel Mode context switches + cache pollution (~several microseconds). On a multi-core CPU, if Thread A on Core 1 holds a lock for only 20 nanoseconds to update a pointer, Thread B spinning on Core 2 acquires the lock almost immediately without paying the cost of sleeping and waking!'
  },
  {
    id: 'os-test-q11',
    questionNumber: 11,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q11: What is the fundamental difference between a Mutex and a Binary Semaphore (initialized to 1)?',
    question: 'What is the fundamental difference between a Mutex and a Binary Semaphore (initialized to 1)?',
    options: [
      'A) A Binary Semaphore can take values greater than 1, whereas a Mutex cannot.',
      'B) A Mutex enforces strict Ownership (only the exact thread that locked the mutex can unlock it, enabling Priority Inheritance), whereas a Semaphore is a signaling mechanism with no concept of ownership (Thread A can call wait(S) and Thread B can call signal(S)).',
      'C) A Mutex can only be used between different processes, not threads.',
      'D) Binary Semaphores cannot be used for synchronization.'
    ],
    correctAnswer: 'B',
    explanation: 'A Mutex is a locking primitive with strict thread ownership: if Thread A locks a mutex, only Thread A is allowed to unlock it (attempting to unlock it from Thread B is an error). Because the OS knows which specific thread owns a Mutex, it can boost that owner thread\'s priority to prevent Priority Inversion. A Semaphore has no owner—one thread can wait(S) and another thread (or interrupt handler) can signal(S).'
  },
  {
    id: 'os-test-q12',
    questionNumber: 12,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q12: In the classic Dining Philosophers Problem with 5 philosophers and 5 chopsticks (semaphores chopstick[0..4] initialized to 1), which of the following modifications guarantees that the system is 100% Deadlock-Free?',
    question: 'In the classic Dining Philosophers Problem with 5 philosophers and 5 chopsticks, which of the following modifications guarantees that the system is 100% Deadlock-Free?\n1. Allow at most 4 philosophers to sit at the table simultaneously.\n2. Asymmetric acquisition: Odd-numbered philosophers pick up their Left chopstick first, while Even-numbered philosophers pick up their Right chopstick first.\n3. Require a philosopher to pick up both chopsticks atomically inside a critical section only if both are available.',
    options: [
      'A) 1 and 2 only',
      'B) 2 and 3 only',
      'C) 1, 2, and 3 (All three independently guarantee deadlock freedom!)',
      'D) 3 only'
    ],
    correctAnswer: 'C',
    explanation: 'All three are classic textbook solutions to the Dining Philosophers deadlock! (1) By Pigeonhole Principle, with 5 chopsticks and at most 4 philosophers, at least 1 philosopher is guaranteed to get 2 chopsticks. (2) Asymmetric ordering (even vs. odd, or picking up the lower-numbered chopstick first) breaks Circular Wait. (3) Picking up both chopsticks atomically breaks Hold and Wait.'
  },
  {
    id: 'os-test-q13',
    questionNumber: 13,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q13: Which statement about cycles in a Resource Allocation Graph (RAG) is TRUE?',
    question: 'Which statement about cycles in a Resource Allocation Graph (RAG) is TRUE?',
    options: [
      'A) A cycle in a RAG is always both a necessary and sufficient condition for deadlock, regardless of how many instances each resource type has.',
      'B) If every resource type has exactly 1 instance, a cycle is both a NECESSARY and SUFFICIENT condition for deadlock; if resource types have multiple instances, a cycle is a NECESSARY but NOT SUFFICIENT condition for deadlock.',
      'C) A deadlock can occur in a RAG even if there are no cycles.',
      'D) If a multi-instance RAG has a cycle, the system is guaranteed to be in a safe state.'
    ],
    correctAnswer: 'B',
    explanation: 'Deadlock always requires Circular Wait, so a cycle is ALWAYS a necessary condition. When every resource type has only a single instance, any cycle means each process in the cycle is waiting for the sole instance held by the next process in the cycle (Necessary & Sufficient). When resource types have multiple instances, another process outside the cycle holding a second instance of that resource may finish and release its instance, breaking the wait—so a cycle is Necessary but NOT Sufficient.'
  },
  {
    id: 'os-test-q14',
    questionNumber: 14,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q14: In Banker\'s Algorithm for Deadlock Avoidance, what is the exact relationship between a Safe State, an Unsafe State, and a Deadlocked State?',
    question: 'In Banker\'s Algorithm for Deadlock Avoidance, what is the exact relationship between a Safe State, an Unsafe State, and a Deadlocked State?',
    options: [
      'A) Every Unsafe State is a Deadlocked State.',
      'B) A Safe State guarantees no deadlock can occur; Deadlocked States are a strict subset of Unsafe States (Deadlock ⊂ Unsafe)—meaning a system in an Unsafe State is NOT necessarily deadlocked right now, and may still complete without deadlock if processes release resources before requesting their full Max claim!',
      'C) A deadlock can occur inside a Safe State if a process terminates early.',
      'D) Banker\'s Algorithm requires zero prior knowledge of maximum resource needs.'
    ],
    correctAnswer: 'B',
    explanation: 'An Unsafe State simply means the OS cannot guarantee a safe completion sequence if every process suddenly decides to request its worst-case remaining Need (Max - Allocation) all at once. However, if a process in an Unsafe State finishes its work using only its current allocation and releases its resources without ever asking for its full Max, the system completes without deadlocking! Thus, Deadlock ⊂ Unsafe.'
  },
  {
    id: 'os-test-q15',
    questionNumber: 15,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q15: In contiguous memory allocation, what is the "50-Percent Rule" regarding First Fit / Best Fit, and how do Internal and External Fragmentation differ across Paging vs. Segmentation?',
    question: 'How do Internal Fragmentation and External Fragmentation manifest across Paging vs. Pure Segmentation?',
    options: [
      'A) Paging suffers from External Fragmentation; Segmentation suffers from Internal Fragmentation.',
      'B) Paging completely eliminates External Fragmentation (since any free physical frame can back any virtual page) and suffers only from minor Internal Fragmentation in the last page of a process; Pure Segmentation suffers from External Fragmentation (because segments have variable lengths) and has zero Internal Fragmentation.',
      'C) Both Paging and Segmentation suffer from both Internal and External Fragmentation equally.',
      'D) Compaction is used to fix Internal Fragmentation in Paging.'
    ],
    correctAnswer: 'B',
    explanation: 'In Paging, physical RAM and virtual memory are divided into fixed-size frames/pages of identical size (e.g., 4 KB). Any free physical frame can be mapped to any virtual page, so External Fragmentation is 0! Only the last page of a process may not be completely full, causing up to (PageSize - 1) bytes of Internal Fragmentation. In Segmentation, segments have arbitrary user-defined sizes, so exact-sized contiguous blocks are allocated (0 Internal Fragmentation), leaving variable-sized holes in RAM over time (External Fragmentation).'
  },
  {
    id: 'os-test-q16',
    questionNumber: 16,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q16: Why do modern 64-bit CPU architectures (like x86-64 and ARM64) use Multi-Level (4-level / 5-level) Hierarchical Page Tables instead of a single flat 1-level Page Table?',
    question: 'Why do modern 64-bit CPU architectures use Multi-Level Hierarchical Page Tables instead of a single flat 1-level Page Table?',
    options: [
      'A) Because a 1-level Page Table is slower at translating addresses than a 4-level Page Table.',
      'B) Because a flat 1-level Page Table must allocate a contiguous array of entries for the ENTIRE virtual address space (e.g., for 48-bit virtual addresses with 4KB pages, 2^36 entries * 8B = 512 GB of contiguous RAM per process!), whereas a Multi-Level Page Table only allocates inner page-table nodes for virtual regions the process actually uses!',
      'C) Because TLBs only work with 4-level page tables.',
      'D) Because a 1-level Page Table cannot store protection bits.'
    ],
    correctAnswer: 'B',
    explanation: 'A flat 1-level page table requires a contiguous array indexed by every possible virtual page number—even if a "Hello World" process only uses 3 pages (Code, Stack, Heap)! On a 64-bit system (48-bit canonical address space, 4KB pages = 2^36 pages), a flat table would require 2^36 * 8 bytes = 512 GB of contiguous physical RAM FOR EVERY SINGLE PROCESS! Multi-level page tables work like a sparse tree: if a large chunk of virtual address space is unused, its top-level directory entry is simply marked Invalid, avoiding allocating millions of empty leaf page table entries.'
  },
  {
    id: 'os-test-q17',
    questionNumber: 17,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q17: How does an Inverted Page Table differ from a traditional per-process Page Table, and what is its main trade-off?',
    question: 'How does an Inverted Page Table differ from a traditional per-process Page Table, and what is its main trade-off?',
    options: [
      'A) An Inverted Page Table has one entry per virtual page for every process.',
      'B) There is only ONE global Inverted Page Table for the entire system with exactly one entry per physical RAM frame (indexed by Frame Number, storing <PID, Virtual Page Number>), drastically reducing page-table RAM overhead at the cost of requiring a hash table (and TLB) to look up virtual-to-physical translations.',
      'C) Inverted Page Tables store pages on disk instead of RAM.',
      'D) Inverted Page Tables make shared memory between processes easier than standard page tables.'
    ],
    correctAnswer: 'B',
    explanation: 'Instead of keeping one page table per process sized by virtual address space, an Inverted Page Table keeps a single system-wide table with one entry per physical frame in RAM. If physical RAM has 1,000,000 frames, the table has exactly 1,000,000 entries regardless of how many processes are running! Because it is indexed by Physical Frame Number rather than Virtual Page Number, searching for <PID, VPN> requires a hash anchor table before populating the TLB.'
  },
  {
    id: 'os-test-q18',
    questionNumber: 18,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q18: What is the role of an ASID (Address Space Identifier / PCID) in a hardware Translation Lookaside Buffer (TLB)?',
    question: 'What is the role of an ASID (Address Space Identifier / PCID) in a hardware Translation Lookaside Buffer (TLB)?',
    options: [
      'A) It encrypts physical RAM addresses.',
      'B) It tags each TLB entry with the owning process\'s ID so that on a process Context Switch, the CPU does NOT have to flush the entire TLB—preventing a burst of cold TLB misses every time the OS switches processes!',
      'C) It replaces the Page Offset in the virtual address.',
      'D) It eliminates the need for a Page Table in RAM.'
    ],
    correctAnswer: 'B',
    explanation: 'Because Process A\'s Virtual Page 5 and Process B\'s Virtual Page 5 map to completely different Physical Frames, a TLB without ASIDs must be completely flushed on every process context switch (when CR3/PTBR changes), causing expensive TLB misses when the next process starts running. Tagging each TLB entry with an ASID lets translations from multiple processes coexist safely in the TLB without flushing!'
  },
  {
    id: 'os-test-q19',
    questionNumber: 19,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q19: What is the exact purpose of the "Dirty Bit" (Modified Bit) and the "Reference Bit" (Used Bit) inside a Page Table Entry (PTE)?',
    question: 'What is the exact purpose of the "Dirty Bit" (Modified Bit) and the "Reference Bit" (Used Bit) inside a Page Table Entry (PTE)?',
    options: [
      'A) The Dirty Bit indicates a corrupted RAM chip; the Reference Bit counts hard links.',
      'B) The Dirty Bit is set by hardware whenever a page is written to—if a page is evicted and its Dirty Bit is 0, the OS skips writing it back to disk (saving a disk write I/O!); the Reference Bit is set by hardware whenever a page is read or written—used by Clock / Second-Chance page replacement algorithms to approximate LRU.',
      'C) Both bits are set only by the compiler at compile time.',
      'D) The Dirty Bit prevents a page from ever being swapped out.'
    ],
    correctAnswer: 'B',
    explanation: 'When the OS evicts a victim page from RAM to make room for a new page, it checks the PTE\'s Dirty (Modified) Bit: if Dirty == 0, the page in RAM is still identical to its copy on disk, so the OS can overwrite the frame immediately without a costly disk write! The Reference Bit is set to 1 by the MMU on any read/write access and is swept by the Clock (Second-Chance) page replacement algorithm to identify recently used pages.'
  },
  {
    id: 'os-test-q20',
    questionNumber: 20,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q20: What is Belady\'s Anomaly in Virtual Memory page replacement, which algorithms suffer from it, and why are LRU and Optimal immune to it?',
    question: 'What is Belady\'s Anomaly in Virtual Memory page replacement, which algorithms suffer from it, and why are LRU and Optimal immune to it?',
    options: [
      'A) Belady\'s Anomaly is when increasing the number of allocated physical page frames INCREASES the number of page faults; FIFO suffers from it, whereas LRU and Optimal are "Stack Algorithms" (where the set of pages in k frames is always a subset of the pages in k+1 frames) and therefore NEVER suffer from Belady\'s Anomaly.',
      'B) Belady\'s Anomaly is when LRU has more page faults than FIFO.',
      'C) All page replacement algorithms suffer from Belady\'s Anomaly when page size exceeds 4 KB.',
      'D) Belady\'s Anomaly occurs only when there are 0 page faults.'
    ],
    correctAnswer: 'A',
    explanation: 'Intuitively, giving a process more RAM frames should reduce (or keep equal) its page faults. However, non-stack algorithms like FIFO can actually experience MORE page faults with 4 frames than with 3 frames (Belady\'s Anomaly). Stack algorithms (like LRU, Optimal, and LFU) satisfy the inclusion property: at any point in time, the set of pages resident in k frames is guaranteed to be a subset of the pages resident in k + 1 frames—making Belady\'s Anomaly mathematically impossible.'
  },
  {
    id: 'os-test-q21',
    questionNumber: 21,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q21: In Virtual Memory management, compare Local Page Replacement vs. Global Page Replacement when a process incurs a Page Fault:',
    question: 'In Virtual Memory management, compare Local Page Replacement vs. Global Page Replacement when a process incurs a Page Fault:',
    options: [
      'A) Local Replacement selects a victim frame only from the faulting process\'s own allocated frames (isolating processes so one thrashing process cannot steal frames from others, though it may underutilize idle frames elsewhere); Global Replacement can select a victim frame from any process in the system (higher overall throughput, but one process can cause others to thrash).',
      'B) Global Replacement keeps the number of frames allocated to each process strictly constant.',
      'C) Local Replacement allows a process to steal frames from the OS kernel.',
      'D) Global Replacement eliminates page faults completely.'
    ],
    correctAnswer: 'A',
    explanation: 'Under Local Replacement, each process has a fixed frame allocation—if Process A page-faults, it can only evict one of its own pages, so its page-fault rate cannot hurt Process B. Under Global Replacement, a faulting process can take frames away from other processes, dynamically adapting to changing working set sizes across the system at the risk of cascading thrashing.'
  },
  {
    id: 'os-test-q22',
    questionNumber: 22,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q22: How does Peter Denning\'s Working Set Model (WSS) prevent Thrashing in an Operating System?',
    question: 'How does Peter Denning\'s Working Set Model prevent Thrashing in an Operating System?',
    options: [
      'A) By disabling virtual memory and running only 1 process at a time.',
      'B) By tracking each process\'s Working Set Size WSS_i (the number of distinct pages referenced in the last Δ memory references); if the total demand D = ∑ WSS_i exceeds total available physical frames M, the OS suspends (swaps out) one or more processes and reallocates their frames so the remaining active processes have enough frames to hold their entire Working Sets!',
      'C) By replacing LRU with FIFO page replacement.',
      'D) By reducing the disk block size to 512 bytes.'
    ],
    correctAnswer: 'B',
    explanation: 'A process thrashes when it is allocated fewer physical frames than its Working Set Size (WSS_i). The OS monitors total working-set demand D = ∑ WSS_i across all active processes: whenever D > M (available physical frames), the Medium-Term Scheduler suspends a process and distributes its frames to the remaining processes so every running process can fit its working set in RAM.'
  },
  {
    id: 'os-test-q23',
    questionNumber: 23,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q23: Why can the Shortest Seek Time First (SSTF) disk scheduling algorithm cause starvation, and how does C-SCAN improve upon standard SCAN (Elevator)?',
    question: 'Why can the Shortest Seek Time First (SSTF) disk scheduling algorithm cause starvation, and how does C-SCAN improve upon standard SCAN (Elevator)?',
    options: [
      'A) SSTF always moves to cylinder 0 first.',
      'B) SSTF greedily services requests closest to the current head position (analogous to SJF), which can starve requests on distant inner/outer cylinders if a steady stream of requests arrives near the current cylinder; C-SCAN improves upon SCAN by servicing requests in one direction only and jumping back to the start, providing a much more uniform waiting time across all cylinders!',
      'C) SCAN only services one request per disk rotation.',
      'D) C-SCAN has higher starvation than SSTF.'
    ],
    correctAnswer: 'B',
    explanation: 'Under standard SCAN (Elevator), when the head reverses direction at the end of the disk (e.g., cylinder 199), cylinders near 199 were just serviced moments ago while cylinders near 0 have been waiting for two full sweeps! C-SCAN (Circular SCAN) sweeps strictly in one direction (0 -> 199), then jumps directly back to 0 without servicing on the return trip, treating the cylinders as a circular list with uniform wait times.'
  },
  {
    id: 'os-test-q24',
    questionNumber: 24,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q24: In a Unix/Linux file system, what is the exact difference between a Hard Link and a Soft (Symbolic) Link?',
    question: 'In a Unix/Linux file system, what is the exact difference between a Hard Link and a Soft (Symbolic) Link?',
    options: [
      'A) A Hard Link is a directory entry that points directly to the exact same underlying inode number as the original file (incrementing the inode\'s link reference count; the file data remains intact even if the original filename is deleted, and it cannot span across different file systems/partitions); a Soft Link creates a new separate inode storing the pathname string of the target file (and becomes a dangling broken link if the target file is deleted).',
      'B) A Soft Link shares the same inode number as the original file, whereas a Hard Link creates a new inode.',
      'C) Hard Links can span across different mounted partitions, whereas Soft Links cannot.',
      'D) Deleting the original file breaks all Hard Links to that file.'
    ],
    correctAnswer: 'A',
    explanation: 'A Hard Link maps a new directory filename directly to the existing file\'s inode number and increments inode.link_count++. If the original filename is deleted (unlink), link_count simply decrements by 1 and the file\'s data blocks remain 100% accessible via the hard link until link_count hits 0! Because inode numbers are only unique within a single file system, Hard Links cannot cross file-system/partition boundaries. A Soft (Symbolic) Link has its own distinct inode containing a text path pointer to the target path.'
  },
  {
    id: 'os-test-q25',
    questionNumber: 25,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q25: Compare Contiguous, Linked (e.g., FAT), and Indexed (Unix inode) disk file allocation methods:',
    question: 'Compare Contiguous, Linked, and Indexed disk file allocation methods:',
    options: [
      'A) Contiguous allocation supports O(1) direct random access but suffers from external fragmentation and difficult file growth; Linked allocation eliminates external fragmentation but requires O(N) sequential pointer chasing for random access (unless pointers are cached in RAM as a File Allocation Table — FAT); Indexed allocation supports O(1) random access without external fragmentation by storing block pointers in an index block / inode.',
      'B) Linked allocation provides O(1) random access without a FAT table.',
      'C) Contiguous allocation has zero external fragmentation.',
      'D) Indexed allocation requires files to be stored in contiguous disk sectors.'
    ],
    correctAnswer: 'A',
    explanation: 'Contiguous allocation stores a file in consecutive disk blocks (great sequential and O(1) random access, but suffers from external fragmentation and cannot easily grow in place). Linked allocation scatters blocks anywhere on disk with each block holding a pointer to the next (zero external fragmentation, but accessing the k-th block requires reading k blocks sequentially unless the linked pointers are cached in RAM as a FAT table). Indexed allocation groups all block pointers into an index block (or hierarchical Unix inode), supporting fast random access without external fragmentation.'
  },

  // =========================================================================
  // SECTION B: NUMERICAL & CALCULATION PROBLEMS (QUESTIONS 26 TO 40)
  // =========================================================================
  {
    id: 'os-test-q26',
    questionNumber: 26,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q26: [Conditional fork() Process Count Math] How many total processes (including the initial parent) and how many NEW child processes are created when the C snippet below executes?',
    question: 'How many TOTAL processes (including the initial parent) and how many NEW child processes are created when the C snippet below executes?\n\nint main() {\n  if (fork() && fork()) {\n    fork();\n  }\n  return 0;\n}',
    options: [
      'A) 4 total processes (3 new child processes)',
      'B) 5 total processes (4 new child processes)',
      'C) 7 total processes (6 new child processes)',
      'D) 8 total processes (7 new child processes)'
    ],
    correctAnswer: 'A',
    explanation: 'Recall that fork() returns child_PID (> 0, truthy) to the Parent and 0 (falsy) to the Child, and C\'s logical AND (&&) short-circuits if the left operand is 0! Trace: 1) First fork() is called by initial Parent P0: creates Child C1. In C1, the first fork() returned 0 (falsy), so && short-circuits—C1 skips both the second fork() and the if-body! 2) In P0, the first fork() returned >0 (truthy), so P0 evaluates the second fork(), creating Child C2. 3) Inside the second fork(), C2 receives 0 (falsy), so C2 skips the if-body! P0 receives >0 (truthy), so ONLY P0 enters the if-body and executes the third fork(), creating Child C3. Total processes = P0, C1, C2, C3 = 4 total processes (3 new child processes).'
  },
  {
    id: 'os-test-q27',
    questionNumber: 27,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q27: [SRTF Preemptive Scheduling Math] Consider 4 processes scheduled under Shortest Remaining Time First (SRTF): P1(AT=0, BT=8), P2(AT=1, BT=4), P3(AT=2, BT=9), P4(AT=3, BT=5). What are the exact Average Turnaround Time (TAT) and Average Waiting Time (WT)?',
    question: 'Consider 4 processes scheduled under Shortest Remaining Time First (SRTF / Preemptive SJF):\n• P1: Arrival = 0 ms, Burst = 8 ms\n• P2: Arrival = 1 ms, Burst = 4 ms\n• P3: Arrival = 2 ms, Burst = 9 ms\n• P4: Arrival = 3 ms, Burst = 5 ms\nWhat are the exact Average Turnaround Time (TAT) and Average Waiting Time (WT)?',
    options: [
      'A) Average TAT = 13.0 ms | Average WT = 6.5 ms',
      'B) Average TAT = 14.25 ms | Average WT = 7.75 ms',
      'C) Average TAT = 12.5 ms | Average WT = 6.0 ms',
      'D) Average TAT = 15.0 ms | Average WT = 8.5 ms'
    ],
    correctAnswer: 'A',
    explanation: 'Gantt Chart Trace: 1) [0..1]: P1 runs for 1ms (remaining: P1=7). 2) At t=1, P2 arrives with BT=4 < 7 -> P2 preempts P1! At t=2 (P3 arrives, BT=9) and t=3 (P4 arrives, BT=5), P2 still has the shortest remaining time and finishes at t = 1 + 4 = 5 ms (CT of P2 = 5). 3) At t=5, remaining bursts are P1=7, P3=9, P4=5 -> P4 runs from [5..10] and finishes at CT = 10 ms. 4) At t=10, remaining bursts are P1=7, P3=9 -> P1 runs from [10..17] and finishes at CT = 17 ms. 5) P3 runs from [17..26] and finishes at CT = 26 ms. Turnaround Times (CT - AT): P1 = 17 - 0 = 17; P2 = 5 - 1 = 4; P3 = 26 - 2 = 24; P4 = 10 - 3 = 7. Sum of TAT = 17 + 4 + 24 + 7 = 52 -> Avg TAT = 52 / 4 = 13.0 ms. Waiting Times (TAT - BT): P1 = 17 - 8 = 9; P2 = 4 - 4 = 0; P3 = 24 - 9 = 15; P4 = 7 - 5 = 2. Sum of WT = 9 + 0 + 15 + 2 = 26 -> Avg WT = 26 / 4 = 6.5 ms.'
  },
  {
    id: 'os-test-q28',
    questionNumber: 28,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q28: [Round Robin Scheduling Math] Three processes P1(BT=10 ms), P2(BT=5 ms), and P3(BT=8 ms) all arrive at t = 0 in order P1, P2, P3 and are scheduled using Round Robin with Time Quantum Q = 3 ms. What are the Completion Times (CT) of P1, P2, and P3?',
    question: 'Three processes P1 (Burst = 10 ms), P2 (Burst = 5 ms), and P3 (Burst = 8 ms) all arrive at t = 0 in order P1, P2, P3 and are scheduled using Round Robin with Time Quantum Q = 3 ms. What are the exact Completion Times of P1, P2, and P3?',
    options: [
      'A) CT(P1) = 23 ms, CT(P2) = 14 ms, CT(P3) = 22 ms',
      'B) CT(P1) = 10 ms, CT(P2) = 15 ms, CT(P3) = 23 ms',
      'C) CT(P1) = 23 ms, CT(P2) = 12 ms, CT(P3) = 20 ms',
      'D) CT(P1) = 21 ms, CT(P2) = 14 ms, CT(P3) = 23 ms'
    ],
    correctAnswer: 'A',
    explanation: 'Gantt Chart Trace with Q = 3 ms: Round 1: P1 runs [0..3] (rem=7), P2 runs [3..6] (rem=2), P3 runs [6..9] (rem=5). Round 2: P1 runs [9..12] (rem=4), P2 runs [12..14] (only needs 2ms! P2 finishes at CT = 14 ms, rem=0), P3 runs [14..17] (rem=2). Round 3: P1 runs [17..20] (rem=1), P3 runs [20..22] (only needs 2ms! P3 finishes at CT = 22 ms, rem=0). Round 4: P1 runs [22..23] (finishes last 1ms at CT = 23 ms). Thus: CT(P1) = 23 ms, CT(P2) = 14 ms, CT(P3) = 22 ms.'
  },
  {
    id: 'os-test-q29',
    questionNumber: 29,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q29: [HRRN Response Ratio Math] Under Highest Response Ratio Next (HRRN) scheduling, the CPU becomes free at t = 12 ms. Three jobs are waiting in the Ready Queue: J1(AT=2, BT=5), J2(AT=4, BT=2), and J3(AT=6, BT=6). What are their Response Ratios at t = 12 ms, and which job is scheduled next?',
    question: 'Under Highest Response Ratio Next (HRRN) scheduling, the CPU becomes free at t = 12 ms. Three jobs are in the Ready Queue:\n• J1: Arrival = 2 ms, Burst = 5 ms\n• J2: Arrival = 4 ms, Burst = 2 ms\n• J3: Arrival = 6 ms, Burst = 6 ms\nWhat are their Response Ratios at t = 12 ms, and which job is selected?',
    options: [
      'A) RR(J1) = 3.0, RR(J2) = 5.0, RR(J3) = 2.0 -> J2 is selected next',
      'B) RR(J1) = 2.0, RR(J2) = 4.0, RR(J3) = 1.0 -> J1 is selected next',
      'C) RR(J1) = 3.0, RR(J2) = 4.0, RR(J3) = 2.0 -> J1 is selected next',
      'D) RR(J1) = 2.4, RR(J2) = 6.0, RR(J3) = 2.0 -> J3 is selected next'
    ],
    correctAnswer: 'A',
    explanation: 'At t = 12 ms, Waiting Time W = 12 - AT, and Response Ratio RR = (W + BT) / BT: 1) For J1: W = 12 - 2 = 10 ms -> RR(J1) = (10 + 5) / 5 = 3.0. 2) For J2: W = 12 - 4 = 8 ms -> RR(J2) = (8 + 2) / 2 = 5.0. 3) For J3: W = 12 - 6 = 6 ms -> RR(J3) = (6 + 6) / 6 = 2.0. Since J2 has the highest response ratio (5.0), J2 is scheduled next.'
  },
  {
    id: 'os-test-q30',
    questionNumber: 30,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q30: [Counting Semaphore Queue Math] A counting semaphore S is initialized to 7. Subsequently, 20 P (wait) operations and 12 V (signal) operations are completed on S. What is the final integer value of S, and how many processes are currently blocked in S\'s waiting queue?',
    question: 'A counting semaphore S is initialized to 7. Subsequently, 20 P (wait) operations and 12 V (signal) operations are executed on S. What is the final value of S, and how many processes are currently blocked in S\'s waiting queue?',
    options: [
      'A) Final S = -1 | 1 process is blocked in the waiting queue',
      'B) Final S = 1 | 0 processes are blocked',
      'C) Final S = -8 | 8 processes are blocked',
      'D) Final S = 0 | 1 process is blocked'
    ],
    correctAnswer: 'A',
    explanation: 'Each P (wait) operation decrements S by 1, and each V (signal) operation increments S by 1: Final S = S_initial - (# of P) + (# of V) = 7 - 20 + 12 = -1. In a standard counting semaphore implementation, whenever S is negative (S = -k), its magnitude k represents the exact number of processes currently asleep/blocked in the semaphore\'s waiting queue (|-1| = 1 blocked process).'
  },
  {
    id: 'os-test-q31',
    questionNumber: 31,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q31: [Minimum Resources for Deadlock Freedom Math] A system has 6 concurrent processes, and each process requires a maximum of 5 instances of resource type R (magnetic tape drives / worker connections) to complete its execution. What is the MINIMUM number of instances of R the system must have to guarantee that Deadlock can NEVER occur?',
    question: 'A system has 6 concurrent processes, and each process requires at most 5 instances of resource type R to complete. What is the MINIMUM number of instances of R required to guarantee that the system is 100% Deadlock-Free?',
    options: [
      'A) 24',
      'B) 25',
      'C) 30',
      'D) 31'
    ],
    correctAnswer: 'B',
    explanation: 'In the worst-case deadlock scenario, each of the P = 6 processes holds (Max - 1) = (5 - 1) = 4 instances of R and is waiting for 1 more instance: 6 * 4 = 24 instances. Adding just 1 more instance (24 + 1 = 25) guarantees that at least one process can acquire its 5th instance, finish execution, and release all 5 instances back to the pool! Formula: R_min = P * (Max - 1) + 1 = 6 * (5 - 1) + 1 = 25.'
  },
  {
    id: 'os-test-q32',
    questionNumber: 32,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q32: [Banker\'s Algorithm Need & Safe Sequence Math] A system with 4 processes (P0..P3) and 3 resource types (A, B, C) has Available = [3, 2, 2]. Given Allocation: P0=[0,1,0], P1=[2,0,0], P2=[3,0,2], P3=[2,1,1] and Max: P0=[7,5,3], P1=[3,2,2], P2=[9,0,2], P3=[2,2,2], which of the following is a valid Safe Sequence?',
    question: 'A system has Available = [3, 2, 2]. Given Allocation and Max matrices:\n• P0: Alloc = [0, 1, 0], Max = [7, 5, 3]\n• P1: Alloc = [2, 0, 0], Max = [3, 2, 2]\n• P2: Alloc = [3, 0, 2], Max = [9, 0, 2]\n• P3: Alloc = [2, 1, 1], Max = [2, 2, 2]\nCompute Need = Max - Alloc and identify which sequence is a valid Banker\'s Safe Sequence:',
    options: [
      'A) <P0, P1, P2, P3>',
      'B) <P1, P3, P2, P0>',
      'C) <P2, P1, P3, P0>',
      'D) The system is in an Unsafe State (no safe sequence exists).'
    ],
    correctAnswer: 'B',
    explanation: 'First compute Need = Max - Alloc: Need(P0) = [7, 4, 3]; Need(P1) = [1, 2, 2]; Need(P2) = [6, 0, 0]; Need(P3) = [0, 1, 1]. Initial Work = Available = [3, 2, 2]: 1) P1 has Need [1, 2, 2] <= [3, 2, 2] -> P1 runs and releases Alloc [2, 0, 0], so Work becomes [5, 2, 2]. 2) P3 has Need [0, 1, 1] <= [5, 2, 2] -> P3 runs and releases Alloc [2, 1, 1], so Work becomes [7, 3, 3]. 3) P2 has Need [6, 0, 0] <= [7, 3, 3] -> P2 runs and releases Alloc [3, 0, 2], so Work becomes [10, 3, 5]. 4) P0 has Need [7, 4, 3] <= [10, 3, 5] -> P0 runs and finishes! Therefore, <P1, P3, P2, P0> is a completely valid Safe Sequence.'
  },
  {
    id: 'os-test-q33',
    questionNumber: 33,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q33: [Effective Memory Access Time (EMAT) with TLB Math] A system uses a 1-level Page Table in RAM. TLB lookup takes 10 ns, main memory (RAM) access takes 100 ns, and the TLB Hit Ratio is 90% (0.90). Assuming 0 page faults and parallel/sequential TLB lookup where TLB is checked first, what is the Effective Memory Access Time (EMAT)?',
    question: 'A system uses a 1-level Page Table in RAM. A TLB lookup takes 10 ns, a main memory (RAM) access takes 100 ns, and the TLB Hit Ratio is 90%. Assuming TLB is checked before RAM and there are 0 page faults, what is the Effective Memory Access Time (EMAT)?',
    options: [
      'A) 110 ns',
      'B) 120 ns',
      'C) 190 ns',
      'D) 210 ns'
    ],
    correctAnswer: 'B',
    explanation: '1) On a TLB Hit (90% of accesses): TLB lookup (10 ns) + 1 RAM access for data (100 ns) = 110 ns. 2) On a TLB Miss (10% of accesses): TLB lookup (10 ns) + 1 RAM access to read the Page Table Entry (100 ns) + 1 RAM access to read the actual data word (100 ns) = 210 ns. EMAT = 0.90 * 110 + 0.10 * 210 = 99 + 21 = 120 ns.'
  },
  {
    id: 'os-test-q34',
    questionNumber: 34,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q34: [Multi-Level Page Table Bit-Split Math] A processor uses a 48-bit virtual address space, a Page Size of 4 KB (2^12 bytes), and a Page Table Entry (PTE) size of 8 bytes (2^3 bytes). If every page table node must fit inside a single 4 KB page, how many levels of page tables are required, and how many bits are used per level?',
    question: 'A processor uses a 48-bit virtual address space, a Page Size of 4 KB (2^12 bytes), and a Page Table Entry (PTE) size of 8 bytes (2^3 bytes). If every page table node must fit inside a single 4 KB page, how many levels of page tables are required, and how are the 48 bits split?',
    options: [
      'A) 4 levels: 9 + 9 + 9 + 9 bits for page tables + 12 bits for page offset = 48 bits (exact x86-64 4-level paging layout!)',
      'B) 3 levels: 12 + 12 + 12 bits + 12 bits offset = 48 bits',
      'C) 2 levels: 18 + 18 bits + 12 bits offset = 48 bits',
      'D) 5 levels: 8 + 8 + 8 + 8 + 4 bits + 12 bits offset = 48 bits'
    ],
    correctAnswer: 'A',
    explanation: '1) Page Size = 4 KB = 2^12 bytes -> Page Offset requires d = 12 bits. 2) Remaining virtual page number (VPN) bits = 48 - 12 = 36 bits. 3) How many 8-byte (2^3 B) PTEs fit inside a single 4 KB (2^12 B) page? 2^12 / 2^3 = 2^9 = 512 entries per page table node -> each level indexes 9 bits! 4) Number of levels = 36 / 9 = 4 levels! Bit split = 9 (PML4) + 9 (PDPT) + 9 (PD) + 9 (PT) + 12 (Offset) = 48 bits (the exact architecture of x86-64 4-level paging).'
  },
  {
    id: 'os-test-q35',
    questionNumber: 35,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q35: [Page Replacement Fault Count Math — LRU vs. Optimal] Given a system with 3 initially empty page frames and the page reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, how many Page Faults occur under LRU vs. Optimal (OPT) page replacement?',
    question: 'Given a system with 3 initially empty page frames and the 10-page reference string:\n7, 0, 1, 2, 0, 3, 0, 4, 2, 3\nHow many total Page Faults occur under LRU vs. Optimal (OPT) page replacement?',
    options: [
      'A) LRU = 8 page faults | Optimal = 6 page faults',
      'B) LRU = 9 page faults | Optimal = 7 page faults',
      'C) LRU = 6 page faults | Optimal = 6 page faults',
      'D) LRU = 10 page faults | Optimal = 8 page faults'
    ],
    correctAnswer: 'A',
    explanation: '1) Trace LRU (3 frames): 7 (Fault #1: [7]), 0 (Fault #2: [7,0]), 1 (Fault #3: [7,0,1]), 2 (Fault #4: evicts LRU 7 -> [2,0,1]), 0 (Hit! [2,0,1]), 3 (Fault #5: evicts LRU 1 -> [2,0,3]), 0 (Hit! [2,0,3]), 4 (Fault #6: evicts LRU 2 -> [4,0,3]), 2 (Fault #7: evicts LRU 3 -> [4,0,2]), 3 (Fault #8: evicts LRU 0 -> [4,3,2]). Total LRU faults = 8. 2) Trace Optimal (3 frames): 7 (#1), 0 (#2), 1 (#3), 2 (#4: evicts 7 since 7 never used again -> [2,0,1]), 0 (Hit), 3 (#5: evicts 1 since 1 never used again -> [2,0,3]), 0 (Hit), 4 (#6: among {2,0,3}, 0 is never used again -> evicts 0 -> [2,4,3]), 2 (Hit!), 3 (Hit!). Total Optimal faults = 6.'
  },
  {
    id: 'os-test-q36',
    questionNumber: 36,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q36: [Disk Scheduling Seek Distance Math — C-LOOK] A disk drive has 200 cylinders (0 to 199). The disk head is currently at cylinder 53 and moving toward cylinder 199 (increasing order). The pending request queue is: 98, 183, 37, 122, 14, 124, 65, 67. What is the total head movement (in cylinders) under the C-LOOK scheduling algorithm (including the jump back to the lowest requested cylinder)?',
    question: 'A disk has 200 cylinders (0 to 199). The head is at cylinder 53 moving toward 199. Pending queue:\n98, 183, 37, 122, 14, 124, 65, 67\nWhat is the total head movement (in cylinders) under C-LOOK (counting the circular jump from the highest requested cylinder to the lowest requested cylinder)?',
    options: [
      'A) 322 cylinders (130 upward + 169 jump + 23 upward)',
      'B) 299 cylinders',
      'C) 382 cylinders',
      'D) 208 cylinders'
    ],
    correctAnswer: 'A',
    explanation: 'Sorted requests: {14, 37, [53], 65, 67, 98, 122, 124, 183}. Under C-LOOK moving upward from 53: 1) Services 65 -> 67 -> 98 -> 122 -> 124 -> 183 (stops at 183 without going to 199!): distance = 183 - 53 = 130 cylinders. 2) Jumps directly from 183 down to the lowest pending request 14 (without going to 0!): distance = 183 - 14 = 169 cylinders. 3) Sweeps upward from 14 -> 37: distance = 37 - 14 = 23 cylinders. Total head movement = 130 + 169 + 23 = 322 cylinders. (Note: if excluding the return jump, active service movement is 130 + 23 = 153).'
  },
  {
    id: 'os-test-q37',
    questionNumber: 37,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q37: [Unix Inode File Size Math] A Unix file system uses a disk block size of 4 KB (2^12 bytes) and 4-byte disk block pointers. Each inode contains 12 direct block pointers, 1 singly indirect pointer, and 1 doubly indirect pointer. What is the maximum file size that can be addressed using ONLY the 12 direct + 1 singly indirect + 1 doubly indirect pointers?',
    question: 'A Unix file system uses a block size of 4 KB (2^12 bytes) and 4-byte block pointers. Each inode has 12 direct pointers, 1 singly indirect pointer, and 1 doubly indirect pointer. How many data blocks (and approximate file size) can be addressed by these pointers?',
    options: [
      'A) (12 + 1024 + 1,048,576) blocks ≈ 4 GB + 4 MB + 48 KB',
      'B) (12 + 512 + 262,144) blocks ≈ 1 GB + 2 MB + 48 KB',
      'C) (12 + 4096 + 16,777,216) blocks ≈ 64 GB',
      'D) (12 + 1024) blocks ≈ 4 MB + 48 KB'
    ],
    correctAnswer: 'A',
    explanation: '1) Number of 4-byte block pointers per 4 KB (4096 B) index block = 4096 / 4 = 1024 (2^10) pointers/block. 2) 12 Direct pointers address 12 blocks = 12 * 4 KB = 48 KB. 3) 1 Singly Indirect pointer addresses 1024 blocks = 1024 * 4 KB = 4 MB. 4) 1 Doubly Indirect pointer addresses 1024 * 1024 = 1,048,576 (2^20) blocks = 2^20 * 4 KB = 4 GB! Total = (12 + 1024 + 1,048,576) blocks ≈ 4 GB + 4 MB + 48 KB.'
  },
  {
    id: 'os-test-q38',
    questionNumber: 38,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q38: [Multiprogramming CPU Utilization Math] Each process in a system spends 70% of its time waiting for I/O (p = 0.7) and 30% of its time executing on the CPU. If 3 processes are kept in RAM simultaneously (Degree of Multiprogramming N = 3), what is the probabilistic CPU Utilization?',
    question: 'Each process spends 70% of its time waiting for I/O (p = 0.7) and 30% on the CPU. If 3 independent processes are in memory simultaneously (N = 3), what is the expected CPU Utilization?',
    options: [
      'A) 30.0%',
      'B) 65.7%',
      'C) 90.0%',
      'D) 34.3%'
    ],
    correctAnswer: 'B',
    explanation: 'If each process has probability p = 0.7 of waiting on I/O at any given moment, the probability that ALL N = 3 independent processes are simultaneously waiting for I/O (leaving the CPU idle) is p^N = (0.7)^3 = 0.343 (34.3%). Therefore, CPU Utilization = 1 - p^N = 1 - 0.343 = 0.657 = 65.7%.'
  },
  {
    id: 'os-test-q39',
    questionNumber: 39,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q39: [SJF Exponential Averaging Prediction Math] An OS uses SJF with Exponential Averaging (α = 0.5) to predict next CPU burst times. The initial prediction is τ_0 = 10 ms. If the process\'s first actual burst is t_0 = 6 ms and its second actual burst is t_1 = 4 ms, what is the predicted third burst τ_2?',
    question: 'An OS uses Exponential Averaging (τ_{n+1} = α * t_n + (1 - α) * τ_n) with α = 0.5 and initial guess τ_0 = 10 ms. Given actual bursts t_0 = 6 ms and t_1 = 4 ms, what is the predicted burst τ_2?',
    options: [
      'A) 5.0 ms',
      'B) 6.0 ms',
      'C) 7.0 ms',
      'D) 8.0 ms'
    ],
    correctAnswer: 'B',
    explanation: 'Step 1: Compute τ_1 after t_0 = 6 ms: τ_1 = 0.5 * (6) + (1 - 0.5) * (10) = 3 + 5 = 8.0 ms. Step 2: Compute τ_2 after t_1 = 4 ms: τ_2 = 0.5 * (4) + (1 - 0.5) * (8.0) = 2 + 4 = 6.0 ms.'
  },
  {
    id: 'os-test-q40',
    questionNumber: 40,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q40: [Segmentation Address Translation Math] Given a Segment Table where Segment 0 has (Base = 219, Limit = 600), Segment 1 has (Base = 2300, Limit = 14), and Segment 2 has (Base = 90, Limit = 100), what are the Physical Addresses for Logical Addresses (0, 430), (1, 10), and (2, 500)?',
    question: 'Given a Segment Table:\n• Segment 0: Base = 219, Limit = 600\n• Segment 1: Base = 2300, Limit = 14\n• Segment 2: Base = 90, Limit = 100\nWhat are the resulting Physical Addresses for Logical Addresses (0, 430), (1, 10), and (2, 500)?',
    options: [
      'A) (0, 430) -> 649 | (1, 10) -> 2310 | (2, 500) -> Addressing Error / Segmentation Fault Trap (since Offset 500 >= Limit 100)',
      'B) (0, 430) -> 649 | (1, 10) -> 2310 | (2, 500) -> 590',
      'C) (0, 430) -> 1030 | (1, 10) -> 2324 | (2, 500) -> Trap',
      'D) All three cause Segmentation Faults.'
    ],
    correctAnswer: 'A',
    explanation: 'For a logical address (Segment s, Offset d), the MMU first checks if 0 <= d < Limit[s]: 1) For (0, 430): 430 < 600 -> Valid! Physical Address = Base[0] + 430 = 219 + 430 = 649. 2) For (1, 10): 10 < 14 -> Valid! Physical Address = Base[1] + 10 = 2300 + 10 = 2310. 3) For (2, 500): Offset 500 >= Limit 100 -> Invalid! The MMU triggers a hardware Segmentation Fault trap to the OS.'
  },

  // =========================================================================
  // SECTION C: REAL-WORLD ENGINEERING & PRODUCTION SCENARIOS (QUESTIONS 41 TO 50)
  // =========================================================================
  {
    id: 'os-test-q41',
    questionNumber: 41,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q41: [Zombie Process Table Exhaustion in Production] A backend server spawns short-lived child processes via fork() to convert uploaded images. After 2 days, free RAM is 85% and CPU is idle, yet every new fork() call fails with EAGAIN ("Resource temporarily unavailable") and ps aux shows 32,000 <defunct> processes! What caused this and how do you fix it?',
    question: 'A server spawns child processes via fork(). After 2 days, free RAM is 85% and CPU is idle, yet fork() fails with EAGAIN and ps aux shows 32,000 <defunct> processes! What is the root cause and fix?',
    options: [
      'A) The child processes are leaking heap memory.',
      'B) The parent process never called wait()/waitpid() (or registered a SIGCHLD handler / SA_NOCLDWAIT), leaving 32,000 Zombie PCBs in the kernel process table and exhausting the OS pid_max limit! Fix it by reaping terminated children in a SIGCHLD handler using waitpid(-1, &status, WNOHANG) or setting signal(SIGCHLD, SIG_IGN).',
      'C) The children became Orphan processes that init refused to adopt.',
      'D) Increase the swap partition size.'
    ],
    correctAnswer: 'B',
    explanation: 'Even though a terminated child process releases all of its user-space RAM, its kernel Process Control Block (PCB) and PID remain occupied in the kernel process table as a Zombie (<defunct>) until the parent collects its exit status via wait()/waitpid(). Once the total number of Zombies hits the kernel\'s pid_max (often 32,768) or ulimit -u, no new processes can be spawned on the server!'
  },
  {
    id: 'os-test-q42',
    questionNumber: 42,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q42: [Priority Inversion — The Mars Pathfinder Bug] In a real-time embedded OS, a Low-priority task L acquires Mutex M. A High-priority task H preempts L and tries to lock M (blocking H). Before L can finish and unlock M, a stream of Medium-priority tasks (which don\'t need M) preempt L and run for minutes—starving the High-priority task H! What is this bug called and how do RTOS kernels solve it?',
    question: 'Low-priority task L holds Mutex M; High-priority task H blocks waiting for M; Medium-priority tasks preempt L and prevent L from releasing M—indirectly starving High-priority task H! What is this bug called and how do OS kernels fix it?',
    options: [
      'A) Convoy Effect; fixed using FCFS scheduling.',
      'B) Unbounded Priority Inversion; fixed using the Priority Inheritance Protocol (temporarily boosting Low-priority task L\'s priority to match High-priority task H\'s priority while L holds Mutex M, so Medium-priority tasks cannot preempt L!).',
      'C) Belady\'s Anomaly; fixed using LRU.',
      'D) Thrashing; fixed using the Working Set Model.'
    ],
    correctAnswer: 'B',
    explanation: 'This exact bug caused the 1997 NASA Mars Pathfinder spacecraft to repeatedly reset its computer! When High-priority task H blocks on a mutex owned by Low-priority task L, any Medium-priority task M_i can preempt L, indirectly blocking H (Priority Inversion). The Priority Inheritance Protocol temporarily elevates L\'s scheduling priority to H\'s priority until L unlocks the mutex, allowing L to finish immediately and hand the lock to H.'
  },
  {
    id: 'os-test-q43',
    questionNumber: 43,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q43: [Producer-Consumer Lock-Order Deadlock] In a multi-threaded Bounded Buffer implementation, a developer writes the Producer code as: wait(mutex); wait(empty); insert(item); signal(mutex); signal(full); (swapping wait(mutex) and wait(empty)). What happens as soon as the buffer becomes completely full?',
    question: 'In a Bounded Buffer Producer, a developer writes:\nwait(mutex);\nwait(empty);\ninsert(item);\nsignal(mutex);\nsignal(full);\nWhat happens when the buffer is full (empty == 0) and the Producer runs?',
    options: [
      'A) It works normally with slightly lower throughput.',
      'B) Permanent Deadlock! The Producer acquires mutex (setting mutex = 0) and then blocks inside wait(empty) while still holding mutex! When the Consumer tries to consume an item to free a slot, the Consumer blocks on wait(mutex)—so neither Producer nor Consumer can ever proceed!',
      'C) The Producer overwrites the oldest item in the buffer.',
      'D) The Consumer skips wait(mutex).'
    ],
    correctAnswer: 'B',
    explanation: 'Never hold a binary mutex lock while calling a potentially blocking counting semaphore wait(empty) or wait(full)! If the Producer locks mutex first when empty == 0, it goes to sleep inside wait(empty) while holding the sole key (mutex) to the buffer. The Consumer cannot enter the buffer to consume an item and call signal(empty) because the Consumer is blocked at wait(mutex)—creating a classic Hold-and-Wait Deadlock.'
  },
  {
    id: 'os-test-q44',
    questionNumber: 44,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q44: [Thrashing Spiral Diagnosis] On a production Linux server, monitoring alerts show CPU utilization has dropped to 4% while Disk Swap I/O is pinned at 100% and response times are 30+ seconds. An automated script sees "CPU utilization is only 4%!" and spawns MORE worker processes to utilize the CPU—making the server completely unresponsive! Explain what happened:',
    question: 'A server shows CPU utilization at 4% and Disk Swap I/O at 100%. An auto-scaler sees low CPU usage and spawns MORE worker processes, completely freezing the server! What OS phenomenon occurred?',
    options: [
      'A) The CPU clock frequency throttled due to overheating.',
      'B) Thrashing! The total working set of active processes exceeded physical RAM, causing processes to fault continuously and wait in the disk swap queue (which is why CPU utilization dropped to 4%). Spawning more processes stole even more frames per process, worsening the page-fault spiral!',
      'C) Deadlock in the network card driver.',
      'D) The disk scheduler switched from SSTF to C-SCAN.'
    ],
    correctAnswer: 'B',
    explanation: 'During Thrashing, processes spend 96%+ of their time blocked in the Paging Disk Queue waiting for page-ins/page-outs, leaving the Ready Queue empty and causing CPU utilization to plummet! Naïvely interpreting low CPU utilization as "the server needs more work" and increasing the Degree of Multiprogramming shrinks the frames per process even further, intensifying thrashing.'
  },
  {
    id: 'os-test-q45',
    questionNumber: 45,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q45: [Multi-Core L1 Cache False Sharing] On an 8-core server, 4 threads running on 4 different cores simultaneously increment their own separate element of a global array int64_t counts[4]; (Thread i increments counts[i] 100 million times with zero locks). Surprisingly, running 4 threads in parallel is 6x SLOWER than running 1 thread! What hardware/OS mechanism caused this?',
    question: 'Four threads on 4 CPU cores increment their own separate element in int64_t counts[4]; (Thread i increments counts[i]) with no locks. Yet 4 threads run 6x SLOWER than 1 thread! Why, and how do you fix it?',
    options: [
      'A) Context switching on a single core.',
      'B) False Sharing (Cache-Line Ping-Ponging): CPU L1 caches manage coherence (MESI protocol) at the granularity of 64-byte Cache Lines! Because all four 8-byte elements of counts[0..3] (32 bytes total) sit inside the SAME 64-byte cache line, every write by Core 1 invalidates the entire cache line for Cores 2, 3, and 4! Fix it by using thread-local variables or aligning each counter to a 64-byte boundary (alignas(64)).',
      'C) Page faults on counts[i].',
      'D) TLB misses on every increment.'
    ],
    correctAnswer: 'B',
    explanation: 'CPU caches do not track coherence byte-by-byte; they track coherence in 64-byte Cache Lines. Even though Thread 0 only modifies counts[0] and Thread 1 only modifies counts[1], both variables reside in the same 64-byte cache line! Under the MESI cache coherence protocol, whenever Core 0 writes to counts[0], it invalidates that 64-byte line in Core 1, 2, and 3\'s L1 caches, forcing expensive cross-core cache reloads on every single increment (False Sharing). Padding/aligning each counter to 64 bytes (alignas(64)) or accumulating in a local register first eliminates False Sharing.'
  },
  {
    id: 'os-test-q46',
    questionNumber: 46,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q46: [Copy-on-Write (CoW) in Redis BGSAVE] An in-memory database (like Redis) holding 40 GB of data in a 64 GB RAM server needs to write a point-in-time snapshot to disk without freezing incoming client requests. It calls fork(). Why doesn\'t fork() fail with Out-Of-Memory (since 40 GB + 40 GB = 80 GB > 64 GB) or take 10 seconds to copy 40 GB of RAM?',
    question: 'A process using 40 GB of RAM on a 64 GB machine calls fork() to write a background snapshot to disk. Why does fork() succeed in a few milliseconds without needing another 40 GB of free physical RAM?',
    options: [
      'A) fork() compresses the 40 GB into 1 GB.',
      'B) Because modern OS kernels implement Copy-on-Write (CoW) for fork(): the kernel only copies the parent\'s Page Table entries (~a few megabytes) and marks the 40 GB of physical pages as Read-Only. Both parent and child share the exact same physical RAM frames, and the OS only allocates a new 4 KB physical frame when the parent modifies a specific page while the child is saving!',
      'C) fork() writes the 40 GB directly to swap space before returning.',
      'D) fork() shares the same stack without copying page tables.'
    ],
    correctAnswer: 'B',
    explanation: 'With Copy-on-Write (CoW), fork() does NOT duplicate physical memory frames! Instead, the child receives a copy of the parent\'s Page Table pointing to the exact same physical frames, with the PTE write-permission bits set to Read-Only. The child reads the consistent point-in-time snapshot from those shared frames to write to disk; if the parent receives a new write request on page X, the MMU triggers a minor CoW page fault, duplicates ONLY that 4 KB page X for the parent, and marks it writable!'
  },
  {
    id: 'os-test-q47',
    questionNumber: 47,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q47: [File Descriptor Leak — EMFILE Error] A microservice opens a temporary configuration file on every incoming request, but forgets to close the file descriptor when an early validation error returns. After 1,020 requests, every subsequent file open AND every new incoming HTTP socket connection fails with "Error: EMFILE: too many open files"! Why did a file leak also block network sockets?',
    question: 'A service leaks open file handles on error paths. After ~1,020 requests, both file operations AND new incoming TCP network connections fail with "EMFILE: too many open files"! Why did leaking file handles break TCP network sockets?',
    options: [
      'A) Because in Unix/Linux, "Everything is a File": TCP network sockets, pipes, epoll instances, and regular disk files all allocate entries from the exact same per-process File Descriptor Table (default ulimit -n = 1024)!',
      'B) Because TCP sockets are stored on the hard drive.',
      'C) Because the hard disk ran out of free blocks.',
      'D) Because file descriptors are stored in the CPU TLB.'
    ],
    correctAnswer: 'A',
    explanation: 'In Unix/Linux, every open regular file, directory, pipe, and network TCP socket is represented by an integer File Descriptor (FD) indexing into the process\'s PCB File Descriptor Table (which points to the system-wide Open File Table -> Inode Table). When a process hits its per-process FD limit (ulimit -n, typically 1024 by default), accept() cannot allocate a new FD for incoming client TCP sockets!'
  },
  {
    id: 'os-test-q48',
    questionNumber: 48,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q48: [C10K+ High-Concurrency I/O — select/poll vs. epoll] Why do high-concurrency event-driven servers (like Node.js libuv, Nginx, and Redis) use Linux epoll (or macOS kqueue) instead of legacy select() / poll() when handling 50,000 concurrent socket connections?',
    question: 'Why do high-concurrency servers (Node.js libuv, Nginx, Redis) use Linux epoll instead of legacy select() or poll() when managing 50,000 concurrent connections?',
    options: [
      'A) select() and poll() require copying the entire array of 50,000 file descriptors from User Space to Kernel Space on EVERY call and scanning all 50,000 descriptors linearly in O(N) time even if only 1 socket has data; epoll maintains an in-kernel red-black tree + callback ready-list that returns ONLY the active ready sockets in O(1) (O(active)) time!',
      'B) epoll spawns 50,000 kernel threads.',
      'C) select() can handle unlimited file descriptors while epoll is limited to 1024.',
      'D) epoll runs entirely without system calls.'
    ],
    correctAnswer: 'A',
    explanation: 'Legacy select() is hardcoded to a maximum of 1024 FDs (FD_SETSIZE) and, like poll(), forces both the user process and the kernel to iterate linearly O(N) over all 50,000 watched FDs on every single event loop tick just to find the 2 sockets that actually received packets! epoll_ctl registers FDs once in an in-kernel structure, and hardware NIC interrupts push ready FDs onto a kernel ready-list—allowing epoll_wait() to return only the active sockets in O(k) time.'
  },
  {
    id: 'os-test-q49',
    questionNumber: 49,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q49: [Memory-Mapped Files (mmap) vs. read() Syscall] Why do high-performance databases and file servers use mmap() to map a file directly into the process\'s virtual address space instead of calling standard read() into a user-space buffer?',
    question: 'Why do high-performance databases and file servers use mmap() instead of standard read() system calls when reading large files?',
    options: [
      'A) Standard read(fd, user_buf, len) copies the file block from Disk -> Kernel Page Cache (via DMA) and then requires the CPU to copy the bytes a SECOND time from Kernel Page Cache -> User-Space buffer (plus a syscall mode switch on every read); mmap() maps the Kernel Page Cache frames directly into the process\'s virtual page table, eliminating the extra user-space buffer copy and syscall overhead!',
      'B) mmap() bypasses virtual memory and disables page tables.',
      'C) read() does not use the Kernel Page Cache.',
      'D) mmap() loads the entire 100 GB file into RAM before returning.'
    ],
    correctAnswer: 'A',
    explanation: 'With standard read(), data is first loaded into the OS Kernel Page Cache and then copied across the kernel/user boundary into your user-space buffer (double buffering + syscall context switches). With mmap(), the OS maps the Kernel Page Cache frames directly into your process\'s virtual address space via demand paging—allowing your code to read the file via normal memory pointers with zero user-kernel buffer copying!'
  },
  {
    id: 'os-test-q50',
    questionNumber: 50,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q50: [Disk Still 100% Full After Deleting a 50 GB Log File!] A production Linux server\'s disk hits 100% capacity because /var/log/app.log grew to 50 GB. An engineer runs rm /var/log/app.log; ls confirms the file is gone, yet df -h still shows the disk is 100% full until the running Node.js/Java app is restarted! Why?',
    question: 'A server\'s disk hits 100% because /var/log/app.log grew to 50 GB. An engineer runs rm /var/log/app.log. The file disappears from ls, yet df -h still reports the disk is 100% full until the running application process is restarted! Why?',
    options: [
      'A) rm moves files to the Trash folder on Linux servers.',
      'B) In Unix/Linux, rm calls unlink(), which removes the directory entry and decrements the inode\'s hard-link count to 0. However, the kernel ONLY frees the inode\'s 50 GB of data blocks when BOTH the hard-link count is 0 AND the open file-descriptor reference count is 0! Because the running app still held an open FD to that inode, the blocks remained allocated on disk until the process closed the FD (or restarted). (Tip: truncate -s 0 app.log frees space immediately without restarting!).',
      'C) The file system was mounted read-only.',
      'D) B+ Tree directory indexes are only updated on reboot.'
    ],
    correctAnswer: 'B',
    explanation: 'This is a classic production Linux troubleshooting question! A Unix inode tracks two reference counts: (1) i_nlink (number of directory hard links on disk) and (2) i_count (number of open file descriptors in the kernel\'s Open File Table). Running rm unlinks the filename (setting i_nlink = 0), so ls can no longer see it—but as long as the running application process keeps its file descriptor open (i_count > 0), the kernel keeps all 50 GB of disk blocks allocated! Truncating the file in place (`> /var/log/app.log` or `truncate -s 0`) reclaims the 50 GB immediately without restarting the service.'
  }
];

async function seedCoreCsOs() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Seeding for Core Computer Science: Operating Systems ---');
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

    // 2. Upsert Subject 3: Operating Systems (Complete OS in 1 Shot)
    const topicSlug = 'cs-os-complete-oneshot-mastery';
    const topicTitle = 'OS: Complete Operating Systems in 1 Shot (Placement & GATE Edition)';
    const topicOrder = 3;
    const durationMinutes = 933;
    const videoUrl = 'http://www.youtube.com/watch?v=3obEP8eLsCw';
    const videoTitle = 'Complete Operating Systems in 1 Shot (With Notes) || For Placement Interviews';
    const creatorName = 'CodeHelp - by Babbar';
    const creatorChannelUrl = 'https://www.youtube.com/@CodeHelp';

    const docLinks = [
      {
        title: 'Linux Kernel Official Documentation — Process Management, Virtual Memory & System Calls',
        url: 'https://docs.kernel.org/admin-guide/mm/index.html',
        link: 'https://docs.kernel.org/admin-guide/mm/index.html'
      }
    ];

    const shortDescription = 'Master Operating Systems from hardware boot to concurrency and virtual memory—Kernel architectures, Processes & Threads, CPU Scheduling, Process Synchronization (Semaphores, Mutexes), Deadlocks (Banker\'s Algorithm), Paging, TLB, Page Replacement, and Disk Scheduling—followed by a 50-question timed evaluation test.';
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
    const practiceJson = JSON.stringify(osEvaluationTest);

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

    await client.query('COMMIT');
    console.log('✅ Core Computer Science: OS One-Shot & 50-Question Timed Evaluation Test Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding Core CS OS failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedCoreCsOs();
