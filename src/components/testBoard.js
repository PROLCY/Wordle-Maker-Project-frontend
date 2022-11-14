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
    flex-direction: column;
    justify-content: center;
`;

const BoardBlock = styled.div` // 단어 리스트 스타일
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    overflow: hidden;
`;

const ButtonBlock = styled.div`
    display: flex;
    justify-content: center;
    height: 100px;
    align-items: center;
`;

const Button = styled.div`
    line-height: 80px;
    margin: 30px 20px;
    padding: 1px 1px;
    font-weight: bold;
    font-size: 80px;
    border: none;
    text-align: center;
    justify-content: cnenter;
    background-color: white;
    color: ${props => 
        (props.id === 'prev' && (props.pageIndex === 1) && '#d3d3d3') ||
        (props.id === 'next' && (props.listLength <= props.pageIndex * 4) && '#d3d3d3') ||
        'black'
    };
    
    :hover {
        cursor: ${props => 
            (props.id === 'prev' && (props.pageIndex === 1) && 'default') ||
            (props.id === 'next' && (props.listLength <= props.pageIndex * 4) && 'default') ||
            'pointer'
        };
    }
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
    const [message, setMessage] = useState(null);
    const [solvers, setSolvers] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);

    useEffect(() => {
        client.get('/load/')
            .then( res => {
                setSolvers(res.data);
            })
    }, []);

    const onClick = e => {
        if ( e.target.id === 'next' ) {
            if ( solvers.length > pageIndex * 4 )
                setPageIndex(pageIndex + 1);
        }
            
        else if ( e.target.id === 'prev' ) {
            if ( pageIndex > 1 )
                setPageIndex(pageIndex - 1);
        }
    };

    const solversList = solvers.slice((pageIndex-1)*4, pageIndex*4).map(       (solver, index) => 
        <WordList key={index} lineSet={sevenLines} word={word} wordState={wordState} wordList={solver.nickname.concat(solver.wordList)}/>);


    return (
        <BoardContainer>
            <Message message={message}>{message}</Message>
            <BoardBlock>
                {solversList.length === 0 ? "There is no solver yet" : solversList}
            </BoardBlock>
            <ButtonBlock>
                <Button id='prev' pageIndex={pageIndex} listLength={solvers.length} onClick={onClick}>&lt;</Button>
                <Button id='next' pageIndex={pageIndex} listLength={solvers.length} onClick={onClick}>&gt;</Button>
            </ButtonBlock>
        </BoardContainer>
    );
};

export default TestBoard;