<?php
// Rotas REST para manipulação da tabela user_002_customer
// {{www}}/index.php/api/v1/user-customer/find
$routes->post('find', 'Api\V1\User\UserCustomer\ResourceTableController::find');
// {{www}}/index.php/api/v1/user-customer/get-grouped
$routes->post('get-grouped', 'Api\V1\User\UserCustomer\ResourceTableController::getGrouped');
// {{www}}/index.php/api/v1/user-customer/search
$routes->get('search', 'Api\V1\User\UserCustomer\ResourceTableController::search');
// {{www}}/index.php/api/v1/user-customer/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::get/$1');
// {{www}}/index.php/api/v1/user-customer/get-all
$routes->get('get-all', 'Api\V1\User\UserCustomer\ResourceTableController::getAll');
// {{www}}/index.php/api/v1/user-customer/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\User\UserCustomer\ResourceTableController::getNoPagination');
// {{www}}/index.php/api/v1/user-customer/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::getDeleted/$1');

// {{www}}/index.php/api/v1/user-customer/get-all-with-deleted/{id}
$routes->get('get-all-with-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::getAllWithDeleted/$1');
// {{www}}/index.php/api/v1/user-customer/get-all-with-deleted
$routes->get('get-all-with-deleted', 'Api\V1\User\UserCustomer\ResourceTableController::getAllWithDeleted');

// {{www}}/index.php/api/v1/user-customer/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\User\UserCustomer\ResourceTableController::getDeletedAll');
// {{www}}/index.php/api/v1/user-customer/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/user-customer/create
$routes->post('create', 'Api\V1\User\UserCustomer\ResourceTableController::create');
// {{www}}/index.php/api/v1/user-customer/update/{id}
$routes->put('update/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/user-customer/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/user-customer/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/user-customer/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/user-customer/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\User\UserCustomer\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/user-customer/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::clearDeleted/$1');
// {{www}}/index.php/api/v1/user-customer/upload-avatar/{id}
$routes->post('upload-avatar/(:num)', 'Api\V1\User\UserCustomer\ResourceTableController::uploadAvatar/$1');
