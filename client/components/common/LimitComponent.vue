<!-- Fritter Timer -->

<template>
  <div class="limit">
    <div>
      <h1>
        <span>{{ $store.state.hours }}</span>:<span>{{ $store.state.minutes < 10 ? '0' + $store.state.minutes : $store.state.minutes }}</span>:<span>{{ $store.state.seconds < 10 ? '0' + $store.state.seconds : $store.state.seconds }}</span>
      </h1>
    </div>
    <div class="canPost">
      <h1>
        Can Post
      </h1>
      <img
        v-if="$store.state.canPost === false"
        :src="require('@/public/canPostRed.png')"
        width="15px"
        height="15px"
      >
      <img
        v-else
        :src="require('@/public/canPostGreen.png')"
        width="25px"
        height="25px"
      >
    </div>
  </div>
</template>

<script>
    export default {
      name: 'LimitComponent',
      props: {
        timeLimit: {
          type: Object,
          required: true
        }
      },
      data() {
        return {

        };
      },
      computed() {

      },
      destroyed() {
        this.stopLimit();
      },
      async mounted() {
        this.interval = setInterval(() => {
          this.decrementLimit();
        }, 1000);
      },
      methods: {
        async decrementLimit() {
          /**
           * Decrements time limit by 1 second until it runs out.
           */
          this.$store.commit('decrementLimit');
          this.$store.commit('updateLimitValues');
        },
        async stopLimit() {
          /**
           * Stops time limit from running.
           */
          clearInterval(this.interval);
        },
      }
    }
</script>

<style scoped>
.limit {
  display: flex;
  justify-content: center;
  gap: 100px;
}

.canPost {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

</style>