<?php
// Rotas REST para manipulação da tabela user_006_password_resets
// POST {{www}}/index.php/api/v1/user-password-resets/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\User\UserPasswordResets\ResourceTableController::find');
// POST {{www}}/index.php/api/v1/user-password-resets/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\User\UserPasswordResets\ResourceTableController::getGrouped');
// GET  {{www}}/index.php/api/v1/user-password-resets/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\User\UserPasswordResets\ResourceTableController::search');
// GET  {{www}}/index.php/api/v1/user-password-resets/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::get/$1');
// GET  {{www}}/index.php/api/v1/user-password-resets/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\User\UserPasswordResets\ResourceTableController::getAll');
// GET  {{www}}/index.php/api/v1/user-password-resets/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\User\UserPasswordResets\ResourceTableController::getNoPagination');
// GET  {{www}}/index.php/api/v1/user-password-resets/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-password-resets/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::getAllWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-password-resets/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\User\UserPasswordResets\ResourceTableController::getAllWithDeleted');
// GET  {{www}}/index.php/api/v1/user-password-resets/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\User\UserPasswordResets\ResourceTableController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/user-password-resets/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/user-password-resets/create
$routes->post('create', 'Api\V1\User\UserPasswordResets\ResourceTableController::create');
// {{www}}/index.php/api/v1/user-password-resets/update/{id}
$routes->put('update/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/user-password-resets/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/user-password-resets/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/user-password-resets/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/user-password-resets/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\User\UserPasswordResets\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/user-password-resets/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\User\UserPasswordResets\ResourceTableController::clearDeleted/$1');
