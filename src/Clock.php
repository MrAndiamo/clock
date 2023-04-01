<?php

declare(strict_types = 1);

namespace Timvandendries\Clock;

/**
 * @property integer $clockSize
 * @property boolean $clockFaceNumber
 * @property string $clockFaceNumberColor
 * @property boolean $clockBorder
 * @property string $clockBorderGradientStart
 * @property string $clockBorderGradientMiddle
 * @property string $clockBorderGradientEnd
 * @property boolean $clockFaceCenterCircle
 * @property integer $clockFaceCenterCircleSize
 * @property string $clockFaceCenterCircleColor
 */
class Clock {

    public int $clockSize = 200;
    public bool $clockFaceNumber = TRUE;
    public string $clockFaceNumberColor = '#000000';
    public bool $clockBorder = TRUE;
    public string $clockBorderGradientStart = "#000000";
    public string $clockBorderGradientMiddle = "#CCCCCC";
    public string $clockBorderGradientEnd = "#000000";
    public bool $clockFaceCenterCircle = TRUE;
    public int $clockFaceCenterCircleSize = 1;
    public string $clockFaceCenterCircleColor = '#000000';

    public function showClock() : string {

        $canvasHTML = '<canvas id="canvas" width="' . $this->clockSize . '" height="' . $this->clockSize . '"></canvas>';

        $canvas = 'var canvas = document.getElementById("canvas");
                   var ctx = canvas.getContext("2d");
                   var radius = canvas.height / 2;
                   ctx.translate(radius, radius);
                   radius = radius * 0.90;';

        $interval = 'setInterval(drawClock, 1000);';

        $drawClock = 'function drawClock() {
                        drawFace(ctx, radius);
                        ' . ($this->clockFaceNumber ? 'drawNumbers(ctx, radius);' : '') . '
                        drawTime(ctx, radius);
                     }';

        $border = $this->clockBorder ?
            'grad = ctx.createRadialGradient(0, 0 ,radius * 0.95, 0, 0, radius * 1.05);
            grad.addColorStop(0, "' . $this->clockBorderGradientStart . '");
            grad.addColorStop(0.5, "' . $this->clockBorderGradientMiddle . '");
            grad.addColorStop(1, "' . $this->clockBorderGradientEnd . '");
            ctx.strokeStyle = grad;
            ctx.lineWidth = radius*0.1;
            ctx.stroke();' : '';

        $drawFace = 'function drawFace(ctx, radius) { 
                        var grad;
                        ctx.beginPath();
                        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = "white";
                        ctx.fill();
                        ' . $border . '    
                    }';


        $centerCircle = $this->clockFaceCenterCircle ?
            'ctx.arc(0, 0, radius * 0.' . $this->clockFaceCenterCircleSize . ', 0, 2 * Math.PI);
             ctx.fillStyle = "' . $this->clockFaceCenterCircleColor . '";' : '';

        $drawNumbers = 'function drawNumbers(ctx, radius) {
                            // draw middle circle and set color
                            ctx.beginPath();
                            ' . $centerCircle . '
                            ctx.fill();
                              
                            // draw numbers
                            var ang;
                            var num;
                            ctx.font = radius * 0.15 + "px arial";
                            ctx.textBaseline = "middle";
                            ctx.textAlign = "center";
                            ctx.fillStyle = "' . $this->clockFaceNumberColor . '";
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
                        drawHand(ctx, hour, radius*0.5, radius*0.07);
                        minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
                        drawHand(ctx, minute, radius*0.8, radius*0.07);
                        second = (second*Math.PI/30);
                        drawHand(ctx, second, radius*0.9, radius*0.02);
                    }';

        $drawHand = 'function drawHand(ctx, pos, length, width) {
                        ctx.fillStyle = "black";
                        ctx.beginPath();
                        ctx.lineWidth = width;
                        ctx.lineCap = "round";
                        ctx.moveTo(0,0);
                        ctx.rotate(pos);
                        ctx.lineTo(0, -length);
                        ctx.stroke();
                        ctx.rotate(-pos);
                    }';

        $javascript = $canvas . $interval . $drawClock . $drawFace . $drawNumbers . $drawTime . $drawHand;

        return $canvasHTML . '<script>' . $javascript . '</script>';

    }

}
