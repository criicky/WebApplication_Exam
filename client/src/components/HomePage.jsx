import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from "prop-types";

function HomePage({ startGame, username, loggedIn, gameHistory, handleLogout }){
    
    const [showRules, setShowRules] = useState(false);

    const handleBack = () => {
        handleLogout();
    }

    const handleInfoClick = () => {
        setShowRules(true);
    }

    const handleCloseRules = () => {
        setShowRules(false);
    }

    return (
        <div>
            <Container fluid className="p-0">
                <Row className="justify-content-center align-items-center m-0" style={{ minHeight: '100vh' }}>
                    <Col md={5} className="p-5 mb-5">
                        <div className="ml-5 mb-5 p-5">
                            <Card className="p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', paddingLeft: '20px' }}>
                                <Card.Body>
                                    <div style={{textAlign: 'center'}}>
                                        <h1 className='primary-font-luckiest'>Welcome to Your Page</h1>
                                        <h2 className='primary-font-fredoka mb-4'>
                                            <img src="/icons/user-solid.svg" alt="Trophy" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                            {username}
                                        </h2>
                                        <div style={{display: 'flex', justifyContent: 'center'}}>
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
                                            {loggedIn && (
                                                    <Button
                                                        onClick={() => gameHistory(username)}
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
                                                        <i className="bi bi-clock-history" style={{ fontSize: '24px' }}></i>
                                                    </Button>
                                            )}
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
                                        </div>
                                        <Button
                                            className="info-button"
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={() => handleInfoClick()}
                                        >
                                            <i className="bi bi-info-circle" style={{ fontSize: '24px' }}></i>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Modal show={showRules} onHide={handleCloseRules} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Meme Game Rules</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>
                    <span role="img" aria-label="Party popper emoji">🎉</span> Welcome to the Meme Caption Challenge! <br />
                    Get ready for some meme-tastic fun! Here&#39;s how it works:
                </p>
                <ul>
                    <li>
                        <strong>Round Start:</strong> At the beginning of each round, you&#39;ll see a hilarious meme with 7 possible captions.
                    </li>
                    <li>
                        <strong>Time&#39;s Ticking:</strong> You have a quick 30 seconds to choose the correct caption from the options provided. Only 2 are correct.
                    </li>
                    <li>
                        <strong>Points Galore:</strong> Select the right caption and earn 5 points! Choose wrong or run out of time, and you&#39;ll get 0 points.
                    </li>
                    <li>
                        <strong>Play Limits:</strong> If you&#39;re not logged in, enjoy one exciting round. Log in to play up to 3 rounds and check your game history!
                    </li>
                    <li>
                        <strong>Quit Game:</strong> If you need to leave, click the X icon in the top left corner to quit the game. But not in between rounds!
                    </li>
                    <li>
                        <strong>Game History:</strong> If you&#39;re logged in, you can click on the clock icon to view your game history. For each game press the triangle icon to see details about that game!
                    </li>
                </ul>
                <p>
                    Get ready to laugh and caption away! <span role="img" aria-label="Laughing face emoji">😄</span>
                </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRules}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

HomePage.propTypes = {
    startGame: PropTypes.func,
    username: PropTypes.string,
    loggedIn: PropTypes.bool,
    gameHistory: PropTypes.func,
    handleLogout: PropTypes.func
}

export default HomePage;

