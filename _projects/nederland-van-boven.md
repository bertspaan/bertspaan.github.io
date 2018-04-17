---
title: Nederland van Boven
date: 2012-04-01
display_date: April 2012
portfolio: true
style:
  invert_colors: true
  transparent_text: false
background_images:
  - 1.mp4
  - 2.jpg
  - 3.jpg
---

<section>
  <span>
    Before filming the second season of its popular TV series <a href="http://www.vpro.nl/nederland-van-boven.html">Nederland van Boven</a>, the VPRO invited designers, developers and data scientists to pitch new concepts and ideas. I worked together with <a href="http://bvh.me/">Boris van Hoytema</a> and <a href="http://rafecopeland.co.nz/">Rafe Copeland</a> of <a href="http://non-fiction.eu/2012/06/02/visualising-flight-traffic-for-nederland-van-boven/">Non-fiction</a>, to create data visualizations which combined real-world paper maps and 3D animations.
  </span>
</section>

<section>
  <span>
    Our animation showed all the flights arriving and departing from Schiphol Airport on a single day. The dataset was supplied by the VPRO, we used Python to clean up the data, <a href="http://postgis.net/">PostGIS</a> to calculate all the fligh paths, and Google Earth for some initial explorations.
  </span>
</section>

<section>
  <span>
    We filmed a paper map the Netherlands, and with <a href="https://www.autodesk.com/products/maya/overview">Maya</a> and camera tracking software, we were able to overlay the 3D flight paths on the movie of the paper map.
  </span>
</section>
