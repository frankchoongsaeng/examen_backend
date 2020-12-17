import { useState, useEffect, useRef } from 'react';


export default function useStorage(name, initialvalue) {

  const [state, setState] = useState("");


  const setStorage = (value) => {

    // use this if the user provided a function as a value
    if(typeof value === "function") {

      setState(currentState => {
        let newValue = value(currentState);
        
        if(typeof newValue === "object") {
          localStorage.setItem(name, JSON.stringify(newValue));
        } 
        else {
          localStorage.setItem(name, newValue);
        }
        return newValue;
      });

      return undefined;
    }


    if(typeof value === "object") {
      localStorage.setItem(name, JSON.stringify(value));
    } 
    else {
      localStorage.setItem(name, value);
    }
    
    setState(value);
  }
  

  const init = useRef( () => {
    let itemInStorage = localStorage.getItem(name);

    if(itemInStorage && itemInStorage !== "undefined") {
      try {
        itemInStorage = JSON.parse(itemInStorage);
      } catch (e){
        console.log("could not parse string to object", e);
      }
      return setState(itemInStorage);
    }

    setStorage(initialvalue);
  });
  

  useEffect(() => {
    init.current();
  }, [])

  return [state, setStorage]
}