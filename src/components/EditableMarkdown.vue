<template>
    <div v-html="renderedHtml" class="editable-markdown"/>
</template>

<script>
import showdown from "showdown";
import { defineComponent } from 'vue';

export default defineComponent({
    name: "EditableMarkdown",
    props: {
        inputData: String
    },
    computed: {
        renderedHtml() {
            const converter = new showdown.Converter();
            const unsafeData = converter.makeHtml(this.inputData);
            return this.$sanitize(unsafeData);
        }
    }
})
</script>

<style lang="scss">
.editable-markdown a {
    color: blue;
}
</style>