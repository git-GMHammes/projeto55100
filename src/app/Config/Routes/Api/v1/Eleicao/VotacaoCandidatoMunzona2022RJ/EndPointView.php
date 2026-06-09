<?php
// Rotas REST para consulta da view view_votacao_candidato_munzona_2022_RJ_group
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/find
$routes->post('find', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::find');
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/get-grouped
$routes->post('get-grouped', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/search
$routes->get('search', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::search');
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/get-all
$routes->get('get-all', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/get-all-with-deleted
$routes->get('get-all-with-deleted', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::getAllWithDeleted');
// {{www}}/index.php/api/v1/votacao-candidato-munzona-2022-rj-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\ResourceViewController::getDeletedAll');
