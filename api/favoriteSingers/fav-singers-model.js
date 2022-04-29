const db = require('../../data/dbConfig')

module.exports = {
    getAll() {
        return db('favoriteSingers')
    },

    getById(id) {
        return db('favoriteSingers')
          .where('id', id)
          .first();
    },
      
    async insert(singer) {
        return db('favoriteSingers')
          .insert(singer)
          .then(([id]) => this.getById(id));
    },
      
    async update(id, changes) {
        return db('favoriteSingers')
          .update(changes)
          .where('id', id)
          .then(() => this.getById(id));
    },
      
    async remove(id) {
        const result = await this.getById(id);
        await db('favoriteSingers').del().where('id', id);
        return result;
    }
}