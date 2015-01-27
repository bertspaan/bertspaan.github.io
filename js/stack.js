---
layout:
---
// Adapted from Mike Bostock's Stack: http://mbostock.github.io/stack/

{% if page.invert-colors == true %}
  d3.select("body").classed("invert-colors", true);
{% endif %}

// backgroundImages is array containing Jekyll's
// front matter, initialized in collection-item layout.
var section = d3.selectAll("#sections section");

section.each(function(d, i) {
  if (backgroundImages[i]) {
    var splitted = backgroundImages[i].split("."),
        extension = splitted[splitted.length - 1];
    if (extension === "mp4") {
      d3.select(this).append("video")
          .attr("autoplay", true)
          .attr("loop", true)
          .attr("poster", backgroundImages[i].replace("mp4", "jpg"))
          .attr("class", "section-background")
        .append("source")
          .attr("type", "video/mp4")
          .attr("src", backgroundImages[i]);
    } else {
      d3.select(this).append("div")
        .attr("class", "section-background")
        .style("background-image", "url(" + backgroundImages[i] + ")");
    }
  } else {
    d3.select(this).append("div")
      .attr("class", "section-background")
      .style("background-image", "url(" + (i + 1) + ".jpg)");
  }
});

// TODO: scroll one page when arrows are pressed.
// TODO: create a non-static positioned version for touch screens
// TODO: Load image on current scroll position first (maybe hide images by default)

var body = d3.select("body"),
    touchy = "ontouchstart" in document && false,
    resize = touchy ? resizeTouchy : resizeNoTouchy,
    i = NaN,
    y = 0,
    yt,
    n = section.size(),
    scrollRatio = 1 / 6;

var sectionPrevious = d3.select(null),
    sectionCurrent = d3.select(section[0][0]),
    sectionNext = d3.select(section[0][1]);

d3.select("body")
  .style("position", "absolute")
  .style("width", "100%");

d3.select(window)
    .on("resize", resize)
    .on("touchmove", reposition)
    .on("scroll", reposition);
    //.on("keydown", keydown);

function resizeNoTouchy() {
  var heading = d3.select("nav").node();
  var top = heading.offsetTop + heading.clientHeight;
  d3.selectAll("section").style("top", top + "px");

  body.style("height", innerHeight * n + "px");
}

function getCurrentSection() {
  var y1 = window.pageYOffset / window.innerHeight,
      i1 = Math.max(0, Math.min(n - 1, Math.floor(y1 + (1 + scrollRatio) / 2)));
  return i1;
}

function reposition() {
  var i1 = getCurrentSection();

  if (i !== i1) {
    if (i1 === i + 1) { // advance one
      sectionPrevious.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      sectionPrevious = sectionCurrent.interrupt().style("opacity", 1).style("z-index", 1);
      //sectionPrevious.transition().each("end", deactivate);
      sectionCurrent = sectionNext.interrupt().style("opacity", 0).style("z-index", 2);
      sectionCurrent.transition().style("opacity", 1);
      sectionNext = d3.select(section[0][i1 + 1]).interrupt().style("display", "block").style("opacity", 0).style("z-index", 0);
    } else if (i1 === i - 1) { // rewind one
      sectionNext.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      sectionNext = sectionCurrent.interrupt().style("opacity", 1).style("z-index", 1);
      //sectionNext.transition().each("end", deactivate);
      sectionCurrent = sectionPrevious.interrupt().style("opacity", 0).style("z-index", 2);
      sectionCurrent.transition().style("opacity", 1);
      sectionPrevious = d3.select(section[0][i1 - 1]).interrupt().style("display", "block").style("opacity", 0).style("z-index", 0);
    } else { // skip
      sectionPrevious.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      sectionCurrent.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      sectionNext.interrupt().style("display", "none").style("opacity", 0).style("z-index", 0);
      sectionPrevious = d3.select(section[0][i1 - 1]).interrupt().style("display", "block").style("opacity", 0).style("z-index", 0)
      sectionCurrent = d3.select(section[0][i1]).interrupt().style("display", "block").style("opacity", 1).style("z-index", 2)
      sectionNext = d3.select(section[0][i1 + 1]).interrupt().style("display", "block").style("opacity", 0).style("z-index", 0)
    }
    i = i1;
  }
}

resize();
reposition();