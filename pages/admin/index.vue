<template>
    <div>
        <div class="panel">
            <div class="menu">
                <div class="nav-items">
                    <h4 class="nav-item">
                        <img src="~/assets/images/icons/check-list.png" alt="">
                        <span class="nav-title">Inventory</span>
                    </h4>
                    <h4 class="nav-item">
                        <img src="~/assets/images/icons/box.png" alt="">
                        <span class="nav-title">Orders</span>
                    </h4>
                    <h4 class="nav-item">
                        <img src="~/assets/images/icons/group.png" alt="">
                        <span class="nav-title">Users</span>
                    </h4>
                </div>
            </div>

            <div class="component">

            </div>
        </div>
    </div>
</template>


<script>
export default {
    
}
</script>



<style scoped>

.panel {
    display: flex;
}

.menu {
    flex-basis: 15%;
    background-color: #114b5f;
    height: 100vh;
    position: relative;
}

.nav-items {
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translate(0, -50%);
}

.nav-item {
    margin: 5rem 0;
    color: #fff;
    border: solid 1px #fff;
    padding: 2rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: all cubic-bezier(0.19, 1, 0.22, 1);
}

.nav-item img {
     filter: invert(100%);
}

.nav-item:hover {
    background-color: black;
}


@media only screen and (max-width: 1400px) {
    .menu {
        flex-basis: 18%;
    }
}

@media only screen and (max-width: 1200px) {
    .panel {
        display: block;
    }

    .menu {
        height: 13rem;
        flex-direction: row;
    }

    .nav-items {
        position: relative;
        left: 0;
        display: flex;
        justify-content: center;
        padding: 5rem 0;
        top: 0;
        transform: translate(0, 0);
    }

    .nav-item {
        width: 10rem;
        margin: 0 2rem;
        padding: 2rem 0;
    }
}

@media only screen and (max-width: 640px) {
    .nav-item {
        font-size: 1rem;
        padding: .6rem 0;
        margin: 0 .4rem;
    }

    .menu {
        height: 9rem;
    }
}

@media only screen and (max-width: 350px) {
    .nav-item {
        font-size: .7rem;
    }
}

</style>