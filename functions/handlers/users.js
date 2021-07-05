const { admin, db } = require("../util/admin");

const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const auth = firebase.auth();

const { validateSignupData, validateLoginData } = require("../util/validators");

// Sign users up
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    fullName: req.body.fullName,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        phoneNo: newUser.phoneNo,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.email}`).set(userCredentials);
    })
    .then(() => {
      var user = firebase.auth().currentUser;
      user.sendEmailVerification();
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already is use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

// Log user in
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      if (!firebase.auth().currentUser.emailVerified) {
        return res.status(401).json({ general: "Please verify your Email" });
      } else {
        return res.json({ token });
      }
    })
    .catch((err) => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-user
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};


//for resetting password
exports.passReset = (req, res) => {
  const email = req.body.email;
  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      return res.json({ general: "Password reset link has been sent" });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getUserDetails = (req, res) => {
  db.doc(`/users/${req.user.email}`)
  .get()
    .then((doc) => {
      if (doc.exists) {
        return res.json(doc.data());
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//Update user details, right now just phone number is updated
exports.updateUserDetails = (req, res) => {
  db.collection("users").doc(`${req.user.email}`).update({
    phoneNo: req.body.phoneNo
  })
  .then(() => {
    return res.json({ general: "document has been updated"});
});
};

//register for a course
exports.registerForCourse = (req, res) => {
  const courseDetails = {
    registeredAt: new Date().toISOString(),
    droppedCourse: false,
    finishedCourse: false,
  };
  db.doc(`/users/${req.user.email}/registeredCources/${req.body.courseId}`)
    .set(courseDetails)
    .then(() => {
      return res.status(200).json({ status: "successfully added" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ status: "something went wrong" });
    });
};

