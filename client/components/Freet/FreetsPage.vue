<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
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
            Most Approved Freets
          </button>
          <h2 v-if="isMostPopular">
            Viewing Most Popular Freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
          <h2 v-else-if="isMostCredible">
            Viewing Most Credible Freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
          <h2 v-else>
            Viewing All Freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
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
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in freets"
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
  data() {
    return {
      freets: '',
      isMostPopular: false,
      isMostCredible: false,
    };
  },
  mounted() {
    this.$refs.getFreetsForm.submit();
    if (this.isMostPopular) {
      this.getMostPopular();
    } else if (this.isMostCredible) {
      this.getMostCredible();
    } else {
      this.getAll();
    }
  },
  methods: {
    async getMostPopular() {
      /**
       * Returns the most liked freets in descending order based on the number of likes.
       */
      const url = '/api/freets/mostPopular';
      const r = await fetch(url);
      const freets = await r.json();
      this.freets = freets;
      this.isMostCredible = false;
      this.isMostPopular = true;
      return this.freets;
    },
    async getMostCredible() {
      /**
       * Returns the most approved freets in descending order based on the number of approves.
       */
      const url = '/api/freets/mostCredible';
      const r = await fetch(url);
      const freets = await r.json();
      this.freets = freets;
      this.isMostPopular = false;
      this.isMostCredible = true;
      return this.freets;
    },
    async getAll() {
      /**
       * Returns all the freets from newest to oldest.
       */
      this.freets = this.$store.state.freets;
      this.isMostPopular = false;
      this.isMostCredible = false;
      return this.freets;
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
</style>
