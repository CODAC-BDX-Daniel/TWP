<template>
  <div class="homePageContainer">
    <list v-for="list in this.$store.state.allLists" :key="list.id" :listInfo="list"/>
    <CreateList/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import CreateList from "../components/CreateList";
import List from "../components/List";
import Comment from "../components/commentV0";


export default {
  name: 'Home',
  components: {
    Comment,
    List,
    CreateList,
    HelloWorld
  },
  methods: {
    fakeMethod() {
      console.log('wazaaa');
    }
  },

  mounted() {
    this.$store.dispatch('fetchAllLists')
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  background-image: url("../assets/dune.png");
  background-attachment: local;
  overflow: auto;
}

.homePageContainer {
  display: flex;
  flex-direction: row;
}


body {
  font-family: Arial, Helvetica, sans-serif;
}


</style>
