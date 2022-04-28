exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('favoriteSingers').truncate()
  await knex('favoriteSingers').insert([
    { name: 'Song Sohee' },
    { name: 'Johnny Cash' },
    { name: 'Ado' },
    { name: 'Song Ga In' },
    { name: 'Zheng Zhi Hua' },
  ]);
};
