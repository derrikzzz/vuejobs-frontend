<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
const router = useRouter();

const form = reactive({
  type: "Full-Time",
  title: "",
  description: "",
  salary: "",
  location: "",
  company: {
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  },
});

const toast = useToast();

const handleSubmit = async () => {
  const newJob = {
    type: form.type,
    title: form.title,
    description: form.description,
    salary: form.salary,
    location: form.location,
    company: {
      name: form.company.name,
      description: form.company.description,
      contactEmail: form.company.contactEmail,
      contactPhone: form.company.contactPhone,
    },
  };

  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
    const response = await fetch(`${BASE_URL}/api/v1/jobs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJob),
    });

    if (!response.ok) {
      throw new Error("Failed to add job");
    }

    const data = await response.json();
    console.log("Job added successfully:", data);

    toast.success("Job added successfully");
    router.push("/jobs");

    // Reset form only on success
    form.type = "Full-Time";
    form.title = "";
    form.description = "";
    form.salary = "";
    form.location = "";
    form.company.name = "";
    form.company.description = "";
    form.company.contactEmail = "";
    form.company.contactPhone = "";
  } catch (error) {
    console.error("Error adding job:", error);
    toast.error("Error adding job");
  }
};
</script>

<template>
  <section class="bg-green-50 min-h-screen">
    <div class="container m-auto max-w-2xl py-6 sm:py-12 lg:py-24">
      <div
        class="bg-white px-4 sm:px-6 py-6 sm:py-8 mb-4 shadow-md rounded-md border mx-4 sm:mx-0"
      >
        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
          <h2 class="text-2xl sm:text-3xl text-center font-semibold mb-6">
            Add Job
          </h2>

          <div class="space-y-4">
            <div>
              <label
                for="type"
                class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
              >
                Job Type
              </label>
              <select
                v-model="form.type"
                id="type"
                name="type"
                class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label
                class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
              >
                Job Listing Name
              </label>
              <input
                type="text"
                v-model="form.title"
                id="name"
                name="name"
                class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g. Senior Vue.js Developer"
                required
              />
            </div>

            <div>
              <label
                for="description"
                class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
              >
                Description
              </label>
              <textarea
                v-model="form.description"
                id="description"
                name="description"
                class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="4"
                placeholder="Add any job duties, expectations, requirements, etc"
              ></textarea>
            </div>

            <div>
              <label
                for="salary"
                class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
              >
                Salary
              </label>
              <select
                v-model="form.salary"
                id="salary"
                name="salary"
                class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="Under $50K">Under $50K</option>
                <option value="$50K - $60K">$50K - $60K</option>
                <option value="$60K - $70K">$60K - $70K</option>
                <option value="$70K - $80K">$70K - $80K</option>
                <option value="$80K - $90K">$80K - $90K</option>
                <option value="$90K - $100K">$90K - $100K</option>
                <option value="$100K - $125K">$100K - $125K</option>
                <option value="$125K - $150K">$125K - $150K</option>
                <option value="$150K - $175K">$150K - $175K</option>
                <option value="$175K - $200K">$175K - $200K</option>
                <option value="Over $200K">Over $200K</option>
              </select>
            </div>

            <div>
              <label
                class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
              >
                Location
              </label>
              <input
                type="text"
                v-model="form.location"
                id="location"
                name="location"
                class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Company Location"
                required
              />
            </div>
          </div>

          <div class="border-t pt-6">
            <h3 class="text-xl sm:text-2xl mb-4 sm:mb-5 font-semibold">
              Company Info
            </h3>

            <div class="space-y-4">
              <div>
                <label
                  for="company"
                  class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  v-model="form.company.name"
                  id="company"
                  name="company"
                  class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label
                  for="company_description"
                  class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
                >
                  Company Description
                </label>
                <textarea
                  v-model="form.company.description"
                  id="company_description"
                  name="company_description"
                  class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="4"
                  placeholder="What does your company do?"
                ></textarea>
              </div>

              <div>
                <label
                  for="contact_email"
                  class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  v-model="form.company.contactEmail"
                  id="contact_email"
                  name="contact_email"
                  class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Email address for applicants"
                  required
                />
              </div>

              <div>
                <label
                  for="contact_phone"
                  class="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  v-model="form.company.contactPhone"
                  id="contact_phone"
                  name="contact_phone"
                  class="border rounded w-full py-2 sm:py-3 px-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Optional phone for applicants"
                />
              </div>
            </div>
          </div>

          <div class="pt-6">
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition-colors duration-200 text-sm sm:text-base"
              type="submit"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
