var DEBUG = false;

var lastKeysPressed = [];

var didLoad = false;
var didScrollFirstTime = false;

var loaderElement = document.getElementById("loader");

var contentElement = document.getElementById("content");

var initialBackgroundElement = document.getElementById("initial-background");
var initialBackgroundText = document.getElementById("initial-background-title");

var initialArrowDownElement = document.querySelector(".arrow-down");

var initialBackgroundElementHeight = initialBackgroundElement.clientHeight;

var initialBackgroundTextOpacity;
var initialBackgroundElementOpacity;
var initialArrowDownElementOpacity;

function isMobile() {
    if (sessionStorage.desktop)
        return false;
    else if (localStorage.mobile)
        return true;

    var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];
    for (var i in mobile)
        if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

    return false;
}

function getIntroText() {
    var text = "";

    if (initialBackgroundText.innerHTML.length == 0) {
        return null;
    }

    var div = document.querySelector('.typewriter-wrapper');
    if (div == null) {
        return "Hey! It's you again! :)";
    }

    var divChildren = div.childNodes;
    if (divChildren == null) {
        return "Hey! It's you again! :)";
    }

    for (var i = 0; i < divChildren.length; i++) {
        text += divChildren[i].innerHTML;
    }

    return text;
}

function onIntroVisibleAgain() {
    initialBackgroundText.innerHTML = "Hey! It's you again! :)";
    initialBackgroundElement.style.pointerEvents = "none";
}

IntroElements = {
    TEXT: 0,
    BACKGROUND: 1,
    ARROW: 2
};

function getOpacity(element) {
    return 1.0 - (window.scrollY / (initialBackgroundElementHeight -
        ((initialBackgroundElementHeight / (element == IntroElements.TEXT ? 1.4 : element == IntroElements.BACKGROUND ? 2.3 : 1.004)))));
}

if (isMobile()) {
    initialBackgroundElement.style.display = "none";
    document.getElementById("spacer").style.display = "none";

    document.getElementsByClassName("intro-text-wrapper")[0].style.textAlign = "left";
    document.getElementsByClassName("what-i-can-do")[0].style.paddingTop = "32px";
} else {
    var interval = setInterval(function() {
        if (didFinishTyping()) {
            clearInterval(interval);

            FX.fadeIn(initialArrowDownElement, {
                duration: 500,
                complete: function() {}
            });
        }
    }, 50);
}

function didFinishTyping() {
    var introText = getIntroText();

    return DEBUG || (introText != null && (introText == "Hello World!" ||
        introText == "Hey! It's you again! :)"));
}

window.onscroll = function() {
    if ((!didLoad || !didFinishTyping()) && !isMobile()) {
        window.scrollTo(0, 0);

        return;
    }

    initialBackgroundTextOpacity = getOpacity(IntroElements.TEXT);
    initialBackgroundElementOpacity = getOpacity(IntroElements.BACKGROUND);
    initialArrowDownElementOpacity = getOpacity(IntroElements.ARROW);

    initialBackgroundElement.style.opacity = initialBackgroundElementOpacity;
    initialBackgroundText.style.opacity = initialBackgroundTextOpacity;
    initialArrowDownElement.style.opacity = initialArrowDownElementOpacity;

    if (initialBackgroundElementOpacity > 0 && didScrollFirstTime) {
        onIntroVisibleAgain();
    }

    if (initialBackgroundElementOpacity <= 0) {
        didScrollFirstTime = true;

        initialBackgroundElement.style.pointerEvents = "none";
    } else {
        initialBackgroundElement.style.pointerEvents = "all";
    }
};

window.onload = function() {
    // Avoid showing content if the user has not seen
    // the initial background part first
    contentElement.style.visibility = "visible";

    window.scrollTo(0, 0);

    FX.fadeOut(loaderElement, {
        duration: 500,
        complete: function() {
            loaderElement.style.display = "none";

            var typeWriter = new Typewriter(initialBackgroundText, {
                loop: false
            });

            typeWriter.typeString('Hello World!').start();
        }
    });

    didLoad = true;
};

document.onkeydown = function(e) {
    e = e || window.event;

    var keyCode = e.keyCode;
    lastKeysPressed.push(keyCode);

    if (isEasterEgg()) {
    	var win = window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
  		win.focus();
    }
};

