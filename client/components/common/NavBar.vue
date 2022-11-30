<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <LimitComponent
      :time-limit="limit"
    />
    <div class="right">
      <router-link to="/">
        Home
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<script>
  import LimitComponent from '@/components/common/LimitComponent.vue';
  
  export default {
  name: 'FreetPage',
  components: {LimitComponent},
  data() {
    return {
      limit: '',
    };
  },
  mounted() {
    this.getLimit();
    // this.decrementLimit();
  },
  methods: {
    async getLimit() {
      /**
       * Returns the time left in the user's Fritter Limit.
       */
      const url = '/api/limit/getLimit';
      const r = await fetch(url);
      const timer = await r.json();
      this.limit = timer.limit;
      return this.limit;
    },
    async decrementLimit() {
      /**
       * Decrement the user's time left by one second.
       */
      const url = '/api/limit/decrementLimit';
      const r = await fetch(url);
      const timer = await r.json();
      this.limit = timer.limit;
      return this.limit;
    },
  }
};
</script>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.middle {
  display: flex;
  align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
