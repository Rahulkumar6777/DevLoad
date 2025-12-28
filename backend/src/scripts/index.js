import runMiniOContainers from "./slice/minioDockerForLocal.js";
import runRedisContainers from "./slice/redisDockerForLocal.js";

export const runcontainer = async () => {
    await runRedisContainers();
    await runMiniOContainers()
} 