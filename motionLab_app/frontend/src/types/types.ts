export interface User {
    id: string;
    name: string;
    email: string;
    // Add other user properties as needed
}

export interface Project {
  id: string;
  name: string;
  is_processing: boolean;
  creation_date: string;
}

export interface ProjectSettings {
  peopleCount: string;
  outputFormat: string;
  projectName: string;
}
