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
    this.firstItem = null;
    this.currentItem = null;
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
        this.hideOrShowNavigation();
        this.loopThroughCarouselItems();
        this.assignEventHandlers();
    },

    loopThroughCarouselItems: function () {
        //Loop through all the items on the page
        for (var i = 0; i < this.carouselItems.length; i++) {
            if (i === 0) {
                this.firstItem = this.carouselItems[i];
                this.currentItem = this.firstItem;
                this.currentIndex = i;

                //Add is-active class to the first carousel item
                this.carouselItems[i].classList.add('is-active');
            }
        }
    },

    assignEventHandlers: function () {
        var self = this;
        this.nextBtn.addEventListener('click', self.goToNextItem.bind(this));
        this.prevBtn.addEventListener('click', self.goToPreviousItem.bind(this));
    },

    goToPreviousItem: function () {
        if (this.hasPreviousCarouselItem()) {
            //Remove active class from previous element
            this.carouselItems[this.oldIndex].classList.remove('is-active');
            console.log('New current index from the goToThePreviousItem function: ' + this.currentIndex);
            //Add active class to current element
            this.carouselItems[this.currentIndex].classList.add('is-active');
        }
    },

    goToNextItem: function () {
        var self = this;
        if (this.hasNextCarouselItem()) {
            //Remove active class from previous element
            this.carouselItems[this.oldIndex].classList.remove('is-active');
            console.log('New current index from the goToTheNextItem function: ' + this.currentIndex);
            //Add active class to current element
            this.carouselItems[this.currentIndex].classList.add('is-active');
        }
    },

    hideOrShowNavigation: function () {
        console.log('function called');
        if (this.currentIndex >= this.totalAmountOfCarouselItems - 1) {
            //No, you can't proceed and navigation (next button) has to be hidden
            console.log('next button disabled');
            this.disableNavigationButton(this.nextBtn);

        } else if (this.currentIndex === 0) {
            //No, you can't proceed and navigation (previous button) has be hidden
            console.log('previous button disabled');
            this.disableNavigationButton(this.prevBtn);
        } else {
            //Yes, you can proceed and navigation (next button & previous) has to be shown
            console.log('next button enabled');
            this.enableNavigationButton(this.nextBtn);
            this.enableNavigationButton(this.prevBtn);
        }
    },

    disableNavigationButton: function (element) {
        element.classList.add('hidden');
    },

    enableNavigationButton: function (element) {
        element.classList.remove('hidden');
    },

    hasNextCarouselItem: function () {
        this.oldIndex = this.currentIndex;
        console.log('Current index from the hasNextCarouselItem function: ' + this.currentIndex);

        if (this.currentIndex + this.CAROUSEL_SETTINGS.amountOfItemsToSlide < this.totalAmountOfCarouselItems) {
            this.currentIndex++;
            this.hideOrShowNavigation();
            return true;
        } else {
            return false;
        }
    },

    hasPreviousCarouselItem: function () {
        console.log('Current index from the hasPreviousCarouselItem function: ' + this.currentIndex);
        this.oldIndex = this.currentIndex;

        if (this.currentIndex - this.CAROUSEL_SETTINGS.amountOfItemsToSlide >= 0) {
            this.currentIndex--;
            this.hideOrShowNavigation();
            return true;
        } else {
            return false;
        }
    }
};
