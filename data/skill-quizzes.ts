import type { QuizLevel } from '@/lib/skill-assessment';

export interface QuizQuestion {
  prompt: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
}

type Bank = Record<QuizLevel, QuizQuestion[]>;

const python: Bank = {
  easy: [
    { prompt: 'What does print(2 + 3) show?', choices: ['23', '5', '2 + 3', 'None'], answer: 1 },
    { prompt: 'Which type is the value "hello"?', choices: ['int', 'list', 'str', 'bool'], answer: 2 },
    { prompt: 'How do you start a comment in Python?', choices: ['//', '#', '/*', '--'], answer: 1 },
  ],
  medium: [
    { prompt: 'What is the value of [1, 2, 3][1]?', choices: ['1', '2', '3', 'Error'], answer: 1 },
    { prompt: 'Which keyword defines a function?', choices: ['func', 'def', 'function', 'fn'], answer: 1 },
    { prompt: 'What does len("ab") return?', choices: ['"ab"', '1', '2', '0'], answer: 2 },
  ],
  hard: [
    { prompt: 'What does [x * 2 for x in range(3)] produce?', choices: ['[1, 2, 3]', '[0, 2, 4]', '[2, 4, 6]', '[0, 1, 2]'], answer: 1 },
    { prompt: 'Which statement about a dict is true?', choices: ['Keys can repeat', 'Keys are unique', 'It keeps only values', 'Index 0 is always first'], answer: 1 },
    { prompt: 'What does *args collect in a function?', choices: ['Keyword pairs', 'A single string', 'Extra positional arguments', 'Only integers'], answer: 2 },
  ],
};

const javascript: Bank = {
  easy: [
    { prompt: 'Which keyword declares a value you can reassign?', choices: ['const', 'let', 'static', 'fixed'], answer: 1 },
    { prompt: 'What does console.log(2 + 2) print?', choices: ['22', '4', '"2+2"', 'undefined'], answer: 1 },
    { prompt: 'How do you write a single-line comment?', choices: ['# note', '// note', '<!-- note', '-- note'], answer: 1 },
  ],
  medium: [
    { prompt: 'What is typeof "5"?', choices: ['number', 'string', 'boolean', 'object'], answer: 1 },
    { prompt: 'Which method adds an item to the end of an array?', choices: ['push', 'add', 'append', 'insert'], answer: 0 },
    { prompt: 'What does [10, 20, 30][0] return?', choices: ['20', '30', '10', 'undefined'], answer: 2 },
  ],
  hard: [
    { prompt: 'What does === compare?', choices: ['Value only, with conversion', 'Value and type', 'Memory address only', 'String length'], answer: 1 },
    { prompt: 'Which array method returns a new array of transformed items?', choices: ['forEach', 'map', 'push', 'sort in place only'], answer: 1 },
    { prompt: 'A Promise that fails is handled with:', choices: ['.then only', '.catch or try/catch around await', 'JSON.parse', 'console.log'], answer: 1 },
  ],
};

const typescript: Bank = {
  easy: [
    { prompt: 'TypeScript adds what on top of JavaScript?', choices: ['A new browser', 'Static types', 'A database', 'CSS'], answer: 1 },
    { prompt: 'Which annotation matches a whole number variable?', choices: ['name: string', 'count: number', 'ok: array', 'id: html'], answer: 1 },
    { prompt: 'A TypeScript file commonly uses which extension?', choices: ['.py', '.ts', '.sql', '.md'], answer: 1 },
  ],
  medium: [
    { prompt: 'An interface describes:', choices: ['Runtime memory', 'The shape of an object', 'A CSS class', 'A git branch'], answer: 1 },
    { prompt: 'string | number means the value may be:', choices: ['Neither', 'Either type', 'Always both at once', 'Only null'], answer: 1 },
    { prompt: 'What does the ? in user?: string mean?', choices: ['The field is required', 'The field is optional', 'The field is a number', 'The field is private'], answer: 1 },
  ],
  hard: [
    { prompt: 'A generic function is useful when:', choices: ['The type should stay flexible and still be checked', 'You want to skip errors', 'You only return strings', 'You delete types at runtime yourself'], answer: 0 },
    { prompt: 'unknown is safer than any because:', choices: ['It turns off the compiler', 'You must narrow it before use', 'It is always a string', 'It allows implicit any'], answer: 1 },
    { prompt: 'A type error in the editor means:', choices: ['The quiz is wrong', 'The value may not match the declared type', 'JavaScript deleted the file', 'The server is down'], answer: 1 },
  ],
};

