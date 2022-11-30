import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    feed: 'all', // Feed that the user is displayed, between all, mostPopular, and mostCredible
    timeLimit: 3600, // Total time left in seconds
    hours: 1, // Hours left
    minutes: 0, // Minutes left in the current hour
    seconds: 0, // Seconds left in the current minute
    interval: null, // The timer interval
    canPost: true // Whether or not a user can post
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    updateFeed(state, feed) {
      /**
       * Update the freets feed that the user will see.
       * @param feed - Feed to switch to
       */
      state.feed = feed;
    },
    resetLimit(state) {
      /**
       * Reset the user's limit back to 1 hour.
       */
      clearInterval(this.interval);
      state.timeLimit = 0;
    },
    startLimit(state) {
      /**
       * Start the user's limit.
       */
       state.timeLimit = 3600;
    },
    decrementLimit(state) {
      /**
       * Decrement user's limit by 1 second.
       */
       if (state.timeLimit !== 0) {
        state.timeLimit -= 1;
      }
    },
    updateLimitValues(state) {
      /**
       * Update the hour, minute, and second values based on the total time remaining in seconds.
       */
      const total = state.timeLimit;
      state.hours = Math.floor(total / 3600);
      const remainingHours = (total / 3600) - Math.floor(total / 3600);
      state.minutes = Math.floor(remainingHours * 60);
      const remainingMinutes = (remainingHours * 60) - Math.floor(remainingHours * 60);
      state.seconds = Math.round(remainingMinutes * 60);
    },
    stopPost(state) {
      /**
       * Updates canPost to false, so the user cannot post anymore
       */
      state.canPost = false;
    },
    startPost(state) {
      /**
       * Updates canPost to true, so the user can post again
       */
      state.canPost = true;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
