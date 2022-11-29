import styled from 'styled-components';
import LoadLetter from './LoadLetter';

const LoadWordBlock = styled.div` // LoadWord 스타일
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
`;

const LoadWord = props => {
    const array = [0, 1, 2, 3, 4];
    const RenderLetter = index => { // word상태에서 문자 추출
        if ( props.word === [] ) {
            return ({
                text: null,
                state: 'blank',
            });
        }
        const wordLen = props.word.length;
        if ( index >=  wordLen ) {
            return ({
                text: null,
                state: 'blank',
            });
        }
        else 
            return props.word[index];
    }
    const letterList = array.map(index => <LoadLetter key={index} letter={RenderLetter(index)} index={index}></LoadLetter>);
    return (
        <LoadWordBlock>
            {letterList}
        </LoadWordBlock>
    );
};

export default LoadWord;