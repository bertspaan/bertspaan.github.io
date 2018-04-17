---
title: Master’s Thesis & Internship at TomTom
date: 2008-01-01
display_date: 2007–2008
portfolio: true
style:
  transparent_text: false
  invert_colors: true
background_images:
  - 1.jpg
  - 2.jpg
---

<section>
  <span>
    During my research internship in the Map Team of <a href="http://www.tomtom.com/en_gb/">TomTom</a>’s headquarters in Amsterdam, I wrote my <a href="http://bertspaan.nl/files/thesis.pdf">master’s thesis</a>. I designed an algorithm that is able to simplify polygonal road lines by replacing parts of the roads with circular arcs. This technique decreased the storage footprint of TomTom’s road maps without compromising on the aesthetical quality. The algorithm was afterwards patented by TomTom.
  </span>
</section>

<section>
  <span>
    Based on the work of Apollonius of Perga, a Greek geometer who lived around 200 BC, the algorithm used the <a href="http://en.wikipedia.org/wiki/Circles_of_Apollonius">Circles of Apollonius</a> to determine which circular arcs best fitted the road simplification. I implemented the algorithm in C++, and tested it on a subset of TomTom’s actual road datasets.
  </span>
</section>
