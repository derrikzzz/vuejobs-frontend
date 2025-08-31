<script setup>
import { ref } from "vue";

const expandedSections = ref(new Set());

const faqs = ref([
  {
    question: "What is this website?",
    answer:
      "This is a website that helps you find jobs and companies that are a good fit for you.",
    isOpen: false,
  },
  {
    question: "How does it work?",
    answer:
      "We use a combination of AI and human experts to help you find the best jobs and companies for you.",
    isOpen: false,
  },
  {
    question: "How do I create an account?",
    answer:
      "You can sign up by clicking the 'Sign Up' button in the navigation bar and filling out the registration form with your details.",
    isOpen: false,
  },
  {
    question: "How do I search for jobs?",
    answer:
      "Use the search bar on the jobs page to find positions by keyword, location, or company name. You can also browse all available jobs.",
    isOpen: false,
  },
  {
    question: "Can I apply for jobs directly through the website?",
    answer:
      "Currently, we provide job listings and information. You'll be redirected to the company's application portal to submit your application.",
    isOpen: false,
  },
  {
    question: "Is there a resume review service?",
    answer:
      "Yes! We offer an AI-powered resume review service that provides feedback and suggestions to improve your resume.",
    isOpen: false,
  },
  {
    question: "How do I contact support?",
    answer:
      "If you need help, you can use our chat bot feature or reach out through the contact information provided in your account settings.",
    isOpen: false,
  },
]);

const toggleSection = (sectionId) => {
  if (expandedSections.value.has(sectionId)) {
    expandedSections.value.delete(sectionId);
  } else {
    expandedSections.value.add(sectionId);
  }
};

const expandAll = () => {
  faqs.value.forEach((_, index) => {
    expandedSections.value.add(index);
  });
};

const collapseAll = () => {
  expandedSections.value.clear();
};

const isAllExpanded = () => {
  return expandedSections.value.size === faqs.value.length;
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
    <div class="text-center mb-6 sm:mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <p class="text-base sm:text-lg text-gray-600">
        Find answers to common questions about our job platform
      </p>
    </div>

    <!-- Control Buttons -->
    <div class="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6">
      <button
        @click="expandAll"
        :class="[
          'px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base',
          isAllExpanded()
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-blue-600 text-white hover:bg-blue-700',
        ]"
      >
        {{ isAllExpanded() ? "All Expanded" : "Expand All" }}
      </button>
      <button
        @click="collapseAll"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 text-sm sm:text-base"
      >
        Collapse All
      </button>
    </div>

    <div class="max-w-3xl mx-auto divide-y divide-gray-200">
      <div v-for="(faq, index) in faqs" :key="index" class="py-4 sm:py-6">
        <button
          @click="toggleSection(index)"
          class="w-full flex items-start sm:items-center justify-between text-left hover:bg-gray-50 p-3 sm:p-4 rounded-lg transition-colors duration-200"
        >
          <span class="text-base sm:text-lg font-medium text-gray-900 pr-4 leading-snug">
            {{ faq.question }}
          </span>

          <svg
            :class="[
              'h-5 w-5 sm:h-6 sm:w-6 text-gray-500 transform transition-transform duration-200 flex-shrink-0 mt-0.5 sm:mt-0',
              expandedSections.has(index) ? 'rotate-180' : '',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="expandedSections.has(index)" class="mt-4 px-3 sm:px-4 pb-4">
            <div class="text-gray-600 leading-relaxed text-sm sm:text-base">{{ faq.answer }}</div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
