function isPasswordValid(password) {
  try {
    const passwordRegex = /^(?=\S+$).{8,}$/;
    return passwordRegex.test(password);
  } catch (error) {
    return false;
  }
}

module.exports = { isPasswordValid };
