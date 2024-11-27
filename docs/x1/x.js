

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
const color =["blue","Red","green","yellow","blue","Red","green","yellow","white","cyan"]

const fontSize=50;
class circle{
    constructor(x,y,dx,dy,r,num){
        this.x=x;
        this.y=y;
        this.dx=dx;
        this.dy=dy;
        this.r=r;
        this.num=num;
        this.on=true;
    }
    move(){
        if(this.x<=this.r||canvas.width-this.x<=this.r)this.dx=-this.dx,this.cc();
        if(this.y<=this.r||canvas.height-this.y<=this.r)this.dy=-this.dy,this.cc();
        this.x+=this.dx;
        this.y+=this.dy;
    }
    cc(){
        this.num=(this.num+1)%10;
    }
    draw(){
        if(!this.on)return;
        ctx.beginPath(); // パスの初期化
        ctx.arc(this.x,this.y,this.r, 0, 2 * Math.PI); // (100, 50)の位置に半径30pxの円
        ctx.closePath(); // パスを閉じる
        ctx.fillStyle=color[this.num];
        ctx.fill(); // 軌跡の範囲を塗りつぶす
        ctx.fillStyle="black";
        ctx.font=fontSize+"px cursive";
        ctx.fillText(this.num.toString(),this.x-fontSize/3,this.y+fontSize/3);
    }
    isInside(x,y){
        let dx=x-this.x,dy=y-this.y;
        return (this.r*this.r>=dx*dx+dy*dy)
    }
    checkClick(x,y){
        if(!this.on)return false;
        if(this.isInside(x,y)){
            this.on=false;
            return true;
        }
        return false;
    }
}

function gen(down,up){
    let d=up-down;
    d=Math.random()*d+down;
    d=Math.floor(d);
    return d;
}

let cCount=10;
let circles=[];
function start(){

    circles=[];
    for(let i=0;i<cCount;i++){
        let r=gen(50,80);
        circles.push(new circle(gen(r+10,canvas.width-10-r),gen(10+r,canvas.height-10-r),gen(2,6),gen(2,6),r,gen(0,10)));
    }

    window.addEventListener('mousedown',(event) => {
        click(event.clientX, event.clientY);
    })

    anime();
}

function click(x,y){
    let bo=true;
    for(let i=cCount-1;i>=0;i--){
        if(circles[i].checkClick(x,y))break;
    }
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