import io from 'socket.io-client';

const TestPage = () => {
    const socket = io('http://localhost:4000', {
        transports: ['websocket']
    });
    socket.on('news', function(data) {
        console.log(data);
        socket.emit('reply', 'Hello Node JS');
    });
    return (
        <div>TestPage</div>
    )
};

export default TestPage;