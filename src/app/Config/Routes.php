<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api/v1', function ($routes) {

    // =========================================================================
    // /User — Módulo de usuários e autenticação
    // =========================================================================

    $routes->group('auth', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/AuthUser/EndPointView.php';
    });

    $routes->group('user-management', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserManagement/EndpointTable.php';
    });

    $routes->group('user-customer', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserCustomer/EndpointTable.php';
    });

    $routes->group('user-customer-view', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserCustomer/EndPointView.php';
    });

    $routes->group('user-customer-file', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserCustomer/EndpointFile.php';
    });

    $routes->group('user-customer-files', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserCustomerFiles/EndpointTable.php';
    });

    $routes->group('user-customer-files-view', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserCustomerFiles/EndPointView.php';
    });

    $routes->group('user-password-resets', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserPasswordResets/EndpointTable.php';
    });

    $routes->group('user-saas-tenants', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserSaasTenants/EndpointTable.php';
    });

    $routes->group('user-tenants', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserTenants/EndpointTable.php';
    });

    $routes->group('user-tenants-view', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserTenants/EndPointView.php';
    });
});
