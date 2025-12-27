// serverLogger.js
import * as osu from 'node-os-utils';
import pidusage from 'pidusage';

const cpu = osu.cpu;
const mem = osu.mem;

let requestCount = 0;


export function requestCounter(req, res, next) {
  requestCount++;
  next();
}


export function startServerLogger(intervalMs = 5000) {
  setInterval(async () => {
    try {
      const cpuUsage = await cpu.usage();
      const memInfo = await mem.info();
      const processStats = await pidusage(process.pid);

      console.log('--- Server Stats ---');
      console.log('Requests so far:', requestCount);
      console.log('CPU Usage (%):', cpuUsage);
      console.log('Memory Info:', memInfo);
      console.log('Process Stats:', processStats);
      console.log('--------------------\n');
    } catch (err) {
      console.error('Error logging server stats:', err);
    }
  }, intervalMs);
}