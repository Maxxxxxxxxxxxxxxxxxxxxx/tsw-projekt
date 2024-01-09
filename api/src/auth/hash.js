export default function hash(password) {
  bcrypt.hash(password, 10, function (err, hashedPassword) {
    if (err) {
      console.error(err);
      return;
    }

    return hashedPassword;
  });
}
