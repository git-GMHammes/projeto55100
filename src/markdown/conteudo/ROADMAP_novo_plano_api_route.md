# ROADMAP — Construção de API para Qualquer Tabela ou View

> Referência para criar um novo módulo REST do zero.
> Modelo de referência: módulo `UserCustomer` (`user_002_customer`).

---

## 1. Tipos de módulo

| Tipo      | Herança do Controller         | Herança do Service | Endpoints                         |
| --------- | ----------------------------- | ------------------ | --------------------------------- |
| **Table** | `BaseResourceTableController` | `BaseTableService` | 17 (leitura + escrita + exclusão) |
| **View**  | `BaseResourceViewController`  | `BaseViewService`  | 8 (somente leitura)               |
| **File**  | `BaseResourceTableController` | `BaseTableService` | 17 + uploads                      |

> Um módulo completo geralmente possui os três tipos em sub-rotas distintas:
> `/feature`, `/feature-view` e `/feature-file`.

---

## 2. Convenção de nomes

| Conceito            | Convenção                           | Exemplo              |
| ------------------- | ----------------------------------- | -------------------- |
| Feature (kebab)     | `nome-da-feature`                   | `user-customer`      |
| Namespace PHP       | `PascalCase`                        | `UserCustomer`       |
| Tabela SQL          | `prefixo_NNN_nome`                  | `user_002_customer`  |
| View SQL            | `view_nome` ou `v_prefixo_NNN_nome` | `view_customer`      |
| Pasta de módulo     | Igual ao namespace                  | `User/UserCustomer/` |
| Endpoint de tabela  | `/api/v1/user-customer/...`         | —                    |
| Endpoint de view    | `/api/v1/user-customer-view/...`    | —                    |
| Endpoint de arquivo | `/api/v1/user-customer-file/...`    | —                    |

---

## 3. Estrutura de arquivos por módulo

```
src/app/
├── Config/Routes/Api/v1/{Grupo}/{Modulo}/
│   ├── EndpointTable.php          ← rotas do tipo Table
│   ├── EndPointView.php           ← rotas do tipo View
│   └── EndpointFile.php           ← rotas do tipo File (se houver upload)
│
├── Controllers/Api/V1/{Grupo}/{Modulo}/
│   ├── ResourceTableController.php
│   ├── ResourceViewController.php
│   └── ResourceFileController.php (se houver upload dedicado)
│
├── Requests/V1/{Grupo}/{Modulo}/
│   ├── CreateRequest.php
│   ├── UpdateRequest.php
│   ├── FindRequestTable.php
│   ├── FindRequestView.php
│   ├── GetGroupedRequestTable.php
│   └── GetGroupedRequestView.php
│
├── Services/V1/{Grupo}/{Modulo}/
│   └── Processor.php
│
└── Models/V1/{Grupo}/{Modulo}/
    ├── SqlTableModel.php
    └── SqlViewModel.php
```

---

## 4. Registro das rotas no CI4

As rotas de cada módulo **não são declaradas diretamente** em `Config/Routes.php`.
Cada arquivo `Endpoint*.php` é carregado pelo Routes principal via `require`.

Padrão de registro em `Config/Routes.php` (ou no arquivo de grupo de rotas):

```php
// Table
$routes->group('user-customer', static function ($routes) {
    require __DIR__ . '/Routes/Api/v1/User/UserCustomer/EndpointTable.php';
});

// View
$routes->group('user-customer-view', static function ($routes) {
    require __DIR__ . '/Routes/Api/v1/User/UserCustomer/EndPointView.php';
});

// File
$routes->group('user-customer-file', static function ($routes) {
    require __DIR__ . '/Routes/Api/v1/User/UserCustomer/EndpointFile.php';
});
```

---

## 5. Endpoints — Referência completa

### 5.1 Table (`EndpointTable.php`) — 17 rotas

