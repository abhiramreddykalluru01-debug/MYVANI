export function getVaLogoForLanguage(language: string | null | undefined): string {
  const key = (language ?? "").trim().toLowerCase();

  if (key === "english") return "VANI";
  if (key === "hindi") return "वा";
  if (key === "telugu") return "వా";
  if (key === "kannada") return "ವಾ";
  if (key === "tamil") return "வா";
  if (key === "malayalam") return "വാ";

  return "VANI";
}
