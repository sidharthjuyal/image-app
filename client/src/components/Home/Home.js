import React, { useEffect, useState } from 'react';
import { AppBar, Container, Grow, Grid, Paper, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { getPostsBySearch } from '../../actions/posts';
import Form from '../Form/Form';
import Posts from '../Posts/Posts';
import Paginate from '../Paginate/Paginate';
import useStyles from './styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const initialSearchValue = (searchQueryParams) => {
  return (searchQueryParams && searchQueryParams !== 'none') ? searchQueryParams : '';
};

const initialTagsValue = (tagsSearchParams) => {
  return (tagsSearchParams?.trim()?.length) ? tagsSearchParams?.split(',') : [];
};

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQueryParams = query.get('searchQuery');
  const tagsSearchParams = query.get('tags');
  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState(initialSearchValue(searchQueryParams));
  const [tags, setTags] = useState(initialTagsValue(tagsSearchParams));

  useEffect(() => {
    document.title = 'Memories';
  }, []);

  useEffect(() => {
    const searchValue = initialSearchValue(searchQueryParams);
    const tagsValue = initialTagsValue(tagsSearchParams);
    if (searchValue.trim() || tagsValue.length > 0) {
      dispatch(getPostsBySearch({ search: searchValue, tags: tagsValue.join(',') }));
    }
  }, [dispatch, searchQueryParams, tagsSearchParams]);

  const searchPost = () => {
    if (search.trim() || tags.length > 0) {
      dispatch(getPostsBySearch({ search: search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    }
    else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleAddTag = (tag) => {
    setTags(current => ([...current, tag]));
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(current => current.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Grow in>
      <Container maxWidth='xl'>
        <Grid container className={classes.gridContainer} justifyContent='space-between' alignItems='stretch' spacing={3}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={ setCurrentId } />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position='static' color='inherit'>
              <TextField
                name='search'
                variant='outlined'
                label='Search Memories'
                onKeyPress={handleKeyPress}
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ChipInput
                style={{ margin: '10px 0' }}
                value={tags}
                variant='outlined'
                onAdd={handleAddTag}
                onDelete={handleDeleteTag}
                label="Search Tags"
              />
              <Button
                onClick={searchPost}
                className={classes.searchButton}
                color='primary'
                variant='contained'
                disabled={(tags.length === 0) && (search.length === 0)}
              >
                Search
              </Button>
            </AppBar>
            <Form setCurrentId={ setCurrentId } currentId={ currentId } />
            {(location.pathname !== '/posts/search') && <Paper className={classes.pagination} elevation={6}>
              <Paginate page={page} />
            </Paper>}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
