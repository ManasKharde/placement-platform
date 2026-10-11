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

const REACT_PRACTICE_QUESTIONS_RAW = [
  {
    question: "What is React.js and what is its primary purpose?",
    type: "multiple_choice",
    options: [
      "A backend framework for Node.js",
      "A JavaScript library used for building user interfaces, specifically for single-page applications",
      "A database management system",
      "A CSS preprocessor"
    ],
    correct_answer: "A JavaScript library used for building user interfaces, specifically for single-page applications",
    correct_index: 1,
    explanation: "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components."
  },
  {
    question: "Which company developed React.js?",
    type: "multiple_choice",
    options: [
      "Google",
      "Amazon",
      "Meta (formerly Facebook)",
      "Microsoft"
    ],
    correct_answer: "Meta (formerly Facebook)",
    correct_index: 2,
    explanation: "React was created by Jordan Walke, a software engineer at Meta (Facebook). It was first deployed on Facebook's newsfeed in 2011 and on Instagram.com in 2012."
  },
  {
    question: "What is a major problem with traditional DOM manipulation that React solves?",
    type: "multiple_choice",
    options: [
      "It requires a separate backend server.",
      "Updating the real DOM is slow because it requires a full re-render of the page or complex manual DOM operations.",
      "It cannot handle CSS animations.",
      "It only supports mobile devices."
    ],
    correct_answer: "Updating the real DOM is slow because it requires a full re-render of the page or complex manual DOM operations.",
    correct_index: 1,
    explanation: "In traditional DOM manipulation, even small changes can trigger a complete re-render of the page, leading to performance bottlenecks. React solves this by using a Virtual DOM to minimize direct updates to the actual DOM."
  },
  {
    question: "What is the Virtual DOM in React?",
    type: "multiple_choice",
    options: [
      "A completely new browser engine replacing Chrome's V8.",
      "A cloud-based database for storing UI state.",
      "A lightweight copy of the real DOM kept in memory, used to determine the most efficient way to update the actual DOM.",
      "A CSS framework used for responsive design."
    ],
    correct_answer: "A lightweight copy of the real DOM kept in memory, used to determine the most efficient way to update the actual DOM.",
    correct_index: 2,
    explanation: "The Virtual DOM is a programming concept where an ideal, or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM by a library such as ReactDOM. This process is called reconciliation."
  },
  {
    question: "What does JSX stand for and what is its role in React?",
    type: "multiple_choice",
    options: [
      "Java Server Extension, used for backend rendering.",
      "JavaScript XML, a syntax extension that allows writing HTML-like code within JavaScript.",
      "JSON Syntax Exchange, used for API communication.",
      "JavaScript XSS, a security feature."
    ],
    correct_answer: "JavaScript XML, a syntax extension that allows writing HTML-like code within JavaScript.",
    correct_index: 1,
    explanation: "JSX produces React 'elements'. It describes what the UI should look like. It is not required to use React, but it is highly recommended because it makes the code more readable and easier to write."
  },
  {
    question: "How do you create a React application using the Vite bundler?",
    type: "multiple_choice",
    options: [
      "npm create-react-app my-app",
      "npx create-react-app my-app",
      "npm create vite@latest my-app --template react",
      "npm init react-app my-app"
    ],
    correct_answer: "npm create vite@latest my-app --template react",
    correct_index: 2,
    explanation: "Vite is a modern, fast build tool. `npm create vite@latest` initializes a new project, and you select the React template. Create React App (CRA) is no longer the recommended approach for new projects."
  },
  {
    question: "In a typical Vite+React project, what is the role of `main.jsx` (or `index.js`)?",
    type: "multiple_choice",
    options: [
      "It is the main CSS file.",
      "It is the entry point that renders the root React component (`App`) into the HTML DOM.",
      "It handles all database connections.",
      "It is a configuration file for Vite."
    ],
    correct_answer: "It is the entry point that renders the root React component (`App`) into the HTML DOM.",
    correct_index: 1,
    explanation: "`main.jsx` uses `ReactDOM.createRoot` to select the root DOM node (usually a div with id='root' in `index.html`) and renders the top-level React component (like `<App/>`) into it."
  },
  {
    question: "What are React Fragments (`<> ... </>`) used for?",
    type: "multiple_choice",
    options: [
      "To add styling to multiple elements.",
      "To conditionally render components.",
      "To group a list of children without adding extra nodes (like a `<div>`) to the real DOM.",
      "To create a new CSS class."
    ],
    correct_answer: "To group a list of children without adding extra nodes (like a `<div>`) to the real DOM.",
    correct_index: 2,
    explanation: "A React component can only return a single parent element. Fragments let you group a list of children without adding extra nodes to the DOM, keeping the HTML structure clean."
  },
  {
    question: "What are Props in React?",
    type: "multiple_choice",
    options: [
      "Built-in CSS properties for React components.",
      "Internal state variables that a component can modify.",
      "Read-only inputs passed from a parent component to a child component to configure its behavior or output.",
      "Functions used to fetch data from an API."
    ],
    correct_answer: "Read-only inputs passed from a parent component to a child component to configure its behavior or output.",
    correct_index: 2,
    explanation: "Props (short for properties) are how components talk to each other. A parent component passes data to a child component as props. Props are immutable within the child component."
  },
  {
    question: "How does data flow in a standard React application?",
    type: "multiple_choice",
    options: [
      "Bottom-up (from child to parent)",
      "Unidirectional, top-down (from parent to child)",
      "Bidirectional (parent to child and child to parent simultaneously)",
      "Randomly, based on component rendering order"
    ],
    correct_answer: "Unidirectional, top-down (from parent to child)",
    correct_index: 1,
    explanation: "React enforces a unidirectional data flow. State is often lifted up to a common ancestor, which then passes it down to child components via props."
  },
  {
    question: "What is the purpose of the `key` prop when rendering a list of elements in React using `.map()`?",
    type: "multiple_choice",
    options: [
      "To provide a unique CSS class name for styling.",
      "To help React identify which items have changed, are added, or are removed, optimizing rendering performance.",
      "To encrypt the data being rendered.",
      "To define the index of the array element."
    ],
    correct_answer: "To help React identify which items have changed, are added, or are removed, optimizing rendering performance.",
    correct_index: 1,
    explanation: "Keys give elements a stable identity. React uses keys to match children in the original tree with children in the subsequent tree, making DOM updates efficient."
  },
  {
    question: "What is `useState` in React?",
    type: "multiple_choice",
    options: [
      "A method to fetch data from an external API.",
      "A hook that allows functional components to have state variables.",
      "A component lifecycle method.",
      "A CSS framework for managing UI states."
    ],
    correct_answer: "A hook that allows functional components to have state variables.",
    correct_index: 1,
    explanation: "`useState` is a React Hook that lets you add a state variable to your component. It returns an array with two values: the current state and a function to update it."
  },
  {
    question: "How does the `useState` setter function behave regarding UI updates?",
    type: "multiple_choice",
    options: [
      "It instantly updates the variable, but the UI updates only on page reload.",
      "It schedules a state update and triggers a re-render of the component to reflect the new state in the UI.",
      "It directly modifies the real DOM.",
      "It updates the state but does not cause a re-render."
    ],
    correct_answer: "It schedules a state update and triggers a re-render of the component to reflect the new state in the UI.",
    correct_index: 1,
    explanation: "Calling the setter function returned by `useState` tells React that the component's state has changed, which queues a re-render of that component and its children."
  },
  {
    question: "Why might `console.log(stateVariable)` immediately after calling `setStateVariable(newValue)` print the old value?",
    type: "multiple_choice",
    options: [
      "Because `console.log` is broken in React.",
      "Because state updates in React are asynchronous; the state variable is updated on the next render cycle.",
      "Because the new value was rejected by React.",
      "Because you must use `await` before `console.log`."
    ],
    correct_answer: "Because state updates in React are asynchronous; the state variable is updated on the next render cycle.",
    correct_index: 1,
    explanation: "React batches state updates for performance. The setter function schedules an update, but the value of the state variable in the current execution context remains unchanged until the next render."
  },
  {
    question: "What is 'Two-Way Data Binding' in the context of React forms (Controlled Components)?",
    type: "multiple_choice",
    options: [
      "The input updates the DOM directly without React's knowledge.",
      "React state dictates the input's `value`, and the input's `onChange` event updates the React state.",
      "Data flows from the backend to the frontend and vice-versa simultaneously.",
      "Using two different state variables for one input."
    ],
    correct_answer: "React state dictates the input's `value`, and the input's `onChange` event updates the React state.",
    correct_index: 1,
    explanation: "In controlled components, the form data is handled by the React component. The input's `value` is tied to a state variable, and an `onChange` handler updates that state, keeping them in sync."
  },
  {
    question: "How do you prevent the default page reload behavior when a form is submitted in React?",
    type: "multiple_choice",
    options: [
      "By returning `false` from the component.",
      "By calling `event.preventDefault()` inside the `onSubmit` handler.",
      "By using the `<PreventReload>` tag.",
      "React automatically prevents default form submissions."
    ],
    correct_answer: "By calling `event.preventDefault()` inside the `onSubmit` handler.",
    correct_index: 1,
    explanation: "Forms in HTML default to navigating to a new page on submit. In React, you use the standard DOM method `event.preventDefault()` within the event handler to stop this behavior."
  },
  {
    question: "What is the primary use case for the `useEffect` hook?",
    type: "multiple_choice",
    options: [
      "To declare CSS styles for a component.",
      "To perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.",
      "To manage complex state logic with multiple sub-values.",
      "To create reusable UI components."
    ],
    correct_answer: "To perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.",
    correct_index: 1,
    explanation: "`useEffect` lets you synchronize a component with an external system. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in React class components."
  },
  {
    question: "What does the dependency array `[]` as the second argument in `useEffect` do?",
    type: "multiple_choice",
    options: [
      "It causes the effect to run after every single render.",
      "It causes the effect to run only once, immediately after the initial render (component mount).",
      "It prevents the effect from ever running.",
      "It tells React to run the effect only when the component unmounts."
    ],
    correct_answer: "It causes the effect to run only once, immediately after the initial render (component mount).",
    correct_index: 1,
    explanation: "An empty dependency array means the effect does not depend on any state or props, so it only needs to execute once when the component mounts."
  },
  {
    question: "If a state variable `count` is included in the `useEffect` dependency array `[count]`, when will the effect run?",
    type: "multiple_choice",
    options: [
      "Only when the component mounts.",
      "Every time the component re-renders, regardless of what changed.",
      "After the initial render, and subsequently every time the value of `count` changes.",
      "Only when the component unmounts."
    ],
    correct_answer: "After the initial render, and subsequently every time the value of `count` changes.",
    correct_index: 2,
    explanation: "React compares the current value of dependencies with their value on the previous render. If any value in the array has changed (like `count`), the effect is re-run."
  },
  {
    question: "What library is commonly used for performing routing in a React application?",
    type: "multiple_choice",
    options: [
      "react-navigation",
      "react-router-dom",
      "express.js",
      "react-routes"
    ],
    correct_answer: "react-router-dom",
    correct_index: 1,
    explanation: "`react-router-dom` is the standard routing library for React web applications, enabling navigation between different components without full page reloads, creating a Single Page Application (SPA) experience."
  },
  {
    question: "What is the purpose of the `<BrowserRouter>` component in `react-router-dom`?",
    type: "multiple_choice",
    options: [
      "To open external links in a new browser tab.",
      "To wrap the application and enable client-side routing using the HTML5 history API.",
      "To manage HTTP requests to the backend server.",
      "To render components conditionally based on browser type."
    ],
    correct_answer: "To wrap the application and enable client-side routing using the HTML5 history API.",
    correct_index: 1,
    explanation: "`BrowserRouter` is a router implementation that uses the HTML5 history API (`pushState`, `replaceState` and the `popstate` event) to keep your UI in sync with the URL."
  },
  {
    question: "In `react-router-dom`, what component should you use to create navigation links instead of the standard HTML `<a>` tag?",
    type: "multiple_choice",
    options: [
      "<Href>",
      "<Navigate>",
      "<Link> (or <NavLink>)",
      "<Route>"
    ],
    correct_answer: "<Link> (or <NavLink>)",
    correct_index: 2,
    explanation: "Using an `<a>` tag causes a full page reload. The `<Link>` component updates the URL and allows React Router to render the appropriate component client-side, maintaining the SPA behavior."
  },
  {
    question: "How do you define a dynamic route segment (e.g., a specific user ID) in `react-router-dom`?",
    type: "multiple_choice",
    options: [
      "<Route path=\"/user/?id\"/>",
      "<Route path=\"/user/:id\"/>",
      "<Route path=\"/user/{id}\"/>",
      "<Route path=\"/user/[id]\"/>"
    ],
    correct_answer: "<Route path=\"/user/:id\"/>",
    correct_index: 1,
    explanation: "The colon `:` syntax denotes a dynamic segment in a route path. The value matched by this segment can be accessed inside the component."
  },
  {
    question: "Which hook allows you to access dynamic parameters from the URL in `react-router-dom`?",
    type: "multiple_choice",
    options: [
      "useUrl()",
      "useParams()",
      "useRouteMatch()",
      "useLocation()"
    ],
    correct_answer: "useParams()",
    correct_index: 1,
    explanation: "`useParams` returns an object of key/value pairs of the dynamic params from the current URL that were matched by the `<Route path>`."
  },
  {
    question: "What does the `useNavigate` hook do?",
    type: "multiple_choice",
    options: [
      "It automatically fetches data for the next route.",
      "It returns a function that lets you navigate programmatically (e.g., after a form submission or button click).",
      "It provides information about the current browser's navigation history.",
      "It renders a navigation bar component."
    ],
    correct_answer: "It returns a function that lets you navigate programmatically (e.g., after a form submission or button click).",
    correct_index: 1,
    explanation: "`useNavigate` provides a `navigate` function. You can call it with a path (e.g., `navigate('/home')`) or a delta to go back in history (e.g., `navigate(-1)`)."
  },
  {
    question: "What is the Context API used for in React?",
    type: "multiple_choice",
    options: [
      "To manage database connections.",
      "To replace the need for CSS styling.",
      "To solve the problem of 'prop drilling' by allowing data to be shared globally or across deeply nested component trees without passing props manually at every level.",
      "To handle asynchronous API requests."
    ],
    correct_answer: "To solve the problem of 'prop drilling' by allowing data to be shared globally or across deeply nested component trees without passing props manually at every level.",
    correct_index: 2,
    explanation: "Context provides a way to pass data through the component tree without having to pass props down manually at every level. It is ideal for global data like themes, authenticated user info, or preferred language."
  },
  {
    question: "What are the three main steps to use the Context API?",
    type: "multiple_choice",
    options: [
      "fetch(), store(), display()",
      "createContext(), Context.Provider, useContext()",
      "useState(), useEffect(), useReducer()",
      "ComponentDidMount, ComponentDidUpdate, ComponentWillUnmount"
    ],
    correct_answer: "createContext(), Context.Provider, useContext()",
    correct_index: 1,
    explanation: "First, you create the context using `createContext()`. Second, you wrap the parts of your app that need the data with a `<Context.Provider value=\"{...}\">`. Third, you consume the data in child components using the `useContext(Context)` hook."
  },
  {
    question: "What is 'Prop Drilling'?",
    type: "multiple_choice",
    options: [
      "A security vulnerability where malicious code is passed through props.",
      "A performance optimization technique for rendering lists.",
      "The process of passing data from a parent component down to a deeply nested child component through multiple intermediate components that don't need the data themselves.",
      "The automatic extraction of data from API responses."
    ],
    correct_answer: "The process of passing data from a parent component down to a deeply nested child component through multiple intermediate components that don't need the data themselves.",
    correct_index: 2,
    explanation: "Prop drilling is the term used when you pass props down through several layers of components just to get data to a deeply nested component. Context API or state management libraries (like Redux) are used to avoid this."
  },
  {
    question: "When fetching data from an API inside `useEffect`, why is it common practice to use an asynchronous function?",
    type: "multiple_choice",
    options: [
      "Because `useEffect` itself cannot be an `async` function directly, so you define an `async` function inside it and call it.",
      "Because API calls are synchronous by nature.",
      "Because `async` functions are required by Vite.",
      "Because `fetch` only works inside `async` functions."
    ],
    correct_answer: "Because `useEffect` itself cannot be an `async` function directly, so you define an `async` function inside it and call it.",
    correct_index: 0,
    explanation: "The `useEffect` hook expects its callback to return either nothing or a cleanup function. An `async` function always returns a Promise. Therefore, you must define an `async` function *inside* the `useEffect` callback and invoke it there."
  },
  {
    question: "In `react-router-dom`, what is the `<Outlet/>` component used for?",
    type: "multiple_choice",
    options: [
      "To render an external website inside an iframe.",
      "To define where child routes (nested routes) should be rendered within a parent layout component.",
      "To export data to local storage.",
      "To catch all undefined routes (404 page)."
    ],
    correct_answer: "To define where child routes (nested routes) should be rendered within a parent layout component.",
    correct_index: 1,
    explanation: "When you have nested routes, the parent route component acts as a layout. The `<Outlet/>` acts as a placeholder telling React Router where to render the matching child route's component."
  }
];

