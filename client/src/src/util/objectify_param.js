import { useLocation } from 'react-router-dom';

export default function useSearchParam() {

  let searchparam = useLocation().search;
  let returnObject = {};

  if(searchparam.length !== 0) {
    if (searchparam.indexOf("?") === 0) {
      searchparam = searchparam.substring(1);
    }
  
    let splitted = searchparam.split("&");
    splitted = splitted.map(search => search.split("="));
  
    
    for (let split of splitted)
      returnObject[split[0]] = split[1];
  }

  

  return returnObject
}