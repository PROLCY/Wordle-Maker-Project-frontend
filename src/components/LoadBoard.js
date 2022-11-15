import styled from 'styled-components';
import WordList from "./Word/WordList";
import LoadWordList from './Word/LoadWordList';
import Keyboard from './Keyboard/Keyboard';
import { useEffect, useState } from 'react';
import { BACK } from './Keyboard/Keyboard';
import { oneLine, sevenLines } from './Word/designSettings/WordListSet';
import client from '../lib/api/client';

const BoardContainer = styled.div` // 헤더를 제외한 부분 스타일
    width: 100%;
    max-width: ${ props => props.submitNickname ? '2000px' : '500px'};
    margin: 0 auto;
    height: calc(100% - 65px);
    display: flex;
    flex-direction: column;
`;

const BoardBlock = styled.div` // 단어 리스트 스타일
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
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
    margin: 10px 20px;
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

let listIndex = 0;
let keyState = {};

let nickname='';

const LoadBoard = () => {
    const [word, setWord] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [wordState, setWordState] = useState('load');
    const [message, setMessage] = useState(null);
    const [submitNickname, setSubmitNickname] = useState(false);
    const [solvers, setSolvers] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);

    useEffect(() => {

    }, []);

    const onClick = e => { // 키를 눌렀을 때 실행되는 함수

        if ( submitNickname === false ) {
            if ( e.target.innerText === 'ENTER') { // ENTER를 눌렀을 경우
                if ( word.length < wordMaxLen ) { 
                    setMessage('Not enough letters');
                    setWordState('not-word');
                    setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                    return;
                }
                    
                for( let i = 0 ; i < wordMaxLen ; i++ )
                    nickname += word[i].text;
                
                client.post('/load/exist', { nickname: nickname })
                    .then( res => {
                        if ( res.data === false) {
                            nickname = '';
                            setMessage("It doesn't exist!");
                            setWordState('not-word');
                            setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                            return;
                        }
                        else {
                            for( let i = 0 ; i < wordMaxLen ; i++ ) {
                                word[i].state = 'correct';
                            }
                            setWordList({
                                ...wordList,
                                word,
                            });
                            
                            setTimeout(() => {
                                setWord([]);
                                setWordList({
                                    word,
                                });
                                setSubmitNickname(true);
                            }, 2000);
                            client.get('/load/')
                                .then( res => {
                                    setSolvers(res.data);
                                })
                        }
                    });
                return;
            }
            setMessage(null);
            if ( e.target.innerText === BACK ) {
                if ( word.length === 0 )
                    return;
                setWord(word.slice(0, -1));
                return;
            }
            if ( word.length > wordMaxLen )
                return;
            setWord(word.concat({
                text: e.target.innerText,
                state: 'filled',
            }));
            return;
        }

        if ( e.target.id === 'next' ) {
            if ( solvers.length > pageIndex * 4 )
                setPageIndex(pageIndex + 1);
        }
            
        else if ( e.target.id === 'prev' ) {
            if ( pageIndex > 1 )
                setPageIndex(pageIndex - 1);
        }
    };

    return (
        <BoardContainer submitNickname={submitNickname}>
            <Message message={message}>{message}</Message>
            <BoardBlock>
                { 
                    submitNickname === false ? 
                    <WordList lineSet={oneLine} word={word} wordState={wordState} wordList={wordList} listIndex={listIndex}/> :
                    solvers.slice((pageIndex-1)*4, pageIndex*4).map((solver, index) => 
                    <LoadWordList key={index} lineSet={sevenLines} word={word} wordState={wordState} wordList={solver.nickname.concat(solver.wordList)}/>)
                }
            </BoardBlock>
            {
                submitNickname === false ?
                <Keyboard onClick={onClick} keyState={keyState}/> :
                <ButtonBlock>
                    <Button id='prev' pageIndex={pageIndex} listLength={solvers.length} onClick={onClick}>&lt;</Button>
                    <Button id='next' pageIndex={pageIndex} listLength={solvers.length} onClick={onClick}>&gt;</Button>
                </ButtonBlock>
            }

        </BoardContainer>
    );
};

export default LoadBoard;