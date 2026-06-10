<?php
// Rotas REST para consulta da view user_002_customer_view
// POST {{www}}/index.php/api/v1/user-customer-view/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\User\UserCustomer\ResourceViewController::find');
// POST {{www}}/index.php/api/v1/user-customer-view/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\User\UserCustomer\ResourceViewController::getGrouped');
// GET  {{www}}/index.php/api/v1/user-customer-view/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\User\UserCustomer\ResourceViewController::search');
// GET  {{www}}/index.php/api/v1/user-customer-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\User\UserCustomer\ResourceViewController::get/$1');
// GET  {{www}}/index.php/api/v1/user-customer-view/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\User\UserCustomer\ResourceViewController::getAll');
// GET  {{www}}/index.php/api/v1/user-customer-view/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\User\UserCustomer\ResourceViewController::getNoPagination');
// GET  {{www}}/index.php/api/v1/user-customer-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\User\UserCustomer\ResourceViewController::getDeleted/$1');

// GET  {{www}}/index.php/api/v1/user-customer-view/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\User\UserCustomer\ResourceViewController::getAllWithDeleted');

// GET  {{www}}/index.php/api/v1/user-customer-view/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\User\UserCustomer\ResourceViewController::getDeletedAll');
