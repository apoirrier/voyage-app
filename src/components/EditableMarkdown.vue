<template>
    <p v-html="renderedHtml" />
</template>

<script>
import mixin from '../mixins/mixin'

export default {
    name: "EditableMarkdown",
    mixins: [mixin],
    props: {
        inputData: String
    },
    computed: {
        renderedHtml() {
            return this.sanitize(this.inputData);
        }
    }
}
</script>
