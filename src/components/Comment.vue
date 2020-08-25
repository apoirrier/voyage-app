<template>
    <div class=comment>
        <div class=comment-title>
            <span v-if="!isEditing"> {{ title }} </span>
            <input v-else v-model="title" @change="onChange">
            <div v-if="isEditing" class="cross_close_comment" @click="remove"> 
                <svg viewBox="0 0 365.71733 365">
                    <path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" />
                    <path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" />
                </svg>
            </div>
        </div>
        <p v-if="!isEditing" class=comment-content> {{ content }} </p>
        <textarea v-else class="pinput" v-model="content" @change="onChange" />
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
    display: flex;
    flex-direction: column;
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
    font-size: 1.17em;
    font-weight: bold;
    padding-left: 30px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.comment-content {
    min-height: 40px;
    margin-left: 30px;
    margin-right: 30px;
    text-align: justify;
}

.comment-bottom {
    background-color: rgb(243, 243, 243);
    height: 30px;
    line-height: 30px;
    font-size: 1em;
    text-align: right;
    border-right: 20px;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    padding-left: 30px;
}

.comment-rating {
    transform:scale(0.75) translate(-50px,-4px);
}

.cross_close_comment {
    cursor: pointer;
    fill: red;
    display: flex;
}

.cross_close_comment svg {
    width: 15px;
    height: 15px;
}

</style>