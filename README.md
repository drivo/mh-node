mh-node
==============================================================

A NodeJS HTTP Proxy based on [Modify Headers Firefox add-on](https://addons.mozilla.org/en-US/firefox/addon/modify-headers/).

This proxy reads JSON configuration file exported by the add-on and
runs an HTTP proxy server which acts as Modify Headers filter.

Requirement
-----------

It's required [NodeJS v0.6.x](http://nodejs.org/) or higher.

Installation
------------

It's not required the installation. Just copy `mh-nod.js` wherever you want.

You could make mh-node.js executable if you don't want explicitly use node:

    chmod +x mh-node.js

Configuration
-------------

Inside mh-node.js there's a short configuration section you can modify
in according to your needs.

A sample `modifyheaders.json` is provided in the project. You need to
replace it with yours. The modifyheaders.json can be edit manually 
or can be prepared with [Modify Headers Firefox add-on](https://addons.mozilla.org/en-US/firefox/addon/modify-headers/)
and exported by the same tool.

Run
----------------

    node mh-node.hs

or (PATH scope)

    mh-node.js

License
-------
Copyright (C) 2012 by Guido D'Albore. [Licensed under the Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.txt)
