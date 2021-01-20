<template>
  <q-page class="constrain-more q-pa-md">
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
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.caption"
          class="col col-sm-6"
          label="Caption"
          dense
        />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.location"
          class="col col-sm-6"
          label="Location"
          dense
        >
          <template v-slot:append>
            <q-btn
              icon="eva-navigation-2-outline"
              dense
              flat
              round
            />

          </template>
        </q-input>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn
          color="primary"
          label="Post Image"
          rounded
          unelevated
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from 'quasar'

export default {
  name: 'PageCamera',
  data() {
    return {
      post: {
        id: uid(),
        caption: '',
        location: '',
        photo: null,
        date: Date.now()
      }
    }
  }
}
</script>

<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>