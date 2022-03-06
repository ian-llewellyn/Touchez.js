# Touchez.js
Touchez.js - pronounced 'to shay jay ess' - is a small library used to abstract some of the detail around touch events from the web developer.

## Use
Put this in the `<head>` of your page:
```html
  <script src="touchez.js"></script>
```
Set up your elements to recieve touch events:
```html
var tez = new Touchez(document.getElementsByTagName('div'))
```
And finally, declare what should be done when tapped, double-tapped, or held:
```html
tez.single(function (elem) {elem.style.backgroundColor = '#f00'});
tez.double(function (elem) {elem.style.backgroundColor = '#0f0'});
tez.hold(function (elem) {elem.style.backgroundColor = '#00f'});
```
