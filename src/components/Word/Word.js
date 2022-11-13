import styled from 'styled-components';
import Letter from './Letter';

const WordBlock = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;

    animation: ${props =>
        (props.wordState === 'not-word' && 'Quivering 150ms 0ms 3')
    };

    @keyframes Quivering {
        0% { transform: translate(0, 0); }
        25% { transform: translate(-5px, 0); }
        50% { transform: translate(0, 0); }
        75% { transform: translate(5px, 0); }
        100% { transform: translate(0, 0); }
    }
`;

const Word = props => {
    const array = [0, 1, 2, 3, 4];
    const RenderLetter = index => { // word상태에서 문자 추출
        if ( props.word === [] ) {
            return ({
                text: null,
                state: 'blank',
            });
        }
        const wordLen=props.word.length;
        if ( index >=  wordLen ) {
            return ({
                text: null,
                state: 'blank',
            });
        }
        else 
            return props.word[index];
    }
    return (
        <WordBlock wordState={props.wordState}>
            {array.map(index => <Letter key={index} letter={RenderLetter(index)} index={index}></Letter>)}
        </WordBlock>
    );
};

export default Word;