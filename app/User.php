<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\EmailMaketing\Entities\EmailForms;

class User extends Authenticatable
{
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'username',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    protected $dates = ['deleted_at'];
    /*
    |--------------------------------------------------------------------------
    | ACL Methods
    |--------------------------------------------------------------------------
    */
    /**
     * Checks a Permission
     *
     * @param  String permission Slug of a permission (i.e: manage_user)
     * @return Boolean true if has permission, otherwise false
     */
    public function havePermission($permission = null)
    {
        return !is_null($permission) && $this->checkPermission($permission);
    }

    public function accessTab($tab = null)
    {
        return !is_null($tab) && $this->checkTab($tab);
    }

    public function isStaff()
    {
        return $this->role == 1;
    }

    public function isAdmin()
    {
        return $this->role == 2;
    }

    public function current_role()
    {
        return $this->belongsTo('App\Role', 'role_id');
    }

    /**
     * Check if the permission matches with any permission user has
     *
     * @param  String permission slug of a permission
     * @return Boolean true if permission exists, otherwise false
     */
    protected function checkPermission($perm)
    {
        $permissions = $this->getAllPernissionsFormAllRoles();
        $permissionArray = is_array($perm) ? $perm : [$perm];

        return count(array_intersect($permissions, $permissionArray));
    }

    protected function checkTab($tab)
    {
        $tabs = $this->getAllTabsFromAllRoles();
        $tabArray = is_array($tab) ? $tab : [$tab];

        return count(array_intersect($tabs, $tabArray));
    }

    /**
     * Get all permission slugs from all permissions of all roles
     *
     * @return Array of permission slugs
     */
    protected function getAllPernissionsFormAllRoles()
    {
        $permissionsArray = [];
        $permissions = $this->roles->load('permissions')->fetch('permissions')->toArray();
        return array_map('strtolower', array_unique(array_flatten(array_map(function ($permission) {
            return array_fetch($permission, 'permission_slug');

        }, $permissions))));
    }

    protected function getAllTabsFromAllRoles()
    {
        $tabs = $this->roles->load('tabs')->fetch('tabs')->toArray();
        return array_map('strtolower', array_unique(array_flatten(array_map(function ($tab) {
            return array_fetch($tab, 'tab_slug');
        }, tabs))));
    }

    /*
    |--------------------------------------------------------------------------
    | Relationship Methods
    |--------------------------------------------------------------------------
    */


    public function registers()
    {
        return $this->hasMany('App\Register', 'user_id', 'id');
    }

    public function teach()
    {
        return $this->hasMany('App\StudyClass', 'teacher_id', 'id');
    }

    public function assist()
    {
        return $this->hasMany('App\StudyClass', 'teaching_assistant_id', 'id');
    }

    public function calls()
    {
        return $this->hasMany('App\TeleCall', 'caller_id', 'id');
    }

    public function is_called()
    {
        return $this->hasMany('App\TeleCall', 'student_id');
    }

    public function get_money()
    {
        return $this->hasMany('App\Register', 'staff_id');
    }

    public function send_transactions()
    {
        return $this->hasMany('App\Transaction', 'sender_id');
    }

    public function receive_transactions()
    {
        return $this->hasMany('App\Transaction', 'receiver_id');
    }

    public function products()
    {
        return $this->hasMany('App\Product', 'author_id');
    }

    public function likes()
    {
        return $this->hasMany('App\Like', 'liker_id');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment', 'commenter_id');
    }

    public function acted_notifications()
    {
        return $this->hasMany('App\Notification', 'actor_id');
    }

    public function received_notifications()
    {
        return $this->hasMany('App\Notification', 'receiver_id');
    }

    public function surveys()
    {
        return $this->hasMany('App\Survey', 'user_id');
    }

    public function survey_users()
    {
        return $this->hasMany('App\SurveyUser', 'user_id');
    }

    public function views()
    {
        return $this->hasMany('App\View', 'viewer_id');
    }

    public function images()
    {
        return $this->hasMany('App\Image', 'owner_id');
    }

    public function email_templates()
    {
        return $this->hasMany('App\EmailTemplate', 'owner_id');
    }

    public function votes()
    {
        return $this->hasMany('App\Vote', 'voter_id');
    }

    public function cvs()
    {
        return $this->hasMany('App\CV', 'user_id');
    }

    public function cv()
    {
        return $this->belongsTo('App\CV', 'cv_id');
    }

    public function groups()
    {
        return $this->belongsToMany('App\Group', 'group_members', 'user_id', 'group_id');
    }

    public function sale_registers()
    {
        return $this->hasMany('App\Register', 'saler_id');
    }
    public function base(){
        return $this->belongsTo(Base::class,'base_id');
    }

    public function email_forms(){
        return $this->hasMany(EmailForms::class, 'creator');
    }
}

