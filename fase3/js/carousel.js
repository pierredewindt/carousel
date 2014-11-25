window.onload = init;

/*
 * Create and initialize the carousel
 */
function init() {
    new Carousel();
}

/*
 * Carousel constructor
 */
function Carousel() {
    this.prevBtn = document.querySelector('.prev-Btn');
    this.nextBtn = document.querySelector('.next-Btn');
    this.notShuffledcarouselItems = document.querySelectorAll('.carousel-item');
    this.totalAmountOfCarouselItems = this.notShuffledcarouselItems.length;
    this.carouselItems = new Array();
    this.currentIndex = this.generateRandomNumber();
    this.oldIndex;
    this.isAnimating = false;

    //Object to store default settings fro the carousel
    this.CAROUSEL_SETTINGS = {
        amountOfItemsToSlide: 1,
        speed: 300
    };

    //Initialize the Carousel
    this.init();
};

/*
 *Carousel prototype
 */
Carousel.prototype = {
    init: function () {
        this.setupCarousel();
        this.assignEventHandlers();
        this.assignAnimationEventHandlers();
    },

    setupCarousel: function () {
        this.createArrayWithShuffledCarouselItems();

        //Add is-active class to the first carousel item
        this.carouselItems[this.currentIndex].classList.add('is-active');
        console.info("The current index from the constructor: " + this.currentIndex);
    },

    createArrayWithShuffledCarouselItems: function () {
        var i, arrayWithRandomNumbers;
        arrayWithRandomNumbers = new Array(this.totalAmountOfCarouselItems);

        for (i = 0; i < this.totalAmountOfCarouselItems; i++) {
            this.shuffleCarouselItems(i, arrayWithRandomNumbers);
        }
        //console.info('Carousel items have been reshuffled');
    },

    shuffleCarouselItems: function (index, randomNumbersArray) {
        var newRandomNumber;

        do {
            newRandomNumber = this.generateRandomNumber();
        }
            //While the new Number hasn't been used yet
        while (randomNumbersArray[newRandomNumber]);
        randomNumbersArray[newRandomNumber] = true;
        this.carouselItems[newRandomNumber] = this.notShuffledcarouselItems[index];
        console.log(newRandomNumber);
    },

    generateRandomNumber: function () {
        return Math.floor(Math.random() * this.totalAmountOfCarouselItems);
    },

    assignEventHandlers: function () {
        console.info('Navigation event handlers have been assigned');
        this.goToItem = this.goToItem.bind(this);
        this.prevBtn.addEventListener('click', this.goToItem);
        this.nextBtn.addEventListener('click', this.goToItem);
    },

    disableNavigationButtons: function () {
        console.warn('Hey, the navigation buttons have been disabled.');
        this.prevBtn.removeEventListener('click', this.goToItem);
        this.nextBtn.removeEventListener('click', this.goToItem);
    },

    assignAnimationEventHandlers: function () {
        var self = this;
        console.info('Animation event handlers have been assigned');
        this.carouselItems[this.currentIndex].addEventListener('webkitAnimationStart', self.handleAnimationListener.bind(this));
        this.carouselItems[this.currentIndex].addEventListener('webkitAnimationEnd', self.handleAnimationListener.bind(this));

        this.carouselItems[this.currentIndex].addEventListener('webkitAnimationStart', function () {
            this.isAnimating = true
        }.bind(this));
        this.carouselItems[this.currentIndex].addEventListener('webkitAnimationEnd', function () {
            this.isAnimating = false
        }.bind(this));


    },

    goToItem: function (e) {
        e.preventDefault();
        if (this.isAnimating) {
            return;
        }

        if (e.srcElement.classList.contains('prev-Btn')) {
            //alert('left was clicked');
            if (this.hasNoCarouselItem("left")) {
                this.updateIndex("resetToEnd");
                console.log('Index reset to end');
            } else {
                this.updateIndex("decreaseByOne");
            }
            this.move("left");

        } else if (e.srcElement.classList.contains('next-Btn')) {
           //alert('right was clicked');
            if (this.hasNoCarouselItem("right")) {
                this.updateIndex("resetToBeginning");
                console.log('Index reset to beginning');
            } else {
                this.updateIndex("increaseByOne");
            }
            this.move("right");
        }
    },

    hasNoCarouselItem: function (direction) {
        switch (direction) {
            case "left":
                if (this.currentIndex === 0) {
                    return true;
                }
                break;

            case "right":
                if (this.currentIndex >= this.totalAmountOfCarouselItems - this.CAROUSEL_SETTINGS.amountOfItemsToSlide) {
                    return true;
                }
                break;

            default:
                return false;
                break;
        }
    },

    move: function (direction) {
        switch (direction) {
            case "left":
                this.carouselItems[this.oldIndex].classList.remove('is-active');
                this.carouselItems[this.currentIndex].classList.add('is-active');
                this.animate('left');
                this.removeAnimationClasses();
                break;

            case "right":
                this.carouselItems[this.oldIndex].classList.remove('is-active');
                this.carouselItems[this.currentIndex].classList.add('is-active');
                this.animate('right');
                this.removeAnimationClasses();
                break;
        }
    },

    updateIndex: function (value) {
        switch (value) {
            case"decreaseByOne":
                this.oldIndex = this.currentIndex;
                this.currentIndex--;
                console.info('New current index from the updateIndex function: ' + this.currentIndex);
                break;

            case "increaseByOne":
                this.oldIndex = this.currentIndex;
                this.currentIndex++;
                console.info('New current index from the updateIndex function: ' + this.currentIndex);
                break;

            case "resetToBeginning":
                this.oldIndex = this.currentIndex;
                this.currentIndex = 0;
                console.info('New current index from the updateIndex function: ' + this.currentIndex);
                break;

            case "resetToEnd":
                this.oldIndex = this.currentIndex;
                this.currentIndex = this.totalAmountOfCarouselItems - 1;
                console.info('New current index from the updateIndex function: ' + this.currentIndex);
                break;
        }
    },

    animate: function (direction) {
        switch (direction) {
            case "left":
                //console.log("Old item sliding out left");
                this.carouselItems[this.oldIndex].classList.add('moveOutLeft');
                //console.log("Current index sliding in left");
                this.carouselItems[this.currentIndex].classList.add('moveInLeft');
                break;

            case "right":
                //console.log("Old index sliding out right");
                this.carouselItems[this.oldIndex].classList.add('moveOutRight');
                //console.log("Current item sliding in right");
                this.carouselItems[this.currentIndex].classList.add('moveInRight');
                break;
        }
    },

    removeAnimationClasses: function () {
        var self = this;
        setTimeout(function () {
            if (self.carouselItems[self.oldIndex].classList.contains('moveOutLeft') || self.carouselItems[self.currentIndex].classList.contains('moveInLeft')) {
                self.carouselItems[self.oldIndex].classList.remove('moveOutLeft');
                //console.log('Removed the class moveOutLeft');

                self.carouselItems[self.currentIndex].classList.remove('moveInLeft');
                //console.log('Removed the class moveInLeft');

            } else if (self.carouselItems[self.oldIndex].classList.contains('moveOutRight') || self.carouselItems[self.currentIndex].classList.contains('moveInRight')) {
                self.carouselItems[self.oldIndex].classList.remove('moveOutRight');
                //console.log('Removed the class moveOutRight');

                self.carouselItems[self.currentIndex].classList.remove('moveInRight');
                //console.log('Removed the class moveInRight');

            } else {
                //console.warn('No classes have been removed');
            }
        }, this.CAROUSEL_SETTINGS.speed);
    },

    handleAnimationListener: function (e) {
        //In het object staat de type met lowercase
        //Als de type log, krijg ik camelcasing terug...hhmm..dafok!
        console.log('Event type is: ' + e.type);
        console.log(e);
        switch (e.type) {
            /*case "webkitAnimationStart":*/
            case "animationstart":
                console.info("Animation started: elapsed time is " + e.elapsedTime);
                this.disableNavigationButtons();
                break;

            //case "animationend":
            case "webkitAnimationEnd":
                console.info("Animation ended: elapsed time is " + e.elapsedTime);
                this.assignEventHandlers();
                break;
        }
    }
};
