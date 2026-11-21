<?php

/**
 * @copyright Copyright (C) 2026 Mark Buckwell
 * @license GPL-2.0-or-later
 */

namespace FestiveOverlay\Plugin\System\FestiveOverlay\Extension;

use Joomla\CMS\Document\HtmlDocument;
use Joomla\CMS\Event\Application\AfterDispatchEvent;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Uri\Uri;
use Joomla\Event\SubscriberInterface;

defined('_JEXEC') or die;

final class FestiveOverlay extends CMSPlugin implements SubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return ['onAfterDispatch' => 'onAfterDispatch'];
    }

    public function onAfterDispatch(AfterDispatchEvent $event): void
    {
        $app = $event->getApplication();

        if (!$app->isClient('site') || !(bool) $this->params->get('enabled', 0)) {
            return;
        }

        $document = $app->getDocument();

        if (!$document instanceof HtmlDocument || $app->getInput()->getCmd('tmpl') === 'component') {
            return;
        }

        $base = Uri::root(true) . '/media/plg_system_festiveoverlay/';
        $effect = (string) $this->params->get('effect', 'auto');
        $palette = (string) $this->params->get('palette', 'auto');
        $position = (string) $this->params->get('position', 'above-walks');
        $document->addScriptOptions('plg_system_festiveoverlay', [
            'enabled' => true,
            'effect' => in_array($effect, ['auto', 'snow', 'fireworks'], true) ? $effect : 'auto',
            'season_start' => self::seasonDate((string) $this->params->get('season_start', '12-01'), '12-01'),
            'season_end' => self::seasonDate((string) $this->params->get('season_end', '01-06'), '01-06'),
            'sleigh' => (bool) $this->params->get('sleigh', 1),
            'drone' => (bool) $this->params->get('drone', 1),
            'sound' => (bool) $this->params->get('sound', 1),
            'palette' => in_array($palette, ['auto', 'light', 'dark'], true) ? $palette : 'auto',
            'position' => in_array($position, ['above-walks', 'bottom-left', 'bottom-right'], true) ? $position : 'above-walks',
        ]);
        $assets = $document->getWebAssetManager();
        $assets->registerAndUseStyle(
            'plg_system_festiveoverlay.overlay',
            $base . 'css/overlay.css',
            ['version' => 'auto']
        );
        $assets->registerAndUseScript(
            'plg_system_festiveoverlay.overlay',
            $base . 'js/overlay.js',
            ['version' => 'auto'],
            ['defer' => true],
            ['core']
        );
    }

    private static function seasonDate(string $value, string $fallback): string
    {
        if (!preg_match('/^(\d{2})-(\d{2})$/D', $value, $parts)) {
            return $fallback;
        }

        return checkdate((int) $parts[1], (int) $parts[2], 2000) ? $value : $fallback;
    }
}
