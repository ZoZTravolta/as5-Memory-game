'use strict';
$(document).ready(function(){
    game.reset();
    $('.reset-btn').on('click', function(){
        $('#level-buttons button').unbind();
        $('#theme-buttons button').unbind();
        game.reset();

    })
});


let imgBase = {};
let cards = {};
let game = {};
let modal = {};

game.reset=()=>{
    $('.welcome').show();
    $('.win').hide();
    $('#theme-buttons button').removeClass('selected');
    $('#level-buttons button').removeClass('selected');
    $('.game').empty();
    $('.loader').addClass('show');
    imgBase.imgArr = [];
    game.score = 0;
    game.guesses = 0;
    game.finalScore = 100;
    $('.guesses').text(game.guesses);
    $('.score').text(game.score);
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
    game.currentUser = $('#user-name').val();
    if (game.currentUser == ''){
        $('#user-name').css('border', '2px solid red');
    }
    else{
        $('.name').text(game.currentUser + ',');
        if ($('#level-buttons button').hasClass('selected') &&  $('#theme-buttons button').hasClass('selected') && game.currentUser != ''){
            let theme = $('#theme-buttons button.selected').val();
            let numOfCards = $('#level-buttons button.selected').val();
            game.level = $('#level-buttons button.selected').attr('id');
            game.start(theme , numOfCards);
            $('.welcome').fadeOut();
        }
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
};

imgBase.buildPicsDataBase = async () => {
   let numOfImagesToGet = imgBase.numOfImagesToGet;
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
        game.score++;
        cards.match();
    }
    else{
        game.guesses ++
        $('.guesses').text(game.guesses)
        cards.fillipBack();
    }
};

cards.match=()=>{
    $(cards.card1).unbind();
    $(cards.card2).unbind();
    cards.reset();
    game.giveScore();
};

cards.fillipBack = () =>{
    setTimeout(() => {
        $(cards.card1).removeClass('is-flipped');
        $(cards.card2).removeClass('is-flipped');
        cards.reset();
    }, 1000);
};

game.giveScore = ()=>{
    $('.score').text(game.score)
    if (game.score == imgBase.numOfImagesToGet){
        game.finish();
    }
};

game.finish = () =>{
    game.finalScore = game.finalScore - (game.guesses *5);
    if (game.finalScore <= 0){
        $('.final-score').text('0');
        $('.final-score').css('color', 'red');
    }
    else{
        $('.final-score').text(game.finalScore);
        $('.final-score').css('color', 'green');
    }
    game.saveToLocalStorage();
    $('.win').fadeIn();
}

game.saveToLocalStorage =()=>{
    let currentLevel;
    let usersScoreEasy;
    let usersScoreMedium;
    let usersScoreHard;
    const usersScoreLevels = [usersScoreEasy, usersScoreMedium, usersScoreHard];
    switch(game.level){
        case 'easy':
            currentLevel = 0
            break;
        case 'medium':
            currentLevel = 1
            break;
        case 'hard':
            currentLevel = 2
            break;
    }
    usersScoreLevels[currentLevel] = JSON.parse(localStorage.getItem(game.level)) || [];
    const currentUser = {
        name: game.currentUser,
        score: game.finalScore,
        level: game.level,
    };
    usersScoreLevels[currentLevel].push(currentUser);
    localStorage.setItem(game.level, JSON.stringify(usersScoreLevels[currentLevel]));
    let nowStorage = JSON.parse(localStorage.getItem(game.level)) || [];
    game.showScoreTable(nowStorage);
};

game.showScoreTable=(nowStorage)=>{
    nowStorage.sort((a, b) => parseInt(b.score) - parseInt(a.score) );
    for (let i in nowStorage){
        $('#highScore-table').append(`<tr><td>${nowStorage[i].name}</td><td>${nowStorage[i].score}</td></tr>`)
    }
};





