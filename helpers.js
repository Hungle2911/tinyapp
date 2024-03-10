function generateRandomString() {
  let result = [];
  let alphanumeric = `123456789qwertyuiopasdfghjklzxcvbnm`;
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * alphanumeric.length);
    result.push(alphanumeric[random]);
  }
  return result.join('');
}
function getUserByEmail(database, email) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  } return null;
}
const urlsForUser = (id, urlDatabase) => {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};
module.exports = {generateRandomString, getUserByEmail, urlsForUser};