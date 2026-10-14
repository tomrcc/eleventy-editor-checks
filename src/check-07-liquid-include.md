---
_schema: default
title: CHECK-7 Liquid include snippet
layout: layouts/page.liquid
---
Instance A, comma after the name:

{% include "snippets/notice.liquid", message: "CHECK-7 edited" %}

Instance B, no comma:

{% include "snippets/notice.liquid" message: "CHECK-7 edited" %}

{% include 'snippets/notice.liquid', message: "CHECK-7 new" %}