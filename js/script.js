'use strict';
$(document).ready(function(){
    game.reset();
    $('.reset-btn').on('click', function(){
        game.reset();
    })
});



let imgBase = {};
let cards = {};
let game = {};
let modal = {};



game.reset=()=>{
    $('.welcome').show();
    $('#theme-buttons button').removeClass('selected');
    $('#level-buttons button').removeClass('selected');
   
    $('.game').empty();
    $('.loader').addClass('show');
    imgBase.imgArr = [];  
     game.getInputsFromUser();
};

game.getInputsFromUser=()=>{
    $('#theme-buttons button').on('click', function(){
        imgBase.numOfImagesToGet = this.value;
        $('#theme-buttons button').removeClass('selected')
        $(this).addClass('selected');
        game.checkIfWeCanStart()
    });
    $('#level-buttons button').on('click', function(){
        //game.numOfImagesToGet = this.value;
        $('#level-buttons button').removeClass('selected')
        $(this).addClass('selected');
        game.checkIfWeCanStart()
    });
}

game.checkIfWeCanStart=()=>{
    if ($('#level-buttons button').hasClass('selected') &&  $('#theme-buttons button').hasClass('selected')){
        let theme = $('#theme-buttons button.selected').val();
        let numOfCards = $('#level-buttons button.selected').val();
        game.start(theme , numOfCards);
        $('.welcome').hide();
    }
};

game.start=(theme,numOfCards)=>{
    $('body').removeClass();
    switch (theme){
        case 'dogs':
            imgBase.imgApi = 'https://dog.ceo/api/breeds/image/random';
            imgBase.keyToGet = 'message'
            $('body').addClass('dogs');
            break;
        case 'cats':
            imgBase.imgApi = 'https://aws.random.cat/meow';
            imgBase.keyToGet = 'file'
            $('body').addClass('cats')
            break;
    }
    
    imgBase.numOfImagesToGet = numOfCards;
    imgBase.buildPicsDataBase();
    cards.reset();
    game.score = 0;
};



imgBase.buildPicsDataBase = async () => {
   let numOfImagesToGet = imgBase.numOfImagesToGet;
   let imgArr;
    $('.loader').addClass('show');
    for (let i = 0; i < numOfImagesToGet; i++) {
        try {
            let getImage = await $.get({
                url: imgBase.imgApi,
                dataType: 'json',
            }).promise()
            imgBase.imgArr.push(getImage[imgBase.keyToGet]);
            imgBase.imgArr.push(getImage[imgBase.keyToGet]);
        }
        catch{
            console.log('error loading images')
        }
    }
    
    
    imgBase.shuffleArray();
    imgBase.loadAllImages();
    $('.loader').removeClass('show');

};

imgBase.loadAllImages =() =>{
    for(let img of imgBase.imgArr){
        $('.img-tank').append(`<img src="${img}" />`)
    }
};

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
    cards.createCards();
};

cards.reset=()=>{
    cards.card1 = null;
    cards.card2 = null;
    $('.memoryCard').attr("disabled", false);
};

cards.createCards = () => {
    
    for (let index in imgBase.imgArr) {
        $('.game').append(`<div class="memoryCard" id="${index}" value="${index}">
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
    
};

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
};

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
};
game.fillipBack = () =>{
    setTimeout(() => {
        $(cards.card1).removeClass('is-flipped');
        $(cards.card2).removeClass('is-flipped');
        cards.reset();
    }, 1000);
};

game.giveScore = ()=>{
    game.score++;
    console.log(game.score);
    if (game.score == imgBase.numOfImagesToGet){
        console.log('win');
    }
    
};








