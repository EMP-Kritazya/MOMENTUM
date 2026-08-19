function isValidTimeZone(timeZone) {
  if (typeof timeZone !== "string" || !timeZone) return false;
  try {
    new Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

// Exposes the requesting client's IANA time zone (sent as X-Timezone) so
// controllers can compute "today" against the user's own calendar day
// instead of the server's UTC clock. Falls back to UTC for missing or
// invalid headers so every downstream date computation always has a
// trustworthy value.
export function resolveTimeZone(req, res, next) {
  const header = req.headers["x-timezone"];
  req.timeZone = isValidTimeZone(header) ? header : "UTC";
  next();
}
