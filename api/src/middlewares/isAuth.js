// @ts-nocheck
export async function checkAuthenticated(req, res, next) {
  //   console.log(req.user);
  if (req.method == "OPTIONS") return next();
  if (!req?.user) return res.status(403).send();
  return next();
}

// For user profile related endpoints
export async function authorizeProfileMethod(req, res, next) {
  console.warn(`Authorize check: ${req.params.id} - ${req.user}`);

  if (!req.params.id || !req?.user) {
    return res.status(403).send();
  } else if (req.user === req.params.id) return next();
}
