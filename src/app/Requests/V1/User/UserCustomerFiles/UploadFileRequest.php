<?php

namespace App\Requests\V1\User\UserCustomerFiles;

class UploadFileRequest
{
    public function allowedMimes(): array
    {
        return [];
    }

    public function maxSizeMb(): int
    {
        return 10;
    }

    public function moduleSlug(): string
    {
        return 'user-customer-file';
    }

    public function category(): string
    {
        return 'document';
    }
}