const react: Bank = {
  easy: [
    { prompt: 'A React component returns:', choices: ['A database row', 'UI (JSX)', 'A CSS file only', 'A terminal command'], answer: 1 },
    { prompt: 'Which hook stores a value that can change?', choices: ['useState', 'useCss', 'useSql', 'useGit'], answer: 0 },
    { prompt: 'JSX looks closest to:', choices: ['SQL', 'HTML inside JavaScript', 'A shell script', 'A PDF'], answer: 1 },
  ],
  medium: [
    { prompt: 'Props are:', choices: ['Inputs passed into a component', 'Secret server keys', 'CSS variables only', 'Database indexes'], answer: 0 },
    { prompt: 'To render a list, you usually call:', choices: ['array.map', 'array.sql', 'array.git', 'array.ping'], answer: 0 },
    { prompt: 'A click handler on a button is passed as:', choices: ['className', 'onClick', 'href only', 'key'], answer: 1 },
  ],
  hard: [
    { prompt: 'Why do list items need a stable key?', choices: ['So React can match rows when the list changes', 'To set the page title', 'To hash the password', 'To open a new tab'], answer: 0 },
    { prompt: 'Lifting state up means:', choices: ['Putting shared state in a parent', 'Deleting useState', 'Moving CSS to the database', 'Inlining every style'], answer: 0 },
    { prompt: 'useEffect with an empty dependency array runs:', choices: ['On every keystroke', 'After the first render', 'Only during CSS paint', 'Never'], answer: 1 },
  ],
};

const java: Bank = {
  easy: [
    { prompt: 'A Java program starts in which method?', choices: ['start()', 'main', 'runWeb()', 'initSql()'], answer: 1 },
    { prompt: 'Which type stores text?', choices: ['int', 'String', 'boolean only', 'double only'], answer: 1 },
    { prompt: 'A statement ends with:', choices: [':', ';', '#', '>>'], answer: 1 },
  ],
  medium: [
    { prompt: 'new ArrayList<>() creates:', choices: ['A fixed primitive array only', 'A resizable list', 'A database', 'A thread pool'], answer: 1 },
    { prompt: 'Which keyword inherits a class?', choices: ['implements only', 'extends', 'imports', 'throws'], answer: 1 },
    { prompt: 'System.out.println is used to:', choices: ['Compile the file', 'Print a line', 'Open a socket', 'Delete a class'], answer: 1 },
  ],
  hard: [
    { prompt: 'An interface can be implemented by:', choices: ['Only one class in the whole program', 'Any class that supplies the methods', 'Only static methods', 'Only the main class'], answer: 1 },
    { prompt: 'equals() is preferred over == for Strings because:', choices: ['== compares references, equals compares contents', '== is slower always', 'equals ignores the JVM', '== checks SQL'], answer: 0 },
    { prompt: 'A checked exception must be:', choices: ['Ignored', 'Caught or declared with throws', 'Cast to int', 'Printed only'], answer: 1 },
  ],
};

const cpp: Bank = {
  easy: [
    { prompt: 'Which header lets you use cout?', choices: ['<iostream>', '<python.h>', '<sql>', '<react>'], answer: 0 },
    { prompt: 'A whole number variable is often:', choices: ['int', 'cout', 'include', 'class only'], answer: 0 },
    { prompt: 'A line comment starts with:', choices: ['#', '//', '<!--', '"""'], answer: 1 },
  ],
  medium: [
    { prompt: 'What does std::vector give you?', choices: ['A resizable array', 'A web server', 'A CSS grid', 'A git remote'], answer: 0 },
    { prompt: 'A pointer stores:', choices: ['The color of a button', 'An address', 'A database URL only', 'A JSX tag'], answer: 1 },
    { prompt: 'Which loop runs while a condition is true?', choices: ['while', 'class', 'namespace', 'template'], answer: 0 },
  ],
  hard: [
    { prompt: 'A reference parameter differs from pass-by-value because:', choices: ['The function can use the caller’s object', 'It always copies 1 byte', 'It deletes the caller', 'It only works for strings'], answer: 0 },
    { prompt: 'delete is paired with memory from:', choices: ['new', 'cout', 'include', 'return'], answer: 0 },
    { prompt: 'A class destructor runs when:', choices: ['The object’s lifetime ends', 'The file is named .cpp', 'main starts', 'You print Hello'], answer: 0 },
  ],
};

const sql: Bank = {
  easy: [
    { prompt: 'Which statement reads rows?', choices: ['SELECT', 'DELETE TABLE', 'PUSH', 'RENDER'], answer: 0 },
    { prompt: 'WHERE is used to:', choices: ['Filter rows', 'Draw a button', 'Compile Java', 'Start git'], answer: 0 },
    { prompt: 'A table is made of:', choices: ['Rows and columns', 'Only CSS', 'Only functions', 'Threads'], answer: 0 },
  ],
  medium: [
    { prompt: 'COUNT(*) returns:', choices: ['The first name', 'How many rows match', 'A foreign key file', 'The server port'], answer: 1 },
    { prompt: 'INNER JOIN keeps rows that:', choices: ['Match in both tables', 'Exist only on the left always', 'Have no key', 'Are comments'], answer: 0 },
    { prompt: 'ORDER BY name ASC sorts:', choices: ['A to Z', 'Randomly', 'By file size', 'By CSS color'], answer: 0 },
  ],
  hard: [
    { prompt: 'A primary key should be:', choices: ['Unique for each row', 'Repeated on every row', 'A CSS class', 'Optional and duplicated'], answer: 0 },
    { prompt: 'An index mainly helps:', choices: ['Lookups on a column', 'Printing HTML', 'Renaming a repo', 'Closing a laptop'], answer: 0 },
    { prompt: 'GROUP BY is used when you want:', choices: ['One result per group, often with COUNT or SUM', 'To delete the database', 'To join CSS', 'To start a transaction named git'], answer: 0 },
  ],
};

