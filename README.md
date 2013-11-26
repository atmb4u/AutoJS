## AutoJS v0.9.2 ##
--------------

![AutoJS](https://raw.github.com/atmb4u/AutoJS/master/demo/images/autojs.png)

AutoJS is a library to continuously autocomplete textarea based on a standard dictionary.
Dictionary has been deviced based on researches and linguistic methods, keeping an eye on minimizing the size of the library.
Complete project is written in plain js, with no external dependencies, and it's size is reduced to mere 6kb.

### NB: Completes each suggested word on a right arrow (→) press. ###

## Installation and Usage ##
----------------------

Its pretty straight forward. 

* Include the js on the head.
* Call the AutoSuggestControl on page load. Alternatively, you can do it on jQuery.ready()

```javascript
      window.onload = function () {
          var area = new AutoSuggestControl("text-area");    
          }
```


## License ##
-------

This software is licensed under the New BSD License. See the LICENSE file in the top distribution directory for the full license text.

## References ##
----------

* Word Frequency and Word Length - Peter Norvig - http://norvig.com/mayzner.html 
* AutoComplete barebones - Nicholas A. Zakas - http://oak.cs.ucla.edu/cs144/projects/javascript/suggest1.html
