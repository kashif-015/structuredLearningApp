// ============================================================
// EduFlow — Comprehensive Mock Data
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  streak: number;
  totalHours: number;
  coursesCompleted: number;
  lessonsCompleted: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // minutes
  videoId: string;
  completed: boolean;
  summary: string;
  resources: string[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  totalDuration: number;
  modules: Module[];
  progress: number; // 0-100
  lastAccessed: string;
  rating: number;
  enrolledDate: string;
  author: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  folder: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  courseId: string;
  known: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  cards: Flashcard[];
  lastStudied: string;
  mastery: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  questions: QuizQuestion[];
  bestScore: number | null;
  attempts: number;
  timeLimit: number; // seconds
}

export interface ActivityItem {
  id: string;
  type: "lesson_complete" | "quiz_complete" | "course_start" | "streak" | "flashcard_session";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface WeeklyProgress {
  day: string;
  minutes: number;
  lessons: number;
}

export interface MonthlyProgress {
  week: string;
  hours: number;
  courses: number;
}

// ------ USER ------
export const mockUser: User = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "",
  joinedDate: "2025-09-15",
  streak: 12,
  totalHours: 147,
  coursesCompleted: 8,
  lessonsCompleted: 234,
};

// ------ COURSES ------
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Complete React & Next.js Masterclass",
    description:
      "Master modern React development with Next.js 15, Server Components, Server Actions, and the App Router. Build production-ready applications from scratch.",
    thumbnail: "/api/placeholder/800/450",
    category: "Web Development",
    totalDuration: 1840,
    progress: 68,
    lastAccessed: "2026-06-02",
    rating: 4.9,
    enrolledDate: "2026-04-10",
    author: "Traversy Media",
    modules: [
      {
        id: "mod-1-1",
        title: "Introduction to React",
        lessons: [
          {
            id: "les-1-1-1",
            title: "What is React? Why React in 2026?",
            duration: 15,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary:
              "React is a JavaScript library for building user interfaces, maintained by Meta. It uses a virtual DOM for efficient updates and a component-based architecture that promotes reusability. In 2026, React remains dominant due to its ecosystem, Server Components, and the React Compiler.",
            resources: ["React Documentation", "React GitHub Repository"],
          },
          {
            id: "les-1-1-2",
            title: "Setting Up Your Development Environment",
            duration: 22,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary:
              "Set up Node.js, VS Code with essential extensions (ES7 Snippets, Prettier, ESLint), and create your first React app using Vite or Next.js. Configure TypeScript for type safety.",
            resources: ["VS Code Extensions Guide", "Node.js Installation"],
          },
          {
            id: "les-1-1-3",
            title: "JSX Deep Dive and Components",
            duration: 28,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary:
              "JSX is a syntax extension that lets you write HTML-like code in JavaScript. Components are the building blocks — they can be functions that return JSX. Props allow data flow between components.",
            resources: ["JSX Specification", "Component Patterns"],
          },
        ],
      },
      {
        id: "mod-1-2",
        title: "React Hooks & State Management",
        lessons: [
          {
            id: "les-1-2-1",
            title: "useState and useEffect Explained",
            duration: 35,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary:
              "useState manages local component state. useEffect handles side effects like API calls, subscriptions, and DOM manipulation. Understanding the dependency array is crucial for preventing infinite loops.",
            resources: ["Hooks API Reference", "useEffect Guide"],
          },
          {
            id: "les-1-2-2",
            title: "useContext and Custom Hooks",
            duration: 30,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary:
              "useContext provides a way to share data across components without prop drilling. Custom hooks extract reusable logic — they start with 'use' and can call other hooks.",
            resources: ["Context API Docs", "Custom Hooks Patterns"],
          },
          {
            id: "les-1-2-3",
            title: "Advanced State with useReducer",
            duration: 25,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary:
              "useReducer is ideal for complex state logic. It follows the reducer pattern: (state, action) => newState. Combined with useContext, it can replace Redux for many use cases.",
            resources: ["useReducer Documentation"],
          },
        ],
      },
      {
        id: "mod-1-3",
        title: "Next.js App Router",
        lessons: [
          {
            id: "les-1-3-1",
            title: "File-Based Routing in Next.js 15",
            duration: 20,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary:
              "Next.js uses the file system for routing. The app/ directory defines routes, layouts, and loading states. Dynamic routes use [param] folders.",
            resources: ["Next.js Routing Docs"],
          },
          {
            id: "les-1-3-2",
            title: "Server vs Client Components",
            duration: 32,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary:
              "Server Components render on the server, reducing client bundle size. Client Components (marked with 'use client') handle interactivity. The key is choosing the right boundary.",
            resources: ["Server Components RFC"],
          },
          {
            id: "les-1-3-3",
            title: "Server Actions and Data Mutations",
            duration: 28,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary:
              "Server Actions allow you to run server-side code from client components using 'use server'. They handle form submissions, database mutations, and revalidation seamlessly.",
            resources: ["Server Actions Guide"],
          },
          {
            id: "les-1-3-4",
            title: "Middleware, Auth, and Deployment",
            duration: 35,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary:
              "Middleware runs before requests, enabling auth checks, redirects, and headers. Deploy to Vercel for zero-config hosting or self-host with Docker.",
            resources: ["Middleware Docs", "Deployment Guide"],
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "Python for Machine Learning & AI",
    description:
      "From Python basics to building ML models with scikit-learn, TensorFlow, and PyTorch. Covers data preprocessing, neural networks, and model deployment.",
    thumbnail: "/api/placeholder/800/450",
    category: "Machine Learning",
    totalDuration: 2400,
    progress: 35,
    lastAccessed: "2026-06-01",
    rating: 4.8,
    enrolledDate: "2026-03-22",
    author: "Sentdex",
    modules: [
      {
        id: "mod-2-1",
        title: "Python Fundamentals for ML",
        lessons: [
          {
            id: "les-2-1-1",
            title: "Python Data Types and Structures",
            duration: 25,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary: "Core Python data types: lists, dictionaries, tuples, sets. Understanding mutability and when to use each structure for ML data pipelines.",
            resources: ["Python Docs"],
          },
          {
            id: "les-2-1-2",
            title: "NumPy for Numerical Computing",
            duration: 40,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary: "NumPy arrays are the foundation of scientific computing in Python. Vectorized operations, broadcasting, and array manipulation for efficient data processing.",
            resources: ["NumPy Documentation"],
          },
          {
            id: "les-2-1-3",
            title: "Pandas for Data Analysis",
            duration: 45,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary: "Pandas DataFrames for loading, cleaning, and transforming tabular data. GroupBy operations, merge/join, and handling missing values.",
            resources: ["Pandas User Guide"],
          },
        ],
      },
      {
        id: "mod-2-2",
        title: "Machine Learning Fundamentals",
        lessons: [
          {
            id: "les-2-2-1",
            title: "Supervised vs Unsupervised Learning",
            duration: 30,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary: "Supervised learning uses labeled data (classification, regression). Unsupervised learning finds patterns in unlabeled data (clustering, dimensionality reduction).",
            resources: ["ML Glossary"],
          },
          {
            id: "les-2-2-2",
            title: "Linear Regression from Scratch",
            duration: 35,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary: "Implementing linear regression using gradient descent. Understanding cost functions, learning rates, and feature scaling.",
            resources: ["Andrew Ng's ML Course Notes"],
          },
        ],
      },
    ],
  },
  {
    id: "course-3",
    title: "UI/UX Design with Figma",
    description:
      "Learn professional UI/UX design principles, create design systems, prototype interactive flows, and hand off designs to developers using Figma.",
    thumbnail: "/api/placeholder/800/450",
    category: "Design",
    totalDuration: 960,
    progress: 92,
    lastAccessed: "2026-05-28",
    rating: 4.7,
    enrolledDate: "2026-01-15",
    author: "DesignCourse",
    modules: [
      {
        id: "mod-3-1",
        title: "Design Foundations",
        lessons: [
          {
            id: "les-3-1-1",
            title: "Color Theory and Typography",
            duration: 20,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary: "Understanding color harmonies, contrast ratios for accessibility, and typography hierarchy. Choosing typefaces that communicate brand personality.",
            resources: ["Color Theory Guide"],
          },
          {
            id: "les-3-1-2",
            title: "Layout Principles and Grid Systems",
            duration: 25,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary: "Grid systems create visual consistency. 8px grid for spacing, 12-column layouts for responsive design. Whitespace is a design element, not empty space.",
            resources: ["Grid Systems in Design"],
          },
        ],
      },
      {
        id: "mod-3-2",
        title: "Figma Mastery",
        lessons: [
          {
            id: "les-3-2-1",
            title: "Components and Auto Layout",
            duration: 30,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary: "Figma components enable reusable design elements. Auto Layout provides responsive behavior within frames, similar to Flexbox in CSS.",
            resources: ["Figma Auto Layout"],
          },
          {
            id: "les-3-2-2",
            title: "Prototyping Interactive Flows",
            duration: 28,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary: "Create interactive prototypes with transitions, smart animate, and conditional logic. Test user flows before development.",
            resources: ["Figma Prototyping"],
          },
        ],
      },
    ],
  },
  {
    id: "course-4",
    title: "System Design for Senior Engineers",
    description:
      "Master distributed systems concepts: load balancing, caching, databases, message queues, and microservices architecture for large-scale applications.",
    thumbnail: "/api/placeholder/800/450",
    category: "System Design",
    totalDuration: 1200,
    progress: 15,
    lastAccessed: "2026-05-25",
    rating: 4.9,
    enrolledDate: "2026-05-20",
    author: "ByteByteGo",
    modules: [
      {
        id: "mod-4-1",
        title: "Fundamentals",
        lessons: [
          {
            id: "les-4-1-1",
            title: "Scalability Basics",
            duration: 22,
            videoId: "dQw4w9WgXcQ",
            completed: true,
            summary: "Vertical vs horizontal scaling. Stateless architecture enables horizontal scaling. Load balancers distribute traffic across servers.",
            resources: ["System Design Primer"],
          },
          {
            id: "les-4-1-2",
            title: "Database Design and Sharding",
            duration: 35,
            videoId: "dQw4w9WgXcQ",
            completed: false,
            summary: "SQL vs NoSQL trade-offs. Database sharding strategies: hash-based, range-based, directory-based. Replication for high availability.",
            resources: ["Database Internals Book"],
          },
        ],
      },
    ],
  },
];

// ------ NOTES ------
export const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "React Server Components - Key Takeaways",
    content:
      "## Server Components\n\n- Render on the server, zero client JS\n- Can directly access databases and filesystems\n- Cannot use hooks or browser APIs\n- Default in Next.js App Router\n\n## Client Components\n\n- Add `'use client'` directive\n- Required for interactivity (onClick, onChange)\n- Required for hooks (useState, useEffect)\n- Should be leaf nodes in component tree\n\n## Best Practices\n\n1. Keep Server Components as high as possible\n2. Pass Server Components as children to Client Components\n3. Use Server Actions for mutations\n4. Avoid unnecessary 'use client' boundaries",
    courseId: "course-1",
    courseName: "Complete React & Next.js Masterclass",
    lessonId: "les-1-3-2",
    createdAt: "2026-05-28",
    updatedAt: "2026-06-01",
    pinned: true,
    folder: "Web Development",
  },
  {
    id: "note-2",
    title: "NumPy Broadcasting Rules",
    content:
      "## Broadcasting Rules\n\n1. If arrays have different numbers of dimensions, the shape of the smaller array is padded with ones on the left\n2. Arrays with size 1 along a dimension act as if they had the size of the array with the largest shape\n3. If sizes disagree and neither is 1, an error is raised\n\n## Examples\n\n```python\na = np.array([1, 2, 3])  # Shape: (3,)\nb = np.array([[1], [2], [3]])  # Shape: (3, 1)\nresult = a + b  # Shape: (3, 3)\n```\n\nBroadcasting eliminates explicit loops, making code faster and more readable.",
    courseId: "course-2",
    courseName: "Python for Machine Learning & AI",
    lessonId: "les-2-1-2",
    createdAt: "2026-05-15",
    updatedAt: "2026-05-15",
    pinned: false,
    folder: "Machine Learning",
  },
  {
    id: "note-3",
    title: "Color Theory Fundamentals",
    content:
      "## Color Harmonies\n\n- **Complementary**: Opposite on color wheel (high contrast)\n- **Analogous**: Adjacent colors (harmonious, low contrast)\n- **Triadic**: Three evenly spaced colors (vibrant)\n- **Split-complementary**: Base + two adjacent to complement\n\n## Accessibility\n\n- WCAG AA: 4.5:1 contrast ratio for normal text\n- WCAG AAA: 7:1 contrast ratio\n- Never rely on color alone to convey information\n- Test with colorblindness simulators\n\n## Brand Colors\n\n- Primary: Action, CTAs, links\n- Secondary: Supporting elements\n- Neutral: Text, backgrounds, borders\n- Semantic: Success, warning, error, info",
    courseId: "course-3",
    courseName: "UI/UX Design with Figma",
    lessonId: "les-3-1-1",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-12",
    pinned: true,
    folder: "Design",
  },
  {
    id: "note-4",
    title: "useReducer Pattern",
    content:
      "## When to Use useReducer\n\n- Complex state logic with multiple sub-values\n- Next state depends on the previous state\n- Multiple actions can modify state\n- Need to pass dispatch to child components\n\n## Pattern\n\n```typescript\ntype State = { count: number; error: string | null };\ntype Action = \n  | { type: 'increment' }\n  | { type: 'decrement' }\n  | { type: 'reset' };\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'increment': return { ...state, count: state.count + 1 };\n    case 'decrement': return { ...state, count: state.count - 1 };\n    case 'reset': return { ...state, count: 0 };\n  }\n}\n```",
    courseId: "course-1",
    courseName: "Complete React & Next.js Masterclass",
    lessonId: "les-1-2-3",
    createdAt: "2026-05-20",
    updatedAt: "2026-05-20",
    pinned: false,
    folder: "Web Development",
  },
  {
    id: "note-5",
    title: "Database Sharding Strategies",
    content:
      "## Sharding Approaches\n\n### Hash-Based\n- Apply hash function to shard key\n- Even distribution across shards\n- Difficult to add/remove shards (resharding)\n\n### Range-Based\n- Assign ranges to each shard\n- Good for range queries\n- Risk of hotspots (uneven distribution)\n\n### Directory-Based\n- Lookup service maps keys to shards\n- Most flexible\n- Single point of failure risk\n\n## Key Considerations\n- Choose shard key carefully\n- Cross-shard queries are expensive\n- Consider using consistent hashing",
    courseId: "course-4",
    courseName: "System Design for Senior Engineers",
    lessonId: "les-4-1-2",
    createdAt: "2026-05-25",
    updatedAt: "2026-05-25",
    pinned: false,
    folder: "System Design",
  },
];

