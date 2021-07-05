const functions = require("firebase-functions");
const cors = require('cors')

const app = require("express")();
app.use(cors());

const FBAuth = require('./util/fbAuth');

const {
    signup,
    login,
    passReset,
    getUserDetails,
    updateUserDetails,
    registerForCourse
  } = require('./handlers/users');


  const {
  addcourse,
  addDayDetails,
  dayDetails,
  allCourseDetails,
  courseDetails,
  updateCourseDetails,
  updateDayDetails,
  deleteCourse
} = require("./admin/course");
                                                                                                                                                          


app.post('/signup', signup);
app.post('/login', login);
app.post('/passReset', passReset);
app.get('/getUserDetails', FBAuth, getUserDetails);
app.post('/updateUserDetails', FBAuth, updateUserDetails);
app.post('/registerForCourse', FBAuth, registerForCourse);

// admin apis
app.post("/addcourse", addcourse);
app.post("/addday", addDayDetails);
app.get('/allcoursedetails',allCourseDetails);
app.post("/coursedetails", courseDetails);
app.post("/daydetails", dayDetails);
app.post("/updatecdetails", updateCourseDetails);
app.post("/updateddetails", updateDayDetails);
app.post("/deletecourse",deleteCourse);



exports.api = functions.region("asia-east2").https.onRequest(app);
