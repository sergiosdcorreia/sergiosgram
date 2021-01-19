<template>
  <q-page class="constrain q-pa-md">
    <q-card class="card-post" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://pt.gravatar.com/userimage/131461044/1d9ba2b55b1aae421bdd816281321d3f.jpg?size=200">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">sergiosdcorreia</q-item-label>
          <q-item-label caption>
            Porto, Portugal
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-img
        src=""
      />

      <q-card-section>
        <div>Luis I bridge</div>
        <div class="text-caption text-grey">Jan 19 15:05</div>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageHome'
}
</script>

<style lang="sass">
  .card-post
    .q-img
      min-height: 200px
</style>