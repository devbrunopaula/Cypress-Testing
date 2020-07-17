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

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid red',
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
  const [checked, setChecked] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [data, setData] = useState([])
  const [inputValue, setInputValue] = useState({
    name: '',
    email: '',
    password: '',
    terms: false,
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    terms: '',
  })

  const classes = useStyles()

  // Form Validation

  const formSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required.'),
    email: Yup.string().email('Must be a valid email address.').required('Must include email address.'),
    password: Yup.string().min(6, 'Passwords must be at least 6 characters long.').required('Password is Required'),
    terms: Yup.boolean().oneOf([true], 'You must accept Terms and Conditions'),
    // required isn't required for checkboxes.
  })

  // UseEffect
  useEffect(() => {
    console.log(errors)
    formSchema.isValid(inputValue).then((valid) => {
      setButtonDisabled(!valid)
      console.log('isValid', valid)
    })
  }, [inputValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(inputValue)
    axios
      .post('https://reqres.in/api/users', inputValue)
      .then((res) => {
        console.log(res.data)
        setData([...data, res.data])
      })
      .catch((err) => console.log(err))
  }

  const handleChange = (e) => {
    e.persist()

    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    Yup.reach(formSchema, e.target.name)
      //we can then run validate using the value
      .validate(e.target.value)
      // if the validation is successful, we can clear the error message
      .then((valid) => {
        setErrors({
          ...errors,
          [e.target.name]: '',
        })
      })
      /* if the validation is unsuccessful, we can set the error message to the message 
    returned from yup (that we created in our schema) */
      .catch((err) => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0],
        })
      })
    const filledValue = { ...inputValue, [e.target.name]: value }
    setInputValue(filledValue)
  }

  // CONSOLE DEBUG BLOCK
  console.log()
  // ********************

  return (
    <div className={classes.root} lg={12}>
      <Grid item lg={12} className={classes.test}>
        <form className={classes.inputContainer} autoComplete='off' onSubmit={handleSubmit}>
          <TextField className={classes.testFields} id='name' name='name' label='Name' fullWidth onChange={handleChange} helperText={errors.name} />
          <TextField
            className={classes.testFields}
            id='email'
            name='email'
            type='email'
            label='Email'
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
            fullWidth
            onChange={handleChange}
            helperText={errors.password}
          />
          <Checkbox id='terms' name='terms' type='checkbox' color='primary' onChange={handleChange} />

          <Button variant='contained' disabled={buttonDisabled} color='primary' type='submit'>
            Submit
          </Button>
        </form>
        {data.length > 0 ? (
          <Container className={classes.users}>
            <UsersTable data={data} />{' '}
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
