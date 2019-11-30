# as5-memory-game
itc assignment no5 documentation:

This app is a memory game with two themes and 3 levels of game: hard = 24 cards, medium = 18 cards, and easy = 12 cards.
Every player start the game with 100 points and each wrong guess they make, loses 5 point.
In the beginning of the game, the user asked to enter his/hers name and choose theme and level to play.
In the end of the game the user gets his/hers score and a table with the highest score from other users that players in the same computer (localstorage).

Under the hood:

js:
--> objects: for namespaces:
    let imgBase = {};
    let cards = {};
    let game = {};
    let modal = {};
--> functions: most of the function does exactly what there name says they does.
    game.reset
    game.getInputsFromUser
    game.checkIfWeCanStart
    game.start
    imgBase.buildPicsDataBase
    imgBase.loadAllImages
    imgBase.shuffleArray
    cards.reset
    cards.createCards
    cards.clickOnCard
    cards.flipCard
    cards.checkIfMatch
    cards.match
    cards.fillipBack
    game.giveScore
    game.finish
    game.saveToLocalStorage
    game.showScoreTable

html: 
    Most of the app is built in the html, only the cards are made in the js.
    
css:
    Use scss to compile css.
