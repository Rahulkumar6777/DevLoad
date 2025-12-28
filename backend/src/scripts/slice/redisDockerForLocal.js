import Docker from 'dockerode';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const docker = new Docker();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const composePath = path.resolve(__dirname, '../../infra/redis.yaml');
const containerName = 'redis';

async function isContainerRunning(name) {
  try {
    const container = docker.getContainer(name);
    const data = await container.inspect();
    return data.State.Running;
  } catch {
    return false;
  }
}

async function waitForHealthy(name, timeout = 10000) {
  const container = docker.getContainer(name);
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const data = await container.inspect();
    const health = data.State.Health?.Status;
    if (health === 'healthy') return true;
    await new Promise(res => setTimeout(res, 500));
  }

  throw new Error('Redis container did not become healthy in time');
}

async function runRedisContainers() {
  if (process.env.NODE_ENV === 'production') {
    console.log(' Skipping Docker in production');
    return;
  }

  const isRunning = await isContainerRunning(containerName);
  if (isRunning) {
    console.log(' Redis container already running. Skipping startup.');
    return;
  }

  if (!fs.existsSync(composePath)) {
    console.error(' redis.yaml not found in infra folder');
    return;
  }

  try {
    execSync(`docker-compose -f ${composePath} up -d`, { cwd: __dirname, stdio: 'inherit' });
    await waitForHealthy(containerName);
    console.log(' Redis is healthy and ready');
  } catch (err) {
    console.error(' Failed to start Redis:', err.message);
  }
}

export default runRedisContainers;