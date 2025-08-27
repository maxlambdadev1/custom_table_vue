<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <TopBar />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />
      <MainContent />
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import Sidebar from './components/Sidebar.vue'
import MainContent from './components/MainContent.vue'

export default {
  name: 'App',
  components: {
    TopBar,
    Sidebar,
    MainContent
  }
}
</script>