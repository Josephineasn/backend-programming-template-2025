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
      }
      if (style === 1) {
        return '*'.repeat(word.length - 2) + word.substring(word.length - 2);
      }
      return word.substring(0, 2) + '*'.repeat(word.length - 2);
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
    waktuMenang: w.waktuMenang,
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

  const statusHadiah = await Promise.all(
    daftarHadiah.map(async (h) => {
      const hadiahYangTerpakai = await gachaRepository.countWinners(h.nama);
      return {
        namaHadiah: h.nama,
        sisaKuota: h.kuota - hadiahYangTerpakai,
      };
    })
  );
  return statusHadiah;
}

async function tentukanHadiah(daftarHadiah, userId, fullName) {
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < daftarHadiah.length; i += 1) {
    const h = daftarHadiah[i];
    const totalPemenang = await gachaRepository.countWinners(h.nama);

    if (totalPemenang < h.kuota) {
      await gachaRepository.createRewardLog(userId, fullName, h.nama);
      return h.nama;
    }
  }
  return null;
}

module.exports = {
  countWinners,
  createRewardLog,
  getMyHistory,
  getAllWinners,
  getRemainKuota,
  tentukanHadiah,
};
