const adminController = {
  show(req, res) {
    res.render('pages/admin', { title: 'Administración' });
  },
};

module.exports = adminController;
