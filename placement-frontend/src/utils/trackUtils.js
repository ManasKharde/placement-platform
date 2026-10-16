/**
 * Normalization helper to map legacy track names to clean updated nomenclature.
 * Specifically updates "Problem Solving: DSA & SQL" -> "Problem Solving: DSA".
 */
export const normalizeTrackName = (name) => {
  if (!name || typeof name !== "string") return name || "";
  if (name === "Problem Solving: DSA & SQL") return "Problem Solving: DSA";
  return name.replace(/Problem Solving: DSA & SQL/g, "Problem Solving: DSA");
};
