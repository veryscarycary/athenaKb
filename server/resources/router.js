'use strict'
const router = require('../config/middleware.js').router();
const api = require('./controller.js');

router.route('/metrics')
  .get(api.getRelations);

router.route('/api')
  .get(api.getArticle)
  .post(api.createArticle);

router.route('/api/:id')
  .get(api.getArticle)
  .put(api.editArticle)
  .delete(api.deleteArticle);

router.get('/', api.pingDb)

module.exports = router;
