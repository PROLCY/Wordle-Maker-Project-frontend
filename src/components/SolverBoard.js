import styled from 'styled-components';
import WordList from "./Word/WordList";
import Keyboard from './Keyboard/Keyboard';
import { useEffect, useState } from 'react';
import { BACK } from './Keyboard/Keyboard';
import { oneLine, sixLines } from './Word/designSettings/WordListSet';
import client from '../lib/api/client';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';


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
let keyState = {};
let submitNickname = false;

let nickname = '';

const winningStatement = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'];

const connectSocket = ( makerNickname ) => {
    console.log("namespace:", window.location.href.slice(0, -11)+'loader');
    const socket = io(window.location.href.slice(0, -11)+'loader', {
        transports: ['websocket'],
        query: {
            maker: makerNickname,
        }
    });
    return socket;
};

const SolverBoard = () => {
    const [word, setWord] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [wordState, setWordState] = useState('');
    const [wordCorrect, setWordCorrect] = useState('');
    const [message, setMessage] = useState(null);
    const [lineSet, setLineSet] = useState(oneLine);
    const [listIndex, setListIndex] = useState(0);
    const params = useParams();

    useEffect(() => { // 렌더링될 때
        connectSocket(params.maker);
        client.get(`/solve/${params.maker}/init`)
            .then( res => {
                if ( res.data === 'Not Found') {
                    setMessage('This Wordle was Deleted or Not Made yet');
                    isFinished = true;
                    return;
                }
                if ( res.data === 'no-session')
                    setMessage('Enter your nickname!');
                else {
                    nickname = res.data.nickname;
                    setLineSet(sixLines);
                    setWordCorrect(res.data.wordCorrect);
                    keyState = res.data.keyState;
                    submitNickname = true;
                    setTimeout(() => { 
                        setWordList(res.data.wordList);
                        setListIndex(res.data.listIndex);
                        console.log("res.wordList", res.data.wordList);
                        setWord(res.data.lastWord);
                        console.log("res.lastWord:", res.data.lastWord);
                        
                    }, 100);
                }
            })
    }, [params]);

    useEffect(() => {
        if ( submitNickname  ) {
            console.log('wordlist:', wordList);
            console.log('listIndex:',listIndex);
            if ( wordList[listIndex] === undefined ) {
                setWordList([
                    ...wordList,
                    word
                ]);
            } else {
                setWordList(wordList.map((element, index) => {
                    if ( index === listIndex )
                        return word;
                    else
                        return element;
                }));
            }
            if ( word.length !== 0 && word[0].state === 'filled') {
                client.post(`/solve/${params.maker}/typing`, { newWord: word, listIndex: listIndex }) // 입력한 단어 및 키 상태 서버에 등록
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
    }, [word, params]);

    useEffect(() => {
        for( let i = 0 ; i < listIndex ; i++ ) {
            if ( wordList[i].length !== 0 && wordList[i][0].state === 'all-correct' ) {
                setTimeout( () => {
                    setMessage(winningStatement[listIndex-1]);
                    setTimeout(() => setMessage(null), 2000);
                }, 2000);
                isFinished = true;
                return;
            }
            
        }
        if ( listIndex === wordListMaxLen ) {
            isFinished = true;
            setTimeout( () => {
                setMessage(wordCorrect);
                setTimeout(() => setMessage(null), 2000);
            }, 2000);
        }
    }, [listIndex]);

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
            for ( let i = 0 ; i < wordMaxLen ; i++ )
                word[i].state = 'all-correct';
        }
        return word;
    };

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
            if ( submitNickname === false ) { // 닉네임 제출
                for( let i = 0 ; i < wordMaxLen ; i++ )
                    nickname += word[i].text;
                
                client.post(`/solve/${params.maker}/duplicated`, { nickname: nickname })
                    .then( res => {
                        if ( res.data === 'duplicated') {
                            nickname = '';
                            setMessage('It already exists!');
                            setWordState('not-word');
                            setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                            return;
                        }
                        else {
                            setWord(word.map(letter => ({
                                text: letter.text,
                                state: 'correct',
                            })));
                            setWordList({
                                ...wordList,
                                word,
                            });
                            // solver 닉네임과 url을 함께 보내면서 등록 요청
                            client.post(`/solve/${params.maker}/register`, { 
                                nickname: nickname, 
                            })
                                .then( res => {
                                    setTimeout(() => {
                                        setWordList([[]]);
                                        setWord([]);
                                        setWordCorrect(res.data.wordCorrect);
                                        setTimeout(() => { // 6줄로 전환
                                            setLineSet(sixLines);
                                            setMessage('Enter the word!');
                                        }, 2000);
                                    }, 2000);
                                })
                            submitNickname = true;
                        }
                    });
            }
            else {
                const wordText = word.map(letter => letter.text).join('');
                client.post(`/solve/exist`, { word: wordText }) // 단어 존재 여부 검증
                    .then( res => {
                        if ( res.data.exist === false ) {
                            setMessage('Not in word list');
                            setWordState('not-word');
                            setTimeout(() => {setWordState(''); setMessage(null);}, 500);
                        } else {
                            const newWord = ColoringWord(word, wordCorrect);
                            setWord(newWord);
                            setListIndex(listIndex + 1);

                            client.post(`/solve/${params.maker}/enter`, { newWord: word, keyState: keyState }) // 입력한 단어 및 키 상태 서버에 등록
                                /*.then( res => {
                                    setWord([]);
                                })*/
                                .catch(error => {
                                    console.log(error);
                                })
                            
                            if ( word[0].state === 'all-correct' ) {
                                setTimeout( () => { // 성공 메시지 띄우기
                                    setMessage(winningStatement[listIndex-1]);
                                    setTimeout(() => setMessage(null), 2000);
                                }, 2000);
                                isFinished = true;
                            }
                            setWord([]);

                            if ( isFinished )
                                return;
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
                <WordList lineSet={lineSet} word={word} wordState={wordState} wordList={wordList} listIndex={listIndex}/>
            </BoardBlock>
            <Keyboard onClick={onClick} keyState={keyState}/>
        </BoardContainer>
    );
};

export default SolverBoard;