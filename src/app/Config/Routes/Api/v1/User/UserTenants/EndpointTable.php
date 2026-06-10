<?php
// Rotas REST para manipulação da tabela user_002_customer
// POST {{www}}/index.php/api/v1/user-tenants/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\User\UserTenants\ResourceTableController::find');
// POST {{www}}/index.php/api/v1/user-tenants/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\User\UserTenants\ResourceTableController::getGrouped');
// GET  {{www}}/index.php/api/v1/user-tenants/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\User\UserTenants\ResourceTableController::search');
// GET  {{www}}/index.php/api/v1/user-tenants/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::get/$1');
// GET  {{www}}/index.php/api/v1/user-tenants/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\User\UserTenants\ResourceTableController::getAll');
// GET  {{www}}/index.php/api/v1/user-tenants/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\User\UserTenants\ResourceTableController::getNoPagination');
// GET  {{www}}/index.php/api/v1/user-tenants/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-tenants/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::getAllWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-tenants/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\User\UserTenants\ResourceTableController::getAllWithDeleted');
// GET  {{www}}/index.php/api/v1/user-tenants/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\User\UserTenants\ResourceTableController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/user-tenants/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/user-tenants/create
$routes->post('create', 'Api\V1\User\UserTenants\ResourceTableController::create');
// {{www}}/index.php/api/v1/user-tenants/update/{id}
$routes->put('update/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/user-tenants/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/user-tenants/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/user-tenants/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/user-tenants/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\User\UserTenants\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/user-tenants/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\User\UserTenants\ResourceTableController::clearDeleted/$1');
