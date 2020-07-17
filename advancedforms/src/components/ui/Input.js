import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import UsersTable from '.././Forms/Table'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import * as Yup from 'yup'
import { Container } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    
    height: '100vh',
    width: '100vw',
    background: '#f2f2f2f2',
  },
  test: {
    border: '1px solid blue',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
  },
  inputContainer: {
    width: '20%',
    minWidth: '280px',
    margin: '0 auto',
    padding: '3rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    background: 'white',
    borderRadius: '2rem',
  },
  testFields: {
    padding: '2rem',
  },
  users: {
    marginTop: '2rem',
  },
}))


function InputForms() {

  const defaultInputs = {
    name: '',
    email: '',
    password: '',
    terms: false,
  }
 
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [data, setData] = useState([])
  const [inputValue, setInputValue] = useState(defaultInputs)
  const [errors, setErrors] = useState(defaultInputs)

  const classes = useStyles()

  // Form Validation

  let emailList = data.map(user => user.email)

  const formSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required.'),
    email: Yup.string().email('Must be a valid email address.').notOneOf(emailList, 'Email Already Taken!').required('Must include email address.'),
    password: Yup.string().min(6, 'Passwords must be at least 6 characters long.').required('Password is Required'),
    terms: Yup.boolean().oneOf([true], 'You must accept Terms and Conditions').required(),
    
  })

  // UseEffect
  useEffect(() => {
    
    formSchema.isValid(inputValue).then(valid => {
      setButtonDisabled(!valid)
      
    })
  }, [inputValue])

  const handleSubmit = e => {
    e.preventDefault()
    
    axios
      .post('https://reqres.in/api/users', inputValue)
      .then(res => {
        
        setData([...data, res.data])
        setInputValue(defaultInputs)
      })
      .catch(err => console.log(err))
  }

  const handleChange = e => {
    e.persist()

    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    Yup.reach(formSchema, e.target.name)
     
      .validate(e.target.value)
     
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: '',
        })
      })
      
      .catch(err => {
        
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0],
        })
      })
    
    setInputValue({ ...inputValue, [e.target.name]: value })
  }

  // CONSOLE DEBUG BLOCK

  // ********************

  return (
    <div className={classes.root} lg={12}>
      <Grid item lg={12} className={classes.test}>
        <form  id="contactForm" className={classes.inputContainer} autoComplete='off' onSubmit={handleSubmit}>
          <TextField className={classes.testFields} id='name' name='name' label='Name' value={inputValue.name} fullWidth onChange={handleChange} helperText={errors.name} />
          <TextField
            className={classes.testFields}
            id='email'
            name='email'
            type='email'
            label='Email'
            value={inputValue.email}
            fullWidth
            onChange={handleChange}
            helperText={errors.email}
          />
          <TextField
            className={classes.testFields}
            id='password'
            type='password'
            label='Password'
            name='password'
            value={inputValue.password}
            fullWidth
            onChange={handleChange}
            helperText={errors.password}
          />
          <Checkbox id='terms' name='terms' type='checkbox' color='primary'  value={inputValue.terms} onChange={handleChange} />
            {errors.terms ? <p>{errors.terms}</p> : ''}
          <Button id='formSubmitBtn' variant='contained' disabled={buttonDisabled} color='primary' type='submit'>
            Submit
          </Button>
        </form>
        {data.length > 0 ? (
          <Container className={classes.users}>
            <UsersTable data={data} />
          </Container>
        ) : (
          ''
        )}
      </Grid>

      {/* /> */}
    </div>
  )
}

export default InputForms
