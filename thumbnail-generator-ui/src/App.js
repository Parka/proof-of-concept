import React, {useEffect, useState} from 'react'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import {useDropzone} from 'react-dropzone'
import './App.css';

function App() {
  const [file, setFile] = useState({});
  const [loading, setLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState([])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    multiple: false,
    accept: ['image/png', 'image/jpeg'],
    maxSize: 5000000,
    onDrop: async ([selected]) => {
      if(!selected) return;
      setFile(Object.assign(selected, {
        preview: URL.createObjectURL(selected)
      }));

      setLoading(true);
      const fd = new FormData();
      fd.append('image', selected);
      const response = await fetch(process.env.REACT_APP_API_ENDPOINT,{
        method: 'POST',
        body: fd,
      });
      const result = await response.json();
      setLoading(false);
      setThumbnails(result.thumbnails);
    }
  });

  useEffect(() => () => {
    URL.revokeObjectURL(file.preview);
  }, [file]);

  return (
    <Container maxWidth="md">
      <Box
        component={Paper}
        elevation={3}
        height={300}
        borderColor={isDragActive?"secondary.main":"black"}
        border={isDragActive?"2px solid":"0px solid"}
        boxSizing="border-box"
        marginBottom={4}
      >
      {file.preview
        ?
          <div
            key={file.name}
            style={{
              backgroundImage: `url(${file.preview})`,
              backgroundPosition: '50% 50%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              height: '100%',
            }}
          />
        :
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={4}
          fontSize={{xs:'subtitle2.fontSize', sm:'subtitle1.fontSize', md:'h5.fontSize'}}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Box textAlign='center'>Click to select an image or just drop it here</Box>
        </Box>
      }
      </Box>
      {loading &&
        <Box display="flex" justifyContent="center" alignItems="center" m={6}>
          <CircularProgress />
        </Box>
      }

      <Grid component='aside' container spacing={4}>
        {!!thumbnails.length &&
          <Box component={Grid} container borderColor='primary.dark' borderTop={1} pt={3} mt={3}>
            <Typography variant='h3' color='primary'>Thumbnails</Typography>
          </Box>
        }
        {thumbnails.map(({url, width, height}) => (
          <Grid key={url} item xs={12} sm={6} md={4}>
            <Card component={Box}>
              <CardActionArea component='a' href={url} target='_blank'>
                <Box component={CardMedia} minHeight={200}
                  image={url}
                />
                <CardContent>{width}x{height}</CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