```php
<?php
// Rotas REST — tabela {nome_da_tabela}

// Leitura paginada
$routes->post('find',                    'Api\V1\{Grupo}\{Modulo}\ResourceTableController::find');
$routes->post('get-grouped',             'Api\V1\{Grupo}\{Modulo}\ResourceTableController::getGrouped');
$routes->get('search',                   'Api\V1\{Grupo}\{Modulo}\ResourceTableController::search');
$routes->get('get/(:num)',               'Api\V1\{Grupo}\{Modulo}\ResourceTableController::get/$1');
$routes->get('get-all',                  'Api\V1\{Grupo}\{Modulo}\ResourceTableController::getAll');
$routes->get('get-no-pagination',        'Api\V1\{Grupo}\{Modulo}\ResourceTableController::getNoPagination');

// Leitura com soft delete
$routes->get('get-deleted/(:num)',           'Api\V1\{Grupo}\{Modulo}\ResourceTableController::getDeleted/$1');
$routes->get('get-with-deleted/(:num)',      'Api\V1\{Grupo}\{Modulo}\ResourceTableController::getWithDeleted/$1');
$routes->get('get-deleted-all',              'Api\V1\{Grupo}\{Modulo}\ResourceTableController::getDeletedAll');
$routes->get('get-all-with-deleted/(:num)',  'Api\V1\{Grupo}\{Modulo}\ResourceTableController::getAllWithDeleted/$1');
$routes->get('get-all-with-deleted',         'Api\V1\{Grupo}\{Modulo}\ResourceTableController::getAllWithDeleted');

// Escrita
$routes->post('create',             'Api\V1\{Grupo}\{Modulo}\ResourceTableController::create');
$routes->put('update/(:num)',       'Api\V1\{Grupo}\{Modulo}\ResourceTableController::update/$1');

// Exclusão
$routes->delete('delete-soft/(:num)',    'Api\V1\{Grupo}\{Modulo}\ResourceTableController::deleteSoft/$1');
$routes->patch('delete-restore/(:num)',  'Api\V1\{Grupo}\{Modulo}\ResourceTableController::deleteRestore/$1');
$routes->delete('delete-hard/(:num)',    'Api\V1\{Grupo}\{Modulo}\ResourceTableController::deleteHard/$1');
$routes->delete('clear-deleted',         'Api\V1\{Grupo}\{Modulo}\ResourceTableController::clearDeleted');
$routes->delete('clear-deleted/(:num)',  'Api\V1\{Grupo}\{Modulo}\ResourceTableController::clearDeleted/$1');
```

### 5.2 View (`EndPointView.php`) — 8 rotas

```php
<?php
// Rotas REST — view {nome_da_view}

$routes->post('find',                  'Api\V1\{Grupo}\{Modulo}\ResourceViewController::find');
$routes->post('get-grouped',           'Api\V1\{Grupo}\{Modulo}\ResourceViewController::getGrouped');
$routes->get('search',                 'Api\V1\{Grupo}\{Modulo}\ResourceViewController::search');
$routes->get('get/(:num)',             'Api\V1\{Grupo}\{Modulo}\ResourceViewController::get/$1');
$routes->get('get-all',                'Api\V1\{Grupo}\{Modulo}\ResourceViewController::getAll');
$routes->get('get-no-pagination',      'Api\V1\{Grupo}\{Modulo}\ResourceViewController::getNoPagination');
$routes->get('get-deleted/(:num)',     'Api\V1\{Grupo}\{Modulo}\ResourceViewController::getDeleted/$1');
$routes->get('get-deleted-all',        'Api\V1\{Grupo}\{Modulo}\ResourceViewController::getDeletedAll');
```

### 5.3 File (`EndpointFile.php`) — 17 + 2 rotas de upload

```php
<?php
// Todas as rotas de EndpointTable.php (com ResourceFileController) +

$routes->post('upload-avatar/(:num)', 'Api\V1\{Grupo}\{Modulo}\ResourceFileController::uploadAvatar/$1');
$routes->post('upload-file/(:num)',   'Api\V1\{Grupo}\{Modulo}\ResourceFileController::uploadFile/$1');
```

---

## 6. Model — SqlTableModel

