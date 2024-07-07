console.log("This project is not mine!");
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webKitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 16);
        };
})();

function Particle(x, y, velY) {
    
    this.x = Math.floor(Math.random() * window.innerWidth);
    this.y = 0 - Math.random() * 1000;
    this.velY = velY;
    this.maxY = window.innerHeight;
    this.colour = /*"hsl("+parseInt(Math.floor(Math.random() * 360) + 1)+", 100%, 50%)";*/ "#AA3939";
    this.size = Math.floor(Math.random() * 2) + 5;
    this.opacity = Math.random() + 0.2;
    
}

Particle.prototype.draw = function(c) {
    c.save();
    c.fillStyle = this.colour;
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();
    c.restore();    
}

Particle.prototype.step = function(width, height) {
    this.y += this.velY;
    if(this.y >= this.maxY - this.size) {
        this.y = 0;
    }
}

window.addEventListener("load", function() {
   
    var canvas      = document.getElementById("animation"),
        c           = canvas.getContext("2d"),
        width       = canvas.width = window.innerWidth,
        height      = canvas.height = window.innerHeight,
        amount      = 100,
        velY        = 5,
        startButton = document.getElementById("startButton"),
        resetButton = document.getElementById("resetButton"),
        particles   = [];
    
    console.log("Succesfully loaded!");
    
    c.fillStyle = "#000000";
    c.fillRect(0, 0, width, height);
    
    window.addEventListener("resize", function() {
       
        width  = canvas.width  = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
    });
    
    window.addEventListener("keydown", function(e) {
       
        var key = (e.keyCode || e.which);
        
        switch(e) {
            case 187:
                velY += 1;
                break;
            case 189:
                velY -= 1;
                break;
        }
        
        console.log(velY)
        
    });
    
    startButton.onclick = function() {       
        for(var i = 0; i < amount; i += 1) {
            var p = new Particle(this.x, this.y, velY);
            particles.push(p);
        }        
    }
    
    resetButton.onclick = function() {
        
        particles = [];
        
    }
    
    
    function render() {
        c.globalCompositeOperation = "source-over";
        c.fillStyle = "rgba(0, 0, 0, 0.2)";
        c.fillRect(0, 0, width, height);
        c.globalCompositeOperation = "lighter";
        for(var i in particles) {
            particles[i].draw(c);
        }
        
        for(var i in particles) {
            particles[i].step(width, height);
        }
        
        requestAnimationFrame(render);
    }
    
    render();
    
});
