# utils.js
A library of useful javascript utilities, including automatically pulling in dependencies such as jQuery. 

Initilising:

Add to the page in the head
```html
<script src="utils.js"></script>
```

This will force the load of external sripts defined in the utils.require object
Don't worry if you want differnt versions, just load them in the head of your document prior to the utils.js tag

Before calling any of the functions of utils.js that are dependent of the external libraries you need to wait for them to be loaded, this is done through the utils.ready() function.
```javascript
<script>
utils.ready(function()
{
	utils.alert("Utils loaded");
});
</script>
```
Inside the utils.ready() you will have access to all entire utlis.js features, as well as jQuery, jQueryUI, moment.js, & toastr.js

Features:
* utils.createUUID() 
..*returns a UUID

* utils.set(string:key, object:value, bool:fixed) 
..*adds a variable to the utils.vars object and controls whether it can be changed

* utils.get(string:key, bool:info) 
..*gets a value from the utils.vars object info returns the settign s as well as the value

* utils.localStorage(string:appId, bool:persist) 
..*returns a refernce to either localStorage || sessionStorage that has associated functions for managing data

* utils.alert(string:message) 
..*jQueryUI alert box (requires you to include jQueryUI CSS - of your choice)

* utils.userChoice(string:title, string:message, object:options) 
..*jQueryUI dialog wrapper

* utils.setAjaxOptions(object:options) 
..*sets global ajax options to avoid passing the same information into each calling

* utils.ajax(object:options) 
..*calls $.ajax using global ajax options extended with what ever you pass in

* utils.await(array:calls, function:complete)
..*calls a function after a number of ajax calls have all completed


