<template>
  <div>
    <img
      v-if="!hasLoaded"
      src="/images/teleport.jpg"
      style="height: 80%; width: 100%"
    />
    <div v-else class="poi">
      <NavigationBar
        :name="name"
        :parent="parent"
        @login-change="changeLogin"
      />
      <ImageSlider
        :images="images"
        :altText="name"
        :isEditing="isEditing"
        :imageName="this.$route.params.poi"
        @images-changed="updateImages"
      />
      <div style="text-align: right">
        <img
          v-if="isEditing"
          src="/images/edit_active.png"
          class="edit_button edit_button_active"
          @click="finishEdit"
        />
        <img
          v-else-if="!isEditing && loggedIn"
          src="/images/edit.png"
          class="edit_button"
          @click="beginEdit"
        />
        <div v-else />
      </div>
      <div class="content">
        <div class="main-content">
          <h1 v-if="!isEditing">{{ name }}</h1>
          <input v-else class="h1input" v-model="name" />
          <Rating :score="currentRate" :type="type" />
          <EditableMarkdown
            v-if="!isEditing"
            class="description-content"
            :inputData="description"
          />
          <textarea v-else class="pinput" v-model="description" />
          <button v-if="isEditing" @click="addComment" style="margin: 20px">
            Nouveau commentaire
          </button>
          <Comment
            v-for="(comment, idx) in comments"
            :title="comment.title"
            :content="comment.content"
            :date="comment.date"
            :rate="comment.rate"
            :type="type"
            :key="comment.date"
            :isEditing="isEditing"
            @hasChanged="editComment($event, idx)"
            @remove="removeComment(idx)"
          />
        </div>
        <div class="right-panel">
          <InfoDocker
            :website="website"
            :address="address"
            :phone="phone"
            :mail="mail"
            :type="type"
            :iframeUrl="iframeUrl"
            :isEditing="isEditing"
            @hasChanged="updateInfos"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageSlider from "../components/ImageSlider.vue";
import NavigationBar from "../components/NavigationBar.vue";
import InfoDocker from "../components/InfoDocker.vue";
import Comment from "../components/Comment.vue";
import Rating from "../components/Rating.vue";
import EditableMarkdown from "../components/EditableMarkdown.vue";
import Parse from "parse";
import parse from "../mixins/parse.ts";

export default {
  name: "PoI",
  components: {
    ImageSlider,
    NavigationBar,
    InfoDocker,
    Comment,
    Rating,
    EditableMarkdown,
  },
  mixins: [parse],
  data() {
    return {
      parentName: "",
      name: "",
      description: "",
      website: "",
      address: "",
      phone: "",
      mail: "",
      type: "",
      comments: [],
      images: [],
      iframeUrl: "",
      isEditing: false,
      loggedIn: Parse.User.current() != undefined,
      rateChanged: false,
      hasLoaded: false,
    };
  },
  async created() {
    this.loadData();
  },
  watch: {
    $route: "loadData",
  },
  async beforeRouteLeave(to, from, next) {
    if (this.isEditing) {
      try {
        const isOk = await this.$confirm("Sauvegarder ?");
        if (isOk) await this.finishEdit();
      } finally {
        next();
      }
    } else next();
  },
  computed: {
    currentRate() {
      this.rateChanged;
      if (this.comments.length > 0) return this.comments[0].rate;
      return 0;
    },
    parent() {
      return {
        name: this.parentName,
        url: "/world/" + this.$route.params.region,
      };
    },
  },
  methods: {
    changeLogin(newValue) {
      this.loggedIn = newValue;
    },
    async loadData() {
      this.callParse(
        "getPoi",
        { region: this.$route.params.region, poi: this.$route.params.poi },
        (answer) => {
          const data = answer.poi;
          this.parentName = data.parentName;
          this.name = data.name;
          this.description = data.description;
          this.address = data.address;
          this.comments = data.comments;
          this.images = data.images;
          this.mail = data.mail;
          this.phone = data.phone;
          this.type = data.type;
          this.website = data.website;
          this.iframeUrl = data.iframeUrl;
          if (this.$route.query.edit == 1) this.isEditing = true;
          this.hasLoaded = true;
        },
        this
      );
    },
    beginEdit() {
      this.isEditing = true;
    },
    finishEdit() {
      this.isEditing = false;
      const params = {
        region: this.$route.params.region,
        poi: this.$route.params.poi,
        data: {
          name: this.name,
          address: this.address,
          comments: this.comments,
          description: this.description,
          iframeUrl: this.iframeUrl,
          images: this.images,
          mail: this.mail,
          phone: this.phone,
          website: this.website,
          type: this.type,
        },
      };
      this.callParse("updatePoi", params, () => {}, this);
    },
    updateInfos(data) {
      this.address = data.address;
      this.mail = data.mail;
      this.phone = data.phone;
      this.website = data.website;
      this.iframeUrl = data.iframeUrl;
    },
    addComment() {
      this.comments.unshift({
        title: "",
        content: "",
        date: "",
        rate: 0,
      });
    },
    editComment(data, nb) {
      this.comments[nb] = {
        title: data.title,
        content: data.content,
        date: data.date,
        rate: data.rate,
      };
      this.rateChanged = !this.rateChanged;
    },
    removeComment(idx) {
      this.comments.splice(idx, 1);
    },
    updateImages(img) {
      this.images = img;
    },
  },
};
</script>

<style lang="scss">
.poi {
  padding: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

@media screen and (min-width: 800px) {
  .content {
    flex-direction: row;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
}

@media screen and (min-width: 800px) {
  .main-content {
    max-width: 60%;
  }
}

.main-content textarea {
  margin: 20px;
  min-height: 100px;
}

.description-content {
  justify-content: left;
  text-align: justify;
}

.right-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

@media screen and (min-width: 800px) {
  .right-panel {
    width: 35%;
  }
}
</style>