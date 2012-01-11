mh-node
==============================================================

A NodeJS HTTP Proxy of Modify Headers Firefox add-on.

This proxy reads JSON configuration file exported by the add-on and
runs an HTTP proxy server which acts as Modify Headers filter.

Requirement
-----------

It's required NodeJS v0.6.x or higher.

Installation
------------

> cp mh-node.js /whereeveryouwant
> chmod +x mh-node.js

Configuration
-------------

Inside mh-node.js there's a short configuration section you can modify
in according to your needs.

Run proxy server
----------------

> ./mh-node.js

or 

> node mh-node.hs


License
-------
* [Licensed under the Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.txt)
