'use strict';

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageHead(db, user_id) {
    return db
      .from('language')
      .select(
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      );
  },

  getNextWord(db) {
    return db
      .from('word')
      .select(
        'id',
        'original',
        'translation',
        'correct_count',
        'incorrect_count'
      );
  },

  getTotalScore(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id );
  },

  postNewWords(db, id, wordObject){
    return db
      .from('word')
      .update(wordObject)
      .where('id', id)
  }
};

module.exports = LanguageService;
