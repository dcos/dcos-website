require('es6-promise').polyfill()
require('./blog.js')
require('./case-study-carousel.js')
require('./docs.js')
require('./events-carousel.js')
require('./fetch.js')
require('./get-started.js')
require('./install.js')
require('./modal.js')
require('./overlay.js')
require('./quotes-carousel.js')
require('./smooth-scroll.js')
require('./stackdiagram.js')
require('./typer.js')

import Wallop from 'wallop';
import Hammer from 'hammerjs';

const compareVersions = require('compare-versions');
window.compareVersions = compareVersions;

// Mobile menu
$('#nav-icon').on('click', function (e) {
  e.preventDefault();
  if($('#nav-icon').hasClass('open')) {
    $('.navigation').removeClass('mobile-menu--open');
    $('.menu-mobile').removeClass('open');
    $('#nav-icon').removeClass('open');
    $('body').removeAttr('style');
    $('html').removeAttr('style');
  } else {
    $('.navigation').addClass('mobile-menu--open');
    $('.menu-mobile').addClass('open');
    $('#nav-icon').addClass('open');
    $('body').attr('style', 'overflow: hidden;');
    $('html').attr('style', 'overflow: hidden;');
  }
})

// Array.find polyfill
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

/***********************
  Dropdown
***********************/
$('.dropdown').click(function(){
  $('html').one('click',function() {
    $('.dropdown').removeClass('is-active')
  });

  $(this).toggleClass('is-active')

  event.stopPropagation()
})

/***********************
  Set timeout function
***********************/
function Timer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function() {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = function() {
    start = new Date();
    window.clearTimeout(timerId);
    timerId = window.setTimeout(callback, remaining);
  };

  this.cancel = function() {
    window.clearTimeout(timerId);
  };

  this.resume();
}

/****************
  Slider
****************/
var wallopEl = document.querySelector('.Wallop');
var slider = new Wallop(wallopEl);

// Add auto-play functionality
var autoPlayMs = 6000;
var nextTimeout;
var loadNext = function() {
  var nextIndex = (slider.currentItemIndex + 1) % slider.allItemsArray.length;
  slider.goTo(nextIndex);
}
nextTimeout = new Timer(function() { loadNext(); }, autoPlayMs);
slider.on('change', function() {
  nextTimeout.resume();
});

slider.on('mouseenter', function(){
  nextTimeout.cancel();
})

slider.on('mouseleave', function(){
  nextTimeout.resume();
})

// Enable touch for Wallop
Hammer(wallopEl, {
  inputClass: Hammer.TouchInput
}).on('swipeleft', function() {
  slider.next();
});

Hammer(wallopEl, {
  inputClass: Hammer.TouchInput
}).on('swiperight', function() {
  slider.previous();
});
