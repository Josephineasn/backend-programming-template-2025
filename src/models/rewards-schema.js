module.exports = (db) =>
  db.model(
    'Rewards',
    db.Schema({
      userId: { type: db.Schema.Types.ObjectId, ref: 'Users' },
      userName: String,
      namaHadiah: String,
      menangPada: { type: Date, default: Date.now },
    })
  );
