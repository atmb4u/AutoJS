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

You can either specify the id of the element or the selected element itself. Thanks to @samshull


## License ##
-------

This software is licensed under the New BSD License. See the LICENSE file in the top distribution directory for the full license text.

## References ##
----------

* Word Frequency and Word Length - Peter Norvig - http://norvig.com/mayzner.html 
* AutoComplete barebones - Nicholas A. Zakas - http://oak.cs.ucla.edu/cs144/projects/javascript/suggest1.html


## Developers ##
-----------

** Welcome! **

Feel free to fork and send pull requests. There is a very good chance of getting accepted, if found working and useful.

NB: Just run the ** compress.sh ** if possible (needs yuicompressor nodejs module and tar - for update all min and compressed files), before you send in the pull request. 

Check TODO file or the issues logged into [github](https://github.com/atmb4u/AutoJS/issues)
