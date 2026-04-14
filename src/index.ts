import { Hono } from 'hono';
import { use } from 'hono/jsx';

const app = new Hono()

type User={
  id: string;
  name: string;
  email: string;
  password: string;
}
const Users:User[] = [];

app.get('/', (c) => {
  return c.text('Hello Hono!');
})

app.get('/Users', (c) => {
  if(!Users){
    return c.text("No Users Found!")
  }
  const TempUsers = Users.map(User => {return{id: User.id ,name:User.name,email:User.email}})
  return c.json(TempUsers)
})

app.get('/User/:id', (c) => {
  const id = c.req.param('id')
  const FilterdUser = Users.filter(user => user.id === id)
  if(FilterdUser.length === 0){
    return c.text(`User not found With id: ${id}`, 404)
  }
  const cleanedUser = FilterdUser.map(FilterdUser =>{return{id: FilterdUser.id ,name:FilterdUser.name,email:FilterdUser.email}})
  return c.json(cleanedUser)
})

app.post('/signup', async(c) =>{
  try{
    const body = await c.req.json()
    const {name,email,password} = body
    //Check Input Validation
    if(!name||!email||!password){
      return c.json({
        error:'Missing required fields'
      },404)
    }
    const RegisterdUserName = Users.filter(user => user.name === name)
    if(!(RegisterdUserName.length === 0)){
      return c.json({
        error:'User aleady used'
      },409)
    }
    const RegisterdUserEmail = Users.filter(user => user.email === email)
    if(!(RegisterdUserEmail.length === 0)){
      return c.json({
        error:'Email aleady used'
      },409)
    }
    if(password.length < 8){
      return c.json({
        error:'Password must be at least 8 characters long'
      },400)
    }
    //Sign User After Valudation
    const NewUserID = (Math.floor(Math.random()*900)+100).toString()
    const newUser:User = {
      id:NewUserID,
      name:name,
      email:email,
      password:password
    }
    Users.push(newUser)
    return c.json({
      message:`User created successfully, With User Name: ${name},id: ${NewUserID}`
    })
  }catch(err){
    return c.json({
      error:'Invalid JSON playload'
    },400)
  }

})

app.post('/signin', async(c) =>{
  try{
    const body = await c.req.json()
    const {email,password} = body
    const user = Users.find(u => u.email === email)
    if(!user||user.password !== password){
      return c.json({
        error:'Invalid email or password'
      },401)
    }
    return c.json({
      message:'Login Successfull',
      user:{id:user.id,name:user.name,email:user.email}
    })
  }catch(err){
    return c.json({
      error:'Invalid JSON playload'
    },400)
  }

})

export default app
