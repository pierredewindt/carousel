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
    this.wrapper = document.querySelector('.carousel-container');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.playBtn = document.querySelector('.play-btn');
    this.notShuffledcarouselItems = document.querySelectorAll('.carousel-item');
    this.totalAmountOfCarouselItems = this.notShuffledcarouselItems.length;
    this.currentIndex = this.generateRandomNumber();
    this.carouselItems = new Array();
    this.isAnimating = false;
    this.oldIndex;


    //Object to store default settings for the carousel
    this.CAROUSEL_SETTINGS = {
        amountOfItemsToSlide: 1,
        animationSpeed: 400,
        intervalSpeed: 4000,
        intervalTimer: 0
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
        while (randomNumbersArray[newRandomNumber]);
        randomNumbersArray[newRandomNumber] = true;
        this.carouselItems[newRandomNumber] = this.notShuffledcarouselItems[index];
    },

    generateRandomNumber: function () {
        return Math.floor(Math.random() * this.totalAmountOfCarouselItems);
    },

    assignEventHandlers: function () {
        //Left and right button navigation
        this.prevBtn.addEventListener('click', function (e) {
            //Prevent default only for click event.
            if (e.type !== "keydown") {
                e.preventDefault();
            }
            this.goToItem('left')
        }.bind(this));

        this.nextBtn.addEventListener('click', function (e) {
            //Prevent default only for click event.
            if (e.type !== "keydown") {
                e.preventDefault();
            }
            this.goToItem('right')
        }.bind(this));

        //Keyboard navigation
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        window.addEventListener('keydown', this.handleKeyboardNavigation);

        //Autoplay click/toggle navigation
        this.playBtn.addEventListener('click', function (e) {
            //Prevent default only for click event.
            if (e.type !== "keydown") {
                e.preventDefault();
            }
            this.toggleAutoplay();
        }.bind(this));
    },

    autoplayStatus: function (action) {
        switch (action) {
            case 'toggle':
                var autoplayDataAttributeStatus = this.wrapper.getAttribute('data-autoplay-status');
                this.wrapper.setAttribute('data-autoplay-status', autoplayDataAttributeStatus === 'true' ? 'false' : 'true');
                console.log('Data autoplay status: ' + this.wrapper.getAttribute('data-autoplay-status'));
                break;

            case 'start':
                this.wrapper.setAttribute('data-autoplay-status', 'true');
                console.log('Data autoplay status: ' + this.wrapper.getAttribute('data-autoplay-status'));
                break;

            case 'stop':
                this.wrapper.setAttribute('data-autoplay-status', 'false');
                console.log('Data autoplay status: ' + this.wrapper.getAttribute('data-autoplay-status'));
                break;
        }
    },

    handleKeyboardNavigation: function (e) {
        console.log(e);
        switch (e.keyCode) {
            case 38:
                this.startAutoPlay();
                break;

            case 40:
                this.stopAutoPlay();
                break;

            case 37:
                this.goToItem('left');
                break;

            case 39:
                this.goToItem('right');
                break;

            default:
                //DO nothing
                break;
        }
    },

    startAutoPlay: function () {
        var self = this;
        this.autoplayStatus('start');
        this.CAROUSEL_SETTINGS.intervalTimer = setInterval(function () {
            self.goToItem('right');
        }, self.CAROUSEL_SETTINGS.intervalSpeed);
    },

    stopAutoPlay: function () {
        var self = this;
        this.autoplayStatus('stop');
        clearInterval(self.CAROUSEL_SETTINGS.intervalTimer);
    },

    toggleAutoplay: function () {
        this.autoplayStatus('toggle');
        var autoplayDataAttributeStatus = this.wrapper.getAttribute('data-autoplay-status');
        autoplayDataAttributeStatus === 'true' ? this.startAutoPlay() : this.stopAutoPlay();
    },

    goToItem: function (direction) {
        if (this.isAnimating) {
            console.warn('Sorry, animation not possible at the moment. Carousel is still animating.');
            return;
        }

        if (direction === 'left') {
            if (this.hasNoCarouselItem("left")) {
                this.updateIndex("resetToEnd");
                console.log('Index reset to end');
            } else {
                this.updateIndex("decreaseByOne");
            }
            this.move("left");
            this.isAnimating = true;

        } else if (direction === 'right') {
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
                this.carouselItems[this.oldIndex].classList.add('moveOutLeft');
                this.carouselItems[this.currentIndex].classList.add('moveInLeft');
                break;

            case "right":
                this.carouselItems[this.oldIndex].classList.add('moveOutRight');
                this.carouselItems[this.currentIndex].classList.add('moveInRight');
                break;
        }
    },

    removeAnimationClasses: function () {
        var self = this;
        setTimeout(function () {
            if (self.carouselItems[self.oldIndex].classList.contains('moveOutLeft') || self.carouselItems[self.currentIndex].classList.contains('moveInLeft')) {
                self.carouselItems[self.oldIndex].classList.remove('moveOutLeft');
                self.carouselItems[self.currentIndex].classList.remove('moveInLeft');
                self.isAnimating = false;

            } else if (self.carouselItems[self.oldIndex].classList.contains('moveOutRight') || self.carouselItems[self.currentIndex].classList.contains('moveInRight')) {
                self.carouselItems[self.oldIndex].classList.remove('moveOutRight');
                self.carouselItems[self.currentIndex].classList.remove('moveInRight');
                self.isAnimating = false;

            } else {
                console.warn('No classes have been removed');
            }
        }, this.CAROUSEL_SETTINGS.animationSpeed);
    }
};