<template>
  <div class="listWrapper">
    <div class="listTitle_wrapper">
      <form
          @submit.prevent="updateList({listId: listId, description: listDescription, name: listTitle, slug: listTitle })">
        <input v-model="listTitle" required>
      </form>
      <button @click="deleteList(this.listInfo.id)">X</button>
    </div>


    <!--    CARDS LISTING-->
    <div class="card" v-for="card in cardsList">
      <button @click="handleDeleteCard(card.id)">x</button>
      <router-link
          :to="{name:'CardDetails', params:{cardId: card.id, listTitle: listTitle, listId}}">
        <div>{{ card.title.rendered }}</div>
      </router-link>
    </div>

    <!--    ADD CARD-->
    <button v-if="!isOpen" @click="isOpen = !isOpen;" class="BtnTransparent">
      {{ isOpen ? "X" : "+ Add a card" }}
    </button>
    <div v-if="isOpen">
      <div class="addCardForm" @click.self="isOpen = false;">
        <form @submit.prevent="handleCreateCard({cardTitle,listId: listInfo.id})">
          <textarea v-model="cardTitle" placeholder="Add a card" maxlength="100" required>
          </textarea>
          <br>
          <div class="addFormButtons">
            <button>Add a card</button>
            <button @click="isOpen = !isOpen">X</button>
          </div>

        </form>
      </div>
    </div>


  </div>
</template>

<script>
import {mapActions} from 'vuex'
import CardDetails from "../views/CardDetails";
import {token, rootEndPoint} from "../env/env";


export default {
  components: {CardDetails},
  props: ['listInfo'],
  data: function () {
    return {
      cardsList: [],
      listId: this.listInfo.id,
      listTitle: this.listInfo.name,
      listDescription: this.listInfo.description,
      isOpen: false,
      cardTitle: null,
      isOpenCard: false,
      isOpenCard2: false,
    };
  },
  methods: {
    refresh() {
      console.log('refreshing')
      this.$forceUpdate();
    },
    ...mapActions(['createCard', 'updateList', 'fakeAction', 'deleteCard', 'deleteList']),
    fetchCardsRelatedToThisList() {
      // const endPoint = 'http://localhost:8888/wordpress/wp-json/wp/v2/posts?categories=' + this.listInfo.id;
      const endPoint = `${rootEndPoint}/posts?categories=${this.listInfo.id} `
      fetch(endPoint)
          .then(response => {
            if (response.status === 200 && response.ok) {
              return response.json()
            } else {
              console.log('aucun cards à récup')
              return;
            }
          })
          .then(cards => {
            this.cardsList = cards
          })
          .catch(error => {
            console.log('error while fetching cards', error.message)
          })
    },
    handleCreateCard(newCardInfo) {
      // console.log(newCardInfo)
      console.log('creating card')
      this.createCard(newCardInfo)
          .then(async (response) => {
            // console.log('creating card', response);
            //check if creation ok via response status and response ok
            if (response.status === 201 && response.ok) {
              const newCard = await response.json();
              console.log('newcards id', newCard);
              this.cardsList.push({id: newCard.id, title: {rendered: newCard.title.rendered}})
            } else {
              console.log('error during card creation')
            }
          })
    },
    handleDeleteCard(cardId) {
      this.deleteCard(cardId)
          .then(response => {
                if (response.status === 200 && response.ok) {
                  console.log('delete card resp from compo', response)
                  this.cardsList = this.cardsList.filter(card => card.id !== cardId);
                } else {
                  console.log('Error during removing')
                }
              }
          )
      ;
    },
  },

  mounted() {
    this.fetchCardsRelatedToThisList();
  }
}
</script>

<style scoped>
.listWrapper {
  margin: 0 20px;
  padding: 10px;
  /*border: 2px solid red;*/
  border-radius: 5px;
  width: 250px;
  background-color: lightgray;
  flex-shrink: 0;
}

.listTitle_wrapper {
  /*border: 2px solid blue;*/
  display: flex;
  justify-content: space-between;
  padding: 0px;
  margin-bottom: 10px;
}

.listTitle_wrapper form {
  width: 100%;

}

.listTitle_wrapper input {
  /*border: 2px solid red;*/
  border: none;
  width: 100%;
  flex-grow: 1;
  background-color: lightgray;
}

.listTitle_wrapper input:focus {
  background-color: whitesmoke;
}


.card {
  /*border: 2px solid blue;*/
  position: relative;
  background-color: ghostwhite;
  margin: 10px 0px;
  padding: 10px;
  border-radius: 5px;
}

.card button {
  position: absolute;
  top: 2px;
  right: 6px;
  width: 2%;
  border: none;
  background-color: ghostwhite;
}

.card a {
  text-decoration: none;
  color: black
}

.BtnTransparent {
  width: 100%;
  background-color: lightgray;
  border: none;
  text-align: left;
  padding: 10px;
  border-radius: 5px;

}

.BtnTransparent:hover {
  background-color: grey;
}

.addCardForm textarea {
  resize: none;
  width: 100%;
  border: none;
  border-radius: 5px;
}

.addFormButtons{
  /*background-color: #42b983;*/
  display: flex;
  flex-direction: row;
  padding: 5px 0px;
}
.addFormButtons button:nth-child(1){
  background-color: #0053CC;
  color:white;
  padding: 10px;
  border-radius: 5px;
}
.addFormButtons button:nth-child(2){
margin-left: 5px;
  border: none;
  background-color: transparent;
  font-size: x-large;
}


</style>



#app > div.homePageContainer > div:nth-child(1) > div:nth-child(7) > div > form > button:nth-child(3)