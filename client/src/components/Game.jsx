import { Button, Col, Container, Row, Card } from "react-bootstrap/";
import PropTypes from "prop-types";
import '../components/gameStyle.css'

function Game({ meme, captions, selectedCaption, handleCaptionClick, remainingTime, roundNumber, score, bestCaptions, isPaused, handleQuitGame, correct }) {

  const getButtonStyle = (captionId) => {
    if (isPaused && !correct) {
      return bestCaptions.some(bestCaption => bestCaption.id === captionId) ? 'green-button' : 'red-button';
    }
    if (correct)
      return selectedCaption.id === captionId ? 'green-button' : 'disabled-button';
    return '';
  }

  const timerDisplay = ({ isPaused, correct, remainingTime }) => {
  
    if(!isPaused){
      return (<h2>
              <img src="/icons/clock-solid.svg" alt="Trophy" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
              {Math.floor(remainingTime)} seconds
            </h2>);
    }
    else{
      if(selectedCaption !== null && correct){
        return (<div className="justify-content-center text-align-center">
                  <h2>
                    <img src="/icons/check-solid.svg" alt="Check" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                    Correct!
                  </h2>
                </div>);
      }else{
        if(selectedCaption !== null && !correct){
        return (<div className="justify-content-center text-align-center">
                  <h2>
                    <img src="/icons/xmark-solid.svg" alt="Clock" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                    Incorrect!
                  </h2>
                </div>);
        }
        else{
          return (<div className="justify-content-center text-align-center">
                    <h2>
                      <img src="/icons/clock-rotate-left-solid.svg" alt="Times" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                      Time expired!
                    </h2>
                  </div>);
        }
      }
    }
  }

  return (
    <div>
    <Container fluid className="p-0">
      <Row className="justify-content-center align-items-center m-0" style={{ minHeight: '100vh' }}>
        <Col md={7} className="p-5 mb-5">
          <div>
            <Card className="p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingLeft: '20px', maxWidth: '1000px' , maxHeight: '90vh'}}>
              <Card.Body style={{ maxHeight: '800vh', overflowY: 'auto' }}>
                {!isPaused &&
                  <button
                      onClick={handleQuitGame} 
                      style={{ position: 'absolute', top: '10px', left: '10px', background: 'none', border: 'none', padding: 0 }}
                    >
                    <img 
                      src="/icons/circle-xmark-solid.svg" 
                      alt="Quit" 
                      style={{ width: '40px', height: '40px' }} 
                    />
                  </button>
                }
                  <div>
                    <Row>
                      <Col className="d-flex justify-content-center">
                        <div className="justify-content-center primary-font-fredoka text-align-center">
                          <h1 className="primary-font-luckiest">Meme Game - Round {roundNumber}</h1>
                          <div className="d-flex justify-content-center primary-font-fredoka">
                            {timerDisplay({ isPaused, correct, remainingTime })}
                          </div>
                          <Row>
                            <Col className="d-flex justify-content-center"> 
                              <div>
                                <h2 className="primary-font-luckiest">
                                  <img src="/icons/trophy-solid.svg" alt="Trophy" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                                  {score}
                                </h2>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Row>
                    <Col md={6} className="d-flex justify-contente-center text-align-center">
                      <img src={"/images/" + meme + ".PNG"} alt="Meme" style={{ maxWidth: '100%', height: 'auto' }} />
                    </Col>
                    <Col md={6}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-center', alignItems: 'flex-center' }}>
                        <div>
                          {captions.map((caption) => (
                            <div key={caption.id}>
                              <Button
                                  onClick={() => handleCaptionClick(caption)}
                                  disabled={selectedCaption !== null || remainingTime <= 0}
                                  style={{ marginBottom: '10px', width: '100%', justifyContent: 'center', textAlign: 'center' }}
                                  className={getButtonStyle(caption.id)}
                                >
                                  {caption.text}
                                </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                  </Row>

                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );

}

Game.propTypes = {
    meme: PropTypes.string,
    captions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })),
    selectedCaption: PropTypes.object, // Adjust this based on the actual shape of selectedCaption
    handleCaptionClick: PropTypes.func.isRequired,
    remainingTime: PropTypes.number.isRequired, // Define remainingTime as a number
    roundNumber: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    bestCaptions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })),
    isPaused: PropTypes.bool.isRequired,
    handleQuitGame: PropTypes.func.isRequired,
    correct: PropTypes.bool.isRequired,
};

export default Game;