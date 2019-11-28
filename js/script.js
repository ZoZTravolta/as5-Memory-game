const imgBase = {};
const cards = {};
const game = {};

imgBase.imgApi = 'https://dog.ceo/api/breeds/image/random';
imgBase.numOfImagesToGet = 9;
imgBase.imgArr = [];
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
    cards.shuffleArray();
    $('.loader').removeClass('show');

}
cards.shuffleArray = () => {
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
    console.log(shuffle(imgBase.imgArr));
    cards.createCards();
}

cards.createCards = () => {
    for (index in imgBase.imgArr) {
        $('.game').append(`<div class="card" id="${index}" value="${index}"  />`);
        $(`#${index}`).on('click', function(){
            cards.clickOnCard(this);
            
        })
    }
};

cards.clickOnCard = (me) => {
    me.style.backgroundImage = `url("${imgBase.imgArr[me.id]}")`;
    cards.checkIfTwoFilliped()
}


cards.checkIfTwoFilliped = () =>{
    
}





imgBase.buildPicsDataBase();






