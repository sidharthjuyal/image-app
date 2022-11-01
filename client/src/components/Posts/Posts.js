import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, CircularProgress, Typography } from '@material-ui/core';

import Post from './Post/Post';
import useStyles from './styles';

const Posts = ({ setCurrentId }) => {
  const classes = useStyles();
  const { isLoading, posts } = useSelector((state) => state.postsData);

  if (!isLoading && posts.length === 0) {
    return (<Grid container justifyContent='center'>
      <Typography variant='h6' color='white'>No memories available</Typography>
    </Grid>);
  }
  
  return (
    isLoading
      ? (<Grid container justifyContent='center'>
        <CircularProgress size={100} />
      </Grid>)
      : (<Grid container className={classes.container} alignItems='stretch' spacing={3}>
        {posts.map((post) => (
          <Grid key={post._id} item xs={12} sm={12} md={6} lg={4} xl={3}>
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>)
  );
};

export default Posts;
