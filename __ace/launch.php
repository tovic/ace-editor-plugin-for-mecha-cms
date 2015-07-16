<?php

$ace_config = File::open(PLUGIN . DS . File::B(__DIR__) . DS . 'states' . DS . 'config.txt')->unserialize();

define('ACE_CONFIG_THEME', $ace_config['theme']);
define('ACE_CONFIG_TAB_SIZE', $ace_config['tab_size']);
foreach($ace_config['state'] as $key => $value) {
    define('ACE_CONFIG_STATE_' . strtoupper($key), $value);
}

Weapon::add('shell_after', function() {
    echo Asset::stylesheet('cabinet/plugins/' . File::B(__DIR__) . '/assets/shell/ace.css');
});

Weapon::add('SHIPMENT_REGION_BOTTOM', function() use($config) {
    echo Asset::javascript($config->protocol . 'cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ace.js');
    echo Asset::javascript('cabinet/plugins/' . File::B(__DIR__) . '/assets/sword/ace.js');
});

Route::accept($config->manager->slug . '/plugin/' . File::B(__DIR__) . '/update', function() use($config, $speak) {
    $state = PLUGIN . DS . File::B(__DIR__) . DS . 'states' . DS;
    $ace_config_default = include $state . 'repair.state.config.php';
    if($request = Request::post()) {
        Guardian::checkToken($request['token']);
        unset($request['token']);
        if( ! isset($request['state'])) {
            $request['state'] = array();
        }
        $request['state'] = array_merge($ace_config_default['state'], $request['state']);
        $request['tab_size'] = (int) str_replace('size_', "", $request['tab_size']);
        File::serialize($request)->saveTo($state . 'config.txt', 0600);
        Notify::success(Config::speak('notify_success_updated', $speak->plugin));
        Guardian::kick(File::D($config->url_current));
    }
});