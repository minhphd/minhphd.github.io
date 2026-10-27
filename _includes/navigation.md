{% for link in site.data.navigation.main %}
  {% assign href = link.url | relative_url %}
  {% unless forloop.first %}<span class="op" aria-hidden="true">+</span>{% endunless %}
  <a href="{{ href }}"{% if page.url == link.url %} aria-current="page"{% endif %}>{{ link.title }}</a>
{% endfor %}
