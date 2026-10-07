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

const summaryMarkdown = `### 📌 1. Why Object-Oriented Programming (OOP) Over Procedural Programming?
In procedural programming, data (global or loose local variables) and functions operate separately. Modeling 1,000 students requires maintaining disconnected arrays (\`id[]\`, \`age[]\`, \`name[]\`) with zero access protection—any function can accidentally corrupt global state. **Object-Oriented Programming (OOP)** models software around **Objects** that bundle **State (Data Members / Attributes)** and **Behavior (Member Functions / Methods)** into a single self-contained unit defined by a **Class** blueprint.

### 💡 2. Classes, Objects & Memory Layout Internals (Padding & Greedy Alignment)
* **Class vs. Object:** A **Class** is a user-defined blueprint that consumes **0 bytes of RAM** at compile time. An **Object** is a runtime instance of a class allocated on the **Stack** (\`Student s1;\`) or the **Heap** (\`Student* s2 = new Student();\`).
* **Why an Empty Class Has Size \`1 Byte\` (\`sizeof(Empty) == 1\`):** The C++ standard mandates that every distinct object instance must have a **unique memory address**. If an empty class had size \`0\`, two consecutive objects \`Empty a, b;\` on the stack would share the exact same address (\`&a == &b\`). Therefore, the compiler inserts 1 silent byte. (Exception: when an empty class is used as a base class, compilers apply **Empty Base Optimization — EBO**, reducing its base subobject contribution to \`0\` bytes!).
* **Struct/Class Padding & Greedy Alignment:** CPUs read memory in word-sized chunks (4 or 8 bytes) at aligned address multiples. A member of size K bytes must be placed at a memory offset divisible by K, and the total \`sizeof(Class)\` must be a multiple of the **largest member's alignment requirement**.
* **What Contributes to \`sizeof(Object)\`?**
  * Non-static data members + alignment padding bytes.
  * **\`vptr\` (Virtual Pointer):** \`8 bytes\` on 64-bit systems (\`4 bytes\` on 32-bit) added automatically if the class has one or more \`virtual\` functions.
  * **Excluded from \`sizeof(Object)\`:** Member functions (stored in the Code/Text segment) and \`static\` data members (stored in the Data/BSS segment) contribute **0 bytes** to individual objects.

\`\`\`cpp
#include <iostream>
using namespace std;

// Bad ordering: char(1) + pad(7) + double(8) + int(4) + char(1) + pad(3) = 24 bytes!
class Unoptimized {
  char a;
  double b;
  int c;
  char d;
};

// Optimal ordering (largest to smallest): double(8) + int(4) + char(1) + char(1) + pad(2) = 16 bytes!
class Optimized {
  double b;
  int c;
  char a;
  char d;
};
\`\`\`

### 💡 3. Access Modifiers, Getters/Setters & The \`this\` Pointer
* **\`private\` (Default in C++ \`class\`):** Accessible **only** inside the class's own member functions and \`friend\` functions/classes.
* **\`protected\`:** Accessible inside the class itself and inside **derived (child) classes**, but hidden from external code.
* **\`public\` (Default in C++ \`struct\`):** Accessible from anywhere.
* **The \`this\` Pointer:** A hidden constant pointer (\`ClassName* const this\`) automatically passed as an implicit first argument to every **non-static** member function, holding the memory address of the current object that invoked the method.

### 💡 4. Constructors, Destructors, Shallow vs. Deep Copy & Rule of Three/Five
* **Default & Parameterized Constructors:** Invoked automatically when an object is instantiated to initialize data members.
* **Member Initializer List (\`Student(int r, int &ref) : rollNo(r), refVar(ref) {}\`):** Executes **before** the constructor body. **Mandatory** for initializing:
  1. \`const\` non-static data members.
  2. Reference data members (\`int&\`).
  3. Member objects of another class that lack a default constructor.
  4. Base class constructors that require arguments.
* **Copy Constructor (\`Student(const Student &other)\`):**
  * **Why \`const Student &other\` Must Be Passed by Reference:** If passed by value (\`Student(Student other)\`), copying \`other\` into the parameter would itself call the Copy Constructor, causing **infinite recursion** (caught as a compile-time error)!
* **Shallow Copy vs. Deep Copy:**
  * The compiler-generated default Copy Constructor and Copy Assignment Operator (\`operator=\`) perform a **bitwise Shallow Copy**. If a class holds a dynamically allocated heap pointer (\`int* data = new int[100]\`), a shallow copy copies only the pointer address—so both objects point to the **same heap block**! When both objects go out of scope, their destructors call \`delete[] data\` twice on the same address, crashing with a **Double-Free (\`SIGABRT\`)** error!
  * **Deep Copy (Rule of Three):** Any class managing raw heap memory must explicitly define a custom **Destructor**, **Deep Copy Constructor** (allocating a separate \`new\` memory block and copying values), and **Copy Assignment Operator** (with a self-assignment guard \`if (this == &other) return *this;\`).

\`\`\`cpp
class Buffer {
  int* data;
  int size;
public:
  Buffer(int s) : size(s), data(new int[s]) {}

  // Deep Copy Constructor: Allocates independent heap memory
  Buffer(const Buffer& other) : size(other.size), data(new int[other.size]) {
    for (int i = 0; i < size; i++) data[i] = other.data[i];
  }

  // Safe Copy Assignment Operator with Self-Assignment Guard
  Buffer& operator=(const Buffer& other) {
    if (this == &other) return *this; // Prevent self-deletion on b1 = b1!
    delete[] data;
    size = other.size;
    data = new int[size];
    for (int i = 0; i < size; i++) data[i] = other.data[i];
    return *this;
  }

  ~Buffer() { delete[] data; }
};
\`\`\`

### 💡 5. Pillar 1 & 2: Encapsulation & Abstraction
* **Encapsulation (Data Hiding + Bundling):** Wrapping data members and member functions together inside a class while restricting direct external access to internal state (declaring all data members \`private\` and exposing validated \`public\` getters/setters).
* **Abstraction (Implementation Hiding):** Exposing only essential high-level interfaces to the user while hiding complex underlying implementation details. Achieved via **Abstract Classes** (classes containing at least one **Pure Virtual Function** \`virtual void pay(double amount) = 0;\`) and header/implementation separation.
* **Rules of Abstract Classes:**
  * You **cannot instantiate** an object of an Abstract Class (\`Shape s;\` is a compile error), though you **can** declare pointers and references to it (\`Shape* ptr = new Circle();\`).
  * If a derived class fails to override all pure virtual functions of its base class, the derived class **also becomes abstract**.

### 💡 6. Pillar 3: Inheritance, Constructor Order & The Diamond Problem
* **Modes of Inheritance:**
  * **\`public\` inheritance:** \`public\` stays \`public\`; \`protected\` stays \`protected\`. (Models an **IS-A** relationship).
  * **\`protected\` inheritance:** Both \`public\` and \`protected\` base members become \`protected\` in the derived class.
  * **\`private\` inheritance:** Both \`public\` and \`protected\` base members become \`private\` in the derived class.
  * Base \`private\` members are **never directly accessible** in the derived class regardless of inheritance mode.
* **Constructor vs. Destructor Order in Inheritance:**
  * **Constructors** run from **Top to Bottom** (**Base -> Member Objects (in declaration order) -> Derived**).
  * **Destructors** run in exact reverse order from **Bottom to Top** (**Derived -> Member Objects -> Base**).
* **The Diamond Problem & Virtual Inheritance:**
  * When \`B\` and \`C\` both inherit from \`A\`, and \`D\` inherits from both \`B\` and \`C\`, \`D\` receives **two separate copies** of \`A\`'s data members, causing compile-time ambiguity (\`d.x\` is ambiguous).
  * **Solution (\`class B : virtual public A\` and \`class C : virtual public A\`):** Adds a virtual base pointer (**\`vbptr\`**) so \`D\` contains only **one shared subobject of \`A\`**, and the **most-derived class (\`D\`)** becomes directly responsible for invoking \`A\`'s constructor!

### 💡 7. Pillar 4: Polymorphism, VTable / VPTR Internals & Virtual Destructors
* **Compile-Time (Static) Polymorphism (Early Binding):**
  1. **Function Overloading:** Same function name with different parameter types, count, or order. (Cannot overload by return type alone!).
  2. **Operator Overloading:** Customizing operators (\`+\`, \`==\`, \`<<\`, \`[]\`). Operators that **cannot** be overloaded: \`::\`, \`.\`, \`.*\`, \`?:\`, \`sizeof\`, \`typeid\`.
* **Run-Time (Dynamic) Polymorphism (Late Binding via \`virtual\` Functions):**
  * Achieved via **Method Overriding** (\`virtual\` in Base + \`override\` in Derived) accessed through a **Base class pointer or reference** (\`Base* ptr = new Derived(); ptr->speak();\`).
* **How \`vtable\` and \`vptr\` Work Under the Hood:**
  * **1. \`vtable\` (Virtual Method Table):** A static per-class lookup array of function pointers created at **compile time** in read-only memory for every polymorphic class.
  * **2. \`vptr\` (Virtual Pointer):** A hidden pointer (\`8 bytes\` on 64-bit) added inside **every object instance** of a polymorphic class. When an object's constructor runs, it sets \`this->vptr\` to point to that class's \`vtable\`.
  * **3. Dynamic Dispatch:** Calling \`ptr->speak()\` executes \`(*(ptr->vptr[index]))(ptr)\` at runtime in O(1) time, invoking \`Derived::speak()\`.
* **Why Base Destructors Must Always Be \`virtual\`:**
  * If you execute \`Base* ptr = new Derived(); delete ptr;\` and \`~Base()\` is **not** declared \`virtual\`, the compiler uses static binding and calls **only \`~Base()\`**, skipping \`~Derived()\` completely and leaking all heap resources allocated by \`Derived\`! Declaring \`virtual ~Base()\` routes \`delete ptr\` through the \`vtable\` so \`~Derived()\` runs first, followed by \`~Base()\`.

### 💡 8. \`static\`, \`const\`, \`friend\`, \`inline\` & SOLID Design Principles
* **\`static\` Members:** Shared across all instances of a class (\`static int count;\`). Initialized outside the class definition. \`static\` member functions have **no \`this\` pointer**, can only access \`static\` members, and cannot be \`virtual\` or \`const\`.
* **\`friend\` Functions & Classes:** Can access \`private\` and \`protected\` members of a class. Friendship is **not mutual**, **not inherited** by child classes, and **not transitive**.
* **SOLID Principles for Production Object-Oriented Design:**
  * **S — Single Responsibility Principle (SRP):** A class should have only one reason to change.
  * **O — Open/Closed Principle (OCP):** Software entities should be open for extension (via polymorphic interfaces) but closed for modification.
  * **L — Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types without breaking program invariants.
  * **I — Interface Segregation Principle (ISP):** Clients should not be forced to implement fat interfaces they do not use.
  * **D — Dependency Inversion Principle (DIP):** High-level modules should depend on abstractions (interfaces), not concrete low-level implementations.`;

