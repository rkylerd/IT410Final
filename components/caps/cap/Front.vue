<template>
    <div class="cap-box">
        <div class="cap-cat">
           <div>
               <p>{{cap.category}}</p>
            </div> 
           <div>
                <img :src="getImgUrl(cap.category)" alt="">   
            </div> 
        </div>
        <div>
            <div>
                <p class="cap-price">${{cap.price}}</p>
            </div>
        </div>
        <div>
            <img class="cap-img" :src="getHatPic(cap.imageUrl)" alt="">
        </div>
        <div>
            <p class="cap-name">{{cap.name}}</p>
        </div>

        
    </div>
</template>

<script>
export default {
    props: {
        cap: Object,
    },
    methods: {
        getImgUrl(pic) {
            return require('~/assets/images/icons/'+pic+'.png');
        },
        getHatPic(pic) {
            return require('~/assets/images/'+pic+'.jpg');
        }
    }
}
</script>

<style scoped>

.cap-box {
    padding: 1rem 1rem;
    width: 250px;
    text-transform: uppercase;
}

.cap-cat {
    display: flex;
    justify-content: space-between;
}

.cap-price {
    text-align: left;
    font-size: 1.4rem;
}

.cap-img {
    height: 60%;
    width: 60%;
}

.cap-name {
    text-align: left;
    margin: 1rem 0;
    color: #1e81b0;
}

</style>