const dsa: Bank = {
  easy: [
    { prompt: 'An array gives you:', choices: ['Indexed items in order', 'A CSS layout', 'A remote server', 'An email inbox'], answer: 0 },
    { prompt: 'A stack removes the item that was:', choices: ['Added last', 'Added first only', 'Random', 'Never stored'], answer: 0 },
    { prompt: 'Big-O describes:', choices: ['How the work grows as input grows', 'The font size', 'The college name', 'A password'], answer: 0 },
  ],
  medium: [
    { prompt: 'A queue removes the item that was:', choices: ['Added first', 'Added last', 'Largest only', 'A pointer'], answer: 0 },
    { prompt: 'Binary search needs the array to be:', choices: ['Sorted', 'Empty', 'Only strings of length 1', 'Unsorted on purpose'], answer: 0 },
    { prompt: 'A linked list node stores:', choices: ['A value and a link to the next node', 'Only CSS', 'A whole database', 'A git commit message only'], answer: 0 },
  ],
  hard: [
    { prompt: 'A hash map average lookup is:', choices: ['Constant time if the hash spreads well', 'Always slower than linear search', 'Impossible', 'Equal to n!'], answer: 0 },
    { prompt: 'DFS on a graph needs a visited set so you:', choices: ['Do not loop forever on a cycle', 'Sort the alphabet', 'Print HTML', 'Drop every edge'], answer: 0 },
    { prompt: 'A balanced BST keeps search near:', choices: ['log n', 'n squared always, even when balanced', 'The size of the monitor', '1 byte total'], answer: 0 },
  ],
};

const git: Bank = {
  easy: [
    { prompt: 'git status shows:', choices: ['What changed in the working folder', 'Your CGPA', 'Open browser tabs', 'SQL tables'], answer: 0 },
    { prompt: 'git commit records:', choices: ['A snapshot with a message', 'A React component', 'A placement year', 'A PDF certificate'], answer: 0 },
    { prompt: 'A repository is:', choices: ['The project history', 'A CSS color', 'A quiz score only', 'A phone number'], answer: 0 },
  ],
  medium: [
    { prompt: 'A branch lets you:', choices: ['Work on a change without overwriting main', 'Delete the remote always', 'Skip commits', 'Compile C++'], answer: 0 },
    { prompt: 'git pull brings:', choices: ['Remote commits into your copy', 'A new laptop', 'Node modules only', 'The quiz answers'], answer: 0 },
    { prompt: 'A merge conflict means:', choices: ['Two edits touched the same lines', 'The file is a video', 'Git is uninstalled', 'The year is wrong'], answer: 0 },
  ],
  hard: [
    { prompt: 'git rebase replays commits to:', choices: ['Put your work on a newer base', 'Erase the remote for everyone with no warning', 'Change file permissions only', 'Create a PDF'], answer: 0 },
    { prompt: 'HEAD points at:', choices: ['The commit you currently have checked out', 'The oldest commit only', 'Your email', 'The main CSS file'], answer: 0 },
    { prompt: 'A pull request is:', choices: ['A proposal to merge one branch into another', 'A SQL join', 'A React prop', 'A certificate upload'], answer: 0 },
  ],
};

const ml: Bank = {
  easy: [
    { prompt: 'Supervised learning uses:', choices: ['Examples with known answers', 'Only unlabeled noise', 'A CSS grid', 'A git tag'], answer: 0 },
    { prompt: 'A training set is:', choices: ['Data the model learns from', 'The final exam hall', 'A Docker image', 'A navbar'], answer: 0 },
    { prompt: 'Accuracy means:', choices: ['How often the prediction matches the label', 'The file size', 'The number of semesters', 'The font weight'], answer: 0 },
  ],
  medium: [
    { prompt: 'Overfitting looks like:', choices: ['Great on training data, weak on new data', 'Weak on everything including training', 'A SQL syntax error', 'A missing import only'], answer: 0 },
    { prompt: 'A feature is:', choices: ['An input column the model can use', 'The page footer', 'A git branch', 'A certificate'], answer: 0 },
    { prompt: 'A validation split is for:', choices: ['Checking the model before the final test', 'Storing passwords', 'Drawing charts only', 'Uploading video'], answer: 0 },
  ],
  hard: [
    { prompt: 'Precision matters when:', choices: ['False alarms are costly', 'You only care about file names', 'The label is a color', 'The dataset is a single row you memorized'], answer: 0 },
    { prompt: 'A learning rate that is too high can:', choices: ['Make training jump past a good solution', 'Guarantee 100% on new data', 'Remove the need for features', 'Sort the labels alphabetically'], answer: 0 },
    { prompt: 'Leakage happens when:', choices: ['Test information sneaks into training', 'The notebook is closed', 'You use Python', 'The quiz is easy'], answer: 0 },
  ],
};

