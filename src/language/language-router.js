const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedList = require('../LinkedList');

const languageRouter = express.Router();
const jsonBodyParser = express.json();

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
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const { guess } = req.body;
    const userGuess = guess;
    console.log('>>>USER GUESS', userGuess)
    const head = await LanguageService.getLanguageHead(
      req.app.get('db'),
      req.user.id,
    )

    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id,
    )

    const newWordData = new LinkedList();
    
    words.map(word => {
      newWordData.insertLast(word)
    });

    const wordsHead = newWordData.head.value;
    const wordsHeadNext = newWordData.head.next.value;

    if(userGuess == wordsHead.translation){
      wordsHead.correct_count += 1;
      wordsHead.memory_value *= 2;
      head.total_score += 1;
      const newScore = await LanguageService.updateTotalScore(
        req.app.get('db'),
        req.user.id,
        head.total_score
      )
      res
        .status(201)
        .json({
          nextWord: wordsHeadNext,
          wordCorrectCount: wordsHeadNext.correct_count,
          wordIncorrectCount: wordsHeadNext.incorrect_count,
          totalScore: head.total_score,
          answer: wordsHead.translation,
          isCorrect: true
        });
      newWordData.remove(wordsHead);
      newWordData.insertAt(wordsHead, wordsHead.memory_value + 1);
    }
    else if(userGuess != wordsHead.translation){
      wordsHead.incorrect_count += 1;
      wordsHead.memory_value = 1;
      res
        .status(201)
        .json({
          nextWord: wordsHeadNext,
          wordCorrectCount: wordsHeadNext.correct_count,
          wordIncorrectCount: wordsHeadNext.incorrect_count,
          totalScore: head.total_score,
          answer: wordsHead.translation,
          isCorrect: false
        });
      newWordData.remove(wordsHead);
      newWordData.insertAt(wordsHead, 2);
    }

    let node = newWordData.head;
    let newDB = [];
    while(node){
      newDB.push(node.value);
      node = node.next;
    }
   
    for(let i = 0; i < newDB.length; i++){
      let nextIdx = newDB[i].next;
      if(nextIdx !== null){
        nextIdx = newDB[i + 1].id;
        newDB[i].next = nextIdx;
      }
      else{
        nextIdx = null;
      }
    }

    for(let i = 0; i < newDB.length; i++){
      const wordObject = {
        memory_value: newDB[i].memory_value,
        correct_count: newDB[i].correct_count,
        incorrect_count: newDB[i].incorrect_count,
        next: newDB[i].next
      }
      await LanguageService.postNewWords(
        req.app.get('db'),
        newDB[i].id,
        wordObject
      )
    }
    next()
  })

module.exports = languageRouter
