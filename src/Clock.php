<?php

declare(strict_types = 1);

namespace Timvandendries\Clock;

/**
 * Renders a clock from PHP. The options are the same as for clock.js,
 * written as a PHP array; see README.md for all of them.
 *
 * echo new Clock(['displays' => ['analog', 'digital'], 'analog' => ['size' => 200]]);
 */
class Clock {

    /**
     * URL of clock.js. When NULL, the script is inlined (once per request).
     */
    public static ?string $scriptSrc = NULL;

    private static bool $scriptRendered = FALSE;

    public function __construct(public array $options = []) {
    }

    public function render() : string {

        $json = json_encode((object) $this->options, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        return '<div data-clock="' . htmlspecialchars($json, ENT_QUOTES) . '"></div>' . self::script();

    }

    public function __toString() : string {
        return $this->render();
    }

    private static function script() : string {

        if (self::$scriptRendered) {
            return '';
        }
        self::$scriptRendered = TRUE;

        if (self::$scriptSrc !== NULL) {
            return '<script src="' . htmlspecialchars(self::$scriptSrc, ENT_QUOTES) . '"></script>';
        }

        return '<script>' . file_get_contents(__DIR__ . '/../clock.js') . '</script>';

    }

}
