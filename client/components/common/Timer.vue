<!-- Fritter Timer -->
<template>
  <div>
    <div>
      <span>{{ timer.hours }}</span>:<span>{{ timer.minutes }}</span>:<span>{{ timer.seconds }}</span>
    </div>
    <!-- <p>{{ timer.isRunning ? 'Running' : 'Not running' }}</p> -->
    <button @click="timer.start()">Start</button>
    <button @click="timer.pause()">Pause</button>
    <button @click="timer.resume()">Resume</button>
    <button @click="restartFive()">Restart</button>
  </div>
</template>

<script>
    // import { defineComponent, watchEffect, onMounted } from "vue";
    // import { useTimer } from 'vue-timer-hook';
    // export default defineComponent({
    // name: "TimerComponent",
    // props: {
    //   limit: {
    //     type: Object,
    //     required: true
    //   }
    // },
    // setup() {
    //     const time = new Date();
    //     time.setSeconds(time.getSeconds() + this.limit.total);
    //     const timer = useTimer(time);
    //     const restartFive = () => {
    //         // Restarts to 5 minutes timer
    //         const time = new Date();
    //         time.setSeconds(time.getSeconds() + 300);
    //         timer.restart(time);
    //     }
    //     onMounted(() => {
    //     watchEffect(async () => {
    //         if(timer.isExpired.value) {
    //             console.warn('IsExpired')
    //         }
    //     })
    //     })
    //     return {
    //         timer,
    //         restartFive,
    //     };
    // },
    // });
</script>