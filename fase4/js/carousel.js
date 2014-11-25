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

    //Object to store default settings for the carousel
    this.CAROUSEL_SETTINGS = {
        amountOfItemsToSlide: 1,
        speed: 5000
    };

    //Initialize the Carousel
    this.init();
};

/*
 * Carousel prototype
 */
Carousel.prototype = {
    init: function () {
        this.setupCarousel();
        this.assignEventHandlers();
    },

    setupCarousel: function () {
        this.createArrayWithShuffledCarouselItems();

        //Add is-active class to the first carousel item
        this.carouselItems[this.currentIndex].classList.add('is-active');
        //console.info("The current index from the constructor: " + this.currentIndex);
    },

    createArrayWithShuffledCarouselItems: function () {
        var i, arrayWithRandomNumbers;
        arrayWithRandomNumbers = new Array(this.totalAmountOfCarouselItems);

        for (i = 0; i < this.totalAmountOfCarouselItems; i++) {
            this.shuffleCarouselItems(i, arrayWithRandomNumbers);
        }
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
    },

    generateRandomNumber: function () {
        return Math.floor(Math.random() * this.totalAmountOfCarouselItems);
    },

    assignEventHandlers: function () {
        this.goToItem = this.goToItem.bind(this);
        this.prevBtn.addEventListener('click', this.goToItem);
        this.nextBtn.addEventListener('click', this.goToItem);
    },

    goToItem: function (e) {
        e.preventDefault();
        if (this.isAnimating) {
            console.warn('Sorry, animation not possible at the moment. Carousel is still animating.');
            return;
        }

        if (e.target.classList.contains('prev-Btn')) {
            if (this.hasNoCarouselItem("left")) {
                this.updateIndex("resetToEnd");
                console.log('Index reset to end');
            } else {
                this.updateIndex("decreaseByOne");
            }
            this.move("left");
            this.isAnimating = true;

        } else if (e.target.classList.contains('next-Btn')) {
            if (this.hasNoCarouselItem("right")) {
                this.updateIndex("resetToBeginning");
                console.log('Index reset to beginning');
            } else {
                this.updateIndex("increaseByOne");
            }
            this.move("right");
            this.isAnimating = true;
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
                this.isAnimating = false;
                break;

            case "right":
                this.carouselItems[this.oldIndex].classList.remove('is-active');
                this.carouselItems[this.currentIndex].classList.add('is-active');
                this.animate('right');
                this.removeAnimationClasses();
                this.isAnimating = false;
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

                self.isAnimating = false;

            } else if (self.carouselItems[self.oldIndex].classList.contains('moveOutRight') || self.carouselItems[self.currentIndex].classList.contains('moveInRight')) {
                self.carouselItems[self.oldIndex].classList.remove('moveOutRight');
                //console.log('Removed the class moveOutRight');

                self.carouselItems[self.currentIndex].classList.remove('moveInRight');
                //console.log('Removed the class moveInRight');

                self.isAnimating = false;

            } else {
                console.warn('No classes have been removed');
            }
        }, this.CAROUSEL_SETTINGS.speed);
    }
};
