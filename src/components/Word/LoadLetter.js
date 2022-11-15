import styled from 'styled-components';
import { black, bright_gray, dark_gray, green, white, yellow } from '../../lib/color';

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
        (props.state === 'blank' &&  `2px solid ${bright_gray}`) ||
        `2px solid ${dark_gray}`
    };
    color: ${black};
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

const LoadLetter = props => {
    const letter = props.letter;
    return (
        <LetterBlock state={letter.state} index={props.index}>
            <FrontBlock state={letter.state}>{letter.text}</FrontBlock>
            <BackBlock state={letter.state}>{letter.text}</BackBlock>     
        </LetterBlock>
    );
}

export default LoadLetter;