```php
<?php
namespace App\Models\V1\{Grupo}\{Modulo};

use App\Models\V1\BaseTableModel;

class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;   // constante definida em Config/Database.php
    protected $table        = 'nome_da_tabela';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    /** Colunas que podem ser gravadas. Exclui: PK, timestamps, colunas geradas. */
    protected $allowedFields = [
        'campo_a',
        'campo_b',
        // ...
    ];

    /**
     * Campos que usam LIKE %valor% em find/getGrouped.
     * Campos numéricos, IDs e datas ficam fora desta lista (usam WHERE exato).
     */
    protected array $likeFields = [
        'campo_texto_a',
        'campo_texto_b',
    ];

    /** Colunas permitidas em ORDER BY — proteção contra SQL injection. */
    protected array $sortableFields = [
        'id',
        'campo_a',
        'created_at',
        'updated_at',
    ];

    /** Colunas usadas na busca textual (GET /search). */
    public array $searchFields = [
        'campo_texto_a',
        'campo_texto_b',
    ];

    // -------------------------------------------------------------------------
    // Verificações de unicidade — adicionar apenas para campos UNIQUE na tabela
    // -------------------------------------------------------------------------

    public function existsByEmail(string $email, ?int $excludeId = null): bool
    {
        return $this->existsByField('email', $email, $excludeId);
    }

    // -------------------------------------------------------------------------
    // Verificações de integridade referencial (FK)
    // -------------------------------------------------------------------------

    public function existsParentRecord(int $parentId): bool
    {
        return $this->db->table('tabela_pai')
            ->where('id', $parentId)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }
}
```

**Métodos herdados de `BaseTableModel` — não reimplementar:**

| Método                          | Uso                                    |
| ------------------------------- | -------------------------------------- |
| `findPaginated()`               | find, getAll (com filtros)             |
| `findGrouped()`                 | getGrouped (WHERE IN)                  |
| `searchByTerm()`                | search                                 |
| `getOrdered()`                  | getNoPagination                        |
| `findOnlyDeleted()`             | getDeleted (ID)                        |
| `findWithDeleted()`             | getWithDeleted, getAllWithDeleted (ID) |
| `findDeletedPaginated()`        | getDeletedAll                          |
| `findAllWithDeletedPaginated()` | getAllWithDeleted (lista)              |
| `restore()`                     | deleteRestore                          |
| `clearDeleted()`                | clearDeleted                           |
| `existsByField()`               | base para verificações de unicidade    |

---

## 7. Model — SqlViewModel

```php
<?php
namespace App\Models\V1\{Grupo}\{Modulo};

use App\Models\V1\BaseViewModel;

class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'nome_da_view';
    protected $primaryKey = 'id';

    /**
     * Campos de texto que usam LIKE %valor% no findPaginatedView.
     * Normalmente os campos com prefixo da view (ex.: uc_name).
     */
    protected array $likeFields = [
        'campo_prefixado_a',
        'campo_prefixado_b',
    ];

    /** Colunas permitidas em ORDER BY. */
    protected array $sortableFields = [
        'id',
        'campo_prefixado_a',
        'created_at',
        'updated_at',
    ];

    /** Colunas usadas na busca textual (GET /search). */
    public array $searchFields = [
        'campo_prefixado_a',
        'campo_prefixado_b',
    ];
}
```

**Métodos herdados de `BaseViewModel` — não reimplementar:**

| Método                              | Uso                      |
| ----------------------------------- | ------------------------ |
| `findPaginatedView()`               | find, getAll (view)      |
| `findGroupedView()`                 | getGrouped (view)        |
| `searchByTermView()`                | search (view)            |
| `findById()`                        | get (view)               |
| `findDeletedById()`                 | getDeleted (view)        |
| `findDeletedPaginatedView()`        | getDeletedAll (view)     |
| `findAllWithDeletedPaginatedView()` | getAllWithDeleted (view) |
| `findAllView()`                     | getNoPagination (view)   |

---

## 8. Service — Processor

### 8.1 Módulo com Tabela (herda `BaseTableService`)

