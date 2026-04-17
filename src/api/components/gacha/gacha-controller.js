/* eslint-disable no-underscore-dangle */

const gachaService = require('./gacha-service');
const usersService = require('../users/users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function mainGacha(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.userId);

    if (!user) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'User tidak ditemukan'
      );
    }

    const now = new Date();
    const tanggalHariIni = now.toDateString();

    const tanggalTerakhir =
      user.lastDate && user.lastDate !== 0
        ? new Date(user.lastDate).toDateString()
        : null;

    let jumlahGachaYangBaru;

    if (tanggalTerakhir !== tanggalHariIni) {
      jumlahGachaYangBaru = 1;
    } else {
      const gachaCount = user.banyakGacha || 0;
      if (gachaCount >= 5) {
        throw errorResponder(
          errorTypes.VALIDATION_ERROR,
          'Gacha maksimal 5x sehari, coba lagi besok'
        );
        // return { error: 'Gacha maksimal 5x sehari, coba lagi besok' };
      }
      jumlahGachaYangBaru = gachaCount + 1;
    }

    const daftarHadiah = [
      { nama: 'Emas 10 gram', kuota: 1 },
      { nama: 'Smartphone X', kuota: 5 },
      { nama: 'Smartwatch Y', kuota: 10 },
      { nama: 'Voucher Rp 100.000', kuota: 100 },
      { nama: 'Pulsa Rp 50.000', kuota: 500 },
    ];

    /* eslint-disable no-await-in-loop */
    let hadiahYangDiDapat = null;

    for (let i = 0; i < daftarHadiah.length; i += 1) {
      const h = daftarHadiah[i];
      const totalSemuaPemenang = await gachaService.countWinners(h.nama);

      if (totalSemuaPemenang < h.kuota) {
        hadiahYangDiDapat = h.nama;

        const { _id: userId, fullName } = user;
        await gachaService.createRewardLog(userId, fullName, hadiahYangDiDapat);
        break;
      }
    }
    const success = await usersService.mainGacha(
      request.params.userId,
      jumlahGachaYangBaru,
      tanggalHariIni
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Gagal update status gacha'
      );
    }

    return response.status(200).json({
      message: hadiahYangDiDapat
        ? `Selamat!! Anda menang ${hadiahYangDiDapat}`
        : 'Informasi tidak memenangkan hadiah apapun',
      data: {
        hadiah: hadiahYangDiDapat,
        banyakGacha: jumlahGachaYangBaru,
        sisaKesempatan: 5 - jumlahGachaYangBaru,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getMyHistory(request, response, next) {
  try {
    const history = await gachaService.getMyHistory(request.params.userId);
    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

async function getRemainKuota(request, response, next) {
  try {
    const quota = await gachaService.getRemainKuota();
    return response.status(200).json(quota);
  } catch (error) {
    return next(error);
  }
}

async function getAllWinners(request, response, next) {
  try {
    const winners = await gachaService.getAllWinners();
    return response.status(200).json(winners);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  mainGacha,
  getMyHistory,
  getRemainKuota,
  getAllWinners,
};
