export interface Repo {
  id: string;
  name: string;
  nameWithOwner: string;
  isPrivate: boolean;
  isArchived: boolean;
  isTemplate: boolean;
  stargazers: {
    totalCount: number;
  };
  description: string;
  primaryLanguage: {
    color: string;
    id: string;
    name: string;
  };
  forkCount: number;
}
