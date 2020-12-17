import { BrowserRouter } from 'react-router-dom';
import Router from './routers';
// import Website from './Website';

function App() {
  return (
    <BrowserRouter>
      <Router />
      {/* <Website /> */}
    </BrowserRouter>
  );
}

export default App;
