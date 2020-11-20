/**
 * checks if data is a string
 * @param {String} data required, 
 */
const isString = (data) => {
  return typeof data === "string";
}

/**
 * checks that the provided data's length is not less than len
 * returns false if data is not of type array or string
 * @param {string | array} data required
 * @param {number} len required 
 */
const isMinLen = (data, len) => {
  if(data) {
    return data.length >= len;
  }

  return false;
}

/**
 * checks that the provided data's length is not more than len
 * returns false if data is not of type array or string
 * @param {string | array} data required
 * @param {number} len required
 */
const isMaxLen = (data, len) => {
  if(data) {
    return data.length <= len;
  }

  return false;
}

/**
 * checks that the provided data is a date
 * @param {date} data required
 */
const isDate = (data, len) => {
  let d = new Date(data.toString());
  return d.toDateString().toLowerCase() !== "invalid date" ;
}




module.exports = {
  isString,
  isMinLen,
  isMaxLen,
  isDate,
}