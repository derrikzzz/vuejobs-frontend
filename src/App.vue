<script setup>
import { ref, onMounted, onErrorCaptured } from "vue";

const name = ref("John Doe");
const status = ref("active");
const tasks = ref(["Task One", "Task Two", "Task Three"]);
const link = ref("https://www.google.com");
const newTask = ref("");

const toggleStatus = () => {
  if (status.value === "active") {
    status.value = "pending";
  } else if (status.value === "pending") {
    status.value = "inactive";
  } else {
    status.value = "active";
  }
};

const addTask = () => {
  if (newTask.value.trim() !== "") {
    tasks.value.push(newTask.value);
    newTask.value = "";
  }
};

const removeTask = (index) => {
  tasks.value.splice(index, 1); //find the index and remove one item
};

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    console.log(data);
    tasks.value = data.map((task) => task.title);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

onErrorCaptured((error) => {
  console.error("Error captured:", error);
});
</script>

<template>
  <div class="container mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-primary mt-4 mb-2">{{ name }}</h1>
    <p v-if="status === 'active'">You are active</p>
    <p v-else-if="status === 'pending'">You are pending</p>
    <p v-else>You are inactive</p>

    <form @submit.prevent="addTask">
      <label for="newTask">New Task</label>
      <input
        type="text"
        id="newTask"
        name="newTask"
        class="border-2 border-gray-400 rounded-lg p-2 mx-4"
        v-model="newTask"
      />
      <button
        @click="addTask"
        class="bg-primary text-black px-4 py-2 rounded-md border-2"
      >
        Add Task
      </button>
    </form>

    <h3>Tasks:</h3>
    <ul>
      <li v-for="(task, index) in tasks" :key="task">
        <span>
          {{ task }}
        </span>
        <button @click="removeTask(index)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </li>
    </ul>
    <br />

    <!-- <a v-bind:href="link">Click for google</a> -->
    <a :href="link">Click for Google</a>

    <!-- <button v-on:click="toggleStatus">Change status</button> -->
    <button @click="toggleStatus">Change status</button>
  </div>
</template>

<style scoped>
h1 {
  color: red;
}
</style>
