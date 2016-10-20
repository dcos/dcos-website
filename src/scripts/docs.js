/* global $, scrollMonitor */

$(document).ready(() => {

  // Event handlers

  const $versionSelect = $('#docs-version-select')

  function bindEventHandlers () {
    $versionSelect.on('change', e => {
      const $el = $(e.currentTarget)
      const version = $el.val()

      window.location.href = `/docs/${version}`
    })
  }

  bindEventHandlers()

  // In this post

  function initInThisPost () {
    const $container = $('.docs-in-this-post')

    $container.stick_in_parent({ recalc_every: 1 })

    $('#docs-content').scrollNav({
      sections: 'h1',
      subSections: true,
      sectionElem: 'section',
      showHeadline: true,
      headlineText: 'In This Post',
      showTopLink: false,
      topLinkText: 'Top',
      fixedMargin: 40,
      scrollOffset: 40,
      animated: true,
      speed: 500,
      insertTarget: $container,
      insertLocation: 'prependTo',
      arrowKeys: false,
      onRender: function () {
        $container.addClass('is-visible')
      },
      onDestroy: null
    })
  }

  initInThisPost()

  // Search
  const version = 'latest';

  // Navigation
  Array.prototype.forEach.call($('.docs-nav__item_folder a'), el => {
    $(el).on('click', function(e) {
      docsMenu.css('maxHeight', null); // remove max-height set by mobile docs menu

      if($(e.currentTarget).hasClass('docs-nav__item__arrow') || $(e.currentTarget).attr('href') === '#') e.preventDefault();
      else if(!$(e.currentTarget).attr('data-path')) return;

      let parent = $($(e.currentTarget).parent());
      let img = $(parent.find('img')).first();

      parent.hasClass('docs-nav__item--closed') ? parent.removeClass('docs-nav__item--closed') : parent.addClass('docs-nav__item--closed')
      let isActive = $(parent.find('.docs-nav__item__title')).hasClass('active');
      let isClosed = parent.hasClass('docs-nav__item--closed');

      if(isActive) {
        isClosed ? img.attr('src', '/assets/images/icons/arrow-right-docs-selected.svg') : img.attr('src', '/assets/images/icons/arrow-down-docs.svg');
      } else {
        isClosed ? img.attr('src', '/assets/images/icons/arrow-right-docs.svg') : img.attr('src', '/assets/images/icons/arrow-down-docs-unselected.svg');
      }
    });
  });

  // Mobile docs menu
  let mobileDocsMenu = $('.docs-menu-mobile');
  let docsMenu = $(mobileDocsMenu.find('.docs-menu-mobile-container'));
  let docsMenuButton = $(mobileDocsMenu.find('.open-docs-menu'));
  let docsMenuHeight;
  let docsMenuActive;

  if(!docsMenu) return;
  initDocsMenu();

  function initDocsMenu () {
    docsMenuHeight = docsMenu.offsetHeight;
    docsMenuActive = false;

    docsMenu.addClass('hidden');
  }

  docsMenuButton.on('click', () => {
    if (docsMenuActive) docsMenuHeight = docsMenu.offsetHeight;

    $(docsMenu).css('maxHeight', `${docsMenuHeight}px`);

    setTimeout(() => {
      docsMenu.toggleClass('hidden');
      docsMenu.toggleClass('active');
      docsMenuButton.toggleClass('active');

      docsMenuActive = !docsMenuActive;
    });
  });

  // Highlight.js
  Array.prototype.forEach.call($('pre code'), el => {
    hljs.highlightBlock(el);
  });

  // Height nav
  let docsNav = $('#docs-nav');
  let docsArticle = $('#docs-article');

  let calculateDocsNavHeight = function () {
    if (matchMedia('only screen and (max-width: 480px)').matches) return;
    docsNav.css({height: 'auto'});
    let docsNavHeight = $('#docs-nav > ul').outerHeight();
    let docsArticleHeight = docsArticle.outerHeight();
    let newDocsNavHeight;

    if (docsNavHeight < docsArticleHeight) newDocsNavHeight = docsArticleHeight + 40;
    else newDocsNavHeight = docsNavHeight + 80;

    docsNav.css({height: `${newDocsNavHeight}px`});
  }

  calculateDocsNavHeight();
  $('.docs-nav__item a').on('click', calculateDocsNavHeight);
})
