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
section.append("div")
    .attr("class", "section-background")
    .style("background-image", function(d, i) {
      if (backgroundImages[i]) {
        return "url(" + backgroundImages[i] + ")";
      } else {
        return "url(" + (i + 1) + ".jpg)";
      }
    });

var i = NaN,
    y = 0,
    yt,
    n = section.size(),
    scrollRatio = 1 / 6;

var sectionPrevious = d3.select(null),
    sectionCurrent = d3.select(section[0][0]),
    sectionNext = d3.select(section[0][1]);

d3.select("body")
  .style("position", "absolute")
  .style("width", "100%")
  .style("height", n * 100 + "%");

d3.select(window)
    .on("resize", resize)
    .on("scroll", reposition)
    .on("keydown", keydown);

function resize() {
  var heading = d3.select("nav").node();
  var top = heading.offsetTop + heading.clientHeight;
  d3.selectAll("section").style("top", top + "px");
}

function keydown() {
  var delta;
  switch (d3.event.keyCode) {
    case 39: // right arrow
    if (d3.event.metaKey) return;
    case 40: // down arrow
    case 34: // page down
    delta = d3.event.metaKey ? Infinity : 1; break;
    case 37: // left arrow
    if (d3.event.metaKey) return;
    case 38: // up arrow
    case 33: // page up
    delta = d3.event.metaKey ? -Infinity : -1; break;
    case 32: // space
    delta = d3.event.shiftKey ? -1 : 1;
    break;
    default: return;
  }

  var y0 = isNaN(yt) ? y : yt;

  yt = Math.max(0, Math.min(n - 1, (delta > 0
      ? Math.floor(y0 + (1 + scrollRatio) / 2)
      : Math.ceil(y0 - (1 - scrollRatio) / 2)) + delta));

  d3.select(document.documentElement)
      .interrupt()
    .transition()
      .duration(500)
      .tween("scroll", function() {
        var i = d3.interpolateNumber(pageYOffset, yt * window.innerHeight);
        return function(t) { scrollTo(0, i(t)); };
      })
      .each("end", function() { yt = NaN; });

  d3.event.preventDefault();
}

function reposition() {
  var y1 = window.pageYOffset / window.innerHeight,
      i1 = Math.max(0, Math.min(n - 1, Math.floor(y1 + (1 + scrollRatio) / 2)));

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