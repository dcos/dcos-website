const json = require('../demos.json')

function getItems (query) {
  return query
    ? json.filter(item => {
      return (item.packages.map(hash).indexOf(hash(query)) > -1) || (item['dcos_version'].indexOf(query) > -1)
    })
    : json
}

function hash (name) {
  return name.replace(/\s+/g, '-').toLowerCase()
}

function getQuery () {
  const query = window.location.hash.split('#')
  const q = query[1]

  return q // string or undefined
}

function clean () {
  $(".demos-cards").empty()
}

function getDemoItem(demo) {

  const contentClass = demo.featured ? 'px2 lg-col-6 col-6 xs-col-12' : 'pt3';
  const imageClass = demo.featured ? 'lg-col-6 col-6 xs-col-12 pr2 thumb' : 'thumb';
  let media = demo.image ? `<div class="${imageClass}" style="background-image: url('${ demo.image }')"></div>` : ``;
  media = demo.youtube_id && demo.featured ? `<div class="${imageClass}"><div class="youtube"><iframe width="480" height="220" src="https://www.youtube.com/embed/${ demo.youtube_id }" frameborder="0" allowfullscreen></iframe></div></div>` : media;
  const classNames = demo.featured ? 'lg-col-12 col-12 xs-col-12 flex flex-wrap' : 'lg-col-6 col-6 xs-col-12 bg-white'

  return `
    <div class="${classNames} xs-left px2 pb3 left-align has-footer">
      ${media}
      <div class="${contentClass}">
        <h5 class="mt0 mb0 bold">${demo.use_cases.join(', ').toString()}</h5>
        <h3 class="mt0 mb1">${demo.name}</h3>
        <p class="block mt1">${demo.description}</p>
        <div class="specs flex flex-wrap">
          <div class="col-4 mb1"><p class="my0"><strong>Services</strong></p></div>
          <div class="col-8 mb1"><p class="my0">${demo.packages.join(', ').toString()}</p></div>
          <div class="col-4 mb1"><p class="my0"><strong>DC/OS Version</strong></p></div>
          <div class="col-8 mb1"><p class="my0">${demo.dcos_version.join(', ').toString()}</p></div>
          <div class="col-4 mb1"><p class="my0"><strong>Languages</strong></p></div>
          <div class="col-8 mb1"><p class="my0">${demo.language.join(', ').toString()}</p></div>
        </div>
        <div class="callouts">
          ${$.map(demo.callouts, (calloutUrl, name) => `<a class="cta cta--button" href="${calloutUrl}">Try demo</a>`).join(' &bull; ').toString()}
          ${ demo.youtube_id && !demo.featured ? `<a class="cta cta--text" href="https://www.youtube.com/watch?v=${demo.youtube_id}">Watch Video</a>` : ``  }
        </div>
      </div>
    </div>

    `;
}

function render (items) {

  const featured_items = items.filter(function(value) {
    return value.featured == true
  })

  const other_items = items.filter(function(value) {
    return value.featured == false
  })

  other_items.forEach(demo => {
    const item = getDemoItem(demo);
    $(".demos-cards").append(item);
  });

  if (featured_items.length) {
    const featured_item = getDemoItem(featured_items[0]);
    $(".demos-cards-featured").prepend(featured_item);
  }
}

function main () {
  const query = getQuery()
  const items = getItems(query)
  render(items)

  // if(query) {
  //   $(".demos-cards").prepend(
  //     `
  //     <div class="flex flex-wrap justify-start items-center col-12 mb2">
  //       <h3 class="px1 col-8 border-box">Showing demos matching: ${query}</h3>
  //       <span class="px1 col-4 right-align border-box">
  //         <a href="${document.location.href.replace(location.hash , '' )}">Reset filter</a>
  //       </span>
  //     </div>
  //     `
  //   )
  // }
}

/*****************
  This is used to listen to when people filter tags
*****************/
// window.onhashchange = function () {
//   const query = getQuery()

//   if (query) {
//     clean()
//     main()
//   }
// }

$(document).ready(main)
