import { GET_ERRORS, SET_CURRENT_USER } from './Types'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

//Register user
export const registerUser=(userData,history)=>dispatch=>{
     axios.post('/routes/api/users/register',userData)
       .then(res=>history.push('/login'))
       .catch(err=>dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      }))
}

//login - Get user token
export const loginUser=(userData)=>dispatch=>{
  axios.post('/routes/api/users/login',userData)
  .then(res=>{
       //save to localStorage
       const {token}=res.data
       //set token to localStorage
       localStorage.setItem('jwtToken',token)
       //set token to auth header
       setAuthToken(token)
      //decode token to get user data
      const decoded=jwt_decode(token)
      //set currebt user
      dispatch(setCurrentUser(decoded))
  })
  .catch(err=>dispatch({
    type:GET_ERRORS,
    payload:err.response.data
  }))
}

//set logged in user
export const setCurrentUser=(decoded)=>{
  return {
    type:SET_CURRENT_USER,
    payload:decoded
  }
}


//log user out
export const logoutUser=()=>dispatch=>{
  //Remove token from localStorage
  localStorage.removeItem('jwtToken')
  //remove auth header for future requests
  setAuthToken(false)
  //set current user to an empty object {} which will set isAuthenticated to false 
  dispatch(setCurrentUser({}))
}
