import { batchDeleteQueues } from "./batchDeleteQueues";
import { createQueue } from "./creatQueue";
import { deleteQueue } from "./deleteQueue";
import { pauseQueue } from "./pauseQueue";
import { resumeQueue } from "./resumeQueue";

export const queueActions = {
  pauseQueue,
  resumeQueue,
  deleteQueue,
  batchDeleteQueues,
  createQueue,
};
