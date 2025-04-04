export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_admin: boolean;
    token?: string;
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
