// @ts-ignore
export async function checkAuthenticated(req, res, next) {
  //   console.log(req.user);
  if (req.method == "OPTIONS") return next();
  if (!req?.user) return res.status(403).send();
  return next();
}
