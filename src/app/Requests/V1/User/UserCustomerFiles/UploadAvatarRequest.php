<?php

namespace App\Requests\V1\User\UserCustomerFiles;

class UploadAvatarRequest
{
    public function allowedMimes(): array
    {
        return ['image/jpeg', 'image/png', 'image/webp'];
    }

    public function maxSizeMb(): int
    {
        return 5;
    }

    public function moduleSlug(): string
    {
        return 'user-customer-file';
    }

    public function category(): string
    {
        return 'avatar';
    }
}
