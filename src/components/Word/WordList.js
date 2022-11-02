import styled from 'styled-components';
import Word from "./Word";

const WordListBlock = styled.div`
    width: 350px;
    height: 82.5px;
    display: grid;
    grid-template-rows: repeat(1, 1fr);
    grid-gap: 155px;
    padding: 10px;
    box-sizing: border-box;
`;

const WordList = props => {
    const listIndex = props.listIndex;
    const wordList = props.wordList;
    const array = [0];
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
        <WordListBlock>
            {array.map(index => <Word word={RenderWord(index)} wordState={RenderState(index)}></Word>)}
        </WordListBlock>
    );
};

export default WordList;