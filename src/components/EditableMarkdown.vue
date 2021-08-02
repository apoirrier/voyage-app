<template>
    <div v-html="renderedHtml" />
</template>

<script>
import showdown from "showdown";

export default {
    name: "EditableMarkdown",
    props: {
        inputData: String
    },
    computed: {
        renderedHtml() {
            const converter = new showdown.Converter();
            const unsafeData = converter.makeHtml(this.inputData);
            console.log(unsafeData);
            return this.$sanitize(unsafeData);
        }
    }
}
</script>
