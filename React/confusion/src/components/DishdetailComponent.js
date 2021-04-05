import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Control, LocalForm, Errors} from 'react-redux-form';

const minLength = (len) => (val) => val && val.length >= len;
const maxLength = (len) => (val) => !(val) || (val.length <= len);

    function RenderDish({dish}) {
        if (dish != null)
            return(
                <Card>
                    <CardImg top src={dish.image} alt={dish.name} />
                    <CardBody>
                      <CardTitle>{dish.name}</CardTitle>
                      <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            );
        else
            return(
                <div></div>
            );
    }

    function RenderComments({comments, addComment, dishId}) {
            if(comments != null)
                return(
                    <div>
                        <h4>Comments</h4>
                        <ul className="list-unstyled">
                            {comments.map((commentItem) => {
                                    return(
                                        <div key={commentItem.id}>
                                                <li><p>{commentItem.comment}</p>
                                                <p>
                                                <span>-- </span>
                                                {commentItem.author}
                                                <span>,</span>
                                                {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(commentItem.date)))}
                                                </p>
                                                </li>
                                        </div>
                                    )
                                }
                            )
                            }
                        </ul>
                        <CommentForm dishId={dishId} addComment={addComment}/>
                    </div>
                );
            else
                return(<div></div>);      
    };
    
    class CommentForm extends Component{
        constructor(props){
            super(props);
            this.state = {
                isModalOpen: false
            }
            this.toggleModal = this.toggleModal.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }
        toggleModal(){
            this.setState({
                isModalOpen: !this.state.isModalOpen
            })
        }
        handleSubmit = (values) => {
            this.toggleModal();
            this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
        }
        render(){
            return(
                <div>
                    <Button outline color="secondary" onClick={this.toggleModal} className="mb-2">
                        <span className="fa fa-pencil"></span> {' '} 
                        Submit Comment
                    </Button>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="rating">Rating</Label>
                                    <Control.select model=".rating" id="rating" name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="name">Your Name</Label>
                                    <Control.text model=".name" id="name" name="name" className="form-control"
                                    validators={{
                                        minLength: minLength(3),
                                        maxLength: maxLength(15)
                                    }
                                    }></Control.text>
                                    <Errors 
                                    className="text-danger"
                                    model=".name"
                                    show="touched"
                                    messages={
                                        {
                                            minLength: "Must be greater than 2 characters",
                                            maxLength: 'Must be 15 characters or less'
                                        }
                                    }></Errors>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Control.textarea model=".comment" id="comment" name="comment" className="form-control" rows="6"></Control.textarea>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Button type="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
            );
        };
    }

  const DishDetail = (props) => {
      if(props.dish != null){
        return (
            <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>                
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments}
                    addComment={props.addComment}
                    dishId={props.dish.id} />
                </div>
            </div>
            </div>
        );
      }
      else
        return(<div></div>);
  }

export default DishDetail;