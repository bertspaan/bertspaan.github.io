/*
 * ==========================================================================
 * Collection and item functions
 * ==========================================================================
 */

function createCollection(collection, url, config) {
  getCollection(collection, function(items) {
    var elements = d3.select('.collection')
      .selectAll('.collection-item').data(items);

    // {% if item.secret %}
    //   {% capture hask_key %}{{ item.url | replace_first:'/photos/','' }}{% endcapture %}
    //   {% capture hask_key %}{{ hask_key | replace_first:'/','-' | remove_first:'/' }}{% endcapture %}
    //   {% assign hash_key = hask_key %}
    //   {% capture image_url %}{{ image_url }}{{ site.data.hash[hash_key] }}/{% endcapture %}
    // {% endif %}

    elements.select('.collection-item-wrapper').style('background-image', function(d) {
      return 'url(' + getImageUrl(url, config, d, true) + ')';
    }).on('click', function(d) {
      location.href = d.url;
    });

    elements.select('.collection-item-link').attr('href', function(d) {
      return d.url;
    });

    elements.select('.collection-item-title').html(function(d) {
      return d.title.toLowerCase();
    });

    elements.select('.collection-item-date').html(function(d) {
      if (d.display_date) {
        return formatDate(d.display_date).toLowerCase();
      } else {
        return formatDate(dateFromItem(d));
      }
    });

    readLocalStorage();
  });
}

function createItem(collection, url, config) {
  getCollection(collection, function(items) {
    var item = findItem(items, url);

    var sections = d3.selectAll('#sections section');

    stack(sections, item.background_images || [], function(url, containerSize) {
      return getImageUrl(url, config, item, false, containerSize);
    });

    readLocalStorage();
  });
}

function getCollection(collection, callback) {
  d3.json('/' + collection + '/data.json', function(items) {
    callback(items.filter(function(d) {
      return d.show !== false;
    }).sort(function(a, b) {
      return new Date(dateFromItem(b)) - new Date(dateFromItem(a));
    }));
  });
}

var prevItem;
var nextItem;
function findItem(items, url) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.url === url) {
      if (i > 0) {
        prevItem = items[i - 1];
      }

      if (i < items.length - 1) {
        nextItem = items[i + 1];
      }

      break;
    }
  }
  return item;
}

/*
 * ==========================================================================
 * URL functions
 * ==========================================================================
 */

function getImageBaseUrl(url, config, item) {
  var baseUrl = '';
  if (item.use_file_server) {
    baseUrl = config.file_server;
  }
  return baseUrl;
}

function getImagePath(url, config, item, index, containerSize) {
  if (item.use_sizes) {
    var size;
    if (containerSize) {
      size = getSize(config.sizes, containerSize);
    } else {
      size = config.sizes[2];
    }

    if (index) {
      size = config.sizes[0];
    }

    var sizeStr = size.map(function(i) {
      return i.toString().trim();
    }).join('x')

    return splitUrl(item.url).slice(0, 2).join('/') + '/sizes/' + sizeStr + '/'
  } else {
    return item.url;
  }
}

function getImageFilename(url, config, item, index) {
  if (item.image_from_url) {
    var name = splitUrl(item.url)[2];
    return name + '.jpg';
  } else {
    if (index) {
      return 'index.jpg';
    } else {
      return url;
    }
  }
}

