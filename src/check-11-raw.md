---
title: CHECK-11 Raw tag with a one-entry import
layout: layouts/page.liquid
---
Paragraph before the raw tag.

{% raw %}CHECK-11 literal: {{ not_a_variable }}{% endraw %}

Paragraph after the raw tag.
