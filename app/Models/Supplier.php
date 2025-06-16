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
    public static function seedDefaults()
    {
        $defaults = [
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ];

        return collect($defaults)->map(fn($data) => self::firstOrCreate($data));
    }

    public static function allClt()
    {
        return self::where('material_type', 'clt')->get();
    }

    public static function allGlt()
    {
        return self::where('material_type', 'glt')->get();
    }

    public static function randomByType(string $type): ?self
    {
        return self::where('material_type', $type)->inRandomOrder()->first();
    }
}
