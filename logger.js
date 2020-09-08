const logger = {
  info: function () {
    console.log.apply(this, arguments);
  },
};
module.exports = logger;
