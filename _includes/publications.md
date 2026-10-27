<header class="intro">
  <h1>Publications</h1>
  <p class="affil">Most recent first. <strong>Bold</strong> marks my name. Also on <a class="link" href="{{ site.google_scholar }}" target="_blank" rel="noopener">Google Scholar</a>.</p>
</header>

{% assign shown = site.data.publications.main | where_exp: "p", "p.hidden != true" %}
<section class="section" id="papers" style="padding-top: 8px;">
  <h2 class="section-head"><span class="section-number">01</span>Papers &amp; preprints<span class="aside">{{ shown | size }} papers</span></h2>
  <div class="pubs">
    {% for pub in shown %}
      {% include pub-entry.html pub=pub %}
    {% endfor %}
  </div>
</section>
