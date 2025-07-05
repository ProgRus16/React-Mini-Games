import React, { useState, useEffect, useRef, useCallback } from 'react';
import Stories from './stories.json';
// Стили для кнопок (общие для всех игр)
const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '10px',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#45a049'
  }
};


export const Wordle = () => {
  const WORDS = [
  'РЕАКТ', 'ГОЙДА', 'СТЕЙТ', 'ПРОПС', 'ФОРМА', 
  'КЛАСС', 'МЕТОД', 'ПРАВО', 'ПАЛЕЦ', 'ВЫБОР',
  'ВИРУС', 'СЕРВЕР', 'КЛИЕНТ', 'СТОЛБ', 'ГОРОД'
];
const MAX_ATTEMPTS = 6;
  // Состояния игры
  const [secretWord, setSecretWord] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [message, setMessage] = useState('');

  // Инициализация игры
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setSecretWord(randomWord);
    setAttempts([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setMessage('');
  };

  // Проверка победы/поражения
  useEffect(() => {
    if (!secretWord) return;

    if (attempts.some(attempt => attempt.word === secretWord)) {
      setGameStatus('won');
      setMessage('🎉 Поздравляем! Вы угадали слово!');
    } else if (attempts.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
      setMessage(`😢 Игра окончена. Загаданное слово: ${secretWord}`);
    }
  }, [attempts, secretWord]);

  // Обработка ввода буквы
  const handleKeyPress = (letter) => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + letter);
    }
  };

  // Удаление буквы
  const handleDelete = () => {
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  // Отправка попытки
  const handleSubmit = () => {
    if (currentGuess.length !== 5) {
      setMessage('Введите 5 букв!');
      return;
    }

    if (!WORDS.includes(currentGuess)) {
      setMessage('Слово не найдено в словаре!');
      return;
    }

    // Анализ букв
    const letters = currentGuess.split('').map((letter, index) => {
      if (letter === secretWord[index]) {
        return { letter, status: 'correct' };
      } else if (secretWord.includes(letter)) {
        return { letter, status: 'present' };
      } else {
        return { letter, status: 'absent' };
      }
    });

    setAttempts(prev => [...prev, { word: currentGuess, letters }]);
    setCurrentGuess('');
    setMessage('');
  };

  // Визуализация игрового поля
  const renderBoard = () => {
    return Array(MAX_ATTEMPTS).fill(0).map((_, rowIndex) => {
      if (rowIndex < attempts.length) {
        // Отображение завершенных попыток
        return (
          <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            {attempts[rowIndex].letters.map(({ letter, status }, cellIndex) => (
              <div 
                key={cellIndex}
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 5px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  backgroundColor: 
                    status === 'correct' ? '#6aaa64' :
                    status === 'present' ? '#c9b458' :
                    '#787c7e',
                  color: 'white',
                  borderRadius: '4px'
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        );
      }

      if (rowIndex === attempts.length) {
        // Текущая попытка
        return (
          <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            {Array(5).fill(0).map((_, cellIndex) => (
              <div
                key={cellIndex}
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 5px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  border: '2px solid #d3d6da',
                  borderRadius: '4px',
                  backgroundColor: 'white'
                }}
              >
                {currentGuess[cellIndex]}
              </div>
            ))}
          </div>
        );
      }

      // Пустые клетки для будущих попыток
      return (
        <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          {Array(5).fill(0).map((_, cellIndex) => (
            <div
              key={cellIndex}
              style={{
                width: '50px',
                height: '50px',
                margin: '0 5px',
                border: '2px solid #d3d6da',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa'
              }}
            />
          ))}
        </div>
      );
    });
  };

  // Визуализация клавиатуры
  const renderKeyboard = () => {
    const rows = [
      ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
      ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
      ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', '⌫', '⏎']
    ];

    // Определение статуса клавиш
    const getKeyStatus = (letter) => {
      for (const attempt of attempts) {
        for (const { letter: l, status } of attempt.letters) {
          if (l === letter) {
            if (status === 'correct') return 'correct';
            if (status === 'present') return 'present';
            return 'absent';
          }
        }
      }
      return '';
    };

    return (
      <div style={{ marginTop: '20px' }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            {row.map(key => {
              if (key === '⌫') {
                return (
                  <button
                    key="delete"
                    onClick={handleDelete}
                    style={{
                      ...keyStyle,
                      width: '70px',
                      backgroundColor: '#d3d6da'
                    }}
                  >
                    {key}
                  </button>
                );
              } else if (key === '⏎') {
                return (
                  <button
                    key="submit"
                    onClick={handleSubmit}
                    disabled={currentGuess.length !== 5 || gameStatus !== 'playing'}
                    style={{
                      ...keyStyle,
                      width: '70px',
                      backgroundColor: '#d3d6da'
                    }}
                  >
                    {key}
                  </button>
                );
              } else {
                const status = getKeyStatus(key);
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    disabled={gameStatus !== 'playing'}
                    style={{
                      ...keyStyle,
                      backgroundColor: 
                        status === 'correct' ? '#6aaa64' :
                        status === 'present' ? '#c9b458' :
                        status === 'absent' ? '#787c7e' : '#d3d6da',
                      color: status ? 'white' : 'black'
                    }}
                  >
                    {key}
                  </button>
                );
              }
            })}
          </div>
        ))}
      </div>
    );
  };

  // Стиль для клавиш
  const keyStyle = {
    minWidth: '40px',
    height: '50px',
    margin: '0 3px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 10px'
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Wordle</h2>
      
      {message && (
        <div style={{ 
          margin: '10px 0',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      {renderBoard()}
      
      {gameStatus === 'playing' && renderKeyboard()}

      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <button
          onClick={startNewGame}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Новая игра
        </button>
      )}
    </div>
  );
};

export const Hangman = () => {
  // Словарь слов (можно использовать те же, что и для Wordle)
const WORDS = [
  'РЕАКТ', 'ГОЙДА', 'СТЕЙТ', 'ПРОПС', 'ФОРМА', 
  'КЛАСС', 'МЕТОД', 'ПРАВО', 'ПАЛЕЦ', 'ВЫБОР',
  'ВИРУС', 'СЕРВЕР', 'КЛИЕНТ', 'СТОЛБ', 'ГОРОД'
];

  // Максимальное количество ошибок
  const MAX_WRONG = 6;
  
  // Состояния игры
  const [secretWord, setSecretWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [message, setMessage] = useState('');

  // Инициализация игры
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setSecretWord(randomWord);
    setGuessedLetters([]);
    setWrongAttempts(0);
    setGameStatus('playing');
    setMessage('');
  };

  // Проверка статуса игры
  useEffect(() => {
    if (!secretWord) return;

    // Проверка победы
    const isWinner = secretWord.split('').every(letter => 
      guessedLetters.includes(letter)
    );
    
    if (isWinner) {
      setGameStatus('won');
      setMessage('🎉 Поздравляем! Вы выиграли!');
      return;
    }

    // Проверка поражения
    if (wrongAttempts >= MAX_WRONG) {
      setGameStatus('lost');
      setMessage(`😢 Игра окончена. Слово: ${secretWord}`);
    }
  }, [guessedLetters, wrongAttempts, secretWord]);

  // Обработка угадывания буквы
  const handleGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    // Увеличиваем счетчик ошибок, если буквы нет в слове
    if (!secretWord.includes(letter)) {
      setWrongAttempts(prev => prev + 1);
    }
  };

  // Генерация виселицы (ASCII арт)
  const renderHangman = () => {
    const stages = [
      `
        +---+
        |   |
            |
            |
            |
           ===
      `,
      `
        +---+
        |   |
        O   |
            |
            |
           ===
      `,
      `
        +---+
        |   |
        O   |
        |   |
            |
           ===
      `,
      `
        +---+
        |   |
        O   |
       /|   |
            |
           ===
      `,
      `
        +---+
        |   |
        O   |
       /|\\  |
            |
           ===
      `,
      `
        +---+
        |   |
        O   |
       /|\\  |
       /    |
           ===
      `,
      `
        +---+
        |   |
        O   |
       /|\\  |
       / \\  |
           ===
      `
    ];

    return (
      <pre style={{ 
        fontFamily: 'monospace',
        fontSize: '18px',
        lineHeight: '1.2',
        margin: '20px 0'
      }}>
        {stages[wrongAttempts]}
      </pre>
    );
  };

  // Отображение загаданного слова
  const renderWord = () => {
    return secretWord.split('').map((letter, index) => (
      <span 
        key={index}
        style={{
          display: 'inline-block',
          width: '30px',
          height: '40px',
          margin: '0 5px',
          borderBottom: '3px solid #333',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          visibility: guessedLetters.includes(letter) ? 'visible' : 'hidden'
        }}
      >
        {letter}
      </span>
    ));
  };

  // Визуализация клавиатуры
  const renderKeyboard = () => {
    const rows = [
      ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И'],
      ['Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С'],
      ['Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ'],
      ['Ы', 'Ь', 'Э', 'Ю', 'Я']
    ];

    return (
      <div style={{ marginTop: '20px' }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ 
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            {row.map(letter => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={
                  guessedLetters.includes(letter) || 
                  gameStatus !== 'playing'
                }
                style={{
                  width: '35px',
                  height: '40px',
                  margin: '0 3px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: guessedLetters.includes(letter)
                    ? secretWord.includes(letter)
                      ? '#a5d6a7' // Правильная буква
                      : '#ef9a9a' // Неправильная буква
                    : '#e0e0e0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Виселица</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Ошибок: {wrongAttempts} из {MAX_WRONG}</p>
      </div>

      {renderHangman()}
      
      <div style={{ margin: '20px 0' }}>
        {renderWord()}
      </div>

      {message && (
        <div style={{ 
          margin: '10px 0',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      {gameStatus === 'playing' && renderKeyboard()}

      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <button
          onClick={startNewGame}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Новая игра
        </button>
      )}
    </div>
  );
};

export const TicTacToe = () => {
  // Состояния игры
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'draw'
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  // Определение победителя
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setGameStatus('won');
      setWinner(result.winner);
      setWinningLine(result.line);
    } else if (!board.includes(null)) {
      setGameStatus('draw');
    }
  }, [board]);

  // Обработка хода
  const handleClick = (index) => {
    if (board[index] || gameStatus !== 'playing') return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Сброс игры
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('playing');
    setWinner(null);
    setWinningLine([]);
  };

  // Определение победителя
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтали
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикали
      [0, 4, 8], [2, 4, 6]             // Диагонали
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  // Стиль для ячейки
  const cellStyle = (index) => ({
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    backgroundColor: winningLine.includes(index) ? '#a5d6a7' : '#f5f5f5',
    border: '2px solid #333',
    cursor: board[index] || gameStatus !== 'playing' ? 'default' : 'pointer',
    transition: 'background-color 0.3s'
  });

  // Визуализация статуса игры
  const renderStatus = () => {
    if (gameStatus === 'won') {
      return `Победитель: ${winner}`;
    }
    if (gameStatus === 'draw') {
      return 'Ничья!';
    }
    return `Следующий ход: ${isXNext ? 'X' : 'O'}`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Крестики-нолики</h2>
      
      <div style={{ 
        marginBottom: '20px',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        {renderStatus()}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 80px)',
        gap: '5px',
        justifyContent: 'center',
        margin: '0 auto 20px',
        width: 'fit-content'
      }}>
        {board.map((cell, index) => (
          <div
            key={index}
            style={cellStyle(index)}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Новая игра
      </button>
    </div>
  );
};

export const Minesweeper = () => {
  // Настройки игры
  const BOARD_SIZE = 10;
  const MINES_COUNT = 15;

  // Состояния игры
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('ready'); // 'ready' | 'playing' | 'won' | 'lost'
  const [flags, setFlags] = useState(MINES_COUNT);
  const [revealedCount, setRevealedCount] = useState(0);

  // Инициализация игрового поля
  const initializeBoard = () => {
    return Array(BOARD_SIZE).fill().map(() => 
      Array(BOARD_SIZE).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
  };

  // Расстановка мин после первого хода
  const placeMines = (board, firstClickRow, firstClickCol) => {
    let minesPlaced = 0;
    const newBoard = JSON.parse(JSON.stringify(board));
    const safeZone = [];

    // Запрещаем ставить мину на первую ячейку и вокруг нее
    for (let r = Math.max(0, firstClickRow - 1); r <= Math.min(BOARD_SIZE - 1, firstClickRow + 1); r++) {
      for (let c = Math.max(0, firstClickCol - 1); c <= Math.min(BOARD_SIZE - 1, firstClickCol + 1); c++) {
        safeZone.push(`${r},${c}`);
      }
    }

    while (minesPlaced < MINES_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);

      if (!safeZone.includes(`${row},${col}`) && !newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Подсчет мин вокруг каждой ячейки
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
              if (newBoard[r][c].isMine) count++;
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    return newBoard;
  };

  // Начало новой игры
  const startNewGame = () => {
    setBoard(initializeBoard());
    setGameStatus('ready');
    setFlags(MINES_COUNT);
    setRevealedCount(0);
  };

  // Первый ход (расстановка мин)
  const firstMove = (row, col) => {
    const newBoard = placeMines(board, row, col);
    setBoard(newBoard);
    setGameStatus('playing');
    revealCell(row, col, newBoard);
  };

  // Открытие ячейки
  const revealCell = (row, col, boardToUpdate) => {
    const newBoard = JSON.parse(JSON.stringify(boardToUpdate));
    
    if (
      row < 0 || row >= BOARD_SIZE || 
      col < 0 || col >= BOARD_SIZE ||
      newBoard[row][col].isRevealed || 
      newBoard[row][col].isFlagged
    ) return;

    newBoard[row][col].isRevealed = true;
    setRevealedCount(prev => prev + 1);

    if (newBoard[row][col].isMine) {
      setGameStatus('lost');
      revealAllMines(newBoard);
      return;
    }

    if (newBoard[row][col].neighborMines === 0) {
      for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
          if (r !== row || c !== col) {
            revealCell(r, c, newBoard);
          }
        }
      }
    }

    if (revealedCount + 1 === BOARD_SIZE * BOARD_SIZE - MINES_COUNT) {
      setGameStatus('won');
    }

    setBoard(newBoard);
  };

  // Пометка ячейки флажком
  const toggleFlag = (row, col) => {
    if (gameStatus !== 'ready' && gameStatus !== 'playing') return;
    if (board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setFlags(prev => newBoard[row][col].isFlagged ? prev - 1 : prev + 1);
  };

  // Открытие всех мин при проигрыше
  const revealAllMines = (boardToUpdate) => {
    const newBoard = JSON.parse(JSON.stringify(boardToUpdate));
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col].isMine) {
          newBoard[row][col].isRevealed = true;
        }
      }
    }
    setBoard(newBoard);
  };

  // Обработчик кликов
  const handleCellClick = (row, col) => {
    if (gameStatus === 'lost' || gameStatus === 'won') return;
    if (gameStatus === 'ready') firstMove(row, col);
    else revealCell(row, col, board);
  };

  const handleRightClick = (e, row, col) => {
    e.preventDefault();
    toggleFlag(row, col);
  };

  // Рендер ячейки
  const renderCell = (row, col) => {
    const cell = board[row][col];
    let content = '';
    let backgroundColor = '#ddd';
    let color = '#000';

    if (cell.isRevealed) {
      backgroundColor = '#fff';
      if (cell.isMine) {
        content = '💣';
        backgroundColor = '#ffcccc';
      } else if (cell.neighborMines > 0) {
        content = cell.neighborMines;
        const colors = ['', 'blue', 'green', 'red', 'darkblue', 'brown', 'teal', 'black', 'gray'];
        color = colors[cell.neighborMines];
      }
    } else {
      backgroundColor = '#ccc';
      if (cell.isFlagged) content = '🚩';
    }

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleCellClick(row, col)}
        onContextMenu={(e) => handleRightClick(e, row, col)}
        style={{
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #999',
          backgroundColor,
          color,
          fontWeight: 'bold',
          fontSize: '20px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        {content}
      </div>
    );
  };

  // Инициализация при монтировании
  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Сапёр</h2>
      
      <div style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
        {gameStatus === 'ready' && 'Сделайте первый ход'}
        {gameStatus === 'playing' && `Флагов осталось: ${flags}`}
        {gameStatus === 'won' && '🎉 Победа! 🎉'}
        {gameStatus === 'lost' && '💥 Вы проиграли! 💥'}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 30px)`,
        gap: '2px',
        justifyContent: 'center',
        margin: '0 auto 20px',
        backgroundColor: '#999',
        padding: '2px',
        border: '2px solid #666'
      }}>
        {board.map((row, rowIndex) => 
          row.map((_, colIndex) => renderCell(rowIndex, colIndex))
        )}
      </div>

      <button
        onClick={startNewGame}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Новая игра
      </button>
    </div>
  );
};

export const FifteenPuzzle = () => {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [suggestedMoves, setSuggestedMoves] = useState([]);
  const canvasRef = useRef(null);
  const tileSize = 80;

  // Вспомогательные функции
  const arraysEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const getStateKey = (state) => JSON.stringify(state);
  const getEmptyIndex = (state) => state.indexOf(null);

  // Генерация решаемого состояния через обратные ходы
  const generateSolvableState = () => {
    let state = [...Array(15).keys()].map(n => n + 1).concat([null]);
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (let i = 0; i < 50; i++) {
      const emptyIndex = getEmptyIndex(state);
      const row = Math.floor(emptyIndex / 4);
      const col = emptyIndex % 4;
      let possibleMoves = [];

      directions.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
          possibleMoves.push(newRow * 4 + newCol);
        }
      });

      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [state[emptyIndex], state[randomMove]] = [state[randomMove], state[emptyIndex]];
    }

    return state;
  };

  // Проверка минимального числа ходов до решения (BFS)
  const getMinSolutionLength = (startState) => {
    const targetState = [...Array(15).keys()].map(n => n + 1).concat([null]);
    const queue = [{ state: [...startState], moves: 0 }];
    const visited = new Set([getStateKey(startState)]);

    while (queue.length > 0) {
      const { state, moves } = queue.shift();

      if (arraysEqual(state, targetState)) {
        return moves;
      }

      const emptyIndex = getEmptyIndex(state);
      const row = Math.floor(emptyIndex / 4);
      const col = emptyIndex % 4;

      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
          const newIndex = newRow * 4 + newCol;
          const newState = [...state];
          [newState[emptyIndex], newState[newIndex]] = [newState[newIndex], newState[emptyIndex]];

          const key = getStateKey(newState);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({ state: newState, moves: moves + 1 });
          }
        }
      }
    }

    return Infinity; // Нерешаемое (на практике не должно быть)
  };

  // Генерация сложной головоломки (минимум 30 ходов)
  const generateComplexState = () => {
    let state;
    let attemptCount = 0;
    const maxAttempts = 100;

    do {
      state = generateSolvableState();
      const minMoves = getMinSolutionLength(state);
      attemptCount++;
      console.log(`Попытка ${attemptCount}: минимальных ходов — ${minMoves}`);
    } while (getMinSolutionLength(state) < 1 && attemptCount < maxAttempts);

    if (getMinSolutionLength(state) < 1) {
      console.warn("Не удалось найти сложное состояние за отведённое время");
      return generateSolvableState(); // Фолбэк
    }

    return state;
  };

  // Инициализация игры
  const initializeGame = () => {
    const newState = generateSolvableState();
    setTiles(newState);
    setMoves(0);
    setIsSolved(false);
    setSuggestedMoves([]);
  };

  // Проверка решения
  const checkSolution = (currentTiles) => {
    for (let i = 0; i < 15; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[15] === null;
  };

  // Обработка клика по плитке
  const handleTileClick = (index) => {

    const emptyIndex = tiles.indexOf(null);
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    if (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    ) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];

      setTiles(newTiles);
      setMoves(moves + 1);
      setSuggestedMoves([]);

      if (checkSolution(newTiles)) {
        setIsSolved(true);
      }
    }
  };

  // Загрузка изображения
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageLoaded(true);
        initializeGame(); // Перезапуск игры с изображением
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Отрисовка плиток (изображение или цифры)
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tiles.forEach((tile, index) => {
      if (tile === null) return;

      const currentRow = Math.floor(index / 4);
      const currentCol = index % 4;

      if (imageLoaded && image) {
        const originalRow = Math.floor((tile - 1) / 4);
        const originalCol = (tile - 1) % 4;
        const imgTileSize = Math.min(image.width, image.height) / 4;

        ctx.drawImage(
          image,
          originalCol * imgTileSize,
          originalRow * imgTileSize,
          imgTileSize,
          imgTileSize,
          currentCol * tileSize,
          currentRow * tileSize,
          tileSize,
          tileSize
        );
      } else {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(currentCol * tileSize, currentRow * tileSize, tileSize, tileSize);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tile, currentCol * tileSize + tileSize / 2, currentRow * tileSize + tileSize / 2);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(currentCol * tileSize, currentRow * tileSize, tileSize, tileSize);
      }
    });
  }, [tiles, image, imageLoaded]);

  // A* алгоритм
  const solveWithAStar = (startState) => {
    const targetState = [...Array(15).keys()].map(n => n + 1).concat([null]);
    const queue = [{ state: startState, path: [], g: 0 }];
    const visited = new Set([getStateKey(startState)]);
    const heuristic = (state) => {
      return state.reduce((sum, tile, idx) => {
        if (tile === null || tile === idx + 1) return sum;
        const goalIdx = tile - 1;
        const r1 = Math.floor(idx / 4), c1 = idx % 4;
        const r2 = Math.floor(goalIdx / 4), c2 = goalIdx % 4;
        return sum + Math.abs(r1 - r2) + Math.abs(c1 - c2);
      }, 0);
    };

    while (queue.length > 0) {
      queue.sort((a, b) => (a.g + heuristic(a.state)) - (b.g + heuristic(b.state)));
      const { state, path, g } = queue.shift();

      if (arraysEqual(state, targetState)) {
        return path.slice(0, 10); // первые 3 шага
      }

      const emptyIndex = getEmptyIndex(state);
      const row = Math.floor(emptyIndex / 4);
      const col = emptyIndex % 4;
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

      directions.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
          const newIndex = newRow * 4 + newCol;
          const newState = [...state];
          [newState[emptyIndex], newState[newIndex]] = [newState[newIndex], newState[emptyIndex]];
          const key = getStateKey(newState);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              state: newState,
              path: [...path, newState],
              g: g + 1
            });
          }
        }
      });
    }

    return [];
  };

  // Показать подсказку
  const showHint = () => {
    if (isSolved || !tiles) return;
    const nextMoves = solveWithAStar(tiles);
    setSuggestedMoves(nextMoves);
  };

  // Применить подсказку
  useEffect(() => {
    if (suggestedMoves.length > 0) {
      const timer = setTimeout(() => {
        setTiles(suggestedMoves[0]);
        setSuggestedMoves(suggestedMoves.slice(1));
        setMoves(moves + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [suggestedMoves]);

  // Инициализация при старте
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Пятнашки</h2>

      {/* Кнопка загрузки изображения */}
      <div style={{ marginBottom: '20px' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} id="image-upload" style={{ display: 'none' }} />
        <label htmlFor="image-upload" style={{
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          {imageLoaded ? 'Заменить изображение' : 'Загрузить изображение'}
        </label>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          (не обязательно — можно играть и без картинки)
        </p>
      </div>

      {/* Игровое поле */}
      <div style={{
        position: 'relative',
        width: `${tileSize * 4}px`,
        height: `${tileSize * 4}px`,
        margin: '0 auto 20px',
        border: '2px solid #333',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        <canvas ref={canvasRef} width={tileSize * 4} height={tileSize * 4} style={{ position: 'absolute', top: 0, left: 0 }} />

        {/* Кликабельные области */}
        {Array(16).fill().map((_, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            style={{
              position: 'absolute',
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              top: `${Math.floor(index / 4) * tileSize}px`,
              left: `${(index % 4) * tileSize}px`,
              cursor: tiles[index] ? 'pointer' : 'default',
              backgroundColor: tiles[index] ? 'transparent' : 'rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              ':hover': {
                boxShadow: tiles[index] ? 'inset 0 0 0 2px rgba(255,255,255,0.5)' : 'none'
              }
            }}
          />
        ))}
      </div>

      {/* Статистика */}
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        Ходы: {moves}
        {isSolved && <span style={{ marginLeft: '10px', color: '#4CAF50' }}>✓ Решено!</span>}
      </div>

      {/* Управление */}
      <div>
        <button
          onClick={initializeGame}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Новая игра
        </button>

        <button
          onClick={showHint}
          disabled={isSolved}
          style={{
            padding: '10px 20px',
            backgroundColor: isSolved ? '#ccc' : '#FFA726',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isSolved ? 'not-allowed' : 'pointer'
          }}
        >
          Подсказка (A*)
        </button>
      </div>

      {isSolved && (
        <div style={{
          margin: '20px auto 0',
          padding: '15px',
          maxWidth: '320px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          Поздравляем! Вы собрали головоломку за {moves} ходов!
        </div>
      )}
    </div>
  );
};

export const MadLibs = () => {
function extractBlanks(template) {
    const blanks = [];
    const regex = /\[(.*?)\]/g;
    let match;
    
    while ((match = regex.exec(template)) !== null) {
        blanks.push(match[1]);
    }
    
    return blanks;
}

const storyTemplates = Object.entries(Stories).map(([title, template]) => ({
    title: title, // или можно задать свои названия, например "Приключение в парке" для story1
    template: template,
    blanks: extractBlanks(template)
}));

  // Состояния
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [inputs, setInputs] = useState({});
  const [generatedStory, setGeneratedStory] = useState("");
  const [showStory, setShowStory] = useState(false);

  // Выбор шаблона
  const selectTemplate = (template) => {
    setCurrentTemplate(template);
    setInputs({});
    setGeneratedStory("");
    setShowStory(false);
  };

  // Обработка ввода
  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Генерация истории (исправленная версия)
  const generateStory = () => {
    if (!currentTemplate) return;
    
    let story = currentTemplate.template;
    
    // Заменяем все вхождения каждого плейсхолдера
    currentTemplate.blanks.forEach(blank => {
      const regex = new RegExp(`\\[${blank}\\]`, 'g'); // Регулярное выражение с флагом 'g'
      const value = inputs[blank] || `[${blank}]`; // Используем введенное значение или оригинальный плейсхолдер
      story = story.replace(regex, value);
    });
    
    setGeneratedStory(story);
    setShowStory(true);
  };

  // Сброс формы
  const resetForm = () => {
    setInputs({});
    setShowStory(false);
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Генератор случайных историй</h2>
      
      {!currentTemplate ? (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Выберите шаблон:</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {storyTemplates.map((template, index) => (
              <div 
                key={index}
                onClick={() => selectTemplate(template)}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  ':hover': {
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                <h4 style={{ marginTop: '0', color: '#3498db' }}>{template.title}</h4>
                <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
                  {template.template.split('[')[0].substring(0, 60)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setCurrentTemplate(null)}
            style={{
              padding: '8px 15px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            ← Вернуться к выбору
          </button>
          
          <h3 style={{ color: '#3498db' }}>{currentTemplate.title}</h3>
          
          {!showStory ? (
            <div>
              <p style={{ marginBottom: '20px' }}>Заполните пропуски:</p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
              }}>
                {Array.from(new Set(currentTemplate.blanks)).map((blank, index) => (
                  <div key={index}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '5px',
                      fontWeight: 'bold',
                      color: '#2c3e50'
                    }}>
                      {blank.charAt(0).toUpperCase() + blank.slice(1)}:
                    </label>
                    <input
                      type="text"
                      value={inputs[blank] || ''}
                      onChange={(e) => handleInputChange(blank, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                      placeholder={`Введите ${blank}`}
                    />
                  </div>
                ))}
              </div>
              
              <button
                onClick={generateStory}
                disabled={Object.keys(inputs).length < new Set(currentTemplate.blanks).size}
                style={{
                  padding: '12px 25px',
                  backgroundColor: Object.keys(inputs).length < new Set(currentTemplate.blanks).size ? '#95a5a6' : '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: Object.keys(inputs).length < new Set(currentTemplate.blanks).size ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
              >
                Сгенерировать историю
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                borderLeft: '4px solid #3498db',
                marginBottom: '30px',
                whiteSpace: 'pre-line',
                lineHeight: '1.6'
              }}>
                {generatedStory}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={resetForm}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Создать новую историю
                </button>
                
                <button
                  onClick={() => setCurrentTemplate(null)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Выбрать другой шаблон
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const MemoryCards = () => {
  // Настройки игры
  const difficultyLevels = [
    { name: "Легкий", pairs: 8, cols: 4 },
    { name: "Средний", pairs: 12, cols: 6 },
    { name: "Сложный", pairs: 18, cols: 6 }
  ];

  // Состояния игры
  const [difficulty, setDifficulty] = useState(difficultyLevels[0]);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Иконки для карточек (можно заменить на свои)
  const icons = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🐧', '🐦', '🐤', '🦄', '🐝', '🦋', '🐞', '🐢'
  ];

  // Инициализация игры
  const initGame = () => {
    // Выбираем нужное количество иконок
    const selectedIcons = icons.slice(0, difficulty.pairs);
    // Создаем пары карточек
    const cardPairs = [...selectedIcons, ...selectedIcons];
    // Перемешиваем карточки
    const shuffledCards = shuffleArray(cardPairs);
    
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameWon(false);
    setTime(0);
    setTimerActive(true);
    setGameStarted(true);
  };

  // Перемешивание массива
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Обработка клика по карточке
  const handleCardClick = (index) => {
    // Не обрабатываем клик если:
    // - игра не начата
    // - карточка уже перевернута или найдена
    // - уже перевернуто 2 карточки
    if (!gameStarted || flipped.includes(index) || solved.includes(index) || flipped.length >= 2) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    // Если перевернуто 2 карточки
    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      // Проверяем на совпадение
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        // Совпадение найдено
        setSolved([...solved, ...newFlipped]);
        setFlipped([]);
        
        // Проверяем победу
        if (solved.length + 2 === cards.length) {
          setTimerActive(false);
          setGameWon(true);
        }
      } else {
        // Не совпали - переворачиваем обратно через 1 секунду
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  // Таймер
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Стили для карточек
  const cardStyle = (index) => ({
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    backgroundColor: flipped.includes(index) || solved.includes(index) ? '#fff' : '#3498db',
    color: flipped.includes(index) || solved.includes(index) ? '#000' : '#3498db',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    transform: flipped.includes(index) || solved.includes(index) ? 'rotateY(180deg)' : 'rotateY(0)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    userSelect: 'none'
  });

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>Memory Cards</h2>
      
      {!gameStarted ? (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Выберите сложность:</h3>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '30px'
          }}>
            {difficultyLevels.map((level, index) => (
              <button
                key={index}
                onClick={() => setDifficulty(level)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: difficulty.name === level.name ? '#2ecc71' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {level.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={initGame}
            style={{
              padding: '12px 30px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            Начать игру
          </button>
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <div>Ходы: {moves}</div>
            <div>Время: {formatTime(time)}</div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${difficulty.cols}, 80px)`,
            gap: '15px',
            justifyContent: 'center',
            margin: '0 auto 30px'
          }}>
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                style={cardStyle(index)}
              >
                {flipped.includes(index) || solved.includes(index) ? card : '?'}
              </div>
            ))}
          </div>
          
          {gameWon && (
            <div style={{
              backgroundColor: '#2ecc71',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              <h3>Поздравляем! 🎉</h3>
              <p>Вы нашли все пары за {moves} ходов и {formatTime(time)}!</p>
            </div>
          )}
          
          <button
            onClick={initGame}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Новая игра
          </button>
        </div>
      )}
    </div>
  );
};

