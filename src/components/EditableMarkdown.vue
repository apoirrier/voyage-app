<template>
    <p v-html="renderedHtml" />
</template>

<script>

export default {
    name: "EditableMarkdown",
    props: {
        inputData: String
    },
    computed: {
        renderedHtml() {
            return this.inputData;
        }
    }
}
</script>
