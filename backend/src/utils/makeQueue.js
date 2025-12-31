import { Queue } from "bullmq";

const makeQueue = (queueName) => {
  const queue = new Queue(queueName);
  return queue;
};

export { makeQueue };