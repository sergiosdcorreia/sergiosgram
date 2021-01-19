<template>
  <q-page class="constrain q-pa-md">

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <q-card
          v-for="post in posts"
          :key="post.id"
          class="card-post q-mb-md"
          bordered
          flat
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://pt.gravatar.com/userimage/131461044/1d9ba2b55b1aae421bdd816281321d3f.jpg?size=200">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">sergiosdcorreia</q-item-label>
              <q-item-label caption>
                {{ post.location }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-img
            :src="post.imageUrl"
          />

          <q-card-section>
            <div>{{ post.caption }}</div>
            <div class="text-caption text-grey">{{ post.date | formatedDate }}</div>
          </q-card-section>

        </q-card>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://pt.gravatar.com/userimage/131461044/1d9ba2b55b1aae421bdd816281321d3f.jpg?size=200">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">sergiosdcorreia</q-item-label>
            <q-item-label caption>
              Sergio Correia
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'PageHome',
  data() {
    return {
      posts: [
        {
          id: 1,
          caption: 'Luis I Bridge',
          date: 1611068397977,
          location: 'Porto, Portugal',
          imageUrl: 'https://images.unsplash.com/photo-1570082799531-e8a190b717ca?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=889&q=80'
        },
        {
          id: 2,
          caption: 'Luis I Bridge',
          date: 1611068397977,
          location: 'Porto, Portugal',
          imageUrl: 'https://images.unsplash.com/photo-1570082799531-e8a190b717ca?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=889&q=80'
        },
        {
          id: 3,
          caption: 'Luis I Bridge',
          date: 1611068397977,
          location: 'Porto, Portugal',
          imageUrl: 'https://images.unsplash.com/photo-1570082799531-e8a190b717ca?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=889&q=80'
        },
        {
          id: 4,
          caption: 'Luis I Bridge',
          date: 1611068397977,
          location: 'Porto, Portugal',
          imageUrl: 'https://images.unsplash.com/photo-1570082799531-e8a190b717ca?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=889&q=80'
        },
      ]
    }
  },
  filters: {
    formatedDate(value) {
      return date.formatDate(value, 'MMMM D HH:mm')
    }
  }
}
</script>

<style lang="sass">
  .card-post
    .q-img
      min-height: 200px
</style>