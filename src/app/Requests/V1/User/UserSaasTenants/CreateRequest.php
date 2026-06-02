<?php

namespace App\Requests\V1\User\UserSaasTenants;

class CreateRequest
{
    public function rules(): array
    {
        return [
            'name'   => 'required|string|max_length[100]',
            'slug'   => 'required|string|max_length[50]',
            'plan'   => 'permit_empty|string|max_length[50]',
            'active' => 'permit_empty|integer|in_list[0,1]',
        ];
    }

    public function messages(): array
    {
        return [
            'name' => [
                'required'   => 'O campo name é obrigatório',
                'max_length' => 'O campo name não pode exceder 100 caracteres',
            ],
            'slug' => [
                'required'   => 'O campo slug é obrigatório',
                'max_length' => 'O campo slug não pode exceder 50 caracteres',
            ],
            'plan' => [
                'max_length' => 'O campo plan não pode exceder 50 caracteres',
            ],
            'active' => [
                'in_list' => 'O campo active deve ser 0 ou 1',
            ],
        ];
    }
}
