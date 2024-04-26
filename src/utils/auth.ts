export const checkLoggedIn = (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.redirect('/auth/login');
  }
  return user;
};
