const usersRepository = require('./users-repository');

async function getUsers() {
  return usersRepository.getUsers();
}

async function getUser(id) {
  return usersRepository.getUser(id);
}

async function emailExists(email) {
  const user = await usersRepository.getUserByEmail(email);
  return !!user; // Return true if user exists, false otherwise
}

async function createUser(email, password, fullName, banyakGacha, lastDate) {
  return usersRepository.createUser(
    email,
    password,
    fullName,
    banyakGacha,
    lastDate
  );
}

async function updateUser(id, email, fullName) {
  return usersRepository.updateUser(id, email, fullName);
}

async function deleteUser(id) {
  return usersRepository.deleteUser(id);
}

async function mainGacha(id, banyakGacha, tanggalHariIni) {
  return usersRepository.mainGacha(id, banyakGacha, tanggalHariIni);
}

module.exports = {
  getUsers,
  getUser,
  emailExists,
  createUser,
  updateUser,
  deleteUser,
  mainGacha,
};
