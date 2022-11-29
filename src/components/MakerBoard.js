import styled from 'styled-components';
import WordList from "./Word/WordList";
import Keyboard from './Keyboard/Keyboard';
import { useEffect, useState } from 'react';
import { BACK } from './Keyboard/Keyboard';
import { oneLine } from './Word/designSettings/WordListSet';
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
    width: max-content;
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

const Initialized = () => { // 렌더링 시 초기화 함수
    isFinished = false;
    submitNickname = false;
    submitWord = false;
    listIndex = 0;
    keyState = {};
    nickname = '';
    correct_word = '';
};

const MakerBoard = () => {
    const [word, setWord] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [wordState, setWordState] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => { // 처음 렌더링될 때 실행
        client.get('/make/init') // 세션 검증 및 데이터 요청
            .then( res => {
                if ( res.data === 'no-session') {
                    Initialized();
                    setMessage('Enter your nickname!');
                }
                else {
                    const wordText = res.data.correct_word;
                    let correct_word = [];
                    for( let i = 0 ; i < wordMaxLen ; i++ ) {
                        correct_word.push({
                            text: wordText[i],
                            state: 'correct'
                        })
                    }
                    setWord(correct_word);
                    setMessage(res.data.url);
                    isFinished = true;
                }
            })
    }, []);

    const onClick = e => { // 키를 눌렀을 때 실행되는 함수
        if ( isFinished )
                return;
        if ( e.target.innerText === 'ENTER') { // ENTER를 눌렀을 경우
            if ( word.length < wordMaxLen ) {  // 문자 개수가 부족할 때
                setMessage('Not enough letters');
                setWordState('not-word');
                setTimeout(() => {
                    setWordState('');
                    setMessage(null);}, 
                500);
                return;
            }
            if ( submitNickname === false ) { // 닉네임 입력 과정
                
                nickname = word.map(letter => letter.text).join('');
                
                client.post('/make/duplicated', { nickname: nickname }) // 중복 판별 요청
                    .then( res => {
                        if ( res.data === 'duplicated') {
                            nickname = '';
                            setMessage('It already exists!');
                            setWordState('not-word');
                            setTimeout(() => {
                                setWordState(''); 
                                setMessage(null);
                            }, 500);
                            return;
                        }
                        else {
                            submitNickname = true;

                            setWord(word.map(letter => ({
                                text: letter.text,
                                state: 'correct'
                            })));
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
                        }
                    });
            
            } else if ( submitWord === false ) { // 정답 단어 입력 과정

                correct_word = word.map(letter => letter.text).join('');

                setWordList({
                    ...wordList,
                    word,
                });

                client.post('/make/exist', { word: correct_word }) // 단어 존재 여부 판별 요청
                    .then( res => {
                        if ( res.data.exist === false) {
                            setMessage('Not in word list');
                            setWordState('not-word');
                            setTimeout(() => {
                                setWordState(''); 
                                setMessage(null);
                            }, 500);
                        } else {
                            submitWord = true;
                            isFinished = true;

                            setWord(word.map(letter => ({
                                text: letter.text,
                                state: 'correct'
                            })));

                            client.post('/make/register', { // wordle 등록 요청
                                nickname: nickname, 
                                correct_word: correct_word, 
                            })
                                .then( res => {
                                    // res.data (wordle 링크)
                                    setMessage('Your Wordle was made!');
                                    setTimeout(() => {
                                        setMessage(res.data);
                                    }, 2000);
                                })
                        }
                    })
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
        if ( word.length >= wordMaxLen )
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
                <WordList lineSet={oneLine} word={word} wordState={wordState} wordList={wordList} listIndex={listIndex}/>
            </BoardBlock>
            <Keyboard onClick={onClick} keyState={keyState}/>
        </BoardContainer>
    );
};

export default MakerBoard;