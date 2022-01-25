<template>
  <div class="CommentBox">
  <p>{{ Comment }}</p>
  <div v-if="edit">
    <div class="rectangle" @click.self="edit = false;">
      <p><input v-model="Comment" placeholder="Edit a comment..."></p>
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
      Comment: '',
      edit: false,
    }
  }
}
</script>

<style scoped>

</style>
