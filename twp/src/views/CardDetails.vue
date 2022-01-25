<template>
  <!--  <h3>Here are cardDetails</h3>-->
  <!--  <p>List id - {{ listId }}</p>-->
  <!--  <p>List title- {{ listTitle }}</p>-->
  <!--  <p>Card id - {{ cardId }}</p>-->
  <!--  <p>Card title- {{ cardTitle }}</p>-->


  <div @click.self="this.isDisplay=false" class="cardDetails_wrapper">

  <MoveCard v-if="displayMoveCard"  :departureListId="this.listId" :idOfTheCard="this.cardId" @toggleMoveCard="displayMoveCard = !displayMoveCard"/>


    <form class="cardDetails_title"
          @submit.prevent="updateCard({cardId,title:titleCard, content: description, listId: listId})">
      <input type="text" v-model="titleCard"/>
    </form>
    <p @click="displayMoveCard=true" class="listName">In list <strong>{{ listTitle }}</strong></p>
    <h3>Description</h3>
    <form class="descriptionForm"
          @submit.prevent="updateCard({cardId,title:titleCard, content: description, listId: listId})">
      <textarea v-model="description" maxlength="300" rows="6" placeholder="Add a more detailed description..."
                required>
      </textarea>
      <br>
      <div class="descriptionFormButtons">
        <button>Save</button>
      </div>
    </form>

    <h3>Activity</h3>
    <!--    COMMENT CREATION -->
    <p> {{ commentContent }}</p>
    <form class="commentForm" @submit.prevent="handleCreateComment({commentContent,cardId}) ">
        <textarea v-on:click.self="show" v-model="commentContent" placeholder="Write a comment..." required></textarea>
      <button v-if="isDisplay">Save</button>

<!--          <button v-if="isDisplay"  v-on:click="hide" class="BtnSubmit">SAVE</button>-->
      <!--      <button type="submit" v-on:click="hide">SAVE</button>-->
    </form>

    <!--    COMMENTS DISPLAY-->
    <!--    <div class='commentWrapper' v-for="comment in commentsList">-->
    <!--      <p>{{ comment.content.rendered.replace(/(<([^>]+)>)/ig, "") }}</p>-->
    <!--      <form>-->
    <!--        <textarea :placeholder="comment.content.rendered.replace(/(<([^>]+)>)/ig, '')" v-model="editedComment">-->

    <!--        </textarea>-->
    <!--        <button>Save edit</button>-->
    <!--        <p>Comment v2 - {{editedComment}}</p>-->
    <!--      </form>-->

    <!--      <button>Edit</button>-->
    <!--      <button @click="handleDeleteComment({commentId: comment.id})">Delete</button>-->
    <!--    </div>-->

    <Comment v-for="comment in commentsList" :commentInfo="comment" @deleteCommentEmit="deleteLocallyStoredComment"/>

  </div>

</template>

<script>
import {mapActions} from 'vuex';
import Comment from "../components/Comment";
import MoveCard from "../components/MoveCard";

export default {
  name: "CardDetails",
  components: {
    // DescriptionCard,
    Comment,
    MoveCard,
  },
  props: ['cardId', 'listTitle', 'listId'],
  data: function () {
    return {
      // titleCard: this.cardTitle,
      titleCard: 'wazaaaa',
      // description: this.cardDescription.replace(/(<([^>]+)>)/ig, ""),
      description: 'description wazzaaaa',
      commentsList: [],
      commentContent: null,
      isDisplay: false,
      editedComment: null,
      cardInfos: null,
      displayMoveCard: false,
    }
  },
  computed: {
    descriptionNoHtmlTag() {
      let regex = /(<([^>]+)>)/ig;
      return this.cardDescription.replace(regex, "");
      // return 'computed properties'
    }
  },
  methods: {
    ...mapActions(['updateCard', 'fakeAction', 'createComment', 'deleteComment']),
    show: function () {
      this.isDisplay = true;
    },
    hide: function () {
      this.isDisplay = false;
    },
    fetchThisCardInfos() {
      const endPoint = `${this.$store.state.rootEndPoint}/posts/${this.cardId}`;
      fetch(endPoint)
          .then(response => response.json())
          .then(cardInfos => {
            this.cardInfos = cardInfos;
            this.titleCard = cardInfos.title.rendered;
            this.description = cardInfos.content.rendered.replace(/(<([^>]+)>)/ig, "");
          })
      // console.log("I am fetching this card's info")
    },
    fetchThisCardComments() {
      fetch(`${this.$store.state.rootEndPoint}/comments?parent=${this.cardId}`)
          .then(response => response.json())
          .then(data => {
            console.log('here are the comments list', data);
            this.commentsList = data;
          })
    },
    deleteLocallyStoredComment(commentId) {
      console.log(commentId)
      location.reload();
    },
    handleCreateComment(payload) {
      this.createComment(payload)
          .then(async data => {
            const newCommentCreated = await data;
            // console.log('XXY',data)
            this.commentsList.push({
              id: newCommentCreated.id,
              content: {rendered: newCommentCreated.content.raw.replace(/(<([^>]+)>)/ig, "")},
              author_name: newCommentCreated.author_name,
              date: newCommentCreated.date
            });
            this.isDisplay = !this.isDisplay;
          })
    },

    // handleDeleteComment(payload) {
    //   this.deleteComment(payload.commentId)
    //       .then(response => {
    //         // console.log('response from component',response)
    //         if (response.status === 200 && response.ok) {
    //           //remove this comment from local commentsList
    //           this.commentsList = this.commentsList.filter(comment =>
    //               comment.id !== payload.commentId
    //           )
    //         } else {
    //           // this.commentsList = this.commentsList.filter(comment =>
    //           //     comment.id !== payload.commentId
    //           // )
    //           console.log('Error during comment deletion in db')
    //         }
    //       })
    // }


  },
  mounted() {
    this.fetchThisCardInfos();
    this.fetchThisCardComments();

  }
}
</script>


<style scoped>
.cardDetails_wrapper {
  background-color: lightgray;
  border-radius: 10px;
  width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.cardDetails_title {
  /*border: 2px solid red;*/
}

.cardDetails_title input {
  /*background-color: #42b983;*/
  background-color: transparent;
  border: none;
  width: 100%;
  font-weight: bold;
  font-size: x-large;
  /*border-radius: 5px;*/
}

.cardDetails_title input:focus {
  border: #0053CC;
}

.listName {
  /*border: 2px solid red;*/
  text-align: start;
}

h3 {
  text-align: start;
}

.descriptionForm textarea {
  border: none;
  border-radius: 5px;
  resize: none;
  width: 100%;
}

.descriptionFormButtons {
  padding: 10px 0px;
  display: flex;
}

.descriptionFormButtons button {
  background-color: #0053CC;
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.commentForm textarea {
  border: none;
  border-radius: 5px;
  resize: none;
  width: 100%;
}


.commentForm button{
  background-color: #0053CC;
  color: white;
  padding: 10px;
  border-radius: 5px;
  display: block;
  margin-right: auto;
  margin-top: 10px;
}


</style>
