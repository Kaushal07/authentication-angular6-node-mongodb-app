const Auth = require('../../models/auth.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto').randomBytes(256).toString('hex');

class AuthController {
  constructor(app) {
    app.post('/register', this.register);
    app.post('/login', this.login);
    app.get('/check-username',this.checkUserNameAvailability);
  }

  register(req, res) {
    if (!req.body.UserName) {
      return res.send({success: false, message: 'You must provide a username'});
    }
    if (!req.body.Email) {
      return res.send({success: false, message: 'You must provide an e-mail'});
    }
    if (!req.body.Password) {
      return res.json({success: false, message: 'You must provide a password'});
    }

    let newUser = new Auth({
      UserName:req.body.UserName,
      Email: req.body.Email.toLowerCase(),
      Password: req.body.Password,
      Online: 'N',
      SocketId: ''
    });

    Auth.findOne({Email: newUser.Email})
      .then((user) => {
        if (user) {
          return res.send({success: false, message: " User already Exist. try with different email."});
        }
        return newUser;
      })
      .then((user) => {
        return user.save();
      })
      .then(() => {
        return res.send({success: true, message: 'Account registered!'});
      })
      .catch((e) => {
        res.send({success: false, Error: e, message: "Error while registering user."});
      })
  }

  login(req, res) {
    if (!req.body.Email) {
      return res.send({success: false, message: 'No email was provided'});
    }
    if (!req.body.Password) {
      return res.send({success: false, message: 'No password was provided.'});
    }
    let emailAddress = req.body.Email.toLowerCase();
    let password = req.body.Password;
    Auth.findOne({Email: emailAddress})
      .then((user) => {
        if (!user) {
          return res.send({success: false, message: 'User not found.'});
        }
        const savedPassword = user.Password;
        if (password !== savedPassword) {
          return res.send({success: false, message: 'Password invalid'});
        }
        return user;
      })
      .then((user) => {
        const token = jwt.sign({userId: user._id}, crypto, {expiresIn: '24h'});
        res.send({
          success: true,
          message: 'Login Successful!',
          token: token,
          user: user

        });
      }).catch((e) => {
      res.send({success: false, Error: e, message: "Error while logging user."});
    })
  }

  checkUserNameAvailability(req,res){
     let username = req.query.UserName;
     Auth.findOne({UserName: username})
      .then((user) => {
        if (user) {
          return res.send({success: false, message: " Username not available."});
        }
        return res.send({success: true, message: " Username available."});
      })
       .catch((e)=>{
            res.send({success: false, Error: e, message: "Error while checking username."});
       })
  }
}

module.exports = AuthController;


