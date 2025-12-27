import pidusage from "pidusage";

let requestCount = 0;

export function requestCounter(req, res, next) {
  requestCount++;
  next();
}


export async function startServerLogger() {
  try {
    const processStats = await pidusage(process.pid);
    console.log('Current Server Stats:' );
    console.log('CPU (%):', processStats.cpu.toFixed(2));
    console.log('Memory (MB):', (processStats.memory / 1024 / 1024).toFixed(2));
  } catch (err) {
    console.error('Stats error:', err.message);
  }
}
