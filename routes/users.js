var express = require('express');
var router = express.Router();

// GET users listing.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// POST users listing.
router.post('/', function(req, res, next) {
  if (req.method === 'POST' && req.path.startsWith('/users')) {
    console.log('POST from a user');
  }
  next();
});

module.exports = router;