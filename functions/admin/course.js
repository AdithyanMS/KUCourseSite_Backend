const { db } = require("../util/admin");

// write data
exports.addcourse = (req, res) => {
  const courseDetails = {
    cname: req.body.cname,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    details: req.body.details,
    noDays: req.body.noDays,
  };
  db.collection("courses")
    .add(courseDetails)
    .then((data) => {
      return db.doc(`/courses/${data.id}`).update({ courseId: data.id });
    })
    .then(() => {
      return res.json({ status: "success" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "some error has occured" });
    });
};

exports.addDayDetails = (req, res) => {
  const dayDetails = {
    courseLink: req.body.courseLink,
    coursePPT: req.body.coursePPT,
    courseExam: req.body.courseExam,
    dateOfClass: req.body.dateOfClass,
    timeOfStart: req.body.timeOfStart,
    endTime: req.body.endTime,
  };
  db.doc(`/courses/${req.body.courseId}/day/${req.body.day}`)
    .set(dayDetails)
    .then(() => {
      return res.status(200).json({ status: "successfully added" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ status: "something went wrong" });
    });
};

// read data
exports.allCourseDetails = (req, res) => {
  db.collection("courses")
    .get()
    .then((snap) => {
      let data = [];
      snap.forEach((ele) => {
        data.push(ele.data());
      });
      return res.json(data);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
};
exports.courseDetails=(req,res)=>{
  db.doc(`courses/${req.body.id}`).get()
  .then(snap =>{
    res.status(200).json(snap.data())
  })
  .catch(err=>{
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  })
}
exports.dayDetails = (req, res) => {
  db.doc(`/courses/${req.body.courseId}/day/${req.body.day}`) 
    .get()
    .then((snap) => {
      return res.status(200).json(snap.data());
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
};

// update data

exports.updateCourseDetails = (req, res) => {
  db.doc(`/courses/${req.body.courseId}`)
    .update(req.body.updateField)
    .then(() => {
      return res.status(200).json({ status: "added successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
};

exports.updateDayDetails = (req, res) => {
  db.doc(`/courses/${req.body.courseId}/day/${req.body.day}`)
    .update(req.body.updatefield)
    .then(() => {
      return res.status(200).json({ status: "updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
};

// delete a course
exports.deleteCourse = (req, res) => {
  db.doc(`/courses/${req.body.courseId}`)
    .delete()
    .then(() => {
      return res.status(200).json({ status: "updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "someting went wrong" });
    });
};
