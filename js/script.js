'use strict';

const imgBase = {};
const cards = {};
const game = {};

game.start=()=>{
    imgBase.imgApi = 'https://dog.ceo/api/breeds/image/random';
    imgBase.numOfImagesToGet = 2;
    imgBase.imgArr = [];
    imgBase.buildPicsDataBase();
    cards.reset();
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
    $('.loader').removeClass('show');

}
imgBase.shuffleArray = () => {
    function shuffle(arra1) {
        let ctr = arra1.length;
        let temp;
        let index;
        // While there are elements in the array
        while (ctr > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * ctr);
            // Decrease ctr by 1
            ctr--;
            // And swap the last element with it
            temp = arra1[ctr];
            arra1[ctr] = arra1[index];
            arra1[index] = temp;
        }
        return arra1;
    }
    cards.createCards();
}

cards.reset=()=>{
    cards.card1 = null;
    cards.card2 = null;
    $('.card').attr("disabled", false);
}

cards.createCards = () => {
    for (let index in imgBase.imgArr) {
        $('.game').append(`<div class="card" id="${index}" value="${index}"  />`);
        $(`#${index}`).click(function(){
            cards.clickOnCard(this);
            
        })
    }
};

cards.clickOnCard = (cardThatClicked) => {
    if (typeof $(cardThatClicked).attr("disabled") === typeof undefined || $(cardThatClicked).attr("disabled") === false) {
        $(cardThatClicked).attr("disabled", true);
        cards.checkIfTwoFilliped(cardThatClicked);
    }
    else{
        console.log('disabled')
    }
    
}

cards.checkIfTwoFilliped = (cardThatClicked) =>{
    if (cards.card1 == null){
        cards.card1 = cardThatClicked;
        cardThatClicked.style.backgroundImage = `url("${imgBase.imgArr[cardThatClicked.id]}")`;
    }
    else if (cards.card2 == null){
        cards.card2 = cardThatClicked;
        cardThatClicked.style.backgroundImage = `url("${imgBase.imgArr[cardThatClicked.id]}")`;
        cards.checkIfMatch()
    }
}

cards.checkIfMatch =()=>{
    if ($(cards.card1).css('background-image') == $(cards.card2).css('background-image')){
        console.log('giveScore();');
        $(cards.card1).unbind();
        $(cards.card2).unbind();
        cards.reset();
    }
    else{
        setTimeout(() => {
            $(cards.card1).css('background-image' , '');
            $(cards.card2).css('background-image' , '');
            console.log('FillipBack();');
            cards.reset();
        }, 2000);
    }
};



game.start();







