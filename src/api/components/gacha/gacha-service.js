/* eslint-disable no-else-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const gachaRepository = require('./gacha-repository');

async function countWinners(hadiah) {
  return gachaRepository.countWinners(hadiah);
}

async function createRewardLog(userId, userName, hadiah) {
  return gachaRepository.createRewardLog(userId, userName, hadiah);
}

function sensorName(name) {
  if (!name) {
    return 'Anonymous';
  }

  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 1) {
        return '*';
      }

      const style = Math.floor(Math.random() * 3);

      if (style === 0) {
        return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
      } else if (style === 1) {
        return '*'.repeat(word.length - 2) + word.substring(word.length - 2);
      } else {
        return word.substring(0, 2) + '*'.repeat(word.length - 2);
      }
    })
    .join(' ');
}

async function getMyHistory(userId) {
  return gachaRepository.getRewardHistory(userId);
}

async function getAllWinners() {
  const winners = await gachaRepository.getRewardHistory();
  return winners.map((w) => ({
    namaHadiah: w.namaHadiah,
    userName: sensorName(w.userName),
    menangPada: w.menangPada,
  }));
}

async function getRemainKuota() {
  const daftarHadiah = [
    { nama: 'Emas 10 gram', kuota: 1 },
    { nama: 'Smartphone X', kuota: 5 },
    { nama: 'Smartwatch Y', kuota: 10 },
    { nama: 'Voucher Rp 100.000', kuota: 100 },
    { nama: 'Pulsa Rp 50.000', kuota: 500 },
  ];

  const statusHadiah = [];
  for (const h of daftarHadiah) {
    const terpakai = await gachaRepository.countWinners(h.nama);
    statusHadiah.push({
      namaHadiah: h.nama,
      sisaKuota: h.kuota - terpakai,
    });
  }
  return statusHadiah;
}

module.exports = {
  countWinners,
  createRewardLog,
  getMyHistory,
  getAllWinners,
  getRemainKuota,
};
