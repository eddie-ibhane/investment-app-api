import jwt from 'jsonwebtoken'

const generateToken = (res, id) => {
  const token = jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '10m'
  })

  res.cookie('jwt_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 10 * 60 * 1000
  })
}

export default generateToken