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

const Initialized = () => {
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

    useEffect(() => {
        client.get('/make/')
            .then( res => {
                if ( res.data === 'no-session') {
                    Initialized();
                    setMessage('Enter your nickname!');
                }
                else {
                    const wordText = res.data.correct_word;
                    let correct_word=[];
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
            if ( word.length < wordMaxLen ) { 
                setMessage('Not enough letters');
                setWordState('not-word');
                setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                return;
            }
            if ( submitNickname === false ) {
                
                for( let i = 0 ; i < wordMaxLen ; i++ )
                    nickname += word[i].text;
                
                client.post('/make/duplicated', { nickname: nickname })
                    .then( res => {
                        if ( res.data === 'duplicated') {
                            nickname = '';
                            setMessage('It already exists!');
                            setWordState('not-word');
                            setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                            return;
                        }
                        else {
                            submitNickname = true;

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
                        }
                    });
            } else if ( submitWord === false ) {

                correct_word = word.map(letter => letter.text).join('');

                setWordList({
                    ...wordList,
                    word,
                });

                client.post('/make/exist', { word: correct_word })
                    .then( res => {
                        if ( res.data.exist === false) {
                            setMessage('Not in word list');
                            setWordState('not-word');
                            setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                        } else {
                            submitWord = true;
                            isFinished = true;

                            for( let i = 0 ; i < wordMaxLen ; i++ )
                                word[i].state = 'correct';

                            client.post('/make/register', { 
                                nickname: nickname, 
                                correct_word: correct_word, 
                            })
                                .then( res => {
                                    console.log(res.data);
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
                <WordList lineSet={oneLine} word={word} wordState={wordState} wordList={wordList} listIndex={listIndex}/>
            </BoardBlock>
            <Keyboard onClick={onClick} keyState={keyState}/>
        </BoardContainer>
    );
};

export default MakerBoard;