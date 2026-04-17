/* eslint-disable object-shorthand */
const { Rewards } = require('../../../models');

async function countWinners(hadiah) {
  return Rewards.countDocuments({ namaHadiah: hadiah });
}

async function createRewardLog(userId, userName, hadiah) {
  return Rewards.create({
    userId,
    userName,
    namaHadiah: hadiah,
  });
}

async function getRewardHistory(userId = null) {
  const filter = userId ? { userId: userId } : {};
  return Rewards.find(filter);
}

module.exports = {
  countWinners,
  createRewardLog,
  getRewardHistory,
};
