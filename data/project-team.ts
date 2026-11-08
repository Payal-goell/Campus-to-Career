export interface ProjectBuilder {
  id: string;
  name: string;
  photo: string;
}

/** Students who built Campus to Career. Public portraits for visitors. */
export const PROJECT_TEAM: ProjectBuilder[] = [
  { id: 'payal', name: 'Payal Goel', photo: '/team/payal-goel.jpg' },
  { id: 'kahkasha', name: 'Kahkasha Begum', photo: '/team/kahkasha-begum.jpg' },
  { id: 'ilya', name: 'Ilya Ali', photo: '/team/ilya-ali.jpg' },
  { id: 'om', name: 'Om Dwivedi', photo: '/team/om-dwivedi.jpg' },
];
