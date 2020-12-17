import sweetAlert from 'sweetalert';


const alerter = {
    /**
     * uses sweetalert to display an error message
     * @param {String} msg 
     */
    error(msg = "An error has occurred", callback = () => {}) {
      sweetAlert({
        icon: "error",
        title: "Error",
        text: msg,
        button: "okay, got it!"
      }).then(callback)
    },
    /**
     * uses sweetalert to display a success message
     * @param {String} msg 
     */
    success(msg = "Operation successfull",  callback = () => {}) {
      sweetAlert({
        icon: "success",
        title: "All Good!",
        text: msg
      }).then(callback)
    },
    /**
     * uses sweetalert to display a warning message
     * @param {String} msg 
     */
    warning(msg, callback = () => {}) {
      if(!msg) {
        throw new Error("alerter.warning expected a message but found none");
      }
      
      sweetAlert({
        icon: "warning",
        title: "Uhmm..",
        text: msg,
        button: "okay, got it!"
      }).then(callback)
    },
    /**
     * uses sweetalert to display a confirm dialog
     * @param {String} msg
     * @param {Function} callback takes users response as a param
     * 
     */
    confirm(msg, callback) {
      if(!msg) {
        throw new Error("alerter.confirm expected a message but found none");
      }
      if(!callback) {
        throw new Error("alerter.confirm expected a callback but found none");
      }
      sweetAlert({
        icon: "warning",
        text: msg,
        buttons: {
          cancel: {
            text: "cancel",
            value: false,
            visible: true,
            closeModal: true,
          },
          confirm: {
            text: "continue",
            value: true,
            visible: true,
            className: "btn-danger",
            closeModal: true
          }
        }
      })
      .then( callback );

      
    }
}

export default alerter;