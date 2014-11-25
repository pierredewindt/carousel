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
    this.carouselItems = document.querySelectorAll('.carousel-item');
    this.totalAmountOfCarouselItems = this.carouselItems.length;
    this.currentIndex = 0;
    this.oldIndex;

    //Object to store default settings fro the carousel
    this.CAROUSEL_SETTINGS = {
        amountOfItemsToSlide: 1
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
    },

    setupCarousel: function () {
        //Add is-active class to the first carousel item
        this.carouselItems[0].classList.add('is-active');
        console.info("The current index from the constructor: " + this.currentIndex);
    },

    assignEventHandlers: function () {
        var self = this;
        this.prevBtn.addEventListener('click', self.goToItem.bind(this));
        this.nextBtn.addEventListener('click', self.goToItem.bind(this));
    },

    goToItem: function (e) {
        e.preventDefault();
        if (e.srcElement.classList.contains('prev-Btn')) {
            if (this.hasNoCarouselItem("left")) {
                this.updateIndex("resetToEnd");
            } else {
                this.updateIndex("decrease");
            }
            this.move("left");
            
        } else if (e.srcElement.classList.contains('next-Btn')) {
            if (this.hasNoCarouselItem("right")) {
                this.updateIndex("resetToBeginning");
            } else {
                this.updateIndex("increase");
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
            case"decrease":
                this.oldIndex = this.currentIndex;
                this.currentIndex--;
                console.info('New current index from the updateIndex function: ' + this.currentIndex);
                break;

            case "increase":
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
     * The oldIndex is the "current index". This needs to get the slide out animation.
     * The currentIndex is the "new" or "next" index. This needs to get the slide in animation.
     */
    animate: function (direction) {
        switch (direction) {
            case "left":
                console.log("Old item sliding out left");
                this.setPosition(this.oldIndex, "left");
                this.carouselItems[this.oldIndex].classList.add('moveOutLeft');
                console.log("Current index sliding in left");
                this.carouselItems[this.currentIndex].classList.add('moveInLeft');
                break;

            case "right":
                console.log("Old index sliding out right");
                this.setPosition(this.oldIndex, "right");
                this.carouselItems[this.oldIndex].classList.add('moveOutRight');
                console.log("Current item sliding in right");
                this.carouselItems[this.currentIndex].classList.add('moveInRight');
                break;
        }
    },

    removeAnimationClasses: function () {
        var self = this;
        setTimeout(function () {
            if (self.carouselItems[self.oldIndex].classList.contains('moveOutLeft') || self.carouselItems[self.currentIndex].classList.contains('moveInLeft')) {
                self.carouselItems[self.oldIndex].classList.remove('moveOutLeft');
                console.log('Removed the class moveOutLeft');

                self.carouselItems[self.currentIndex].classList.remove('moveInLeft');
                console.log('Removed the class moveInLeft');

            } else if (self.carouselItems[self.oldIndex].classList.contains('moveOutRight') || self.carouselItems[self.currentIndex].classList.contains('moveInRight')) {
                self.carouselItems[self.oldIndex].classList.remove('moveOutRight');
                console.log('Removed the class moveOutRight');

                self.carouselItems[self.currentIndex].classList.remove('moveInRight');
                console.log('Removed the class moveInRight');

            } else {
                console.warn('No classes have been removed');
            }
        }, 700);
    },

    setPosition: function (index, direction) {
        if (direction === "left") {
            console.log("Moving left: setting the oldIndex position to left -100%");
            this.carouselItems[index].style.left = "-100%";
        } else if (direction === "right") {
            console.log("Moving right: setting the oldIndex position to left 100%");
            this.carouselItems[index].style.left = "100%";
        }

        //Reset the position of the old index.
        this.resetPosition(index);
    },

    resetPosition: function (index) {
        this.carouselItems[index].style.left = ('0');
        console.info("Position of old index has been reset!!");
    }
};
