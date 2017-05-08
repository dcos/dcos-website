(function () {
  let currentIndex = 0;
  let carousel = $('.events-carousel .card-container:not(.hide)');
  let eventCards = carousel.find('.card');
  const nextBtn = $('.events-carousel-btn--next');
  const prevBtn = $('.events-carousel-btn--prev');

  if(!carousel) return;

  prevBtn.css('display', 'none'); // Hide prev button initially

  nextBtn.on('click', () => {
    if (currentIndex === eventCards.length) return;

    const card = eventCards[currentIndex];
    const margin = getCardMargin(card) * (currentIndex + 1);
    const offset = card.offsetWidth * (currentIndex + 1);

    carousel.css('transform', `translateX(${-offset - margin}px)`);
    currentIndex++;
    carousel.data('currentIndex', currentIndex);

    showHideButtons();
  });

  prevBtn.on('click', () => {
    if (currentIndex === 0) return;

    const card = eventCards[currentIndex - 1];
    const margin = getCardMargin(card) * (currentIndex - 1);
    const offset = card.offsetWidth * (currentIndex - 1);

    carousel.css('transform', `translateX(${-offset - margin}px)`);
    currentIndex--;
    carousel.data('currentIndex', currentIndex);

    showHideButtons();
  });

  // Helpers

  function getCardMargin (card) {
    return parseInt(window.getComputedStyle(card).margin, 10) * 2
  }

  function showHideButtons () {
    if (eventCards[currentIndex + 1] === undefined) {
      nextBtn.hide();
    } else {
      nextBtn.show();
    }

    if (eventCards[currentIndex - 1] === undefined) {
      prevBtn.hide();
    } else {
      prevBtn.show();
    }
  }

  /****************
    Event tabs
  ****************/
  $('.toggle a').click(function(){
    $(this).addClass('text-black').siblings().removeClass('text-black')
    if($(this).attr('data-events') === 'upcoming') {
      $('.card-container.upcoming-events').removeClass('hide').siblings(':not(.events-carousel-btn)').addClass('hide')
    }else{
      $('.card-container.recent-events').removeClass('hide').siblings(':not(.events-carousel-btn)').addClass('hide')
    }

    carousel = $('.events-carousel .card-container:not(.hide)');
    eventCards = carousel.find('.card');
    currentIndex = carousel.data('currentIndex') == undefined ? 0 : carousel.data('currentIndex');
    showHideButtons();
  })
})();
