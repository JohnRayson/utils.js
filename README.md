# utils.js
A library of useful javascript utilities, built ontop of jQuery and Bootstap

Initilising:

Add to the page in the head, after the includion of jQuery and Bootstrap js / css
```html
<script src="utils.js"></script>
<script src="utils-ui.js"></script>
```

Features:
```javascript
$.utils.createUUID() 
// returns a UUID

$.utils.toRGB(string:hex)
// converts a hex number into an object of the form { r:nn, g:nn, b:nn }

$.utils.vars.set(string:key, object:value, bool:fixed) 
// adds a variable to the utils.vars object and controls whether it can be changed

$.utils.vars.get(string:key, bool:info) 
// gets a value from the utils.vars object info returns the settign s as well as the value

$.utils.localStorage(string:appId, bool:persist) 
// returns a refernce to either localStorage || sessionStorage that has associated functions for managing data

$.utils.setAjaxOptions(object:options) 
// sets global ajax options to avoid passing the same information into each calling

$.utils.ajax(object:options) 
// calls $.ajax using global ajax options extended with what ever you pass in

$.utils.await(array:calls, function:complete)
// calls a function after a number of ajax calls have all completed
```

