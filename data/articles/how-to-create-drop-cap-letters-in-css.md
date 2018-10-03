---
slug: "how-to-create-drop-cap-letters-in-css"
date: "2013-07-23"
title: "How to Create Drop Cap Letters in CSS"
categories: ["Responsive Website"]
tags: ["css", "css3", "drop cap", "how to", "typography"]
thumb: "creocraft-ventures-thumb.jpg"
excerpt: ""
---
Drop Cap is a traditional newspaper technique of making the first letter of a paragraph capital and take the height of three or four lines. In that way, it is easier to grab the attention of the reader and specify the start of a section.

In this tutorial we are going to implement that style in our css using a new CSS3 technique.

## CSS First Letter
CSS allows you to add a property `:first-letter` which as you can guess allows you to style the first letter of the element.

Consider this paragraph:
```html
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in metus nec mauris egestas laoreet. Integer vehicula velit non massa suscipit at porta sem commodo. Sed suscipit facilisis mi, eu laoreet est gravida eu.</p>
```

We can add the drop cap style to the paragraph using `:first-letter`

```css
p:first-letter {
    display:block;
    float:left;
    font-family:inherit;
    font-size: 360%;
    font-weight: bold;
    line-height: 85%;
    margin-right: 8px;
    margin-top: 5px;
}
```

This css will stylize the first letter exactly how we want.