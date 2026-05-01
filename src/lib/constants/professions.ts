/** Must match `categories.profession_key` for rows where type='professional'. */
export const PROFESSION_OPTIONS = [
  "Software Engineer",
  "Nurse",
  "Doctor",
] as const;

export type ProfessionOption = (typeof PROFESSION_OPTIONS)[number];
