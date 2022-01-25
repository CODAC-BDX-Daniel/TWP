<template>
  <div class="moveCardWrapper">
    <h2>Move Card</h2>
<!--        <p> departure list {{this.departureListId}}</p>-->
<!--        <p> card Id - {{ this.idOfTheCard }}</p>-->
<!--        <p>card destination - {{ destinationListId }}</p>-->
    <hr>
    <p
        :class="{selectedDestination: destinationListId == list.id,disabled: list.id === departureListId}"
        @click="destinationListId=list.id" v-for="list in this.$store.state.allLists">{{ list.name }} </p>
    <button
        @click="handleMoveCard({cardId:this.idOfTheCard, title:this.titleCard, content: this.description, listId:this.destinationListId})">
      Move
    </button>
    <button @click.stop="closeMoveCard">X</button>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "MoveCard",
  props: ['idOfTheCard'],
  data: function () {
    return {
      departureListId: null,
      destinationListId: null,
      titleCard: null,
      cardInfos: null,
      description: null,
    }
  },
  methods: {
    ...mapActions(['fetchAllLists', 'updateCard']),
    closeMoveCard() {
      this.$emit('toggleMoveCard');
      // location.reload();
    },
    fetchThisCardInfos() {
      const endPoint = `${this.$store.state.rootEndPoint}/posts/${this.idOfTheCard}`;
      fetch(endPoint)
          .then(response => response.json())
          .then(cardInfos => {
            console.log('reto e', cardInfos)
            this.cardInfos = cardInfos;
            this.departureListId = cardInfos.categories[0];
            this.titleCard = cardInfos.title.rendered;
            this.description = cardInfos.content.rendered.replace(/(<([^>]+)>)/ig, "");
          })
    },
    handleMoveCard(payload) {
      this.updateCard(payload)
          .then(() => {
            this.$router.push({name: 'Home'})
          })
    }

  },
  mounted() {
    this.fetchThisCardInfos();

  }
}
</script>

<style scoped>
.moveCardWrapper {
  border-radius: 5px;
  padding: 10px;
  margin-left: 200px;
  position: absolute;
  z-index: 10;
  background-color: whitesmoke;
}

.selectedDestination {
  background-color: lightgray;
}

.disabled{
display: none;
}
</style>