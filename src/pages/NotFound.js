import styled from "styled-components";

const NotFoundBlock = styled.div`
    display: flex;
    height: 100%;
    font-size: 100px;
    justify-content: center;
    align-items: center;
`;

const NotFound = () => {
    return (
        <NotFoundBlock>404 Not Found</NotFoundBlock>
    )
};

export default NotFound;