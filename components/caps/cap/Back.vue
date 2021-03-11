<template>
    <div class="desc-container">
        <p class="desc">{{cap.description}}</p>
    </div>
</template>

<script>
export default {
    props: {
        cap: Object,
    },
}
</script>

<style scoped>

.desc-container {
    padding: 3rem 1rem;
    height: 300px;
    width: 250px;
    text-align: left;
}

</style>