const docker: Bank = {
  easy: [
    { prompt: 'A container packages:', choices: ['An app and what it needs to run', 'Only a PDF', 'Your CGPA', 'A git username'], answer: 0 },
    { prompt: 'A Dockerfile is:', choices: ['The recipe for an image', 'A SQL table', 'A React hook', 'A quiz'], answer: 0 },
    { prompt: 'docker run is used to:', choices: ['Start a container', 'Delete git history', 'Compile a resume theme', 'Set the placement year'], answer: 0 },
  ],
  medium: [
    { prompt: 'An image differs from a container because:', choices: ['The image is the template; the container is a running instance', 'They are the same word', 'The image is a video file', 'The container is a certificate'], answer: 0 },
    { prompt: 'A port mapping like 3000:3000:', choices: ['Lets your machine reach the app inside the container', 'Uploads a certificate', 'Sets CGPA', 'Creates a branch'], answer: 0 },
    { prompt: 'A volume is used to:', choices: ['Keep files after the container stops', 'Minify CSS', 'Hash passwords in the quiz', 'Change your branch'], answer: 0 },
  ],
  hard: [
    { prompt: 'A multi-stage build helps you:', choices: ['Copy only the built app into a smaller final image', 'Store the quiz score', 'Skip tests in college', 'Remove the need for a base image entirely with no OS'], answer: 0 },
    { prompt: '.dockerignore is for:', choices: ['Keeping secrets and junk out of the image', 'Ignoring SQL', 'Hiding the placement year', 'Commenting JSX'], answer: 0 },
    { prompt: 'If a container exits immediately, you check:', choices: ['The command it was told to run and its logs', 'The navbar color', 'The student phone field', 'The quiz timer'], answer: 0 },
  ],
};

const node: Bank = {
  easy: [
    { prompt: 'Node.js runs JavaScript:', choices: ['Outside the browser, on a machine', 'Only inside Photoshop', 'Only as SQL', 'Only as CSS'], answer: 0 },
    { prompt: 'package.json lists:', choices: ['The project and its dependencies', 'Your CGPA history', 'Placement drives', 'Quiz photos'], answer: 0 },
    { prompt: 'npm install:', choices: ['Downloads the packages the project needs', 'Starts a placement drive', 'Compiles C++ only', 'Uploads a certificate'], answer: 0 },
  ],
  medium: [
    { prompt: 'An HTTP server in Node listens so it can:', choices: ['Answer requests', 'Draw a Figma file', 'Replace git', 'Grade CGPA'], answer: 0 },
    { prompt: 'process.env is where you read:', choices: ['Configuration such as a port or secret name', 'JSX', 'A student photo', 'CSS variables only'], answer: 0 },
    { prompt: 'A JSON body from a client is:', choices: ['Text you parse into an object', 'A video', 'A branch name', 'A quiz level'], answer: 0 },
  ],
  hard: [
    { prompt: 'The event loop lets Node:', choices: ['Keep serving other work while one task waits', 'Run only one line per day', 'Skip errors', 'Block every request until midnight'], answer: 0 },
    { prompt: 'An unhandled rejected promise should be:', choices: ['Caught and turned into a clear error response', 'Ignored in production', 'Printed as CGPA', 'Saved as a certificate'], answer: 0 },
    { prompt: 'A middleware function runs:', choices: ['Before the route handler, and can stop the request', 'After the student graduates only', 'Inside CSS', 'Only on git push'], answer: 0 },
  ],
};

const cloud: Bank = {
  easy: [
    { prompt: 'A cloud account lets you:', choices: ['Rent compute and storage instead of buying a server', 'Replace your degree', 'Skip labs', 'Edit the navbar only'], answer: 0 },
    { prompt: 'An object storage bucket holds:', choices: ['Files', 'Only SQL joins', 'Quiz personalities', 'Git commits by themselves'], answer: 0 },
    { prompt: 'A free tier is:', choices: ['A limited amount you can use without paying first', 'Unlimited GPUs', 'A certificate', 'A branch change'], answer: 0 },
  ],
  medium: [
    { prompt: 'A region is:', choices: ['The geographic place where the resources run', 'A React prop', 'A quiz difficulty', 'Your section'], answer: 0 },
    { prompt: 'IAM is about:', choices: ['Who can do what in the account', 'Image alt text', 'CGPA formulas', 'CSS grids'], answer: 0 },
    { prompt: 'You shut unused resources so:', choices: ['The bill and the attack surface stay small', 'Git history grows', 'The quiz gets harder', 'The placement year changes'], answer: 0 },
  ],
  hard: [
    { prompt: 'A security group should allow:', choices: ['Only the ports your app needs', 'Every port from the whole internet by default', 'SSH for the world with password "admin"', 'Nothing, including your own app'], answer: 0 },
    { prompt: 'Infrastructure as code means:', choices: ['The servers are described in a file you can review', 'You click 40 screens and hope', 'You email a coordinator the IP', 'You store passwords in the repo'], answer: 0 },
    { prompt: 'Least privilege means:', choices: ['A key can do only the job it was made for', 'One admin key for every student', 'Public buckets for resumes', 'Sharing the root password'], answer: 0 },
  ],
};

