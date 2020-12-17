import Spinner from 'react-bootstrap/Spinner';


export default function Notification(props) {
  return (
    <>
      { props.isRequesting &&
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      }
      { props.isLoadingError &&
        <div className="alert alert-danger my-5 text-center" role="alert">
          Unable to load data
        </div>
      }
      { props.isEmptyReturn && !props.isRequesting && !props.isLoadingError &&
        <div className="alert alert-primary my-5 text-center" role="alert">
          {props.children}
        </div>
      }
    </>
  )
}

