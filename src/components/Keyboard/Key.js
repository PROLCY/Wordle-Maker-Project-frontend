import styled from 'styled-components';
import { BACK } from './Keyboard';
import { dark_gray, green, yellow, white, black, bright_gray } from '../../lib/color';
import { delayTime } from '../Word/Letter';

const KeyBlock = styled.button` // Key 스타일
    font-family: inherit;
    font-weight: bold;
    font-size: 0.95rem;
    border: 0;
    padding: 0;
    margin: 0 6px 0 0;
    height: 58px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    color: ${ props =>
        props.state === 'correct' ||  
        props.state === 'contained' || 
        props.state === 'non-contained' ? white : black
    };
    background-color: ${ props => (
        (props.state === 'correct' && green) ||
        (props.state === 'contained' && yellow) ||
        (props.state === 'non-contained' && dark_gray) || bright_gray
    )};
    flex: ${props => props.letter === 'ENTER' || props.letter === BACK ? 1.5 : 1};
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    transition-delay: ${5 * delayTime}ms;
    -webkit-tap-highlight-state: rgba(0, 0, 0, 0.3);
`;

const Key = props => {
    const letter = props.letter;
    return <KeyBlock letter={letter} onClick={props.onClick} state={props.state}>{letter}</KeyBlock>;
};

export default Key;