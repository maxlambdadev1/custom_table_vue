<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
    >
      <!-- Modal Header -->
      <div class="px-6 pt-4 pb-2 text-center">
        <h2 class="text-xl font-semibold text-gray-900">Table Builder</h2>
      </div>

      <!-- Modal Body -->
      <div class="px-6 pt-2 pb-6 text-center">
        <div class="flex items-center justify-center space-x-3 mb-6">
          <!-- Green Checkbox Icon -->
          <div class="flex-shrink-0">
            <div class="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <svg
                class="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          
          <!-- Success Message -->
          <div class="text-gray-900">
            Table <span class="font-bold">{{ tableName }}</span> created successfully.
          </div>
        </div>
        
        <!-- OK Button -->
        <button
          @click="closeModal"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableSuccessModal",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    tableName: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>