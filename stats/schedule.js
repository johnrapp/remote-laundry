const schedule = require('node-schedule');

module.exports = function(jobFunction) {
  const job = schedule.scheduleJob('0,30 * * * *', jobFunction);
  // const job = schedule.scheduleJob('*/10 * * * * *', jobFunction);

};
