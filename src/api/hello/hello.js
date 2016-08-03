function* helloWorld(req, res) {
  return res.send({
    greetings: `Hello ${req.swagger.params.userName.raw}, you are: ${req.swagger.params.age.raw}`
  });
}

module.exports = { helloWorld };
