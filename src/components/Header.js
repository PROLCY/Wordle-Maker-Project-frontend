import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderBlcok = styled.header`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 20px;
    height: 65px;
    border-bottom: 1px solid #d3d6da;
    z-index: 0;
`;

const LeftSpace = styled.div`
    width: 120px;
    display: flex;
    margin: 0;
    padding: 0;
    align-items: center;
    justify-content: flex-start;
`

const Title = styled.div`
    flex-grow: 2;
    font-weight: 700;
    font-size: 28px;
    text-align: center;
    left: 0;
    right: 0;
    pointer-events: none;
    position: realtive;
`;

const Buttons = styled.div`
    width: 120px;
    display: flex;
    justify-content: flex-end;
    position: relative;
    padding: 0px;
    button {
        width: 100px;
        height: 50px;
        font-size: 20px;
        font-weight: bold;
        background: none;
        border: solid 1px;
        border-radius: 5px;
    }
`;

const Header = props => {
    const navigate = useNavigate();
    
    const onClick = () => {
        if ( props.title === 'Wordle Maker' )
            navigate('/load');
        else if ( props.title === 'Wordle Loader' )
            navigate('/');
    };
    return (
        <HeaderBlcok>
            <LeftSpace />
            <Title>{props.title}</Title>
            <Buttons>
                {
                    (props.title === 'Wordle Maker' && <button onClick={onClick}>Wordle Loader</button>) ||
                    (props.title === 'Wordle Loader' && <button onClick={onClick}>Wordle Maker</button>)
                }
                
            </Buttons>
        </HeaderBlcok>
    )
}

export default Header;