export const Tetris = () => {
  // Константы игры
  const ROWS = 20;
  const COLS = 10;
  const BLOCK_SIZE = 30;
  const INITIAL_DROP_SPEED = 1000; // 1 секунда

  // Фигуры Тетриса и их цвета
  const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
  ];

  const COLORS = [
    '#00FFFF', // I - голубой
    '#FFFF00', // O - желтый
    '#AA00FF', // T - фиолетовый
    '#FFA500', // L - оранжевый
    '#0000FF', // J - синий
    '#00FF00', // S - зеленый
    '#FF0000'  // Z - красный
  ];

  // Состояния игры
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [started, setStarted] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const nextPieceCanvasRef = useRef(null);
  const dropIntervalRef = useRef(null);
  const [dropSpeed, setDropSpeed] = useState(INITIAL_DROP_SPEED);

  // Создание пустого игрового поля
  function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  // Генерация случайной фигуры
  const getRandomPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      color: COLORS[shapeIndex],
      width: SHAPES[shapeIndex][0].length,
      height: SHAPES[shapeIndex].length
    };
  }, []);

  // Проверка столкновений
  const checkCollision = useCallback((piece, pos) => {
    for (let row = 0; row < piece.height; row++) {
      for (let col = 0; col < piece.width; col++) {
        if (piece.shape[row][col]) {
          const newX = pos.x + col;
          const newY = pos.y + row;
          
          if (
            newX < 0 || 
            newX >= COLS || 
            newY >= ROWS ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);

  // Слияние фигуры с игровым полем
  const mergePiece = useCallback(() => {
    const newBoard = board.map(row => [...row]);
    
    if (!currentPiece) return newBoard;

    for (let row = 0; row < currentPiece.height; row++) {
      for (let col = 0; col < currentPiece.width; col++) {
        if (currentPiece.shape[row][col]) {
          const y = position.y + row;
          const x = position.x + col;
          
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
            newBoard[y][x] = currentPiece.color;
          }
        }
      }
    }
    
    setBoard(newBoard);
    return newBoard;
  }, [board, currentPiece, position]);

  // Проверка заполненных линий
  const checkLines = useCallback((newBoard) => {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row].every(cell => cell !== 0)) {
        newBoard.splice(row, 1);
        newBoard.unshift(Array(COLS).fill(0));
        linesCleared++;
        row++;
      }
    }
    
    if (linesCleared > 0) {
      setScore(prev => prev + linesCleared * 100 * level);
      const newLevel = Math.floor((score + linesCleared * 100 * level) / 1000) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setDropSpeed(INITIAL_DROP_SPEED - (newLevel - 1) * 100);
      }
    }
  }, [level, score]);

  // Движение вниз
  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const newPosition = { ...position, y: position.y + 1 };
    
    if (checkCollision(currentPiece, newPosition)) {
      const newBoard = mergePiece();
      checkLines(newBoard);
      
      setCurrentPiece(nextPiece);
      setNextPiece(getRandomPiece());
      setPosition({ 
        x: Math.floor(COLS / 2) - Math.floor(nextPiece.width / 2), 
        y: 0 
      });
      
      if (checkCollision(nextPiece, { 
        x: Math.floor(COLS / 2) - Math.floor(nextPiece.width / 2), 
        y: 0 
      })) {
        setGameOver(true);
        clearInterval(dropIntervalRef.current);
      }
    } else {
      setPosition(newPosition);
    }
  }, [currentPiece, position, gameOver, isPaused, nextPiece, 
      checkCollision, mergePiece, checkLines, getRandomPiece]);

  // Движение влево
  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const newPosition = { ...position, x: position.x - 1 };
    if (!checkCollision(currentPiece, newPosition)) {
      setPosition(newPosition);
    }
  }, [currentPiece, position, gameOver, isPaused, checkCollision]);

  // Движение вправо
  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const newPosition = { ...position, x: position.x + 1 };
    if (!checkCollision(currentPiece, newPosition)) {
      setPosition(newPosition);
    }
  }, [currentPiece, position, gameOver, isPaused, checkCollision]);

  // Поворот фигуры
  const rotate = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const newShape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    
    const rotatedPiece = {
      ...currentPiece,
      shape: newShape,
      width: newShape[0].length,
      height: newShape.length
    };
    
    if (!checkCollision(rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece);
    } else {
      // Попробовать сдвинуть, если не помещается
      const offsets = [1, -1, 2, -2];
      for (const offset of offsets) {
        const newPosition = { ...position, x: position.x + offset };
        if (!checkCollision(rotatedPiece, newPosition)) {
          setCurrentPiece(rotatedPiece);
          setPosition(newPosition);
          break;
        }
      }
    }
  }, [currentPiece, position, gameOver, isPaused, checkCollision]);

  // Мгновенное падение
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    let dropDistance = 0;
    let newPosition = { ...position };
    
    while (!checkCollision(currentPiece, { ...newPosition, y: newPosition.y + 1 })) {
      newPosition.y++;
      dropDistance++;
    }
    
    if (dropDistance > 0) {
      setScore(prev => prev + dropDistance * 2);
      setPosition(newPosition);
      moveDown();
    }
  }, [currentPiece, position, gameOver, isPaused, checkCollision, moveDown]);

  // Инициализация игры
  const initGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setStarted(true);
    setDropSpeed(INITIAL_DROP_SPEED);
    
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setPosition({ 
      x: Math.floor(COLS / 2) - Math.floor(firstPiece.width / 2), 
      y: 0 
    });
    
    clearInterval(dropIntervalRef.current);
    dropIntervalRef.current = setInterval(() => {
      if (!isPaused && !gameOver) {
        moveDown();
      }
    }, dropSpeed);
  }, [getRandomPiece, isPaused, gameOver, dropSpeed, moveDown]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowUp': rotate(); break;
        case ' ': hardDrop(); e.preventDefault(); break;
        case 'p':
        case 'P': setIsPaused(prev => !prev); break;
        default: break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, gameOver, moveLeft, moveRight, moveDown, rotate, hardDrop]);

  // Отрисовка игрового поля
  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Отрисовка сетки
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
    
    // Отрисовка заполненных блоков
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board[row][col]) {
          ctx.fillStyle = board[row][col];
          ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }
    
    // Отрисовка текущей фигуры
    if (currentPiece) {
      currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            ctx.fillStyle = currentPiece.color;
            ctx.fillRect(
              (position.x + colIndex) * BLOCK_SIZE,
              (position.y + rowIndex) * BLOCK_SIZE,
              BLOCK_SIZE,
              BLOCK_SIZE
            );
            ctx.strokeRect(
              (position.x + colIndex) * BLOCK_SIZE,
              (position.y + rowIndex) * BLOCK_SIZE,
              BLOCK_SIZE,
              BLOCK_SIZE
            );
          }
        });
      });
    }
  }, [board, currentPiece, position]);

  // Отрисовка следующей фигуры
  const drawNextPiece = useCallback(() => {
    const canvas = nextPieceCanvasRef.current;
    if (!canvas || !nextPiece) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Фон
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Центрирование фигуры
    const offsetX = (canvas.width / BLOCK_SIZE - nextPiece.width) / 2;
    const offsetY = (canvas.height / BLOCK_SIZE - nextPiece.height) / 2;
    
    nextPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          ctx.fillStyle = nextPiece.color;
          ctx.fillRect(
            (offsetX + colIndex) * BLOCK_SIZE,
            (offsetY + rowIndex) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
          ctx.strokeStyle = '#333';
          ctx.strokeRect(
            (offsetX + colIndex) * BLOCK_SIZE,
            (offsetY + rowIndex) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      });
    });
  }, [nextPiece]);

  // Обновление интервала падения
  useEffect(() => {
    if (!started || gameOver) return;
    
    clearInterval(dropIntervalRef.current);
    dropIntervalRef.current = setInterval(() => {
      if (!isPaused && !gameOver) {
        moveDown();
      }
    }, dropSpeed);
    
    return () => clearInterval(dropIntervalRef.current);
  }, [started, gameOver, isPaused, dropSpeed, moveDown]);

  // Отрисовка при изменении состояния
  useEffect(() => {
    drawBoard();
    drawNextPiece();
  }, [drawBoard, drawNextPiece]);

  // Инициализация при монтировании
  useEffect(() => {
    initGame();
    return () => clearInterval(dropIntervalRef.current);
  }, []);

  // JSX разметка
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Тетрис</h2>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Блок управления слева */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '200px'
        }}>
          {/* Инструкция */}
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '5px',
            textAlign: 'left',
            fontSize: '14px'
          }}>
            <h3 style={{ marginTop: 0 }}>Управление:</h3>
            <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
              <li>← → — движение</li>
              <li>↓ — ускорить падение</li>
              <li>↑ — повернуть</li>
              <li>Пробел — мгновенное падение</li>
              <li>P — пауза</li>
            </ul>
          </div>

          {/* Кнопки управления */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <button
                onClick={moveLeft}
                disabled={!started || gameOver || isPaused}
                style={{
                  padding: '10px 15px',
                  backgroundColor: started && !gameOver && !isPaused ? '#2196F3' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: started && !gameOver && !isPaused ? 'pointer' : 'not-allowed'
                }}
              >
                ←
              </button>
              <button
                onClick={rotate}
                disabled={!started || gameOver || isPaused}
                style={{
                  padding: '10px 15px',
                  backgroundColor: started && !gameOver && !isPaused ? '#FFA726' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: started && !gameOver && !isPaused ? 'pointer' : 'not-allowed'
                }}
              >
                Повернуть
              </button>
              <button
                onClick={moveRight}
                disabled={!started || gameOver || isPaused}
                style={{
                  padding: '10px 15px',
                  backgroundColor: started && !gameOver && !isPaused ? '#2196F3' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: started && !gameOver && !isPaused ? 'pointer' : 'not-allowed'
                }}
              >
                →
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <button
                onClick={moveDown}
                disabled={!started || gameOver || isPaused}
                style={{
                  padding: '10px 15px',
                  backgroundColor: started && !gameOver && !isPaused ? '#4CAF50' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: started && !gameOver && !isPaused ? 'pointer' : 'not-allowed'
                }}
              >
                ↓
              </button>
              <button
                onClick={hardDrop}
                disabled={!started || gameOver || isPaused}
                style={{
                  padding: '10px 15px',
                  backgroundColor: started && !gameOver && !isPaused ? '#F44336' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: started && !gameOver && !isPaused ? 'pointer' : 'not-allowed'
                }}
              >
                Быстро ↓
              </button>
            </div>
          </div>
        </div>

        {/* Основное игровое поле */}
        <div style={{ position: 'relative' }}>
          <canvas 
            ref={canvasRef} 
            width={COLS * BLOCK_SIZE} 
            height={ROWS * BLOCK_SIZE}
            style={{
              border: '2px solid #333',
              backgroundColor: '#000',
              borderRadius: '5px'
            }}
          />
          
          {!started && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={initGame}>
              Начать игру
            </div>
          )}
          
          {gameOver && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              borderRadius: '5px'
            }}>
              <div>Игра окончена!</div>
              <div style={{ fontSize: '16px', marginTop: '10px' }}>Счет: {score}</div>
              <button 
                onClick={initGame}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Играть снова
              </button>
            </div>
          )}
          
          {isPaused && started && !gameOver && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              borderRadius: '5px'
            }}>
              Пауза
            </div>
          )}
        </div>
        
        {/* Информационная панель справа */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '120px'
        }}>
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>Следующая:</div>
            <canvas 
              ref={nextPieceCanvasRef} 
              width={4 * BLOCK_SIZE} 
              height={4 * BLOCK_SIZE}
              style={{
                border: '1px solid #333',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
                width: '100%'
              }}
            />
          </div>
          
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>Уровень:</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{level}</div>
          </div>
          
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>Счет:</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{score}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Maze = () => {
  // Константы игры
  const multiplier = 3;
  const CELL_SIZE = 40 / multiplier;
  const ROWS = 15 * multiplier;
  const COLS = 15 * multiplier;
  const WALL = 1;
  const PATH = 0;
  const PLAYER = 2;
  const EXIT = 3;

  // Состояния игры
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  const [exitPos, setExitPos] = useState({ row: 0, col: 0 });
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const canvasRef = useRef(null);

  // Генерация гарантированно проходимого лабиринта
  const generateMaze = useCallback(() => {
    // 1. Инициализация сетки
    const grid = Array(ROWS).fill().map(() => Array(COLS).fill(WALL));
    
    // 2. Выбираем стартовую позицию (фиксированная)
    const startRow = 1;
    const startCol = 1;
    grid[startRow][startCol] = PATH;

    // 3. Выбираем позицию выхода (фиксированная)
    const exitRow = ROWS-2;
    const exitCol = COLS-2;
    grid[exitRow][exitCol] = EXIT;

    // 4. Создаем основной путь
    let current = {row: startRow, col: startCol};
    const stack = [current];
    const directions = [
      {dr: 1, dc: 0}, // вниз
      {dr: 0, dc: 1}, // вправо
      {dr: -1, dc: 0}, // вверх
      {dr: 0, dc: -1} // влево
    ];

    // 5. Основной алгоритм генерации
    while (stack.length > 0) {
      current = stack.pop();
      
      // Случайно перемешиваем направления
      const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
      
      for (const dir of shuffledDirs) {
        const newRow = current.row + dir.dr * 2;
        const newCol = current.col + dir.dc * 2;
        
        if (newRow > 0 && newRow < ROWS-1 && newCol > 0 && newCol < COLS-1 && grid[newRow][newCol] === WALL) {
          // Прорубаем стену между текущей и новой клеткой
          grid[current.row + dir.dr][current.col + dir.dc] = PATH;
          grid[newRow][newCol] = PATH;
          stack.push(current);
          stack.push({row: newRow, col: newCol});
        }
      }
    }

    // 6. Гарантируем соединение с выходом
    grid[exitRow-1][exitCol] = PATH;
    grid[exitRow][exitCol-1] = PATH;

    // 7. Добавляем ограниченное количество тупиков (20%)
    const totalCells = (ROWS-2) * (COLS-2);
    const wallsToRemove = Math.floor(totalCells * 0.2);
    
    for (let i = 0; i < wallsToRemove; i++) {
      const row = 1 + Math.floor(Math.random() * (ROWS-2));
      const col = 1 + Math.floor(Math.random() * (COLS-2));
      
      if (grid[row][col] === WALL) {
        // Проверяем, чтобы не создать альтернативный путь
        const wallCount = [
          grid[row-1][col], grid[row+1][col],
          grid[row][col-1], grid[row][col+1]
        ].filter(cell => cell === WALL).length;
        
        if (wallCount >= 3) {
          grid[row][col] = PATH;
        }
      }
    }

    return {
      grid,
      start: {row: startRow, col: startCol},
      exit: {row: exitRow, col: exitCol}
    };
  }, []);

  // Проверка движения
  const canMove = useCallback((row, col) => {
    return (
      row >= 0 && row < ROWS &&
      col >= 0 && col < COLS &&
      maze[row][col] !== WALL
    );
  }, [maze]);

  // Движение игрока
  const movePlayer = useCallback((dRow, dCol) => {
    if (isPaused || gameWon) return;
    
    const newRow = playerPos.row + dRow;
    const newCol = playerPos.col + dCol;
    
    if (canMove(newRow, newCol)) {
      setPlayerPos({row: newRow, col: newCol});
      setMoves(prev => prev + 1);
      
      if (newRow === exitPos.row && newCol === exitPos.col) {
        setGameWon(true);
      }
    }
  }, [playerPos, isPaused, gameWon, canMove, exitPos]);

  // Сброс игры
  const resetGame = useCallback(() => {
    const {grid, start, exit} = generateMaze();
    setMaze(grid);
    setPlayerPos(start);
    setExitPos(exit);
    setMoves(0);
    setGameWon(false);
    setIsPaused(false);
  }, [generateMaze]);

  // Отрисовка лабиринта
  const drawMaze = useCallback(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Рассчитываем точные размеры с учетом multiplier
  const cellSize = Math.max(1, Math.floor(CELL_SIZE));
  const offsetX = Math.floor((canvas.width - COLS * cellSize) / 2);
  const offsetY = Math.floor((canvas.height - ROWS * cellSize) / 2);

  // Отрисовка клеток
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = offsetX + col * cellSize;
      const y = offsetY + row * cellSize;
      
      // Пути и выход
      if (maze[row]?.[col] === PATH || maze[row]?.[col] === EXIT) {
        ctx.fillStyle = maze[row][col] === EXIT ? '#4CAF50' : '#f8f8f8';
        ctx.fillRect(x, y, cellSize, cellSize);
        continue;
      }

      // Стены с внутренними границами
      if (maze[row]?.[col] === WALL) {
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Внутренние границы (не выходят за пределы клетки)
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Только правую и нижнюю границу для каждой стены
        if (col < COLS-1 && maze[row]?.[col+1] !== WALL) {
          ctx.moveTo(x + cellSize - 0.5, y);
          ctx.lineTo(x + cellSize - 0.5, y + cellSize);
        }
        if (row < ROWS-1 && maze[row+1]?.[col] !== WALL) {
          ctx.moveTo(x, y + cellSize - 0.5);
          ctx.lineTo(x + cellSize, y + cellSize - 0.5);
        }
        ctx.stroke();
      }
    }
  }

  // Игрок (центрирован)
  const playerX = offsetX + playerPos.col * cellSize + cellSize/2;
  const playerY = offsetY + playerPos.row * cellSize + cellSize/2;
  const playerRadius = cellSize/2.5;
  
  ctx.fillStyle = '#2196F3';
  ctx.beginPath();
  ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2);
  ctx.fill();
    
    // Сообщение о победе
    if (gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Победа!', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillText(`Ходов: ${moves}`, canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // Пауза
    if (isPaused && !gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Пауза', canvas.width / 2, canvas.height / 2);
    }
  }, [maze, playerPos, exitPos, gameWon, isPaused, moves]);

  // Инициализация игры
  useEffect(() => {
    resetGame();
  }, []);

  // Отрисовка при изменении состояния
  useEffect(() => {
    drawMaze();
  }, [drawMaze]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(0, 1); break;
        case 'ArrowDown': movePlayer(1, 0); break;
        case 'ArrowLeft': movePlayer(0, -1); break;
        case 'p': case 'P': setIsPaused(prev => !prev); break;
        case 'r': case 'R': resetGame(); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, resetGame]);

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Лабиринт</h2>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Блок управления */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '200px'
        }}>
          {/* Статистика */}
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>Ходов: {moves}</div>
            <div style={{ fontSize: '14px' }}>Найдите путь к зелёному выходу</div>
          </div>

          {/* Кнопки управления */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <button
              onClick={() => movePlayer(-1, 0)}
              disabled={isPaused || gameWon}
              style={{
                padding: '10px',
                backgroundColor: isPaused || gameWon ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isPaused || gameWon ? 'not-allowed' : 'pointer'
              }}
            >
              Вверх (↑)
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => movePlayer(0, -1)}
                disabled={isPaused || gameWon}
                style={{
                  padding: '10px',
                  backgroundColor: isPaused || gameWon ? '#ccc' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isPaused || gameWon ? 'not-allowed' : 'pointer',
                  flex: 1
                }}
              >
                Влево (←)
              </button>
              <button
                onClick={() => movePlayer(0, 1)}
                disabled={isPaused || gameWon}
                style={{
                  padding: '10px',
                  backgroundColor: isPaused || gameWon ? '#ccc' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isPaused || gameWon ? 'not-allowed' : 'pointer',
                  flex: 1
                }}
              >
                Вправо (→)
              </button>
            </div>
            <button
              onClick={() => movePlayer(1, 0)}
              disabled={isPaused || gameWon}
              style={{
                padding: '10px',
                backgroundColor: isPaused || gameWon ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isPaused || gameWon ? 'not-allowed' : 'pointer'
              }}
            >
              Вниз (↓)
            </button>
          </div>
          
          {/* Управление игрой */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsPaused(prev => !prev)}
              disabled={gameWon}
              style={{
                padding: '10px',
                backgroundColor: gameWon ? '#ccc' : '#FFA726',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: gameWon ? 'not-allowed' : 'pointer',
                flex: 1
              }}
            >
              {isPaused ? 'Продолжить' : 'Пауза (P)'}
            </button>
            <button
              onClick={resetGame}
              style={{
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Новая игра (R)
            </button>
          </div>
        </div>

        {/* Игровое поле */}
        <div style={{ position: 'relative' }}>
          <canvas 
            ref={canvasRef} 
            width={COLS * CELL_SIZE} 
            height={ROWS * CELL_SIZE}
            style={{
              border: '2px solid #333',
              backgroundColor: '#f8f8f8',
              borderRadius: '5px'
            }}
          />
        </div>
      </div>
    </div>
  );
};