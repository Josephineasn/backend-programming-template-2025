/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const gachaService = require('./gacha-service');
const usersService = require('../users/users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function gacha(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.userId);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    const sekarang = new Date();
    const tanggalHariIni = sekarang.toDateString();

    const tglTerakhir =
      user.lastDate && user.lastDate !== 0
        ? new Date(user.lastDate).toDateString()
        : null;

    let jumlahGachaYgBaru;

    if (tglTerakhir !== tanggalHariIni) {
      jumlahGachaYgBaru = 1;
    } else {
      const gachaCount = user.banyakGacha || 0;
      if (gachaCount >= 5) {
        throw errorResponder(
          errorTypes.VALIDATION_ERROR,
          'Gacha maksimal 5x sehari, coba lagi besok'
        );
        // return { error: 'Gacha maksimal 5x sehari, coba lagi besok' };
      }
      jumlahGachaYgBaru = gachaCount + 1;
    }

    const daftarHadiah = [
      { nama: 'Emas 10 gram', kuota: 1 },
      { nama: 'Smartphone X', kuota: 5 },
      { nama: 'Smartwatch Y', kuota: 10 },
      { nama: 'Voucher Rp 100.000', kuota: 100 },
      { nama: 'Pulsa Rp 50.000', kuota: 500 },
    ];

    let hadiahYgDidapat = null;

    for (const h of daftarHadiah) {
      const ttlPemenang = await gachaService.countWinners(h.nama);

      if (ttlPemenang < h.kuota) {
        hadiahYgDidapat = h.nama;

        await gachaService.createRewardLog(
          user._id,
          user.fullName,
          hadiahYgDidapat
        );
        break;
      }
    }

    const success = await usersService.gacha(
      request.params.userId,
      jumlahGachaYgBaru,
      tanggalHariIni
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Gagal update status gacha'
      );
    }

    return response.status(200).json({
      message: hadiahYgDidapat
        ? `Selamat!! Anda menang ${hadiahYgDidapat}`
        : 'Informasi tidak memenangkan hadiah apapun',
      data: {
        hadiah: hadiahYgDidapat,
        banyakGacha: jumlahGachaYgBaru,
        sisaKesempatan: 5 - jumlahGachaYgBaru,
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
  gacha,
  getMyHistory,
  getRemainKuota,
  getAllWinners,
};