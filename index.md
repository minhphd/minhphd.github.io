---
layout: default
---

<header class="intro intro-home">
  <div class="intro-text">
    <h1>Minh Pham-Dinh <span class="fellow-stamp" data-a7="fellowship"><i class="fa-solid fa-award" aria-hidden="true"></i>Kahlert Fellow</span></h1>
    <p class="subtitle">PhD student making <span class="circled" style="--delay:.5s">multimodal agents</span> more capable and adaptable</p>
    <p class="byline"><a class="link" href="{{ site.affiliation_link }}">Kahlert School of Computing</a> &middot; <a class="link" href="https://www.utah.edu/">University of Utah</a></p>
    <p class="affil">Advised by <a class="link" href="https://kennethmarino.com/">Kenneth Marino</a> &middot; {{ site.email }}</p>
    {% include reviewer2.html %}
    <p class="link-row">
      <a href="{{ site.google_scholar }}"><i class="ai ai-google-scholar"></i><span class="bracket">Scholar</span></a>
      <a href="{{ '/cv/' | relative_url }}"><i class="ai ai-cv"></i><span class="bracket">CV</span></a>
      <a href="{{ site.github_link }}"><i class="fa-brands fa-github"></i><span class="bracket">GitHub</span></a>
      <a href="{{ site.linkedin }}"><i class="fa-brands fa-linkedin"></i><span class="bracket">LinkedIn</span></a>
      <a href="{{ site.twitter }}"><i class="fa-brands fa-x-twitter"></i><span class="bracket">X</span></a>
      <a href="{{ site.bluesky }}"><i class="fa-brands fa-bluesky"></i><span class="bracket">Bluesky</span></a>
    </p>
  </div>
  <figure class="photo">
    <img class="portrait" src="{{ site.avatar | relative_url }}" alt="Portrait of {{ site.title }}">
    <span class="note" aria-hidden="true">hi, that's me!<svg viewBox="0 0 34 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c9-4 19-3 28 7"/><path d="M22 14l8 0 -1-8"/></svg></span>
  </figure>
</header>

<div class="duo">
<section class="section" id="about">
  <h2 class="section-head"><span class="section-number">01</span>About</h2>
  <div class="prose" markdown="1">

I am a **PhD student at the University of Utah**, advised by Professor [Kenneth Marino](https://kennethmarino.com/). These days I am mostly interested in <strong class="marker">enhancing the general capabilities and adaptation of multimodal agents</strong>: agents that see, read, and act, and that can pick up new skills and adjust to unfamiliar environments without being retrained from scratch.

Before Utah, I completed my undergraduate degree at [Colby College](https://www.colby.edu/), where I conducted AI and assistive robotics research at the Davis Institute for Artificial Intelligence and the INSITE Lab. I'm always open to collaborations on agents, both on screens and in the physical world.

  </div>
</section>

<section class="section" id="news">
  <h2 class="section-head"><span class="section-number">02</span>News</h2>
  {% include news.md %}
</section>
</div>

<section class="section" id="publications">
  <h2 class="section-head"><span class="section-number">03</span>Selected Publications</h2>
  {% include notable_pubs.md %}
</section>

<section class="section" id="contact">
  <h2 class="section-head"><span class="section-number">04</span>Contact</h2>
  {% include contact.md %}
</section>
