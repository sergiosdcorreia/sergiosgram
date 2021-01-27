<template>
  <q-page class="constrain q-pa-md">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-if="showNotificationsBanner" class="div banner-container bg-primary">
        <div class="constrain">
          <q-banner inline-actions dense class="bg-blue text-white">
            <template v-slot:avatar>
              <q-avatar
                color="white"
                icon="eva-camera-outline"
                text-color="grey-10"
                font-size="20px"
              />
            </template>

            <b>Enable notifications?</b>

            <template v-slot:action>
              <q-btn
                @click="enableNotifications"
                class="q-px-sm"
                label="Yes"
                dense
                flat
              />
              <q-btn
                @click="showNotificationsBanner = false"
                class="q-px-sm"
                label="later"
                dense
                flat
              />
              <q-btn
                @click="neverShowNotificationsBanner"
                class="q-px-sm"
                label="Never"
                dense
                flat
              />
            </template>
          </q-banner>
        </div>
      </div>
    </transition>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card
            v-for="post in posts"
            :key="post.id"
            class="card-post q-mb-md"
            :class="{ 'bg-red-2': post.offline }"
            bordered
            flat
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img
                    src="https://pt.gravatar.com/userimage/131461044/1d9ba2b55b1aae421bdd816281321d3f.jpg?size=200"
                  />
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

            <q-img :src="post.imageUrl" />

            <q-card-section>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">
                {{ post.date | formatedDate }}
              </div>
            </q-card-section>
          </q-card>
        </template>
        <template v-else-if="!loadingPosts && !posts.length">
          <h5 class="text-center text-grey">No posts yet.</h5>
        </template>
        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" size="40px" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"
                animation="fade"
              />
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img
                src="https://pt.gravatar.com/userimage/131461044/1d9ba2b55b1aae421bdd816281321d3f.jpg?size=200"
              />
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
import { date } from "quasar";
import { openDB } from "idb";

export default {
  name: "PageHome",
  data() {
    return {
      posts: [],
      loadingPosts: false,
      showNotificationsBanner: false
    };
  },
  computed: {
    serviceWorkerSupported() {
      if ("serviceWorker" in navigator) return true;
      return false;
    }
  },
  methods: {
    getPosts() {
      this.loadingPosts = true;
      this.$axios
        .get(`${process.env.API}/posts`)
        .then(response => {
          this.posts = response.data;
          this.loadingPosts = false;
          if (!navigator.onLine) {
            this.getOfflinePosts();
          }
        })
        .catch(err => {
          this.$q.dialog({
            title: "Error",
            message: "Could not download posts"
          });
          this.loadingPosts = false;
        });
    },
    getOfflinePosts() {
      let db = openDB("workbox-background-sync").then(db => {
        db.getAll("requests")
          .then(failedRequests => {
            failedRequests.forEach(failedRequest => {
              if (failedRequest.queueName == "createPostQueue") {
                let request = new Request(
                  failedRequest.requestData.url,
                  failedRequest.requestData
                );
                request.formData().then(formData => {
                  let offlinePost = {};
                  offlinePost.id = formData.get("id");
                  offlinePost.caption = formData.get("caption");
                  offlinePost.location = formData.get("location");
                  offlinePost.date = parseInt(formData.get("date"));
                  offlinePost.offline = true;

                  let reader = new FileReader();
                  reader.readAsDataURL(formData.get("file"));
                  reader.onloadend = () => {
                    offlinePost.imageUrl = reader.result;
                    this.posts.unshift(offlinePost);
                  };
                });
              }
            });
          })
          .catch(err => {
            console.log("Error accessing IndexedDB: ", err);
          });
      });
    },
    listenForOfflinePostUploaded() {
      if (this.serviceWorkerSupported) {
        const channel = new BroadcastChannel("sw-messages");
        channel.addEventListener("message", event => {
          console.log("Received: ", event.data);
          if (event.data.msg == "offline-post-uploaded") {
            let offlinePostCount = this.posts.filter(
              post => post.offline == true
            ).length;
            this.posts[offlinePostCount - 1].offline = false;
          }
        });
      }
    },
    initNotificationsBanner() {
      let neverShowNotificationsBanner = this.$q.localStorage.getItem('neverShowNotificationsBanner')

      if (!neverShowNotificationsBanner) {
        this.showNotificationsBanner = true
      }
    },
    enableNotifications() {
      console.log('enable notifications')
    },
    neverShowNotificationsBanner() {
      this.showNotificationsBanner = false
      this.$q.localStorage.set('neverShowNotificationsBanner', true)
    }
  },
  filters: {
    formatedDate(value) {
      return date.formatDate(value, "MMMM D, HH:mm");
    }
  },
  activated() {
    this.getPosts();
  },
  created() {
    this.listenForOfflinePostUploaded();
    this.initNotificationsBanner();
  }
};
</script>

<style lang="sass">
.card-post
  .q-img
    min-height: 200px
</style>
