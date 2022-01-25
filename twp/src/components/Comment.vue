<template>
  <div class="commentWrapper">
    <!--    PART 1-->
    <div v-if="displayCommentBlock1" class="commentBlock1">
<!--            <p>{{ commentContent.replace(/(<([^>]+)>)/ig, "") }}</p>-->
      <p v-html="commentContent"></p>
      <div class="commentBlock1Buttons">
        <button @click="displayCommentBlock1 = !displayCommentBlock1">Edit</button>
        <button @click.stop="handleDeleteComment">Delete</button>
      </div>
    </div>


    <!--      PART 2-->
    <!--      <div>{{ newContent }}</div>-->
    <!--      <div>comment id - {{ commentId }}</div>-->
    <div v-if="!displayCommentBlock1" class="commentBlock2">
      <form @submit.prevent="updateComment(commentId)">
        <textarea v-model="newContent">{{commentContent}}</textarea>
        <div class="commentBlock2Buttons">
          <button>Save</button>
          <button @click="displayCommentBlock1 = !displayCommentBlock1">x</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: "Comment",
  props: ['commentInfo'],
  data: function () {
    return {
      displayCommentBlock1: true,
      newContent: this.commentInfo.content.rendered.replace(/(<([^>]+)>)/ig, ""),
      commentId: this.commentInfo.id,
      commentContent: this.commentInfo.content.rendered.replace(/(<([^>]+)>)/ig, "")
    }
  },
  methods: {
    ...mapActions(['deleteComment']),
    handleDeleteComment() {
      this.deleteComment(this.commentId)
          .then(response => {
            if (response.status === 200 && response.ok) {
              console.log(`deleted comment id ${this.commentId}`);
              //remove this comment from local  data commentsList (in CardDetails.vue
              this.$emit('deleteCommentEmit', this.commentId)
            } else {
              console.log('Error during comment deletion in db')
            }
          })
    },
    updateComment(commentId) {
      const updateCommentEndpoint = `${this.$store.state.rootEndPoint}/comments/${commentId}`;
      const _data = {content: this.newContent};
      const fetchOptions = {
        method: "POST",
        body: JSON.stringify(_data),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$store.state.token}`
        }
      };
      fetch(updateCommentEndpoint, fetchOptions)
          .then(response => {
                if (response.status == 200 && response.ok) {
                  location.reload();
                } else {
                  console.log('Comment edit NOK')
                }
              }
          )
    },
  }
}
</script>

<style scoped>
.commentWrapper {
  /*background-color: lightblue;*/
  /*width: 300px;*/
  margin: 0 auto;
}

.commentBlock1 p {
  /*border: 2px solid red;*/
  text-align: start;
  border-radius: 5px;
  background-color: white;
  padding: 10px;
}

.commentBlock1Buttons {
  display: flex;
}

.commentBlock1 button {
  color: grey;
  border: none;
  background-color: transparent;
  border-bottom: 2px solid grey;
  margin-right: 10px;
}

.commentBlock2 {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
}

.commentBlock2 textarea {
  border: none;

  width: 100%;
  resize: none;
}

.commentBlock2Buttons {
  display: flex;
}

.commentBlock2Buttons button:nth-child(1) {
  background-color: #0053CC;
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.commentBlock2Buttons button:nth-child(2) {
  margin-left: 5px;
  border: none;
  background-color: transparent;
  font-size: x-large;
}


</style>