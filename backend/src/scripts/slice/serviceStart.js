import Docker from "dockerode";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const docker = new Docker();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const composePath = path.resolve(__dirname, "../../infra/service.yml");

async function isContainerRunning(first, second) {
  try {
    const container1 = docker.getContainer(first);
    const container2 = docker.getContainer(second);
    const firstData = await container1.inspect();
    const secondData = await container2.inspect();
    return { first: firstData.State.Running, second: secondData.State.Running };
  } catch {
    return false;
  }
}

async function waitForHealthy(name, timeout = 20000) {
  const container = docker.getContainer(name);
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const data = await container.inspect();
    const health = data.State.Health?.Status;
    if (health === "healthy") return true;
    await new Promise((res) => setTimeout(res, 1000));
  }

  throw new Error(`${name} did not become healthy in time`);
}

async function runContainers() {
  if (process.env.NODE_ENV === "production") {
    console.log("Skipping Docker in production");
    return;
  }

  const isRunning = await isContainerRunning('redis' , 'minio');
  console.log(isRunning)
  if (isRunning.first && isRunning.second) {
    console.log(" container already running. Skipping startup.");
    return;
  }

  if (!fs.existsSync(composePath)) {
    console.error("docker-compose.dev.yml not found in infra folder");
    return;
  }

  try {
    console.log(" Starting Redis via docker-compose...");
    execSync(`docker-compose -f ${composePath} up -d redis`, {
      cwd: __dirname,
      stdio: "inherit",
    });
    await waitForHealthy("redis");
    console.log(" Redis is healthy and ready");

    console.log(" Starting Minio via docker-compose...");
    execSync(`docker-compose -f ${composePath} up -d minio`, {
      cwd: __dirname,
      stdio: "inherit",
    });
    await waitForHealthy("minio");
    console.log(" Minio is healthy and ready");
  } catch (err) {
    console.error(" Failed to start containers:", err.message);
    process.exit(1);
  }
}

export default runContainers;
