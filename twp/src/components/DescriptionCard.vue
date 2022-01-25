<template>
  <div class="DescriptionBox">
  <p>{{ Description }}</p>
  <div v-if="edit">
    <div class="rectangle" @click.self="edit = false;">
      <p><input v-model="Description" placeholder="Added a more detailed Description..."></p>
      <input class="BtnSubmit" @click="CreateList()" type="submit" value="SAVE" >
    </div>
  </div>
  <button class="BtnTransparent" @click="edit = !edit;">
    {{ edit ? "X" : "Edit" }}
  </button>
    <button class="BtnTransparent" @click="DeleteComment()" type="delete" value="Delete">Delete</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Description: '',
      edit: false,
    }
  }
}
</script>

<style scoped>

</style>
