import { Button, Col, Container, Row, ListGroup, Card } from "react-bootstrap/";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import '../components/gameStyle.css'

function GameOver({ pastGame, score, handleLogout, loggedIn, startGame  }) {

    const navigate = useNavigate();

    const handleBack = () => {
        handleLogout();
    }

    const handleBackHome = () => {
        navigate('/home');
    }

  return (
    <div>
        <Container fluid className="p-0">
            <Row className="justify-content-center align-items-center m-0" style={{ minHeight: '100vh' }}>
            <Col md={7} className="p-5 mb-5">
                <div>
                    <Card className="p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingLeft: '20px', maxWidth: '1000px' , maxHeight: '90vh'}}>
                    <Card.Body style={{ maxHeight: '800vh', overflowY: 'auto' }}>
                        <div>
                            <Row>
                                <Col className="d-flex justify-content-center">
                                    <div className="text-center">
                                        <h1 className="primary-font-luckiest">Game OVER!</h1> 
                                        <h2 className="primary-font-fredoka">Score {score}</h2>
                                        <p className="primary-font-luckiest">Thank you for playing!</p>
                                        
                                        <div className="scrollable-games" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                            <ListGroup>
                                                <ul>
                                                    {pastGame.map((round) => (
                                                        <li key={round.meme} className="d-flex align-items-center mt-3 primary-font-baloo">
                                                            <div style={{ flex: '1 1 50%' }}>
                                                                <div>
                                                                    <strong>Round:</strong> {round.roundOfGame}
                                                                </div>
                                                                <div>
                                                                    <strong>Meme:</strong> {round.meme}
                                                                </div>
                                                                <div>
                                                                    <strong>Caption:</strong> {round.caption}
                                                                </div>
                                                                <div>
                                                                    <img src="/icons/trophy-solid.svg" alt="Trophy" style={{ width: '16px', height: '16px', marginRight: '5px' }} />: {round.score}
                                                                </div>
                                                            </div>
                                                            <div style={{ flex: '1 1 50%', textAlign: 'center' }}>
                                                                <img src={"/images/" + round.meme + ".PNG"} alt='Meme' style={{ maxWidth: '50%', height: 'auto' }} />
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </ListGroup>
                                        </div>
                                        
                                        {loggedIn ? (
                                        <>
                                        <Row>
                                            <Col className="d-flex justify-content-center">
                                                <Button
                                                    onClick={() => startGame(loggedIn)}
                                                    className="mx-2"
                                                    style={{
                                                        borderRadius: '50%',
                                                        width: '50px',
                                                        height: '50px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <i className="bi bi-play-fill" style={{ fontSize: '24px' }}></i>
                                                </Button>
                                                <Button
                                                    onClick={handleBackHome}
                                                    className="mx-2" //x stands for both left and right
                                                    style={{
                                                    borderRadius: '50%',
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                    }}
                                                >
                                                <i className="bi bi-house-fill" style={{ fontSize: '24px' }}></i>
                                                </Button>
                                                <Button
                                                    onClick={handleBack}
                                                    className="mx-2"
                                                    style={{
                                                    borderRadius: '50%',
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                    }}
                                                >
                                                <i className="bi bi-box-arrow-right" style={{ fontSize: '24px' }}></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                        </>
                                        ) : (
                                        <Row>
                                            <Col className="d-flex justify-content-center">
                                                <Button
                                                    onClick={() => startGame(loggedIn)}
                                                    className="mx-2"
                                                    style={{
                                                        borderRadius: '50%',
                                                        width: '50px',
                                                        height: '50px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <i className="bi bi-play-fill" style={{ fontSize: '24px' }}></i>
                                                </Button>
                                                <Button
                                                onClick={handleBack}
                                                style={{
                                                    borderRadius: '50%',
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                >
                                                <i className="bi bi-box-arrow-right" style={{ fontSize: '24px' }}></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        </Card.Body>
                    </Card>
                </div>
            </Col>
        </Row>
        </Container>
    </div>
    );
}

GameOver.propTypes = {
    pastGame: PropTypes.arrayOf(PropTypes.shape({
        roundOfGame: PropTypes.number.isRequired,
        meme: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
    })),
    score: PropTypes.number.isRequired,
    handleLogout: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    startGame: PropTypes.func.isRequired,
};

export default GameOver;