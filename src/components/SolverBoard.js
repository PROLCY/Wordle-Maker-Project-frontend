import styled from 'styled-components';
import WordList from "./Word/WordList";
import Keyboard from './Keyboard/Keyboard';
import { useEffect, useState } from 'react';
import { BACK } from './Keyboard/Keyboard';
import client from '../lib/api/client';

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
const wordListMaxLen = 6;

let isFinished = false;
let listIndex = 0;
let keyState = {};

const winningStatement = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'];

const Board = () => {
    const [word, setWord] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [wordState, setWordState] = useState('');
    const [message, setMessage] = useState(null);
    const [wordCorrect, setWordCorrect] = useState('');

    useEffect(() => { // 처음 렌더링될 때 실행
        client.get('/word')
            .then( res => {
                setWordCorrect(res.data.wordCorrect);
                setWordList(res.data.wordList);
                keyState = res.data.keyState;
            })
    }, []);

    useEffect(() => { // wordList가 바뀔 때마다 listIndex와 isFinished 초기화
        listIndex = wordList.length;
        if ( listIndex > 0 ) {
            if ( wordList[listIndex-1][0].state === 'all-correct' )
                isFinished = true;
        }
    }, [wordList]);

    const ColoringWord = ( word, wordCorrect ) => { // word 상태 및 keyState 업데이트 함수
        let letterCorrectCounts = 0;
        const wordLen = word.length;

        for ( let i = 0 ; i < wordLen ; i++ ) {
            if ( wordCorrect[i] === word[i].text ) { // 문자와 위치가 wordCorrect와 일치하는 경우
                word[i].state = 'correct';
                keyState[wordCorrect[i]] = 'correct';
                letterCorrectCounts++;
                continue;
            }
            for ( let j = 0 ; j < wordLen ; j++) {
                if ( wordCorrect[i] === word[j].text ) { // 문자가 wordCorrect에 있는 경우
                    if ( word[j].state !== 'correct' )
                        word[j].state = 'contained';
                    if ( keyState[wordCorrect[i]] !== 'correct') 
                        keyState[wordCorrect[i]] = 'contained';
                    break;
                }
            }
            if ( word[i].state === 'filled' ) { // 문자가 wordCorrect에 없는 경우
                word[i].state = 'non-contained';
                if ( keyState[word[i].text] === undefined )
                    keyState[word[i].text] = 'non-contained';
            }
        }

        if ( letterCorrectCounts === wordLen ) { // 정답 단어를 맞췄을 경우
            isFinished = true;

            for ( let i = 0 ; i < wordMaxLen ; i++ )
                word[i].state = 'all-correct';
            setWord([]);

            setTimeout( () => { // 성공 메시지 띄우기
                setMessage(winningStatement[listIndex-1]);
                setTimeout(() => setMessage(null), 2000);
            }, 2000);
        }
        return word;
    };

    const onClick = e => { // 키를 눌렀을 때 실행되는 함수
        if ( listIndex === wordListMaxLen || isFinished )
                return;
        if ( e.target.innerText === 'ENTER') { // ENTER를 눌렀을 경우
            if ( word.length < wordMaxLen ) { 
                setMessage('Not enough letters');
                setWordState('not-word');
                setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                return;
            }

            const wordText = word.map(letter => letter.text).join('');
            client.post(`/word/exist`, { word: wordText }) // 단어 존재 여부 검증
                .then( res => {
                    if ( res.data.exist === false ) {
                        setMessage('Not in word list');
                        setWordState('not-word');
                        setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                    }
                    else {
                        setWordList([
                            ...wordList,
                            ColoringWord(word, wordCorrect),
                        ]);
                        listIndex++;
                        client.post('/word/add', { newWord: word, keyState: keyState }) // 입력한 단어 및 키 상태 서버에 등록
                            .catch(error => {
                                console.log(error);
                            })
                        
                        if ( isFinished )
                            return;
            
                        if ( listIndex === wordListMaxLen ) {
                            setTimeout( () => {
                                setMessage(wordCorrect);
                                setTimeout(() => setMessage(null), 2000);
                            }, 2000);
                        }
                        setWord([]);
                    }
                })
            return;
        } 
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

export default Board;