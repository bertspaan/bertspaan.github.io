// Adapted from Mike Bostock's Stack: http://mbostock.github.io/stack/

// TODO: scroll one page when arrows are pressed.
// TODO: create a non-static positioned version for touch screens
// TODO: Load image on current scroll position first (maybe hide images by default)
// TODO: hash numbers! url!

function stack(sections, backgroundImages, getUrl) {
  var body = d3.select('body');
  var touchy = 'ontouchstart' in document && false;
  var resize = touchy ? resizeTouchy : resizeNoTouchy;
  var i = NaN;
  var y = 0;
  var yt;
  var n = sections.size();
  var scrollRatio = 1 / 6;

  // TODO: andere naam dan divs!
  var imageDivs = d3.select('#background-images')
      .selectAll('div').data(sections[0])
    .enter()
      .append('div')
      .attr('class', 'background-image background-size');

  var setBackgroundImages = function() {
    imageDivs.each(function(d, i) {
      // TODO: if met alles en video

      var devicePixelRatio = window.devicePixelRatio;
      if (!devicePixelRatio) {
        devicePixelRatio = 1;
      }
      var containerSize = [window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio];

      d3.select(this)
        .style('background-image', 'url(' + getUrl((i + 1) + '.jpg', containerSize) + ')');
    });
  };

  window.onresize = setBackgroundImages;

  sections.each(function(d, i) {
    // TODO: sections.each MAAR EEN keer dus

    if (i < n - 1) {
      d3.select(this)//.select("span")
        .append('div')
          .attr('class', 'scroll-for-more')
        .append('span')
          .html('(Scroll down for more…)');
    }

    // backgroundImages is array containing Jekyll's
    // front matter, initialized in collection-item layout.
    if (backgroundImages[i]) {
      var splitted = backgroundImages[i].split('.');
      var extension = splitted[splitted.length - 1];

      if (extension === "mp4") {
        // TODO: video!
        // d3.select(this).append("video")
        //     .attr("autoplay", true)
        //     .attr("loop", true)
        //     .attr("poster", backgroundImages[i].replace("mp4", "jpg"))
        //     .attr("class", "section-background")
        //   .append("source")
        //     .attr("type", "video/mp4")
        //     .attr("src", getUrl(backgroundImages[i]));
      } else {
        // TODO: setBackgroundImages();
        imageDivs
          .style('background-image', 'url(' + getUrl(backgroundImages[i]) + ')');
      }
    } else {
      setBackgroundImages();
    }
  });

  var sectionPrevious = d3.select(null);
  var sectionCurrent = d3.select(sections[0][0]);
  var sectionNext = d3.select(sections[0][1]);

  d3.select(window)
      .on('resize', resize)
      .on('touchmove', reposition)
      .on('scroll', reposition);
      //.on("keydown", keydown);

  function resizeNoTouchy() {
    // var heading = d3.select("nav").node();
    // var top = heading.offsetTop + heading.clientHeight;
    // d3.selectAll("section").style("top", top + "px");

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
      console.log('Ga naar: ', i1)

      if (i1 === i + 1) { // advance one
        console.log('advance')
        d3.select(sections[0][i]).interrupt().transition().style('display', 'none').style('opacity', 0);
        d3.select(imageDivs[0][i]).interrupt().transition().style('display', 'none').style('opacity', 0);

        d3.select(sections[0][i1]).interrupt().transition().style('display', 'block').style('opacity', 1);
        d3.select(imageDivs[0][i1]).interrupt().transition().style('display', 'block').style('opacity', 1);

      //   // sectionPrevious.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      //   // sectionPrevious = sectionCurrent.interrupt().style("opacity", 1).style("z-index", 1);
      //   // // sectionPrevious.transition().each("end", deactivate);
      //   // sectionCurrent = sectionNext.interrupt().style("opacity", 0).style("z-index", 2);
      //   // sectionCurrent.transition().style("opacity", 1);
      //   // sectionNext = d3.select(sections[0][i1 + 1]).interrupt().style("display", "block").style("opacity", 0).style("z-index", 0);
      } else if (i1 === i - 1) { // rewind one
        console.log('rewind', 'current', i1, 'previous:', i)
        d3.select(sections[0][i]).interrupt().transition().style('display', 'none').style('opacity', 0);
        d3.select(imageDivs[0][i]).interrupt().transition().style('display', 'none').style('opacity', 0);
        //
        d3.select(sections[0][i1]).interrupt().transition().style('display', 'block').style('opacity', 1);
        d3.select(imageDivs[0][i1]).interrupt().transition().style('display', 'block').style('opacity', 1);



      //   // sectionNext.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      //   // sectionNext = sectionCurrent.interrupt().style("opacity", 1).style("z-index", 1);
      //   // // sectionNext.transition().each("end", deactivate);
      //   // sectionCurrent = sectionPrevious.interrupt().style("opacity", 0).style("z-index", 2);
      //   // sectionCurrent.transition().style("opacity", 1);
      //   // sectionPrevious = d3.select(sections[0][i1 - 1]).interrupt().style("display", "block").style("opacity", 0).style("z-index", 0);
      } else {
        for (var l = 0; l < sections[0].length; l++) {
          console.log(l, i1)
          if (l === i1) {
            d3.select(sections[0][l]).interrupt().style('display', 'block').style('opacity', 1);
            d3.select(imageDivs[0][l]).interrupt().style('display', 'block').style('opacity', 1);
          } else {
            d3.select(sections[0][l]).interrupt().style('display', 'none').style('opacity', 0);
            d3.select(imageDivs[0][l]).interrupt().style('display', 'none').style('opacity', 0);
          }

        }




      //   // sectionPrevious.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      //   // sectionCurrent.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      //   // sectionNext.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      //   // sectionPrevious = d3.select(sections[0][i1 - 1]).interrupt().style("display", "block").style("opacity", 0).style("z-index", 0)
      //   // sectionCurrent = d3.select(sections[0][i1]).interrupt().style("display", "block").style("opacity", 1).style("z-index", 2)
      //   // sectionNext = d3.select(sections[0][i1 + 1]).interrupt().style("display", "block").style("opacity", 0).style("z-index", 0)
      }
      i = i1;
    }
  }

  resize();
  reposition();
}
