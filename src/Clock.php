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



        $canvasHTML = '<canvas id="canvas" width="300" height="300"></canvas>';


        $canvas = 'var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var radius = canvas.height / 2;
            ctx.translate(radius, radius);
            radius = radius * 0.90;';

        $interval = 'setInterval(drawClock, 1000);';


        $drawClock = 'function drawClock() {
                drawFace(ctx, radius);
                drawNumbers(ctx, radius);
                drawTime(ctx, radius);
            }';

        $drawFace = 'function drawFace(ctx, radius) { 
                var grad;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, 2 * Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();
                grad = ctx.createRadialGradient(0, 0 ,radius * 0.95, 0, 0, radius * 1.05);
                grad.addColorStop(0, "#333");
                grad.addColorStop(0.5, "white");
                grad.addColorStop(1, "#333");
                ctx.strokeStyle = grad;
                ctx.lineWidth = radius*0.1;
                ctx.stroke();
            }';


        $drawNumbers = 'function drawNumbers(ctx, radius) {
                  // draw middle circle and set color
                  ctx.beginPath();
                  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
                  ctx.fillStyle = "#CC0000";
                  ctx.fill();
                      
                  // draw numbers
                  var ang;
                  var num;
                  ctx.font = radius * 0.15 + "px arial";
                  ctx.textBaseline = "middle";
                  ctx.textAlign = "center";
                  ctx.fillStyle = "#000000";
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
