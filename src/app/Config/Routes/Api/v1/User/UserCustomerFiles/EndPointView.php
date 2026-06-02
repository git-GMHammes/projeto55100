<?php
// Rotas REST para consulta da view view_user_customer_files
// {{www}}/index.php/api/v1/user-customer-files-view/find
$routes->post('find', 'Api\V1\User\UserCustomerFiles\ResourceViewController::find');
// {{www}}/index.php/api/v1/user-customer-files-view/get-grouped
$routes->post('get-grouped', 'Api\V1\User\UserCustomerFiles\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/user-customer-files-view/search
$routes->get('search', 'Api\V1\User\UserCustomerFiles\ResourceViewController::search');
// {{www}}/index.php/api/v1/user-customer-files-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/user-customer-files-view/get-all
$routes->get('get-all', 'Api\V1\User\UserCustomerFiles\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/user-customer-files-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\User\UserCustomerFiles\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/user-customer-files-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserCustomerFiles\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/user-customer-files-view/get-all-with-deleted
$routes->get('get-all-with-deleted', 'Api\V1\User\UserCustomerFiles\ResourceViewController::getAllWithDeleted');
// {{www}}/index.php/api/v1/user-customer-files-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\User\UserCustomerFiles\ResourceViewController::getDeletedAll');
