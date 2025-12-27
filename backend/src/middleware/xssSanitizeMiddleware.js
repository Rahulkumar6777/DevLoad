import sanitizeHtml from 'sanitize-html';

function deepXssSanitize(obj) {
  if (typeof obj === 'string') {
    return sanitizeHtml(obj, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        obj[key] = deepXssSanitize(obj[key]);
      }
    }
  }
  return obj;
}

export function xssSanitizeRequest(req, res, next) {
  if (req.body) {
    req.body = deepXssSanitize(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    // **Mutate in place without assignment**
    deepXssSanitize(req.query);
  }

  if (req.params) {
    req.params = deepXssSanitize(req.params);
  }

  next();
}