const communication: Bank = {
  easy: [
    { prompt: 'Active listening includes:', choices: ['Restating the other person’s point before you answer', 'Waiting to talk over them', 'Checking your phone', 'Sending a blank email'], answer: 0 },
    { prompt: 'A clear update names:', choices: ['What happened, what is next, and who owns it', 'Only a greeting', 'Your CGPA three times', 'A private joke'], answer: 0 },
    { prompt: 'In a team chat, a good question is:', choices: ['Specific about what you tried', '“It doesn’t work” with no detail', 'All caps', 'A forwarded meme'], answer: 0 },
  ],
  medium: [
    { prompt: 'When two ideas clash, a useful first step is:', choices: ['Separate the goal from the personal disagreement', 'Pick a side loudly', 'Leave the group', 'Change the subject to marks'], answer: 0 },
    { prompt: 'A short talk for a drive should:', choices: ['Lead with the result, then the work behind it', 'Start with every subject you ever took', 'Avoid numbers', 'Read the resume word for word'], answer: 0 },
    { prompt: 'Feedback is easier to use when it is:', choices: ['About the work and one next step', 'About the person’s character', 'Public and vague', 'Only praise'], answer: 0 },
  ],
  hard: [
    { prompt: 'A coordinator email that gets a reply includes:', choices: ['A subject, a one-line ask, and the time you are free', 'A novel', 'No name', 'Three different requests in the subject'], answer: 0 },
    { prompt: 'In a conflict on a project, you document:', choices: ['The decision, the reason, and the date', 'Only who was loudest', 'Nothing', 'The other person’s phone contacts'], answer: 0 },
    { prompt: 'Leading a small team means:', choices: ['You make the next step obvious and check blockers', 'You do every task yourself in silence', 'You skip standups', 'You grade teammates'], answer: 0 },
  ],
};

const systemDesign: Bank = {
  easy: [
    { prompt: 'A client and a server talk so that:', choices: ['The app can ask for data and get a response', 'CSS loads SQL', 'Git commits the UI', 'A quiz replaces the database'], answer: 0 },
    { prompt: 'A database is where you:', choices: ['Store records you need again', 'Only draw buttons', 'Host the placement year', 'Compile C++'], answer: 0 },
    { prompt: 'An API is:', choices: ['A agreed way for programs to request work', 'A font', 'A certificate scan', 'A branch name'], answer: 0 },
  ],
  medium: [
    { prompt: 'A cache is useful when:', choices: ['The same answer is read often and can be slightly stale', 'Every request must hit disk', 'You want slower pages', 'You are storing passwords in the browser'], answer: 0 },
    { prompt: 'Horizontal scaling means:', choices: ['Adding more machines', 'Buying a taller monitor', 'Increasing CGPA', 'One bigger laptop only'], answer: 0 },
    { prompt: 'A load balancer:', choices: ['Spreads requests across servers', 'Writes your resume', 'Grades quizzes', 'Replaces SQL joins'], answer: 0 },
  ],
  hard: [
    { prompt: 'You pick a queue when:', choices: ['Work can finish a moment later and must not be lost', 'The user must see the pixel change in the same millisecond always', 'You have one user total', 'You want to skip errors'], answer: 0 },
    { prompt: 'A single leader for writes avoids:', choices: ['Two writers inventing different values for the same row', 'All reads', 'Backups', 'Indexes'], answer: 0 },
    { prompt: 'You state a bottleneck by naming:', choices: ['The slowest step and what happens when traffic doubles', 'The logo color', 'The student’s hobby', 'The quiz difficulty'], answer: 0 },
  ],
};

const BANKS: Record<string, Bank> = {
  python,
  javascript,
  typescript,
  'react.js': react,
  react,
  'node.js': node,
  node,
  java,
  'c++': cpp,
  cpp,
  sql,
  postgresql: sql,
  'data structures & algorithms': dsa,
  dsa,
  git,
  'machine learning': ml,
  docker,
  'cloud / aws': cloud,
  aws: cloud,
  'communication & leadership': communication,
  communication: communication,
  'system design': systemDesign,
};

