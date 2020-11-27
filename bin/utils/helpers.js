
/**
 * Create a unique link using current time,
 * and appending the provided title to it
 */
const generateUniqueLink = (title) => {
  if (!title || typeof title !== "string" || title.length === 0)
    throw new Error("title must be provided to create a unique link");

  // let dateInNumbersOnly = new Date()/**get a new date which will be unique */
  //                             .
  let uniqueHex = "/".concat( convertToHex(Date.now()) );
  let transformedTitle = title.toLowerCase().split(" ").join("-");
  return uniqueHex.concat("/", transformedTitle);
}


/**
 * Convert a decimal integer number to hex
 */
const convertToHex = (num) => {
  /**
 *    num   |  /16  | newNum  | rem .   ^
 *  newNum  |  /16  | newNum  | rem .   |
 * 
 *  we pick the remainders in the upwards
 *  direction
 */

  // declare an object defining the valid hex characters and their values
  let hexmap = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "a",
    11: "b",
    12: "c",
    13: "d",
    14: "e",
    15: "f"
  }
  
  // let's make a copy of num before we start 
  let numcopy = num;

  // an array to hold remainders
  let remainderstack = [];


  while (true) {
    if (numcopy < 16) {
      // guard clause: end the loop if the numcopy has
      // been redused to a number less than 16
      remainderstack.unshift(hexmap[numcopy]);
      break;
    }

    // map the hex equivalent to the remainder
    remainderstack.unshift( hexmap[numcopy % 16] );
    
    // reduce numpcopy and repeat the process
    numcopy = Math.floor(numcopy/16);
  }

  return remainderstack.join("");
}

module.exports = {
  convertToHex,
  generateUniqueLink
}