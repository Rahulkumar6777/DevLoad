import Docker from 'dockerode';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const docker = new Docker();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const composePath = path.resolve(__dirname, '../../infra/minio.yaml');
const containerName = 'minio';

async function isContainerRunning(name) {
  try {
    const container = docker.getContainer(name);
    const data = await container.inspect();
    return data.State.Running;
  } catch {
    return false;
  }
}

async function runMiniOContainers() {
  if (process.env.NODE_ENV === 'production') {
    console.log(' Skipping Docker in production');
    return;
  }

  const isRunning = await isContainerRunning(containerName);
  if (isRunning) {
    console.log(' Minio container already running. Skipping startup.');
    return;
  }

  if (!fs.existsSync(composePath)) {
    console.error(' minio.yaml not found in infra folder');
    return;
  }

  try {
    console.log(' Starting Minio via docker-compose...');
    execSync(`docker-compose -f ${composePath} up -d`, { cwd: __dirname, stdio: 'inherit' });
  } catch (err) {
    console.error(' Failed to start Minio:', err.message);
  }
}

export default runMiniOContainers;