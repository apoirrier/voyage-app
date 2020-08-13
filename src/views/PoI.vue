<template>
  <div class="poi">
    <NavigationBar :name="name" :parent="parent" />
    <ImageSlider :images="images" :altText="name" />
    <div class="content"> 
        <div class="main-content">
        <h1>{{ name }}</h1>
        <Rating :score="currentRate" :type="type" />
        <p class="description-content">{{ description }}</p>
        <Comment
            v-for="comment in comments"
            :title="comment.title"
            :content="comment.content"
            :date="comment.date"
            :rate="comment.rate"
            :type="type"
            :key="comment"
        />
        </div>
        <InfoDocker :website="website" :address="address" :phone="phone" :mail="mail" :type="type" :iframeUrl="iframeUrl"/>
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
      iframeUrl: ""
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
      return this.comments[this.comments.length - 1].rate;
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
      } catch (err) {
        console.log(err);
        return this.$router.push('/404');
      }
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
  max-width: 60%;
}

.description-content {
  justify-content: left;
  text-align: justify;
}

</style>