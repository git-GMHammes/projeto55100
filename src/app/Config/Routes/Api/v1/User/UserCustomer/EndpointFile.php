<?php
// Rotas REST para manipulação da tabela user_002_customer
// POST {{www}}/index.php/api/v1/user-customer-file/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\User\UserCustomer\ResourceFileController::find');
// POST {{www}}/index.php/api/v1/user-customer-file/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\User\UserCustomer\ResourceFileController::getGrouped');
// GET  {{www}}/index.php/api/v1/user-customer-file/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\User\UserCustomer\ResourceFileController::search');
// GET  {{www}}/index.php/api/v1/user-customer-file/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::get/$1');
// GET  {{www}}/index.php/api/v1/user-customer-file/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\User\UserCustomer\ResourceFileController::getAll');
// GET  {{www}}/index.php/api/v1/user-customer-file/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\User\UserCustomer\ResourceFileController::getNoPagination');
// GET  {{www}}/index.php/api/v1/user-customer-file/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-customer-file/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\User\UserCustomer\ResourceFileController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/user-customer-file/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/user-customer-file/create
$routes->post('create', 'Api\V1\User\UserCustomer\ResourceFileController::create');
// {{www}}/index.php/api/v1/user-customer-file/update/{id}
$routes->put('update/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::update/$1');
// {{www}}/index.php/api/v1/user-customer-file/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::deleteSoft/$1');
// {{www}}/index.php/api/v1/user-customer-file/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::deleteRestore/$1');
// {{www}}/index.php/api/v1/user-customer-file/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::deleteHard/$1');
// {{www}}/index.php/api/v1/user-customer-file/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\User\UserCustomer\ResourceFileController::clearDeleted');
// {{www}}/index.php/api/v1/user-customer-file/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::clearDeleted/$1');
// {{www}}/index.php/api/v1/user-customer-file/upload-avatar/{id}
$routes->post('upload-avatar/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::uploadAvatar/$1');
// {{www}}/index.php/api/v1/user-customer-file/upload-file/{id}
$routes->post('upload-file/(:num)', 'Api\V1\User\UserCustomer\ResourceFileController::uploadFile/$1');
