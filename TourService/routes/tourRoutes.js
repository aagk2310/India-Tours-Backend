const express = require('express');
const router = express.Router();
const controller = require('../controller/tourController');

router
  .route('/validate')
  .post(controller.validateTourIDsAndPopulateTours, controller.sendTours);
router.route('/').get(controller.getTours).post(controller.createTour);
router.route('/:id').get(controller.findTour);

module.exports = router;
