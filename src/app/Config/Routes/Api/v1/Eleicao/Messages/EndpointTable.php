<?php
// Rotas REST para manipulação da tabela messages
// POST {{www}}/index.php/api/v1/messages/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\Eleicao\Messages\ResourceTableController::find');
// POST {{www}}/index.php/api/v1/messages/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\Eleicao\Messages\ResourceTableController::getGrouped');
// GET  {{www}}/index.php/api/v1/messages/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\Eleicao\Messages\ResourceTableController::search');
// GET  {{www}}/index.php/api/v1/messages/get/{id}
$routes->get('get/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::get/$1');
// GET  {{www}}/index.php/api/v1/messages/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\Eleicao\Messages\ResourceTableController::getAll');
// GET  {{www}}/index.php/api/v1/messages/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\Eleicao\Messages\ResourceTableController::getNoPagination');
// GET  {{www}}/index.php/api/v1/messages/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::getDeleted/$1');

// GET  {{www}}/index.php/api/v1/messages/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::getAllWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/messages/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\Eleicao\Messages\ResourceTableController::getAllWithDeleted');

// GET  {{www}}/index.php/api/v1/messages/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\Eleicao\Messages\ResourceTableController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/messages/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/messages/create
$routes->post('create', 'Api\V1\Eleicao\Messages\ResourceTableController::create');
// {{www}}/index.php/api/v1/messages/update/{id}
$routes->put('update/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/messages/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/messages/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/messages/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/messages/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\Eleicao\Messages\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/messages/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\Eleicao\Messages\ResourceTableController::clearDeleted/$1');
