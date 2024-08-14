import styled from 'styled-components';
import './App.css'
import { useState } from 'react';
import axios from 'axios'

function App() {
  
  const [useragrid, setUserAGrid] = useState(Array(9).fill(null))
  const [userbgrid, setUserBGrid] = useState(Array(9).fill(null))
  const [gameStarted, setGameStarted] = useState(false)
  const cutNumbers = []

  const handleNumberInput = (event, index) => {
    const tmpGrid = [...useragrid];
    tmpGrid[index] = Number(event.target.value);
    setUserAGrid(tmpGrid)
  }

  const handleNumberInputB = (event, index) => {
    const tmpGrid = [...userbgrid];
    tmpGrid[index] = Number(event.target.value);
    setUserBGrid(tmpGrid)
  }

  const handleStart = async () => {
    if (isValidGrid(useragrid) && isValidGrid(userbgrid)) {
      try {
        await axios.put('http://localhost:8000/api/updategrid', {
          userId: 'userA',
          grid: useragrid
        }
      );

        await axios.put('http://localhost:8000/api/updategrid', {
          userId: 'userB',
          grid: userbgrid
        });

        console.log('Grids successfully updated.');
        startGeneratingNumbers();
        setGameStarted(true);
        
      } catch (error) {
        console.error('Error updating grids:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
      }
    } else {
      alert(`Wrong Input:\n1. You cannot repeat Numbers\n2. You can only use numbers from 1 to 9`);
    }
  };
  

  function isValidGrid(arr) {
    for(let i=1; i<=9; i++){
      if(!arr.includes(i)){
        return false;
      }
    }
    return true;
  }

  const startGeneratingNumbers = () => {
    const intervalId = setInterval(async () => {
      if (!gameStarted) {
        clearInterval(intervalId);
        return;
      }
      
      const number = getRandomNumber();
      try {
        const response = await axios.put('http://localhost:8000/api/cutnumber', { number });
        const { winner, userId } = response.data;

        if (winner) {
          alert(`We have a winner! User: ${userId}`);
          console.log(cutNumbers)
          clearInterval(intervalId);
          setGameStarted(false);
        }
      } catch (error) {
        console.error('Error cutting number:', error);
      }
    }, 500);
  };

  const getRandomNumber = () => {
    const val = Math.floor(Math.random() * 9) + 1;
    cutNumbers.push(val)
    return Number(val);
  };

  const isNumberCut = (number) => {
    return cutNumbers.includes(number);
  };

  return (
    <MainContainer>
      
      <GridView>
        User 1 Grid
        <UserA>

          {useragrid.map((value, index) => (
            <InputContainer>
            
              <Input
                key={index}
                value={value}
                onChange={(event) => handleNumberInput(event, index)}
              />
            </InputContainer>
          ))}

        </UserA>
          <br />
          User 2 Grid
        <UserB>

          {userbgrid.map((value, index) => (
            <Input
              key={index}
              value={value}
              isCut={isNumberCut(value)}
              onChange={(event) => handleNumberInputB(event, index)}
            />
          ))}

        </UserB>

      </GridView>

      <Controls>
        <Button onClick={handleStart}>Start Game</Button>
        <Button>Stop Game</Button>
      </Controls>

    </MainContainer>
  )
}

export default App;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 20px;
  padding: 20px;
  border: 2px solid orange;
  border-radius: 10px;
`;

const GridView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: transparent;
  color: black;
  border: 1px solid gray;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const UserA = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 85px);
  grid-template-rows: repeat(3, 50px);
  background-color: #ffffff;
  border: 2px solid #cccccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 10px;
`;

const UserB = styled(UserA)`
  background-color: #ffffff;
  border-color: #cccccc;
  margin: 10px;
`;

const InputContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: 2px solid gray;
  background-color: ${props => props.isCut ? '#f7f7f7' : 'white'};
  color: ${props => props.isCut ? 'red' : 'black'};
  text-align: center;
  font-size: 24px;
  font-weight: ${props => props.isCut ? 'bold' : 'normal'};
  position: relative;
  z-index: 1;
  &:focus {
    background-color: black;
    color: white;
  }
`;

const SVGOverlay = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  fill: none;
  stroke: red;
  stroke-width: 2px;
  display: ${props => (props.isCut ? 'block' : 'none')}; // Show SVG if isCut is true
  z-index: 0; // Ensure SVG is below the input
`;