```php
<?php
namespace App\Services\V1\{Grupo}\{Modulo};

use App\Models\V1\{Grupo}\{Modulo}\SqlTableModel;
use App\Models\V1\{Grupo}\{Modulo}\SqlViewModel;
use App\Services\V1\BaseTableService;

class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel  $viewModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }

    // -------------------------------------------------------------------------
    // Hook: validações de negócio antes do INSERT
    // Retorne ['success' => false, 'message' => '...', 'code' => N] em conflito.
    // Retorne null para prosseguir.
    // -------------------------------------------------------------------------

    protected function validateOnCreate(array $data): ?array
    {
        // Verificar FK obrigatória
        if (!empty($data['parent_id']) && !$this->tableModel->existsParentRecord((int) $data['parent_id'])) {
            return ['success' => false, 'message' => 'Registro pai não encontrado', 'code' => 422];
        }

        // Verificar unicidade de campo UNIQUE
        if (!empty($data['email']) && $this->tableModel->existsByEmail($data['email'])) {
            return ['success' => false, 'message' => 'E-mail já cadastrado', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hook: validações antes do UPDATE (excluindo o próprio registro via excludeId)
    // -------------------------------------------------------------------------

    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!empty($data['email']) && $this->tableModel->existsByEmail($data['email'], $id)) {
            return ['success' => false, 'message' => 'E-mail já cadastrado', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hook: transformações de dados antes do INSERT
    // -------------------------------------------------------------------------

    protected function prepareData(array $data): array
    {
        if (isset($data['date_field'])) {
            $data['date_field'] = $this->formatDate($data['date_field']);
        }

        if (isset($data['datetime_field'])) {
            $data['datetime_field'] = $this->formatDatetime($data['datetime_field']);
        }

        // hash de senha, geração de UUID, etc.

        return $data;
    }

    // -------------------------------------------------------------------------
    // Hook: transformações de dados antes do UPDATE
    // Por padrão delega para prepareData. Sobrescrever para remover campos imutáveis.
    // -------------------------------------------------------------------------

    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['campo_imutavel']); // ex.: FK de criação, user_id original

        return $this->prepareData($data);
    }
}
```

**Fluxo do `create` (Template Method — não sobrescrever):**

```
sanitizeData + removeMasks → validateOnCreate → prepareData → insert
```

**Fluxo do `update` (Template Method — não sobrescrever):**

```
find → sanitizeData + removeMasks → prepareUpdateData → validateOnUpdate → update
```

### 8.2 Módulo somente View (herda `BaseViewService`)

```php
<?php
namespace App\Services\V1\{Grupo}\{Modulo};

use App\Models\V1\{Grupo}\{Modulo}\SqlViewModel;
use App\Services\V1\BaseViewService;

class Processor extends BaseViewService
{
    protected SqlViewModel $viewModel;

    public function __construct()
    {
        $this->viewModel = new SqlViewModel();
    }
}
```

**Métodos herdados de `BaseViewService` disponíveis no Processor:**

| Método de Service         | Endpoint correspondente   |
| ------------------------- | ------------------------- |
| `findView()`              | POST /find                |
| `getGroupedView()`        | POST /get-grouped         |
| `searchView()`            | GET /search               |
| `getView()`               | GET /get/{id}             |
| `getAllView()`            | GET /get-all              |
| `getNoPaginationView()`   | GET /get-no-pagination    |
| `getDeletedView()`        | GET /get-deleted/{id}     |
| `getDeletedAllView()`     | GET /get-deleted-all      |
| `getAllWithDeletedView()` | GET /get-all-with-deleted |

**Utilitários disponíveis em qualquer Processor (herdados de `BaseViewService`):**

| Método                    | Descrição                                              |
| ------------------------- | ------------------------------------------------------ |
| `sanitizeString()`        | Remove tags HTML e espaços extras de uma string        |
| `sanitizeData()`          | Sanitiza array: strip_tags + trim + remove nulos/vazio |
| `removeMasks()`           | Remove máscaras (CPF, WhatsApp, telefone, CEP)         |
| `formatDate()`            | Formata qualquer data para `Y-m-d`                     |
| `formatDatetime()`        | Formata para `Y-m-d H:i:s` (aceita `Y-m-d\TH:i`)       |
| `buildPaginationParams()` | Normaliza page/limit/sort/order com limites seguros    |

---

## 9. Controllers

### 9.1 ResourceTableController

```php
<?php
namespace App\Controllers\Api\V1\{Grupo}\{Modulo};

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\{Grupo}\{Modulo}\CreateRequest;
use App\Requests\V1\{Grupo}\{Modulo}\UpdateRequest;
use App\Services\V1\{Grupo}\{Modulo}\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class ResourceTableController extends BaseResourceTableController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }

    protected function getCreateRules(): array
    {
        return (new CreateRequest())->rules();
    }

    protected function getUpdateRules(): array
    {
        return (new UpdateRequest())->rules();
    }

    // Sobrescrever handleInlineUpload() SOMENTE se o módulo aceitar
    // upload embutido no mesmo endpoint de create/update.
    // Caso contrário, não declarar — o método base retorna null.
}
```

### 9.2 ResourceViewController

```php
<?php
namespace App\Controllers\Api\V1\{Grupo}\{Modulo};

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Services\V1\{Grupo}\{Modulo}\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class ResourceViewController extends BaseResourceViewController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }
    // Nenhum método a declarar — tudo herdado.
}
```

