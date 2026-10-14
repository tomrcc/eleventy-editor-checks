---
title: CHECK-7 Liquid include snippet
layout: layouts/page.liquid
---
Instance A, comma after the name:

{% include "snippets/notice.liquid", message: "CHECK-7A message" %}

Instance B, no comma:

{% include "snippets/notice.liquid" message: "CHECK-7B message" %}
