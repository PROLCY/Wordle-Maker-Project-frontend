import styled from 'styled-components';
import { black, bright_gray, dark_gray, green, white, yellow } from '../../lib/color';

export const delayTime = 400;
const durationTime = 600;

const LetterBlock = styled.div`
    width: 100%;
    display: block;
    position: relative;
    transform-style: preserve-3d;
    transform: ${ props => 
        (props.state === 'correct' ||
        props.state === 'all-correct' ||
        props.state === 'contained' ||
        props.state === 'non-contained')
        && 'rotateX(180deg)'
    };
    transition-delay: ${props => (props.index * delayTime)}ms;
    transition-duration: ${durationTime}ms;

    animation: ${props => 
        (props.state === 'all-correct' && `Waving 500ms ${props.index * (delayTime/4) + 2000}ms`) ||
        (props.state === 'not-word' && 'Quivering 1000ms')
    };
    @keyframes Waving {
        0% { transform: rotateX(180deg) translate(0, 0px); }
        50% { transform: rotateX(180deg) translate(0, 30px); }
        100% { transform:  rotateX(180deg) translate(0, 0px); }
    }
`;

const FrontBlock = styled.div` // 앞면
    position: absolute;
    width: 100%;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 1;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    backface-visibility: hidden;
    border: ${ props => 
        ((props.state === 'blank' || props.state === 'init') &&  `2px solid ${bright_gray}`) ||
        `2px solid ${dark_gray}`
    };
    color: ${black};

    animation: ${ props => 
        (props.state === 'filled' && 'Popping 50ms')
    };

    @keyframes Popping {
        from { 
            width: 100%;
            height: 100%;
        }
        to {
            transform: scale(110%, 110%);
        }
    }
`;

const BackBlock = styled.div` // 뒷면
    position: absolute;
    width: 100%;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 1;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    backface-visibility: hidden;
    transform: rotateX(180deg);
    color: ${white};
    background-color: ${ props => (
        ((props.state === 'correct') && green) ||
        (props.state === 'contained' && yellow) ||
        (props.state === 'non-contained' && dark_gray) ||
        (props.state === 'all-correct' && green)
    )};
`;

const Letter = props => {
    const letter = props.letter;
    return (
        <LetterBlock state={letter.state} index={props.index}>
            <FrontBlock state={letter.state}>{letter.text}</FrontBlock>
            <BackBlock state={letter.state}>{letter.text}</BackBlock>     
        </LetterBlock>
    );
}

export default Letter;




