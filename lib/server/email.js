
import { EventEmitter } from 'events';
import nodemailer from 'nodemailer';
import inlineBase64 from 'nodemailer-plugin-inline-base64';

import { email as settings } from 'config.json';

class Email extends EventEmitter {

  state = {
    enabled: false
  }

  constructor(){
    super();

    this.transport = nodemailer.createTransport(settings.transport);
    this.transport.use('compile', inlineBase64);

    this.state.enabled = settings.enabled;
  }

  sendAlarm(screenshots){
    var html = '<h1>Alarm fired at ' + (new Date().toString()) + '</h1>';
    html += '<br/>';

    if (screenshots){
      screenshots.forEach(sc => {
        html += '<img src="data:image/png;base64,' + sc + '">';
        html += '<br/>';
      });
    }

    this.send("ALARM!", html);
  }

  send(title, content){
    if (!this.state.enabled){
      return;
    }

    var emailCfg = settings.notify;

    var mailOpts = {
      from: emailCfg.sendAs,
      to: emailCfg.sendTo,
      subject: 'Home Portal: ' + title,
      html : content
    };

    this.transport.sendMail(mailOpts, function (err, response) {
      if (err) {
        log('error on sending email >> ', err);
        return;
      }
    });
  }

};

const instance = new Email();
export default instance;
