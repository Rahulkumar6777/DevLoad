function deepSanitize(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        obj[key] = deepSanitize(obj[key]);
      }
    }
  }

  return obj;
}

export function sanitizeRequest(req, res, next) {
  if (req.body) req.body = deepSanitize(req.body);
  if (req.query) deepSanitize(req.query);    // <== mutate in-place, do NOT assign
  if (req.params) req.params = deepSanitize(req.params);
  next();
}