function isEasterEgg() {
    if (lastKeysPressed.length < 8) {
        return false;
    }

    var first = lastKeysPressed[lastKeysPressed.length - 1];
    var second = lastKeysPressed[lastKeysPressed.length - 2];
    var third = lastKeysPressed[lastKeysPressed.length - 3];
    var fourth = lastKeysPressed[lastKeysPressed.length - 4];
    var fifth = lastKeysPressed[lastKeysPressed.length - 5];
    var sixth = lastKeysPressed[lastKeysPressed.length - 6];
    var seventh = lastKeysPressed[lastKeysPressed.length - 7];
    var eighth = lastKeysPressed[lastKeysPressed.length - 8];

    return first == 40 && second == 40 &&
        third == 39 && fourth == 39 &&
        fifth == 38 && sixth == 38 &&
        seventh == 37 && eighth == 37;
}

/**
 * Fade Animation
 */
var FX = {
    easing: {
        linear: function(progress) {
            return progress;
        },
        quadratic: function(progress) {
            return Math.pow(progress, 2);
        },
        swing: function(progress) {
            return 0.5 - Math.cos(progress * Math.PI) / 2;
        },
        circ: function(progress) {
            return 1 - Math.sin(Math.acos(progress));
        },
        back: function(progress, x) {
            return Math.pow(progress, 2) * ((x + 1) * progress - x);
        },
        bounce: function(progress) {
            for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                if (progress >= (7 - 4 * a) / 11) {
                    return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                }
            }
        },
        elastic: function(progress, x) {
            return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
        }
    },
    animate: function(options) {
        var start = new Date;
        var id = setInterval(function() {
            var timePassed = new Date - start;
            var progress = timePassed / options.duration;
            if (progress > 1) {
                progress = 1;
            }
            options.progress = progress;
            var delta = options.delta(progress);
            options.step(delta);
            if (progress == 1) {
                clearInterval(id);
                options.complete();
            }
        }, options.delay || 10);
    },
    fadeOut: function(element, options) {
        var to = 1;
        this.animate({
            duration: options.duration,
            delta: function(progress) {
                progress = this.progress;
                return FX.easing.swing(progress);
            },
            complete: options.complete,
            step: function(delta) {
                element.style.opacity = to - delta;
            }
        });
    },
    fadeIn: function(element, options) {
        var to = 0;
        this.animate({
            duration: options.duration,
            delta: function(progress) {
                progress = this.progress;
                return FX.easing.swing(progress);
            },
            complete: options.complete,
            step: function(delta) {
                element.style.opacity = to + delta;
            }
        });
    }
};

/**
 * Smooth Scroll
 */
(function() {

    'use strict';

    // Feature Test
    if ('querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {

        // Function to animate the scroll
        var smoothScroll = function(anchor, duration) {

            // Calculate how far and how fast to scroll
            var startLocation = window.pageYOffset;
            var endLocation = anchor.offsetTop;
            var distance = endLocation - startLocation;
            var increments = distance / (duration / 16);
            var stopAnimation;

            // Scroll the page by an increment, and check if it's time to stop
            var animateScroll = function() {
                window.scrollBy(0, increments);
                stopAnimation();
            };

            // If scrolling down
            if (increments >= 0) {
                // Stop animation when you reach the anchor OR the bottom of the page
                stopAnimation = function() {
                    var travelled = window.pageYOffset;
                    if ((travelled >= (endLocation - increments)) || ((window.innerHeight + travelled) >= document.body.offsetHeight)) {
                        clearInterval(runAnimation);
                    }
                };
            }
            // If scrolling up
            else {
                // Stop animation when you reach the anchor OR the top of the page
                stopAnimation = function() {
                    var travelled = window.pageYOffset;
                    if (travelled <= (endLocation || 0)) {
                        clearInterval(runAnimation);
                    }
                };
            }

            // Loop the animation function
            var runAnimation = setInterval(animateScroll, 16);
        };

        // Define smooth scroll links
        var scrollToggle = document.querySelectorAll('.scroll');

        // For each smooth scroll link
        [].forEach.call(scrollToggle, function(toggle) {

            // When the smooth scroll link is clicked
            toggle.addEventListener('click', function(e) {

                // Prevent the default link behavior
                e.preventDefault();

                // Get anchor link and calculate distance from the top
                var dataID = toggle.getAttribute('href');
                var dataTarget = document.querySelector(dataID);
                var dataSpeed = toggle.getAttribute('data-speed');

                // If the anchor exists
                if (dataTarget) {
                    // Scroll to the anchor
                    smoothScroll(dataTarget, dataSpeed || 500);
                }

            }, false);
        });
    }
})();