<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'client_id', 'service_id', 'user_id',
        'start_time', 'end_time', 'price',
        'master_share', 'studio_share'
    ];
    protected $casts = [
    'start_time' => 'datetime',
    'end_time' => 'datetime',
];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}