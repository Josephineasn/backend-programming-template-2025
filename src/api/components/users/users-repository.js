/* eslint-disable object-shorthand */
const { Users } = require('../../../models');

async function getUsers() {
  return Users.find({});
}

async function getUser(id) {
  return Users.findById(id);
}

async function getUserByEmail(email) {
  return Users.findOne({ email });
}

async function createUser(email, password, fullName, banyakGacha, lastDate) {
  return Users.create({ email, password, fullName, banyakGacha, lastDate });
}

async function updateUser(id, email, fullName) {
  return Users.updateOne({ _id: id }, { $set: { email, fullName } });
}

async function changePassword(id, password) {
  return Users.updateOne({ _id: id }, { $set: { password } });
}

async function deleteUser(id) {
  return Users.deleteOne({ _id: id });
}

async function gacha(id, banyakGacha, tanggalHariIni) {
  return Users.updateOne(
    { _id: id },
    { $set: { banyakGacha: banyakGacha, lastDate: tanggalHariIni } }
  );
}

module.exports = {
  getUsers,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  gacha,
};
