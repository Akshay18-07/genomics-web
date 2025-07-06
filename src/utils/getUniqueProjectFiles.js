export function getUniqueProjectFiles(filesData) {
  const seen = new Set();
  const unique = [];
  for (const record of filesData) {
    if (!seen.has(record.project_name)) {
      seen.add(record.project_name);
      unique.push(record);
    }
  }
  return unique;
}
