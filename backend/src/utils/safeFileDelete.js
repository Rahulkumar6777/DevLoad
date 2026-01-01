import fs from "fs";

export const safeDelete = async (path) => {
    console.log(path)
  if (!path) return;

  for (let i = 0; i < 5; i++) {
    try {
      await fs.promises.unlink(path);
      return;
    } catch (err) {
      if (err.code === "EBUSY" || err.code === "EPERM") {
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }
      if (err.code === "ENOENT") return;
      console.log("Delete failed:", err);
      return;
    }
  }
};
