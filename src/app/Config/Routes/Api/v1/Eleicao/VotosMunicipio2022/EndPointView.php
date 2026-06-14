<?php
// Rotas REST para consulta da view view_votos_municipio_2022
// POST {{www}}/index.php/api/v1/votos-municipio-2022-view/find?page=1&limit=20&sort=id&order=ASC
$routes->post('find', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::find');
// POST {{www}}/index.php/api/v1/votos-municipio-2022-view/get-grouped?page=1&limit=20&sort=id&order=ASC
$routes->post('get-grouped', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::getGrouped');
// GET  {{www}}/index.php/api/v1/votos-municipio-2022-view/search?q=termo&page=1&limit=20&sort=id&order=ASC
$routes->get('search', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::search');
// GET  {{www}}/index.php/api/v1/votos-municipio-2022-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::get/$1');
// GET  {{www}}/index.php/api/v1/votos-municipio-2022-view/get-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::getAll');
// GET  {{www}}/index.php/api/v1/votos-municipio-2022-view/get-no-pagination?sort=id&order=ASC
$routes->get('get-no-pagination', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::getNoPagination');
// GET  {{www}}/index.php/api/v1/votos-municipio-2022-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::getDeleted/$1');
// GET  {{www}}/index.php/api/v1/votos-municipio-2022-view/get-all-with-deleted?page=1&limit=20&sort=id&order=ASC
$routes->get('get-all-with-deleted', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::getAllWithDeleted');
// GET  {{www}}/index.php/api/v1/votos-municipio-2022-view/get-deleted-all?page=1&limit=20&sort=id&order=ASC
$routes->get('get-deleted-all', 'Api\V1\Eleicao\VotosMunicipio2022\ResourceViewController::getDeletedAll');
