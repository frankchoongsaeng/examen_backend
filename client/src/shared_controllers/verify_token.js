import axios from 'axios';

const verifyToken = async () => {

  


  let isvalid = "";

  try {
    isvalid = await axios.get(`http://localhost:5000/api/token/verify?token=${localStorage.getItem("token")}`);
  }
  catch( e ) {
    console.log(e)
  }

  let rtval = typeof isvalid === "object" ? isvalid.data.isvalid : isvalid;
  console.log(rtval);

  return rtval;
}

export default verifyToken;