<template>
    <div class=comment>
        <div class=comment-title>
            <span v-if="!isEditing"> {{ title }} </span>
            <input v-else v-model="title" @change="onChange">
            <div v-if="isEditing" class="cross_close_comment" @click="remove"> X </div>
        </div>
        <p v-if="!isEditing" class=comment-content> {{ content }} </p>
        <textarea v-else v-model="content" @change="onChange" />
        <div class=comment-bottom>
            <Rating class="comment-rating" :score="rate" :type="type" :editable="isEditing" @after-rate="rateChanged"/>
            <div v-if="!isEditing"> {{ date }} </div>
            <input v-else v-model="date" @change="onChange">
        </div>
    </div>
</template>

<script>
import Rating from './Rating.vue'

export default {
    name: "Comment",
    components: {
        Rating
    },
    props: {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            default: ''
        }, 
        rate: {
            type: Number,
            default: 3
        },
        type: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        isEditing: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onChange() {
            const data = {
                title: this.title,
                content: this.content,
                rate: this.rate,
                date: this.date,
            }
            this.$emit("hasChanged", data);
        },
        rateChanged(newRate) {
            const data = {
                title: this.title,
                content: this.content,
                rate: newRate,
                date: this.date,
            }
            this.$emit("hasChanged", data);
        },
        remove() {
            this.$emit("remove");
        }
    }
}
</script>

<style lang="scss">
.comment {
    background-color: white;
    text-align: left;
    border: 1px solid;
    margin-bottom: 20px;
    min-width: 350px;
}

.comment-title {
    background-color: rgb(243, 243, 243);
    height: 40px;
    line-height: 40px;
    align-self: start;
    font-size: 1.17em;
    font-weight: bold;
    display: block;
    text-indent: 1em;
    position: relative;
}

.comment-content {
    min-height: 40px;
    margin-left: 2em;
    margin-right: 2em;
    text-align: justify;
}

.comment-bottom {
    background-color: rgb(243, 243, 243);
    height: 30px;
    line-height: 30px;
    align-self: start;
    font-size: 1em;
    text-align: right;
    display: block;
    border-right: 20px;
    padding-right: 20px;
}

.comment-rating {
    float: left;
    transform:scale(0.75) translate(-40px,-7px);
}

.cross_close_comment {
    position: absolute; 
    top: 0px; 
    right: 15px; 
    color: red; 
    cursor: pointer;
    font-weight: bold;
}
</style>