function generic(skill: string): Bank {
  return {
    easy: [
      {
        prompt: `A first check that you can use ${skill} is:`,
        choices: ['You have only heard the name', 'You finish a small guided exercise and can repeat it', 'You saved a logo', 'You changed your branch'],
        answer: 1,
      },
      {
        prompt: `When a beginner ${skill} step fails, you:`,
        choices: ['Delete the project', 'Guess ten changes at once', 'Read the error and change one thing', 'Skip to a certificate'],
        answer: 2,
      },
      {
        prompt: `Basic ${skill} practice looks like:`,
        choices: ['A full production system on day one', 'Only watching others', 'A blank file with no run', 'Short repetitions on one idea'],
        answer: 3,
      },
    ],
    medium: [
      {
        prompt: `Working knowledge of ${skill} means you can:`,
        choices: ['Recite the definition only', 'Build a small piece without a line-by-line guide', 'Name the tool and stop', 'Wait for a teammate on every step'],
        answer: 1,
      },
      {
        prompt: `A useful debug loop in ${skill} is:`,
        choices: ['Rewrite everything', 'Hide the error', 'Reproduce, change one cause, check the result', 'Ask for the answer key first'],
        answer: 2,
      },
      {
        prompt: `You would show intermediate ${skill} work as:`,
        choices: ['A private note with no steps', 'A file name only', 'A screenshot of a course homepage', 'A small result someone else can run or review'],
        answer: 3,
      },
    ],
    hard: [
      {
        prompt: `Advanced ${skill} includes explaining:`,
        choices: ['Only the happy path', 'The trade-off you chose and what breaks if the input grows', 'The course thumbnail', 'Your placement year'],
        answer: 1,
      },
      {
        prompt: `Before you call a ${skill} design done, you:`,
        choices: ['Assume it never fails', 'Hide the steps', 'Name the failure case and how you would notice it', 'Skip review'],
        answer: 2,
      },
      {
        prompt: `A strong ${skill} review comment points at:`,
        choices: ['“Looks fine” with no look', 'The font', 'Someone else’s CGPA', 'A concrete risk and a smaller alternative'],
        answer: 3,
      },
    ],
  };
}

function genericExtra(skill: string): Bank {
  return {
    easy: [
      { prompt: `A beginner exercise in ${skill} is done when:`, choices: ['You can run it again without the walkthrough', 'You only saved the link', 'The file name contains the skill', 'You changed your branch'], answer: 0 },
      { prompt: `The first thing you check when a basic ${skill} step fails is:`, choices: ['The exact error and the last change', 'A new certificate', 'Your CGPA', 'A different career goal'], answer: 0 },
      { prompt: `Basic ${skill} vocabulary is useful because:`, choices: ['You can follow a lab handout and ask a precise question', 'It replaces practice', 'It sets the placement year', 'It skips the assignment'], answer: 0 },
    ],
    medium: [
      { prompt: `Intermediate ${skill} work includes:`, choices: ['Changing one part and predicting the result', 'Watching a full playlist with no file of your own', 'Renaming folders only', 'Copying an answer you cannot explain'], answer: 0 },
      { prompt: `You would debug ${skill} by:`, choices: ['Reproducing the failure, then testing one cause', 'Rewriting the whole project first', 'Hiding the error', 'Asking for the scored sheet'], answer: 0 },
      { prompt: `A classmate can review your ${skill} work when:`, choices: ['They can run or read the steps you kept', 'You only name the tool', 'The screenshot is a homepage', 'The note is on your phone with no file'], answer: 0 },
    ],
    hard: [
      { prompt: `An advanced ${skill} choice should name:`, choices: ['What you gained and what gets worse if the input grows', 'Only the happy path', 'The course thumbnail', 'Your section'], answer: 0 },
      { prompt: `Before calling a ${skill} design finished, you:`, choices: ['Write the failure you expect and how you would notice it', 'Assume it never fails', 'Hide the steps', 'Skip review'], answer: 0 },
      { prompt: `A useful critique of ${skill} work points at:`, choices: ['A concrete risk and a smaller alternative', '“Looks fine” with no look', 'The font', 'Someone else’s marks'], answer: 0 },
    ],
  };
}

