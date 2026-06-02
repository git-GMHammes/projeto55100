<?php
// Rotas REST para consulta da view user_002_customer_view
// {{www}}/index.php/api/v1/user-customer-view/find
$routes->post('find', 'Api\V1\User\UserCustomer\ResourceViewController::find');
// {{www}}/index.php/api/v1/user-customer-view/get-grouped
$routes->post('get-grouped', 'Api\V1\User\UserCustomer\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/user-customer-view/search
$routes->get('search', 'Api\V1\User\UserCustomer\ResourceViewController::search');
// {{www}}/index.php/api/v1/user-customer-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserCustomer\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/user-customer-view/get-all
$routes->get('get-all', 'Api\V1\User\UserCustomer\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/user-customer-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\User\UserCustomer\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/user-customer-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceViewController::getDeleted/$1');

// {{www}}/index.php/api/v1/user-customer-view/get-all-with-deleted
$routes->get('get-all-with-deleted', 'Api\V1\User\UserCustomer\ResourceViewController::getAllWithDeleted');

// {{www}}/index.php/api/v1/user-customer-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\User\UserCustomer\ResourceViewController::getDeletedAll');
