<?php

declare(strict_types = 1);

namespace Timvandendries\Clock;

/**
 * @property integer $size
 * @property string $backgroundColor
 * @property boolean $numbers
 * @property string $numbersColor
 * @property boolean $border
 * @property integer $borderSize
 * @property string $borderGradientStart
 * @property string $borderGradientMiddle
 * @property string $borderGradientEnd
 * @property boolean $handHours
 * @property string $handHoursColor
 * @property boolean $handMinutes
 * @property string $handMinutesColor
 * @property boolean $handSeconds
 * @property string $handSecondsColor
 * @property boolean $centerCircle
 * @property integer|float $centerCircleSize
 * @property string $centerCircleColor
 */
class Clock {

    public int $size = 200;
    public string $backgroundColor = '#FFFFFF';

    public bool $numbers = TRUE;
    public string $numbersColor = '#000000';

    public bool $border = TRUE;
    public int $borderSize = 5;
    public string $borderGradientStart = "#000000";
    public string $borderGradientMiddle = "#CCCCCC";
    public string $borderGradientEnd = "#000000";

    public bool $handHours = TRUE;
    public string $handHoursColor = '#000000';
    public bool $handMinutes = TRUE;
    public string $handMinutesColor = '#000000';
    public bool $handSeconds = TRUE;
    public string $handSecondsColor = '#CC0000';

    public bool $centerCircle = TRUE;
    public int|float $centerCircleSize = 1;
    public string $centerCircleColor = '#000000';

    public function showClock() : string {

        $canvasHTML = '<canvas id="canvas" width="' . $this->size . '" height="' . $this->size . '"></canvas>';

        $canvas = 'var canvas = document.getElementById("canvas");
                   var ctx = canvas.getContext("2d");
                   var radius = canvas.height / 2;
                   ctx.translate(radius, radius);
                   radius = radius * 0.8;';

        $interval = 'setInterval(drawClock, 1000);';

        $drawClock = 'function drawClock() {
                        drawFace(ctx, radius);
                        ' . ($this->numbers ? 'drawNumbers(ctx, radius);' : '') . '
                        drawTime(ctx, radius);
                     }';

        $border = $this->border ?
            'grad = ctx.createRadialGradient(0, 0 , radius * 0.95, 0, 0, radius * 1.5);
            grad.addColorStop(0, "' . $this->borderGradientStart . '");
            grad.addColorStop(0.5, "' . $this->borderGradientMiddle . '");
            grad.addColorStop(1, "' . $this->borderGradientEnd . '");' : '';

        $drawFace = 'function drawFace(ctx, radius) { 
                        var grad;
                        ctx.beginPath();
                        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = "' . $this->backgroundColor . '";
                        ctx.fill();           
                        ' . $border . '    
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = ' . $this->borderSize . ';
                        ctx.stroke();
                    }';


        $circleSize = str_replace('.', '', (string) $this->centerCircleSize);

        $circle = $this->centerCircle ?
            'ctx.arc(0, 0, radius * 0.' . $circleSize . ', 0, 2 * Math.PI);
             ctx.fillStyle = "' . $this->centerCircleColor . '";' : '';

        $drawNumbers = 'function drawNumbers(ctx, radius) {
                            // draw middle circle and set color
                            ctx.beginPath();
                            ' . $circle . '
                            ctx.fill();
                              
                            // draw numbers
                            var ang;
                            var num;
                            ctx.font = radius * 0.15 + "px arial";
                            ctx.textBaseline = "middle";
                            ctx.textAlign = "center";
                            ctx.fillStyle = "' . $this->numbersColor . '";
                            for(num = 1; num < 13; num++){
                                ang = num * Math.PI / 6;
                                ctx.rotate(ang);
                                ctx.translate(0, -radius * 0.85);
                                ctx.rotate(-ang);
                                ctx.fillText(num.toString(), 0, 0);
                                ctx.rotate(ang);
                                ctx.translate(0, radius * 0.85);
                                ctx.rotate(-ang);
                            }
                    }';

        $drawTime = 'function drawTime(ctx, radius){
                        var now = new Date();
                        var hour = now.getHours();
                        var minute = now.getMinutes();
                        var second = now.getSeconds();
                        hour = hour%12;
                        hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
                        drawHand(ctx, hour, radius*0.5, radius*0.07, "' . $this->handHoursColor . '");
                        minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
                        drawHand(ctx, minute, radius*0.8, radius*0.07, "' . $this->handMinutesColor . '");
                        second = (second*Math.PI/30);
                        drawHand(ctx, second, radius*0.9, radius*0.02, "' . $this->handSecondsColor . '");
                    }';

        $drawHand = 'function drawHand(ctx, pos, length, width, color) {
                        ctx.beginPath();
                        ctx.lineWidth = width;
                        ctx.lineCap = "round";
                        ctx.moveTo(0,0);
                        ctx.rotate(pos);
                        ctx.lineTo(0, -length);
                        ctx.strokeStyle = color;
                        ctx.stroke();
                        ctx.rotate(-pos);
                    }';

        $javascript = $canvas . $interval . $drawClock . $drawFace . $drawNumbers . $drawTime . $drawHand;

        return $canvasHTML . '<script>' . $javascript . '</script>';

    }

}