// ------ FLASHCARD DECKS ------
export const mockFlashcardDecks: FlashcardDeck[] = [
  {
    id: "deck-1",
    title: "React Hooks Essentials",
    courseId: "course-1",
    courseName: "Complete React & Next.js Masterclass",
    lastStudied: "2026-06-01",
    mastery: 75,
    cards: [
      { id: "fc-1-1", front: "What is the purpose of useState?", back: "useState is a React Hook that lets you add state to functional components. It returns a state variable and a setter function.", courseId: "course-1", known: true },
      { id: "fc-1-2", front: "When does useEffect run?", back: "useEffect runs after every render by default. With a dependency array, it runs only when dependencies change. With an empty array, it runs once on mount.", courseId: "course-1", known: true },
      { id: "fc-1-3", front: "What is useContext used for?", back: "useContext subscribes to a React context, allowing components to consume values without prop drilling. It re-renders when the context value changes.", courseId: "course-1", known: false },
      { id: "fc-1-4", front: "What is the difference between useMemo and useCallback?", back: "useMemo memoizes a computed value, while useCallback memoizes a function reference. Both accept a dependency array and recompute when dependencies change.", courseId: "course-1", known: false },
      { id: "fc-1-5", front: "What does useRef do?", back: "useRef creates a mutable reference that persists across renders. It can hold DOM elements or any mutable value without causing re-renders when updated.", courseId: "course-1", known: true },
      { id: "fc-1-6", front: "How does useReducer differ from useState?", back: "useReducer manages complex state with a reducer function (state, action) => newState. It's better for state with multiple sub-values or when next state depends on previous state.", courseId: "course-1", known: false },
      { id: "fc-1-7", front: "What is a custom hook?", back: "A custom hook is a JavaScript function starting with 'use' that can call other hooks. It extracts reusable stateful logic from components.", courseId: "course-1", known: true },
      { id: "fc-1-8", front: "What are the rules of hooks?", back: "1) Only call hooks at the top level (no conditionals/loops). 2) Only call hooks from React functions (components or custom hooks). This ensures consistent hook ordering.", courseId: "course-1", known: false },
    ],
  },
  {
    id: "deck-2",
    title: "Python ML Fundamentals",
    courseId: "course-2",
    courseName: "Python for Machine Learning & AI",
    lastStudied: "2026-05-30",
    mastery: 45,
    cards: [
      { id: "fc-2-1", front: "What is the difference between a list and a NumPy array?", back: "NumPy arrays are homogeneous (same type), support vectorized operations, use less memory, and are much faster for numerical computations than Python lists.", courseId: "course-2", known: true },
      { id: "fc-2-2", front: "What is overfitting?", back: "Overfitting occurs when a model learns noise in training data rather than the underlying pattern, resulting in high training accuracy but poor generalization to new data.", courseId: "course-2", known: false },
      { id: "fc-2-3", front: "What is a DataFrame?", back: "A Pandas DataFrame is a 2D labeled data structure with columns of potentially different types. Think of it as a spreadsheet or SQL table in Python.", courseId: "course-2", known: true },
      { id: "fc-2-4", front: "What is gradient descent?", back: "An optimization algorithm that iteratively adjusts parameters in the direction of steepest descent of the cost function, using the gradient (partial derivatives) scaled by a learning rate.", courseId: "course-2", known: false },
      { id: "fc-2-5", front: "What is feature scaling?", back: "Normalizing or standardizing features to a similar range. Standardization: (x - mean) / std. Normalization: (x - min) / (max - min). Essential for gradient-based algorithms.", courseId: "course-2", known: false },
    ],
  },
  {
    id: "deck-3",
    title: "Design Principles",
    courseId: "course-3",
    courseName: "UI/UX Design with Figma",
    lastStudied: "2026-05-27",
    mastery: 88,
    cards: [
      { id: "fc-3-1", front: "What is the 60-30-10 color rule?", back: "A color proportion guideline: 60% dominant color (backgrounds), 30% secondary color (navigation, cards), 10% accent color (CTAs, highlights).", courseId: "course-3", known: true },
      { id: "fc-3-2", front: "What is visual hierarchy?", back: "The arrangement of elements to guide the viewer's attention in order of importance, using size, color, contrast, spacing, and typography weight.", courseId: "course-3", known: true },
      { id: "fc-3-3", front: "What is Fitts's Law?", back: "The time to reach a target is a function of the distance to and size of the target. Larger, closer targets are faster to click/tap — important for button sizing.", courseId: "course-3", known: true },
      { id: "fc-3-4", front: "What is the minimum touch target size?", back: "44x44 points (Apple) or 48x48dp (Google Material). Ensures interactive elements are large enough for comfortable touch interaction.", courseId: "course-3", known: true },
    ],
  },
];

