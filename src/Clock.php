<?php

declare(strict_types = 1);

namespace Timvandendries\Clock;

/**
 * @property integer $clockSize
 * @property integer $clockHandWidth
 * @property integer $clockBorderWidth
 * @property string $clockBorderColor
 * @property string $clockBackgroundColor
 * @property string $clockHandMinutesColor
 * @property string $clockHandHoursColor
 * @property string $clockHandSecondsColor
 *
 *
 */
class Clock {

    public int $clockSize = 150;
    public int $clockHandWidth = 2;
    public int $clockBorderWidth = 1;
    public string $clockBorderColor = '#000000';
    public string $clockBackgroundColor = '#FFFFFF';
    public string $clockHandHoursColor = '#000000';
    public string $clockHandMinutesColor = '#000000';
    public string $clockHandSecondsColor = '#CC0000';

    public function showClock() : string {

        $css = self::getCSS();
        $javascript = self::getJavascript();
        $html = self::getHTML();
        return $css . $html . $javascript;
    }


    private function getHTML() : string {
        return '<div class=\'TD_clock\'>
                    <div id=\'TD_clock_hours\'></div>
                    <div id=\'TD_clock_minutes\'></div>
                    <div id=\'TD_clock_seconds\'></div>
                </div>';
    }

    private function getCSS() : string {

        $clockHandHeight = ($this->clockSize / 2) - 10;
        $clockHandHeightHours = $clockHandHeight * 0.7;
        $clockHandHeightHoursTop = $clockHandHeight - $clockHandHeightHours + 10;

        $clockBorder = $this->clockBorderWidth == 0 ? 'none' : $this->clockBorderWidth . 'px solid ' . $this->clockBorderColor;

        $TD_clock_CSS = '.TD_clock {
                            position: relative;
                            height: ' . $this->clockSize . 'px;
                            width: ' . $this->clockSize .'px;
                            background-color: ' . $this->clockBackgroundColor . ';
                            border: ' . $clockBorder . '
                            border-radius: 50%;
                        }';

        $TD_clock_div_CSS = '.TD_clock div {
                                position: absolute;
                                top: 10px;
                                left: 50%;
                                height: ' . $clockHandHeight . 'px;
                                width: ' . $this->clockHandWidth . 'px;
                                transform: translateX(50%);
                                transform: rotate(0deg);
                                transform-origin: bottom center;
                            }';

        $TD_clock_hours = '#TD_clock_hours {
                                top: ' . $clockHandHeightHoursTop . 'px;
                                background-color: ' . $this->clockHandMinutesColor . ';
                                height: ' . $clockHandHeightHours . 'px;
                                
                            }';

        $TD_clock_minutes = '#TD_clock_minutes {
                                background-color: ' . $this->clockHandMinutesColor . ';
                            }';

        $TD_clock_seconds = '#TD_clock_seconds {
                                background-color: ' . $this->clockHandSecondsColor . ';
                            }';

        return '<style>' .
            $TD_clock_CSS .
            $TD_clock_div_CSS .
            $TD_clock_hours .
            $TD_clock_minutes .
            $TD_clock_seconds .
            '</style>';

    }


    private static function getJavascript() {
        $javascript = 'const updateInMS = 1000;
            
                    const clock = document.getElementsByClassName(\'clock\')[0];
                    const htmHours = document.getElementById(\'TD_clock_hours\');
                    const htmMinutes = document.getElementById(\'TD_clock_minutes\');
                    const htmSeconds = document.getElementById(\'TD_clock_seconds\');
            
                    startTimer();
            
                    function startTimer() {
                        tick();
                    }
            
                    function tick() {
                        setTimeout(function() {
                            const now = new Date();
                            const hours = now.getHours();
                            const minutes = now.getMinutes();
                            const seconds = now.getSeconds();
            
                            const secondsInDegrees = (360 * seconds) / 60;
                            const minutesInDegrees = (360 * minutes) / 60;
                            const hoursInDegrees = (360 * hours) / 12;
            
                            htmHours.style.transform = \'rotate(\' + hoursInDegrees + \'deg)\';
                            htmMinutes.style.transform = \'rotate(\' + minutesInDegrees + \'deg)\';
                            htmSeconds.style.transform = \'rotate(\' + secondsInDegrees + \'deg)\';
            
                            tick();
                        }, updateInMS);
                    }';

        return '<script>' . $javascript . '</script>';
    }

}
