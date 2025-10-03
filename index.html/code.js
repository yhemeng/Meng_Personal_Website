


var button = document.querySelector("button");

button.addEventListener("click",myfucntion);

function myfucntion(){
    alert("told you don't click it");
}

var mynode=document.createElement("div");
mynode.id="work1_intro";
mynode.innerHTML="this work";
mynode.style.color="bule";
mynode.addEventListener("click",welcomeToWork1);
document.querySelector("#my_work1").appendChild(mynode);
function welcomeToWork1(){
    mynode.innerHTML="thank you";
}