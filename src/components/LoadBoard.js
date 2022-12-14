import styled from 'styled-components';
import WordList from "./Word/WordList";
import LoadWordList from './Word/LoadWordList';
import Keyboard from './Keyboard/Keyboard';
import { useEffect, useState } from 'react';
import { BACK } from './Keyboard/Keyboard';
import { oneLine, sevenLines } from './Word/designSettings/WordListSet';
import client from '../lib/api/client';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

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

const PageButtonBlock = styled.div` // PageButton을 담는 요소 스타일
    display: flex;
    justify-content: center;
    height: 100px;
    align-items: center;
`;

const PageButton = styled.div` // 페이지를 넘기는 버튼 스타일
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

const StateButtonblock = styled.div` // delete 버튼 스타일
    display: flex;
    justify-content: center;
    height: 50px;
    border: none;
    button {
        width: 250px;
        font-size: 25px;
        font-weight: bold;
        border-radius: 10px;
        background-color: white;
        border: solid 2px black;
        cursor: pointer;
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

const Initialized = () => { // 렌더링 시 초기화 함수
    listIndex = 0;
    keyState = {};
};

const LoadBoard = () => {
    const [word, setWord] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [wordState, setWordState] = useState('load');
    const [message, setMessage] = useState(null);
    const [submitNickname, setSubmitNickname] = useState(0);
    const [solvers, setSolvers] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const connectSocket = ( makerNickname ) => { // socket.io(웹소켓) 연결 함수
        /* 실제 배포 시 사용
        const socket = io(window.location.href.slice(0, -4)+'loader', {
            transports: ['websocket'],
            query: {
                maker: makerNickname,
            }
        });
        socket.on('typing', function(data) {
            setSolvers(data);
        });
        return;
        */

        // 개발 시 사용
        const socket = io('http://localhost:4000/loader', {
            transports: ['websocket'],
            query: {
                maker: makerNickname,
            }
        });
        socket.on('typing', function(data) {
            setSolvers(data);
        });
        return;
    };

    useEffect(() => { // 렌더링될 때 
        Initialized();
        client.get('/load/init') // 세선 검증
            .then( res => {
                if ( res.data === 'no-session') {
                    setSubmitNickname(false);
                    setMessage('Enter your nickname!');
                }
                else {
                    setSubmitNickname(true);
                    setNickname(res.data.maker);
                }
            })
    }, []);

    useEffect(() => { // nickname이 입력되었을 때
        if ( nickname === '')
            return;
        client.post('/load/init', { makerNickname: nickname }) // 데이터 요청
            .then( res => {
                setSolvers(res.data);
                connectSocket(nickname);
            })
    }, [nickname]);

    const onClickKeyBoard = e => { // 키보드를 눌렀을 때 실행되는 함수
        if ( e.target.innerText === 'ENTER') { // ENTER를 눌렀을 경우
            if ( word.length < wordMaxLen ) { 
                setMessage('Not enough letters');
                setWordState('not-word');
                setTimeout(() => {
                    setWordState(''); 
                    setMessage(null);
                }, 500);
                return;
            }
            
            const makerNickname = word.map(letter => letter.text).join('');
            
            client.post('/load/exist', { nickname: makerNickname }) // 닉네임 존재 여부 검증 요청
                .then( res => {
                    if ( res.data === false) {
                        setNickname('');
                        setMessage("It doesn't exist!");
                        setWordState('not-word');
                        setTimeout(() => {
                            setWordState(''); 
                            setMessage(null);
                        }, 500);
                        return;
                    }
                    else {
                        setWord(word.map(letter => ({
                            text: letter.text,
                            state: 'correct'
                        })));
                        setNickname(makerNickname);
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
        if ( word.length >= wordMaxLen )
            return;
        setWord(word.concat({
            text: e.target.innerText,
            state: 'filled',
        }));
        return;
    };

    const onClickPageButton = e => { // 페이지 넘김 버튼을 눌렀을 때 실행되는 함수
        if ( e.target.id === 'next' ) {
            if ( solvers.length > pageIndex * 4 )
                setPageIndex(pageIndex + 1);
        }
            
        else if ( e.target.id === 'prev' ) {
            if ( pageIndex > 1 )
                setPageIndex(pageIndex - 1);
        }
    };

    const onClickDelete = e => { // delete wordle 버튼을 눌렀을 때 실행되는 함수
        client.delete(`/load/delete/${nickname}`)
            .then( res => {
                if ( res.data === 'oneClick' ) {
                    setMessage('Press delete button one more again');
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000);
                } else if ( res.data === 'doubleClick' ) {
                    navigate('/');
                }
            })
    };

    return (
        <BoardContainer submitNickname={submitNickname}>
            <Message message={message}>{message}</Message>
            <BoardBlock>
                { // 닉네임을 제출하지 않았다면 애니메이션이 작동되는 WordList를, 제출했다면 애니메이션이 없는 LoadWordList 렌더링
                    submitNickname === false ? 
                    <WordList lineSet={oneLine} word={word} wordState={wordState} wordList={wordList} listIndex={listIndex}/> :
                    solvers.slice((pageIndex-1)*4, pageIndex*4).map((solver, index) => 
                    <LoadWordList key={index} lineSet={sevenLines} word={word} wordList={solver.nickname.concat(solver.wordList)}/>)
                }
            </BoardBlock>
            { // 닉네임을 제출하지 않았다면 키보드를, 제출했다면 PageButton과 delete 버튼을 렌더링
                (submitNickname === false && <Keyboard onClick={onClickKeyBoard} keyState={keyState}/>) ||
                (submitNickname === true && 
                    <>
                        <PageButtonBlock>
                            <PageButton id='prev' pageIndex={pageIndex} listLength={solvers.length} onClick={onClickPageButton}>&lt;</PageButton>
                            <PageButton id='next' pageIndex={pageIndex} listLength={solvers.length} onClick={onClickPageButton}>&gt;</PageButton>
                        </PageButtonBlock>
                        <StateButtonblock><button onClick={onClickDelete}>DELETE WORDLE</button></StateButtonblock>
                    </>
                )
            }

        </BoardContainer>
    );
};

export default LoadBoard;