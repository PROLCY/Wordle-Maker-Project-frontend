import { useState } from 'react';
import styled from 'styled-components';
import TestBoard from "../components/TestBoard";
import Header from "../components/Header";

const MainPageBlock = styled.div`
    height: 100%;
    position: relatvie;
    display: block;
    align-content: center;
    .modal {
        width: 100%;
        height: 100%;
        position: absolute;
        display: ${props => props.modal ? 'block' : 'none'};
        background: rgba(255, 255, 255, 0.6);    
    }
    .modal-body {
        position: relative;
        width: 500px;
        height: 60%;
        min-height: 600px;
        max-height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        background: white;
        box-shadow: 0 4px 23px 0 rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 100px;
    }
`;



const TestPage = () => {
    const [modal, setModal] = useState(false);
    
    const onModal = () => {
        setModal(true);
    }

    const offModal = e => {
        if ( e.target.className === 'modal-body')
            return;
        setModal(false);
    }
    return (
        <MainPageBlock modal={modal}>
            <div className='modal' onClick={offModal}>
                <div className='modal-body'>content</div>
            </div>
            <Header onModal={onModal} title={'Wordle Loader'}/>
            <TestBoard />
        </MainPageBlock>
    )
}

export default TestPage;