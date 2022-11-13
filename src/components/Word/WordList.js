import styled from 'styled-components';
import Word from "./Word";

const WordListBlock = styled.div`
    width: 350px;
    height: ${ props => props.lineSet.height};
    display: grid;
    grid-template-rows: ${ props => props.lineSet.rows};
    grid-gap: ${ props => props.lineSet.gap};
    padding: 10px;
    box-sizing: border-box;
    transition: height 300ms;
`;

const WordList = props => {
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
    const RenderState = index => { // wordState 추출
        if ( listIndex === index )
            return props.wordState;
        else
            return null;
    }
    return (
        <WordListBlock lineSet={lineSet}>
            {array.map(index => <Word key={index} word={RenderWord(index)} wordState={RenderState(index)}></Word>)}
        </WordListBlock>
    );
};

export default WordList;