// Enrich each question so it works across all quiz modes
const REACT_PRACTICE_QUESTIONS = REACT_PRACTICE_QUESTIONS_RAW.map((q) => {
  const letters = ["A", "B", "C", "D"];
  const correctLetter = letters[q.correct_index] || "A";
  const enrichedOptions = q.options.map((opt, i) => {
    return {
      text: opt,
      isCorrect: i === q.correct_index
    };
  });

  return {
    ...q,
    options: enrichedOptions,
    correctAnswer: correctLetter,
    answer: correctLetter
  };
});

const REACT_LECTURE = {
  slug: 'reactjs-full-course-sheryians',
  title: 'React.js Complete Masterclass: UI, Hooks & Routing',
  topic_order: 1,
  duration_minutes: 676, // ~11h 16m
  video_url: 'https://youtu.be/3LRZRSIh_KE',
  video_title: 'ReactJS Full Course | ReactJS - Learn Everything | Sheryians Coding School',
  creator_name: 'Sheryians Coding School',
  creator_channel_url: 'https://www.youtube.com/@SheryiansCodingSchool',
  short_description: 'An exhaustive 11-hour deep dive into React.js. Covers Virtual DOM, component architecture, hooks (useState, useEffect, useContext), API integration, and React Router DOM.',
  summary_markdown: `> **Masterclass Overview:** This 11-hour comprehensive tutorial is designed to take you from React basics to an industry-ready Frontend Developer. It covers the core philosophy of React, state management, routing, and real-world project building.

### 📌 Core Technical Highlights
- **React Fundamentals:** Understanding the Virtual DOM vs. Real DOM, JSX syntax, and Vite initialization.
- **Component Architecture:** Building reusable UI elements, atomic design vs. feature-based structures, and Prop Drilling.
- **State Management (Hooks):** Deep dive into \`useState\`, handling two-way data binding for forms, and managing object/array state immutability.
- **Side Effects & APIs:** Mastering \`useEffect\` for side-effects, \`useRef\` for DOM manipulation, and fetching data using \`axios\`.
- **Advanced Routing:** Implementing SPAs with \`react-router-dom\`, nested routes, dynamic routing (\`useParams\`), and programmatic navigation (\`useNavigate\`).
- **Global State:** Solving prop drilling by implementing the Context API (\`createContext\`, \`useContext\`).

*Practice your understanding of React.js architecture by completing the 30-question verified quiz below.*`
};

