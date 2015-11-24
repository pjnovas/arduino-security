
import superagent from 'superagent';

const timer = 5*1000*60; // 5 min
const url = 'http://45.79.210.116:5007';

function postIP() {
  superagent
    .post(url)
    .end(function (err, res) {
      if (err) {
        console.log('Error on posting IP');
        console.dir(err);
      }

      setTimeout(postIP, timer);
    });
};

postIP();
