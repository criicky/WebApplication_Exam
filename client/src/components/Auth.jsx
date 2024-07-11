import { useState } from 'react';
import { Alert, Button, Col, Form, Row, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import 'bootstrap/dist/css/bootstrap.min.css';


function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials)
      .then ( () => navigate( "/home" ) )
      .catch( (err) => {
        if(err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else
          setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
    <div>
      <Container fluid className="p-0">
      <Row className="justify-content-center align-items-center m-0" style={{ minHeight: '100vh' }}>
        <Col md={4} className="p-5 mb-5">
          <div className="ml-5 mb-5 p-5">
      <Card className="p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', paddingLeft: '20px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4 primary-font-baloo" >Login</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger"
          >
            {errorMessage}
          </Alert>
          <Form.Group className="mb-4 primary-font-baloo" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              value={username}
              placeholder="Example: username"
              onChange={(ev) => setUsername(ev.target.value)}
              required
              className="col-md-6"
              autoComplete="username"
            />
          </Form.Group>
          <Form.Group className="mb-4 primary-font-baloo" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Enter the password"
              onChange={(ev) => setPassword(ev.target.value)}
              required
              minLength={6}
              className="col-md-6"
              autoComplete="current-password"
            />
          </Form.Group>
          <Row>
            <Col className="d-flex justify-content-center">
              <Button type="submit" className='mt-1'>
                <i className="bi bi-box-arrow-in-right me-2 primary-font-baloo"></i> Login
              </Button>
            </Col>
          </Row>
          <Row className="d-flex justify-content-between mx-1 mb-4">
            <Col className="text-end">
              <p className="text-center mt-3 primary-font-baloo">Don&#39;t have an account? <Button variant="link" onClick={() => navigate("/registration")}>Register here</Button></p>
            </Col>
          </Row>
          <div className="text-center">
            <Row className="d-flex justify-content-center">
              <Col className="d-flex justify-content-center">
                <Button onClick={() => props.playAnonymously("Anonymous") } variant="link" style={{ color: '#1266f1' }}>
                <i className="bi bi-play-circle me-2 secondary-font-open-sans"></i> Play anonymously
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
        </Card.Body>
      </Card>
      </div>
      </Col>
      </Row>
      </Container>
    </div>
  )
}


LoginForm.propTypes = {
  login: PropTypes.func,
  playAnonymously: PropTypes.func,
  startGame: PropTypes.func
}

export { LoginForm };
