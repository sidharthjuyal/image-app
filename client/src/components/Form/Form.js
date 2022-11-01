import React, { useEffect, useState, useMemo } from 'react';
import { Button, Paper, TextField, Typography } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';
import { getUserDataFromToken, isValidTextValue } from '../../utilities';
import { useHistory } from 'react-router-dom';

const initialPostData = {
  title: '',
  message: '',
  tags: '',
  selectedFile: '',
};

const Form = ({ setCurrentId, currentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const post = useSelector((state) => currentId ? state.postsData.posts.find((p) => p._id === currentId) : null);
  const [postData, setPostData] = useState(initialPostData);

  useEffect(() => {
    if (post) {
      const p = { ...post };
      p.tags = post?.tags?.join(', ') ?? '';
      setPostData(p);
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = { ...postData };
    post.tags = postData?.tags?.split(',')?.map(tag => tag.trim())?.filter(tag => tag?.length > 0) ?? [];
    post.creatorName = getUserDataFromToken()?.name;
    if (currentId) {
      dispatch(updatePost(currentId, post));
    } else {
      dispatch(createPost(post, history));
    }
    handleClear();
  };

  const handleClear = () => {
    setCurrentId(null);
    setPostData(initialPostData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const isButtonEnabled = useMemo(() => {
    return isValidTextValue(postData.title) || isValidTextValue(postData.message) || isValidTextValue(postData.tags);
  }, [postData.message, postData.tags, postData.title]);

  if (!getUserDataFromToken()?.name) {
    return (<Paper className={classes.paper}>
      <Typography variant='h6' align='center'>
        Please sign in to create your own memories and like other users' memories.
      </Typography>
    </Paper>);
  }
  
  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant='h6'>
          { currentId ? 'Editing' : 'Creating' } a Memory
        </Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={handleChange}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          value={postData.message}
          onChange={handleChange}
          multiline
          minRows={3}
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags"
          fullWidth
          value={postData.tags}
          onChange={handleChange}
          helperText="Comma ',' separated"
        />
        <div className={classes.fileInput}>
          <FileBase
            type='file'
            multiple={false}
            onDone={({ base64 }) => setPostData((current) => ({
              ...current,
              selectedFile: base64
            }))}
          />
        </div>
        <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth disabled={!isButtonEnabled}>
          Submit
        </Button>
        <Button variant='contained' color='secondary' size='small' onClick={handleClear} fullWidth disabled={!isButtonEnabled}>
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
