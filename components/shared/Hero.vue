<template>
    <div>
        <div class="hero-container">
            <div id="hero-1">
                <img class="hero-img" src="~/assets/images/hero.jpg" alt="Hero image">
            </div>
            <div class="hero-caption" id="hero-2">
                <div class="hero-caption-text">
                    <h1>Welcome to Caps</h1>
                    <b-btn variant="primary" size="lg">Find your Cap</b-btn>
                </div>
                <img class="hero-img" src="~/assets/images/hero2.jpg" alt="Hero image">
            </div>
            <div id="hero-3">
                <img class="hero-img" src="~/assets/images/hero3.jpg" alt="Hero image">
            </div>
        </div>
    </div>
</template>


<style scoped>

.hero-container {
    display: flex;
    justify-content: center;
}

.hero-img {
    width: 100%;
    height: 100%;
}

.hero-caption {
    position: relative;
}

.hero-caption-text {
    position: absolute;
    color: #fff;
    top: 30%;
    left: 5%;
}


@media only screen and (max-width: 1010px) {
    #hero-1, #hero-3 {
        display: none;
    }
}

@media only screen and (max-width: 500px) {
    .hero-caption-text {
        top: 18%;
        
    }

    .hero-caption-text h1 {
        font-size: 1.3rem;
    }
}

</style>