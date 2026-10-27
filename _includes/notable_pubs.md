{% assign selected = site.data.publications.main | where: "selected", true | where_exp: "p", "p.hidden != true" %}
<div class="pubs">
  {% for pub in selected limit: 5 %}
    {% include pub-entry.html pub=pub %}
  {% endfor %}
</div>
<p class="more"><a class="bracket" href="{{ '/publications/' | relative_url }}">[All publications &rarr;]</a></p>
