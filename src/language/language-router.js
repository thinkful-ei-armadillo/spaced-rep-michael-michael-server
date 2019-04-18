const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('../LinkedList');

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    const nextWord = await LanguageService.getNextWord(
      req.app.get('db'),
      req.language.id,
    )
    res.json({
      language: req.language,
      nextWord,
    })
    next() 
  })

languageRouter
  .post('/guess', async (req, res, next) => {
    const { guess } = req.body;

    const head = LanguageService.getLanguageHead(
      req.app.get('db'),
      req.user.id,
    )
    
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id,
    )
    
    const newWordData = new LinkedList();

    newWordData.insertFirst()

    
    

    if(guess === "correct"){
    LanguageService.incCorrectCount(
      req.app.get('db'),
      word
    )
    res.json({
      correct_count: word.correct_count
    })
    }
    if(guess === "incorrect"){
      LanguageService.incIncorrectCount(
        req.app.get('db'),
        word
      )
      res.json({
        incorrect_count: word.incorrect_count
      })
      }
    next()
  })

module.exports = languageRouter
