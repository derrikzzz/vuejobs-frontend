import apiService from "@/services/api.js";

// Simple test function to verify API connection
export async function testApiConnection() {
  try {
    console.log("Testing API connection...");

    // Test getting jobs
    const jobs = await apiService.getJobs();
    console.log("Successfully fetched jobs:", jobs);

    // Test creating a job
    const testJob = {
      title: "Test Frontend Developer",
      company: "Test Company",
      description: "Test job description",
      location: "Remote",
      salary: "$70,000 - $80,000",
      job_type: "Full-time",
      remote: true,
    };

    const createdJob = await apiService.createJob(testJob);
    console.log("Successfully created job:", createdJob);

    // Test getting the created job
    const retrievedJob = await apiService.getJob(createdJob.id);
    console.log("Successfully retrieved job:", retrievedJob);

    // Test updating the job
    const updatedJobData = {
      title: "Updated Test Frontend Developer",
      salary: "$80,000 - $90,000",
    };

    const updatedJob = await apiService.updateJob(
      createdJob.id,
      updatedJobData
    );
    console.log("Successfully updated job:", updatedJob);

    // Test deleting the job
    await apiService.deleteJob(createdJob.id);
    console.log("Successfully deleted job");

    console.log("All API tests passed!");
    return true;
  } catch (error) {
    console.error("API test failed:", error);
    return false;
  }
}
