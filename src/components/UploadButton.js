import { Button } from '@material-ui/core';
import React from 'react';

const UploadButton = (props) => {
  return (
    <div className="App">
      <label htmlFor="upload-photo">
        <input
          style={{ display: 'none' }}
          id="upload-photo"
          name="upload-photo"
          type="file"
          {...props}
        />
        <Button color="secondary" variant="contained" component="span">
          Adicionar imagem
        </Button>
      </label>
    </div>
  );
};

export default UploadButton;
