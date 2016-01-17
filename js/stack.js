// Adapted from Mike Bostock's Stack: http://mbostock.github.io/stack/

// TODO: scroll one page when arrows are pressed.
// TODO: create a non-static positioned version for touch screens
// TODO: Load image on current scroll position first (maybe hide images by default)
// TODO: hash numbers! url!

function stack(sections, backgroundImages, getUrl) {
  var body = d3.select('body');
  var i = NaN;
  var n = sections.size();
  var scrollRatio = 1 / 6;
  var backgroundImagesSet = false;

  var imageDivs = d3.select('#background-images')
      .selectAll('div').data(sections[0])
    .enter()
      .append('div')
      .attr('class', 'background-image background-size');

  var setBackgroundImages = function() {
    imageDivs.each(function(d, i) {

      // backgroundImages is array containing Jekyll's
      // front matter, initialized in collection-item layout.
      if (backgroundImages[i]) {

        // Only do this once
        backgroundImagesSet = true;
        var splitted = backgroundImages[i].split('.');
        var extension = splitted[splitted.length - 1];

        if (extension === 'mp4') {
          d3.select(this).append('video')
              .attr('autoplay', true)
              .attr('loop', true)
              .attr('poster', getUrl(backgroundImages[i].replace('mp4', 'jpg')))
              .attr('class', 'section-background')
            .append('source')
              .attr('type', 'video/mp4')
              .attr('src', getUrl(backgroundImages[i]));
        } else {
          d3.select(this)
            .style('background-image', 'url(' + getUrl(backgroundImages[i]) + ')');
        }
      } else {
        var devicePixelRatio = window.devicePixelRatio;
        if (!devicePixelRatio) {
          devicePixelRatio = 1;
        }
        var containerSize = [window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio];
        d3.select(this)
          .style('background-image', 'url(' + getUrl((i + 1) + '.jpg', containerSize) + ')');
      }
    });
  };

  window.onresize = setBackgroundImages;

  sections
    .style('display', 'none')
    .style('opacity', 0)
    .each(function(d, i) {
      if (i < n - 1) {
        d3.select(this)
          .append('div')
            .attr('class', 'scroll-for-more')
          .append('span')
            .html('Scroll down for more…');
      }
    });

  d3.select(window)
    .on('resize', resize)
    .on('touchmove', reposition)
    .on('scroll', reposition);
      //.on('keydown', keydown);

  var sectionPrevious = d3.select(null);
  var sectionCurrent = d3.select(sections[0][0]);
  var sectionNext = d3.select(sections[0][1]);

  var imageDivPrevious = d3.select(null);
  var imageDivCurrent = d3.select(imageDivs[0][0]);
  var imageDivNext = d3.select(imageDivs[0][1]);

  function resize() {
    body.style('height', window.innerHeight * n + 'px');
  }

  function getCurrentSection() {
    var y1 = window.pageYOffset / window.innerHeight;
    var i1 = Math.max(0, Math.min(n - 1, Math.floor(y1 + (1 + scrollRatio) / 2)));
    return i1;
  }

  function reposition() {
    var i1 = getCurrentSection();

    if (i !== i1) {
      if (i1 === i + 1) {
        // Advance one
        sectionPrevious.interrupt().style('display', 'none').style('opacity', 0)
        sectionPrevious = sectionCurrent.interrupt().style('opacity', 0)
        sectionCurrent = sectionNext.interrupt().style('opacity', 0)
        sectionCurrent.transition().style('display', 'block').style('opacity', 1);
        sectionNext = d3.select(sections[0][i1 + 1]).interrupt().style('display', 'none').style('opacity', 0);

        imageDivPrevious.interrupt().style('display', 'none').style('opacity', 0).style('z-index', 0);
        imageDivPrevious = imageDivCurrent.interrupt().style('opacity', 1).style('z-index', 1);
        imageDivCurrent = imageDivNext.interrupt().style('opacity', 0).style('z-index', 2);
        imageDivCurrent.transition().style('opacity', 1);
        imageDivNext = d3.select(imageDivs[0][i1 + 1]).interrupt().style('display', 'block').style('opacity', 0).style('z-index', 0);
      } else if (i1 === i - 1) {
        // Rewind one
        sectionNext.interrupt().style('display', 'none').style('opacity', 0)
        sectionNext = sectionCurrent.interrupt().style('display', 'none').style('opacity', 0)
        sectionCurrent = sectionPrevious.interrupt().style('opacity', 0)
        sectionCurrent.transition().style('display', 'block').style('opacity', 1);
        sectionPrevious = d3.select(sections[0][i1 - 1]).interrupt().style('display', 'none').style('opacity', 0)

        imageDivNext.interrupt().style('display', 'none').style('opacity', 0).style('z-index', 0);
        imageDivNext = imageDivCurrent.interrupt().style('opacity', 1).style('z-index', 1);
        imageDivCurrent = imageDivPrevious.interrupt().style('opacity', 0).style('z-index', 2);
        imageDivCurrent.transition().style('opacity', 1);
        imageDivPrevious = d3.select(imageDivs[0][i1 - 1]).interrupt().style('display', 'block').style('opacity', 0).style('z-index', 0);
      } else {
        // Initialize
        sectionPrevious = d3.select(sections[0][i1 - 1]).interrupt().style('display', 'none').style('opacity', 0)
        sectionCurrent = d3.select(sections[0][i1]).interrupt().style('display', 'block').style('opacity', 1)
        sectionNext = d3.select(sections[0][i1 + 1]).interrupt().style('display', 'none').style('opacity', 0)

        imageDivPrevious.interrupt().style('display', 'none').style('opacity', 0).style('z-index', 0);
        imageDivCurrent.interrupt().style('display', 'none').style('opacity', 0).style('z-index', 0);
        imageDivNext.interrupt().style('display', 'none').style('opacity', 0).style('z-index', 0);
        imageDivPrevious = d3.select(imageDivs[0][i1 - 1]).interrupt().style('display', 'block').style('opacity', 0).style('z-index', 0)
        imageDivCurrent = d3.select(imageDivs[0][i1]).interrupt().style('display', 'block').style('opacity', 1).style('z-index', 2)
        imageDivNext = d3.select(imageDivs[0][i1 + 1]).interrupt().style('display', 'block').style('opacity', 0).style('z-index', 0)
      }
      i = i1;
    }
  }

  setBackgroundImages();
  resize();
  reposition();
}
