import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import useStyles from './styles';
import { getUserDataFromToken } from '../../utilities';
import { commentPost } from '../../actions/posts';

const CommentSection = ({ post }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState('');
  const user = getUserDataFromToken();
  const commentsRef = useRef();

  const handleClick = async () => {
    const finalComment = `${user.name}: ${comment}`;
    const newComments = await dispatch(commentPost(finalComment, post._id));
    setComments(newComments);
    setComment('');
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className={ classes.commentOuterContainer }>
        <div className={ classes.commentInnerContainer }>
          <Typography gutterBottom variant='h6'>
            Comments
          </Typography>
          { (comments.length)
            ? comments.map((comment, i) => (<Typography key={ i } gutterBottom variant='subtitle1'>
              <strong>{comment.split(': ')[0]}</strong>: {comment.split(':')[1]}
            </Typography>))
            : <Typography gutterBottom variant='subtitle1'>No comments yet</Typography> }
          <div ref={ commentsRef } />
        </div>
        { (user?.name) ? <div style={{ width: '70%' }}>
          <Typography gutterBottom variant='h6'>Write a comment</Typography>
          <TextField
            fullWidth
            rows={ 4 }
            variant='outlined'
            label='Comment'
            multiline
            value={ comment }
            onChange={ e => setComment(e.target.value) }
          />
          <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment} variant='contained' onClick={handleClick} color='primary'>
            Comment
          </Button>
        </div> : null }
      </div>
    </div>
  );
};

export default CommentSection;
