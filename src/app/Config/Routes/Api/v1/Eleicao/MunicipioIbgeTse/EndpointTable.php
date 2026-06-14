<?php
// Rotas REST para manipulação da tabela municipio_ibge_tse
// POST {{www}}/index.php/api/v1/municipio-ibge-tse/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::find');
// POST {{www}}/index.php/api/v1/municipio-ibge-tse/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::getGrouped');
// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::search');
// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/get/{id}
$routes->get('get/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::get/$1');
// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::getAll');
// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::getNoPagination');
// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::getDeleted/$1');

// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::getAllWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::getAllWithDeleted');

// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/municipio-ibge-tse/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/municipio-ibge-tse/create
$routes->post('create', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::create');
// {{www}}/index.php/api/v1/municipio-ibge-tse/update/{id}
$routes->put('update/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/municipio-ibge-tse/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/municipio-ibge-tse/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/municipio-ibge-tse/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/municipio-ibge-tse/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/municipio-ibge-tse/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\Eleicao\MunicipioIbgeTse\ResourceTableController::clearDeleted/$1');
