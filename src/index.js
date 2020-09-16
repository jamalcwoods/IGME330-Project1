

(function(){
        // #0 - In this course we will always use ECMAScript 5's "strict" mode
        // See what 'use strict' does here:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
        'use strict';

        // #1 call the init function after the pages loads
        // this is called an "event handler"
        window.onload = init;
        let ctx;
        let lineY = 240;
        let walkers = []
        let screenWidth = 500
        let screenHeight = 500

        

        function init(){
            var canvas = document.querySelector(`canvas`);
            ctx = canvas.getContext(`2d`);
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,640,480)
            ctx.font = `bold 60pt Verdana`
            ctx.fillStyle = `#ffffff`;
            ctx.textAlign = `center`
            canvas.onclick = addWalker;
            addWalker();
            update()
        }

        function getRandomColor(){
            function getByte(){
                return getRandom(55,255)
            }
            return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",1)"
        }

        function update(){
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,640,480)
            
            requestAnimationFrame(update)
            for(var i in walkers){
                let walker = walkers[i]
                switch(Math.floor(Math.random() *4)){
                    case 0:
                        walker.x++;
                        break;
                    
                    case 1:
                        walker.x--;
                        break;

                    case 2:
                        walker.y++
                        break;

                    case 3:
                        walker.y--;
                        break;
                }
                drawWalker(ctx,walker)
            }
        }

        function getRandom(min,max){
        return min + Math.ceil(Math.random() * (max - min))
        }

        function drawWalker(ctx,walker){
            ctx.save();
            ctx.beginPath();
            ctx.rect(walker.x,walker.y,5,5)
            ctx.closePath();
            ctx.fillStyle = walker.color
            ctx.fill()
            ctx.restore(); 
        }

        function addWalker(){
            walkers.push({
                x:screenHeight/2,
                y:screenHeight/2,
                color:getRandomColor()
            })
        }
})()
