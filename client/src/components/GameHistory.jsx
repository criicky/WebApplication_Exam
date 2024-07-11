import { Container, Row, Col, Card, ListGroup, Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { useState } from 'react';

function GameHistory({ username, games, totscore }){

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/home');
    }

    const [showModal, setShowModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    const handleShowModal = (game) => {
        setSelectedGame(game);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedGame(null);
    };

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <Container fluid className="p-0">
                <Row className="justify-content-center align-items-center m-0" style={{ minHeight: '100vh' }}>
                    <Col md={5} className="p-5 mb-5">
                        <div>
                            <Card className="p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', paddingLeft: '20px', maxWidth: '1000px' , maxHeight: '90vh'}}>
                                <Card.Body style={{ maxHeight: '800vh', overflowY: 'auto' }}>
                                    <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Button className="btn-lg py-2 px-4" onClick={handleBack}><BsArrowLeft/></Button>
                                        <span className='primary-font-fredoka'>
                                            <img src="/icons/user-solid.svg" alt="Trophy" style={{ width: '35px', height: '35px', marginRight: '10px' }} />
                                            {username}
                                        </span>
                                    </h1>
                                    <div>
                                        <h1 className='mt-4 primary-font-bangers mr-1'>
                                            Your total score is: {totscore}
                                            <img className='mx-2' src="/icons/trophy-solid.svg" alt="Trophy" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                                        </h1>
                                    </div>
                                    
                                    <h3 className='primary-font-bangers'>This is your game history</h3>
                                    <div className="scrollable-games" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                        <ListGroup>
                                            {games && games.length > 0 ? (
                                                games.map((game) => (
                                                    <div key={game.gameID} className='mt-3 d-flex justify-content-center text-align-center'>
                                                        <button 
                                                            onClick={() => handleShowModal(game)} 
                                                            style={{ background: 'none', border: 'none', padding: 0 }}
                                                        >
                                                        <img 
                                                            src="/icons/caret-down-solid.svg" 
                                                            alt="Quit" 
                                                            style={{ width: '40px', height: '40px' }} 
                                                        />
                                                        </button>
                                                        <h3 className='primary-font-bangers mx-3'>Game: {game.gameID}</h3> 
                                                        <h4 className='primary-font-bangers mx-3'>
                                                            <img src="/icons/trophy-solid.svg" alt="Trophy" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                                                            : {game.totscore}
                                                        </h4>
                                                    </div>
                                                ))
                                                ) : (
                                                <p className='primary-font-baloo'>No games found.</p>
                                            )}
                                        </ListGroup>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>

            {selectedGame && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Game Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div className='d-flex justify-content-center text-align-center'>
                                <h3 className='primary-font-bangers mx-3'><strong>Game:</strong> {selectedGame.gameID}</h3>
                                <h3 className='primary-font-bangers mx-3'>
                                    <img src="/icons/trophy-solid.svg" alt="Trophy" style={{ width: '25px', height: '25px', marginRight: '10px' }} />
                                    : {selectedGame.totscore}
                                </h3>
                            </div>
                            <h4 className='mt-2'>Rounds</h4>
                            {selectedGame.rounds.length > 0 ? (
                                <ul>
                                    {selectedGame.rounds.map((round) => (
                                        <li key={round.roundOfGame} className="d-flex align-items-center mt-3 primary-font-baloo">
                                            <div style={{ flex: '1 1 50%' }}>
                                                <div className="text-center primary-font-baloo">
                                                    <strong>Round:</strong> {round.roundOfGame}
                                                </div>
                                                <div className="text-center primary-font-baloo">
                                                    <strong>Meme:</strong> {round.meme}
                                                </div>
                                                <div className="text-center primary-font-baloo">
                                                    <strong>Caption:</strong> {round.caption}
                                                </div>
                                                <div className="text-center primary-font-baloo">
                                                <img src="/icons/trophy-solid.svg" alt="Trophy" style={{ width: '16px', height: '16px', marginRight: '5px' }} />: {round.score}
                                                </div>
                                            </div>
                                            <div style={{ flex: '1 1 50%', textAlign: 'center' }}>
                                                <img src={"/images/" + round.meme + ".PNG"} alt='Meme' style={{ maxWidth: '50%', height: 'auto' }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className='primary-font-baloo'>No rounds found.</p>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
}

GameHistory.propTypes = {
    username: PropTypes.string,
    games: PropTypes.arrayOf(PropTypes.shape({
        gameID : PropTypes.number.isRequired,
        totscore: PropTypes.number.isRequired,
        rounds: PropTypes.arrayOf(PropTypes.shape({
            roundOfGame: PropTypes.number.isRequired,
            meme: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            score: PropTypes.number.isRequired,
        })),
    })),
    totscore: PropTypes.number,
}

export default GameHistory;