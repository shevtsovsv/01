let myName = 5;
const f2 = function () {
  console.log(this.myName);
};
const f3 = (x,y) => {
	let c = x + y;
	return c
};
function f1() {
  console.log(this.myName);
}

const obj1 = {
  myName,
  myFunc: f3,
};
const obj2 = {
  myName,
  myFunc: f3,
};

obj1.myName = 25;
// console.log(myName);
// console.log(obj1.myName);
// console.log(obj2.myName);
obj1.myFunc();
obj2.myFunc();
