<?php
// Rotas REST para consulta da view user_002_customer_view
// {{www}}/index.php/api/v1/user-tenants-view/find
$routes->post('find', 'Api\V1\User\UserTenants\ResourceViewController::find');
// {{www}}/index.php/api/v1/user-tenants-view/get-grouped
$routes->post('get-grouped', 'Api\V1\User\UserTenants\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/user-tenants-view/search
$routes->get('search', 'Api\V1\User\UserTenants\ResourceViewController::search');
// {{www}}/index.php/api/v1/user-tenants-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserTenants\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/user-tenants-view/get-all
$routes->get('get-all', 'Api\V1\User\UserTenants\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/user-tenants-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\User\UserTenants\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/user-tenants-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserTenants\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/user-tenants-view/get-all-with-deleted
$routes->get('get-all-with-deleted', 'Api\V1\User\UserTenants\ResourceViewController::getAllWithDeleted');
// {{www}}/index.php/api/v1/user-tenants-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\User\UserTenants\ResourceViewController::getDeletedAll');