const EXTRAS: Record<string, Bank> = {
  python: {
    easy: [
      { prompt: 'Which value is an int?', choices: ['"3"', '3', '3.0 only as text', '[3]'], answer: 1 },
      { prompt: 'input() returns:', choices: ['Always an int', 'A string', 'A list', 'A file'], answer: 1 },
      { prompt: 'Indentation in Python:', choices: ['Is optional decoration', 'Groups the lines inside a block', 'Replaces the colon', 'Only matters in comments'], answer: 1 },
    ],
    medium: [
      { prompt: 'range(2) yields:', choices: ['1, 2', '0, 1', '2, 3', '0, 2'], answer: 1 },
      { prompt: 'A for loop over a list visits:', choices: ['Each item, in order', 'Only the last item', 'The indexes as strings only', 'Nothing unless you call len'], answer: 0 },
      { prompt: 's.lower() on "Py" returns:', choices: ['"PY"', '"Py"', '"py"', '"pY"'], answer: 2 },
    ],
    hard: [
      { prompt: 'A function that returns None and one that prints a value differ because:', choices: ['Return gives a value the caller can use; print only shows it', 'They are the same', 'Print stores the value in a list', 'Return always writes a file'], answer: 0 },
      { prompt: 'Why keep a virtual environment for a project?', choices: ['The project’s packages stay separate from other projects', 'Python refuses global installs always', 'It compiles C++', 'It sets your CGPA'], answer: 0 },
      { prompt: 'An exception you do not catch will:', choices: ['Stop that run and show a traceback', 'Turn into an empty list', 'Be ignored in every program', 'Convert the value to 0'], answer: 0 },
    ],
  },
  javascript: {
    easy: [
      { prompt: 'Which pair of quotes starts a string?', choices: ['/* */', '"hello"', '#hello', '<hello>'], answer: 1 },
      { prompt: 'An array is written with:', choices: ['( )', '{ } only', '[ ]', '<% %>'], answer: 2 },
      { prompt: 'true is a:', choices: ['string', 'boolean', 'number', 'element'], answer: 1 },
    ],
    medium: [
      { prompt: 'What is "5" + 1 in JavaScript?', choices: ['6', '"51"', 'NaN always', '1'], answer: 1 },
      { prompt: 'A function saved in a const is called with:', choices: ['the name and parentheses', 'git commit', 'SELECT', 'a CSS class'], answer: 0 },
      { prompt: 'obj.name reads:', choices: ['The name property', 'The file name on disk', 'The git branch', 'The quiz level'], answer: 0 },
    ],
    hard: [
      { prompt: 'const user = { city: "Bhopal" }; user.city = "Indore" is:', choices: ['Allowed, because the binding is fixed but the object can change', 'A syntax error always', 'A SQL update', 'Impossible with const'], answer: 0 },
      { prompt: 'filter returns:', choices: ['A new array of items that pass the test', 'The original array, emptied', 'A single boolean', 'A promise only'], answer: 0 },
      { prompt: 'await can be used:', choices: ['Inside an async function, in front of a promise', 'Before any const', 'Only in CSS', 'Only on numbers'], answer: 0 },
    ],
  },
  java: {
    easy: [
      { prompt: 'A class is saved in a file that usually ends with:', choices: ['.py', '.java', '.jsx', '.sql'], answer: 1 },
      { prompt: 'int age = 20; stores:', choices: ['Text', 'A whole number', 'A table', 'A webpage'], answer: 1 },
      { prompt: 'public static void main is:', choices: ['Where a simple program starts', 'A CSS selector', 'A git command', 'A React hook'], answer: 0 },
    ],
    medium: [
      { prompt: 'A constructor runs when:', choices: ['The object is created with new', 'The file is renamed', 'You print the class name only', 'The semester ends'], answer: 0 },
      { prompt: 'An ArrayList index starts at:', choices: ['1', '0', '-1', 'The length'], answer: 1 },
      { prompt: 'private on a field means:', choices: ['Other classes should use methods instead of touching it directly', 'The field is global', 'The field is a web route', 'The field is deleted'], answer: 0 },
    ],
    hard: [
      { prompt: 'Overriding a method means:', choices: ['A subclass supplies its own version of a parent method', 'You delete the JDK', 'You rename the file twice', 'You skip main'], answer: 0 },
      { prompt: 'A NullPointerException often means:', choices: ['You used an object reference that was null', 'The class name is too long', 'The file compiled to Python', 'The list is merely empty and that is always this error'], answer: 0 },
      { prompt: 'try / catch is for:', choices: ['Handling a failure you expect might happen', 'Declaring a variable', 'Importing a package', 'Printing every line twice'], answer: 0 },
    ],
  },
  'data structures & algorithms': {
    easy: [
      { prompt: 'The item at the front of a queue is the one:', choices: ['Inserted most recently', 'Waiting the longest', 'With the longest name', 'Never inserted'], answer: 1 },
      { prompt: 'Linear search checks items:', choices: ['One by one until it finds a match or finishes', 'Only at the middle', 'In random pairs', 'By compiling them'], answer: 0 },
      { prompt: 'O(1) means the work:', choices: ['Grows with every extra item', 'Stays about the same as the input grows', 'Is always one byte of RAM', 'Is impossible'], answer: 1 },
    ],
    medium: [
      { prompt: 'A binary search on 1000 sorted items needs about:', choices: ['1000 checks', 'A handful of checks, around log2 of 1000', 'One check only if the item is last', 'n! checks'], answer: 1 },
      { prompt: 'Push then pop on a stack returns:', choices: ['The older item underneath', 'The item you just pushed', 'A sorted copy', 'Nothing, stacks cannot pop'], answer: 1 },
      { prompt: 'A hash collision is when:', choices: ['Two keys land in the same slot', 'The array is unsorted on purpose', 'The stack is empty', 'The graph has no edges'], answer: 0 },
    ],
    hard: [
      { prompt: 'Merge sort’s usual time is:', choices: ['O(n log n)', 'O(1) for any input', 'O(n!) always', 'The length of the longest string only'], answer: 0 },
      { prompt: 'BFS on an unweighted graph finds:', choices: ['A shortest path in number of edges', 'The maximum spanning tree only', 'A CSS layout', 'A sorted hash'], answer: 0 },
      { prompt: 'You pick a linked list over an array when:', choices: ['You insert and delete in the middle often and can afford slower index lookup', 'You need O(1) index every time', 'The data must be a video', 'You need SQL joins'], answer: 0 },
    ],
  },
  sql: {
    easy: [
      { prompt: 'SELECT name FROM students limits the result to:', choices: ['Every column', 'The name column', 'The database server log', 'A React list'], answer: 1 },
      { prompt: 'INSERT adds:', choices: ['A new row', 'A new programming language', 'A CSS file', 'A git branch'], answer: 0 },
      { prompt: 'NULL means:', choices: ['The number 0', 'An empty string always', 'No value is stored', 'The row is deleted'], answer: 2 },
    ],
    medium: [
      { prompt: 'WHERE cgpa >= 8 keeps rows that:', choices: ['Have CGPA of 8 or more', 'Have any CGPA', 'Are the first row only', 'Have a null name'], answer: 0 },
      { prompt: 'COUNT(branch) skips:', choices: ['Rows where branch is NULL', 'Every row', 'Rows where branch is CSE', 'Nothing, it equals COUNT(*)'], answer: 0 },
      { prompt: 'A foreign key points at:', choices: ['A primary key in another table', 'A CSS class', 'A file path only', 'The query’s comment'], answer: 0 },
    ],
    hard: [
      { prompt: 'LEFT JOIN keeps:', choices: ['Every row from the left table, with matches from the right when they exist', 'Only rows that match', 'Only the right table', 'A cartesian product with no condition you can filter'], answer: 0 },
      { prompt: 'An index you never use still:', choices: ['Can slow writes, because it must be updated', 'Makes every SELECT instant with no cost', 'Replaces the primary key', 'Deletes duplicate rows'], answer: 0 },
      { prompt: 'A transaction COMMIT means:', choices: ['The grouped changes are saved together', 'The database is dropped', 'The query is only printed', 'The table is renamed to git'], answer: 0 },
    ],
  },
  react: {
    easy: [
      { prompt: 'You pass a title into a component through:', choices: ['props', 'the file extension', 'a SQL column', 'git status'], answer: 0 },
      { prompt: 'A component name in JSX should start with:', choices: ['a lowercase tag like a plain div only', 'a capital letter', 'a number', 'a #'], answer: 1 },
      { prompt: 'useState’s first value is:', choices: ['The initial state', 'The CSS file', 'The server port', 'The route list'], answer: 0 },
    ],
    medium: [
      { prompt: 'Changing state with the setter:', choices: ['Schedules a re-render with the new value', 'Edits the DOM string in place and skips React', 'Writes a database row', 'Renames the component'], answer: 0 },
      { prompt: 'Conditional rendering {ok && <Badge />} shows the badge when:', choices: ['ok is truthy', 'ok is always false', 'the file is .css', 'the key is missing'], answer: 0 },
      { prompt: 'A controlled input’s value comes from:', choices: ['React state', 'A random attribute each keystroke', 'The database only', 'The component’s file name'], answer: 0 },
    ],
    hard: [
      { prompt: 'A missing effect dependency can:', choices: ['Show stale state inside the effect', 'Make JSX illegal', 'Turn props into SQL', 'Disable the bundler'], answer: 0 },
      { prompt: 'You lift state when:', choices: ['Two children must share the same value', 'You want each child to invent a different copy on purpose', 'The value is a CSS color only', 'The component is a string'], answer: 0 },
      { prompt: 'React.memo skips a re-render when:', choices: ['The props you compare have not changed', 'Any parent state changes, always', 'The component uses useState', 'The file is named page.tsx'], answer: 0 },
    ],
  },
};

export function questionsFor(skill: string, level: QuizLevel): QuizQuestion[] {
  const key = skill.trim().toLowerCase();
  const alias = key.replace(/\.js$/, '');
  const bank = BANKS[key] ?? BANKS[alias] ?? generic(skill.trim() || 'this skill');
  const extra =
    EXTRAS[key]?.[level] ??
    EXTRAS[alias]?.[level] ??
    (alias === 'postgresql' || alias === 'dsa' ? EXTRAS[alias === 'dsa' ? 'data structures & algorithms' : 'sql']?.[level] : undefined) ??
    genericExtra(skill.trim() || 'this skill')[level];
  return [...bank[level], ...extra].slice(0, 6);
}
