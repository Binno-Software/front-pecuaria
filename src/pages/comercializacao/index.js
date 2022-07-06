import React, { useState } from 'react';
import {
  Container,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import SelecaoAnimal from './steps/selecao-animal';
import api from 'src/service/api';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

function getSteps() {
  return ['Crie ou selecione um processo ativo', 'Escolha os animais', 'Envie para comercialização'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Crie ou selecione um processo ativo';
    case 1:
      return 'Escolha os animais';
    case 2:
      return 'Envie para comercialização';
    default:
      return 'Unknown step';
  }
}

const Comercializacao = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const seEstaFinalizandoConfirmarProcesso = (activeStep, steps) => {
    if (activeStep === 2 && steps === 3) {
      api.post('comercializacao/confirmar').then(() => {
        alert('processo enviado')
      })
    }
  }

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    seEstaFinalizandoConfirmarProcesso(activeStep, steps.length)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  return (
    <Page
      className={classes.root}
      title="Comercialização"
    >
      <Container maxWidth={false}>
        <div className={classes.root}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption">Optional</Typography>;
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div>
                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Voltar
                  </Button>
                  {isStepOptional(activeStep) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSkip}
                      className={classes.button}
                    >
                      Skip
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finalizar' : 'Proximo'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {
          activeStep === 1 && (
            <SelecaoAnimal />
          )
        }
      </Container>
    </Page>
  );
};

export default Comercializacao;