// ------ QUIZZES ------
export const mockQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "React Fundamentals Quiz",
    courseId: "course-1",
    courseName: "Complete React & Next.js Masterclass",
    bestScore: 80,
    attempts: 2,
    timeLimit: 300,
    questions: [
      {
        id: "q-1-1",
        question: "What does JSX stand for?",
        options: ["JavaScript XML", "JavaScript Extension", "Java Syntax Extension", "JSON XML"],
        correctAnswer: 0,
        explanation: "JSX stands for JavaScript XML. It allows you to write HTML-like syntax in JavaScript, which React transforms into createElement calls.",
      },
      {
        id: "q-1-2",
        question: "Which hook is used to manage side effects in React?",
        options: ["useState", "useContext", "useEffect", "useReducer"],
        correctAnswer: 2,
        explanation: "useEffect is designed for side effects like data fetching, subscriptions, and DOM manipulation that can't be done during rendering.",
      },
      {
        id: "q-1-3",
        question: "What is the virtual DOM?",
        options: [
          "A direct copy of the browser DOM",
          "A lightweight JavaScript representation of the DOM",
          "A CSS rendering engine",
          "A server-side DOM implementation",
        ],
        correctAnswer: 1,
        explanation: "The virtual DOM is a lightweight JavaScript object that is a representation of the real DOM. React uses it to determine the minimal changes needed.",
      },
      {
        id: "q-1-4",
        question: "In Next.js App Router, components are Server Components by default.",
        options: ["True", "False", "Only in production", "Only with TypeScript"],
        correctAnswer: 0,
        explanation: "In the App Router, all components are Server Components by default. You need to add 'use client' directive to make them Client Components.",
      },
      {
        id: "q-1-5",
        question: "What is the purpose of the key prop in React lists?",
        options: [
          "Styling individual items",
          "Helping React identify which items changed",
          "Setting item priority",
          "Enabling animations",
        ],
        correctAnswer: 1,
        explanation: "Keys help React identify which items have changed, been added, or removed. They should be stable, unique identifiers.",
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Python Data Structures Quiz",
    courseId: "course-2",
    courseName: "Python for Machine Learning & AI",
    bestScore: null,
    attempts: 0,
    timeLimit: 240,
    questions: [
      {
        id: "q-2-1",
        question: "Which data structure is immutable in Python?",
        options: ["List", "Dictionary", "Tuple", "Set"],
        correctAnswer: 2,
        explanation: "Tuples are immutable — once created, their elements cannot be changed. Lists, dictionaries, and sets are all mutable.",
      },
      {
        id: "q-2-2",
        question: "What does numpy.reshape(-1, 1) do?",
        options: [
          "Flattens the array",
          "Reshapes to a column vector",
          "Transposes the array",
          "Reverses the array",
        ],
        correctAnswer: 1,
        explanation: "reshape(-1, 1) converts any array to a column vector (n rows, 1 column). The -1 means 'infer this dimension automatically'.",
      },
      {
        id: "q-2-3",
        question: "What is the time complexity of dictionary lookup in Python?",
        options: ["O(n)", "O(log n)", "O(1) average", "O(n²)"],
        correctAnswer: 2,
        explanation: "Python dictionaries use hash tables, providing O(1) average-case lookup time. Worst case is O(n) due to hash collisions, but this is rare.",
      },
      {
        id: "q-2-4",
        question: "Which Pandas method is used to handle missing values?",
        options: ["dropna() / fillna()", "remove() / replace()", "clean() / fix()", "delete() / insert()"],
        correctAnswer: 0,
        explanation: "dropna() removes rows/columns with missing values. fillna() replaces missing values with a specified value, mean, median, or method (forward/backward fill).",
      },
    ],
  },
  {
    id: "quiz-3",
    title: "Design Principles Quiz",
    courseId: "course-3",
    courseName: "UI/UX Design with Figma",
    bestScore: 100,
    attempts: 1,
    timeLimit: 180,
    questions: [
      {
        id: "q-3-1",
        question: "What is the minimum contrast ratio for WCAG AA compliance (normal text)?",
        options: ["3:1", "4.5:1", "7:1", "2:1"],
        correctAnswer: 1,
        explanation: "WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18px+ or 14px+ bold).",
      },
      {
        id: "q-3-2",
        question: "In the 8px grid system, which spacing value is NOT standard?",
        options: ["16px", "24px", "10px", "32px"],
        correctAnswer: 2,
        explanation: "The 8px grid uses multiples of 8: 8, 16, 24, 32, 40, 48, etc. 10px is not a multiple of 8 and breaks the system's consistency.",
      },
      {
        id: "q-3-3",
        question: "What does 'white space' do in design?",
        options: [
          "Wastes screen real estate",
          "Improves readability and visual hierarchy",
          "Slows down page load",
          "Reduces accessibility",
        ],
        correctAnswer: 1,
        explanation: "White space (negative space) improves readability, creates visual hierarchy, groups related elements, and gives designs a premium, uncluttered feel.",
      },
    ],
  },
];

