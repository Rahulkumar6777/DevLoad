import express from "express";
import dotenv from "dotenv";
import { Queue } from "bullmq";
import { connection } from "../worker/src/config/connection.js";

dotenv.config();
const app = express();
app.use(express.json());

const queue = new Queue("devload-video-processing", { connection });

app.get("/enqueue", async (req, res) => {
  try {

    const videoUrl = 'http://minio:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3RlbXAvMjAyNS0wOC0yM18wMS0zMC0xMi5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1DNFlOU1Y0WEE2SzgxRloxNjIyUiUyRjIwMjUxMjI4JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTIyOFQxNzIwNTZaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUpETkZsT1UxWTBXRUUyU3pneFJsb3hOakl5VWlJc0ltVjRjQ0k2TVRjMk5qazFOVFl3Tml3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuYkVDaUVMVTlCYV9IRFlucklXelNUMGZWMVlvTUpyU0QtMDNZN0NkN1dreXpBM1BmeFpWblFSRmdadDNyWFA1NUpaMmJ6NzZBM2llVzd5WERXNzUzTXcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT04ZmRkYzIwNGI5NTVlNmE3MTI4ZDI5NjAyZTZjOTM5YzZkMzBjOGM3NTA0ZDQyNDc1ZTU2NGNhOGU3MTY1MGYz'
    const projectId = '234342342342'
    const filename  = '2025-08-23_01-29-533.mp4'
    const userEmail = 'rahulk48546@gmail.com'
    const userFullname = 'Rahul Kumar'
    const useEmailSendPreference = true;

    await queue.add("devload-video-processing", {
      videoUrl,
      projectId,
      filename,
      userEmail,
      userFullname,
      useEmailSendPreference,
    });

    res.json({ message: "Job added to queue 🚀" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to enqueue job" });
  }
});

app.listen(2000, () => console.log("Queue API running on port 5000 🚀"));
