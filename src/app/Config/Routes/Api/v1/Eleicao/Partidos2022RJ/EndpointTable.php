<?php
// Rotas REST para manipulação da tabela partidos_2022_RJ
// POST {{www}}/index.php/api/v1/partidos-2022-rj/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::find');
// POST {{www}}/index.php/api/v1/partidos-2022-rj/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::getGrouped');
// GET  {{www}}/index.php/api/v1/partidos-2022-rj/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::search');
// GET  {{www}}/index.php/api/v1/partidos-2022-rj/get/{id}
$routes->get('get/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::get/$1');
// GET  {{www}}/index.php/api/v1/partidos-2022-rj/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::getAll');
// GET  {{www}}/index.php/api/v1/partidos-2022-rj/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::getNoPagination');
// GET  {{www}}/index.php/api/v1/partidos-2022-rj/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::getDeleted/$1');

// GET  {{www}}/index.php/api/v1/partidos-2022-rj/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::getAllWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/partidos-2022-rj/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::getAllWithDeleted');

// GET  {{www}}/index.php/api/v1/partidos-2022-rj/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/partidos-2022-rj/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/partidos-2022-rj/create
$routes->post('create', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::create');
// {{www}}/index.php/api/v1/partidos-2022-rj/update/{id}
$routes->put('update/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/partidos-2022-rj/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/partidos-2022-rj/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/partidos-2022-rj/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/partidos-2022-rj/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/partidos-2022-rj/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\Eleicao\Partidos2022RJ\ResourceTableController::clearDeleted/$1');
