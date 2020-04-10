import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom"
import propTypes from "prop-types";
import PostItem from "../posts/PostItem";
import CommentForm from './CommentForm'
import Spinner from "../common/Spinner";
import CommentFeed from './CommentFeed'
import { getPost } from "../../actions/postActions";

class Post extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
  }
  render() {
    const { post, loading } = this.props.post;
    let postConent;
    if (post === null || loading || Object.keys(post).length === 0) {
      postConent = <Spinner />;
    } else {
      postConent = (
        <div>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id}/>
          <CommentFeed postId={post._id} comments={post.comments}/> 
        </div>
      );
    }
    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
                <Link to="/feed" className="btn btn-light mb-3" >
                    Back To Feed
                </Link>
                {postConent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  getPost: propTypes.func.isRequired,
  post: propTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  post: state.post,
});
export default connect(mapStateToProps, { getPost })(Post);
