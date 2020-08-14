<template>
  <div class="poi">
    <NavigationBar :name="name" :parent="parent" />
    <img v-if="isEditing" src="images/edit_active.png" class="edit_button edit_button_active" @click="finishEdit">
    <img v-else src="images/edit.png" class="edit_button" @click="beginEdit">
    <ImageSlider :images="images" :altText="name" />
    <div class="content"> 
        <div class="main-content">
        <h1 v-if="!isEditing">{{ name }}</h1>
        <input v-else v-model="name">
        <Rating :score="currentRate" :type="type" />
        <p v-if="!isEditing" class="description-content">{{ description }}</p>
        <textarea v-else v-model="description"/>
        <button v-if="isEditing" @click="addComment" style="margin: 20px;">
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
        <InfoDocker :website="website" :address="address" :phone="phone" :mail="mail" 
                    :type="type" :iframeUrl="iframeUrl" :isEditing="isEditing" 
                    @hasChanged="updateInfos" />
    </div>
  </div>
</template>

<script>
import ImageSlider from "../components/ImageSlider.vue";
import NavigationBar from "../components/NavigationBar.vue";
import InfoDocker from "../components/InfoDocker.vue";
import Comment from "../components/Comment.vue";
import Rating from "../components/Rating.vue";
import { mapState } from 'vuex'

export default {
  name: "PoI",
  components: {
    ImageSlider,
    NavigationBar,
    InfoDocker,
    Comment,
    Rating
  },
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
      isEditing: false
    };
  },
  async created() {
    this.loadData()
  },
  watch: {
    '$route': 'loadData'
  },
  computed: {
    currentRate() {
      if(this.comments.length > 0)
        return this.comments[0].rate;
      return 0;
    },
    ...mapState(['apiAddr']),
    parent() {
      return {
        name: this.parentName,
        url: "/world/" + this.$route.params.region
      }
    }
  },
  methods: {
    async loadData() {
      try {
        const response = await fetch(this.apiAddr + "poi/" + this.$route.params.region + "/" + this.$route.params.poi);
        if(response.status == 404)
          return this.$router.push('/404');
        const data = await response.json();
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
        if(this.$route.query.edit == 1)
          this.isEditing = true;
      } catch (err) {
        console.log(err);
        return this.$router.push('/404');
      }
    },
    beginEdit() {
        this.isEditing = true;
    },
    finishEdit() {
      this.isEditing = false;
      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({  name: this.name, 
                                  description: this.description,
                                  address: this.address,
                                  comments: this.comments,
                                  images: this.images,
                                  mail: this.mail,
                                  phone: this.phone,
                                  type: this.type,
                                  website: this.website,
                                  iframeUrl: this.iframeUrl }),
      };
      fetch(this.apiAddr + "update/" + this.$route.params.region + "/" + this.$route.params.poi, requestOptions);
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
        rate: 0
      })
    },
    editComment(data, nb) {
      this.comments[nb] = {
        title: data.title,
        content: data.content,
        date: data.date,
        rate: data.rate
      }
    },
    removeComment(idx) {
      this.comments.splice(idx, 1);
    }
  }
};
</script>

<style lang="scss">
.poi {
  padding: 20px;
}

.content {
  display: flex;
  justify-content: space-around;
}

.main-content {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}

.main-content textarea {
  margin: 20px; 
  min-width: 400px; 
  min-height: 100px;
}


.description-content {
  justify-content: left;
  text-align: justify;
}


</style>