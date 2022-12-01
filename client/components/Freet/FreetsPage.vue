<!-- Default page that also displays freets -->

<template>
  <main class="main">
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm v-if="$store.state.canPost" />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link 
            to="/login"
            class="link"
          >
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <button @click="getAll()">
            All Freets
          </button>
          <button @click="getMostPopular()">
            Most Popular Freets
          </button>
          <button @click="getMostCredible()">
            Most Credible Freets
          </button>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <div class="title">
        <h2 v-if="$store.state.feed === 'mostPopular'">
          Most Popular Freets
          <span v-if="$store.state.filter">
            by @{{ $store.state.filter }}
          </span>
        </h2>
        <h2 v-else-if="$store.state.feed === 'mostCredible'">
          Most Credible Freets
          <span v-if="$store.state.filter">
            by @{{ $store.state.filter }}
          </span>
        </h2>
        <h2 v-else>
          All Freets
          <span v-if="$store.state.filter">
            by @{{ $store.state.filter }}
          </span>
        </h2>
      </div>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
  },
  methods: {
    async getMostPopular() {
      /**
       * Updates user feed to show the most liked freets in descending order based on the number of likes.
       */
      fetch('/api/freets/mostPopular').then(res => res.json()).then(res => {
        this.$store.commit('updateFreets', res);
      });
      this.$store.commit('updateFeed', 'mostPopular');
    },
    async getMostCredible() {
      /**
       * Updates user feed to show the most approved freets in descending order based on the number of approves.
       */
      fetch('/api/freets/mostCredible').then(res => res.json()).then(res => {
        this.$store.commit('updateFreets', res);
      });
      this.$store.commit('updateFeed', 'mostCredible');
    },
    async getAll() {
      /**
       * Updates user feed to show all the freets from newest to oldest.
       */
      fetch('/api/freets').then(res => res.json()).then(res => {
        this.$store.commit('updateFreets', res);
      });
      this.$store.commit('updateFeed', 'all');
    },
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main {
  background-color: #243447;
  color: #FFF;
}

.link {
  color: #1DA1F2;
}
</style>
