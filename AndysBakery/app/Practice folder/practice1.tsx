
// const person = {
//     name: "Bodhi",
//     age: 21,
//     bio: function() {
//         console.log(`${this.name} is ${this.age} years old`);
//     },  
//     introduceSelf: function() {
//         console.log(`Hi, my name is ${this.name} and my friend is gay, also im ${this.age} years old`);
//     },
// };

// person.bio();
// person.introduceSelf();












const cookie = {
    flavors: ["chocolate", "cookies n cream", "sourdough"],
    size: ['2"','4"', '6"'],
    frosting: ['buttercream', 'none'],
    filling: function() {
        console.log(`currently we only have creamcheese filling for the  ${this.flavors[1]}, We apologize and for the inconvienence!`)
    },

    price: function(){
        if(this.size[0] === '2"') {
            return "$4, Please.";
        } else if(this.size[1] === '4"') {
            return "$6, Please.";
        } else {
            return "$10, Please.";
        }
    },
    
}

console.log(`"so your order is a ${cookie.size[2]} ${cookie.flavors[0]} is that all of anything else to go?"`)
console.log(`"ok that will be a total of ${cookie.price()}."`)























