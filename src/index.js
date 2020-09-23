

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
        let foods = []
        let screenWidth = 500
        let screenHeight = 500
        let paused = false

        

        function init(){
            var canvas = document.querySelector(`canvas`);
            ctx = canvas.getContext(`2d`);
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,screenWidth,screenHeight)
            ctx.font = `bold 60pt Verdana`
            ctx.fillStyle = `#ffffff`;
            ctx.textAlign = `center`
            canvas.onclick = addEntity;

            setPanel("food")
            document.querySelector("#panelSelector").addEventListener("change",function(e){
                setPanel(e.target.value)
            })
            
            document.querySelector("#pause").addEventListener("click",function(){
                if(paused){
                    document.querySelector("#pause").innerHTML = "Pause Simulation"
                } else {
                    document.querySelector("#pause").innerHTML = "Resume Simulation"
                }
                paused = !paused;
            })

            //addWalkerRandom()
            //addFood(screenWidth/2,screenHeight/2,100)
            update()
        }

        function setPanel(type){
            switch(type){
                case "food":
                    document.querySelector("#foodPanel").style.display = "block"
                    document.querySelector("#creaturePanel").style.display = "none"
                    break;
                case "creature":
                    document.querySelector("#foodPanel").style.display = "none"
                    document.querySelector("#creaturePanel").style.display = "block"     
                    break;   
            }
        }

        function getRandomColor(){
            function getByte(){
                return getRandom(55,255)
            }
            return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",1)"
        }

        function distanceBetweenObjects(w1,w2){
            return getDistance(w1.x,w1.y,w2.x,w2.y)
        }

        function getDistance(x1,y1,x2,y2){
            return Math.pow(Math.pow(x2-x1,2) + Math.pow(y2-y1,2),0.5)
        }

        function update(){
            //addFood(getRandom(0,screenWidth),getRandom(0,screenHeight),10)
            requestAnimationFrame(update)
            if(!paused){
                updateWorld()
            }
        }

        function updateWorld(){
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,screenWidth,screenHeight)
            for(var i in walkers){
                let walker = walkers[i]
                let hunting = false
                drawWalker(ctx,walker)
                if(walkers.length >= 2 && foods.length == 0){
                    let closest = -1
                    for(var x in walkers){  
                        if(x != i && walkers[x].color != walker.color){
                            let walkerX = walkers[x]
                            if(walkerX.size < walker.size){
                                if(closest == -1 || distanceBetweenObjects(walkerX,walker) < distanceBetweenObjects(walkers[closest],walker)){
                                    closest = x
                                }
                            }
                            
                        }
                    }
                    if(closest != -1){
                        hunting = true
                        walker.x += (walkers[closest].x - walker.x)/distanceBetweenObjects(walkers[closest],walker)
                        walker.y += (walkers[closest].y - walker.y)/distanceBetweenObjects(walkers[closest],walker)
                        if(distanceBetweenObjects(walkers[closest],walker) < walker.size/2){
                            walker.size += walkers[closest].size 
                            walkers[closest].size = 0
                        }
                    }
                }
                if(!hunting){
                    let closest = -1
                    for(var x in foods){  
                        let food = foods[x]
                        if(closest == -1 || distanceBetweenObjects(food,walker) < distanceBetweenObjects(foods[closest],walker)){
                            closest = x
                        }
                    }
                    if(closest != -1){
                        walker.x += (foods[closest].x - walker.x)/distanceBetweenObjects(foods[closest],walker)
                        walker.y += (foods[closest].y - walker.y)/distanceBetweenObjects(foods[closest],walker)
                    } else {
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
                }
                if(walker.size <= 0){
                    walkers.splice(i,1)
                }
                if(walker.size >= 60){
                    addWalker(walker.x + 30,walker.y,getRandom(10,20),walker.color)
                    addWalker(walker.x - 30,walker.y,getRandom(10,20),walker.color)
                    addWalker(walker.x,walker.y + 30,getRandom(10,20),walker.color)
                    addWalker(walker.x,walker.y - 30,getRandom(10,20),walker.color)
                    walkers.splice(i,1)
                }
            }
            for(var i in foods){
                var food = foods[i]
                drawFood(ctx,food)
                for(var x in walkers){
                    var walker = walkers[x]
                    if(distanceBetweenObjects(food,walker) < food.size/2){
                        food.size--;
                        walker.size++
                    }
                }
                if(food.size <= 0){
                    foods.splice(i,1)
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

        function drawFood(ctx,food){
            ctx.save();
            ctx.beginPath();
            ctx.rect(food.x - food.size/2,food.y - food.size/2,food.size,food.size)
            ctx.closePath();
            ctx.fillStyle = "green"
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

        function addFood(x,y,size){
            foods.push({
                x:x,
                y:y,
                size:size
            })
            drawFood(ctx,foods[foods.length - 1])
        }

        function addWalker(x,y,size,color){
            walkers.push({
                x:x,
                y:y,
                color:color,
                size:size
            })
            drawWalker(ctx,walkers[walkers.length - 1])
        }

        function addEntity(e){
            let type = document.querySelector("#panelSelector").value
            let rect = e.target.getBoundingClientRect();
            let mouseX = e.clientX - rect.x;
            let mouseY = e.clientY - rect.y;
            switch(type){
                case "food":
                    let fsize = document.querySelector("#foodSize").value
                    addFood(mouseX,mouseY,fsize)
                    break;
                
                case "creature":
                    let csize = document.querySelector("#creatureSize").value
                    let color = document.querySelector("#creatureColor").value
                    addWalker(mouseX,mouseY,csize,color)
                    break;
            }
        }
})()
