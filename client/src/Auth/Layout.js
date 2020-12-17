import React from 'react';
import AuthRouter from '../routers/authRouter'

export default function Layout( ) {
  return (
    <div className="login"> 
      <div className="login-container">
        <div className="row">
          <div className="col-md-6 bg-primary login-bg-image d-none d-md-block"></div>
          <AuthRouter />
        </div>
      </div>
    </div> 
  )
}