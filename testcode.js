const object1 = {
  'name' : 'saurabh kumar',
  'age' : '32',
  'mobile' : '9718087950'
}

const object2 = {
  'name' : 'saurabh kumar',
  'age' : '32',
  'mobile' : '9718087950'
}

const s1 = "Saurabh";
const s2 = "saurabh";
// console.log( Object.is(s1, s2) );
console.log( JSON.stringify(object1) === JSON.stringify(object2) );
console.log( object1 === object2 );
 
// if( Object.is(object1, object2)){
//   console.log('true');
// }else{
//   console.log('false');
// }

