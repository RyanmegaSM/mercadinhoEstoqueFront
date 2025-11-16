export const BuildUrlParams = (params: Record<string, unknown>): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(`${key}[]`, String(item)));
    } else if (typeof value === "string" && value.trim() !== "") {
      query.append(key, value);
    } else if (typeof value !== "string") {
      query.append(key, String(value));
    }
  });

  return query.toString();
};
