<?php

namespace App\Requests\V1\Eleicao\MandatarioRJ;

class CreateRequest
{
    public function rules(): array
    {
        return [
            'candidato_2022_RJ_id'     => 'permit_empty|is_natural_no_zero',
            'candidato_2024_RJ_id'     => 'permit_empty|is_natural_no_zero',
            'cargo_politico'           => 'permit_empty|string|max_length[50]',
            'suplente_candidato_RJ_id' => 'permit_empty|is_natural_no_zero',
            'ocupa_instituicao'        => 'permit_empty|string|max_length[200]',
            'cargo_instituicao'        => 'permit_empty|string|max_length[200]',
            'partido_politico'         => 'permit_empty|string|max_length[10]',
            'nome_politico'            => 'permit_empty|string|max_length[200]',
            'dt_nascimento'            => 'permit_empty|valid_date[Y-m-d]',
            'municipio_mandato'        => 'permit_empty|string|max_length[200]',
            'whatsapp'                 => 'permit_empty|string|max_length[50]',
            'youtube'                  => 'permit_empty|string|max_length[200]',
            'facebook'                 => 'permit_empty|string|max_length[200]',
            'instagram'                => 'permit_empty|string|max_length[200]',
            'email'                    => 'permit_empty|valid_email|max_length[200]',
            'qtd_votos'                => 'permit_empty|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'email' => [
                'valid_email' => 'O campo e-mail deve conter um endereço válido.',
            ],
        ];
    }
}
