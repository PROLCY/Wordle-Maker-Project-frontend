import styled from 'styled-components';
import Key from './Key';

const KeyboardBlcok = styled.div`
    height: 200px;
    margin: 0 8px;
    user-select: none;
`;

const KeyLineBlock = styled.div`
    display: flex;
    width: 100%;
    margin: 0 auto 8px;
    touch-action: manipualtion;
`;

const Spacer = styled.div`
    flex: 0.5;
    display: block;
`;

export const BACK = '\u232B';

const Keyboard = props => {
    const first_letters=['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    const second_letters=['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    const third_letters=['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', BACK];

    const keyListFirst = first_letters.map((letter, index) => <Key key={index} letter={letter} onClick={props.onClick} state={props.keyState[letter]}/>);
    const keyListSecond = second_letters.map((letter, index) => <Key key={index} letter={letter} onClick={props.onClick} state={props.keyState[letter]}/>);
    const keyListThird = third_letters.map((letter, index) => <Key key={index} letter={letter} onClick={props.onClick} state={props.keyState[letter]}/>);

    return (
        <KeyboardBlcok>

            <KeyLineBlock>
                {keyListFirst}
            </KeyLineBlock>

            <KeyLineBlock>
                <Spacer />
                {keyListSecond}
                <Spacer />
            </KeyLineBlock>

            <KeyLineBlock>
                {keyListThird}
            </KeyLineBlock>

        </KeyboardBlcok>
    )
}

export default Keyboard;