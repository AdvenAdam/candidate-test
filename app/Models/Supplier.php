<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'material_type',
    ];

    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}
