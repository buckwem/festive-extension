<?php
/** Run with PHP 8.3+: behaviour checks against small Joomla API test doubles. */
namespace Joomla\CMS\Plugin {
    class CMSPlugin {
        protected $params;
        public function __construct($dispatcher, array $config) { $this->params = new \TestParams($config['params']); }
    }
}
namespace Joomla\Event {
    interface SubscriberInterface { public static function getSubscribedEvents(): array; }
}
namespace Joomla\CMS\Document {
    class HtmlDocument {
        public array $options = [];
        public \TestAssets $assets;
        public function __construct() { $this->assets = new \TestAssets(); }
        public function addScriptOptions($name, $options) { $this->options[$name] = $options; }
        public function getWebAssetManager() { return $this->assets; }
    }
}
namespace Joomla\CMS\Event\Application {
    class AfterDispatchEvent {
        public function __construct(private $app) {}
        public function getApplication() { return $this->app; }
    }
}
namespace Joomla\CMS\Uri {
    class Uri {
        public static string $siteRoot = 'https://example.test/joomla-subdirectory/';
        public static function root($pathOnly = false) {
            return $pathOnly ? rtrim(parse_url(self::$siteRoot, PHP_URL_PATH), '/') : self::$siteRoot;
        }
    }
}
namespace {
    define('_JEXEC', 1);
    class TestParams {
        public function __construct(private array $values) {}
        public function get($key, $default = null) { return $this->values[$key] ?? $default; }
    }
    class TestAssets {
        public array $styles = [], $scripts = [];
        public function registerAndUseStyle(...$args) { $this->styles[] = $args; }
        public function registerAndUseScript(...$args) { $this->scripts[] = $args; }
    }
    class TestInput {
        public function __construct(private string $template) {}
        public function getCmd($key) { return $this->template; }
    }
    class TestApplication {
        public function __construct(private $document, private string $client, private string $template) {}
        public function isClient($value) { return $this->client === $value; }
        public function getDocument() { return $this->document; }
        public function getInput() { return new TestInput($this->template); }
    }
    function expect($condition, $message) { if (!$condition) { throw new \RuntimeException($message); } }
    require __DIR__ . '/../extension/src/Extension/FestiveOverlay.php';
    function runPlugin(array $params, string $client = 'site', string $template = '', bool $html = true) {
        $document = $html ? new \Joomla\CMS\Document\HtmlDocument() : new \stdClass();
        $plugin = new \FestiveOverlay\Plugin\System\FestiveOverlay\Extension\FestiveOverlay(null, ['params' => $params]);
        $plugin->onAfterDispatch(new \Joomla\CMS\Event\Application\AfterDispatchEvent(new TestApplication($document, $client, $template)));
        return $document;
    }
    foreach ([['params' => []], ['params' => ['enabled' => 0]], ['params' => ['enabled' => 1], 'client' => 'administrator'],
        ['params' => ['enabled' => 1], 'template' => 'component']] as $case) {
        $doc = runPlugin(...$case);
        expect(!$doc->options && !$doc->assets->scripts && !$doc->assets->styles, 'Excluded page received assets');
    }
    expect(runPlugin(['enabled' => 1], html: false) instanceof \stdClass, 'Non-HTML response was changed');
    foreach ([[null, '01-01'], ['12-31', '12-31'], ['02-29', '02-29'], ['02-30', '01-01']] as [$start, $expected]) {
        $params = ['enabled' => 1];
        if ($start !== null) {
            $params['fireworks_start'] = $start;
        }
        $doc = runPlugin($params);
        expect($doc->options['plg_system_festiveoverlay']['fireworks_start'] === $expected, 'Fireworks start date is incorrect');
    }
    foreach ([[null, 24], ['1', 1], ['2', 2], ['24', 24], ['0', 24], ['25', 24], ['2.5', 24]] as [$hours, $expected]) {
        $params = ['enabled' => 1];
        if ($hours !== null) {
            $params['fireworks_hours'] = $hours;
        }
        $doc = runPlugin($params);
        expect($doc->options['plg_system_festiveoverlay']['fireworks_hours'] === $expected, 'Fireworks duration is incorrect');
    }
    $doc = runPlugin(['enabled' => 1, 'effect' => 'fireworks', 'sleigh' => '0', 'drone' => '0', 'sound' => '0',
        'season_start' => '02-30', 'season_end' => 'bad', 'palette' => 'wrong', 'position' => 'bottom-left']);
    $options = $doc->options['plg_system_festiveoverlay'];
    expect($options['enabled'] === true && $options['sleigh'] === false && $options['drone'] === false && $options['sound'] === false, 'JSON booleans are incorrect');
    expect($options['season_start'] === '12-01' && $options['season_end'] === '12-30', 'Invalid dates did not fall back');
    expect($options['palette'] === 'auto' && $options['position'] === 'bottom-left', 'Appearance options are incorrect');
    expect($doc->assets->scripts[0][4] === ['core'], 'Joomla core dependency is missing');
    foreach (['https://example.test/', 'https://example.test/joomla-subdirectory/',
        'https://example.test/joomla-subdirectory'] as $root) {
        \Joomla\CMS\Uri\Uri::$siteRoot = $root;
        $assets = runPlugin(['enabled' => 1])->assets;
        $base = rtrim($root, '/') . '/media/plg_system_festiveoverlay/';
        expect($assets->scripts[0][1] === $base . 'js/overlay.js', 'Script URL is incorrect');
        expect($assets->styles[0][1] === $base . 'css/overlay.css', 'Stylesheet URL is incorrect');
        expect(parse_url($assets->scripts[0][1], PHP_URL_HOST) === 'example.test', 'Asset escaped the site host');
    }
    $doc = runPlugin(['enabled' => 1, 'effect' => '<script>', 'season_start' => '02-29', 'season_end' => '12-31']);
    expect($doc->options['plg_system_festiveoverlay']['effect'] === 'auto', 'Unknown effect was not rejected');
    expect($doc->options['plg_system_festiveoverlay']['season_start'] === '02-29', 'Valid leap date was rejected');
    expect($doc->options['plg_system_festiveoverlay']['position'] === 'above-walks', 'Default heading position was lost');
    echo "Passed plugin client/document guards, settings, date validation and absolute root/subdirectory asset URLs.\n";
}
