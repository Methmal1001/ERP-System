<template>
  <div class="flex items-center gap-1 px-1 py-0.5">
    <span class="dot"></span>
    <span class="dot" style="animation-delay: 160ms"></span>
    <span class="dot" style="animation-delay: 320ms"></span>
  </div>
</template>

<style scoped>
.dot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background-color: rgb(156 163 175);
  display: inline-block;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}
</style>
