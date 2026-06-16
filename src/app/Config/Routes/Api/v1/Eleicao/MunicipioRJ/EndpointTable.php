<?php
// Rotas REST para manipulação da tabela municipio_RJ
// POST {{www}}/index.php/api/v1/municipio-rj/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::find');
// POST {{www}}/index.php/api/v1/municipio-rj/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::getGrouped');
// GET  {{www}}/index.php/api/v1/municipio-rj/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::search');
// GET  {{www}}/index.php/api/v1/municipio-rj/get/{id}
$routes->get('get/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::get/$1');
// GET  {{www}}/index.php/api/v1/municipio-rj/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::getAll');
// GET  {{www}}/index.php/api/v1/municipio-rj/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::getNoPagination');
// GET  {{www}}/index.php/api/v1/municipio-rj/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/municipio-rj/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::getWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/municipio-rj/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/municipio-rj/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::getAllWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/municipio-rj/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::getAllWithDeleted');
// POST {{www}}/index.php/api/v1/municipio-rj/create
$routes->post('create', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::create');
// PUT  {{www}}/index.php/api/v1/municipio-rj/update/{id}
$routes->put('update/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::update/$1');
// DELETE {{www}}/index.php/api/v1/municipio-rj/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::deleteSoft/$1');
// PATCH  {{www}}/index.php/api/v1/municipio-rj/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::deleteRestore/$1');
// DELETE {{www}}/index.php/api/v1/municipio-rj/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::deleteHard/$1');
// DELETE {{www}}/index.php/api/v1/municipio-rj/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::clearDeleted');
// DELETE {{www}}/index.php/api/v1/municipio-rj/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\Eleicao\MunicipioRJ\ResourceTableController::clearDeleted/$1');
