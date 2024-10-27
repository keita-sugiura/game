

window.onload = function () {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth-10;
    canvas.height = window.innerHeight-10;
    canvas.style.backgroundColor = "black";
    ctx = canvas.getContext("2d");

    start();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const color =["blue","Red","green","yellow"]

class circle{
    constructor(x,y,dx,dy,r,col){
        this.x=x;
        this.y=y;
        this.dx=dx;
        this.dy=dy;
        this.r=r;
        this.col=col;
    }
    move(){
        if(this.x<=this.r||canvas.width-this.x<=this.r)this.dx=-this.dx,this.cc();
        if(this.y<=this.r||canvas.height-this.y<=this.r)this.dy=-this.dy,this.cc();
        this.x+=this.dx;
        this.y+=this.dy;
    }
    cc(){
        this.col=(this.col+1)%color.length;
    }
    draw(){
        ctx.beginPath(); // パスの初期化
        ctx.arc(this.x,this.y,this.r, 0, 2 * Math.PI); // (100, 50)の位置に半径30pxの円
        ctx.closePath(); // パスを閉じる
        ctx.fillStyle=color[this.col];
        ctx.fill(); // 軌跡の範囲を塗りつぶす
    }
}

function start(){
    circles=[];
    c=new circle(999,110,3,3,100,3);
    circles.push(c);
    c=new circle(202,444,2,-1,30,2);
    circles.push(c);
    
    anime();
}

function anime(){
    clear();
    circles.map((c)=>{
        c.move();
        c.draw();
    });
    requestAnimationFrame(anime);
}
// 分裂　サイズ巨大化　