### 9.3 ResourceFileController (upload dedicado)

```php
<?php
namespace App\Controllers\Api\V1\{Grupo}\{Modulo};

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Libraries\FileUploadLibrary;
use App\Requests\V1\{Grupo}\{Modulo}Files\CreateRequest;
use App\Requests\V1\{Grupo}\{Modulo}Files\UpdateRequest;
use App\Requests\V1\{Grupo}\{Modulo}Files\UploadAvatarRequest;
use App\Requests\V1\{Grupo}\{Modulo}Files\UploadFileRequest;
use App\Services\V1\{Grupo}\{Modulo}Files\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class ResourceFileController extends BaseResourceTableController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }

    protected function getCreateRules(): array
    {
        return (new CreateRequest())->rules();
    }

    protected function getUpdateRules(): array
    {
        return (new UpdateRequest())->rules();
    }

    public function uploadAvatar(int $id): ResponseInterface
    {
        try {
            $file = $this->request->getFile('file');

            if (!$file || !$file->isValid()) {
                return $this->respondValidationError(['file' => 'Arquivo inválido ou não enviado']);
            }

            $body     = $this->getRequestBody();
            $tenantId = (int) ($body['user_saas_tenants_id'] ?? 0);

            if ($tenantId <= 0) {
                return $this->respondValidationError(['user_saas_tenants_id' => 'Informe user_saas_tenants_id no body da requisição']);
            }

            $constraints = new UploadAvatarRequest();
            $library     = new FileUploadLibrary();
            $result      = $library->upload($id, $constraints->moduleSlug(), [$file], $constraints, $tenantId);

            if (!$result['success'] && isset($result['code'])) {
                return $this->respondError($result['message'], $result['code']);
            }

            $first = $result['results'][0] ?? ['success' => false, 'message' => 'Nenhum arquivo processado'];

            if (!$first['success']) {
                return $this->respondError($first['message'], 422);
            }

            return $this->respondSuccess($first['data'], 'Avatar enviado com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    public function uploadFile(int $id): ResponseInterface
    {
        try {
            $files = $this->request->getFiles()['files'] ?? [];

            if (empty($files)) {
                return $this->respondValidationError(['files' => 'Nenhum arquivo enviado. Use o campo files[] no multipart/form-data']);
            }

            $body     = $this->getRequestBody();
            $tenantId = (int) ($body['user_saas_tenants_id'] ?? 0);

            if ($tenantId <= 0) {
                return $this->respondValidationError(['user_saas_tenants_id' => 'Informe user_saas_tenants_id no body da requisição']);
            }

            $constraints = new UploadFileRequest();
            $library     = new FileUploadLibrary();
            $result      = $library->upload($id, $constraints->moduleSlug(), $files, $constraints, $tenantId);

            if (!$result['success'] && isset($result['code'])) {
                return $this->respondError($result['message'], $result['code']);
            }

            return $this->respondSuccess([
                'results'       => $result['results'],
                'total'         => $result['total'],
                'success_count' => $result['success_count'],
                'error_count'   => $result['error_count'],
            ], 'Upload processado');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }
}
```

**Helpers de resposta disponíveis em qualquer controller (herdados de `BaseResourceTableController`):**

| Método                     | HTTP | Uso                                         |
| -------------------------- | ---- | ------------------------------------------- |
| `respondSuccess()`         | 200  | Operação bem-sucedida com dados             |
| `respondCreated()`         | 201  | Registro criado                             |
| `respondPaginated()`       | 200  | Lista paginada (inclui objeto `pagination`) |
| `respondNotFound()`        | 404  | Registro não encontrado                     |
| `respondValidationError()` | 422  | Erros de validação do CI4                   |
| `respondError()`           | N    | Erro de negócio (código customizável)       |
| `respondServerError()`     | 500  | Exceção não tratada (loga automaticamente)  |

---

## 10. Requests

### 10.1 CreateRequest

