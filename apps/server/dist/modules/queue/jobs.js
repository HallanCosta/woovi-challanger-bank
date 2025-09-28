"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = void 0;
const createJob = async ({ queue, jobName, jobData, options }) => {
    const job = await queue.add(jobName, jobData, options);
    return job;
};
exports.createJob = createJob;