// ------ ACTIVITY FEED ------
export const mockActivity: ActivityItem[] = [
  {
    id: "act-1",
    type: "lesson_complete",
    title: "Completed Lesson",
    description: "useContext and Custom Hooks — React & Next.js Masterclass",
    timestamp: "2026-06-02T14:30:00Z",
    icon: "check-circle",
  },
  {
    id: "act-2",
    type: "streak",
    title: "12-Day Streak! 🔥",
    description: "You've been learning consistently for 12 days straight",
    timestamp: "2026-06-02T09:00:00Z",
    icon: "flame",
  },
  {
    id: "act-3",
    type: "quiz_complete",
    title: "Quiz Completed",
    description: "Scored 80% on React Fundamentals Quiz",
    timestamp: "2026-06-01T16:45:00Z",
    icon: "trophy",
  },
  {
    id: "act-4",
    type: "flashcard_session",
    title: "Flashcard Session",
    description: "Reviewed 15 cards from React Hooks deck — 73% mastered",
    timestamp: "2026-06-01T10:20:00Z",
    icon: "layers",
  },
  {
    id: "act-5",
    type: "lesson_complete",
    title: "Completed Lesson",
    description: "NumPy for Numerical Computing — Python ML & AI",
    timestamp: "2026-05-31T15:00:00Z",
    icon: "check-circle",
  },
  {
    id: "act-6",
    type: "course_start",
    title: "Started New Course",
    description: "System Design for Senior Engineers",
    timestamp: "2026-05-20T11:00:00Z",
    icon: "play-circle",
  },
];

