<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <div class="reactions">
      <div class="singleReaction">
        <button
          v-if="liked"
          width="25px"
          @click="removeLike"
        >
          <img 
            :src="require('@/public/liked.png')"
            width="25px"
          >
        </button>
        <button
          v-else
          width="25px"
          @click="addLike"
        >
          <img 
            :src="require('@/public/like.png')"
            width="25px"
          >
        </button>
        <p>{{ freet.likes }}</p>
      </div>
      <div class="singleReaction">
        <button
          v-if="approved"
          width="25px"
          @click="removeApprove"
        >
          <img 
            :src="require('@/public/approveFull.png')"
            width="25px"
          >
        </button>
        <button
          v-else
          width="25px"
          @click="addApprove"
        >
          <img 
            :src="require('@/public/approveBlank.png')"
            width="25px"
          >
        </button>
        <p>{{ freet.approves }}</p>
      </div>
      <div class="singleReaction">
        <button
          v-if="disproved"
          width="25px"
          @click="removeDisprove"
        >
          <img 
            :src="require('@/public/disproveFull.png')"
            width="25px"
          >
        </button>
        <button
          v-else
          width="25px"
          @click="addDisprove"
        >
          <img 
            :src="require('@/public/disproveBlank.png')"
            width="25px"
          >
        </button>
        <p>{{ freet.disproves }}</p>
      </div>
    </div>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      liked: '', // Whether or not a freet has been liked by the user
      approved: '', // Whether or not a freet has been approved by the user
      disproved: '' // Whether or not a freet has been disproved by the user
    };
  },
  computed: {
    isLiked() {
      const liked = this.getLike();
      return liked;
    },
    isApproved() {
      const approved = this.getApprove();
      return approved;
    },
    isDisproved() {
      const disproved = this.getDisprove();
      return disproved;
    },
  },
  mounted() {
    this.isLiked;
    this.isApproved;
    this.isDisproved;
  },
  methods: {
   startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        url: `/api/freets/${this.freet._id}`,
        callback: () => {
          this.$store.commit('refreshFreets');
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        url: `/api/freets/${this.freet._id}`,
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async getLike() {
      /**
       * Returns true if the user has liked this freet, false otherwise
       */
      const url = `/api/likes/:freetId=${this.freet._id}`;
      const r = await fetch(url);
      const ids = await r.json();
      const result = ids.filter(obj => {
        if (obj) {
          return obj.freetId == this.freet._id
        }
      });
      const likeExists = result[0].freetId;
      this.liked = likeExists ? true : false;
      return this.liked;
    },
    addLike() {
      /**
       * Likes this freet.
       */
      const params = {
        method: 'POST',
        message: 'Successfully liked freet!',
        url: 'api/likes',
        body: JSON.stringify({id: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.isLiked;
          this.$store.commit('refreshFreets');
        }
      };
      this.request(params);
    },
    removeLike() {
      /**
       * Remove like from this freet.
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully unliked freet!',
        url: `/api/likes/${this.freet._id}`,
        body: JSON.stringify({id: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.isLiked;
          this.$store.commit('refreshFreets');
        }
      };
      this.request(params);
    },
    async getApprove() {
      /**
       * Returns true if the user has approved this freet, false otherwise
       */
      const url = `/api/approves/getApprove/${this.freet._id}`;
      const r = await fetch(url);
      const approve = await r.json();
      this.approved = approve;
      return this.approved;
    },
    addApprove() {
      /**
       * Approves this freet.
       */
      const params = {
        method: 'POST',
        message: 'Successfully approved freet!',
        url: 'api/approves/addApprove',
        body: JSON.stringify({id: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.isApproved;
          this.$store.commit('refreshFreets');
        }
      };
      this.request(params);
    },
    removeApprove() {
      /**
       * Remove approve from this freet.
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully removed approve from freet!',
        url: `/api/approves/removeApprove/${this.freet._id}`,
        body: JSON.stringify({id: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.isApproved;
          this.$store.commit('refreshFreets');
        }
      };
      this.request(params);
    },
    async getDisprove() {
      /**
       * Returns true if the user has disproved this freet, false otherwise
       */
      const url = `/api/disproves/getDisprove/${this.freet._id}`;
      const r = await fetch(url);
      const disprove = await r.json();
      this.disproved = disprove;
      return this.disproved;
    },
    addDisprove() {
      /**
       * Disproves this freet.
       */
      const params = {
        method: 'POST',
        message: 'Successfully disproved freet!',
        url: 'api/disproves/addDisprove',
        body: JSON.stringify({id: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.isDisproved;
          this.$store.commit('refreshFreets');
        }
      };
      this.request(params);
    },
    removeDisprove() {
      /**
       * Remove disprove from this freet.
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully removed disprove from freet!',
        url: `/api/disproves/removeDisprove/${this.freet._id}`,
        body: JSON.stringify({id: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.isDisproved;
          this.$store.commit('refreshFreets');
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }
      try {
        const r = await fetch(params.url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.editing = false;
        this.$store.commit('refreshFreets');
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}

.reactions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.singleReaction {
  display: flex;
  align-content: center;
  align-items: center;
  gap: 5px;
}
</style>
