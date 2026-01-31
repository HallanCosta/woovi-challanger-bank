interface JobOptions {
  jobId?: string;
  attempts?: number;
  backoff?: number | { type: string; delay: number };
  delay?: number;
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
  repeat?: any;
  priority?: number;
}

interface CreateJobParams {
  queue: any;
  jobName: string;
  jobData: Record<string, unknown>;
  options?: JobOptions;
}

export const createJob = async ({ queue, jobName, jobData, options }: CreateJobParams) => {
  const job = await queue.add(
    jobName,
    jobData,
    options
  );

  return job
};