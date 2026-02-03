const bcrypt = require('bcrypt')

const users = {
  "thomas": "qwe123",
  "linus": "0703",
  "thor.henning@wegener.no": "789asd",
  "Farmor": "Linusloppa17"
}

const generateSQL = async () => {
  for (const [username, plainPassword] of Object.entries(users)) {
    const hash = await bcrypt.hash(plainPassword, 10)
    const role = username === 'thomas' ? 'admin' : 'elev'
    
    // Use the username as email if it contains @, else fake one
    const email = username.includes('@') ? username : `${username}@mattebok.local`

    console.log(
      `INSERT INTO users (email, username, password_hash, role) VALUES ('${email}', '${username}', '${hash}', '${role}');`
    )
  }
}

generateSQL()