async function seedReactTrackAndReorderPath() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 0. Ensure schema compatibility
    await client.query(`
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 0;
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS total_topics INTEGER DEFAULT 0;
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS evaluation_type VARCHAR(50);
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS short_name VARCHAR(100);
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS tab_name VARCHAR(100);
    `);

    // 1. Detect Path Join Table
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('path_tracks', 'preparation_path_tracks');
    `);
    const joinTable = tableCheck.rows.map(r => r.table_name).includes('preparation_path_tracks') 
      ? 'preparation_path_tracks' 
      : 'path_tracks';

    // 2. Identify React path ID
    const pathRes = await client.query(`
      SELECT id, name FROM preparation_paths WHERE name ILIKE '%React%' OR slug ILIKE '%react%' LIMIT 1;
    `);
    if (pathRes.rows.length === 0) throw new Error("React.js path not found.");
    const pathId = pathRes.rows[0].id;
    console.log(`Identified Path: ${pathRes.rows[0].name} (ID: ${pathId})`);

    // 3. Create or Fetch the React.js Track
    let trackRes = await client.query(`SELECT id FROM tracks WHERE slug = 'reactjs-mastery';`);
    let reactTrackId;
    if (trackRes.rows.length === 0) {
      const ins = await client.query(`
        INSERT INTO tracks (name, title, slug, total_topics, level, icon, evaluation_type, short_name, display_name, tab_name)
        VALUES ('React.js Engineering', 'React.js Engineering', 'reactjs-mastery', 1, 'Advanced', 'code', 'verified-quiz', 'React.js', 'React.js Engineering', 'React.js')
        RETURNING id;
      `);
      reactTrackId = ins.rows[0].id;
      console.log(`Created new Track 'React.js Engineering' (ID: ${reactTrackId})`);
    } else {
      reactTrackId = trackRes.rows[0].id;
      await client.query(`
        UPDATE tracks 
        SET name = 'React.js Engineering',
            title = 'React.js Engineering',
            short_name = 'React.js',
            display_name = 'React.js Engineering',
            tab_name = 'React.js',
            evaluation_type = 'verified-quiz',
            icon = 'code',
            level = 'Advanced'
        WHERE id = $1;
      `, [reactTrackId]);
      await client.query(`DELETE FROM track_topics WHERE track_id = $1;`, [reactTrackId]);
      console.log(`Found existing React.js Track (ID: ${reactTrackId}), updated and cleared old topics.`);
    }

    // 4. Upsert the Topic & Sync the 30 Questions
    const cleanVideoUrl = cleanUrl(REACT_LECTURE.video_url);
    const cleanChannelUrl = cleanUrl(REACT_LECTURE.creator_channel_url);
    const creatorName = REACT_LECTURE.creator_name;

    const videoLinks = JSON.stringify([
      {
        title: REACT_LECTURE.video_title,
        url: cleanVideoUrl,
        duration_minutes: REACT_LECTURE.duration_minutes,
        creator_name: creatorName,
        creator_channel_url: cleanChannelUrl
      }
    ]);

    const checkTopic = await client.query(`SELECT id FROM topics WHERE slug = $1;`, [REACT_LECTURE.slug]);

    const insertParams = [
      REACT_LECTURE.title,              // $1 name
      REACT_LECTURE.title,              // $2 title
      REACT_LECTURE.slug,               // $3 slug
      REACT_LECTURE.topic_order,        // $4 topic_order
      'Frontend Framework',             // $5 module_name
      REACT_LECTURE.duration_minutes,   // $6 duration_minutes
      REACT_LECTURE.duration_minutes,   // $7 estimated_minutes
      cleanVideoUrl,                    // $8 video_url
      REACT_LECTURE.video_title,        // $9 video_title
      REACT_LECTURE.short_description,  // $10 short_description
      REACT_LECTURE.short_description,  // $11 description
      REACT_LECTURE.summary_markdown,   // $12 summary_markdown
      REACT_LECTURE.summary_markdown,   // $13 theory_summary
      JSON.stringify(REACT_PRACTICE_QUESTIONS), // $14 practice_items
      videoLinks,                       // $15 video_links
      creatorName,                      // $16 creator_name
      cleanChannelUrl                   // $17 creator_channel_url
    ];

    let topicId;
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
      console.log(`Inserted new Topic '${REACT_LECTURE.title}' (ID: ${topicId})`);
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
      console.log(`Updated existing Topic (ID: ${topicId}) with 30 questions.`);
    }

    await client.query(`INSERT INTO track_topics (track_id, topic_id, topic_order) VALUES ($1, $2, 1);`, [reactTrackId, topicId]);

    // 5. Update Resources Mapping
    const resCheck = await client.query(`SELECT 1 FROM information_schema.tables WHERE table_name = 'resources';`);
    if (resCheck.rows.length > 0) {
      const existRes = await client.query(`SELECT id FROM resources WHERE topic_id = $1 AND resource_type = 'video';`, [topicId]);
      if (existRes.rows.length === 0) {
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes, creator_name, creator_channel_url)
          VALUES ($1, $2, $3, 'video', $4, $5, $6);
        `, [topicId, REACT_LECTURE.video_title, cleanVideoUrl, REACT_LECTURE.duration_minutes, creatorName, cleanChannelUrl]);
      } else {
        await client.query(`
          UPDATE resources SET title=$1, url=$2, estimated_minutes=$3, creator_name=$4, creator_channel_url=$5 
          WHERE topic_id = $6 AND resource_type = 'video';
        `, [REACT_LECTURE.video_title, cleanVideoUrl, REACT_LECTURE.duration_minutes, creatorName, cleanChannelUrl, topicId]);
      }
    }

    // 6. Update Track Overall Duration
    const hours = Math.ceil(REACT_LECTURE.duration_minutes / 60);
    await client.query(`UPDATE tracks SET total_topics = 1, duration_hours = $1 WHERE id = $2;`, [hours, reactTrackId]);

    // -------------------------------------------------------------------------
    // 7. COMPREHENSIVE PATH REORDERING
    // Target Order: 1. HTML, 2. CSS3, 3. JS, 4. TS, 5. React, 6. Tailwind, 7. Version Control
    // -------------------------------------------------------------------------

    const findTrackId = async (slugPattern) => {
      const res = await client.query(`
        SELECT id, slug, COALESCE(title, name) as title 
        FROM tracks 
        WHERE slug ILIKE $1 
        ORDER BY id ASC LIMIT 1;
      `, [`%${slugPattern}%`]);
      return res.rows.length > 0 ? res.rows[0].id : null;
    };

    const htmlId     = await findTrackId('html-foundations');
    const cssId      = await findTrackId('css-architecture');
    const jsId       = await findTrackId('javascript-mastery');
    const tsId       = await findTrackId('typescript-architecture');
    const reactId    = reactTrackId;
    const tailwindId = await findTrackId('tailwind-css-architecture');
    const vcId       = await findTrackId('version-control');

    console.log(`Resolved Track IDs: HTML=${htmlId}, CSS=${cssId}, JS=${jsId}, TS=${tsId}, React=${reactId}, Tailwind=${tailwindId}, VC=${vcId}`);

    // Wipe existing bindings for this path
    await client.query(`DELETE FROM ${joinTable} WHERE path_id = $1;`, [pathId]);

    const targetOrder = [
      { id: htmlId, order: 1, label: 'HTML5 Foundations' },
      { id: cssId, order: 2, label: 'CSS3' },
      { id: jsId, order: 3, label: 'JavaScript' },
      { id: tsId, order: 4, label: 'TypeScript Engineering' },
      { id: reactId, order: 5, label: 'React.js Engineering' },
      { id: tailwindId, order: 6, label: 'Tailwind CSS' },
      { id: vcId, order: 7, label: 'Version Control' }
    ].filter(item => item.id !== null);

    // Re-insert with strict, guaranteed horizontal order
    for (const item of targetOrder) {
      await client.query(`
        INSERT INTO ${joinTable} (path_id, track_id, track_order)
        VALUES ($1, $2, $3);
      `, [pathId, item.id, item.order]);
      console.log(`Placed [Order ${item.order}]: ${item.label} (ID: ${item.id})`);
    }

    // 8. Re-Calculate Path Totals
    const sumRes = await client.query(`
      SELECT COALESCE(SUM(t.total_topics), 0)::int AS total_topics, COUNT(pt.track_id)::int AS total_tracks
      FROM ${joinTable} pt JOIN tracks t ON pt.track_id = t.id WHERE pt.path_id = $1;
    `, [pathId]);

    await client.query(`
      UPDATE preparation_paths SET total_tracks = $1, total_topics = $2 WHERE id = $3;
    `, [sumRes.rows[0].total_tracks, sumRes.rows[0].total_topics, pathId]);

    await client.query('COMMIT');
    console.log(`\nSuccessfully seeded React.js track and rebuilt path order!`);
    console.log(`Horizontal Order is now: HTML5 -> CSS3 -> JavaScript -> TypeScript -> React.js -> Tailwind -> Version Control`);

    // Verification output
    const verify = await client.query(`
      SELECT pt.track_order, t.id AS track_id, COALESCE(t.title, t.name) AS track_title, t.slug, t.total_topics, t.duration_hours, t.evaluation_type
      FROM ${joinTable} pt
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.path_id = $1
      ORDER BY pt.track_order ASC;
    `, [pathId]);
    console.table(verify.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedReactTrackAndReorderPath();
