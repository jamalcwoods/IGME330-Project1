


(function(){
   
    'use strict';
    window.onload = init;
    let ctx;
    let lineY = 240;
    let walkers = []
    let foods = []
    let hives = []
    let screenWidth = 720
    let screenHeight = 500
    let paused = false
    let hiveSize = 25
    let foodSpawnTimer = 0;
    let spawnedFoodMaxSize = 30
    let spawnedFoodMinSize = 5

    

    function init(){
        var canvas = document.querySelector(`canvas`);
        ctx = canvas.getContext(`2d`);
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,screenWidth,screenHeight)
        ctx.font = `bold 60pt Verdana`
        ctx.fillStyle = `#ffffff`;
        ctx.textAlign = `center`
        canvas.onclick = addEntity;

        setPanel("hive")
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

        document.querySelector("#clear").addEventListener("click",function(){
            walkers = []
            foods = []
            hives = []
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,screenWidth,screenHeight)
        })

        document.querySelector("#randColorToggle").addEventListener("change",function(){
            if(document.querySelector("#creatureColor").style.display == "none") {
                document.querySelector("#creatureColor").style.display = "block"
            } else {
                document.querySelector("#creatureColor").style.display = "none"
            }
        })

        document.querySelector("#randTypeToggle").addEventListener("change",function(){
            if(document.querySelector("#creatureType").style.display == "none") {
                document.querySelector("#creatureType").style.display = "block"
            } else {
                document.querySelector("#creatureType").style.display = "none"
            }
        })

        document.querySelector("#randSizeToggle").addEventListener("change",function(){
            if(document.querySelector("#creatureSize").style.display == "none") {
                document.querySelector("#creatureSize").style.display = "block"
            } else {
                document.querySelector("#creatureSize").style.display = "none"
            }
        })
        update()
    }

    function setPanel(type){
        switch(type){
            case "food":
                document.querySelector("#foodPanel").style.display = "block"
                document.querySelector("#creaturePanel").style.display = "none"
                document.querySelector("#hivePanel").style.display = "none"
                break;
            case "creature":
                document.querySelector("#foodPanel").style.display = "none"
                document.querySelector("#creaturePanel").style.display = "block"  
                document.querySelector("#hivePanel").style.display = "none"   
                break;   
            case "hive":
                document.querySelector("#foodPanel").style.display = "none"
                document.querySelector("#creaturePanel").style.display = "none"    
                document.querySelector("#hivePanel").style.display = "block"
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
        updateWalkers()
        updateFoods()
        updateHives()   
        if(document.querySelector("#randFoodSpawn").checked){
            let now = new Date();
            if(foodSpawnTimer < now.getTime()){
                foodSpawnTimer = now.getTime() + (document.querySelector("#foodSpawnRate").value * 1000)
                let x = Math.floor(Math.random() * screenWidth)
                let y = Math.floor(Math.random() * screenHeight)
                let size = spawnedFoodMinSize + Math.floor(Math.random() * spawnedFoodMaxSize - spawnedFoodMinSize)
                addFood(x,y,size,size)
            }    
        }
    }

    function updateWalkers(){
        for(var i in walkers){
            let walker = walkers[i]
            let hunting = false
            drawWalker(ctx,walker)
            let speed = 2
            if(document.querySelector("#sizeControlledSpeed").checked){
                speed *= 1 - (0.8 * (walker.size/60))
            }
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
                    walker.x += (walkers[closest].x - walker.x)/distanceBetweenObjects(walkers[closest],walker) * speed
                    walker.y += (walkers[closest].y - walker.y)/distanceBetweenObjects(walkers[closest],walker) * speed
                    if(distanceBetweenObjects(walkers[closest],walker) < walker.size/2){
                        walker.size += parseInt(walkers[closest].size)
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
                    walker.x += (foods[closest].x - walker.x)/distanceBetweenObjects(foods[closest],walker) * speed
                    walker.y += (foods[closest].y - walker.y)/distanceBetweenObjects(foods[closest],walker) * speed
                } else {
                    switch(Math.floor(Math.random() *4)){
                        case 0:
                            walker.x += speed
                            break;
                        
                        case 1:
                            walker.x -= speed
                            break;

                        case 2:
                            walker.y += speed
                            break;

                        case 3:
                            walker.y -= speed
                            break;
                    }
                }
            }
            if(document.querySelector("#creatureHunger").checked){
                let now = new Date()
                if(walker.hungerTimer < now.getTime()){
                    walker.size--
                    walker.hungerTimer = now.getTime() + (document.querySelector("#hungerDelay").value * 1000)
                }
            }
            
            if(walker.size <= 0){
                walkers.splice(i,1)
            } else if(walker.size <= document.querySelector("#starvationThreshold").value){
                walkers.splice(i,1)
                if(document.querySelector("#foodOnDeath").checked){
                    addFood(walker.x,walker.y,walker.size)
                }
            }
            if(walker.size >= 60){
                addWalker(walker.x + 30,walker.y,getRandom(10,20),walker.color,walker.type)
                addWalker(walker.x - 30,walker.y,getRandom(10,20),walker.color,walker.type)
                addWalker(walker.x,walker.y + 30,getRandom(10,20),walker.color,walker.type)
                addWalker(walker.x,walker.y - 30,getRandom(10,20),walker.color,walker.type)
                walkers.splice(i,1)
            }
        }
    }

    function updateFoods(){
        for(var i in foods){
            var food = foods[i]
            drawFood(ctx,food)
            for(var x in walkers){
                var walker = walkers[x]
                if(distanceBetweenObjects(food,walker) < food.size){
                    food.size--;
                    walker.size++
                }
            }
            if(food.size <= 0){
                foods.splice(i,1)
            }
        }
    }

    function updateHives(){
        for(let h in hives){
            drawHive(ctx,hives[h])
            let now = new Date()
            if(hives[h].timer < now.getTime()){
                hives[h].timer = (hives[h].rate * 1000) + now.getTime()
                let xpos = hives[h].x + (((hiveSize * 2) + Math.floor(Math.random() * hiveSize)) * Math.random() < 0.4 ? -1 : 1)
                let ypos = hives[h].y + (((hiveSize * 2) + Math.floor(Math.random() * hiveSize)) * Math.random() < 0.4 ? -1 : 1)
                addWalker(xpos,ypos,10,hives[h].color,hives[h].type)
            }
        }
    }

    function getRandom(min,max){
    return min + Math.ceil(Math.random() * (max - min))
    }

    function drawWalker(ctx,walker){
        switch(walker.type){
            case "square":
                ctx.save();
                ctx.beginPath();
                ctx.rect(walker.x - walker.size/2,walker.y - walker.size/2,walker.size,walker.size)
                ctx.closePath();
                ctx.fillStyle = walker.color
                ctx.fill()
                ctx.restore(); 
                break;
            
            case "triangle":
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(walker.x, walker.y - walker.size/2);
                ctx.lineTo(walker.x - walker.size/2, walker.y + walker.size/2);
                ctx.lineTo(walker.x + walker.size/2, walker.y + walker.size/2);
                ctx.closePath();
                ctx.fillStyle = walker.color
                ctx.fill();
                ctx.restore()
                break;

            case "circle":
                ctx.save();
                ctx.beginPath();
                ctx.arc(walker.x, walker.y, walker.size/2, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fillStyle = walker.color
                ctx.fill()
                ctx.restore(); 
                break;
        }
        
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

    function drawHive(ctx,hive){
        ctx.save();
        ctx.beginPath();
        ctx.rect(hive.x - hiveSize/2,hive.y - hiveSize/2,hiveSize,hiveSize)
        ctx.closePath();
        ctx.strokeStyle = hive.color
        ctx.fillStyle = "black"
        ctx.fill()
        ctx.stroke()
        ctx.restore(); 
    }

    function addFood(x,y,size){
        foods.push({
            x:x,
            y:y,
            size:size
        })
        drawFood(ctx,foods[foods.length - 1])
    }

    function addWalker(x,y,size,color,type){
        walkers.push({
            x:x,
            y:y,
            color:color,
            size:size,
            type:type,
            hungerTimer:0
        })
        drawWalker(ctx,walkers[walkers.length - 1])
    }

    function addHive(x,y,color,rate,type){
        hives.push({
            x:x,
            y:y,
            color:color,
            rate:rate,
            type:type,
            timer:0
        })
        drawHive(ctx,hives[hives.length - 1])
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
                let type = document.querySelector("#creatureType").value
                if(document.querySelector("#randColorToggle").checked){
                    color = getRandomColor()
                }
                if(document.querySelector("#randTypeToggle").checked){
                    type = ["triangle","square"][Math.floor(Math.random() * 2)]
                }
                if(document.querySelector("#randSizeToggle").checked){
                    csize = 5 + Math.floor(Math.random() * 46) 
                }
                addWalker(mouseX,mouseY,csize,color,type)
                break;
            
            case "hive":
                let hcolor = document.querySelector("#hiveColor").value
                let rate = document.querySelector("#hiveSpawnRate").value
                let htype = document.querySelector("#spawnCreatureType").value
                addHive(mouseX,mouseY,hcolor,rate,htype)
                break;
        }
    }
})()
