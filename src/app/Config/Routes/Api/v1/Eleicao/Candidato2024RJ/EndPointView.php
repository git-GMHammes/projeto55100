<?php
// Rotas REST para consulta da view view_candidato_2024_RJ
// POST {{www}}/index.php/api/v1/candidato-2024-rj-view/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::find');
// POST {{www}}/index.php/api/v1/candidato-2024-rj-view/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::getGrouped');
// GET  {{www}}/index.php/api/v1/candidato-2024-rj-view/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::search');
// GET  {{www}}/index.php/api/v1/candidato-2024-rj-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::get/$1');
// GET  {{www}}/index.php/api/v1/candidato-2024-rj-view/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::getAll');
// GET  {{www}}/index.php/api/v1/candidato-2024-rj-view/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::getNoPagination');
// GET  {{www}}/index.php/api/v1/candidato-2024-rj-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/candidato-2024-rj-view/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::getAllWithDeleted');
// GET  {{www}}/index.php/api/v1/candidato-2024-rj-view/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\Eleicao\Candidato2024RJ\ResourceViewController::getDeletedAll');
