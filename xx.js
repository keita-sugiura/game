
const log=(a)=>{
    console.log(a);
}

let k = parseInt(101,2);
log(k);

let obj={
    xx: 3,
    yy: {zz: 5}
};
let {yy: y}=obj;
log(y);
let tp = typeof obj;
log(tp);
