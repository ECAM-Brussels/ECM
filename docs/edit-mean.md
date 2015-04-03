Steps to modify MEAN.JS
=======================

Edit the server schema in : 
--------------------------

    > /app/models/*.server.model.js

Edit (or not) the client's routes & templates to use in 
---------------------------------------------------------

    > public\modules\rooms\config

Edit the client's controller in
-----------------------------

    > public/modules/rooms/controllers

Edit edit the client's views in:
--------------------------------------

    > public\modules\rooms\views

- list * = Liste de tous les objets
- view* = La vue d'un objet
- create* = La page de création
- edit = La page d'édition

Edit the way you control data in:

    > /app/controllers/*.server.model.js