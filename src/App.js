import { useState, useEffect, useRef } from 'react'
import randomWords from 'random-words'

//styles
import './App.css'

//wpm world record is 216 words per minute, so i set words to 220
const AMOUNT_WORD = 220
const MINUTE = 60

function App() {
  const [words, setWords] = useState([])
  const [countDown, setCountDown] = useState(MINUTE)
  const [currentInput, setCurrentInput] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(-1)
  const [currentChar, setCurrentChar] = useState('')
  const [correct, setCorrent] = useState(0)
  const [gameStatus, setGameStatus] = useState('waiting')
  const [isStart, setIsStart] = useState(false)
  const inputRef = useRef(null)

  const generateWords = () => {
    return new Array(AMOUNT_WORD).fill(null).map(() => randomWords())
  }

  useEffect(() => {
    //generate english word
    setWords(generateWords())
  }, [])

  useEffect(() => {
    if (gameStatus === 'started') {
      inputRef.current.focus()
    }
  }, [gameStatus])

  const clearStateGameFinished = () => {
    setWords(generateWords())
    setCurrentWordIndex(0)
    setCorrent(0)
    setCurrentCharIndex(-1)
    setCurrentChar('')
  }

  const handleStart = () => {
    setIsStart(true)
    if (gameStatus === 'finished') {
      clearStateGameFinished()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key !== null) {
      if (gameStatus !== 'started') {
        setGameStatus('started')
        setCorrent(0)
        // timer 60 sec => 0 sec set timer
        let timer = setInterval(() => {
          setCountDown((prevCount) => {
            if (prevCount === 0) {
              //stop timer if time = 0
              clearInterval(timer)
              setGameStatus('finished')
              setCurrentInput('')
              setCurrentWordIndex(0)
              setCurrentCharIndex(-1)
              setCurrentChar('')
              setWords(generateWords())
              setIsStart(false)
              return MINUTE
            } else {
              return prevCount - 1
            }
          })
        }, 1000) //1000 milliseconds = 1 second
      }
    }

    //keycode 32 = spacebar
    if (e.keyCode === 32) {
      checkMatch()
      setCurrentInput('')
      setCurrentWordIndex(currentWordIndex + 1)
      setCurrentCharIndex(-1)
      //keycode 8 = backspace for move index back 1 position
    } else if (e.keyCode === 8) {
      setCurrentCharIndex(currentCharIndex - 1)
      setCurrentChar('')
    } else {
      setCurrentCharIndex(currentCharIndex + 1)
      setCurrentChar(e.key)
    }
  }

  const checkMatch = () => {
    const word = words[currentWordIndex]
    const isMatch = word === currentInput.trim()
    if (isMatch) {
      //store correct word in state
      setCorrent(correct + 1)
    }
  }

  const checkCorrect = (wordIndex, charIndex, chracter) => {
    //corrent math = green color style, incorrect math = red color styles
    if (
      wordIndex === currentWordIndex &&
      charIndex === currentCharIndex &&
      currentChar &&
      gameStatus !== 'finished'
    ) {
      if (chracter === currentChar) {
        return 'word-correct'
      } else {
        return 'word-incorrect'
      }
    } else if (
      wordIndex === currentWordIndex &&
      currentCharIndex >= words[currentWordIndex].length
    ) {
      return 'word-incorrect'
    } else {
      return ''
    }
  }

  console.log(inputRef.current)

  return (
    <div className="App">
      <div className="timer-section">
        <h1>Remaining Time: {countDown}</h1>
      </div>
      <div className="input-section">
        <input
          //i dont know how to check word only for typing not copy and paste
          // so i just disable copy paste events in input
          onPaste={(e) => {
            e.preventDefault()
            return false
          }}
          onCopy={(e) => {
            e.preventDefault()
            return false
          }}
          ref={inputRef}
          type="text"
          className="input"
          onKeyDown={handleKeyDown}
          onChange={(e) => setCurrentInput(e.target.value)}
          value={currentInput}
          disabled={!isStart}
        />
        <p>Note: press spacebar to go to next word</p>
      </div>
      {!isStart && (
        <div className="button-section">
          <button className="btn" onClick={handleStart}>
            Start
          </button>
        </div>
      )}
      {isStart && (
        <div className="word-section">
          {words.map((word, wordIndex) => (
            <span key={Math.random()}>
              <span>
                {word.split('').map((chracter, charIndex) => (
                  <span
                    className={checkCorrect(wordIndex, charIndex, chracter)}
                    key={Math.random()}
                  >
                    {chracter}
                  </span>
                ))}
              </span>
              <span> </span>
            </span>
          ))}
        </div>
      )}
      {gameStatus === 'finished' && (
        <div className="result-section">
          <h1>Words Per Minute: {correct}</h1>
        </div>
      )}
    </div>
  )
}

export default App
