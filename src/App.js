import { useState } from 'react';
import Select from 'react-select';
import { Wordle, Hangman, TicTacToe, Minesweeper, FifteenPuzzle, MadLibs, MemoryCards, Tetris, Maze } from './Games';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const gameOptions = [
    { value: 'Wordle', label: 'Wordle' },
    { value: 'Hangman', label: 'Виселица' },
    { value: 'TicTacToe', label: 'Крестики-нолики'},
    { value: 'Minesweeper', label: 'Сапёр'},
    { value: 'FifteenPuzzle', label: 'Пятнашки'},
    { value: 'MadLibs', label: 'Генератор случайных историй'},
    { value: 'MemoryCards', label: 'Мемо'},
    { value: 'Tetris', label: 'Тетрис'},
    { value: 'Maze', label: 'Лабиринт'}
  ];

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Коллекция мини-игр на React</h1>
        
        <div style={{ 
          width: '300px',
          margin: '30px auto'
        }}>
          <Select
            options={gameOptions}
            onChange={(option) => setCurrentGame(option.value)}
            placeholder="Выберите игру..."
            isSearchable={false}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '8px',
                border: '2px solid #ddd',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#aaa'
                }
              }),
              menu: (base) => ({
                ...base,
                borderRadius: '8px',
                marginTop: '5px'
              })
            }}
          />
        </div>

        <div style={{ 
          marginTop: '40px',
          minHeight: '400px'
        }}>
          {currentGame === 'Wordle' && <Wordle />}
          {currentGame === 'Hangman' && <Hangman />}
          {currentGame === 'TicTacToe' && <TicTacToe />}
          {currentGame === 'Minesweeper' && <Minesweeper />}
          {currentGame === 'FifteenPuzzle' && <FifteenPuzzle />}
          {currentGame === 'MadLibs' && <MadLibs />}
          {currentGame === 'MemoryCards' && <MemoryCards />}
          {currentGame === 'Tetris' && <Tetris />}
          {currentGame === 'Maze' && <Maze />}
          {/* Добавьте другие игры здесь */}
        </div>
      </div>
    </div>
  );
}

export default App;