// ------ WEEKLY PROGRESS ------
export const mockWeeklyProgress: WeeklyProgress[] = [
  { day: "Mon", minutes: 45, lessons: 2 },
  { day: "Tue", minutes: 60, lessons: 3 },
  { day: "Wed", minutes: 30, lessons: 1 },
  { day: "Thu", minutes: 90, lessons: 4 },
  { day: "Fri", minutes: 20, lessons: 1 },
  { day: "Sat", minutes: 120, lessons: 5 },
  { day: "Sun", minutes: 75, lessons: 3 },
];

// ------ MONTHLY PROGRESS ------
export const mockMonthlyProgress: MonthlyProgress[] = [
  { week: "Week 1", hours: 8, courses: 1 },
  { week: "Week 2", hours: 12, courses: 2 },
  { week: "Week 3", hours: 6, courses: 1 },
  { week: "Week 4", hours: 15, courses: 3 },
];

// ------ STREAK CALENDAR DATA (last 12 weeks) ------
export const mockStreakData: { date: string; minutes: number }[] = (() => {
  const data: { date: string; minutes: number }[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // Simulate realistic study patterns
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const rand = Math.random();
    let minutes = 0;
    if (i < 12) {
      // Recent streak
      minutes = Math.floor(Math.random() * 90) + 20;
    } else if (rand > 0.3) {
      minutes = isWeekend
        ? Math.floor(Math.random() * 120) + 30
        : Math.floor(Math.random() * 60) + 10;
    }
    data.push({ date: dateStr, minutes });
  }
  return data;
})();

// ------ CATEGORIES ------
export const categories = [
  "All",
  "Web Development",
  "Machine Learning",
  "Design",
  "System Design",
  "Mobile Development",
  "Data Science",
  "DevOps",
];

// ------ RECOMMENDED COURSES (not enrolled) ------
export const recommendedCourses = [
  {
    id: "rec-1",
    title: "Docker & Kubernetes Masterclass",
    author: "TechWorld with Nana",
    category: "DevOps",
    duration: "18h 30m",
    rating: 4.8,
    lessons: 42,
  },
  {
    id: "rec-2",
    title: "Advanced TypeScript Patterns",
    author: "Matt Pocock",
    category: "Web Development",
    duration: "12h 15m",
    rating: 4.9,
    lessons: 35,
  },
  {
    id: "rec-3",
    title: "iOS Development with SwiftUI",
    author: "Paul Hudson",
    category: "Mobile Development",
    duration: "24h 00m",
    rating: 4.7,
    lessons: 58,
  },
];
