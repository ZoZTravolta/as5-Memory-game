'use strict';

$(document).ready(function(){
    game.start();
})
const imgBase = {};
const cards = {};
const game = {};



game.start=()=>{
    imgBase.imgApi = 'https://dog.ceo/api/breeds/image/random';
    imgBase.numOfImagesToGet = 9;
    imgBase.imgArr = [];
    imgBase.buildPicsDataBase();
    cards.reset();
    game.score = 0;
}


imgBase.buildPicsDataBase = async () => {
    $('.loader').addClass('show')
    for (let i = 0; i < imgBase.numOfImagesToGet; i++) {
        try {
            let getImage = await $.get({
                url: imgBase.imgApi,
                dataType: 'json',
            }).promise()
            imgBase.imgArr.push(getImage.message);
            imgBase.imgArr.push(getImage.message);
        }
        catch{
            console.log('error loading images')
        }
    }
    imgBase.shuffleArray();
    imgBase.loadAllImages();
    $('.loader').removeClass('show');

}

imgBase.loadAllImages =() =>{
    for(let img of imgBase.imgArr){
        $('.img-tank').append(`<img src="${img}" />`)
    }
    
}

imgBase.shuffleArray = () => {
    function shuffle(arr) {
        let ctr = arr.length;
        let temp;
        let index;
        // While there are elements in the array
        while (ctr > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * ctr);
            // Decrease ctr by 1
            ctr--;
            // And swap the last element with it
            temp = arr[ctr];
            arr[ctr] = arr[index];
            arr[index] = temp;
        }
        return arr;
    }
    shuffle(imgBase.imgArr)
    console.log(imgBase.imgArr)
    cards.createCards();
}

cards.reset=()=>{
    cards.card1 = null;
    cards.card2 = null;
    $('.card').attr("disabled", false);
}

cards.createCards = () => {
    for (let index in imgBase.imgArr) {
        $('.game').append(`<div class="card" id="${index}" value="${index}">
            <div class="front"></div>
            <div class="back"></div>
        </div>`);
        $(`#${index}`).click(function(){
            cards.clickOnCard(this);   
        })
    }
};

cards.clickOnCard = (cardThatClicked) => {
    if (typeof $(cardThatClicked).attr("disabled") === typeof undefined || $(cardThatClicked).attr("disabled") === false) {
        $(cardThatClicked).attr("disabled", true);
        cards.flipCard(cardThatClicked);
    }
    else{
        console.log('disabled')
    }
    
}

cards.flipCard = (cardThatClicked) =>{
    const back = cardThatClicked.getElementsByClassName('back')[0];
    if (cards.card1 == null){
        cards.card1 = cardThatClicked;
        $(cardThatClicked).addClass('is-flipped');
        back.style.backgroundImage = `url("${imgBase.imgArr[cardThatClicked.id]}")`;
    }
    else if (cards.card2 == null){
        cards.card2 = cardThatClicked;
        $(cardThatClicked).addClass('is-flipped');
        back.style.backgroundImage = `url("${imgBase.imgArr[cardThatClicked.id]}")`;
        cards.checkIfMatch()
    }
}

cards.checkIfMatch =()=>{
    if ($(cards.card1.getElementsByClassName('back')[0]).css('background-image') == $(cards.card2.getElementsByClassName('back')[0]).css('background-image')){
        game.match();
    }
    else{
        game.fillipBack();
    }
};

game.match=()=>{
    $(cards.card1).unbind();
    $(cards.card2).unbind();
    cards.reset();
    game.giveScore();
}
game.fillipBack = () =>{
    setTimeout(() => {
        $(cards.card1).removeClass('is-flipped');
        $(cards.card2).removeClass('is-flipped');
        cards.reset();
    }, 2000);
}

game.giveScore = ()=>{
    game.score++;
    console.log(game.score);
    if (game.score == imgBase.numOfImagesToGet){
        console.log('win');
    }
    
}








