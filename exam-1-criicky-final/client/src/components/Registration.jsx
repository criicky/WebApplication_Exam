import { useState } from 'react';
import { Alert, Button, Col, Form, Row, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";

function RegisterForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShow(true);
      return;
    }
    const credentials = { username, name, surname, password };

    props.handleRegistration(credentials)
        .then(() => navigate("/home"))
        .catch((err) => {
        setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
    <div>
      <Container fluid className="p-0">
      <Row className="justify-content-center align-items-center m-0" style={{ minHeight: '100vh' }}>
        <Col md={4} className="p-5 mb-5">
          <Card className='my-card' style={{backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
            <Card.Body>
              <Row>
                <Col className='d-flex justify-content-center primary-font-baloo'>
              <Card.Title>Register to Play!</Card.Title>
              </Col>
              </Row>
              <Form  onSubmit={handleSubmit}>
                <Alert dismissible show={show} onClose={() => setShow(false)} variant="danger">
                  {errorMessage}
                </Alert>
                <Form.Group className='mt-3 primary-font-baloo' controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    placeholder="Enter username"
                    onChange={(ev) => setUsername(ev.target.value)}
                    required
                    autoComplete="username"
                  />
                </Form.Group>
                <Form.Group className='mt-3 primary-font-baloo' controlId="name">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    placeholder="Enter your first name"
                    onChange={(ev) => setName(ev.target.value)}
                    required
                    autoComplete='name'
                  />
                </Form.Group>
                <Form.Group className='mt-3 primary-font-baloo' controlId="surname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    type="text"
                    value={surname}
                    placeholder="Enter your surname"
                    onChange={(ev) => setSurname(ev.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className='mt-3 primary-font-baloo' controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    placeholder="Enter password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    required
                    minLength={6}
                  />
                </Form.Group>
                <Form.Group className='mt-3 primary-font-baloo' controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm your password"
                    onChange={(ev) => setConfirmPassword(ev.target.value)}
                    required
                    minLength={6}
                  />
                </Form.Group>
                <Row>
                <Col className="d-flex justify-content-center mt-3">
                <Button type="submit" className='mt-3'>
                  <i className="bi bi-box-arrow-in-right me-2 primary-font-baloo"></i> Register
                </Button>
                </Col>
                </Row>
              </Form>
              <p className="text-center mt-3 primary-font-baloo">Already have an account? <Button variant="link" onClick={() => navigate('/login')}>Login here</Button></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

RegisterForm.propTypes = {
  handleRegistration: PropTypes.func.isRequired,
};

export default RegisterForm;
