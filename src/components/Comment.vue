<template>
    <div class=comment>
        <div class=comment-title>
            {{ title }}
        </div>
        <p class=comment-content> {{ content }} </p>
        <div class=comment-bottom>
            <rate class="RateCustom comment-rating" :length="5" :value="rate" :disabled="true" :iconref="icon"/>
            <div> {{ date }} </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Comment",
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
        icon: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
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
</style>