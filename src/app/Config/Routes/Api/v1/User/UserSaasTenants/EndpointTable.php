<?php
// Rotas REST para manipulação da tabela user_004_saas_tenants
// POST {{www}}/index.php/api/v1/user-saas-tenants/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\User\UserSaasTenants\ResourceTableController::find');
// POST {{www}}/index.php/api/v1/user-saas-tenants/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\User\UserSaasTenants\ResourceTableController::getGrouped');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\User\UserSaasTenants\ResourceTableController::search');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::get/$1');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\User\UserSaasTenants\ResourceTableController::getAll');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\User\UserSaasTenants\ResourceTableController::getNoPagination');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::getAllWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\User\UserSaasTenants\ResourceTableController::getAllWithDeleted');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\User\UserSaasTenants\ResourceTableController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/user-saas-tenants/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/user-saas-tenants/create
$routes->post('create', 'Api\V1\User\UserSaasTenants\ResourceTableController::create');
// {{www}}/index.php/api/v1/user-saas-tenants/update/{id}
$routes->put('update/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/user-saas-tenants/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/user-saas-tenants/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/user-saas-tenants/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/user-saas-tenants/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\User\UserSaasTenants\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/user-saas-tenants/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\User\UserSaasTenants\ResourceTableController::clearDeleted/$1');