```php
<?php
namespace App\Requests\V1\{Grupo}\{Modulo};

class CreateRequest
{
    public function rules(): array
    {
        return [
            'campo_obrigatorio'  => 'required|is_natural_no_zero',
            'campo_texto'        => 'permit_empty|string|max_length[150]',
            'campo_email'        => 'permit_empty|valid_email|max_length[150]',
            'campo_data'         => 'permit_empty|valid_date[Y-m-d]',
            'campo_datetime'     => 'permit_empty|string|max_length[30]',
            'campo_inteiro'      => 'permit_empty|integer',
            'campo_decimal'      => 'permit_empty|decimal',
        ];
    }

    public function messages(): array
    {
        return [
            'campo_obrigatorio' => [
                'required'           => 'O campo é obrigatório',
                'is_natural_no_zero' => 'O campo deve ser um número inteiro positivo',
            ],
            // ...
        ];
    }
}
```

### 10.2 UpdateRequest

```php
<?php
namespace App\Requests\V1\{Grupo}\{Modulo};

class UpdateRequest
{
    public function rules(): array
    {
        return [
            // Todos os campos são permit_empty no update.
            // Campos imutáveis (FK de criação) não devem aparecer aqui —
            // são removidos em prepareUpdateData() no Processor.
            'campo_texto'    => 'permit_empty|string|max_length[150]',
            'campo_email'    => 'permit_empty|valid_email|max_length[150]',
            'campo_data'     => 'permit_empty|valid_date[Y-m-d]',
        ];
    }

    public function messages(): array
    {
        return [
            // ...
        ];
    }
}
```

### 10.3 FindRequestTable e FindRequestView

```php
<?php
namespace App\Requests\V1\{Grupo}\{Modulo};

class FindRequestTable  // ou FindRequestView
{
    public function rules(): array
    {
        return [
            'filters' => 'permit_empty|is_array',
        ];
    }

    public function messages(): array
    {
        return [
            'filters' => [
                'is_array' => 'O campo filters deve ser um objeto/array JSON válido',
            ],
        ];
    }
}
```

### 10.4 GetGroupedRequestTable e GetGroupedRequestView

```php
<?php
namespace App\Requests\V1\{Grupo}\{Modulo};

class GetGroupedRequestTable  // ou GetGroupedRequestView
{
    public function rules(): array
    {
        return [];
        // Validação das chaves dinâmicas é feita no controller base.
    }
}
```

---

## 11. Hierarquia de herança — resumo visual

```
BaseController (CI4)
└── BaseResourceTableController          ← 17 endpoints + helpers de resposta
    ├── ResourceTableController          ← declara processor + getCreateRules + getUpdateRules
    └── ResourceFileController           ← idem + uploadAvatar + uploadFile
    └── BaseResourceViewController       ← sela hooks de escrita, substitui leitura por métodos *View
        └── ResourceViewController       ← só declara processor

BaseViewService                          ← utilitários + leitura de view
└── BaseTableService                     ← leitura de tabela + escrita + exclusão
    └── Processor (módulo com tabela)    ← sobrescreve hooks de validação/preparação

BaseTableModel (CI4 Model)               ← todos os métodos de consulta e escrita
└── SqlTableModel                        ← $table, $allowedFields, $likeFields, etc.

BaseViewModel (CI4 Model)                ← todos os métodos de consulta read-only
└── SqlViewModel                         ← $table, $likeFields, etc.
```

---

## 12. Checklist de criação — módulo Table completo

- [ ] Criar tabela SQL com `id`, `deleted_at`, `created_at`, `updated_at`
- [ ] Criar view SQL (JOIN da tabela com suas FKs, campos prefixados)
- [ ] `SqlTableModel` — $table, $allowedFields, $likeFields, $sortableFields, $searchFields, métodos de unicidade/FK
- [ ] `SqlViewModel` — $table, $likeFields, $sortableFields, $searchFields
- [ ] `Processor` — construtor com os dois models, hooks de validação e preparação
- [ ] `CreateRequest` — regras para POST /create
- [ ] `UpdateRequest` — regras para PUT /update/{id}
- [ ] `FindRequestTable` — regras para POST /find (tabela)
- [ ] `FindRequestView` — regras para POST /find (view)
- [ ] `GetGroupedRequestTable` — rules() vazio (tabela)
- [ ] `GetGroupedRequestView` — rules() vazio (view)
- [ ] `ResourceTableController` — initController + getCreateRules + getUpdateRules
- [ ] `ResourceViewController` — apenas initController
- [ ] `EndpointTable.php` — 17 rotas apontando para ResourceTableController
- [ ] `EndPointView.php` — 8 rotas apontando para ResourceViewController
- [ ] Registrar os grupos de rota no arquivo de Routes do CI4

