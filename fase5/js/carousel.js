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
    this.notShuffledCarouselItems = document.querySelectorAll('.carousel-item');
    this.olCarouselItems = document.querySelector('.carousel-items');
    this.totalAmountOfCarouselItems = this.notShuffledCarouselItems.length;
    this.carouselIndicators = document.getElementById('carousel-indicators');
    this.currentIndex = this.generateRandomNumber();
    this.shuffledCarouselItems = [];
    this.isAnimating = false;
    this.oldIndex;

    //Object to store default settings for the carousel
    this.CAROUSEL_SETTINGS = {
        amountOfItemsToSlide: 1,
        animationSpeed: 400,
        intervalSpeed: 10000,
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
        this.removeNotShuffledCarouselItemsFromDOM(); //Remove old un-shuffled items from the DOM
        this.createArrayWithShuffledCarouselItems();  //Create a new carousel items array with shuffled carousel items
        this.shuffledCarouselItems[this.currentIndex].classList.add('is-active'); //Add is-active class to the current carousel item
        this.carouselIndicators.children[this.currentIndex].classList.add('is-active'); //Add is-active class to the current carousel indicator
    },

    /*
     * Generates a random number.
     */
    generateRandomNumber: function () {
        return Math.floor(Math.random() * this.totalAmountOfCarouselItems);
    },

    /*
     * Removes all the li's from the carousel-items ol.
     */
    removeNotShuffledCarouselItemsFromDOM: function () {
        while (this.olCarouselItems.firstChild) {
            this.olCarouselItems.removeChild(this.olCarouselItems.firstChild);
        }
    },

    /*
     * Creates a new array with shuffled carousel items.
     */
    createArrayWithShuffledCarouselItems: function () {
        var i, arrayWithRandomNumbers;
        arrayWithRandomNumbers = new Array(this.totalAmountOfCarouselItems); //Create an array to store the used generated random numbers

        //Shuffle each carousel item in the current DOM
        for (i = 0; i < this.totalAmountOfCarouselItems; i++) {
            this.shuffleCarouselItems(i, arrayWithRandomNumbers);
        }
    },

    /*
     * Shuffles the carousel items and adds them to a new array.
     *
     * @param index from the for loop
     * @param array to keep track of the used random numbers
     */
    shuffleCarouselItems: function (index, randomNumbersArray) {
        var newRandomNumber;

        do {
            newRandomNumber = this.generateRandomNumber(); //Generate a unique random number
        }
        while (randomNumbersArray[newRandomNumber]); //While the unique number is used
        randomNumbersArray[newRandomNumber] = true; //Flag the number when it's used so that it can't be used again

        this.shuffledCarouselItems[index] = this.notShuffledCarouselItems[newRandomNumber];
        this.shuffledCarouselItems[index].setAttribute('id', index);  //The id of each carousel item also have to be re-index so use index instead of a random number

        this.generateDynamicCarouselIndicators(index); //Generate the carousel indicators for each index
        this.olCarouselItems.appendChild(this.shuffledCarouselItems[index]);  //Append shuffled items to ol
        console.log('New list with ID: ' + index + ' added');
    },

    /*
     * Generate dynamic carousel indicators.
     *
     * @param random number that's unique
     */
    generateDynamicCarouselIndicators: function (randomNumber) {
        var listElement, anchor, listItemValue;

        listElement = document.createElement('li'); //Create a list element
        anchor = document.createElement('a'); //Create an anchor element
        listItemValue = document.createTextNode(randomNumber); //create a textNode with random number as value to be appended to anchor element
        anchor.appendChild(listItemValue); //Append textNode to anchor element
        anchor.setAttribute('href', randomNumber);  //Set href attribute to anchor with random number as value
        listElement.appendChild(anchor); //Append anchor element to list element
        this.carouselIndicators.appendChild(listElement); //Append list element to ol
    },

    /*
     * Assign the event handlers.
     */
    assignEventHandlers: function () {
        //Left button navigation
        this.prevBtn.addEventListener('click', function (e) {
            //Prevent default only for click event.
            if (e.type !== "keydown") {
                e.preventDefault();
            }
            this.goToItem('left');

            //Check if autoplay is on. If autoplay is on, reset timer.
            if (this.wrapper.getAttribute('data-autoplay-status') === 'true') {
                this.resetAutoplayTimer();
            }
        }.bind(this));

        //Right button navigation
        this.nextBtn.addEventListener('click', function (e) {
            //Prevent default only for click event.
            //Hoe it het weer met prevent default voor keydown???
            if (e.type !== "keydown") {
                e.preventDefault();
            }
            this.goToItem('right');

            //Check if autoplay is on. If autoplay is on, reset timer.
            if (this.wrapper.getAttribute('data-autoplay-status') === 'true') {
                this.resetAutoplayTimer();
            }
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

        //Carousel indicators navigation
        this.carouselIndicators.addEventListener('click', function (e) {
            e.preventDefault();
            this.goToIndex(e);

            //Check if autoplay is on. If autoplay is on, reset timer.
            if (this.wrapper.getAttribute('data-autoplay-status') === 'true') {
                this.resetAutoplayTimer();
            }
        }.bind(this));
    },

    handleKeyboardNavigation: function (e) {
        console.log(e);
        switch (e.keyCode) {
            case 38: //Up arrow key
                this.startAutoPlay();
                break;

            case 40: //Down arrow key
                this.stopAutoPlay();
                break;

            case 37: //Left arrow key
                this.goToItem('left');
                break;

            case 39: //Right arrow key
                this.goToItem('right');
                break;

            default:
                //Do nothing
                break;
        }
    },

    /*
     * Get the index of the clicked li.
     *
     * @param event to determine which li is clicked
     */
    getClickedListItemIndex: function (e) {
        var clickedIndex = 0; //Initialize the clickedIndex
        var listElement = e.target.parentNode; //Get the clicked li

        //
        while (listElement.previousElementSibling) {
            listElement = listElement.previousElementSibling;
            clickedIndex += 1;
        }
        console.log('Clicked index = ' + clickedIndex);
        return clickedIndex;
    },

    /*
     * Start autoplay.
     */
    startAutoPlay: function () {
        var self = this;
        this.wrapper.setAttribute('data-autoplay-status', 'true'); //Set data attribute to true
        this.CAROUSEL_SETTINGS.intervalTimer = setInterval(function () {
            self.goToItem('right');
        }, self.CAROUSEL_SETTINGS.intervalSpeed);
    },

    /*
     * Stop autoplay.
     */
    stopAutoPlay: function () {
        var self = this;
        this.wrapper.setAttribute('data-autoplay-status', 'false'); //Set data attribute to false
        window.clearInterval(self.CAROUSEL_SETTINGS.intervalTimer); //Clear interval
    },

    /*
     * Toggle autoplay.
     */
    toggleAutoplay: function () {
        var autoplayDataAttributeStatus = this.wrapper.getAttribute('data-autoplay-status'); //Get the autoplay data attribute value

        //If autoplay status is true, set autoplay status to false
        if (autoplayDataAttributeStatus === 'true') {
            this.wrapper.setAttribute('data-autoplay-status', 'false');
            this.stopAutoPlay();

            //If autoplay status is set to false, set autoplay status to true
        } else {
            this.wrapper.setAttribute('data-autoplay-status', 'true');
            this.startAutoPlay()
        }
    },

    /*
     * Reset autplay
     */
    resetAutoplayTimer: function () {
        this.stopAutoPlay();
        this.startAutoPlay();
    },

    /*
     * Go to item with a specific index.
     *
     * @param event to determine the index of clicked li
     */
    goToIndex: function (e) {
        if (this.isAnimating) {
            console.warn('Sorry, animation not possible at the moment. Carousel is still animating.');
            return;
        }

        var clickedIndex = this.getClickedListItemIndex(e);
        this.oldIndex = this.currentIndex;
        this.currentIndex = clickedIndex;

        if (clickedIndex > this.oldIndex) {
            console.log('You clicked right of the current index');
            this.move('right');
            this.isAnimating = true;

        } else if (clickedIndex < this.oldIndex) {
            console.log('You clicked left of the current index');
            this.move('left');
            this.isAnimating = true;

        } else {
            console.log('You clicked on the same bullet');
            //Do nothing
        }
    },

    /*
     * Go to an item in a specific direction.
     *
     * @param directioncan be either left or right
     */
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

    /*
     *
     */
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

    /*
     *
     */
    move: function (direction) {
        switch (direction) {
            case "left":
                this.shuffledCarouselItems[this.oldIndex].classList.remove('is-active');
                this.shuffledCarouselItems[this.currentIndex].classList.add('is-active');
                this.updateCarouselIndicators();
                this.animate('left');
                this.removeAnimationClasses();
                this.isAnimating = false;
                break;

            case "right":
                this.shuffledCarouselItems[this.oldIndex].classList.remove('is-active');
                this.shuffledCarouselItems[this.currentIndex].classList.add('is-active');
                this.updateCarouselIndicators();
                this.animate('right');
                this.removeAnimationClasses();
                this.isAnimating = false;
                break;
        }
    },

    /*
     * Update the status carousel indicators.
     *
     * States: is-active
     */
    updateCarouselIndicators: function () {
        this.carouselIndicators.children[this.oldIndex].classList.remove('is-active');
        this.carouselIndicators.children[this.currentIndex].classList.add('is-active');
    },

    /*
     * Update the Index of the carousel.
     */
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

    /*
     * Adds th appropriate classes for the css animation.
     */
    animate: function (direction) {
        switch (direction) {
            case "left":
                this.shuffledCarouselItems[this.oldIndex].classList.add('moveOutLeft');
                this.shuffledCarouselItems[this.currentIndex].classList.add('moveInLeft');
                break;

            case "right":
                this.shuffledCarouselItems[this.oldIndex].classList.add('moveOutRight');
                this.shuffledCarouselItems[this.currentIndex].classList.add('moveInRight');
                break;
        }
    },

    /*
     * Removes the animation classes.
     */
    removeAnimationClasses: function () {
        var self = this;
        setTimeout(function () {
            if (self.shuffledCarouselItems[self.oldIndex].classList.contains('moveOutLeft') || self.shuffledCarouselItems[self.currentIndex].classList.contains('moveInLeft')) {
                self.shuffledCarouselItems[self.oldIndex].classList.remove('moveOutLeft');
                self.shuffledCarouselItems[self.currentIndex].classList.remove('moveInLeft');
                self.isAnimating = false;

            } else if (self.shuffledCarouselItems[self.oldIndex].classList.contains('moveOutRight') || self.shuffledCarouselItems[self.currentIndex].classList.contains('moveInRight')) {
                self.shuffledCarouselItems[self.oldIndex].classList.remove('moveOutRight');
                self.shuffledCarouselItems[self.currentIndex].classList.remove('moveInRight');
                self.isAnimating = false;

            } else {
                console.warn('No classes have been removed');
            }
        }, this.CAROUSEL_SETTINGS.animationSpeed);
    }
};