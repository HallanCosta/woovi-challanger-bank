export const createJob = async ({ queue, jobName, jobData, options }) => {
  const job = await queue.add(
    jobName,
    jobData,
    options
  );

  return job
};