<!-- Page for user's follower and following information -->
<template>
  <div class="main">
    <h4>Username: {{ $store.state.username }}</h4>
    <h4>Followers: {{ followers.length }}</h4>
    <h4>Following: {{ following.length }}</h4>
  </div>
</template>
  
  <script>
  export default {
    name: 'UserFollowerPage',
    data() {
      return {
        followers: '', // all of the users that follow this user
        following: '', // all of the users that this user follows
      }
    },
    computed: {
      
    },
    mounted() {
      this.getFollowers;
      this.getFollowing;
    },
    methods: {
      async getFollowers() {
        /**
         * Get all of the users that this user is followed by.
         */
        const url = `/api/follow/getFollowers/${this.user._id}`;
        const r = await fetch(url);
        const f = await r.json();
        this.followers = f;
      },
      async getFollowing() {
        /**
         * Get all of the users that this user is followed by.
         */
        const url = `/api/follow/getFollowing/${this.user._id}`;
        const r = await fetch(url);
        const f = await r.json();
        this.following = f;
      },
    }
  };
  </script>
  
  <style scoped>
  .main {
    background-color: #243447;
    color: #FFF;
    display: grid;
  }
  </style>