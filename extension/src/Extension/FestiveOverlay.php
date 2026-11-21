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
            ['defer' => true]
        );
    }
}
