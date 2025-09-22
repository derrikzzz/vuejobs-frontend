<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">Test Jobs Display</h1>
    
    <div class="bg-gray-100 p-4 rounded mb-6">
      <h2 class="text-lg font-semibold mb-2">Debug Info</h2>
      <p>Loading: {{ isLoading }}</p>
      <p>Jobs count: {{ jobs.length }}</p>
      <p>API URL: {{ apiUrl }}</p>
      <p>Raw data: <pre>{{ JSON.stringify(jobs, null, 2) }}</pre></p>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <p>Loading jobs...</p>
    </div>

    <div v-else-if="jobs.length === 0" class="text-center py-8">
      <p class="text-red-500">No jobs found!</p>
      <button @click="fetchJobs" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Retry Fetch
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="job in jobs" 
        :key="job.id"
        class="bg-white rounded-lg shadow-md p-4 border"
      >
        <div class="text-sm text-gray-500 mb-1">{{ job.type || job.job_type }}</div>
        <h3 class="text-lg font-bold mb-2">{{ job.title }}</h3>
        <p class="text-gray-600 text-sm mb-3">{{ job.description }}</p>
        <div class="text-green-600 font-semibold mb-2">{{ job.salary }}</div>
        <div class="text-orange-600 text-sm">📍 {{ job.location }}</div>
        <div class="text-blue-600 text-sm mt-2">🏢 {{ job.company }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const jobs = ref([])
const isLoading = ref(true)
const apiUrl = ref('')

async function fetchJobs() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001"
  apiUrl.value = `${BASE_URL}/api/v1/jobs/`
  
  console.log('TestView: Starting fetch from:', apiUrl.value)
  isLoading.value = true
  
  try {
    const response = await fetch(apiUrl.value)
    console.log('TestView: Response status:', response.status)
    console.log('TestView: Response headers:', [...response.headers.entries()])
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('TestView: Raw data:', data)
    
    // Transform data
    const transformedData = data.map(job => ({
      ...job,
      type: job.job_type || job.type
    }))
    
    jobs.value = transformedData
    console.log('TestView: Transformed data:', transformedData)
    
  } catch (error) {
    console.error('TestView: Fetch error:', error)
    alert(`Error fetching jobs: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  console.log('TestView: Component mounted')
  fetchJobs()
})
</script>