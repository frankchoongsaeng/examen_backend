import axios from "axios";

export default function createExam(examData, callback) {

  if (validateExamData(examData)) {
    axios({
      url: "http://localhost:5000/api/exams/create",
      method: "post",
      headers: {
        "token": localStorage.getItem("token")
      },
      data: {
        ...examData
      }
    }).then((res) => {

      callback(res.status, res.data)

    }).catch((err) => {

      console.log(err);
      if (err.response) {
        return callback(err.response.status)
      }

      callback(false);
    })
  }
  else {
    callback(400);
  }

}

function validateExamData({ title, isTimed, hours, minutes, expires } = {}) {

  if (!(typeof title === "string" && title.trim().length >= 5)) {
    console.error("invalid title")
    return false
  }

  return true;
}