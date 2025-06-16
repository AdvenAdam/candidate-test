<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('materials')->truncate();
        DB::table('suppliers')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Supplier::seedDefaults();
    }
}
