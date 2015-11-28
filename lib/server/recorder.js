
import fs from "fs";
import path from "path";

import superagent from 'superagent';
import moment from 'moment';

import { recorder as settings } from 'config.json';

function postImage(raw) {
  superagent
    .post(settings.url)
    .send(JSON.stringify({ secret: settings.secret }))
    .end(function (err, res) {
      if (err) {
        console.log('Error on posting IP');
        console.dir(err);
      }

      setTimeout(postIP, settings.interval*1000*60);
    });
};

const senders = {
  http: (attrs, raw) => {
    superagent
      .post(attrs.url)
      .send(JSON.stringify({
        secret: attrs.secret,
        base64: raw,
        extension: "jpg"
      }))
      .end(function (err, res) {
        if (err) {
          console.log('Error on posting Base64 Image to HTTP');
          console.dir(err);
        }
      });
  },
  fs: (attrs, raw) => {
    var filename = moment().format("YYYYMMDD_HHmmss_x") + ".jpg";
    var abs = path.join(attrs.path, filename);

    fs.writeFile(abs, raw, 'base64', function (err) {
      if (err) {
        console.log('Error on storing Base64 Image to FS');
        console.dir(err);
      }
    });
  }
}

export default {

  store: function(raw){

    if (!settings.enabled){
      return;
    }

    settings.destinations.forEach( dest => {
      if (dest.enabled){
        senders[dest.type.toLowerCase()](dest, raw);
      }
    });

  }

};
