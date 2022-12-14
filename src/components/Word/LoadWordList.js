import styled from 'styled-components';
import LoadWord from "./LoadWord";

const LoadWordListBlock = styled.div` // LoadWordList 스타일
    width: 350px;
    height: ${ props => props.lineSet.height};
    display: grid;
    grid-template-rows: ${ props => props.lineSet.rows};
    grid-gap: ${ props => props.lineSet.gap};
    padding: 10px;
    box-sizing: border-box;
    transition: height 300ms;
`;

const LoadWordList = props => {
    const listIndex = props.listIndex;
    const wordList = props.wordList;
    const lineSet = props.lineSet;
    const array = lineSet.array;
    const RenderWord = index => { // wordList에서 word 추출
        if ( wordList.length > index )
            return wordList[index];
        if ( listIndex === index )
            return props.word;
        else
            return [];
    }
    return (
        <LoadWordListBlock lineSet={lineSet}>
            {array.map(index => <LoadWord key={index} word={RenderWord(index)}></LoadWord>)}
        </LoadWordListBlock>
    );
};

export default LoadWordList;