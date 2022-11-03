import styled from 'styled-components';
import WordList from "./Word/WordList";
import Keyboard from './Keyboard/Keyboard';
import { useEffect, useState } from 'react';
import { BACK } from './Keyboard/Keyboard';

const BoardContainer = styled.div` // 헤더를 제외한 부분 스타일
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    height: calc(100% - 65px);
    display: flex;
    flex-direction: column;
`;

const BoardBlock = styled.div` // 단어 리스트 스타일
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
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

const MakerBoard = () => {
    const [word, setWord] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [wordState, setWordState] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        setMessage('Enter your nickname!');
    }, []);

    const onClick = e => { // 키를 눌렀을 때 실행되는 함수
        if ( isFinished )
                return;
        if ( e.target.innerText === 'ENTER') { // ENTER를 눌렀을 경우
            if ( word.length < wordMaxLen ) { 
                setMessage('Not enough letters');
                setWordState('not-word');
                setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                return;
            }
            if ( submitNickname === false ) {
                submitNickname = true;

                // 닉네임 서버로 보내기 추가
                
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
                    setMessage('Enter your word!')
                }, 2000);
            } else if ( submitWord === false ) {
                submitWord = true;
                isFinished = true;

                // 입력한 단어(정답 단어) 서버로 보내기 추가

                for( let i = 0 ; i < wordMaxLen ; i++ ) {
                    word[i].state = 'correct';
                }
                setWordList({
                    ...wordList,
                    word,
                });
                setTimeout(() => {
                    setMessage('Your Wordle was made!');
                }, 2000);
                
                
                // 만든 문제 링크 띄우기(모달 or 링크 복사 div)
                
            }
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
    };

    return (
        <BoardContainer>
            <Message message={message}>{message}</Message>
            <BoardBlock>
                <WordList word={word} wordState={wordState} wordList={wordList} listIndex={listIndex}/>
            </BoardBlock>
            <Keyboard onClick={onClick} keyState={keyState}/>
        </BoardContainer>
    );
};

export default MakerBoard;