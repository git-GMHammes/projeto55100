<?php
// Rotas REST para manipulação da tabela user_003_customer_files
// POST {{www}}/index.php/api/v1/user-customer-files/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\User\UserCustomerFiles\ResourceTableController::find');
// POST {{www}}/index.php/api/v1/user-customer-files/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\User\UserCustomerFiles\ResourceTableController::getGrouped');
// GET  {{www}}/index.php/api/v1/user-customer-files/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\User\UserCustomerFiles\ResourceTableController::search');
// GET  {{www}}/index.php/api/v1/user-customer-files/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::get/$1');
// GET  {{www}}/index.php/api/v1/user-customer-files/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\User\UserCustomerFiles\ResourceTableController::getAll');
// GET  {{www}}/index.php/api/v1/user-customer-files/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\User\UserCustomerFiles\ResourceTableController::getNoPagination');
// GET  {{www}}/index.php/api/v1/user-customer-files/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-customer-files/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::getAllWithDeleted/$1');
// GET  {{www}}/index.php/api/v1/user-customer-files/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\User\UserCustomerFiles\ResourceTableController::getAllWithDeleted');
// GET  {{www}}/index.php/api/v1/user-customer-files/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\User\UserCustomerFiles\ResourceTableController::getDeletedAll');
// GET  {{www}}/index.php/api/v1/user-customer-files/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/user-customer-files/create
$routes->post('create', 'Api\V1\User\UserCustomerFiles\ResourceTableController::create');
// {{www}}/index.php/api/v1/user-customer-files/update/{id}
$routes->put('update/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/user-customer-files/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/user-customer-files/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/user-customer-files/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/user-customer-files/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\User\UserCustomerFiles\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/user-customer-files/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::clearDeleted/$1');
// {{www}}/index.php/api/v1/user-customer-files/upload-avatar/{id}
$routes->post('upload-avatar/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::uploadAvatar/$1');
// {{www}}/index.php/api/v1/user-customer-files/upload-files/{id}
$routes->post('upload-files/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceTableController::uploadFiles/$1');
