<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'client_id', 'service_id', 'master_id',
        'start_time', 'end_time', 'price',
        'master_share', 'studio_share'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function master()
    {
        return $this->belongsTo(User::class, 'master_id');
    }
}
