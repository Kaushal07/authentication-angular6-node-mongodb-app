const expressConfig = require('./express-config');
const bodyParser = require('body-parser');
class AppConfig{

  constructor(app){
    this.app = app;
  }

  includeConfig() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    new expressConfig(this.app);
  }

}
module.exports = AppConfig;
