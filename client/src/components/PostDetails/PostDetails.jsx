import React, { useEffect, useMemo } from 'react';
import { CircularProgress, Divider, Paper, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';

import useStyles from './styles';
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';

const PostDetails = () => {
  const dispatch = useDispatch();
  const { post, posts, isLoading } = useSelector((state) => state.postsData);
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post) {
      document.title = 'Memories - ' + post.title;
    } else {
      document.title = 'Memories';
    }
  }, [post]);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [dispatch, post]);

  const recommendedPosts = useMemo(() => {
    if (post && posts.length) {
      return posts.filter(({ _id }) => _id !== post._id);
    }
  }, [post, posts]);

  const openPost = (postId) => history.push(`/posts/${postId}`);

  if (isLoading) {
    return (<Paper elevation={6} className={classes.loadingPaper}>
      <CircularProgress size={100} />
    </Paper>);
  }

  if (!post) {
    return null;
  }

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.creatorName}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={ post } />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
      { (recommendedPosts.length > 0)
        ? (<div className={classes.section}>
          <Typography gutterBottom variant='h5'>You might also like:</Typography>
          <Divider style={{ marginBottom: '1rem' }} />
          <div className={classes.recommendedPosts}>
            { recommendedPosts.map(({ title, name, likes, selectedFile, _id }) => (
              <div style={{ cursor: 'pointer' }} onClick={() => openPost(_id)} key={_id}>
                <Typography gutterBottom variant='h6'>{title}</Typography>
                <Typography gutterBottom variant='subtitle2'>{name}</Typography>
                <img src={selectedFile} height='150px' alt={title} style={{ borderRadius: '1rem' }} />
                <Typography gutterBottom variant='subtitle1'>Likes: {likes.length}</Typography>
              </div>
            )) }
          </div>
        </div>)
        : null }
    </Paper>
  );
};

export default PostDetails;
