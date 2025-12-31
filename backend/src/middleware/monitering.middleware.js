// client monitoring middleware
import {UAParser} from 'ua-parser-js';
export function monitoringMiddleware(req, res, next) {
  try {
    const parser = new UAParser(req.headers['user-agent']);
    const clientInfo = parser.getResult();

    
    req.monitoring = {
      client: clientInfo
    };

    next();
  } catch (err) {
    next(err);
  }
}