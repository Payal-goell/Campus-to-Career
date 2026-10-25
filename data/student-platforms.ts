export interface StudentPlatform {
  name: string;
  detail: string;
  url: string;
  cost: 'Free' | 'Audit free' | 'Paid';
}

/** Platforms RGPV students already open for courses and certificates. */
export const STUDENT_PLATFORMS: StudentPlatform[] = [
  {
    name: 'NPTEL',
    detail: 'IIT lecture series used alongside RGPV subjects. Weekly assignments are free. The proctored e-certificate is a small exam fee.',
    url: 'https://nptel.ac.in/courses/106106145',
    cost: 'Free',
  },
  {
    name: 'SWAYAM',
    detail: 'Government course catalog that hosts NPTEL and other Indian university programs.',
    url: 'https://swayam.gov.in/explorer',
    cost: 'Free',
  },
  {
    name: 'Coursera',
    detail: 'Python for Everybody and the Google career certificates. Audit the lessons on a college schedule. The shareable certificate is a separate purchase.',
    url: 'https://www.coursera.org/specializations/python',
    cost: 'Audit free',
  },
  {
    name: 'Udemy',
    detail: '100 Days of Code and the web developer bootcamp. Students usually buy these in a sale. The completion certificate comes with the purchase.',
    url: 'https://www.udemy.com/course/100-days-of-code/',
    cost: 'Paid',
  },
  {
    name: 'Infosys Springboard',
    detail: 'Free programming, aptitude, and soft-skill courses aimed at students heading into campus placements.',
    url: 'https://infyspringboard.onwingspan.com/web/en/page/home',
    cost: 'Free',
  },
  {
    name: 'Great Learning Academy',
    detail: 'Short courses in Python, Excel, and machine learning with a completion certificate.',
    url: 'https://www.mygreatlearning.com/academy',
    cost: 'Free',
  },
  {
    name: 'GeeksforGeeks',
    detail: 'DSA and core CS articles students use for labs, viva, and placement practice.',
    url: 'https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/',
    cost: 'Free',
  },
  {
    name: 'HackerRank',
    detail: 'Timed skill tests in Java, Python, SQL, and problem solving. A passed test gives a shareable badge.',
    url: 'https://www.hackerrank.com/skills-verification',
    cost: 'Free',
  },
  {
    name: 'Kaggle Learn',
    detail: 'Short Python, Pandas, and machine-learning tracks with a certificate after the exercises.',
    url: 'https://www.kaggle.com/learn',
    cost: 'Free',
  },
  {
    name: 'freeCodeCamp',
    detail: 'Full web, JavaScript, and Python certificates. Finish the projects and the credential is free.',
    url: 'https://www.freecodecamp.org/learn',
    cost: 'Free',
  },
  {
    name: 'Microsoft Learn',
    detail: 'Azure, GitHub, and Python modules with free badges. Useful for cloud and internship applications.',
    url: 'https://learn.microsoft.com/training/',
    cost: 'Free',
  },
  {
    name: 'Coding Ninjas',
    detail: 'Guided DSA and web tracks that many campus students buy before placement season.',
    url: 'https://www.codingninjas.com/',
    cost: 'Paid',
  },
];
