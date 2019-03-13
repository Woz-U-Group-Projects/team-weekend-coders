module.exports = function (app) {
    const controller = require('../controllers/leads_controller');

    app.route('/leads')
        .get(controller.index)  //get method returns multiple
        .post(controller.create)        //post method

    app.route('/leads/:id')
        .get(controller.show)       //get method but by id - returns 1
        .put(controller.update)
        .delete(controller.destroy)
      
}