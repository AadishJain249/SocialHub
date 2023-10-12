//Q1
// function a()
// {
//     console.log("variable name is"+name);
//     console.log("variable age is"+age);
//     var name="aadish"
//     let age=10
// }
// a()

//Q2
// console.log(true+true);
// console.log(!"Javascript");

//Q3
// error because it is class and static method can be invoked by class name
// class Lizard
// {
//     static colorChange(newColor)
//     {
//         this.newColor=newColor
//         return this.newColor
//     }
//     constructor({newColor="orange"}={})
//     {
//         this.newColor=newColor
//     }
// }
// const tommy=new Lizard({newColor:"orange"})
// console.log(tommy.colorChange("blue"));

//q4
// no error because js auto hoist this varible in window scope
// we can use "use strict"
// let message
// masg={data:[1,2]}
// console.log(masg);

//Q5
// function show()
// {
//     console.log(time);
//     console.log(show.timeout);
// }
// show.timeout=100
// console.log(show);

//Q6
// type error kyuki human bhi ek object hai and getfull 
// directly accesible nhi hai mem ko isko resolve karne ke liye prototype use karna hai
// function human(f,l)
// {
//     this.f=f;
//     this.l=l
// }
// const mem=new human("aadish","jain")
// console.log(mem);
// human.getFull=function(){
//     return `${this.f}${this.l}`
// }
// console.log(human);
// console.log(mem.getFull());

//Q7
// first argument jo hota hai wo array of strns hota hai
// without the varible used in template literals and rest are varibles
// function getSum(one,two,three)
// {
//     console.log(one);
//     console.log(two);
//     console.log(three);
// }
// const f='aadish'
// const age=878
// getSum `${f} age is ${age}`