const oopEvaluationTest = [
  // SECTION A: THEORY & CONCEPT APPLICATION (QUESTIONS 1 TO 25)
  {
    id: 'oop-test-q1',
    questionNumber: 1,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q1: Why is sizeof(EmptyClass) equal to 1 byte in C++, whereas an empty base class subobject inside a derived class often adds 0 bytes?',
    question: 'Why is sizeof(EmptyClass) equal to 1 byte in C++, whereas an empty base class subobject inside a derived class with an int member often adds 0 bytes (sizeof(Derived) == 4)?',
    options: [
      'A) C++ requires every standalone object in memory to have a unique address, while compilers apply Empty Base Optimization (EBO) when an empty class is inherited.',
      'B) The 1 byte stores a hidden virtual pointer (vptr) for Object.prototype.',
      'C) The 1 byte stores the null terminator of the class name for RTTI.',
      'D) Standalone empty classes are allocated on the Heap, whereas derived classes are allocated on the Stack.'
    ],
    correctAnswer: 'A',
    explanation: 'The C++ standard mandates that two distinct standalone objects (e.g., Empty e1, e2; or Empty arr[2];) must have distinct memory addresses (&e1 != &e2). If sizeof(Empty) were 0, pointer arithmetic and address uniqueness would break. However, when Empty is inherited by a Derived class that already has data members (like int x), the compiler applies Empty Base Optimization (EBO), collapsing the base subobject overhead to 0 bytes.'
  },
  {
    id: 'oop-test-q2',
    questionNumber: 2,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q2: Class B inherits from Class A using protected inheritance (class B : protected A), and Class C inherits from Class B using public inheritance (class C : public B). What is the accessibility of a public member x of Class A inside Class C and inside main()?',
    question: 'Class B inherits from Class A using protected inheritance (class B : protected A), and Class C inherits from Class B using public inheritance (class C : public B). What is the accessibility of a public member x of Class A inside Class C and inside main()?',
    options: [
      'A) Accessible inside Class C (as protected), but inaccessible inside main().',
      'B) Inaccessible in both Class C and main().',
      'C) Accessible in both Class C and main().',
      'D) Accessible inside Class C (as private), and inaccessible in any class derived from C.'
    ],
    correctAnswer: 'A',
    explanation: 'When B inherits from A via protected inheritance, A\'s public member x becomes protected inside B. When C inherits publicly from B, B\'s protected member x remains protected inside C—so C\'s member functions can access x directly, but external code in main() cannot access x on an instance of B or C.'
  },
  {
    id: 'oop-test-q3',
    questionNumber: 3,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q3: Why must the parameter of a C++ Copy Constructor be passed by reference (e.g., Sample(const Sample &obj)) rather than by value (Sample(Sample obj))?',
    question: 'Why must the parameter of a C++ Copy Constructor be passed by reference (e.g., Sample(const Sample &obj)) rather than by value (Sample(Sample obj))?',
    options: [
      'A) Passing by value would require copying the argument into the parameter, which itself invokes the Copy Constructor, leading to infinite recursion (compile-time error).',
      'B) Passing by value only copies public members and ignores private members.',
      'C) Passing by value allocates the object on the Heap instead of the Stack.',
      'D) Passing by value prevents the destructor from being called when the function exits.'
    ],
    correctAnswer: 'A',
    explanation: 'In C++, passing an object by value to any function initializes the formal parameter by calling the class\'s Copy Constructor. If the Copy Constructor itself took its argument by value (Sample(Sample obj)), calling it would require calling Sample(Sample obj) to copy the argument, creating an infinite chain of copy constructor calls. Therefore, the C++ compiler rejects pass-by-value copy constructors as a compile error.'
  },
  {
    id: 'oop-test-q4',
    questionNumber: 4,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q4: Which statement accurately describes when and where the Virtual Method Table (vtable) and Virtual Pointer (vptr) are created and initialized in C++?',
    question: 'Which statement accurately describes when and where the Virtual Method Table (vtable) and Virtual Pointer (vptr) are created and initialized in C++?',
    options: [
      'A) Both vtable and vptr are created at runtime on the Heap when new is called.',
      'B) One vtable per polymorphic class is generated at compile time in read-only memory, while each object instance contains its own vptr initialized at runtime inside the constructor.',
      'C) One vptr per class is stored as a static pointer, while each object stores its own private copy of the vtable.',
      'D) Both vtable and vptr exist only at compile time and are stripped out before runtime.'
    ],
    correctAnswer: 'B',
    explanation: 'The compiler creates a single static vtable (an array of function pointers) per polymorphic class at compile time (stored in read-only data/rodata). Every object of that class contains a hidden vptr member variable (8 bytes on 64-bit). At runtime, when an object\'s constructor executes, compiler-injected prologue code sets the object\'s vptr to point to its class\'s vtable.'
  },
  {
    id: 'oop-test-q5',
    questionNumber: 5,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q5: If a Base class constructor calls a virtual function display() that is overridden in the Derived class, which version of display() is executed when instantiating a Derived object?',
    question: 'If a Base class constructor calls a virtual function display() that is overridden in the Derived class, which version of display() is executed when instantiating a Derived object?',
    options: [
      'A) Derived::display(), because dynamic dispatch always uses the most-derived type.',
      'B) Base::display(), because while the Base constructor is running, the Derived subobject has not been constructed yet and vptr points to Base\'s vtable.',
      'C) It results in a compile-time error because virtual functions cannot be called inside constructors.',
      'D) It throws a runtime segmentation fault.'
    ],
    correctAnswer: 'B',
    explanation: 'During the construction of a Derived object, the Base constructor runs first before any Derived data members are initialized. While inside the Base constructor, the object\'s dynamic type is treated as Base (its vptr points to Base\'s vtable) so that uninitialized Derived members are never accessed. Once the Base constructor finishes and execution enters the Derived constructor, vptr is updated to point to Derived\'s vtable. The same rule applies in reverse inside ~Base().'
  },
  {
    id: 'oop-test-q6',
    questionNumber: 6,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q6: For which of the following class members is a Constructor Member Initializer List strictly mandatory (cannot be assigned inside the constructor body)?',
    question: 'For which of the following class members is a Constructor Member Initializer List strictly mandatory (cannot be assigned inside the constructor body)?\n1. Non-static const data members (const int id;)\n2. Reference data members (int &ref;)\n3. Member objects of a class that has no default constructor\n4. Static data members (static int count;)',
    options: [
      'A) 1 and 2 only',
      'B) 1, 2, and 3 only',
      'C) 1, 2, 3, and 4',
      'D) 2 and 4 only'
    ],
    correctAnswer: 'B',
    explanation: 'Non-static const members, reference members (T&), and member subobjects lacking a default constructor must be initialized before the constructor body begins—which is only possible via the Member Initializer List. Static data members (4) do not belong to individual instances and must be defined outside the class (or inline static), never in a constructor initializer list.'
  },
  {
    id: 'oop-test-q7',
    questionNumber: 7,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q7: Which set of C++ operators CANNOT be overloaded under any circumstances, and which set can ONLY be overloaded as non-static member functions (never as friend/global functions)?',
    question: 'Which set of C++ operators CANNOT be overloaded under any circumstances, and which set can ONLY be overloaded as non-static member functions (never as friend/global functions)?',
    options: [
      'A) Cannot overload: ::, ., .*, ?:, sizeof | Must be member functions: =, (), [], ->',
      'B) Cannot overload: =, (), [], -> | Must be member functions: <<, >>, +, -',
      'C) Cannot overload: new, delete, ->*, , | Must be member functions: ==, !=, <, >',
      'D) Cannot overload: ::, ?, [], -> | Must be member functions: +, -, *, /'
    ],
    correctAnswer: 'A',
    explanation: 'The scope resolution (::), member access (.), pointer-to-member (.*), ternary conditional (?:), and sizeof/typeid operators cannot be overloaded in C++. Furthermore, the assignment (=), function call (()), subscript ([]), and class member access (->) operators must be overloaded as non-static member functions to guarantee that the left-hand operand is always a class instance (*this).'
  },
  {
    id: 'oop-test-q8',
    questionNumber: 8,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q8: Can a Pure Virtual Destructor (virtual ~Base() = 0;) exist in C++, and what special rule applies to it?',
    question: 'Can a Pure Virtual Destructor (virtual ~Base() = 0;) exist in C++, and what special rule applies to it?',
    options: [
      'A) No, destructors can be virtual, but they can never be declared pure virtual (= 0).',
      'B) Yes, it makes the class abstract, and you MUST still provide a function body definition for ~Base() outside the class, otherwise the linker fails when a Derived object is destroyed.',
      'C) Yes, and providing a body for it is a syntax error because pure virtual functions cannot have bodies.',
      'D) Yes, and derived classes are prevented from defining their own destructors.'
    ],
    correctAnswer: 'B',
    explanation: 'Declaring virtual ~Base() = 0; is a valid way to make a class abstract when no other method needs to be pure virtual. However, unlike normal pure virtual functions, whenever a Derived object is destroyed, its destructor automatically chains a call to Base::~Base() at the end! If Base::~Base() has no function body definition, the linker throws an "undefined reference to Base::~Base()" error.'
  },
  {
    id: 'oop-test-q9',
    questionNumber: 9,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q9: Why does C++ forbid declaring a static member function as virtual or const (e.g., virtual static void foo() or static void bar() const)?',
    question: 'Why does C++ forbid declaring a static member function as virtual or const (e.g., virtual static void foo() or static void bar() const)?',
    options: [
      'A) Because static member functions are stored on the Stack instead of the Code segment.',
      'B) Because static member functions belong to the class rather than any object instance and therefore do not have a "this" pointer (which is required both to access vptr for virtual dispatch and to qualify "*this" as const).',
      'C) Because static functions can only return integer types.',
      'D) Because static functions are automatically inlined at compile time.'
    ],
    correctAnswer: 'B',
    explanation: 'A const member function qualifies the implicit this pointer as const ClassName* const this, and a virtual function relies on dereferencing this->vptr to look up the vtable at runtime. Because a static member function is invoked without an object instance and has no this pointer at all, neither virtual nor const has any meaning on a static function.'
  },
  {
    id: 'oop-test-q10',
    questionNumber: 10,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q10: Which of the following statements about the friend keyword in C++ is TRUE?',
    question: 'Which of the following statements about the friend keyword in C++ is TRUE?',
    options: [
      'A) If Class A is a friend of Class B, and Class B is a friend of Class C, then Class A automatically becomes a friend of Class C.',
      'B) If Class Base declares Function F as a friend, Function F automatically has access to private members of classes derived from Base.',
      'C) Friendship is neither mutual, nor transitive, nor inherited, and a friend declaration behaves identically whether placed in the private, protected, or public section of a class.',
      'D) A friend function receives an implicit this pointer just like a regular member function.'
    ],
    correctAnswer: 'C',
    explanation: 'In C++, friendship is explicitly granted, one-way (not symmetric/mutual), not transitive (friend of a friend is not a friend), and not inherited by derived classes. Because a friend function is not a member of the class, access specifiers (private/protected/public) do not affect where the friend declaration is placed inside the class body.'
  },
  {
    id: 'oop-test-q11',
    questionNumber: 11,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q11: What is "Object Slicing" in C++, and when does it occur?',
    question: 'What is "Object Slicing" in C++, and when does it occur?',
    options: [
      'A) When a Derived object is assigned or passed by VALUE to a Base object variable (Base b = d;), causing the Derived-specific data members to be sliced off and b\'s vptr to point to Base\'s vtable.',
      'B) When a Derived object is deleted through a Base pointer.',
      'C) When a dynamic_cast fails and returns nullptr.',
      'D) When an array of objects is split across two memory pages.'
    ],
    correctAnswer: 'A',
    explanation: 'When a Derived instance is copied by value into a standalone Base variable (Base b = derivedObj; or void fn(Base b)), Base\'s copy constructor runs. Because b only has enough memory allocated for sizeof(Base), all additional Derived member variables are permanently "sliced off," and b\'s vptr is set to Base\'s vtable—destroying polymorphic behavior. Passing by pointer (Base*) or reference (Base&) avoids object slicing.'
  },
  {
    id: 'oop-test-q12',
    questionNumber: 12,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q12: Class Base defines void fun() and void fun(int x). Class Derived (inheriting publicly from Base) defines void fun(double y). What happens if you call d.fun() (with no arguments) on a Derived object d?',
    question: 'Class Base defines void fun() and void fun(int x). Class Derived (inheriting publicly from Base) defines void fun(double y). What happens if you call d.fun() (with no arguments) on a Derived object d?',
    options: [
      'A) It calls Base::fun() normally via inheritance.',
      'B) It calls Derived::fun(0.0) via implicit conversion.',
      'C) Compile-time error due to Name Hiding: declaring any function named fun in Derived hides all overloaded versions of fun in Base (unless "using Base::fun;" is added in Derived).',
      'D) Runtime exception due to ambiguous overload resolution.'
    ],
    correctAnswer: 'C',
    explanation: 'In C++, overload resolution does NOT cross scope boundaries by default! As soon as the compiler finds the name "fun" inside Derived\'s scope, it stops searching Base\'s scope—hiding Base::fun() and Base::fun(int). Thus d.fun() fails to compile because Derived::fun(double) requires 1 argument. Bringing Base\'s overloads into Derived\'s scope via using Base::fun; fixes it.'
  },
  {
    id: 'oop-test-q13',
    questionNumber: 13,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q13: Which keyword allows a specific non-static data member of a class to be modified even inside a const member function (e.g., for caching or mutex locking)?',
    question: 'Which keyword allows a specific non-static data member of a class to be modified even inside a const member function (e.g., for caching or mutex locking)?',
    options: [
      'A) volatile',
      'B) mutable',
      'C) auto',
      'D) explicit'
    ],
    correctAnswer: 'B',
    explanation: 'Inside a const member function (int getValue() const), the this pointer has type const ClassName* const, preventing modification of any normal member variable. Declaring a member variable as mutable (e.g., mutable int accessCount; or mutable std::mutex mtx;) allows logical constness by permitting that specific member to be modified inside const methods.'
  },
  {
    id: 'oop-test-q14',
    questionNumber: 14,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q14: In Virtual Inheritance (where B and C virtually inherit from A, and D inherits from B and C), which class is responsible for calling the constructor of virtual base class A when an object of D is instantiated?',
    question: 'In Virtual Inheritance (where B and C virtually inherit from A, and D inherits from B and C), which class is responsible for calling the constructor of virtual base class A when an object of D is instantiated?',
    options: [
      'A) Class B, because it is listed first in D\'s inheritance list.',
      'B) Both B and C call A\'s constructor, and the second call overwrites the first.',
      'C) The most-derived class being instantiated (Class D) invokes A\'s constructor directly before B and C run, and the calls to A\'s constructor in B and C\'s initializer lists are ignored.',
      'D) Class A\'s constructor is not called in virtual inheritance.'
    ],
    correctAnswer: 'C',
    explanation: 'In virtual inheritance, there is only one shared A subobject inside D. If both B and C initialized A, A would be initialized twice with conflicting arguments! Therefore, the C++ standard specifies that the most-derived class (D) is solely responsible for initializing the virtual base class A before any non-virtual base constructors (B and C) run.'
  },
  {
    id: 'oop-test-q15',
    questionNumber: 15,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q15: What is the prerequisite for using dynamic_cast<Derived*>(basePtr) for safe downcasting, and what happens if the cast fails at runtime for a pointer vs. a reference?',
    question: 'What is the prerequisite for using dynamic_cast<Derived*>(basePtr) for safe downcasting, and what happens if the cast fails at runtime for a pointer vs. a reference?',
    options: [
      'A) Base must be polymorphic (have at least one virtual function); on failure, pointer cast returns nullptr while reference cast throws std::bad_cast.',
      'B) Base must have a default constructor; on failure, both pointer and reference casts return nullptr.',
      'C) Base must inherit from std::object; on failure, both throw std::runtime_error.',
      'D) No prerequisite is needed; dynamic_cast is resolved entirely at compile time.'
    ],
    correctAnswer: 'A',
    explanation: 'dynamic_cast relies on Run-Time Type Information (RTTI), which is stored in the class\'s vtable. Therefore, the Base class must be polymorphic (contain at least one virtual function). If basePtr actually points to a different derived type, dynamic_cast<Derived*>(basePtr) safely returns nullptr. Since a C++ reference cannot be null, dynamic_cast<Derived&>(baseRef) throws a std::bad_cast exception on failure.'
  },
  {
    id: 'oop-test-q16',
    questionNumber: 16,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q16: How does C++ bind default arguments on virtual functions when called through a Base pointer pointing to a Derived object?',
    question: 'How does C++ bind default arguments on virtual functions when called through a Base pointer pointing to a Derived object?',
    options: [
      'A) Both the function body and the default argument value are dynamically bound at runtime from the Derived class.',
      'B) Both the function body and the default argument value are statically bound at compile time from the Base class.',
      'C) The function body is dynamically bound at runtime from the Derived class, but the default argument value is statically bound at compile time from the Base pointer type!',
      'D) C++ prohibits default arguments on virtual functions.'
    ],
    correctAnswer: 'C',
    explanation: 'For runtime efficiency, C++ compilers determine default parameter values statically at compile time based on the static type of the pointer/reference (Base*), whereas the virtual function call itself is resolved dynamically at runtime via the vtable (Derived::fn). Hence, calling basePtr->fn() executes Derived\'s function body using Base\'s default parameter value!'
  },
  {
    id: 'oop-test-q17',
    questionNumber: 17,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q17: If a class declares its Destructor as private, what is the consequence for creating objects of that class?',
    question: 'If a class declares its Destructor as private, what is the consequence for creating objects of that class?',
    options: [
      'A) No objects of the class can ever be created on either the Stack or the Heap.',
      'B) Objects cannot be created as local Stack variables (compile error), and can only be allocated dynamically on the Heap via new and destroyed via a public member/friend function.',
      'C) Objects can only be created on the Stack, and Heap allocation via new fails.',
      'D) The compiler ignores the private specifier on destructors.'
    ],
    correctAnswer: 'B',
    explanation: 'For any local Stack object (or global/static object), the compiler automatically inserts an implicit destructor call when the variable goes out of scope—which fails to compile if ~MyClass() is private! However, Heap allocation (MyClass* p = new MyClass();) only calls the constructor, so it succeeds! To free the object, the class provides a public method like void destroy() { delete this; }.'
  },
  {
    id: 'oop-test-q18',
    questionNumber: 18,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q18: Why should single-argument constructors in C++ (such as Array(int size)) usually be marked with the explicit keyword?',
    question: 'Why should single-argument constructors in C++ (such as Array(int size)) usually be marked with the explicit keyword?',
    options: [
      'A) To allocate the object in CPU registers.',
      'B) To prevent the compiler from using that constructor for unintended implicit type conversions (such as Array arr = 10; or passing an int to a function expecting an Array).',
      'C) To make the constructor virtual.',
      'D) To prevent the class from being inherited.'
    ],
    correctAnswer: 'B',
    explanation: 'In C++, any constructor that can be called with a single argument acts as an implicit conversion operator from the parameter type to the class type (allowing bizarre code like Array a = 50; to silently construct a 50-element Array). Marking the constructor explicit forces developers to write explicit construction syntax Array a(50);.'
  },
  {
    id: 'oop-test-q19',
    questionNumber: 19,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q19: How does a C++11 Move Constructor (Buffer(Buffer&& other) noexcept) optimize performance compared to a Deep Copy Constructor?',
    question: 'How does a C++11 Move Constructor (Buffer(Buffer&& other) noexcept) optimize performance compared to a Deep Copy Constructor?',
    options: [
      'A) It compresses the heap array using zlib.',
      'B) When initialized from a temporary R-value object, it "steals" the internal heap pointer in O(1) time and sets other.data = nullptr instead of allocating new memory and copying elements in O(N) time.',
      'C) It skips calling the destructor of the moved-from object.',
      'D) It moves the object from the Heap to the Stack.'
    ],
    correctAnswer: 'B',
    explanation: 'When an object is initialized from a temporary R-value (which is about to be destroyed anyway), allocating a brand-new heap buffer and deep-copying N elements is wasteful. The Move Constructor copies the raw pointer address (this->data = other.data) in O(1) time and nulls out the source pointer (other.data = nullptr) so the temporary\'s destructor safely does nothing (delete[] nullptr is a safe no-op).'
  },
  {
    id: 'oop-test-q20',
    questionNumber: 20,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q20: Normally, an overriding virtual function in a Derived class must have the exact same return type as the Base class function. What is the one exception allowed by C++ ("Covariant Return Types")?',
    question: 'Normally, an overriding virtual function in a Derived class must have the exact same return type as the Base class function. What is the one exception allowed by C++ ("Covariant Return Types")?',
    options: [
      'A) Returning a double instead of a float.',
      'B) Returning a Derived* (or Derived&) when the Base virtual function returns a Base* (or Base&), such as in a virtual clone() method.',
      'C) Returning void when the Base function returns int.',
      'D) Returning a std::shared_ptr<Derived> when Base returns std::shared_ptr<Base>.'
    ],
    correctAnswer: 'B',
    explanation: 'C++ supports Covariant Return Types for raw pointers and references: if Base::clone() returns Base*, then Derived::clone() override is permitted to return Derived* because every Derived* is-a Base*. (Note: this built-in language rule applies only to raw pointers/references, not smart pointer templates).'
  },
  {
    id: 'oop-test-q21',
    questionNumber: 21,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q21: How does the C++ compiler distinguish between overloaded Pre-increment (++obj) and Post-increment (obj++) operators, and which one is more memory-efficient?',
    question: 'How does the C++ compiler distinguish between overloaded Pre-increment (++obj) and Post-increment (obj++) operators, and which one is more memory-efficient?',
    options: [
      'A) Post-increment takes a dummy int parameter (operator++(int)) and returns the old state by value (creating a temporary copy), making Pre-increment (operator++(), returning *this by reference) more efficient.',
      'B) Pre-increment takes a dummy int parameter and is slower than Post-increment.',
      'C) Post-increment must be a friend function while Pre-increment is a member function.',
      'D) Both have identical signatures and return types.'
    ],
    correctAnswer: 'A',
    explanation: 'Pre-increment has signature Counter& operator++()—it increments the object in place and returns *this by reference with zero temporary copies. Post-increment has signature Counter operator++(int) (with a dummy unused int parameter)—it must save a copy of the original state, increment *this, and return the saved copy by value.'
  },
  {
    id: 'oop-test-q22',
    questionNumber: 22,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q22: Why are C++ inline functions safer than C preprocessor macros (#define SQUARE(x) x*x), and when might a compiler ignore the inline keyword?',
    question: 'Why are C++ inline functions safer than C preprocessor macros (#define SQUARE(x) x*x), and when might a compiler ignore the inline keyword?',
    options: [
      'A) Macros perform blind text substitution without type checking or operator precedence safety (e.g., SQUARE(3+1) expands to 3+1*3+1 = 7), whereas inline functions enforce type safety and evaluate arguments once; compilers ignore inline for recursive or virtual calls.',
      'B) Macros are evaluated at runtime whereas inline functions run in the preprocessor.',
      'C) Compilers are strictly required by the C++ standard to inline every function marked inline.',
      'D) Inline functions cannot access private class members.'
    ],
    correctAnswer: 'A',
    explanation: 'Preprocessor macros perform blind text replacement before compilation—causing precedence bugs (3 + 1 * 3 + 1 = 7 instead of 16) and double-evaluation bugs (SQUARE(++a) increments a twice!). Inline functions are real functions with type checking and scope rules. Note that inline is only a hint/request to the compiler (and provides linkage rules for headers); compilers will not inline recursive functions or dynamically dispatched virtual calls.'
  },
  {
    id: 'oop-test-q23',
    questionNumber: 23,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q23: What happens to destructors if an exception is thrown halfway through executing a class\'s constructor body?',
    question: 'What happens to destructors if an exception is thrown halfway through executing a class\'s constructor body?',
    options: [
      'A) The destructor of the partially constructed class itself is called immediately.',
      'B) The destructor of the partially constructed class itself is NOT called, but the destructors of all already-constructed base classes and member subobjects ARE automatically called during stack unwinding.',
      'C) No destructors are called at all, and the program terminates immediately.',
      'D) Exceptions cannot be thrown inside constructors in C++.'
    ],
    correctAnswer: 'B',
    explanation: 'In C++, an object\'s destructor is only invoked if its constructor completed execution! If a constructor throws an exception midway, ~MyClass() is NOT called. However, C++ guarantees that any base class subobjects and member objects (like std::string or std::unique_ptr) that finished constructing before the throw WILL have their destructors called automatically during stack unwinding.'
  },
  {
    id: 'oop-test-q24',
    questionNumber: 24,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q24: When you overload operator new and operator delete inside a class, why are they implicitly static member functions even if you omit the static keyword?',
    question: 'When you overload operator new and operator delete inside a class, why are they implicitly static member functions even if you omit the static keyword?',
    options: [
      'A) Because operator new is called BEFORE the object is constructed (to allocate raw memory for it), and operator delete is called AFTER the destructor has already destroyed the object—so no valid "this" object exists inside either function!',
      'B) Because they are inherited from Object.prototype.',
      'C) Because they can only allocate static variables.',
      'D) They are not static; they require a valid this pointer.'
    ],
    correctAnswer: 'A',
    explanation: 'When new MyClass() runs, Step 1 calls operator new(sizeof(MyClass)) to allocate raw bytes BEFORE the constructor runs, and Step 2 invokes the constructor on that raw memory. When delete p runs, Step 1 invokes ~MyClass() to destroy the object, and Step 2 calls operator delete(void*) to free the raw bytes. Because no constructed object exists when operator new or operator delete runs, both are implicitly static!'
  },
  {
    id: 'oop-test-q25',
    questionNumber: 25,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q25: What is the key architectural difference between Aggregation and Composition in Object-Oriented Design?',
    question: 'What is the key architectural difference between Aggregation and Composition in Object-Oriented Design?',
    options: [
      'A) Aggregation is an "IS-A" relationship, while Composition is a "HAS-A" relationship.',
      'B) Both model "HAS-A" relationships, but in Composition (strong ownership, e.g., House and Room) the part\'s lifecycle is strictly bound to the whole, whereas in Aggregation (weak ownership, e.g., Department and Professor) the part can exist independently if the container is destroyed.',
      'C) Composition requires multiple inheritance, while Aggregation uses friend classes.',
      'D) Aggregation only works with primitive types.'
    ],
    correctAnswer: 'B',
    explanation: 'Both Aggregation and Composition represent "HAS-A" associations. In Composition ("part-of", e.g., a Car owning an Engine member object by value/unique_ptr), destroying the Car automatically destroys the Engine. In Aggregation (e.g., a Department holding pointers/references to Professor objects), destroying the Department does not destroy the Professors.'
  },

  // SECTION B: NUMERICAL, MEMORY LAYOUT & CODE EXECUTION MATH (QUESTIONS 26 TO 40)
  {
    id: 'oop-test-q26',
    questionNumber: 26,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q26: [Memory Alignment Math] On a standard 64-bit system (char = 1B, int = 4B, double = 8B), what is sizeof(SensorPacket) for the class below?',
    question: 'On a standard 64-bit system (char = 1B, int = 4B, double = 8B), what is sizeof(SensorPacket) for the class below?\n\nclass SensorPacket {\n  char status;      // 1 byte\n  double reading;   // 8 bytes\n  int sensorId;     // 4 bytes\n  char checksum;    // 1 byte\n};',
    options: [
      'A) 14 bytes',
      'B) 16 bytes',
      'C) 24 bytes',
      'D) 32 bytes'
    ],
    correctAnswer: 'C',
    explanation: 'Step-by-step offset calculation: 1) status (char) at offset 0 (1 byte). 2) reading (double, 8B) requires an offset divisible by 8 -> 7 padding bytes added at offsets 1..7, reading placed at offsets 8..15 (total = 16B). 3) sensorId (int, 4B) requires offset divisible by 4 -> placed at offsets 16..19 (total = 20B). 4) checksum (char, 1B) placed at offset 20 (total = 21B). 5) Total struct size must be a multiple of the largest alignment (8B) -> rounded up from 21 to 24 bytes (3 trailing padding bytes).'
  },
  {
    id: 'oop-test-q27',
    questionNumber: 27,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q27: [Memory Optimization Math] If you reorder the members of SensorPacket from Q26 in descending order of size (double, int, char, char), how many Megabytes (MB) of RAM are saved when allocating an array of 1,000,000 (10^6) SensorPacket objects?',
    question: 'If you reorder the members of SensorPacket from Q26 in descending order of size (double reading; int sensorId; char status; char checksum;), what is the new sizeof(SensorPacket), and how much RAM is saved across an array of 1,000,000 (10^6) objects?',
    options: [
      'A) New size = 16 bytes; RAM saved = 8,000,000 bytes (~8 MB)',
      'B) New size = 14 bytes; RAM saved = 10,000,000 bytes (~10 MB)',
      'C) New size = 20 bytes; RAM saved = 4,000,000 bytes (~4 MB)',
      'D) New size = 24 bytes; RAM saved = 0 bytes'
    ],
    correctAnswer: 'A',
    explanation: 'With members ordered as double(8B, offsets 0..7) + int(4B, offsets 8..11) + char(1B, offset 12) + char(1B, offset 13) + 2 bytes tail padding (to reach a multiple of 8), the new sizeof(SensorPacket) is 16 bytes instead of 24 bytes! Saving 8 bytes per object across 1,000,000 objects saves exactly 8,000,000 bytes (~8 MB) of RAM.'
  },
  {
    id: 'oop-test-q28',
    questionNumber: 28,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q28: [Polymorphic sizeof Math] On a 64-bit architecture (pointers = 8B, int = 4B, char = 1B), what is sizeof(Widget) for the class below?',
    question: 'On a 64-bit architecture (pointers = 8B, int = 4B, char = 1B), what is sizeof(Widget) for the class below?\n\nclass Widget {\n  int id;\n  char tag;\n  static double sharedMetric;\npublic:\n  virtual void render();\n  virtual void update();\n};',
    options: [
      'A) 8 bytes',
      'B) 16 bytes',
      'C) 24 bytes',
      'D) 32 bytes'
    ],
    correctAnswer: 'B',
    explanation: '1) Even though there are 2 virtual functions, a class has only ONE vptr (8 bytes on a 64-bit system, placed at offsets 0..7). 2) static double sharedMetric is stored in the static data segment and adds 0 bytes to the object. 3) int id (4B) is placed at offsets 8..11, and char tag (1B) at offset 12 (total = 13 bytes). 4) Rounding 13 up to the nearest multiple of the largest alignment (8 bytes for vptr) adds 3 padding bytes = 16 bytes.'
  },
  {
    id: 'oop-test-q29',
    questionNumber: 29,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Hard',
    title: 'Q29: [Multiple Inheritance vptr Math] On a 64-bit system (pointers = 8B, int = 4B), what is sizeof(Derived) for the multiple inheritance hierarchy below?',
    question: 'On a 64-bit system (pointers = 8B, int = 4B), what is sizeof(Derived) for the multiple inheritance hierarchy below?\n\nclass Base1 {\n  int a;\n  virtual void f1() {}\n};\nclass Base2 {\n  int b;\n  virtual void f2() {}\n};\nclass Derived : public Base1, public Base2 {\n  int c;\n};',
    options: [
      'A) 20 bytes',
      'B) 24 bytes',
      'C) 32 bytes',
      'D) 40 bytes'
    ],
    correctAnswer: 'C',
    explanation: 'In standard 64-bit ABI (Itanium C++ ABI / GCC / Clang) or MSVC: Base1 has vptr1 (8B) + int a (4B) = 12B (padded to 16B standalone). Base2 has vptr2 (8B) + int b (4B) = 12B (padded to 16B). When Derived inherits from both Base1 and Base2, it contains Base1\'s vptr1 (8B) + a (4B) + pad(4B) = 16B, followed by Base2\'s vptr2 (8B) + b (4B), and int c (4B) packs into Base2\'s tail padding (or brings total to 32 bytes) -> 32 bytes total!'
  },
  {
    id: 'oop-test-q30',
    questionNumber: 30,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Hard',
    title: 'Q30: [Pointer Offset Upcasting Math] Suppose an object d of class Derived (from Q29, where sizeof(Base1) == 16) is allocated at memory address 0x1000. If we execute Base1* p1 = &d; and Base2* p2 = &d;, what addresses do p1 and p2 hold?',
    question: 'Suppose an object d of class Derived (inheriting from Base1 of size 16 bytes, followed by Base2 of size 16 bytes) is allocated at memory address 0x1000. If we execute Base1* p1 = &d; and Base2* p2 = &d;, what numeric addresses do p1 and p2 hold?',
    options: [
      'A) p1 = 0x1000, p2 = 0x1000',
      'B) p1 = 0x1000, p2 = 0x1010 (offset by +16 bytes so p2 points directly to the Base2 subobject inside d)',
      'C) p1 = 0x1010, p2 = 0x1000',
      'D) Upcasting to the second base class is a compile-time error.'
    ],
    correctAnswer: 'B',
    explanation: 'Inside a Derived object starting at 0x1000, the Base1 subobject occupies bytes 0x1000..0x100F (16 bytes), and the Base2 subobject starts immediately after at 0x1010 (0x1000 + 16 = 0x1010 in hex). Therefore, when upcasting Base2* p2 = &d;, the compiler automatically adjusts the pointer address by +16 bytes (0x1010) so p2 points directly to the start of the Base2 subobject!'
  },
  {
    id: 'oop-test-q31',
    questionNumber: 31,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q31: [Constructor/Destructor Call Count] How many times are Base\'s constructor and Derived\'s constructor called in the code snippet below?',
    question: 'How many times are Base\'s constructor and Derived\'s constructor called in total during the execution of main()?\n\nclass Base { public: Base() {} virtual ~Base() {} };\nclass Derived : public Base { public: Derived() {} ~Derived() {} };\n\nint main() {\n  Base bArr[2];\n  Base* ptrArr[3];\n  Derived* dPtr = new Derived[2];\n  delete[] dPtr;\n  return 0;\n}',
    options: [
      'A) Base constructor: 4 times | Derived constructor: 2 times',
      'B) Base constructor: 7 times | Derived constructor: 2 times',
      'C) Base constructor: 2 times | Derived constructor: 2 times',
      'D) Base constructor: 5 times | Derived constructor: 5 times'
    ],
    correctAnswer: 'A',
    explanation: 'Let\'s count carefully: 1) Base bArr[2]; constructs 2 Base objects -> Base ctor called 2 times. 2) Base* ptrArr[3]; declares an array of 3 uninitialized pointers (NOT objects!) -> 0 constructors called! 3) new Derived[2] constructs 2 Derived objects; each Derived object first calls Base\'s constructor (+2) and then Derived\'s constructor (+2). Total: Base constructor = 2 + 2 = 4 times; Derived constructor = 2 times.'
  },
  {
    id: 'oop-test-q32',
    questionNumber: 32,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Hard',
    title: 'Q32: [Copy Constructor Count Math] Assuming compiler copy elision (RVO) is disabled (-fno-elide-constructors) and no move constructor is defined, how many times is the Copy Constructor of Widget invoked in the code below?',
    question: 'Assuming compiler copy elision is disabled (-fno-elide-constructors) and no move constructor is defined, how many times is the Copy Constructor of Widget invoked when main() runs?\n\nWidget process(Widget u) {\n  Widget v(u);\n  Widget w = v;\n  return w;\n}\nint main() {\n  Widget x;\n  Widget y = process(x);\n  return 0;\n}',
    options: [
      'A) 2 times',
      'B) 3 times',
      'C) 4 times',
      'D) 5 times'
    ],
    correctAnswer: 'D',
    explanation: 'Without copy elision: 1) Passing x by value into parameter u calls Copy Ctor (#1). 2) Widget v(u); calls Copy Ctor (#2). 3) Widget w = v; is declaration-initialization (NOT assignment!), which calls Copy Ctor (#3). 4) return w; copies w into the temporary return slot (#4). 5) Initializing Widget y from the returned temporary calls Copy Ctor (#5). Total = 5 Copy Constructor invocations!'
  },
  {
    id: 'oop-test-q33',
    questionNumber: 33,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q33: [Static Counter Trace] What is the exact numerical output printed by the program below?',
    question: 'What is the exact numerical output printed by the program below?\n\nclass Tracker {\npublic:\n  static int live;\n  Tracker() { live++; }\n  Tracker(const Tracker&) { live++; }\n  ~Tracker() { live--; }\n};\nint Tracker::live = 0;\n\nint main() {\n  Tracker t1;\n  {\n    Tracker t2 = t1;\n    Tracker* t3 = new Tracker();\n    cout << Tracker::live << " ";\n  }\n  cout << Tracker::live;\n  return 0;\n}',
    options: [
      'A) 3 1',
      'B) 3 2',
      'C) 2 1',
      'D) 3 3'
    ],
    correctAnswer: 'B',
    explanation: '1) Tracker t1; increments live to 1. 2) Inside the inner block, Tracker t2 = t1; calls the Copy Constructor, incrementing live to 2. 3) Tracker* t3 = new Tracker(); allocates an object on the Heap, incrementing live to 3. The first cout prints 3. 4) When the inner block exits, Stack object t2 is destroyed (~Tracker() decrements live to 2), but Heap object *t3 was never deleted (`delete t3` was not called), so *t3 remains alive on the Heap! The second cout prints 2. Output: "3 2".'
  },
  {
    id: 'oop-test-q34',
    questionNumber: 34,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Hard',
    title: 'Q34: [Virtual Dispatch + Default Parameter Math] What is the exact numerical output of the C++ program below?',
    question: 'What is the exact numerical output of the C++ program below?\n\nclass Base {\npublic:\n  virtual int compute(int factor = 5) {\n    return factor * 2;\n  }\n};\nclass Derived : public Base {\npublic:\n  int compute(int factor = 10) override {\n    return factor * 4;\n  }\n};\nint main() {\n  Derived d;\n  Base* ptr = &d;\n  cout << ptr->compute() << " " << d.compute();\n  return 0;\n}',
    options: [
      'A) 40 40',
      'B) 10 40',
      'C) 20 40',
      'D) 20 20'
    ],
    correctAnswer: 'C',
    explanation: '1) For ptr->compute(): Since ptr has static type Base*, the compiler binds the default argument from Base (factor = 5) at compile time, but dispatches the virtual call at runtime to Derived::compute(5), returning 5 * 4 = 20! 2) For d.compute(): Since d has static type Derived, it uses Derived\'s default argument (factor = 10) and calls Derived::compute(10), returning 10 * 4 = 40. Output: "20 40".'
  },
  {
    id: 'oop-test-q35',
    questionNumber: 35,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Hard',
    title: 'Q35: [Virtual Diamond Inheritance Value Trace] What is the exact integer printed by the program below?',
    question: 'What is the exact integer printed by the program below?\n\nclass A {\npublic:\n  int val;\n  A(int v = 10) : val(v) {}\n};\nclass B : virtual public A {\npublic:\n  B() : A(20) { val += 2; }\n};\nclass C : virtual public A {\npublic:\n  C() : A(30) { val += 5; }\n};\nclass D : public B, public C {\npublic:\n  D() { val += 1; }\n};\nint main() {\n  D obj;\n  cout << obj.val;\n  return 0;\n}',
    options: [
      'A) 18',
      'B) 28',
      'C) 38',
      'D) 58'
    ],
    correctAnswer: 'A',
    explanation: 'In virtual inheritance, the most-derived class (D) is responsible for calling the virtual base A\'s constructor, and the calls A(20) in B and A(30) in C are ignored! Since D() does not explicitly specify an A constructor in its initializer list, A\'s default constructor A(10) runs first, setting val = 10. Next, B\'s constructor body runs: val += 2 (12). Next, C\'s constructor body runs: val += 5 (17). Finally, D\'s constructor body runs: val += 1 (18). Output: 18.'
  },
  {
    id: 'oop-test-q36',
    questionNumber: 36,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q36: [Member Initializer Order Trap] What is the exact output of the C++ code below?',
    question: 'What is the exact output of the C++ code below?\n\nclass Test {\n  int a;\n  int b;\npublic:\n  Test(int val) : b(val), a(b * 2) {}\n  void print() { cout << b << " " << a; }\n};\nint main() {\n  Test t(10);\n  t.print();\n}',
    options: [
      'A) 10 20',
      'B) 20 10',
      'C) b is 10, but a is initialized with a garbage/indeterminate value because a is declared before b in the class body and therefore initialized BEFORE b!',
      'D) Compile-time error: initializer list order must match declaration order.'
    ],
    correctAnswer: 'C',
    explanation: 'In C++, class data members are ALWAYS initialized in the exact order they are declared inside the class definition (int a; then int b;), NOT the order written in the constructor\'s Member Initializer List! Therefore, a(b * 2) executes FIRST while b still holds uninitialized garbage memory, and b(10) executes second.'
  },
  {
    id: 'oop-test-q37',
    questionNumber: 37,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q37: [#pragma pack(1) vs. Natural Alignment Math] On a 64-bit system, what is the byte difference between the naturally aligned size and the #pragma pack(1) size of class Header { char v; int len; short flags; double ts; }?',
    question: 'On a 64-bit system (char = 1B, short = 2B, int = 4B, double = 8B), what is the byte difference between the naturally aligned sizeof(Header) and the #pragma pack(1) tightly packed sizeof(Header) for: class Header { char v; int len; short flags; double ts; };?',
    options: [
      'A) Natural = 24 bytes, Packed = 15 bytes -> Difference = 9 bytes',
      'B) Natural = 16 bytes, Packed = 15 bytes -> Difference = 1 byte',
      'C) Natural = 32 bytes, Packed = 16 bytes -> Difference = 16 bytes',
      'D) Natural = 20 bytes, Packed = 15 bytes -> Difference = 5 bytes'
    ],
    correctAnswer: 'A',
    explanation: '1) With #pragma pack(1), zero padding is inserted: 1 (char) + 4 (int) + 2 (short) + 8 (double) = 15 bytes. 2) With natural alignment: v(1B at 0) + pad(3B) + len(4B at 4..7) + flags(2B at 8..9) + pad(6B at 10..15 so double aligns on 16) + ts(8B at 16..23) = 24 bytes. Difference = 24 - 15 = 9 bytes.'
  },
  {
    id: 'oop-test-q38',
    questionNumber: 38,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q38: [Construction & Destruction Sequence Trace] What exact string of digits is printed when main() executes and exits?',
    question: 'What exact string of digits is printed when main() executes and exits?\n\nstruct M { M() { cout << "1"; } ~M() { cout << "2"; } };\nstruct Base { Base() { cout << "3"; } ~Base() { cout << "4"; } };\nstruct Derived : public Base {\n  M member;\n  Derived() { cout << "5"; }\n  ~Derived() { cout << "6"; }\n};\nint main() { Derived d; return 0; }',
    options: [
      'A) 315624',
      'B) 135642',
      'C) 351624',
      'D) 531426'
    ],
    correctAnswer: 'A',
    explanation: 'When Derived d is constructed: 1) Base class constructor runs first -> prints "3". 2) Member objects (M member) are constructed next -> prints "1". 3) Derived constructor body runs last -> prints "5" (so far: "315"). When d goes out of scope, destructors run in exact reverse order: 1) ~Derived() body runs first -> prints "6". 2) Member destructor ~M() runs next -> prints "2". 3) ~Base() runs last -> prints "4". Total output: "315624".'
  },
  {
    id: 'oop-test-q39',
    questionNumber: 39,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Hard',
    title: 'Q39: [Bit-Fields & Zero-Width Alignment Math] Assuming unsigned int is 4 bytes (32 bits), what is sizeof(RegisterFlags) for the struct below?',
    question: 'Assuming unsigned int is 4 bytes (32 bits), what is sizeof(RegisterFlags) for the struct below?\n\nstruct RegisterFlags {\n  unsigned int mode : 4;\n  unsigned int enable : 1;\n  unsigned int : 0; // Zero-width unnamed bit-field\n  unsigned int status : 6;\n};',
    options: [
      'A) 2 bytes',
      'B) 4 bytes',
      'C) 8 bytes',
      'D) 12 bytes'
    ],
    correctAnswer: 'C',
    explanation: 'Normally, mode (4 bits), enable (1 bit), and status (6 bits) = 11 bits would easily fit inside a single 4-byte unsigned int allocation unit. However, an unnamed zero-width bit-field (unsigned int : 0;) instructs the compiler to force padding up to the next storage unit boundary! Therefore, mode and enable occupy the first 4-byte unsigned int, and status is forced into a second 4-byte unsigned int: 4 + 4 = 8 bytes.'
  },
  {
    id: 'oop-test-q40',
    questionNumber: 40,
    type: 'mcq',
    category: 'Numerical & Memory Calculation',
    difficulty: 'Moderate',
    title: 'Q40: [Object Slicing vs. Reference Dispatch Math] What is the numerical output of the program below?',
    question: 'What is the numerical output of the program below?\n\nclass Account {\npublic:\n  virtual int getInterest() { return 4; }\n};\nclass SavingsAccount : public Account {\npublic:\n  int getInterest() override { return 7; }\n};\nint byVal(Account a) { return a.getInterest(); }\nint byRef(Account& a) { return a.getInterest(); }\n\nint main() {\n  SavingsAccount sa;\n  cout << byVal(sa) + byRef(sa);\n  return 0;\n}',
    options: [
      'A) 8',
      'B) 11',
      'C) 14',
      'D) Compile-time error'
    ],
    correctAnswer: 'B',
    explanation: '1) In byVal(sa), sa is passed by VALUE into Account a, causing Object Slicing! Inside byVal, a is a pure Account instance whose vptr points to Account\'s vtable, so a.getInterest() returns 4. 2) In byRef(sa), sa is passed by reference (Account& a), preserving polymorphic dynamic dispatch via sa\'s vptr, so a.getInterest() calls SavingsAccount::getInterest() and returns 7. Sum = 4 + 7 = 11.'
  },

  // SECTION C: REAL-WORLD ENGINEERING & DESIGN SCENARIOS (QUESTIONS 41 TO 50)
  {
    id: 'oop-test-q41',
    questionNumber: 41,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q41: [Production Memory Leak Diagnosis] In a backend service, ImageProcessor* proc = new JpegProcessor(); processes a 50 MB image buffer allocated in JpegProcessor\'s constructor and then executes delete proc;. Over 1,000 requests, server RAM usage balloons by 50 GB and crashes. What is the root cause and fix?',
    question: 'In a backend service, ImageProcessor* proc = new JpegProcessor(); allocates a 50 MB heap buffer inside JpegProcessor() and frees it inside ~JpegProcessor(). After each request, delete proc; is called, yet server RAM leaks 50 MB per request. What is the root cause and fix?',
    options: [
      'A) delete cannot free objects larger than 1 MB; free() must be used instead.',
      'B) The base class destructor ~ImageProcessor() was not declared virtual, causing delete proc; to statically invoke only ~ImageProcessor() and skip ~JpegProcessor() entirely!',
      'C) JpegProcessor inherited privately instead of publicly.',
      'D) The constructor of ImageProcessor was not declared virtual.'
    ],
    correctAnswer: 'B',
    explanation: 'Deleting a derived object through a base class pointer (delete proc;) when the base class has a non-virtual destructor causes undefined behavior where only ~ImageProcessor() runs and ~JpegProcessor() is completely skipped—leaking the 50 MB buffer on every request! Adding virtual ~ImageProcessor() {} to the base class fixes the leak immediately.'
  },
  {
    id: 'oop-test-q42',
    questionNumber: 42,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q42: [Double-Free Crash Diagnosis] A developer creates a StringWrapper class with a char* buf member allocated via new char[len] and freed in ~StringWrapper(). Passing a StringWrapper object by value to a logging function causes the program to crash with "free(): double free detected in tcache" when main() exits. Why?',
    question: 'A developer creates a StringWrapper class with a char* buf member allocated via new char[len] and freed in ~StringWrapper(). Passing a StringWrapper object by value to a logging function void log(StringWrapper s) causes the program to crash with "double free detected" when main() exits. Why?',
    options: [
      'A) Because the developer did not define a custom Deep Copy Constructor, so passing s by value used the compiler\'s default Shallow Copy Constructor—causing both s and the original object to point to the same char* address and call delete[] on it twice!',
      'B) Because char* arrays must be freed with delete instead of delete[].',
      'C) Because destructors cannot be called inside main().',
      'D) Because logging functions must be declared friend.'
    ],
    correctAnswer: 'A',
    explanation: 'When StringWrapper s is passed by value to log(StringWrapper s), the compiler-synthesized Shallow Copy Constructor copies the pointer value s.buf = orig.buf. When log() finishes, ~StringWrapper() runs on s and frees buf! Later, when main() exits, ~StringWrapper() runs on orig and calls delete[] on the already-freed address. Implementing a Deep Copy Constructor (or passing const StringWrapper& by reference) prevents this crash.'
  },
  {
    id: 'oop-test-q43',
    questionNumber: 43,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q43: [Self-Assignment Bug in operator=] In an overloaded copy assignment operator (operator=), a developer writes: delete[] this->data; this->data = new int[rhs.size]; memcpy(this->data, rhs.data, ...); without checking if (this == &rhs). What happens if client code executes arr[i] = arr[j] when i == j?',
    question: 'In an overloaded copy assignment operator, a developer writes: delete[] this->data; this->data = new int[rhs.size]; memcpy(this->data, rhs.data, ...); without checking if (this == &rhs). What happens if client code executes arr[i] = arr[j] when i == j?',
    options: [
      'A) It works normally with a minor performance penalty.',
      'B) Since this and &rhs refer to the exact same object, delete[] this->data frees rhs.data BEFORE memcpy copies from it—resulting in use-after-free memory corruption!',
      'C) The compiler automatically skips operator= when both operands are the same object.',
      'D) It throws a compile-time error.'
    ],
    correctAnswer: 'B',
    explanation: 'When a = a (or arr[i] = arr[j] where i == j) occurs, this and &rhs point to the exact same object in memory. Executing delete[] this->data immediately destroys rhs.data as well! Subsequently trying to read rhs.data copies freed garbage memory (use-after-free). Always guard with if (this == &rhs) return *this; or use the Copy-and-Swap idiom.'
  },
  {
    id: 'oop-test-q44',
    questionNumber: 44,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q44: [SOLID — Open/Closed Principle & Strategy Pattern] A CheckoutService class has a 200-line if/else-if chain checking if (type == "UPI") ... else if (type == "CreditCard") ... else if (type == "Crypto"). Every time a new payment method is added, CheckoutService must be modified and retested. Which SOLID principle is violated and how do you refactor it?',
    question: 'A CheckoutService class has a giant if/else-if chain checking if (type == "UPI") ... else if (type == "Card") .... Every time a new payment method is added, CheckoutService must be modified. Which SOLID principle is violated and which OOP pattern fixes it?',
    options: [
      'A) Violates Liskov Substitution Principle; fix using Singleton Pattern.',
      'B) Violates Open/Closed Principle (OCP); fix using the Strategy Pattern by defining an abstract PaymentMethod interface with a pure virtual pay() method and passing concrete implementations (UpiPayment, CardPayment) polymorphically.',
      'C) Violates Interface Segregation Principle; fix using Friend functions.',
      'D) Violates Encapsulation; fix by making all variables global.'
    ],
    correctAnswer: 'B',
    explanation: 'The Open/Closed Principle states that a class should be open for extension but closed for modification. By introducing an abstract PaymentStrategy interface (virtual bool pay(double amt) = 0;), adding a new payment method (e.g., ApplePayStrategy : public PaymentStrategy) requires zero modifications to CheckoutService!'
  },
  {
    id: 'oop-test-q45',
    questionNumber: 45,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q45: [SOLID — Liskov Substitution Principle (LSP)] A developer models class Square : public Rectangle where setWidth(w) in Square overrides Rectangle::setWidth(w) to set BOTH width and height to w. A test function void verifyArea(Rectangle& r) { r.setWidth(5); r.setHeight(4); assert(r.area() == 20); } fails when passed a Square(16 != 20). Which principle is violated?',
    question: 'A developer models class Square : public Rectangle where Square::setWidth(w) sets both width and height to w. A function void test(Rectangle& r) { r.setWidth(5); r.setHeight(4); assert(r.area() == 20); } fails when passed a Square (area is 16). Which SOLID principle does this violate?',
    options: [
      'A) Single Responsibility Principle (SRP)',
      'B) Liskov Substitution Principle (LSP) — a derived class (Square) broke the behavioral postcondition/invariant expected of its base class (Rectangle) that width and height can be modified independently.',
      'C) Dependency Inversion Principle (DIP)',
      'D) Interface Segregation Principle (ISP)'
    ],
    correctAnswer: 'B',
    explanation: 'Even though mathematically a square "is a" rectangle, in mutable OOP behavior a Square does NOT satisfy the behavioral contract of a mutable Rectangle (where mutating width leaves height unchanged). When substituting a Square& for a Rectangle& breaks client assertions, it is the textbook violation of the Liskov Substitution Principle (LSP).'
  },
  {
    id: 'oop-test-q46',
    questionNumber: 46,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q46: [Design Patterns — Thread-Safe Singleton] You are designing a Logger Singleton class in C++11+. What is the complete set of OOP access controls and mechanisms required to guarantee that only ONE instance can ever exist and that initialization is thread-safe?',
    question: 'You are designing a Logger Singleton class in C++11+. What is the complete set of OOP controls required to guarantee that only ONE instance can ever exist and that lazy initialization is thread-safe?',
    options: [
      'A) Make the constructor public, and use a global variable.',
      'B) Make the default constructor private, delete the Copy Constructor and Copy Assignment Operator (= delete), and expose a static Logger& getInstance() method containing a local static Logger instance;',
      'C) Declare the class abstract with a pure virtual constructor.',
      'D) Use friend classes to instantiate Logger in every file.'
    ],
    correctAnswer: 'B',
    explanation: 'To enforce a strict Singleton: 1) Make Logger() private so external code cannot instantiate it. 2) Delete Logger(const Logger&) = delete; and operator=(const Logger&) = delete; so the singleton instance cannot be copied! 3) Inside static Logger& getInstance(), declare static Logger instance; return instance; (Meyer\'s Singleton)—since C++11, the standard guarantees that block-scope static variable initialization is 100% thread-safe!'
  },
  {
    id: 'oop-test-q47',
    questionNumber: 47,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q47: [RAII & Exception Safety] In a multi-threaded banking transfer function, mtx.lock() is called at the start and mtx.unlock() at the end. However, if transfer() throws an InsufficientFundsException midway, mtx.unlock() is skipped and all other threads deadlock permanently! How does OOP\'s RAII idiom solve this?',
    question: 'In a multi-threaded banking function, mtx.lock() is called at the start and mtx.unlock() at the end. If an exception is thrown midway, mtx.unlock() is skipped and all threads deadlock! How does C++\'s RAII (Resource Acquisition Is Initialization) idiom solve this?',
    options: [
      'A) By wrapping the mutex inside a local stack object (like std::lock_guard<std::mutex> lock(mtx);) whose constructor acquires the lock and whose destructor automatically releases the lock during stack unwinding even if an exception is thrown.',
      'B) By allocating the mutex on the Heap with new.',
      'C) By declaring the mutex mutable.',
      'D) By disabling exceptions across the project.'
    ],
    correctAnswer: 'A',
    explanation: 'RAII (Resource Acquisition Is Initialization) binds the lifecycle of a resource (mutex lock, file handle, socket, heap memory) to the lifetime of a stack-allocated object. Because C++ guarantees that destructors of all local stack objects are invoked during stack unwinding when an exception is thrown or a function returns early, ~lock_guard() is 100% guaranteed to unlock the mutex.'
  },
  {
    id: 'oop-test-q48',
    questionNumber: 48,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q48: [Safeguarding Virtual Overrides in Large Teams] In a large codebase, a Base class method virtual void onPacketReceived(int id) const is refactored to take (long id). A developer\'s Derived class still has void onPacketReceived(int id) const, which silently stops overriding the base method and introduces a production bug. Which C++11 keyword prevents this at compile time?',
    question: 'In a large codebase, Base::onPacketReceived(int id) const is updated to take (long id). A Derived class still has void onPacketReceived(int id) const, which silently stops overriding the Base method. Which C++11 keyword catches this mismatch immediately at compile time?',
    options: [
      'A) virtual',
      'B) override',
      'C) final',
      'D) explicit'
    ],
    correctAnswer: 'B',
    explanation: 'Appending the override specifier to a derived method declaration (void onPacketReceived(int id) const override;) instructs the compiler to verify that a virtual function with the EXACT same signature, const-qualification, and parameter types exists in the Base class. If the Base signature changes, compilation fails immediately instead of silently hiding/overloading the function.'
  },
  {
    id: 'oop-test-q49',
    questionNumber: 49,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q49: [Factory Design Pattern] An application needs to instantiate different document parsers (PdfParser, DocxParser, CsvParser) based on a file extension string at runtime without scattering new PdfParser() calls across 50 business-logic files. Which OOP creational design pattern solves this?',
    question: 'An application needs to instantiate different document parsers (PdfParser, DocxParser, CsvParser) based on a file extension at runtime without scattering concrete new calls across 50 files. Which OOP design pattern solves this?',
    options: [
      'A) Observer Pattern',
      'B) Factory Method / Simple Factory Pattern (returning a polymorphic std::unique_ptr<IDocumentParser> base pointer from a centralized ParserFactory::createParser(ext) method).',
      'C) Decorator Pattern',
      'D) Adapter Pattern'
    ],
    correctAnswer: 'B',
    explanation: 'The Factory Pattern centralizes object creation logic behind a factory method that returns an abstract interface pointer (IDocumentParser*). Client code depends only on the IDocumentParser abstraction and never couples directly to concrete PdfParser or CsvParser classes.'
  },
  {
    id: 'oop-test-q50',
    questionNumber: 50,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q50: [SOLID — Dependency Inversion Principle & Unit Testing] OrderService directly instantiates SmtpEmailClient inside its constructor (this->mailer = new SmtpEmailClient();). When running automated unit tests, every test sends real emails to customers! How do you refactor OrderService using the Dependency Inversion Principle (DIP)?',
    question: 'OrderService directly instantiates SmtpEmailClient inside its constructor. When running unit tests, every test sends real emails! How do you refactor OrderService using the Dependency Inversion Principle (DIP)?',
    options: [
      'A) Add a boolean flag isTesting inside SmtpEmailClient.',
      'B) Define an abstract IEmailClient interface (with pure virtual sendEmail() = 0), make OrderService accept an IEmailClient* (or reference) via Constructor Dependency Injection, and pass SmtpEmailClient in production and MockEmailClient in unit tests.',
      'C) Make SmtpEmailClient a friend of OrderService.',
      'D) Use private inheritance between OrderService and SmtpEmailClient.'
    ],
    correctAnswer: 'B',
    explanation: 'The Dependency Inversion Principle (DIP) states that high-level modules (OrderService) should not depend on concrete low-level modules (SmtpEmailClient); both should depend on abstractions (IEmailClient). Injecting IEmailClient& via the constructor allows seamless swapping between SmtpEmailClient in production and an in-memory MockEmailClient during unit testing.'
  }
];

async function seedCoreCsOop() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Seeding for Core Computer Science: OOP ---');
    await client.query('BEGIN');

    // Clean up any accidental track 2 mappings from previous run
    await client.query(`DELETE FROM path_tracks WHERE track_id = 2 AND path_id IN (3, 6);`);
    await client.query(`DELETE FROM track_topics WHERE track_id = 2 AND topic_id = 22163;`);

    // 1. Locate Core Computer Science Track (Track 22)
    const trackRes = await client.query(`
      SELECT id, name, slug 
      FROM tracks 
      WHERE (id = 22 OR slug = 'core-computer-science-fundamentals' OR name = 'Core Computer Science' OR slug = 'core-computer-science')
        AND id NOT IN (24, 25, 654, 655, 708)
      ORDER BY CASE WHEN id = 22 THEN 0 WHEN name = 'Core Computer Science' THEN 1 ELSE 2 END, id ASC
      LIMIT 1;
    `);

    let csTrackId;
    if (trackRes.rows.length > 0) {
      csTrackId = trackRes.rows[0].id;
      console.log(`Found existing Core Computer Science track: [ID:${csTrackId}] "${trackRes.rows[0].name}" (slug: ${trackRes.rows[0].slug})`);
    } else {
      const createTrackRes = await client.query(`
        INSERT INTO tracks (name, title, slug, description, evaluation_type, is_published, icon, level, track_order)
        VALUES (
          'Core Computer Science',
          'Core Computer Science',
          'core-computer-science',
          'Core CS subjects: Object-Oriented Programming (OOP), DBMS, Operating Systems, and Computer Networks with timed evaluation tests.',
          'quiz',
          true,
          'cpu',
          'All Levels',
          6
        ) RETURNING id;
      `);
      csTrackId = createTrackRes.rows[0].id;
      console.log(`Created new Core Computer Science track: [ID:${csTrackId}]`);
    }

    // 2. Purge leftover demo / placeholder topics in this track (not matching real cs- subjects)
    const demoTopicsRes = await client.query(`
      SELECT t.id, t.slug, t.title 
      FROM topics t
      JOIN track_topics tt ON t.id = tt.topic_id
      WHERE tt.track_id = $1
        AND t.slug NOT LIKE 'cs-oop-%'
        AND t.slug NOT LIKE 'cs-dbms-%'
        AND t.slug NOT LIKE 'cs-os-%'
        AND t.slug NOT LIKE 'cs-cns-%'
        AND tt.track_id NOT IN (24, 25, 654, 655, 708);
    `, [csTrackId]);

    const demoIds = demoTopicsRes.rows.map(r => r.id);
    if (demoIds.length > 0) {
      console.log(`Purging ${demoIds.length} leftover demo/placeholder topics from track ${csTrackId}:`, demoIds);
      await client.query(`DELETE FROM user_progress WHERE topic_id = ANY($1);`, [demoIds]);
      await client.query(`DELETE FROM resources WHERE topic_id = ANY($1);`, [demoIds]);
      await client.query(`DELETE FROM quizzes WHERE topic_id = ANY($1);`, [demoIds]);
      await client.query(`DELETE FROM track_topics WHERE topic_id = ANY($1);`, [demoIds]);
      await client.query(`DELETE FROM topics WHERE id = ANY($1);`, [demoIds]);
    }

    // Also purge direct topics owned by track where track_id = csTrackId
    const directDemoRes = await client.query(`
      SELECT id, slug, title 
      FROM topics 
      WHERE track_id = $1
        AND slug NOT LIKE 'cs-oop-%'
        AND slug NOT LIKE 'cs-dbms-%'
        AND slug NOT LIKE 'cs-os-%'
        AND slug NOT LIKE 'cs-cns-%'
        AND track_id NOT IN (24, 25, 654, 655, 708);
    `, [csTrackId]);

    const directDemoIds = directDemoRes.rows.map(r => r.id);
    if (directDemoIds.length > 0) {
      console.log(`Purging ${directDemoIds.length} direct demo topics owned by track ${csTrackId}:`, directDemoIds);
      await client.query(`DELETE FROM user_progress WHERE topic_id = ANY($1);`, [directDemoIds]);
      await client.query(`DELETE FROM resources WHERE topic_id = ANY($1);`, [directDemoIds]);
      await client.query(`DELETE FROM quizzes WHERE topic_id = ANY($1);`, [directDemoIds]);
      await client.query(`DELETE FROM track_topics WHERE topic_id = ANY($1);`, [directDemoIds]);
      await client.query(`DELETE FROM topics WHERE id = ANY($1);`, [directDemoIds]);
    }

    // 3. Upsert Subject 1: Object-Oriented Programming (Complete OOP in 1 Shot)
    const topicSlug = 'cs-oop-complete-oneshot-mastery';
    const topicTitle = 'OOP: Complete Object-Oriented Programming in 1 Shot (C++ / Placement & GATE Edition)';
    const topicOrder = 1;
    const durationMinutes = 497;
    const videoUrl = 'http://www.youtube.com/watch?v=JeYx8vJB75Q';
    const videoTitle = 'Complete C++ OOPS in 1 Shot';
    const creatorName = 'CodeHelp - by Babbar';
    const creatorChannelUrl = 'https://www.youtube.com/@CodeHelp';

    const docLinks = [
      {
        title: 'CPPReference — C++ Classes, Inheritance & Virtual Functions Specification',
        url: 'https://en.cppreference.com/w/cpp/language/classes',
        link: 'https://en.cppreference.com/w/cpp/language/classes'
      }
    ];

    const shortDescription = 'Master Object-Oriented Programming from first principles—memory alignment and padding, constructors/destructors, deep vs. shallow copy, the 4 Pillars (Encapsulation, Abstraction, Inheritance, Polymorphism), VTable/VPTR internals, Virtual Inheritance, and SOLID design principles—followed by a 50-question timed evaluation test.';
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
    const practiceJson = JSON.stringify(oopEvaluationTest);

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

    // 4. Ensure path mappings for the Core CS track
    for (const pathId of [1, 3, 6]) {
      const existingMapping = await client.query(`
        SELECT id FROM path_tracks WHERE path_id = $1 AND track_id = $2;
      `, [pathId, csTrackId]);
      if (existingMapping.rows.length === 0) {
        const maxOrderRes = await client.query('SELECT COALESCE(MAX(track_order), 0) as max_ord FROM path_tracks WHERE path_id = $1;', [pathId]);
        const nextOrder = maxOrderRes.rows[0].max_ord + 1;
        await client.query(`
          INSERT INTO path_tracks (path_id, track_id, track_order)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING;
        `, [pathId, csTrackId, nextOrder]);
        console.log(`Mapped CS track ${csTrackId} to path ${pathId} at order ${nextOrder}`);
      }
    }

    await client.query('COMMIT');
    console.log('✅ Core Computer Science: OOP One-Shot & 50-Question Timed Evaluation Test Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding Core CS OOP failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedCoreCsOop();
