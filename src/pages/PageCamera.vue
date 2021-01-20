<template>
  <q-page class="constrain q-pa-md">
    <div class="camera-frame q-pa-md">
      <img 
        class="full-width"
        src="https://images.unsplash.com/photo-1570082799531-e8a190b717ca?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=889&q=80"
      >
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        color="grey-10"
        icon="eva-camera"
        size="lg"
        round
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageCamera'
}
</script>

<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>