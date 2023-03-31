<?php

declare(strict_types = 1);

namespace Timvandendries\Clock;

class Clock {

    public int $clockSize = 150;
    public int $clockHandWidth = 2;
    public string $clockHandHourColor = '#000000';
    public string $clockHandMinuteColor = '#000000';
    public string $clockHandSecondColor = '#CC0000';


    public function showTimer() : string {

        $css = self::getCSS();
        $javascript = self::getJavascript();
        $html = self::getHTML();
        return $css . $html . $javascript;
    }


    private function getHTML() : string {
        return '<div class=\'clock\'>
                    <div id=\'hours\'></div>
                    <div id=\'minutes\'></div>
                    <div id=\'seconds\'></div>
                </div>';
    }


    private function getCSS() : string {

        $clockHandHeight = ($this->clockSize / 2) - 10;
        $clockHandHeightMinutes = $clockHandHeight * 0.7;
        $clockHandHeightMinutesTop = $clockHandHeight - $clockHandHeightMinutes + 10;


        return '<style>
                    .clock {
                        position: relative;
                        height: ' . $this->clockSize . 'px;
                        width: ' . $this->clockSize .'px;
                        border-radius: 50%;
                        background: white;
                    }
                    
                    .clock div {
                        position: absolute;
                        height: ' . $clockHandHeight . 'px;
                        width: ' . $this->clockHandWidth . 'px;
                        top: 10px;
                        left: 50%;
                        /* UPDATED THIS TO FIXED: */
                        transform: translateX(50%);
                        background: black;
                        transform: rotate(0deg);
                        transform-origin: bottom center;
                    }
                    
                    #hours {
                        background-color: ' . $this->clockHandHourColor . ';
                    }
                    
                    #minutes {
                        background-color: ' . $this->clockHandMinuteColor . ';
                        height: ' . $clockHandHeightMinutes . 'px;
                        top: ' . $clockHandHeightMinutesTop . 'px;
                    }
                    
                    #seconds {
                        background-color: ' . $this->clockHandSecondColor . ';
                    }
                </style>';



    }



    private static function getJavascript() {
        return '<script>
                    const updateInMS = 1000;
            
                    const clock = document.getElementsByClassName(\'clock\')[0];
                    const htmHours = document.getElementById(\'hours\');
                    const htmMinutes = document.getElementById(\'minutes\');
                    const htmSeconds = document.getElementById(\'seconds\');
            
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
                    }
                </script>';
    }

}