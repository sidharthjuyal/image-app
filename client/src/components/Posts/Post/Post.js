import React, { useMemo, useState } from 'react';
import { Button, ButtonBase, Card, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'

import useStyles from './styles';
import { deletePost, likePost } from '../../../actions/posts';
import { getUserDataFromToken } from '../../../utilities';

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = getUserDataFromToken();
  const [likes, setLikes] = useState(post?.likes);

  const hasUserLikedPost = likes.find((like) => like === (user?.id));

  const Likes = useMemo(() => {
    if (likes.length > 0) {
      return hasUserLikedPost
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }
    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likes, user?.id]);

  const isPostedByLoggedInUser = useMemo(() => {
    return (user?.id === post.creatorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.creatorId, user?.id]);

  const openPost = () => history.push(`/posts/${post._id}`);

  const handleLikeClick = async () => {
    dispatch(likePost(post._id));
    if (hasUserLikedPost) {
      setLikes(post.likes.filter((id) => id !== (user?.id)));
    } else {
      setLikes([ ...post.likes, user?.id ]);
    }
  };
  
  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        className={classes.cardAction}
        onClick={openPost}
      >
        <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
        <div className={classes.overlay}>
          <Typography variant='h6'>{post.creatorName}</Typography>
          <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
        </div>
        <div className={classes.details}>
          <Typography variant='body2' color='textSecondary'>{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>{post.message}</Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Button size="small" color='primary' onClick={handleLikeClick} disabled={!user?.id}>
          { Likes }
        </Button>
        {(isPostedByLoggedInUser)
          ? (<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
            <EditIcon style={{ cursor: 'pointer' }} fontSize='small' color='default' onClick={() => setCurrentId(post._id)} />
            <DeleteIcon style={{ cursor: 'pointer' }} fontSize='small' color='secondary' onClick={() => dispatch(deletePost(post._id))} />
          </div>)
          : null}
      </CardActions>
    </Card>
  );
};

export default Post;
