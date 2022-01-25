<template>
  <div class="createListWrapper">
    {{ newListTitle }}
    <div v-if="isOpen">
      <div class="rectangle" @click.self="isOpen = false;">
        <form @submit.prevent="createList(newListTitle)">
          <input  v-model="newListTitle" placeholder="Add another list" maxlength="100" required>
          <div class="createListButtons">
            <button>Add new list</button>
            <button @click="isOpen=!isOpen">X</button>
          </div>
        </form>
      </div>
    </div>
    <button v-if="!isOpen" class="BtnTransparent" @click="isOpen = !isOpen;">
      {{ isOpen ? "X" : "+ Add another list" }}
    </button>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  data: function () {
    return {
      isOpen: false,
      newListTitle: null,
    };
  },
  methods: {
    ...mapActions(['createList', 'fakeAction'])
  }
}
</script>

<style scoped>
.createListWrapper {
  margin: 0 20px;
  width: 250px;
  height: 100%;
  flex-shrink: 0;
  background-color: lightgray;
  opacity: 50%;
  padding: 10px;
}

.rectangle input{
  width: 100%;
  border: none;
  border-radius: 5px;
  padding: 10px;
}

.createListButtons{
  display: flex;
  flex-direction: row;
  padding: 5px 0px;
}

.createListButtons button:nth-child(1){
  background-color: #0053CC;
  color:white;
  padding: 10px;
  border-radius: 5px;

}
.createListButtons button:nth-child(2){
  margin-left: 5px;
  border: none;
  background-color: transparent;
  font-size: x-large;
}

.BtnTransparent{
  width:100%;
  border:none;
  background-color: transparent;
  text-align: start;

}

</style>


<!--add a list inside state by triggering ADD_LIST commiter -->
<!--once a new list created-->
<!--check response status and response ok -->
<!--if response status 200/201 and response ok-->
<!--then update state-->
