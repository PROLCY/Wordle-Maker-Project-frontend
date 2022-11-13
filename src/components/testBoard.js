import styled from 'styled-components';
import WordList from "./Word/WordList";
import { useEffect, useState } from 'react';
import { BACK } from './Keyboard/Keyboard';
import { oneLine, sixLines, sevenLines } from './Word/designSettings/WordListSet';
import client from '../lib/api/client';

const BoardContainer = styled.div` // 헤더를 제외한 부분 스타일
    width: 100%;
    margin: 0 auto;
    height: calc(100% - 65px);
    display: flex;
    flex-direction: row;
`;

const BoardBlock = styled.div` // 단어 리스트 스타일
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    overflow: hidden;
`;

const Message = styled.div` // 알림 박스 스타일
    width: auto;
    height: 40px; 
    position: absolute;
    display: ${props => props.message !== null ? 'inline-block' : 'none'};
    left: 50%;
    top: 60px;
    background-color: black;
    border-radius: 5px;
    color: white;
    padding: 2px 10px;
    text-align: center;
    line-height: 40px;
    font-size: 17px;
    font-weight: bold;
    transform: translate(-50%, 0);
`;

const wordMaxLen = 5;

let isFinished = false;
let submitNickname = false;
let submitWord = false;
let listIndex = 0;
let keyState = {};

let nickname='';
let correct_word='';

const TestBoard = () => {
    const [word, setWord] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [wordState, setWordState] = useState('');
    const [solvers, setSolvers] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        client.get('/load/')
            .then( res => {
                setSolvers(res.data);
            })
    }, []);

    const solversList = solvers.map( (solver, index) => 
        <WordList key={index} lineSet={sevenLines} word={word} wordState={wordState} wordList={solver.nickname.concat(solver.wordList)}/>);

    return (
        <BoardContainer>
            <Message message={message}>{message}</Message>
            <BoardBlock>
                {solversList.length === 0 ? "There is no solver yet" : solversList}
            </BoardBlock>
        </BoardContainer>
    );
};

export default TestBoard;