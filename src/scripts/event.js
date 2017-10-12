window._event = (function ($) {
  class EventController {

    constructor (containerEl, params) {
      this.params = $.extend({
        offset: 0,
        limit: 6,
        category: getParameterByName('category')
      }, params)

      this.lunrIndex = null

      this.$container = $(containerEl)
      this.$eventsContainer = this.$container.find('.events')
      this.$featuredEvent = this.$container.find('.latest-event')
      this.$loadMoreButton = this.$container.find('.load-more')
      this.$categorySelect = this.$container.find('.event__categories')
      this.$searchForm = this.$container.find('.event__search-container')
      this.$searchInput = this.$container.find('.event__search')
      this.$noResultsContainer = this.$container.find('.not-found')
      this.$showAllLink = this.$container.find('.show-all-events')
      this.$filterBar = this.$container.find('.filter-bar')

      this.getEvents = memoize(() => $.get('/events/events.json').then(data => $.when(data.result)))

      equalHeight(this.$eventsContainer)

      this.bindEventHandlers()
      this.initLunr()

      if (this.params.category) {
        this.$categorySelect.val(this.params.category).attr('selected', 'selected')
        this.showCategoryEvents(this.params.category)
      }
    }

    bindEventHandlers () {
      this.$loadMoreButton.on('click', this.loadMoreEvents.bind(this))

      this.$categorySelect.on('change', e => {
        const $el = $(e.currentTarget)
        const category = $el.val()

        if (category === 'all') return this.showAllEvents()

        this.params.category = category
        this.params.offset = 0

        this.showCategoryEvents(category)
      })

      this.$searchForm.on('submit', (e) => {
        e.preventDefault()
        if (!this.lunrIndex) return // TODO

        const searchTerms = this.$searchInput.val()

        this.showSearchResults(searchTerms)
      })

      this.$showAllLink.on('click', () => {
        this.showAllEvents()
      })
    }

    loadMoreEvents (e) {
      const $el = $(e.currentTarget)

      $el.addClass('is-loading')

      this.getEvents().then(events => {
        $el.removeClass('is-loading')
        const {offset, limit, category} = this.params

        const eventElements = events
          .filter(filterProp('category', category))
          .slice(offset, (offset + limit))
          .map(this.createEventElement)

        this.render(this.$eventsContainer, eventElements, false)

        this.params.offset += this.params.limit
        equalHeight(this.$eventsContainer)
      })
    }

    showAllEvents () {
      this.hideNoResults()
      this.showFeaturedEvent()
      this.resetSearch()
      this.resetCategoryFilter()
      this.hideFilterBar()

      this.$loadMoreButton.addClass('is-loading')

      this.params.offset = 1 // account for featured post

      this.getEvents().then(events => {
        const results = events.slice(this.params.offset, (this.params.offset + this.params.limit))

        this.render(this.$eventsContainer, results.map(this.createEventElement), true)
        equalHeight(this.$eventsContainer)

        if (results.length < this.params.limit) this.hideLoadMoreButton()
        else this.showLoadMoreButton()

        this.$loadMoreButton.removeClass('is-loading')

        this.params.offset += results.length

        if (results.length === 0) this.showNoResults()
      })
    }

    showCategoryEvents (category) {
      this.hideNoResults()
      this.hideFeaturedEvent()
      this.resetSearch()
      this.hideFilterBar()

      this.$loadMoreButton.addClass('is-loading')

      this.params.offset = 0

      this.getEvents().then(events => {
        const results = events.filter(filterProp('category', category))
        const paginatedResults = results.slice(this.params.offset, (this.params.offset + 9))

        this.render(this.$eventsContainer, paginatedResults.map(this.createEventElement), true)
        equalHeight(this.$eventsContainer)

        if (results.length < this.params.limit) this.hideLoadMoreButton()
        else this.showLoadMoreButton()

        this.$loadMoreButton.removeClass('is-loading')

        this.showFilterBar(results.length, category)

        this.params.offset += paginatedResults.length

        if (results.length === 0) this.showNoResults()
      })
    }

    showSearchResults (searchTerms) {
      this.hideFeaturedEvent()
      this.hideNoResults()
      this.resetCategoryFilter()
      this.hideFilterBar()

      const refs = this.lunrIndex.search(searchTerms)

      this.$loadMoreButton.addClass('is-loading')

      this.params.offset = 0

      this.getEvents().then(events => {
        const results = refs.sort(sortProp('score')).reverse().map(item => this.getEventFromRef(events, item.ref))

        const restore = this.render(this.$eventsContainer, results.map(this.createEventElement), true)
        equalHeight(this.$eventsContainer)

        if (results.length < this.params.limit) this.hideLoadMoreButton()
        else this.showLoadMoreButton()

        this.$loadMoreButton.removeClass('is-loading')

        this.showFilterBar(results.length, searchTerms)

        this.params.offset += results.length

        if (results.length === 0) this.showNoResults()
      })
    }

    resetSearch () {
      this.$searchInput.val('')
    }

    resetCategoryFilter () {
      this.params.category = null
      this.$categorySelect.val(null)
      // this.$categorySelect.val('all').attr('selected', 'selected')
    }

    showLoadMoreButton () {
      this.$loadMoreButton.show()
    }

    hideLoadMoreButton () {
      this.$loadMoreButton.hide()
    }

    showNoResults () {
      this.$eventsContainer.hide()
      this.$noResultsContainer.show()
    }

    hideNoResults () {
      this.$eventsContainer.show()
      this.$noResultsContainer.hide()
    }

    showFilterBar (resultCount, filter) {
      this.$filterBar.find('.result-text').remove()
      this.$filterBar.prepend(`<p class='result-text'>${resultCount} ${resultCount > 1 ? 'results' : 'result'} for <strong>${filter}</strong></p>`)
      this.$filterBar.show()
    }

    hideFilterBar () {
      this.$filterBar.hide()
    }

    showFeaturedEvent () {
      this.$featuredEvent.show()
    }

    hideFeaturedEvent () {
      this.$featuredEvent.hide()
    }

    createEventElement (_event) {
      if (_event.eventimage)
      return `<div class="event" style="background-image: linear-gradient(to top right, rgba(12,6,24, 0.6), rgba(42,20,87, 0.6)), url(/assets/images/events/${_event.eventimage})">
        <div class="event__meta">
          <a href="/events?category=${_event.category}" class="event__category">${_event.category}</a>
          <div class="event__date">${_event.formattedDate}</div>
        </div>
        <a href="/${_event.path}">
          <h2 class="event__title">${ellipsis(52, _event.title)}</h2>
          <div class="event__readmore cta cta--text">Event resources &rarr;</div>
        </a>
      </div>`
      else
      return `<div class="event">
        <div class="event__meta">
          <a href="/events?category=${_event.category}" class="event__category">${_event.category}</a>
          <div class="event__date">${_event.formattedDate}</div>
        </div>
        <a href="/${_event.path}">
          <h2 class="event__title">${ellipsis(52, _event.title)}</h2>
          <div class="event__readmore cta cta--text">Event resources &rarr;</div>
        </a>
      </div>`
    }

    render ($parentEl, elements, replaceContent = true) {
      let _this = this
      let $oldElements = $parentEl.clone().children()
      if (replaceContent) $parentEl.empty()

      $parentEl.append(...elements)

      return function restore () {
        _this.render($parentEl, $oldElements)
      }
    }

    // Lunr

    initLunr () {
      return $.get('/events/search-index.json', index => {
        this.lunrIndex = window.lunr.Index.load(index)
      })
    }

    getEventFromRef (events, ref) {
      return events.filter(_event => ref.indexOf(_event.path) > -1)[0]
    }

  }

  // Utility functions

  function ellipsis (maxLength, text) {
    return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text
  }

  function equalHeight ($container) {
    let maxHeight = 0

    $container.children().each(function () {
      const $el = $(this)
      const height = $el.innerHeight()
      if (height > maxHeight) maxHeight = height
    })

    $container.children().each(function () {
      $(this).css('height', maxHeight)
    })
  }

  function memoize (func) {
    const memo = {}
    const slice = Array.prototype.slice

    return function () {
      const args = slice.call(arguments)

      if (args in memo) return memo[args]
      else return (memo[args] = func.apply(this, args))
    }
  }

  function sortProp (prop) {
    return (a, b) => {
      if (a[prop] > b[prop]) return 1
      if (a[prop] < b[prop]) return -1
      return 0
    }
  }

  function filterProp (prop, value) {
    return item => value ? item[prop] === value : true
  }

  function getParameterByName (name) {
    let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
  }

  return {
    init: function (containerEl, params) {
      new EventController(containerEl, params)
    }
  }
})(window.jQuery)
