<template>
    <div>
        <div class="cap-type">
            <div class="wildcard" @click="changeType('all')">
                <div class="wild">
                    <img src="~/assets/images/icons/baseball.png" alt="">
                    <img src="~/assets/images/icons/beanie.png" alt="">
                </div>
                <div class="wild">
                    <img src="~/assets/images/icons/fedora.png" alt="">
                    <img src="~/assets/images/icons/top-hat.png" alt="">
                </div>
            </div>
            <div class="cap-option" @click="changeType('baseball')">
                <img src="~/assets/images/icons/baseball.png" alt="" class="cap-img">
            </div>
            <div class="cap-option" @click="changeType('beanie')">
                <img src="~/assets/images/icons/beanie.png" alt="" class="cap-img">
            </div>
            <div class="cap-option" @click="changeType('fedora')">
                <img src="~/assets/images/icons/fedora.png" alt="" class="cap-img">
            </div>
            <div class="cap-option" @click="changeType('top-hat')">
                <img src="~/assets/images/icons/top-hat.png" alt="" class="cap-img">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        changeType(data) {
            this.$store.commit('setSearchText', "");
            this.$store.commit('setCategory', data);
        }
    }
}
</script>



<style scoped>

.wildcard {
    display: flex;
    flex-wrap: wrap;
    margin: 1rem 2rem;
    align-items: center;
    cursor: pointer;
    background-color: rgb(172, 170, 170);
    width: 100px;
    height: 100px;
}

.wild {
    width: 50%;
}

.cap-type {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.cap-option {
    margin: 1rem 2rem;
    background-color: rgb(172, 170, 170);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 100px;
    height: 100px;
}

.cap-img {
    height: 50px;
    width: 50px;
}


</style>