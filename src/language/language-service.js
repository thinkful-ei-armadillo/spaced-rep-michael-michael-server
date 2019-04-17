'use strict';

const wordData = require('./arraytolist');

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
        
        
        'language.head'
        
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
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
      )
      .where({ language_id });
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
    // .where(wordData.head.value, 'word.id');
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

  incCorrectCount(db, word_id){
    return db
      .from('word')
      .select('*')
      .where('id', language.head)
      }
  },

  incIncorrectCount(db, word_id){
    return db
      .from('word')
      .where({word_id})
      .update({
        incorrect_count: incorrect_count + 1
      })
  }
};

module.exports = LanguageService;