function getImageUrl(url, config, item, index, containerSize) {
  var parts = {
    baseUrl: getImageBaseUrl(url, config, item),
    path: getImagePath(url, config, item, index, containerSize),
    filename: getImageFilename(url, config, item, index)
  };

  var url = parts.baseUrl + parts.path + parts.filename;
  return url.replace(/\/\//, '/').replace(':/', '://');
}

function splitUrl(url) {
  return url.split('/').filter(function(d) {
    return d;
  });
}

/*
 * ==========================================================================
 * Size functions
 * ==========================================================================
 */

function getSize(sizes, containerSize) {
  var size = sizes[sizes.length - 1];

  var maxResize = 1.1;

  var cW = containerSize[0];
  var cH = containerSize[1];
  for (var i = 0; i < sizes.length; i++) {
    var sW = sizes[i][0];
    var sH = sizes[i][1];

    if (sW * maxResize >= cW && sH * maxResize >= cH) {
      size = sizes[i];
      break;
    }
  }

  return size;
}

/*
 * ==========================================================================
 * Date functions
 * ==========================================================================
 */

var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function formatDate(date) {
  if (date.length === 7) {
    var month = parseInt(date.substring(5));
    return months[month - 1] + ' ' + date.substring(0, 4);
  } else {
    return date.toString().split('-').reverse().join('-');
  }
}

function dateFromItem(item) {
  if (item.date_from_url) {
    return (dateFromUrl(item.url));
  } else {
    return item.date;
  }
}

function dateFromUrl(url) {
  return splitUrl(url)[1];
}

/*
 * ==========================================================================
 * Set body classes
 * ==========================================================================
 */

function setClasses(style) {
  d3.select('body')
    .classed('fixed ', style.fixed)
    .classed('invert-colors', style.invert_colors)
    .classed('transparent-text', style.transparent_text);

  d3.select('nav')
    .classed('lights-out', style.lights_out);
}

/*
 * ==========================================================================
 * Key events
 * ==========================================================================
 */

document.onkeydown = function(e) {
  if (e.which === 39 || e.which === 34) next();
  if (e.which === 37 || e.which === 33) prev();
  if (e.which === 27) esc();
  if (e.which === 77) toggleMode();
  if (e.which === 76) toggleLightsOut();
};

/*
 * ==========================================================================
 * Local storage
 * ==========================================================================
 */

var backgroundSize = 'cover';
var lightsOutOpacity = 1;

function readLocalStorage() {
  var lsBackgroundSize = localStorage.getItem('backgroundSize');
  if (lsBackgroundSize !== null) {
    backgroundSize = lsBackgroundSize;
  }

  var lsLightsOutOpacity = localStorage.getItem('lightsOutOpacity');
  if (lsLightsOutOpacity !== null) {
    lightsOutOpacity = lsLightsOutOpacity;
  }

  setMode();
  setLightsOut();
}









function prev() {
  if (prevItem) {
    location.href = prevItem.url;
  }
}

function next() {
  if (nextItem) {
    location.href = nextItem.url;
  }
}




// TODO: only allow on photos/ditwas
function setMode() {
  d3.select('body')
    .classed('contain', backgroundSize === 'contain');
}

function toggleMode() {
  if (backgroundSize === 'contain') {
    backgroundSize = 'cover';
  } else {
    backgroundSize = 'contain';
  }
  localStorage.setItem('backgroundSize', backgroundSize);
  setMode();
}

function setLightsOut() {
  // TODO: apply to body
  var elements = document.getElementsByClassName('lights-out');
  for(var i = 0; i < elements.length; i++) {
     elements.item(i).style.opacity = lightsOutOpacity;
  }
}

function toggleLightsOut() {
  var diff = 0.3334;
  lightsOutOpacity -= diff;
  if (lightsOutOpacity < -.1) {
    lightsOutOpacity = 1;
  }

  localStorage.setItem('lightsOutOpacity', lightsOutOpacity);

  setLightsOut();
}

function esc() {
  var parts = location.href.split('/').filter(function(part) {
    return part.length > 0;
  });

  if (parts.length > 2) {
    parts.pop();
    if (parts[2] === 'ditwas' || parts[2] === 'photos') {
      parts.pop();
    }
    var newHref = parts.join('/').replace('http:/', 'http://');
    location.href = newHref;
  }
}







//
//
// <div id="sections">
//   <section>
//     <span class="lights-out">
//       Dit was {{content}}
//     </span>
//     <div class="section-background" style="background-image: url({{ image_url }}); background-size: contain;"></div>
//   </section>
// </div>
// <script>
//   backgroundImages = [];
//   backgroundImages.push("{{ page.url }}");
// </script>
// <script src="{{ site.baseurl }}/js/d3.v3.min.js"></script>
// <script src="{{ site.baseurl }}/js/stack.js"></script>
// {% include footer.html %}
