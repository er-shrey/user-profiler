const express = require('express');
const router = express.Router();
const Users = require('../config/database/models/users');
const atob = require('atob');

router.post('/users', function(req, res, next) {
  /**
   * API for creating new user
   */
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  if( email ){
    Users.create({
      firstname: firstName,
      lastname: lastName,
      email: email,
    })
    .then(user => {
      if (user) {
        res.json({"message":"User Created", "user_id": user.user_id});
      } else {
        res.sendStatus(500);
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  }
  else{
    res.sendStatus(500);
  }
});

router.get('/users', function(req, res, next) {
  /**
   * API for getting list of all users
   */
  Users.findAll({
    attributes: ['user_id', 'email']
  })
  .then(users => {
    res.json(users);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
});

router.get('/users/new', function(req, res, next) {
  /**
   * API for getting list of new users (who didn't updated their profile)
   */
  Users.findAll({
    where: {
      is_new: true
    }
  })
  .then(users => {
    res.json(users);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
});

router.get('/users/:userId', function(req, res, next) {
  /**
   * API for getting profile detail of a specific user
   */
  Users.findOne({
    where: {
      user_id: req.params.userId
    }
  })
  .then(user => {
    if (user) {
      res.json(user);
    }
    else{
      res.json({"message": "user not found"});
    }
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
});

router.patch('/users/:userId', function(req, res, next) {
  /**
   * API to update profile of specific user
   */
  const updates = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    dob: req.body.dob,
    is_new: false,
    token: ''
  };

  Users.findOne({
    where: { user_id: req.params.userId }
  })
  .then(user => {
    return user.update(updates);
  })
  .then(updatedUser => {
    res.json(updatedUser);
  })
  .catch(err => {
    console.log(err);
    res.json({"message":"Error occured while updating, probably user with this email already exist"});
  });
});

router.delete('/users/:userId', (req, res, next) => {
  /**
   * API to delete any user
   */
  Users.destroy({
    where: {
      user_id: req.params.userId
    }
  })
  .then(deletedUser => {
    if (deletedUser == 1) {
      res.json({"message": "user deleted"});
    }
    else{
      res.json({"message": "user not found"});
    }
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
});

router.get('/get-token-user/:token', function(req, res, next) {
  /**
   * API to get user detail based on the token
   */
  Users.findOne({
    where: {
      token: req.params.token
    }
  })
  .then(user => {
    if (user) {
      res.json(user);
    }
    else{
      checkTokenValidity(res, req.params.token);
    }
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
});

function checkTokenValidity(res, token) {
  /**
   * Function to check validity of the token
   */
  const decodedToken = atob(token).split("##");
  if (decodedToken[1]) {
    Users.findOne({
      where: {
        user_id: decodedToken[1]
      }
    })
    .then(user => {
      if (user) {
        res.json({"message": "Link Expired"});
      }
      else{
        res.json({"message": "User not found"});
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  }
  else{
    res.json({"message": "Invalid Link"});
  }
}

module.exports = router;