---

## 13. Checklist adicional — módulo File (upload dedicado)

- [ ] Tabela de arquivos (ex.: `modulo_003_files`) com `original_name`, `filename`, `stored_path`, `uuid`, `mime`, `size`, `category`, `checksum`
- [ ] `SqlTableModel` para a tabela de arquivos
- [ ] `Processor` para a tabela de arquivos (herda `BaseTableService`)
- [ ] `UploadAvatarRequest` — `moduleSlug()` + restrições de tipo/tamanho para imagem
- [ ] `UploadFileRequest` — `moduleSlug()` + restrições de tipo/tamanho para arquivos gerais
- [ ] `CreateRequest` e `UpdateRequest` para a tabela de arquivos
- [ ] `ResourceFileController` — initController + getCreateRules + getUpdateRules + uploadAvatar + uploadFile
- [ ] `EndpointFile.php` — 17 rotas padrão + upload-avatar/{id} + upload-file/{id}
- [ ] Registrar o grupo de rota de arquivo no Routes do CI4

---

## 14. Query string — parâmetros de paginação

Todos os endpoints paginados aceitam os mesmos parâmetros na query string:

| Parâmetro | Padrão | Limites    | Descrição                                  |
| --------- | ------ | ---------- | ------------------------------------------ |
| `page`    | `1`    | >= 1       | Página atual                               |
| `limit`   | `20`   | 1 a 1000   | Registros por página                       |
| `sort`    | `id`   | allowlist  | Campo para ORDER BY (veja $sortableFields) |
| `order`   | `desc` | asc / desc | Direção da ordenação                       |

Exemplo: `GET /api/v1/user-customer/get-all?page=2&limit=50&sort=name&order=asc`

---

## 15. Formato padrão das respostas JSON

### Sucesso (200/201)

```json
{
  "method": "GET",
  "endpoint": "/index.php/api/v1/user-customer/get/1",
  "statusCode": 200,
  "message": "Registro encontrado com sucesso",
  "success": true,
  "data": {}
}
```

### Lista paginada (200)

```json
{
  "method": "GET",
  "endpoint": "/index.php/api/v1/user-customer/get-all",
  "statusCode": 200,
  "message": "Registros listados com sucesso",
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Erro de validação (422)

```json
{
  "method": "POST",
  "endpoint": "/index.php/api/v1/user-customer/create",
  "statusCode": 422,
  "message": "Erro de validação",
  "success": false,
  "errors": {
    "campo": "mensagem de erro"
  }
}
```

### Erro de negócio (4xx)

```json
{
  "statusCode": 409,
  "message": "E-mail já cadastrado",
  "success": false
}
```

### Erro de servidor (500)

```json
{
  "statusCode": 500,
  "message": "Erro interno no servidor",
  "success": false,
  "debug": {
    "exception": "RuntimeException",
    "message": "...",
    "file": "...",
    "line": 42
  }
}
```

> O bloco `debug` aparece apenas quando `ENVIRONMENT === 'development'`.

---

## 16. Campos com máscara — remoção automática

Os seguintes campos têm máscara removida automaticamente pelo `removeMasks()` do `BaseViewService` antes de qualquer consulta ou persistência:

| Campo na tabela | Campo na view |
| --------------- | ------------- |
| `cpf`           | `uc_cpf`      |
| `whatsapp`      | `uc_whatsapp` |
| `phone`         | `uc_phone`    |
| `zip_code`      | `uc_zip_code` |

Para adicionar novos campos com máscara, editar a constante `MASKED_FIELDS` em `BaseViewService`.

---

## 17. Upload inline vs. upload dedicado

| Cenário                                           | Abordagem                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Upload junto com create/update do próprio módulo  | Sobrescrever `handleInlineUpload()` no `ResourceTableController`                         |
| Upload em endpoint separado (`/upload-file/{id}`) | Criar `ResourceFileController` com métodos `uploadAvatar` e `uploadFile`                 |
| Upload em endpoint genérico herdável              | Declarar `$moduleSlug` no controller e adicionar rota para `uploadAttachments()` herdado |

O `BaseResourceTableController::handleInlineUpload()` é chamado automaticamente após `create()` e `update()` — por padrão retorna `null` (sem upload). Sobrescrever apenas nos módulos que precisam.
