
import superagent from 'superagent';

import { alive as settings } from 'config.json';

// settings.user and pwd

function postIP() {
  superagent
    .post(settings.url)
    .end(function (err, res) {
      if (err) {
        console.log('Error on posting IP');
        console.dir(err);
      }

      setTimeout(postIP, settings.interval*1000*60);
    });
};

if (settings.enabled){
  postIP();
}
