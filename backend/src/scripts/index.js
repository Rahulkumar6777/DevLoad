import runMiniOContainers from "./slice/minioDockerForLocal.js";
import runRedisContainers from "./slice/redisDockerForLocal.js";
import runContainers from "./slice/serviceStart.js";

export const runcontainer = async () => {
    // await runRedisContainers();
    // await runMiniOContainers()
    await runContainers()
} 