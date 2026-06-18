<?php
// Rotas REST para consulta da view mandatario_RJ (leitura via SqlViewModel)
// POST {{www}}/index.php/api/v1/mandatario-rj-view/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\Eleicao\MandatarioRJ\ResourceViewController::find');
// POST {{www}}/index.php/api/v1/mandatario-rj-view/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\Eleicao\MandatarioRJ\ResourceViewController::getGrouped');
// GET  {{www}}/index.php/api/v1/mandatario-rj-view/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\Eleicao\MandatarioRJ\ResourceViewController::search');
// GET  {{www}}/index.php/api/v1/mandatario-rj-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\Eleicao\MandatarioRJ\ResourceViewController::get/$1');
// GET  {{www}}/index.php/api/v1/mandatario-rj-view/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\Eleicao\MandatarioRJ\ResourceViewController::getAll');
// GET  {{www}}/index.php/api/v1/mandatario-rj-view/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\Eleicao\MandatarioRJ\ResourceViewController::getNoPagination');
// GET  {{www}}/index.php/api/v1/mandatario-rj-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Eleicao\MandatarioRJ\ResourceViewController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/mandatario-rj-view/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\Eleicao\MandatarioRJ\ResourceViewController::getDeletedAll');
