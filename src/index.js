

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
            ctx.fillRect(0,0,screenWidth,screenHeight)
            ctx.font = `bold 60pt Verdana`
            ctx.fillStyle = `#ffffff`;
            ctx.textAlign = `center`
            canvas.onclick = addWalker;
            update()
        }

        function getRandomColor(){
            function getByte(){
                return getRandom(55,255)
            }
            return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",1)"
        }

        function distanceBetweenWalkers(w1,w2){
            return getDistance(w1.x,w1.y,w2.x,w2.y)
        }

        function getDistance(x1,y1,x2,y2){
            return Math.pow(Math.pow(x2-x1,2) + Math.pow(y2-y1,2),0.5)
        }

        function update(){
            addWalkerRandom()
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,screenWidth,screenHeight)
            requestAnimationFrame(update)
            for(var i in walkers){
                let walker = walkers[i]
                let hunting = false
                drawWalker(ctx,walker)
                if(walkers.length >= 2){
                    let closest = -1
                    for(var x in walkers){  
                        if(x != i){
                            let walkerX = walkers[x]
                            if(walkerX.size < walker.size){
                                if(closest == -1 || distanceBetweenWalkers(walkerX,walker) < distanceBetweenWalkers(walkers[closest],walker)){
                                    closest = x
                                }
                            }
                            
                        }
                    }
                    if(closest != -1){
                        hunting = true
                        walker.x += (walkers[closest].x - walker.x)/distanceBetweenWalkers(walkers[closest],walker)
                        walker.y += (walkers[closest].y - walker.y)/distanceBetweenWalkers(walkers[closest],walker)
                        if(distanceBetweenWalkers(walkers[closest],walker) < walker.size/2){
                            walker.size += 1
                            walkers[closest].size = 0
                        }
                    }
                }
                if(!hunting){
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
                }
                if(walker.size == 0){
                    walkers.splice(i,1)
                }
            }
        }

        function getRandom(min,max){
        return min + Math.ceil(Math.random() * (max - min))
        }

        function drawWalker(ctx,walker){
            ctx.save();
            ctx.beginPath();
            ctx.rect(walker.x - walker.size/2,walker.y - walker.size/2,walker.size,walker.size)
            ctx.closePath();
            ctx.fillStyle = walker.color
            ctx.fill()
            ctx.restore(); 
        }

        function addWalkerRandom(){
            walkers.push({
                x:getRandom(0,screenWidth),
                y:getRandom(0,screenHeight),
                color:getRandomColor(),
                size:getRandom(5,20)
            })
        }

        function addWalker(e){
            let rect = e.target.getBoundingClientRect();
            let mouseX = e.clientX - rect.x;
            let mouseY = e.clientY - rect.y;
            walkers.push({
                x:mouseX,
                y:mouseY,
                color:getRandomColor(),
                size:getRandom(5,20)
            })
        }
})()
