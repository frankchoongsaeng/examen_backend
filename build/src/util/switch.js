import alerter from './alert'; 


/**
 * HELPER FUNCTION
 * takes status code, data, and a callback, and decides what to do with it
 */
export default function switcher(status, callback, options = {}) {
  switch (status) {
    case 200: {
      callback()
      break;
    }
    case 201: {
      callback()
      break;
    }
    case 204: {
      alerter.warning("data loaded may not be accurate, please refresh the page");
      break;
    }
    case 400: {
      alerter.error("Missing token or required data. Please check all fields have been flled");
      break;
    }
    case 401: {
      alerter.error("Missing token, could not verify user");
      break;
    }
    case 403: {
      alerter.error("Invalid token. please login again to validate yourself");
      break;
    }
    case 404: {
      alerter.error("Not found");
      break;
    }
    case 500: {
      alerter.error("an error has occurred behind the scenes and our dev team is working hard to fix this");
      break;
    }
    case 408: {
      alerter.error("server did not respond. please try again after sometime");
      break;
    }
    case false: {
      alerter.error("unable to load data. this could be as a result of poor internet connection or the server might be down. Please try after some time");
      break;
    }
    default: {
      alerter.error("an unknown error occured. please refresh");
      break;
    }
  }
}