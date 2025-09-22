// Simple test to debug API response
const BASE_URL = "http://localhost:8001";

async function testAPI() {
  try {
    console.log("Testing API endpoint...");
    const response = await fetch(`${BASE_URL}/api/v1/jobs/`);
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Raw API data:", JSON.stringify(data, null, 2));
    
    // Transform the data like our components do
    const transformedJobs = data.map(job => ({
      ...job,
      type: job.job_type || job.type
    }));
    
    console.log("Transformed data:", JSON.stringify(transformedJobs, null, 2));
    
    // Check if data has expected fields
    if (transformedJobs.length > 0) {
      const job = transformedJobs[0];
      console.log("First job has required fields:");
      console.log("- id:", job.id);
      console.log("- title:", job.title);
      console.log("- type:", job.type);
      console.log("- description:", job.description);
      console.log("- salary:", job.salary);
      console.log("- location:", job.location);
      console.log("- company:", job.company);
    }
    
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

testAPI();